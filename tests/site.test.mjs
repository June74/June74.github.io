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

test('page contains the approved person-first content', async () => {
  const html = await readSite('index.html');
  assert.match(html, /<h1>\s*<span>Injun Lee\.<\/span>/);
  assert.match(html, /I build AI systems/);
  assert.match(html, /driven by imagination\./);
  assert.match(html, /I own the product direction and routing design/);
  assert.match(html, /I own the product direction and behavior design/g);
  assert.doesNotMatch(html, /Auburn|rÃ©sumÃ©|resume/i);
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

test('enhancement applies progressive disclosure states through real controller events', async () => {
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

    dispatch(type) {
      const event = {
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

test('review mutation: representative secret-like values are rejected', () => {
  assert.doesNotThrow(() => assertNoSecrets(`content="${cspPolicy}"`));
  assert.doesNotThrow(() => assertNoSecrets('const token = ""; const password = \'\';'));
  for (const source of [
    '-----BEGIN PRIVATE KEY-----',
    'const token = "non-empty";',
    'const api_key = `non-empty`;',
    'https://user:password@example.test',
    '//user:password@example.test',
    'AKIA1234567890ABCDEF',
    'sk-proj-abcdefghijklmnopqrstuvwxyz123456',
    'github_pat_abcdefghijklmnopqrstuvwxyz123456',
    'ghp_abcdefghijklmnopqrstuvwxyz123456',
    'xoxb-1234567890-abcdefghijklmnop',
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
  assert.match(workflow, /id-token:\s*write/);
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
