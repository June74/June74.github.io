import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(import.meta.dirname, '..');
const siteDir = path.join(root, 'site');
const readSite = (name) => readFile(path.join(siteDir, name), 'utf8');
const cspPolicy = "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-src 'none'; media-src 'none'; worker-src 'none'; manifest-src 'none'";
const urlAttributeNames = new Set([
  'action', 'archive', 'attributionsrc', 'background', 'cite', 'classid', 'code', 'codebase', 'data',
  'datasrc', 'dynsrc', 'formaction', 'href', 'icon', 'imagesrcset', 'itemid', 'longdesc', 'lowsrc',
  'manifest', 'ping', 'poster', 'profile', 'src', 'srcset', 'usemap', 'xlink:href', 'xml:base',
]);
const urlListAttributeNames = new Set(['archive', 'attributionsrc', 'ping']);
const allowedLocalUrls = new Set(['assets/favicon.svg', 'styles.css', 'script.js']);
const approvedColorProperties = new Map([
  ['paper', '#f1eee6'],
  ['panel', '#e2e6dc'],
  ['ink', '#18201c'],
  ['forest', '#356351'],
  ['copper', '#b86f4b'],
  ['slate', '#718999'],
  ['rule', '#b2b2a9'],
]);

function parseAttributes(source) {
  const attributes = [];
  const attributePattern = /([^\s"'=<>`/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  for (const match of source.matchAll(attributePattern)) {
    attributes.push({
      name: match[1].toLowerCase(),
      value: match[2] ?? match[3] ?? match[4] ?? null,
    });
  }
  return attributes;
}

function parseStartTags(html) {
  const tags = [];
  let position = 0;

  while (position < html.length) {
    const opening = html.indexOf('<', position);
    if (opening === -1) break;
    if (html.startsWith('<!--', opening)) {
      const closing = html.indexOf('-->', opening + 4);
      position = closing === -1 ? html.length : closing + 3;
      continue;
    }

    const tagMatch = html.slice(opening).match(/^<([A-Za-z][\w:-]*)/);
    if (!tagMatch) {
      position = opening + 1;
      continue;
    }

    const attributesStart = opening + tagMatch[0].length;
    let cursor = attributesStart;
    let quote = null;
    while (cursor < html.length) {
      const character = html[cursor];
      if (quote) {
        if (character === quote) quote = null;
      } else if (character === '"' || character === "'") {
        quote = character;
      } else if (character === '>') {
        break;
      }
      cursor += 1;
    }
    assert.ok(cursor < html.length, `unterminated <${tagMatch[1]}> tag`);
    tags.push({
      name: tagMatch[1].toLowerCase(),
      attributes: parseAttributes(html.slice(attributesStart, cursor)),
    });
    position = cursor + 1;
  }
  return tags;
}

function attributeValues(tag, name) {
  return tag.attributes.filter((attribute) => attribute.name === name).map((attribute) => attribute.value);
}

function decodedAttributeValues(tag, name) {
  return attributeValues(tag, name).map((value) => typeof value === 'string' ? decodeTextEntities(value) : value);
}

function singleAttribute(tag, name) {
  const values = attributeValues(tag, name);
  assert.equal(values.length, 1, `<${tag.name}> must have exactly one ${name} attribute`);
  assert.notEqual(values[0], null, `<${tag.name}> ${name} must have a value`);
  return values[0];
}

function singleDecodedAttribute(tag, name) {
  const values = decodedAttributeValues(tag, name);
  assert.equal(values.length, 1, `<${tag.name}> must have exactly one ${name} attribute`);
  assert.notEqual(values[0], null, `<${tag.name}> ${name} must have a value`);
  return values[0];
}

function assertApprovedMetadata(html) {
  const metadata = parseStartTags(html).filter((tag) => tag.name === 'meta');
  const cspMetadata = metadata.filter((tag) => attributeValues(tag, 'http-equiv').some((value) => value && decodeTextEntities(value).toLowerCase() === 'content-security-policy'));
  const referrerMetadata = metadata.filter((tag) => attributeValues(tag, 'name').some((value) => value && decodeTextEntities(value).toLowerCase() === 'referrer'));

  assert.equal(cspMetadata.length, 1, 'document must contain exactly one CSP meta tag');
  assert.equal(singleAttribute(cspMetadata[0], 'http-equiv'), 'Content-Security-Policy');
  assert.equal(singleAttribute(cspMetadata[0], 'content'), cspPolicy);
  assert.equal(referrerMetadata.length, 1, 'document must contain exactly one referrer meta tag');
  assert.equal(singleAttribute(referrerMetadata[0], 'name'), 'referrer');
  assert.equal(singleAttribute(referrerMetadata[0], 'content'), 'no-referrer');
}

function assertApprovedHeadElements(html) {
  assertApprovedMetadata(html);
  const tags = parseStartTags(html);
  const metadata = tags.filter((tag) => tag.name === 'meta');
  const counts = new Map([['charset', 0], ['content-security-policy', 0], ['referrer', 0], ['viewport', 0], ['description', 0]]);

  for (const tag of metadata) {
    const charsetValues = attributeValues(tag, 'charset');
    const httpEquivValues = attributeValues(tag, 'http-equiv').map((value) => value && decodeTextEntities(value).toLowerCase());
    const nameValues = attributeValues(tag, 'name').map((value) => value && decodeTextEntities(value).toLowerCase());
    const discriminatorCount = [charsetValues.length, httpEquivValues.length, nameValues.length].filter(Boolean).length;
    assert.equal(discriminatorCount, 1, 'each meta tag must have exactly one approved discriminator');

    if (charsetValues.length) {
      assert.deepEqual(new Set(tag.attributes.map((attribute) => attribute.name)), new Set(['charset']));
      assert.equal(singleAttribute(tag, 'charset').toLowerCase(), 'utf-8');
      counts.set('charset', counts.get('charset') + 1);
      continue;
    }

    if (httpEquivValues.length) {
      assert.notEqual(httpEquivValues[0], 'refresh', 'meta refresh is prohibited');
      assert.deepEqual(new Set(tag.attributes.map((attribute) => attribute.name)), new Set(['http-equiv', 'content']));
      assert.equal(httpEquivValues.length, 1);
      assert.equal(httpEquivValues[0], 'content-security-policy');
      assert.equal(singleAttribute(tag, 'content'), cspPolicy);
      counts.set('content-security-policy', counts.get('content-security-policy') + 1);
      continue;
    }

    assert.deepEqual(new Set(tag.attributes.map((attribute) => attribute.name)), new Set(['name', 'content']));
    assert.equal(nameValues.length, 1);
    assert.ok(['referrer', 'viewport', 'description'].includes(nameValues[0]), `unapproved meta name: ${nameValues[0]}`);
    const content = singleAttribute(tag, 'content');
    assert.ok(content.length > 0, `${nameValues[0]} metadata must not be empty`);
    if (nameValues[0] === 'referrer') assert.equal(content, 'no-referrer');
    counts.set(nameValues[0], counts.get(nameValues[0]) + 1);
  }
  for (const [kind, count] of counts) assert.equal(count, 1, `document must contain exactly one ${kind} meta tag`);

  const links = tags.filter((tag) => tag.name === 'link');
  assert.equal(links.length, 2, 'document must contain exactly the approved icon and stylesheet links');
  const linkKinds = [];
  for (const link of links) {
    const relation = singleAttribute(link, 'rel').toLowerCase();
    const href = singleAttribute(link, 'href');
    if (relation === 'icon') {
      assert.deepEqual(new Set(link.attributes.map((attribute) => attribute.name)), new Set(['rel', 'href', 'type']));
      assert.equal(href, 'assets/favicon.svg');
      assert.equal(singleAttribute(link, 'type'), 'image/svg+xml');
    } else {
      assert.equal(relation, 'stylesheet');
      assert.deepEqual(new Set(link.attributes.map((attribute) => attribute.name)), new Set(['rel', 'href']));
      assert.equal(href, 'styles.css');
    }
    linkKinds.push(relation);
  }
  assert.deepEqual(new Set(linkKinds), new Set(['icon', 'stylesheet']));
}

function assertAllowedUrl(value, tagName, attributeName) {
  const context = `<${tagName}> ${attributeName}`;
  assert.equal(typeof value, 'string', `${context} requires a value`);
  const decodedValue = decodeTextEntities(value);
  const isFragment = decodedValue.length > 1 && decodedValue.startsWith('#');
  const isApprovedLocalUrl = allowedLocalUrls.has(decodedValue);
  const isApprovedGitHubUrl = tagName === 'a' && attributeName === 'href' && decodedValue === 'https://github.com/June74';
  assert.ok(isFragment || isApprovedLocalUrl || isApprovedGitHubUrl, `${context} has unapproved URL: ${decodedValue}`);
}

function assertApprovedUrls(html) {
  for (const tag of parseStartTags(html)) {
    for (const attribute of tag.attributes) {
      const decodedValue = typeof attribute.value === 'string' ? decodeTextEntities(attribute.value) : attribute.value;
      if (attribute.name === 'srcset' || attribute.name === 'imagesrcset') {
        assert.equal(typeof decodedValue, 'string', `<${tag.name}> ${attribute.name} requires a value`);
        const candidates = decodedValue.split(',').map((candidate) => candidate.trim().split(/\s+/)[0]);
        assert.ok(candidates.length > 0 && candidates.every(Boolean), `<${tag.name}> has an empty ${attribute.name} candidate`);
        for (const candidate of candidates) assertAllowedUrl(candidate, tag.name, attribute.name);
      } else if (urlListAttributeNames.has(attribute.name)) {
        assert.equal(typeof decodedValue, 'string', `<${tag.name}> ${attribute.name} requires a value`);
        const urls = decodedValue.trim().split(/\s+/).filter(Boolean);
        assert.ok(urls.length > 0, `<${tag.name}> ${attribute.name} requires at least one URL`);
        for (const url of urls) assertAllowedUrl(url, tag.name, attribute.name);
      } else if (urlAttributeNames.has(attribute.name)) {
        assertAllowedUrl(decodedValue, tag.name, attribute.name);
      }

      if (typeof decodedValue === 'string') {
        for (const match of decodedValue.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^\s)]+))\s*\)/gi)) {
          assertAllowedUrl(match[1] ?? match[2] ?? match[3], tag.name, attribute.name);
        }
      }
    }
  }
}

