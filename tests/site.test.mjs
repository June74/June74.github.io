import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const siteDir = path.join(root, 'site');
const readSite = (name) => readFile(path.join(siteDir, name), 'utf8');

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
  const externalLinks = [...html.matchAll(/<a\b[^>]*href="(https:[^"]+)"[^>]*>/g)];
  assert.equal(externalLinks.length, 2);
  for (const link of externalLinks) {
    assert.equal(link[1], 'https://github.com/June74');
    assert.match(link[0], /target="_blank"/);
    assert.match(link[0], /rel="noopener noreferrer"/);
  }
});

test('visual system uses only the approved accent tokens', async () => {
  const css = await readSite('styles.css');
  assert.match(css, /--forest:\s*#356351/i);
  assert.match(css, /--copper:\s*#B86F4B/i);
  assert.match(css, /--slate:\s*#718999/i);
  assert.doesNotMatch(css, /--sage\s*:|var\(--sage\)/i);
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
