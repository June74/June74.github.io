import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(import.meta.dirname, '..');
const siteDir = path.join(root, 'site');
const readSite = (name) => readFile(path.join(siteDir, name), 'utf8');

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

test('enhancement implements pinned and fine-hover states without unsafe DOM APIs', async () => {
  const js = await readSite('script.js');
  assert.match(js, /matchMedia\('\(hover: hover\) and \(pointer: fine\)'\)/);
  assert.match(js, /function openPinned\(project\)/);
  assert.match(js, /function closeProject\(project\)/);
  assert.match(js, /function previewProject\(project\)/);
  assert.match(js, /function restartAnimation\(project\)/);
  assert.doesNotMatch(js, /innerHTML|insertAdjacentHTML|eval\(|localStorage|sessionStorage|fetch\(|document\.write|createElement\(\s*['"]script['"]\s*\)/);
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
  assert.deepEqual(await listFiles(siteDir), ['assets/favicon.svg', 'index.html', 'script.js', 'styles.css']);
  const files = await listFiles(siteDir);
  let total = 0;
  for (const file of files) total += (await stat(path.join(siteDir, file))).size;
  assert.ok(total <= 150_000, `artifact is ${total} bytes`);
  assert.ok((await stat(path.join(siteDir, 'script.js'))).size <= 10_000);
});

test('HTML enforces the approved static security boundary', async () => {
  const html = await readSite('index.html');
  const policy = "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-src 'none'; media-src 'none'; worker-src 'none'; manifest-src 'none'";
  assert.match(html, new RegExp(`<meta http-equiv="Content-Security-Policy" content="${policy.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}">`));
  assert.match(html, /<meta name="referrer" content="no-referrer">/);
  assert.doesNotMatch(html, /\son\w+=|<style\b|\sstyle=|<form\b|<iframe\b|<object\b|<embed\b/i);
  assert.doesNotMatch(html, /https?:\/\/(?!github\.com\/June74)/i);
});

test('public artifact has no draft markers or prohibited personal content', async () => {
  const files = await listFiles(siteDir);
  const artifact = (await Promise.all(files.map((file) => readFile(path.join(siteDir, file), 'utf8')))).join('\n');
  const draftMarkers = ['TO' + 'DO', 'TB' + 'D', 'FIX' + 'ME'];
  const draftPattern = new RegExp(`\\b(?:${draftMarkers.join('|')})\\b|lorem ipsum|example\\.com|href="#"`, 'i');
  assert.doesNotMatch(artifact, draftPattern);
  assert.doesNotMatch(artifact, /Auburn|@gmail\.com|mailto:|tel:|street address|university|degree|early prototype|active development/i);
  assert.doesNotMatch(artifact, /ochre|#C5A253/i);
});