function assertApprovedOutboundAnchors(html) {
  const outboundAnchors = parseStartTags(html).filter((tag) => tag.name === 'a' && decodedAttributeValues(tag, 'href').includes('https://github.com/June74'));
  assert.equal(outboundAnchors.length, 2);
  for (const anchor of outboundAnchors) {
    assert.equal(singleDecodedAttribute(anchor, 'href'), 'https://github.com/June74');
    assert.equal(singleDecodedAttribute(anchor, 'target'), '_blank');
    assert.deepEqual(new Set(singleDecodedAttribute(anchor, 'rel').split(/\s+/)), new Set(['noopener', 'noreferrer']));
  }
}

function assertStaticHtmlElements(html) {
  const prohibitedTags = new Set(['applet', 'base', 'embed', 'form', 'frame', 'frameset', 'iframe', 'object', 'style']);
  for (const tag of parseStartTags(html)) {
    assert.equal(prohibitedTags.has(tag.name), false, `<${tag.name}> is prohibited`);
    for (const attribute of tag.attributes) {
      assert.equal(attribute.name === 'style' || attribute.name.startsWith('on'), false, `<${tag.name}> ${attribute.name} is prohibited`);
    }
  }
}

const prohibitedScriptPatterns = [
  /\binnerHTML\b/i,
  /\binsertAdjacentHTML\b/i,
  /\beval\s*\(/i,
  /\b(?:localStorage|sessionStorage)\b/i,
  /\bfetch\s*\(/i,
  /\bXMLHttpRequest\s*\(/i,
  /\bWebSocket\s*\(/i,
  /\bEventSource\s*\(/i,
  /\bnavigator\s*\.\s*sendBeacon\s*\(/i,
  /\bimport\s*\(/i,
  /\bdocument\s*\.\s*write\s*\(/i,
  /\bcreateElement\s*\(\s*['"]script['"]\s*\)/i,
  /\b(?:window\s*\.\s*)?location(?:\s*\.\s*href)?\s*=/i,
  /\b(?:window\s*\.\s*)?location\s*\.\s*(?:assign|replace)\s*\(/i,
  /\bwindow\s*\.\s*open\s*\(/i,
  /\.\s*(?:href|src|action|formAction|poster|srcset)\s*=/i,
  /\bsetAttribute\s*\(\s*['"](?:href|src|action|formaction|poster|srcset|xlink:href)['"]/i,
  /\[\s*['"](?:href|src|action|formaction|poster|srcset|location)['"]\s*\]\s*=/i,
  /\[\s*['"](?:fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon|open)['"]\s*\]\s*\(/i,
  /\bnew\s+URL\s*\(/i,
];

function assertStaticScript(js) {
  for (const pattern of prohibitedScriptPatterns) assert.doesNotMatch(js, pattern);
}

const secretPatterns = [
  /-----BEGIN (?:[A-Z0-9 ]+ )?PRIVATE KEY-----/i,
  /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{20,}\b/,
  /\bgh[pousr]_[A-Za-z0-9]{20,}\b/,
  /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/,
  /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/,
  /\bAIza[0-9A-Za-z_-]{35}\b/,
  /(?:https?:)?\/\/[^/\s:@]+:[^/\s@]+@/i,
  /["']?(?:api[-_]?key|client[-_]?secret|access[-_]?token|auth[-_]?token|password|passwd|secret|token)["']?\s*[:=]\s*(?:"[^"]+"|'[^']+'|`[^`]+`|[^\s"'`,;}\]]+)/i,
];

function assertNoSecrets(source) {
  for (const pattern of secretPatterns) assert.doesNotMatch(source, pattern);
}

function assertNoPrivateEndpoints(source) {
  const privateEndpointPatterns = [
    /\b(?:localhost|0\.0\.0\.0|127(?:\.\d{1,3}){3})\b/i,
    /\b10(?:\.\d{1,3}){3}\b/,
    /\b192\.168(?:\.\d{1,3}){2}\b/,
    /\b172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2}\b/,
    /\[[0:]*1\]/,
    /\b[A-Za-z0-9.-]+\.(?:internal|local)\b/i,
  ];
  for (const pattern of privateEndpointPatterns) assert.doesNotMatch(source, pattern);
}

function assertApprovedRemoteUrls(file, source) {
  const urls = [...source.matchAll(/(?:(?:https?|wss?|s?ftp):)?\/\/[^\s"'<>`)\]}]+/gi)].map((match) => match[0]);
  for (const url of urls) {
    const isGitHubLink = file === 'index.html' && url === 'https://github.com/June74';
    const isSvgNamespace = file === 'assets/favicon.svg' && url === 'http://www.w3.org/2000/svg';
    assert.ok(isGitHubLink || isSvgNamespace, `${file} has unapproved remote URL: ${url}`);
  }
}

function assertApprovedColors(css) {
  const declarations = new Map();
  for (const match of css.matchAll(/--([a-z0-9_-]+)\s*:\s*([^;]+);/gi)) {
    const name = match[1].toLowerCase();
    assert.equal(declarations.has(name), false, `duplicate custom property --${match[1]}`);
    declarations.set(name, match[2].trim());
  }

  const approvedVariables = new Set([...approvedColorProperties.keys(), 'display', 'sans']);
  assert.deepEqual(new Set(declarations.keys()), approvedVariables);
  for (const [name, value] of approvedColorProperties) assert.equal(declarations.get(name)?.toLowerCase(), value);
  for (const match of css.matchAll(/var\(\s*--([a-z0-9_-]+)/gi)) {
    assert.ok(approvedVariables.has(match[1].toLowerCase()), `unapproved custom property use --${match[1]}`);
  }
}

function cssDeclarationsFor(css, selector) {
  for (const match of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selectors = match[1].split(',').map((candidate) => candidate.trim());
    if (selectors.includes(selector)) return match[2];
  }
  assert.fail(`missing CSS selector: ${selector}`);
}

function cssProperty(css, selector, property) {
  const declarations = cssDeclarationsFor(css, selector);
  const match = declarations.match(new RegExp(`(?:^|;)\\s*${property.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}\\s*:\\s*([^;]+)`, 'i'));
  assert.ok(match, `${selector} must declare ${property}`);
  return match[1].trim().toLowerCase();
}

function cssAtRuleBody(css, marker) {
  const markerIndex = css.indexOf(marker);
  assert.ok(markerIndex >= 0, `missing CSS at-rule: ${marker}`);
  const opening = css.indexOf('{', markerIndex + marker.length);
  assert.ok(opening >= 0, `${marker} must have a block`);
  let depth = 1;
  for (let index = opening + 1; index < css.length; index += 1) {
    if (css[index] === '{') depth += 1;
    if (css[index] === '}') depth -= 1;
    if (depth === 0) return css.slice(opening + 1, index);
  }
  assert.fail(`unterminated CSS at-rule: ${marker}`);
}

function resolveCssColor(value) {
  const variable = value.match(/^var\(--([a-z0-9_-]+)\)$/i);
  const resolved = variable ? approvedColorProperties.get(variable[1].toLowerCase()) : value;
  assert.match(resolved ?? '', /^#[0-9a-f]{6}$/i, `unsupported test color: ${value}`);
  return resolved;
}

function relativeLuminance(hex) {
  const channels = hex.slice(1).match(/.{2}/g).map((channel) => Number.parseInt(channel, 16) / 255);
  const linear = channels.map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  return (0.2126 * linear[0]) + (0.7152 * linear[1]) + (0.0722 * linear[2]);
}

function contrastRatio(foreground, background) {
  const foregroundLuminance = relativeLuminance(resolveCssColor(foreground));
  const backgroundLuminance = relativeLuminance(resolveCssColor(background));
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

function decodeTextEntities(source) {
  const named = { amp: '&', apos: "'", colon: ':', equals: '=', gt: '>', lt: '<', newline: '\n', nbsp: ' ', num: '#', period: '.', quest: '?', quot: '"', sol: '/', tab: '\t' };
  return source
    .replace(/&#x([0-9a-f]+);/gi, (_, value) => String.fromCodePoint(Number.parseInt(value, 16)))
    .replace(/&#([0-9]+);/g, (_, value) => String.fromCodePoint(Number.parseInt(value, 10)))
    .replace(/&(amp|apos|colon|equals|gt|lt|newline|nbsp|num|period|quest|quot|sol|tab);/gi, (_, name) => named[name.toLowerCase()]);
}

const draftMarkerPattern = /\b(?:TODO|TBD|FIXME)\b|lorem ipsum|example\.com|\bdraft(?: copy| content| text| implementation)?\b|\bplaceholder\b/i;

function extractCodeComments(source, includeLineComments) {
  const comments = [];
  let position = 0;
  let quote = null;
  while (position < source.length) {
    const character = source[position];
    const next = source[position + 1];
    if (quote) {
      if (character === '\\') position += 2;
      else {
        if (character === quote) quote = null;
        position += 1;
      }
    } else if (character === '"' || character === "'") {
      quote = character;
      position += 1;
    } else if (character === '/' && next === '*') {
      const closing = source.indexOf('*/', position + 2);
      comments.push(source.slice(position + 2, closing === -1 ? source.length : closing));
      position = closing === -1 ? source.length : closing + 2;
    } else if (includeLineComments && character === '/' && next === '/') {
      const closing = source.indexOf('\n', position + 2);
      comments.push(source.slice(position + 2, closing === -1 ? source.length : closing));
      position = closing === -1 ? source.length : closing + 1;
    } else {
      position += 1;
    }
  }
  return comments;
}

function assertNoDraftComments(file, source) {
  let comments;
  if (file.endsWith('.html') || file.endsWith('.svg')) {
    comments = [...source.matchAll(/<!--([\s\S]*?)-->/g)].map((match) => match[1]);
    if (file.endsWith('.html')) {
      for (const match of source.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) comments.push(...extractCodeComments(match[1], true));
      for (const match of source.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) comments.push(...extractCodeComments(match[1], false));
    }
  } else {
    comments = extractCodeComments(source, file.endsWith('.js'));
  }
  assert.doesNotMatch(decodeTextEntities(comments.join('\n')), draftMarkerPattern);
}

function assertNoDraftContent(html) {
  const renderedText = decodeTextEntities(html.replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]+>/g, ' '));
  assertNoDraftComments('index.html', html);
  assert.doesNotMatch(renderedText, draftMarkerPattern);

  for (const tag of parseStartTags(html)) {
    for (const attribute of tag.attributes) {
      assert.notEqual(attribute.name, 'placeholder', `<${tag.name}> has a placeholder attribute`);
      if (urlAttributeNames.has(attribute.name)) assert.notEqual(attribute.value, '#', `<${tag.name}> has a placeholder URL`);
    }
  }
}

async function listFiles(directory, prefix = '') {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const relative = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) files.push(...await listFiles(path.join(directory, entry.name), relative));
    else files.push(relative);
  }
  return files.sort();
}

function assertMmSampleContract(html, css) {
  const approvedSpending = [20, 35, 25, 90, 45, 55, 30];
  const approvedWeekdays = [['M', 28], ['T', 68], ['W', 108], ['T', 148], ['F', 188], ['S', 228], ['S', 271]];
  const figure = html.match(/<figure class="project-visual mm-visual"[\s\S]*?<\/figure>/);
  assert.ok(figure, 'MM figure is present');

  const dailyValues = figure[0].match(/<svg class="spending-chart" data-daily-spending="([\d ]+)"/);
  assert.ok(dailyValues, 'MM chart declares its seven daily spending values');
  const spending = dailyValues[1].trim().split(/\s+/).map(Number);
  assert.deepEqual(spending, approvedSpending, 'MM chart keeps the approved daily spending sequence');

  const weeklyTotal = figure[0].match(/This week · \$(\d+)/);
  const budget = figure[0].match(/Weekly plan: \$(\d+) · spent: \$(\d+)[\s\S]*?<strong>\$(\d+) remaining<\/strong>/);
  assert.ok(weeklyTotal, 'MM chart displays a weekly total');
  assert.ok(budget, 'MM chart displays plan, spent, and remaining amounts');
  const planned = Number(budget[1]);
  const spent = Number(budget[2]);
  const remaining = Number(budget[3]);
  const displayedTotal = Number(weeklyTotal[1]);
  assert.deepEqual([planned, displayedTotal, spent, remaining], [500, 300, 300, 200]);
  assert.equal(spending.reduce((total, value) => total + value, 0), spent);
  assert.equal(planned - spent, remaining);

  const weekdayLabels = [...figure[0].matchAll(/<text x="([\d.]+)" y="120">([MTWFS])<\/text>/g)]
    .map((match) => [match[2], Number(match[1])]);
  assert.deepEqual(weekdayLabels, approvedWeekdays, 'MM chart keeps the approved weekday positions');

  const path = figure[0].match(/<path class="spending-path" d="([^"]+)"/);
  assert.ok(path, 'MM chart has a spending path');
  const coordinates = [...path[1].matchAll(/[ML]\s*([\d.]+)\s+([\d.]+)/g)]
    .map((match) => [Number(match[1]), Number(match[2])]);
  assert.equal(coordinates.length, 7, 'MM chart has one path coordinate per day');
  assert.deepEqual(coordinates.map(([x]) => x), approvedWeekdays.map(([, x]) => x + 3));
  coordinates.forEach(([, y], index) => {
    const expectedY = 96 - spending[index] * 76 / 120;
    assert.ok(Math.abs(y - expectedY) <= 0.01, `MM day ${index + 1} y-coordinate matches $${spending[index]}`);
  });

  const highlightedPoints = [...figure[0].matchAll(/<circle class="chart-point" cx="([\d.]+)" cy="([\d.]+)" r="4"\/>/g)];
  assert.equal(highlightedPoints.length, 1, 'MM chart has one highlighted point');
  const highlightedPoint = highlightedPoints[0];
  assert.equal(approvedWeekdays[3][0], 'T');
  assert.equal(spending[3], 90);
  assert.deepEqual(highlightedPoint.slice(1).map(Number), [151, 39], 'Thursday $90 is highlighted at (151, 39)');
  assert.deepEqual(coordinates[3], [151, 39], 'highlight matches the Thursday path coordinate');

  const expectedFill = spent / planned * 100;
  const baseFill = css.match(/(?:^|\n)\.budget-fill\s*\{[^}]*width:\s*([\d.]+)%/);
  const animatedFill = css.match(/@keyframes\s+fill-budget\s*\{\s*to\s*\{[^}]*width:\s*([\d.]+)%/);
  const reducedMotionFill = css.match(/@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.budget-fill\s*\{[^}]*width:\s*([\d.]+)%\s*!important/);
  assert.ok(baseFill, 'MM budget has a final base width');
  assert.ok(animatedFill, 'MM budget animation has a final width');
  assert.ok(reducedMotionFill, 'MM reduced-motion budget has a final width');
  for (const match of [baseFill, animatedFill, reducedMotionFill]) assert.equal(Number(match[1]), expectedFill);
}

test('page contains the approved person-first content', async () => {
  const html = await readSite('index.html');
  assert.match(html, /<h1>\s*<span class="hero-name">Injun Lee\.<\/span>/);
  assert.match(html, /I build AI systems/);
  assert.match(html, /driven by imagination\./);
  const productDescriptions = [
    'An AI routing system that analyzes each prompt and matches it with a suitable model.',
    'An AI secretary that brings scheduling, tasks, reminders, and follow-ups into one place.',
    'A personal finance tracker that turns spending patterns into clear insights and practical suggestions.',
  ];
  for (const description of productDescriptions) {
    assert.equal(html.split(description).length - 1, 1, `${description} appears exactly once`);
  }
  assert.doesNotMatch(html, /I own the product direction/i);
  assert.doesNotMatch(html, /Auburn|rÃ©sumÃ©|resume/i);
});

test('hero uses the approved compact personal signature', async () => {
  const html = await readSite('index.html');
  const css = await readSite('styles.css');

  assert.match(
    html,
    /<h1>\s*<span class="hero-name">Injun Lee\.<\/span>\s*<span class="hero-thesis-line">I build AI systems<\/span>\s*<span class="hero-thesis-line">around people\.<\/span>\s*<\/h1>/,
  );
  assert.doesNotMatch(html, /\bI am\s+Injun Lee\b/i);
  assert.match(css, /\.hero-name\s*\{[^}]*font:\s*680\s+clamp\(1\.75rem,\s*3vw,\s*2\.2rem\)\/1\s+var\(--sans\)/i);
  assert.match(css, /\.hero-name::after\s*\{[^}]*width:\s*42px[^}]*height:\s*2px[^}]*background:\s*var\(--copper\)/i);
  assert.match(css, /\.hero h1\s*\{[^}]*font:\s*500\s+clamp\(2\.65rem,\s*4\.6vw,\s*4\.65rem\)\/\.94\s+var\(--display\)/i);
});

test('Synapse entry nodes reuse the selected and answer treatments', async () => {
  const html = await readSite('index.html');
  const css = await readSite('styles.css');

  assert.match(html, /<rect class="diagram-box prompt-box" x="18" y="82" width="112" height="56" rx="9"\/>/);

  assert.equal(cssProperty(css, '.prompt-box', 'fill'), '#f0ded3');
  assert.equal(cssProperty(css, '.prompt-box', 'stroke'), 'var(--copper)');
  assert.equal(cssProperty(css, '.prompt-box', 'stroke-width'), '1.6');
  assert.equal(cssProperty(css, '.prompt-box', 'fill'), cssProperty(css, '.model-selected', 'fill'));
  assert.equal(cssProperty(css, '.prompt-box', 'stroke'), cssProperty(css, '.model-selected', 'stroke'));
  assert.equal(cssProperty(css, '.prompt-box', 'stroke-width'), cssProperty(css, '.model-selected', 'stroke-width'));

  assert.equal(cssProperty(css, '.router-box', 'fill'), '#e4ece7');
  assert.equal(cssProperty(css, '.router-box', 'stroke'), 'var(--forest)');
  assert.equal(cssProperty(css, '.router-box', 'stroke-width'), '1.4');
  assert.equal(cssProperty(css, '.router-box', 'fill'), cssProperty(css, '.answer-box', 'fill'));
  assert.equal(cssProperty(css, '.router-box', 'stroke'), cssProperty(css, '.answer-box', 'stroke'));
  assert.equal(cssProperty(css, '.router-label', 'fill'), 'var(--forest) !important');
  assert.equal(cssProperty(css, '.router-subtitle', 'fill'), '#596159 !important');

  assert.match(html, /<path class="route route-inbound route-selected" d="M130 110 C151 110 161 110 181 110"\/>/);
  assert.match(html, /<path class="route route-b route-selected" d="M267 110 C290 92 304 76 330 75"\/>/);
  assert.match(html, /<path class="route route-answer route-selected" d="M406 75 C427 75 438 95 456 103"\/>/);
  assert.equal(cssProperty(css, '.route-selected', 'stroke'), 'var(--copper)');
  assert.equal(cssProperty(css, '.route-b.route-selected', 'stroke'), 'var(--forest)');
  assert.equal(cssProperty(css, '.route-b.route-selected', 'stroke'), cssProperty(css, '.router-box', 'stroke'));
  assert.doesNotMatch(css, /\.route-(?:inbound|answer)\.route-selected\s*\{[^}]*stroke\s*:/i);
});

test('June animates all four completion markers in sequence', async () => {
  const html = await readSite('index.html');
  const css = await readSite('styles.css');
  const june = html.match(/<details class="project" data-project="june">([\s\S]*?)<\/details>/);

  assert.ok(june, 'June project exists');
  const taskClasses = [...june[1].matchAll(/<p class="task (task-(?:one|two|three|four))">/g)].map((match) => match[1]);
  assert.deepEqual(taskClasses, ['task-one', 'task-two', 'task-three', 'task-four']);
  assert.match(css, /\.project\.is-animating \.task::before\s*\{[^}]*border-color:\s*var\(--forest\)[^}]*background:\s*transparent[^}]*color:\s*transparent/i);

  const delays = [...css.matchAll(/\.project\.is-animating \.task-(?:one|two|three|four)::before\s*\{[^}]*animation:\s*check-task\s+\.42s\s+ease-out\s+([\d.]+s)\s+forwards/g)].map((match) => match[1]);
  assert.deepEqual(delays, ['1.82s', '2.15s', '2.48s', '2.81s']);
  assert.equal(new Set(delays).size, 4);

  const reducedMotion = cssAtRuleBody(css, '@media (prefers-reduced-motion: reduce)');
  assert.match(reducedMotion, /\.project\.is-animating \.task::before\s*\{[^}]*animation:\s*none\s*!important[^}]*background:\s*var\(--forest\)\s*!important[^}]*color:\s*#fff\s*!important/i);
});

test('page uses three native project disclosures', async () => {
  const html = await readSite('index.html');
  const projects = html.match(/<details class="project" data-project="(synapse|june|mm)">/g) ?? [];
  assert.equal(projects.length, 3);
  assert.equal((html.match(/<summary class="project-summary">/g) ?? []).length, 3);
  assert.match(html, /id="current-work"/);
  assert.match(html, /href="#current-work"/);
});

test('June and MM figures expose substantive descriptions through their captions', async () => {
  const html = await readSite('index.html');
  const figures = [
    ['june', 'june-caption', 'An illustrative weekly calendar pairs planned events with follow-through tasks.'],
    ['mm', 'mm-caption', 'A sample spending chart pairs the weekly budget with practical suggestions.'],
  ];

  for (const [project, captionId, description] of figures) {
    const figure = html.match(new RegExp(`<figure class="project-visual ${project}-visual" aria-labelledby="${captionId}">([\\s\\S]*?)<\\/figure>`));
    assert.ok(figure, `${project} figure is labeled by its caption`);
    const caption = figure[1].match(new RegExp(`<figcaption id="${captionId}">([\\s\\S]*?)<\\/figcaption>`));
    assert.ok(caption, `${project} caption is inside its labeled figure`);
    assert.ok(caption[1].includes(description), `${project} caption includes a substantive description`);
  }
});

test('MM sample spending values reconcile with the weekly budget', async () => {
  const html = await readSite('index.html');
  const css = await readSite('styles.css');
  assertMmSampleContract(html, css);
});

test('review mutation: MM contract rejects coordinated number and geometry drift', async () => {
  const html = await readSite('index.html');
  const css = await readSite('styles.css');
  assert.doesNotThrow(() => assertMmSampleContract(html, css));

  const coordinatedDrift = html
    .replace('20 35 25 90 45 55 30', '30 35 25 90 45 55 30')
    .replace('This week · $300', 'This week · $310')
    .replace('spent: $300', 'spent: $310')
    .replace('$200 remaining', '$190 remaining');
  const mutations = [
    [coordinatedDrift, css],
    [html.replace('Weekly plan: $500', 'Weekly plan: $501'), css],
    [html.replace('<text x="28" y="120">M</text>', '<text x="29" y="120">M</text>'), css],
    [html.replace('M31 83.33', 'M31 82.33'), css],
    [html.replace('M31 83.33', 'M32 83.33'), css],
    [html.replace('cx="151" cy="39"', 'cx="151" cy="40"'), css],
    [html, css.replace('.budget-fill { display: block; width: 60%;', '.budget-fill { display: block; width: 61%;')],
    [html, css.replace('@keyframes fill-budget { to { width: 60%; } }', '@keyframes fill-budget { to { width: 61%; } }')],
    [html, css.replace('.budget-fill { width: 60% !important; }', '.budget-fill { width: 61% !important; }')],
  ];
  for (const [mutatedHtml, mutatedCss] of mutations) {
    assert.throws(() => assertMmSampleContract(mutatedHtml, mutatedCss));
  }
});

test('only approved outbound links are present', async () => {
  const html = await readSite('index.html');
  assertApprovedOutboundAnchors(html);
});

test('visual system uses only the approved accent tokens', async () => {
  const css = await readSite('styles.css');
  assertApprovedColors(css);
  assert.doesNotMatch(css, /ochre|#C5A253/i);
  assert.doesNotMatch(css, /@import|url\(|https?:/i);
  assert.match(css, /:focus-visible/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /@media\s*\(max-width:\s*820px\)/);
  assert.match(css, /@media\s*\(max-width:\s*420px\)/);
});

test('diagram secondary captions meet normal-text contrast on their actual light surfaces', async () => {
  const css = await readSite('styles.css');
  const checks = [
    ['.project-visual figcaption span:last-child', '.project[open]'],
    ['.schedule-grid > span:not(.time):not(.slot)', '.calendar-card'],
    ['.time', '.calendar-card'],
    ['.spending-chart text', '.chart-card'],
  ];

  for (const [foregroundSelector, backgroundSelector] of checks) {
    const foreground = cssProperty(css, foregroundSelector, foregroundSelector.includes('text') ? 'fill' : 'color');
    const background = cssProperty(css, backgroundSelector, 'background');
    assert.match(foreground, /^var\(--(?:forest|ink)\)$/, `${foregroundSelector} must use an existing high-contrast palette token`);
    const ratio = contrastRatio(foreground, background);
    assert.ok(ratio >= 4.5, `${foregroundSelector} contrast is ${ratio.toFixed(2)}:1; expected at least 4.5:1`);
  }
});

test('compact topics rule targets the rendered topic chips', async () => {
  const css = await readSite('styles.css');
  const compactRules = cssAtRuleBody(css, '@media (max-width: 420px)');
  assert.match(compactRules, /\.topics\s*>\s*span\s*\{[^}]*font-size:\s*\.58rem/i);
  assert.doesNotMatch(compactRules, /\.topic\s*\{/i);
});

test('fine pointers receive restrained palette hover affordances on all primary links', async () => {
  const css = await readSite('styles.css');
  const fineHoverRules = cssAtRuleBody(css, '@media (hover: hover) and (pointer: fine)');
  const expectedColors = new Map([
    ['.site-nav a:hover', 'var(--forest)'],
    ['.hero-jump:hover', 'var(--forest)'],
  ]);

  for (const [selector, expectedColor] of expectedColors) {
    assert.equal(cssProperty(fineHoverRules, selector, 'color'), expectedColor);
  }
  const footerHoverColor = cssProperty(fineHoverRules, '.site-footer > a:hover', 'color');
  const footerBackground = cssProperty(css, '.site-footer', 'background');
  const footerHoverRatio = contrastRatio(footerHoverColor, footerBackground);
  assert.ok(footerHoverRatio >= 4.5, `footer hover contrast is ${footerHoverRatio.toFixed(2)}:1; expected at least 4.5:1`);
  assert.equal(footerHoverColor, 'var(--paper)', 'footer hover must retain the readable paper text');
  assert.match(
    cssProperty(fineHoverRules, '.site-footer > a:hover', 'box-shadow'),
    /^0\s+2px\s+0\s+var\(--copper\)$/,
    'footer hover must strengthen the existing copper rule without changing text contrast',
  );
  assert.match(css, /:focus-visible\s*\{[^}]*outline:/i, 'hover styling must retain the visible keyboard focus treatment');
});

test('mobile layout targets the real project and footer structures', async () => {
  const css = await readSite('styles.css');
  assert.doesNotMatch(css, /\.section-heading\s*,\s*\.project-summary\s*\{\s*grid-template-columns:\s*34px\s+1fr\s+auto/i);
  assert.match(css, /\.project-summary\s*\{\s*grid-template-columns:\s*34px\s+1fr\s+auto/i);
  assert.doesNotMatch(css, /\.footer-top\s*\{/i);
  assert.match(css, /\.site-footer\s*\{\s*grid-template-columns:\s*1fr/i);
});

test('project diagrams have no-JS final states and reduced-motion final completion marks', async () => {
  const css = await readSite('styles.css');
  assert.match(css, /\.route\s*\{[^}]*stroke-dashoffset:\s*0/i);
  assert.match(css, /\.answer-copy\s*\{[^}]*opacity:\s*1/i);
  assert.match(css, /\.calendar-event\s*\{[^}]*opacity:\s*1[^}]*transform:\s*none/i);
  assert.match(css, /\.spending-path\s*\{[^}]*stroke-dashoffset:\s*0/i);
  assert.match(css, /\.chart-point\s*\{[^}]*opacity:\s*1/i);
  assert.match(css, /\.budget-fill\s*\{[^}]*width:\s*60%/i);
  assert.match(css, /\.insight-card\s*\{[^}]*opacity:\s*1[^}]*transform:\s*none/i);
  assert.match(css, /\.task::before\s*\{[^}]*border:\s*[^;]*var\(--forest\)[^}]*background:\s*var\(--forest\)[^}]*color:\s*#fff/i);
  assert.match(css, /animation-delay:\s*0s\s*!important/i);
  assert.match(css, /transition-delay:\s*0s\s*!important/i);
});

test('favicon is a static local SVG', async () => {
  const svg = await readFile(path.join(siteDir, 'assets', 'favicon.svg'), 'utf8');
  assert.match(svg, /^<svg\b/);
  const exactStandardNamespace = 'xmlns="http://www.w3.org/2000/svg"';
  assert.ok(svg.includes(exactStandardNamespace));
  const svgWithoutStandardNamespace = svg.replace(exactStandardNamespace, 'xmlns=""');
  const unsafeSvgContent = /<script|on\w+\s*=|foreignObject|https?:|data:/i;
  assert.doesNotMatch(svgWithoutStandardNamespace, unsafeSvgContent);
  assert.match('<svg onload = "alert(1)">', unsafeSvgContent);
  assert.doesNotMatch(svg, /<(?:image|use)\b|(?:href|xlink:href)\s*=/i);
  assert.match(svg, /#356351/i);
});

test('enhancement implements pinned and fine-hover states without unsafe DOM APIs', async () => {
  const js = await readSite('script.js');
  assert.match(js, /matchMedia\('\(hover: hover\) and \(pointer: fine\)'\)/);
  assert.match(js, /function openPinned\(project\)/);
  assert.match(js, /function closeProject\(project\)/);
  assert.match(js, /function previewProject\(project\)/);
  assert.match(js, /function restartAnimation\(project\)/);
  assertStaticScript(js);
});

test('enhancement applies progressive disclosure states and keyboard activation through real controller events', async () => {
  class FakeClassList {
    constructor(trace) {
      this.values = new Set();
      this.trace = trace;
    }

    add(...names) {
      for (const name of names) {
        this.values.add(name);
        this.trace.push(`add:${name}`);
      }
    }

    remove(...names) {
      for (const name of names) {
        this.values.delete(name);
        this.trace.push(`remove:${name}`);
      }
    }

    contains(name) {
      return this.values.has(name);
    }
  }

  class FakeEventTarget {
    constructor() {
      this.listeners = new Map();
    }

    addEventListener(type, listener) {
      this.listeners.set(type, listener);
    }

    dispatch(type, init = {}) {
      const event = {
        ...init,
        defaultPrevented: false,
        preventDefault() {
          this.defaultPrevented = true;
        },
      };
      this.listeners.get(type)?.(event);
      return event;
    }
  }

  class FakeProject extends FakeEventTarget {
    constructor(trace) {
      super();
      this.open = false;
      this.classList = new FakeClassList(trace);
      this.summary = new FakeEventTarget();
      this.trace = trace;
    }

    querySelector(selector) {
      return selector === '.project-summary' ? this.summary : null;
    }

    get offsetWidth() {
      this.trace.push('flush');
      return 100;
    }
  }

  const trace = [];
  const projects = [new FakeProject(trace), new FakeProject(trace), new FakeProject(trace)];
  const fineHover = new FakeEventTarget();
  fineHover.matches = true;
  const js = await readSite('script.js');

  vm.runInNewContext(js, {
    document: { querySelectorAll: () => projects },
    setTimeout,
    window: { matchMedia: () => fineHover },
  });

  projects[0].dispatch('pointerenter');
  assert.equal(projects[0].open, true);
  assert.equal(projects[0].classList.contains('is-preview'), true);
  assert.equal(projects[0].classList.contains('is-animating'), true);
  assert.deepEqual(trace.slice(-3), ['remove:is-animating', 'flush', 'add:is-animating']);

  projects[0].dispatch('pointerleave');
  assert.equal(projects[0].open, false);
  assert.equal(projects[0].classList.contains('is-preview'), false);
  assert.equal(projects[0].classList.contains('is-animating'), false);

  const replayStart = trace.length;
  projects[0].dispatch('pointerenter');
  assert.deepEqual(trace.slice(replayStart), [
    'add:is-preview',
    'remove:is-animating',
    'flush',
    'add:is-animating',
  ]);

  const previewClick = projects[0].summary.dispatch('click');
  assert.equal(previewClick.defaultPrevented, true);
  assert.equal(projects[0].open, true);
  assert.equal(projects[0].classList.contains('is-preview'), false);
  assert.equal(projects[0].classList.contains('is-pinned'), true);

  projects[1].summary.dispatch('click');
  assert.equal(projects[0].open, false);
  assert.equal(projects[0].classList.contains('is-pinned'), false);
  assert.equal(projects[1].open, true);
  assert.equal(projects[1].classList.contains('is-pinned'), true);

  projects[2].dispatch('pointerenter');
  assert.equal(projects[2].open, false);

  projects[1].summary.dispatch('click');
  projects[2].dispatch('pointerenter');
  assert.equal(projects[2].classList.contains('is-preview'), true);
  fineHover.dispatch('change');
  assert.equal(projects[2].open, false);
  assert.equal(projects[2].classList.contains('is-preview'), false);

  fineHover.matches = false;
  projects[2].dispatch('pointerenter');
  assert.equal(projects[2].open, false);

  projects[0].summary.dispatch('click');
  const enterOpen = projects[1].summary.dispatch('keydown', { key: 'Enter' });
  const enterOpenClick = projects[1].summary.dispatch('click', { detail: 0 });
  const enterOpenKeyup = projects[1].summary.dispatch('keyup', { key: 'Enter' });
  assert.equal(enterOpen.defaultPrevented, true);
  assert.equal(enterOpenClick.defaultPrevented, true);
  assert.equal(enterOpenKeyup.defaultPrevented, true);
  assert.equal(projects[0].open, false);
  assert.equal(projects[0].classList.contains('is-pinned'), false);
  assert.equal(projects[1].open, true);
  assert.equal(projects[1].classList.contains('is-pinned'), true);

  const enterClose = projects[1].summary.dispatch('keydown', { key: 'Enter' });
  const enterCloseClick = projects[1].summary.dispatch('click', { detail: 0 });
  const enterCloseKeyup = projects[1].summary.dispatch('keyup', { key: 'Enter' });
  assert.equal(enterClose.defaultPrevented, true);
  assert.equal(enterCloseClick.defaultPrevented, true);
  assert.equal(enterCloseKeyup.defaultPrevented, true);
  assert.equal(projects[1].open, false);
  assert.equal(projects[1].classList.contains('is-pinned'), false);

  projects[0].summary.dispatch('click');
  const spaceOpen = projects[1].summary.dispatch('keydown', { key: ' ' });
  const spaceOpenKeyup = projects[1].summary.dispatch('keyup', { key: ' ' });
  const spaceOpenClick = projects[1].summary.dispatch('click', { detail: 0 });
  assert.equal(spaceOpen.defaultPrevented, true);
  assert.equal(spaceOpenKeyup.defaultPrevented, true);
  assert.equal(spaceOpenClick.defaultPrevented, true);
  assert.equal(projects[0].open, false);
  assert.equal(projects[0].classList.contains('is-pinned'), false);
  assert.equal(projects[1].open, true);
  assert.equal(projects[1].classList.contains('is-pinned'), true);

  const spaceClose = projects[1].summary.dispatch('keydown', { key: ' ' });
  const spaceCloseKeyup = projects[1].summary.dispatch('keyup', { key: ' ' });
  const spaceCloseClick = projects[1].summary.dispatch('click', { detail: 0 });
  assert.equal(spaceClose.defaultPrevented, true);
  assert.equal(spaceCloseKeyup.defaultPrevented, true);
  assert.equal(spaceCloseClick.defaultPrevented, true);
  assert.equal(projects[1].open, false);
  assert.equal(projects[1].classList.contains('is-pinned'), false);

  const nonActivation = projects[2].summary.dispatch('keydown', { key: 'ArrowDown' });
  assert.equal(nonActivation.defaultPrevented, false);
  assert.equal(projects[2].open, false);
  assert.equal(projects[2].classList.contains('is-pinned'), false);

  await new Promise((resolve) => setTimeout(resolve, 0));

  const repeatEnterOpen = projects[0].summary.dispatch('keydown', { key: 'Enter' });
  const repeatEnter = projects[0].summary.dispatch('keydown', { key: 'Enter', repeat: true });
  const repeatEnterClick = projects[0].summary.dispatch('click', { detail: 0 });
  projects[0].summary.dispatch('keyup', { key: 'Enter' });
  assert.equal(repeatEnterOpen.defaultPrevented, true);
  assert.equal(repeatEnter.defaultPrevented, true);
  assert.equal(repeatEnterClick.defaultPrevented, true);
  assert.equal(projects[0].open, true);
  await new Promise((resolve) => setTimeout(resolve, 0));
  projects[0].summary.dispatch('click', { detail: 1 });

  const repeatSpaceOpen = projects[0].summary.dispatch('keydown', { key: ' ' });
  const repeatSpace = projects[0].summary.dispatch('keydown', { key: ' ', repeat: true });
  projects[0].summary.dispatch('keyup', { key: ' ' });
  const repeatSpaceClick = projects[0].summary.dispatch('click', { detail: 0 });
  assert.equal(repeatSpaceOpen.defaultPrevented, true);
  assert.equal(repeatSpace.defaultPrevented, true);
  assert.equal(repeatSpaceClick.defaultPrevented, true);
  assert.equal(projects[0].open, true);
  await new Promise((resolve) => setTimeout(resolve, 0));
  projects[0].summary.dispatch('click', { detail: 1 });

  projects[0].summary.dispatch('keydown', { key: 'Enter' });
  const armedPointerClick = projects[0].summary.dispatch('click', { detail: 1 });
  const armedKeyboardClick = projects[0].summary.dispatch('click', { detail: 0 });
  projects[0].summary.dispatch('keyup', { key: 'Enter' });
  assert.equal(armedPointerClick.defaultPrevented, true);
  assert.equal(armedKeyboardClick.defaultPrevented, true);
  assert.equal(projects[0].open, false);
  await new Promise((resolve) => setTimeout(resolve, 0));

  projects[0].summary.dispatch('keydown', { key: 'Enter' });
  projects[0].summary.dispatch('keyup', { key: 'Enter' });
  await new Promise((resolve) => setTimeout(resolve, 0));
  const standaloneKeyboardClick = projects[0].summary.dispatch('click', { detail: 0 });
  assert.equal(standaloneKeyboardClick.defaultPrevented, true);
  assert.equal(projects[0].open, false);

  projects[0].summary.dispatch('keydown', { key: 'Enter' });
  projects[0].summary.dispatch('keyup', { key: 'Enter' });
  projects[0].summary.dispatch('keydown', { key: 'Enter' });
  await new Promise((resolve) => setTimeout(resolve, 0));
  const newerActivationClick = projects[0].summary.dispatch('click', { detail: 0 });
  assert.equal(newerActivationClick.defaultPrevented, true);
  assert.equal(projects[0].open, false);
  projects[0].summary.dispatch('keyup', { key: 'Enter' });
  await new Promise((resolve) => setTimeout(resolve, 0));
});

test('artifact manifest and size stay inside the approved budget', async () => {
  const files = await listFiles(siteDir);
  assert.deepEqual(files, ['assets/favicon.svg', 'index.html', 'script.js', 'styles.css']);
  let total = 0;
  for (const file of files) total += (await stat(path.join(siteDir, file))).size;
  assert.ok(total <= 150_000, `artifact is ${total} bytes`);
  assert.ok((await stat(path.join(siteDir, 'script.js'))).size <= 10_000);
});

test('HTML enforces the approved static security boundary', async () => {
  const html = await readSite('index.html');
  assertApprovedHeadElements(html);
  assertApprovedUrls(html);
  assertStaticHtmlElements(html);
});

test('public artifact has no draft markers or prohibited personal content', async () => {
  const files = await listFiles(siteDir);
  const contents = await Promise.all(files.map((file) => readFile(path.join(siteDir, file), 'utf8')));
  const artifact = contents.join('\n');
  for (let index = 0; index < files.length; index += 1) {
    assertApprovedRemoteUrls(files[index], contents[index]);
    assertNoDraftComments(files[index], contents[index]);
  }
  assertNoDraftContent(await readSite('index.html'));
  assertNoSecrets(artifact);
  assertNoPrivateEndpoints(artifact);
  assert.doesNotMatch(artifact, /Auburn|@gmail\.com|mailto:|tel:|street address|university|degree|early prototype|active development/i);
  assert.doesNotMatch(artifact, /ochre|#C5A253/i);
});

test('review mutation: metadata duplicates and reordered mismatches are rejected', () => {
  const valid = `<meta content="${cspPolicy}" http-equiv="Content-Security-Policy"><meta content="no-referrer" name="referrer">`;
  assert.doesNotThrow(() => assertApprovedMetadata(valid));
  assert.throws(() => assertApprovedMetadata(`${valid}<meta http-equiv="Content-Security-Policy" content="${cspPolicy}">`));
  assert.throws(() => assertApprovedMetadata(`${valid}<meta content="default-src *" http-equiv="Content-Security-Policy">`));
  assert.throws(() => assertApprovedMetadata(`${valid}<meta content="origin" name="referrer">`));
  assert.throws(() => assertApprovedMetadata(`${valid}<meta http-equiv="Content&#45;Security-Policy" content="${cspPolicy}">`));
  assert.throws(() => assertApprovedMetadata(`${valid}<meta name="ref&#101;rrer" content="no-referrer">`));
});

test('review mutation: every URL-bearing attribute uses an exact allowlisted value', () => {
  assert.doesNotThrow(() => assertApprovedUrls('<a href="#work"></a><link href=styles.css><script src=script.js></script><image xlink:href="assets/favicon.svg">'));
  assert.throws(() => assertApprovedUrls('<a href=https://github.com/June74.evil>bad</a>'));
  assert.throws(() => assertApprovedUrls('<a href=//github.com/June74>bad</a>'));
  assert.throws(() => assertApprovedUrls('<a href="https://github.com/June74/issues">bad</a>'));
  assert.throws(() => assertApprovedUrls('<script src=https://github.com/June74></script>'));
  assert.throws(() => assertApprovedUrls('<form action=https://evil.test></form>'));
  assert.throws(() => assertApprovedUrls('<img srcset="assets/favicon.svg 1x, https://evil.test/x.svg 2x">'));
  assert.doesNotThrow(() => assertApprovedRemoteUrls('index.html', '<a href="https://github.com/June74">work</a>'));
  assert.doesNotThrow(() => assertApprovedRemoteUrls('assets/favicon.svg', '<svg xmlns="http://www.w3.org/2000/svg">'));
  assert.throws(() => assertApprovedRemoteUrls('script.js', 'const endpoint = "https://evil.test";'));
  assert.throws(() => assertApprovedRemoteUrls('index.html', '<svg xmlns="http://www.w3.org/2000/svg">'));
});

test('review mutation: outbound browser APIs are rejected', () => {
  for (const source of [
    'new XMLHttpRequest()',
    'new WebSocket("wss://example.test")',
    'new EventSource("/events")',
    'navigator.sendBeacon("/x")',
    'import("./remote.js")',
    'location.href = "https://example.test"',
    'location.assign("https://example.test")',
    'window.open("https://example.test")',
    'element.src = "https://example.test/x"',
    'element["src"] = "https://example.test/x"',
    'element.setAttribute("href", "https://example.test")',
    'navigator["sendBeacon"]("/x")',
    'new URL("https://example.test")',
  ]) {
    assert.throws(() => assertStaticScript(source), source);
  }
});

test('test sources do not embed provider-shaped secret fixtures', async () => {
  const testSource = await readFile(import.meta.filename, 'utf8');
  assertNoSecrets(testSource);
});

test('review mutation: representative secret-like values are rejected', () => {
  assert.doesNotThrow(() => assertNoSecrets(`content="${cspPolicy}"`));
  assert.doesNotThrow(() => assertNoSecrets(['const', 'token', '=', '"";', 'const', 'password', '=', "'';"].join(' ')));
  for (const source of [
    ['-----BEGIN', 'PRIVATE KEY-----'].join(' '),
    ['const', 'token', '=', '"non-empty";'].join(' '),
    ['const', 'api_key', '=', '`non-empty`;'].join(' '),
    ['https:', '//', 'user:password@example.test'].join(''),
    ['//', 'user:password@example.test'].join(''),
    ['AKIA', '1234567890ABCDEF'].join(''),
    ['sk-', 'proj-', 'abcdefghijklmnopqrstuvwxyz123456'].join(''),
    ['github_pat_', 'abcdefghijklmnopqrstuvwxyz123456'].join(''),
    ['ghp_', 'abcdefghijklmnopqrstuvwxyz123456'].join(''),
    ['xoxb', '1234567890', 'abcdefghijklmnop'].join('-'),
    `AIza${'a'.repeat(35)}`,
  ]) {
    assert.throws(() => assertNoSecrets(source), source);
  }
  for (const source of ['http://localhost:3000', 'https://10.0.0.1', 'wss://192.168.1.20', 'https://api.service.internal']) {
    assert.throws(() => assertNoPrivateEndpoints(source), source);
  }
});

test('review mutation: a fourth custom-property accent cannot be declared or used', () => {
  const declarations = [...approvedColorProperties].map(([name, value]) => `--${name}: ${value};`).join(' ');
  const fonts = "--display: Georgia, serif; --sans: Arial, sans-serif;";
  assert.doesNotThrow(() => assertApprovedColors(`:root { ${declarations} ${fonts} }`));
  assert.throws(() => assertApprovedColors(`:root { ${declarations} ${fonts} --violet: #7f4bb8; }`));
  assert.throws(() => assertApprovedColors(`:root { ${declarations} ${fonts} --violet: rgb(127 75 184); }`));
  assert.throws(() => assertApprovedColors(`:root { ${declarations} ${fonts} } .extra { color: var(--violet); }`));
});

test('review mutation: implementation identifiers are not draft copy', () => {
  assert.doesNotThrow(() => assertNoDraftContent('<div class="todo-card">To-do</div>'));
  assert.throws(() => assertNoDraftContent('<!-- TODO: replace this -->'));
  assert.throws(() => assertNoDraftContent('<p>&#84;ODO: replace this</p>'));
  assert.throws(() => assertNoDraftContent('<p>Draft copy</p>'));
  assert.throws(() => assertNoDraftContent('<a href="#">Placeholder</a>'));
  assert.throws(() => assertNoDraftContent('<input placeholder="Coming soon">'));
});

test('review mutation: the approved todo component identifier remains intact', async () => {
  assert.match(await readSite('index.html'), /class="todo-card"/);
  assert.match(await readSite('styles.css'), /\.todo-card\b/);
});

test('re-review mutation: ping, legacy, and SVG URL attributes are validated', () => {
  assert.throws(() => assertApprovedUrls('<a href="#work" ping="//evil.test/track">work</a>'));
  assert.throws(() => assertApprovedUrls('<a href="#work" ping="&sol;&sol;evil.test/track">work</a>'));
  assert.throws(() => assertApprovedUrls('<object data="//evil.test/file"></object>'));
  assert.throws(() => assertApprovedUrls('<blockquote cite="https://evil.test/source">copy</blockquote>'));
  assert.throws(() => assertApprovedUrls('<img attributionsrc="assets/favicon.svg //evil.test/register">'));
  assert.throws(() => assertApprovedUrls('<link imagesrcset="assets/favicon.svg 1x, //evil.test/image 2x">'));
  assert.throws(() => assertApprovedUrls('<svg><rect fill="url(//evil.test/fill.svg#paint)"></rect></svg>'));
});

test('re-review mutation: refresh metadata and unapproved link relations are rejected', async () => {
  const html = await readSite('index.html');
  assert.doesNotThrow(() => assertApprovedHeadElements(html));
  const inject = (markup) => html.replace('</head>', `${markup}</head>`);
  assert.throws(() => assertApprovedHeadElements(inject('<meta content="0; url=//evil.test" http-equiv="refresh">')));
  assert.throws(() => assertApprovedHeadElements(inject('<META HTTP-EQUIV=REFRESH CONTENT="0;url=//evil.test">')));
  assert.throws(() => assertApprovedHeadElements(inject('<meta content="0;url=&#47;&#47;evil.test" http-equiv="re&#102;resh">')));
  assert.throws(() => assertApprovedHeadElements(inject('<link href=script.js rel=preload>')));
});

test('re-review mutation: draft comments are rejected in every public source type', () => {
  assert.doesNotThrow(() => assertNoDraftComments('styles.css', '.todo-card { display: block; }'));
  assert.doesNotThrow(() => assertNoDraftComments('script.js', 'const visibleLabel = "To-do";'));
  assert.throws(() => assertNoDraftComments('styles.css', '/* TODO: replace color */'));
  assert.throws(() => assertNoDraftComments('script.js', '// FIXME: replace behavior'));
  assert.throws(() => assertNoDraftComments('script.js', '/* draft implementation */'));
  assert.throws(() => assertNoDraftComments('assets/favicon.svg', '<!-- TODO: replace icon --><svg></svg>'));
});

test('final review mutation: encoded GitHub anchors cannot evade count or protections', async () => {
  const html = await readSite('index.html');
  assert.doesNotThrow(() => assertApprovedOutboundAnchors(html));

  const encodedExisting = html.replace('https://github.com/June74', 'https&#58;//github.com/June74');
  assert.doesNotThrow(() => assertApprovedUrls(encodedExisting));
  assert.doesNotThrow(() => assertApprovedOutboundAnchors(encodedExisting));

  const encodedUnprotectedExisting = html.replace(
    'href="https://github.com/June74" target="_blank" rel="noopener noreferrer"',
    'href="https&#58;//github.com/June74"',
  );
  assert.doesNotThrow(() => assertApprovedUrls(encodedUnprotectedExisting));
  assert.throws(() => assertApprovedOutboundAnchors(encodedUnprotectedExisting));

  const encodedThird = html.replace('</nav>', '<a href="https&#58;//github.com/June74">Unprotected</a></nav>');
  assert.doesNotThrow(() => assertApprovedUrls(encodedThird));
  assert.throws(() => assertApprovedOutboundAnchors(encodedThird));

  const protectedThird = html.replace('</nav>', '<a href="https&#x3a;//github.com/June74" target="_blank" rel="noopener noreferrer">Duplicate</a></nav>');
  assert.throws(() => assertApprovedOutboundAnchors(protectedThird));

  const duplicateHref = html.replace('href="https://github.com/June74"', 'href="https://github.com/June74" href="https&#58;//github.com/June74"');
  assert.throws(() => assertApprovedOutboundAnchors(duplicateHref));
});

test('Pages workflow is fully pinned, serialized, and uploads only the curated site directory', async () => {
  const workflow = await readFile(path.join(root, '.github', 'workflows', 'pages.yml'), 'utf8');
  const actionReferences = [...workflow.matchAll(/uses:\s+(actions\/[^@\s]+)@([0-9a-f]{40})/g)].map((match) => `${match[1]}@${match[2]}`);
  assert.match(workflow, /contents:\s*read/);
  assert.match(workflow, /pages:\s*write/);
  assert.match(workflow, new RegExp(['id-', 'token', ':\\s*write'].join('')));
  assert.match(workflow, /- run:\s*node --test tests\/site\.test\.mjs/);
  assert.match(workflow, /path:\s*site/);
  assert.doesNotMatch(workflow, /path:\s*\.|docs\/|\.superpowers/);
  assert.match(workflow, /cancel-in-progress:\s*false/);
  assert.doesNotMatch(workflow, /uses:\s+[^@\s]+@(main|master|v\d+(?:\.\d+)*)\b/);
  assert.deepEqual(actionReferences, [
    'actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1',
    'actions/setup-node@820762786026740c76f36085b0efc47a31fe5020',
    'actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1',
    'actions/configure-pages@45bfe0192ca1faeb007ade9deae92b16b8254a0d',
    'actions/upload-pages-artifact@fc324d3547104276b827a68afc52ff2a11cc49c9',
    'actions/deploy-pages@cd2ce8fcbc39b97be8ca5fce6e763baed58fa128',
  ]);
});

test('Pages workflow isolates write permissions and disables persisted checkout credentials', async () => {
  const workflow = (await readFile(path.join(root, '.github', 'workflows', 'pages.yml'), 'utf8')).replace(/\r\n/g, '\n');
  const jobsStart = workflow.indexOf('\njobs:');
  const testJobStart = workflow.indexOf('\n  test:', jobsStart);
  const deployJobStart = workflow.indexOf('\n  deploy:', testJobStart);
  assert.ok(jobsStart >= 0 && testJobStart > jobsStart && deployJobStart > testJobStart, 'workflow must contain ordered test and deploy jobs');

  const workflowScope = workflow.slice(0, jobsStart);
  const testJob = workflow.slice(testJobStart, deployJobStart);
  const deployJob = workflow.slice(deployJobStart);
  const permissionsBlock = (job) => job.match(/\n    permissions:\n((?:      [^\n]+(?:\n|$))+)/)?.[1];
  assert.doesNotMatch(workflowScope, /(?:^|\n)permissions:/);
  assert.equal(permissionsBlock(testJob), '      contents: read\n');
  assert.equal(permissionsBlock(deployJob), ['      contents: read', '      pages: write', '      id-' + 'token' + ': write', ''].join('\n'));
  assert.equal(workflow.match(/pages:\s*write/g)?.length, 1, 'only the deploy job may write Pages');
  assert.equal(workflow.match(new RegExp(['id-', 'token', ':\\s*write'].join(''), 'g'))?.length, 1, 'only the deploy job may mint an OIDC token');

  const hardenedCheckouts = workflow.match(/- uses: actions\/checkout@[0-9a-f]{40}[^\n]*\n        with:\n          persist-credentials: false/g) ?? [];
  assert.equal(hardenedCheckouts.length, 2, 'both checkout steps must disable persisted credentials');
});

test('predeployment checklist separates post-authorization live-URL acceptance from local readiness', async () => {
  const checklist = await readFile(path.join(root, 'docs', 'release', 'predeployment-checklist.md'), 'utf8');
  assert.match(checklist, /## Post-authorization live-URL acceptance/);
  assert.match(checklist, /only after explicit owner deployment authorization/i);
  assert.match(checklist, /cannot be filled by local preview/i);
  assert.match(checklist, /actual public URL availability/i);
  assert.match(checklist, /HTTPS/i);
  assert.match(checklist, /expected redirects/i);
  assert.match(checklist, /navigation/i);
  assert.match(checklist, /project disclosure/i);
  assert.match(checklist, /GitHub link/i);
  assert.match(checklist, /browser console errors/i);
  assert.match(checklist, /unexpected network requests/i);
  assert.match(checklist, /final URL\/artifact confirmation/i);
});

test('predeployment checklist enforces the local-to-authorized-live acceptance order', async () => {
  const checklist = await readFile(path.join(root, 'docs', 'release', 'predeployment-checklist.md'), 'utf8');
  assert.match(checklist, /This checklist records only local and predeployment evidence before explicit owner deployment authorization\./);
  const authorizationGate = checklist.indexOf('**Explicit deployment authorization**');
  const liveAcceptance = checklist.indexOf('## Post-authorization live-URL acceptance');
  assert.ok(authorizationGate >= 0 && authorizationGate < liveAcceptance, 'explicit authorization must precede live-URL acceptance');
  assert.match(checklist, /All post-authorization live-URL items must have evidence before the release is called accepted or publicly verified\./);
});
