# Personal Work Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dependency-free, accessible, animated personal work showcase for Injun Lee and prepare a curated GitHub Pages artifact without publishing it.

**Architecture:** A semantic static document in `site/index.html` owns content and native `details` disclosure behavior. `site/styles.css` owns the three-color visual system, responsive layout, and motion; `site/script.js` progressively enhances native disclosures with exclusive pinned state and fine-pointer hover previews. Node built-in tests validate content, privacy, security, artifact size, and file inventory; a pinned GitHub Pages workflow uploads only `site/`.

**Tech Stack:** HTML5, CSS, vanilla JavaScript, inline static SVG, Node.js built-in `node:test`, GitHub Actions, GitHub Pages.

## Global Constraints

- The approved specification is `docs/superpowers/specs/2026-08-01-personal-work-showcase-design.md`.
- The durable visual reference is `docs/design/approved-revision-9-reference.html`; it is never deployed.
- Public site files are limited to `site/index.html`, `site/styles.css`, `site/script.js`, and `site/assets/favicon.svg`.
- Chromatic accents are exactly forest `#356351`, copper `#B86F4B`, and dusty slate blue `#718999`; muted ochre is prohibited.
- Public identity is limited to `Injun Lee` and `https://github.com/June74`; no direct contact detail, résumé, Auburn content, detailed progress label, or project-specific URL is added.
- No package manager, framework, runtime dependency, remote font, remote image, analytics, form, storage, service worker, or third-party browser script.
- Native `details` / `summary` controls must remain usable without JavaScript.
- Production HTML contains no inline event handler, inline `<style>`, `style` attribute, SVG script, `foreignObject`, external SVG reference, or unsafe DOM injection.
- JavaScript is at most 10 KB and the four-file artifact is at most 150 KB uncompressed.
- Public deployment, repository creation, remote push, and Pages enablement remain unauthorized in this plan.

## File and ownership map

| File | Responsibility | Primary slice |
| --- | --- | --- |
| `site/index.html` | Metadata, semantic landmarks, approved copy, native disclosures, diagrams | Developer A |
| `site/styles.css` | Tokens, typography, layout, responsive rules, diagrams, focus, motion | Developer B |
| `site/script.js` | Exclusive pinned disclosure and fine-pointer preview enhancement | Developer B |
| `site/assets/favicon.svg` | Local static orbital favicon | Developer B |
| `tests/site.test.mjs` | Content, security, inventory, size, CSS, and JS contracts | Developer A, then slice owner extends |
| `.github/workflows/pages.yml` | Curated artifact upload and Pages deployment | Developer A with Security review |
| `README.md` | Local preview, checks, Pages setup, limitations, rollback | Developer A |
| `docs/release/predeployment-checklist.md` | Evidence template and explicit deployment-authorization gate | Agent 5 |

---

### Task 1: Semantic public document and content contract

**Files:**
- Create: `tests/site.test.mjs`
- Create: `site/index.html`

**Interfaces:**
- Consumes: approved copy and public-information boundary from the specification.
- Produces: three `.project` native `details` elements with `data-project="synapse|june|mm"`; `.project-visual` containers; `.orbit` elements; two protected GitHub links; IDs used by CSS and JavaScript.

- [ ] **Step 1: Write the failing semantic/content tests**

Create `tests/site.test.mjs` with Node built-ins only:

```js
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
  assert.doesNotMatch(html, /Auburn|résumé|resume/i);
});

test('page uses three native project disclosures', async () => {
  const html = await readSite('index.html');
  const projects = html.match(/<details class="project" data-project="(synapse|june|mm)">/g) ?? [];
  assert.equal(projects.length, 3);
  assert.equal((html.match(/<summary class="project-summary">/g) ?? []).length, 3);
  assert.match(html, /id="current-work"/);
  assert.match(html, /href="#current-work"/);
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
```

- [ ] **Step 2: Run the semantic/content tests and verify RED**

Run: `node --test tests/site.test.mjs`

Expected: FAIL because `site/index.html` does not exist.

- [ ] **Step 3: Create the semantic HTML document**

Create `site/index.html` with this exact head contract and semantic structure. Populate each `<figure>` with the complete static diagram markup from the approved reference, preserving the accessible names and approved diagram microcopy while replacing mockup-only containers and inline handlers:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-src 'none'; media-src 'none'; worker-src 'none'; manifest-src 'none'">
  <meta name="referrer" content="no-referrer">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Injun Lee shapes human-centered AI systems through product direction, agent orchestration, and careful software engineering.">
  <title>Injun Lee — AI Systems</title>
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="styles.css">
  <script src="script.js" defer></script>
</head>
<body>
  <a class="skip-link" href="#current-work">Skip to current work</a>
  <main class="site-shell">
    <nav class="site-nav" aria-label="Primary">
      <a class="identity" href="#top">Injun Lee</a>
      <a href="https://github.com/June74" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>
    </nav>

    <header class="hero" id="top">
      <div class="hero-copy">
        <h1><span>Injun Lee.</span><span>I build AI systems</span><span>around people.</span></h1>
        <p>I’m a software engineer focused on expanding what AI can do without losing sight of who it should serve. My work centers on AI capabilities and agent orchestration—coordinating systems that can take on large tasks and complex projects. Right now, I’m shaping accessible, affordable products grounded in practical direction and driven by imagination.</p>
        <a class="hero-jump" href="#current-work">Currently shaping three systems</a>
      </div>
      <div class="solar-system" role="img" aria-label="An abstract central intelligence with signals orbiting at several distances">
        <span class="orbit orbit-four"></span><span class="orbit orbit-three"></span>
        <span class="orbit orbit-two"></span><span class="orbit orbit-one"></span>
        <span class="core-halo"></span><span class="core"></span>
      </div>
    </header>

    <section class="work-section" id="current-work" aria-labelledby="work-heading">
      <div class="section-heading"><h2 id="work-heading">Current work</h2><p>Three systems I’m shaping</p></div>

      <details class="project" data-project="synapse">
        <summary class="project-summary">
          <span class="project-number">01</span>
          <span class="project-copy"><span class="project-name">Synapse</span><span class="project-line">I own the product direction and routing design for a system that pairs each prompt with the model best suited to it.</span><span class="topics"><span>AI routing</span><span>Product direction</span><span>System design</span></span></span>
          <span class="project-plus" aria-hidden="true">+</span>
        </summary>
        <div class="project-panel">
          <figure class="project-visual synapse-visual" aria-labelledby="synapse-caption">
            <figcaption id="synapse-caption"><span>A glimpse of the routing flow</span><span>Illustrative system view</span></figcaption>
            <svg class="synapse-diagram" viewBox="0 0 570 220" role="img" aria-label="A prompt enters a router, four aligned model choices appear, and one selected model produces an answer">
              <rect class="diagram-box" x="18" y="82" width="112" height="56" rx="9"/>
              <text x="33" y="103" class="diagram-label">PROMPT</text><text x="33" y="122">Plan my week...</text>
              <path class="route route-inbound route-selected" d="M130 110 C151 110 161 110 181 110"/>
              <rect class="router-box" x="181" y="72" width="86" height="76" rx="12"/>
              <text x="202" y="105" class="router-label">ROUTER</text><text x="196" y="123" class="router-subtitle">analyze · match</text>
              <path class="route route-a" d="M267 110 C289 74 303 34 330 33"/>
              <path class="route route-b route-selected" d="M267 110 C290 92 304 76 330 75"/>
              <path class="route route-c" d="M267 110 C290 117 305 118 330 117"/>
              <path class="route route-d" d="M267 110 C290 144 305 159 330 159"/>
              <rect class="diagram-box" x="330" y="18" width="76" height="30" rx="7"/><text x="348" y="37">MODEL A</text>
              <rect class="model-selected" x="330" y="60" width="76" height="30" rx="7"/><text x="348" y="79" class="diagram-label">MODEL B</text>
              <rect class="diagram-box" x="330" y="102" width="76" height="30" rx="7"/><text x="348" y="121">MODEL C</text>
              <rect class="diagram-box" x="330" y="144" width="76" height="30" rx="7"/><text x="348" y="163">MODEL D</text>
              <path class="route route-answer route-selected" d="M406 75 C427 75 438 95 456 103"/>
              <rect class="answer-box" x="456" y="78" width="96" height="58" rx="9"/>
              <text x="472" y="99" class="diagram-label">ANSWER</text><text x="472" y="119" class="answer-copy">Your plan is...</text>
            </svg>
          </figure>
        </div>
      </details>

      <details class="project" data-project="june">
        <summary class="project-summary">
          <span class="project-number">02</span>
          <span class="project-copy"><span class="project-name">June</span><span class="project-line">I own the product direction and behavior design for an AI secretary built around schedules, tasks, reminders, and follow-through.</span><span class="topics"><span>AI agents</span><span>Calendar</span><span>Task planning</span></span></span>
          <span class="project-plus" aria-hidden="true">+</span>
        </summary>
        <div class="project-panel">
          <figure class="project-visual june-visual" aria-labelledby="june-caption">
            <figcaption id="june-caption"><span>A week taking shape</span><span>Calendar and follow-through</span></figcaption>
            <div class="june-layout" aria-hidden="true">
              <div class="calendar-card"><div class="mini-heading"><span>Weekly calendar</span><span>May 11–15</span></div>
                <div class="schedule-grid"><span></span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span>
                  <span class="time">9:00</span><span class="slot"><span class="calendar-event event-one">Plan week</span></span><span class="slot"></span><span class="slot"><span class="calendar-event copper event-two">Review</span></span><span class="slot"></span><span class="slot"></span>
                  <span class="time">11:00</span><span class="slot"></span><span class="slot"><span class="calendar-event slate event-three">Focus</span></span><span class="slot"></span><span class="slot"></span><span class="slot"></span>
                  <span class="time">1:00</span><span class="slot"></span><span class="slot"></span><span class="slot"></span><span class="slot"><span class="calendar-event event-four">Calendar sync</span></span><span class="slot"></span>
                  <span class="time">3:00</span><span class="slot"></span><span class="slot"></span><span class="slot"></span><span class="slot"></span><span class="slot"><span class="calendar-event copper event-five">Follow-up</span></span>
                </div>
              </div>
              <div class="todo-card"><div class="mini-heading"><span>To-do</span><span>4 items</span></div><p class="task task-one">Confirm appointment</p><p class="task task-two">Prepare weekly plan</p><p class="task">Send follow-up</p><p class="task">Block focus time</p></div>
            </div>
          </figure>
        </div>
      </details>

      <details class="project" data-project="mm">
        <summary class="project-summary">
          <span class="project-number">03</span>
          <span class="project-copy"><span class="project-name">MM</span><span class="project-line">I own the product direction and behavior design for a system that turns spending patterns into practical reflection.</span><span class="topics"><span>AI analysis</span><span>Personal finance</span><span>Behavior patterns</span></span></span>
          <span class="project-plus" aria-hidden="true">+</span>
        </summary>
        <div class="project-panel">
          <figure class="project-visual mm-visual" aria-labelledby="mm-caption">
            <figcaption id="mm-caption"><span>Patterns become practical suggestions</span><span>Illustrative sample values</span></figcaption>
            <div class="mm-layout" aria-hidden="true">
              <div class="chart-card"><div class="mini-heading"><span>Daily spending</span><span>This week · $461</span></div>
                <svg class="spending-chart" viewBox="0 0 300 135"><line class="chart-grid" x1="28" y1="20" x2="290" y2="20"/><line class="chart-grid" x1="28" y1="58" x2="290" y2="58"/><line class="chart-grid" x1="28" y1="96" x2="290" y2="96"/><text x="3" y="23">$120</text><text x="9" y="61">$60</text><text x="15" y="99">$0</text><text x="28" y="120">M</text><text x="68" y="120">T</text><text x="108" y="120">W</text><text x="148" y="120">T</text><text x="188" y="120">F</text><text x="228" y="120">S</text><text x="271" y="120">S</text><path class="spending-path" d="M31 83 L71 72 L111 79 L151 25 L191 65 L231 37 L274 67"/><circle class="chart-point" cx="151" cy="25" r="4"/></svg>
                <div class="budget-copy"><span>Weekly plan: $500 · spent: $300</span><strong>$200 remaining</strong></div><div class="budget-track"><span class="budget-fill"></span></div>
              </div>
              <div class="insights-card"><div class="mini-heading"><span>Suggestions</span><span>2 patterns</span></div><p class="insight-card insight-one"><strong>Dining · $86 this week</strong>Try two home-cooked meals next week.</p><p class="insight-card insight-two"><strong>Weekly balance</strong>You have $200 left from your $500 plan.</p></div>
            </div>
          </figure>
        </div>
      </details>
    </section>

    <footer class="site-footer"><div><p>A growing system of ideas</p><h2>Imagination is always shaping what comes next.</h2></div><a href="https://github.com/June74" target="_blank" rel="noopener noreferrer">Follow my work on GitHub <span aria-hidden="true">↗</span></a><p class="footer-meta"><span>Injun Lee</span><span>AI systems · software · direction</span></p></footer>
  </main>
</body>
</html>
```

The diagram geometry and microcopy above are normative. The approved Synapse labels are `PROMPT`, `Plan my week...`, `ROUTER`, `analyze · match`, `MODEL A` through `MODEL D`, `ANSWER`, and `Your plan is...`. The approved June event labels are `Plan week`, `Review`, `Focus`, `Calendar sync`, and `Follow-up`. The approved MM values are `$461`, `$500`, `$300`, `$200 remaining`, and `Dining · $86 this week`.

- [ ] **Step 4: Run semantic/content tests and verify GREEN**

Run: `node --test tests/site.test.mjs`

Expected: 3 passing tests, 0 failures.

- [ ] **Step 5: Review the HTML slice**

Check: no inline handler, no `style` attribute, no project link, no contact detail, all SVGs use static geometry/text only, and the document remains readable when `script.js` is absent.

- [ ] **Step 6: Commit the semantic slice**

```powershell
git add site/index.html tests/site.test.mjs
git commit -m "feat: add semantic portfolio content"
```

### Task 2: Three-color visual system, responsive layout, and static diagrams

**Files:**
- Create: `site/styles.css`
- Create: `site/assets/favicon.svg`
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Consumes: classes and SVG structure created in Task 1.
- Produces: complete Revision 9 layout, forest/copper/slate token contract, responsive breakpoints, focus styling, final-state reduced motion, and diagram animation hooks consumed by Task 3.

- [ ] **Step 1: Add failing CSS, asset, and size tests**

Append to `tests/site.test.mjs`:

```js
test('visual system uses only the approved accent tokens', async () => {
  const css = await readSite('styles.css');
  assert.match(css, /--forest:\s*#356351/i);
  assert.match(css, /--copper:\s*#B86F4B/i);
  assert.match(css, /--slate:\s*#718999/i);
  assert.doesNotMatch(css, /ochre|#C5A253/i);
  assert.match(css, /:focus-visible/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /@media\s*\(max-width:\s*820px\)/);
});

test('favicon is a static local SVG', async () => {
  const svg = await readFile(path.join(siteDir, 'assets', 'favicon.svg'), 'utf8');
  assert.match(svg, /^<svg\b/);
  assert.doesNotMatch(svg, /<script|on\w+=|foreignObject|https?:|data:/i);
  assert.match(svg, /#356351/i);
});
```

- [ ] **Step 2: Run tests and verify RED**

Run: `node --test tests/site.test.mjs`

Expected: the new tests fail because `site/styles.css` and `site/assets/favicon.svg` do not exist.

- [ ] **Step 3: Implement the visual token and layout foundation**

Create `site/styles.css` beginning with this exact token and reset contract, then implement every class emitted by Task 1 and every diagram class copied from the reference:

```css
:root {
  color-scheme: light;
  --paper: #f1eee6;
  --panel: #e2e6dc;
  --ink: #18201c;
  --forest: #356351;
  --sage: #829a8e;
  --copper: #b86f4b;
  --slate: #718999;
  --rule: #b2b2a9;
  --display: Georgia, 'Times New Roman', serif;
  --sans: 'Segoe UI Variable', 'Segoe UI', Arial, sans-serif;
}

*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; background: var(--paper); color: var(--ink); font-family: var(--sans); }
a { color: inherit; }
.skip-link { position: fixed; left: 1rem; top: 1rem; z-index: 20; transform: translateY(-180%); background: var(--ink); color: var(--paper); padding: .7rem 1rem; }
.skip-link:focus { transform: none; }
:focus-visible { outline: 3px solid var(--copper); outline-offset: 4px; }
.site-shell { width: min(100% - 2rem, 1180px); margin: 1rem auto; border: 1px solid #cbc8bf; border-radius: 20px; overflow: clip; }
.site-nav { min-height: 72px; margin: 0 46px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--rule); font-size: .72rem; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; }
.site-nav a { text-decoration: none; }
.hero { min-height: 690px; padding: 82px 46px 72px; display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }
.hero h1 { margin: 0; font: 500 clamp(3.2rem, 6vw, 5.8rem)/.92 var(--display); letter-spacing: -.055em; }
.hero h1 span { display: block; }
.hero-copy > p { max-width: 42rem; margin: 1.8rem 0 2.2rem; color: #505951; font-size: 1rem; line-height: 1.75; }
.hero-jump { display: inline-flex; align-items: center; gap: .7rem; color: #59635c; font-size: .66rem; letter-spacing: .13em; text-decoration: none; text-transform: uppercase; }
.hero-jump::before { content: ''; width: 28px; height: 1px; background: var(--copper); }
.solar-system { position: relative; width: min(100%, 420px); aspect-ratio: 1; justify-self: center; }
.orbit, .core, .core-halo { position: absolute; left: 50%; top: 50%; border-radius: 50%; transform: translate(-50%, -50%); }
.orbit { border: 1px solid rgb(130 154 142 / 38%); }
.orbit::before, .orbit::after { content: ''; position: absolute; left: 50%; border-radius: 50%; }
.orbit::after { top: -5px; width: 9px; height: 9px; background: var(--copper); }
.orbit::before { bottom: -4px; width: 6px; height: 6px; background: var(--sage); }
.orbit-one { width: 94px; height: 94px; animation: orbit-clockwise 7s linear infinite; }
.orbit-two { width: 164px; height: 164px; border-color: rgb(184 111 75 / 24%); animation: orbit-counter 12s linear infinite; }
.orbit-three { width: 246px; height: 246px; border-color: rgb(113 137 153 / 44%); animation: orbit-clockwise 19s linear infinite reverse; }
.orbit-four { width: 342px; height: 342px; border-style: dashed; opacity: .56; animation: orbit-counter 29s linear infinite; }
.orbit-three::after, .orbit-four::before { background: var(--copper); }
.orbit-four::after { background: var(--slate); }
.core { width: 25px; height: 25px; background: var(--forest); box-shadow: 0 0 0 12px rgb(53 99 81 / 8%), 0 12px 35px rgb(53 99 81 / 23%); }
.core-halo { width: 74px; height: 74px; border: 1px solid rgb(53 99 81 / 25%); animation: halo 4s ease-in-out infinite; }
@keyframes orbit-clockwise { to { transform: translate(-50%, -50%) rotate(360deg); } }
@keyframes orbit-counter { from { transform: translate(-50%, -50%) rotate(38deg); } to { transform: translate(-50%, -50%) rotate(-322deg); } }
@keyframes halo { 50% { transform: translate(-50%, -50%) scale(1.13); opacity: .72; } }
```

- [ ] **Step 4: Implement the work rows, diagrams, and footer**

Append this complete component layer to `site/styles.css`:

```css
.work-section { padding: 0 46px; }
.section-heading { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; padding: 31px 0 14px; border-top: 1px solid var(--rule); color: #606961; font-size: .63rem; letter-spacing: .13em; text-transform: uppercase; }
.section-heading h2, .section-heading p { margin: 0; font: inherit; }
.section-heading h2 { color: var(--ink); font-weight: 700; }
.section-heading p { text-align: right; }
.project { border-top: 1px solid var(--rule); }
.project:last-child { border-bottom: 1px solid var(--rule); }
.project-summary { display: grid; grid-template-columns: 52px 1fr auto; gap: 18px; align-items: start; padding: 30px 4px 28px; cursor: pointer; list-style: none; }
.project-summary::-webkit-details-marker { display: none; }
.project-summary::marker { content: ''; }
.project-number { padding-top: 8px; color: var(--forest); font-size: .62rem; font-weight: 750; }
.project-copy { display: block; }
.project-name { display: block; font: 680 clamp(1.9rem, 3.2vw, 2.7rem)/1 var(--sans); letter-spacing: -.05em; }
.project-line { display: block; max-width: 58rem; margin: 9px 0 15px; color: #505951; font-size: .82rem; line-height: 1.55; }
.topics { display: flex; flex-wrap: wrap; gap: 7px; }
.topics > span { padding: 5px 8px; border: 1px solid #a4aaa4; border-radius: 999px; color: #59635c; font-size: .55rem; letter-spacing: .06em; text-transform: uppercase; }
.topics > span:nth-child(2) { border-color: rgb(113 137 153 / 62%); }
.topics > span:nth-child(3) { border-color: rgb(184 111 75 / 62%); }
.project-plus { padding-top: 4px; color: var(--forest); font-size: 1.35rem; font-weight: 300; transition: transform .28s ease, color .28s ease; }
.project[open] { margin-inline: -15px; padding-inline: 15px; background: #e8e9e1; }
.project[open] .project-plus { color: var(--copper); transform: rotate(45deg); }
.project-panel { padding: 0 22px 25px; }
.project-visual { margin: 0; padding-top: 22px; }
.project-visual figcaption { display: flex; justify-content: space-between; margin-bottom: 13px; color: var(--forest); font-size: .55rem; font-weight: 750; letter-spacing: .1em; text-transform: uppercase; }
.project-visual figcaption span:last-child { color: #6c756e; font-weight: 500; }
.synapse-diagram, .june-layout, .mm-layout { width: 100%; border: 1px solid #c3c5bc; border-radius: 11px; background: #f7f5ef; }

.synapse-diagram { display: block; height: 220px; }
.synapse-diagram text { fill: var(--ink); font: 9px var(--sans); }
.diagram-box { fill: #fcfbf7; stroke: #95a099; }
.diagram-label { font-weight: 700 !important; }
.router-box { fill: var(--forest); }
.router-label { fill: #fff !important; font-weight: 700 !important; }
.router-subtitle { fill: #fff !important; opacity: .68; }
.route { fill: none; stroke: #9ea8a1; stroke-width: 1.2; stroke-dasharray: 180; stroke-dashoffset: 180; }
.route-selected { stroke: var(--copper); stroke-width: 2; }
.model-selected { fill: #f0ded3; stroke: var(--copper); stroke-width: 1.6; }
.answer-box { fill: #e4ece7; stroke: var(--forest); }
.answer-copy { opacity: 0; }
.project.is-animating .route { animation: draw-route .5s ease-out .58s forwards; }
.project.is-animating .route-a { animation-delay: .95s; }
.project.is-animating .route-b { animation-delay: 1.2s; }
.project.is-animating .route-c { animation-delay: 1.45s; }
.project.is-animating .route-d { animation-delay: 1.7s; }
.project.is-animating .route-answer { animation-delay: 2.1s; }
.project.is-animating .answer-copy { animation: reveal .4s ease-out 2.5s forwards; }
@keyframes draw-route { to { stroke-dashoffset: 0; } }
@keyframes reveal { to { opacity: 1; } }

.june-layout, .mm-layout { min-height: 242px; display: grid; gap: 14px; padding: 14px; }
.june-layout { grid-template-columns: 1.35fr .65fr; }
.calendar-card, .todo-card, .chart-card, .insights-card { min-width: 0; padding: 12px; border: 1px solid #c9cbc3; border-radius: 9px; background: #fcfbf7; }
.mini-heading { display: flex; justify-content: space-between; margin-bottom: 10px; color: var(--forest); font-size: .55rem; font-weight: 750; letter-spacing: .09em; text-transform: uppercase; }
.schedule-grid { display: grid; grid-template-columns: 34px repeat(5, minmax(0, 1fr)); grid-auto-rows: 29px; gap: 3px; }
.schedule-grid > span:not(.time):not(.slot) { display: grid; place-items: center; color: #737c75; font-size: .45rem; font-weight: 700; }
.time { display: flex; align-items: center; color: #8a918c; font-size: .45rem; }
.slot { position: relative; overflow: hidden; border: 1px solid #e0e1db; border-radius: 3px; }
.calendar-event { position: absolute; inset: 3px; display: flex; align-items: center; padding: 0 4px; border-radius: 3px; background: var(--forest); color: #fff; font-size: .42rem; white-space: nowrap; opacity: 0; transform: scaleX(0); transform-origin: left; }
.calendar-event.copper { background: var(--copper); }
.calendar-event.slate { background: var(--slate); }
.project.is-animating .calendar-event { animation: event-in .46s ease-out forwards; }
.project.is-animating .event-one { animation-delay: .15s; }
.project.is-animating .event-two { animation-delay: .5s; }
.project.is-animating .event-three { animation-delay: .85s; }
.project.is-animating .event-four { animation-delay: 1.2s; }
.project.is-animating .event-five { animation-delay: 1.55s; }
@keyframes event-in { to { opacity: 1; transform: scaleX(1); } }
.task { display: grid; grid-template-columns: 16px 1fr; gap: 7px; align-items: center; margin: 9px 0; color: #596159; font-size: .62rem; }
.task::before { content: '✓'; display: grid; place-items: center; width: 14px; height: 14px; border: 1px solid #9ba59e; border-radius: 50%; color: transparent; }
.project.is-animating .task-one::before { animation: check-task .42s ease-out 1.82s forwards; }
.project.is-animating .task-two::before { animation: check-task .42s ease-out 2.15s forwards; }
@keyframes check-task { to { border-color: var(--forest); background: var(--forest); color: #fff; } }

.mm-layout { grid-template-columns: 1.3fr .7fr; }
.chart-card, .insights-card { position: relative; overflow: hidden; }
.spending-chart { width: 100%; height: 135px; }
.chart-grid { stroke: #dcded7; }
.spending-chart text { fill: #7c847e; font: 6px var(--sans); }
.spending-path { fill: none; stroke: var(--copper); stroke-width: 2.4; stroke-dasharray: 520; stroke-dashoffset: 520; }
.chart-point { fill: var(--copper); opacity: 0; }
.project.is-animating .spending-path { animation: draw-chart 1.65s ease-out forwards; }
.project.is-animating .chart-point { animation: reveal .35s ease-out 1.45s forwards; }
@keyframes draw-chart { to { stroke-dashoffset: 0; } }
.budget-copy { display: flex; justify-content: space-between; margin-top: 3px; color: #5e675f; font-size: .55rem; }
.budget-copy strong { color: var(--forest); }
.budget-track { height: 6px; margin-top: 7px; overflow: hidden; border-radius: 999px; background: #dadcd5; }
.budget-fill { display: block; width: 0; height: 100%; background: var(--forest); }
.project.is-animating .budget-fill { animation: fill-budget 1s ease-out .75s forwards; }
@keyframes fill-budget { to { width: 60%; } }
.insight-card { position: absolute; left: 11px; right: 11px; margin: 0; padding: 9px; border-radius: 8px; background: #e6ece7; color: #49544c; font-size: .6rem; line-height: 1.45; box-shadow: 0 7px 18px rgb(36 54 44 / 9%); opacity: 0; transform: translateY(7px); }
.insight-card strong { display: block; margin-bottom: 3px; color: var(--forest); font-size: .52rem; letter-spacing: .07em; text-transform: uppercase; }
.insight-one { top: 42px; border-left: 3px solid var(--copper); }
.insight-two { top: 115px; border-left: 3px solid var(--slate); }
.project.is-animating .insight-one { animation: show-insight .48s ease-out 1.5s forwards; }
.project.is-animating .insight-two { animation: show-insight .48s ease-out 2s forwards; }
@keyframes show-insight { to { opacity: 1; transform: none; } }

.site-footer { margin-top: 85px; padding: 45px 46px 35px; display: grid; grid-template-columns: 1.4fr .6fr; align-items: end; gap: 30px; background: var(--ink); color: var(--paper); }
.site-footer p { margin: 0; color: #a9b3ac; font-size: .6rem; letter-spacing: .13em; text-transform: uppercase; }
.site-footer h2 { max-width: 660px; margin: 11px 0 0; font: 500 clamp(2.3rem, 4vw, 3.4rem)/1 var(--display); letter-spacing: -.035em; }
.site-footer > a { justify-self: end; padding-bottom: 6px; border-bottom: 1px solid var(--copper); color: var(--paper); font-size: .68rem; letter-spacing: .1em; text-decoration: none; text-transform: uppercase; }
.footer-meta { grid-column: 1 / -1; display: flex; justify-content: space-between; margin-top: 25px !important; padding-top: 18px; border-top: 1px solid #465049; }
```

- [ ] **Step 5: Implement responsive and motion-safe endings**

End `site/styles.css` with deterministic mobile and reduced-motion behavior:

```css
@media (max-width: 820px) {
  .site-shell { width: min(100% - 1rem, 1180px); margin: .5rem auto; border-radius: 14px; }
  .site-nav { margin: 0 22px; }
  .hero { min-height: auto; padding: 52px 22px 64px; grid-template-columns: 1fr; }
  .hero h1 { font-size: clamp(3rem, 15vw, 5rem); }
  .solar-system { width: min(88vw, 390px); }
  .section-heading, .project-summary { grid-template-columns: 34px 1fr auto; }
  .project-panel { padding-inline: 0; }
  .june-layout, .mm-layout, .footer-top { grid-template-columns: 1fr; }
  .site-footer { padding: 42px 22px 30px; }
}

@media (max-width: 420px) {
  .hero h1 { font-size: clamp(2.7rem, 14vw, 3.7rem); }
  .project-summary { gap: 10px; }
  .topics { gap: 5px; }
  .topic { font-size: .58rem; }
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation-duration: .001ms !important; animation-iteration-count: 1 !important; transition-duration: .001ms !important; }
  .route, .spending-path { stroke-dashoffset: 0 !important; }
  .calendar-event, .chart-point, .insight-card, .answer-copy { opacity: 1 !important; transform: none !important; }
  .budget-fill { width: 60% !important; }
}
```

- [ ] **Step 6: Create the local static favicon**

Create `site/assets/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Orbiting signals">
  <rect width="64" height="64" rx="14" fill="#F1EEE6"/>
  <circle cx="32" cy="32" r="20" fill="none" stroke="#718999" stroke-width="2"/>
  <circle cx="32" cy="32" r="11" fill="none" stroke="#B86F4B" stroke-width="2"/>
  <circle cx="32" cy="32" r="6" fill="#356351"/>
  <circle cx="48" cy="20" r="3" fill="#B86F4B"/>
  <circle cx="20" cy="45" r="2.5" fill="#718999"/>
</svg>
```

- [ ] **Step 7: Run tests and inspect responsive source contracts**

Run: `node --test tests/site.test.mjs`

Expected: all tests pass.

Run: `node -e "const fs=require('fs');const p=['site/index.html','site/styles.css','site/assets/favicon.svg'];console.log(p.reduce((n,f)=>n+fs.statSync(f).size,0))"`

Expected: a number below `150000`.

- [ ] **Step 8: Commit the visual slice**

```powershell
git add site/styles.css site/assets/favicon.svg tests/site.test.mjs
git commit -m "feat: implement portfolio visual system"
```

### Task 3: Progressive disclosure controller and animation replay

**Files:**
- Create: `site/script.js`
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Consumes: `.project`, `.project-summary`, `details.open`, `.is-preview`, and `.is-animating` from Tasks 1–2.
- Produces: `openPinned(project)`, `closeProject(project)`, `previewProject(project)`, and `restartAnimation(project)` internal functions; no exported API and no network/storage side effects.

- [ ] **Step 1: Add failing interaction-source tests**

Append:

```js
test('enhancement implements pinned and fine-hover states without unsafe DOM APIs', async () => {
  const js = await readSite('script.js');
  assert.match(js, /matchMedia\('\(hover: hover\) and \(pointer: fine\)'\)/);
  assert.match(js, /function openPinned\(project\)/);
  assert.match(js, /function closeProject\(project\)/);
  assert.match(js, /function previewProject\(project\)/);
  assert.match(js, /function restartAnimation\(project\)/);
  assert.doesNotMatch(js, /innerHTML|insertAdjacentHTML|eval\(|localStorage|sessionStorage|fetch\(/);
});
```

- [ ] **Step 2: Run tests and verify RED**

Run: `node --test tests/site.test.mjs`

Expected: the new interaction test fails because `site/script.js` does not exist.

- [ ] **Step 3: Implement the complete enhancement**

Create `site/script.js`:

```js
'use strict';

const projects = [...document.querySelectorAll('.project')];
const fineHover = window.matchMedia('(hover: hover) and (pointer: fine)');
let pinnedProject = null;

function restartAnimation(project) {
  project.classList.remove('is-animating');
  void project.offsetWidth;
  project.classList.add('is-animating');
}

function closeProject(project) {
  project.open = false;
  project.classList.remove('is-preview', 'is-pinned', 'is-animating');
  if (pinnedProject === project) pinnedProject = null;
}

function closeOthers(activeProject) {
  for (const project of projects) {
    if (project !== activeProject) closeProject(project);
  }
}

function openPinned(project) {
  closeOthers(project);
  project.open = true;
  project.classList.remove('is-preview');
  project.classList.add('is-pinned');
  pinnedProject = project;
  restartAnimation(project);
}

function previewProject(project) {
  if (!fineHover.matches || pinnedProject || project.open) return;
  project.open = true;
  project.classList.add('is-preview');
  restartAnimation(project);
}

for (const project of projects) {
  const summary = project.querySelector('.project-summary');

  summary.addEventListener('click', (event) => {
    event.preventDefault();
    const shouldOpen = !project.open || project.classList.contains('is-preview');
    if (shouldOpen) openPinned(project);
    else closeProject(project);
  });

  project.addEventListener('pointerenter', () => previewProject(project));
  project.addEventListener('pointerleave', () => {
    if (project.classList.contains('is-preview')) closeProject(project);
  });
}

fineHover.addEventListener('change', () => {
  for (const project of projects) {
    if (project.classList.contains('is-preview')) closeProject(project);
  }
});
```

- [ ] **Step 4: Run syntax and behavior-contract tests**

Run: `node --check site/script.js`

Expected: no output and exit code 0.

Run: `node --test tests/site.test.mjs`

Expected: all tests pass.

- [ ] **Step 5: Commit the interaction slice**

```powershell
git add site/script.js tests/site.test.mjs
git commit -m "feat: add accessible project interactions"
```

### Task 4: Static security, privacy, artifact, and performance contracts

**Files:**
- Modify: `tests/site.test.mjs`
- Modify as required by failing tests: `site/index.html`, `site/styles.css`, `site/script.js`, `site/assets/favicon.svg`

**Interfaces:**
- Consumes: complete four-file site artifact.
- Produces: executable release-contract coverage for CSP, remote requests, inline code, draft markers, public data, safe SVG, exact manifest, and size budgets.

- [ ] **Step 1: Add failing release-contract tests**

Append:

```js
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
```

- [ ] **Step 2: Run the full suite and verify any new RED failures**

Run: `node --test tests/site.test.mjs`

Expected: failures identify any concrete contract mismatch; do not weaken the tests to accept a mismatch.

- [ ] **Step 3: Make the minimum production corrections**

Change only the production file that violates a test. Do not add suppressions, test exceptions, remote resources, or extra public files.

- [ ] **Step 4: Run all static release checks**

Run: `node --check site/script.js`

Run: `node --test tests/site.test.mjs`

Run: `git diff --check`

Expected: all commands exit 0; the Node suite reports 0 failures; Git prints no whitespace finding.

- [ ] **Step 5: Commit the security-contract slice**

```powershell
git add site tests/site.test.mjs
git commit -m "test: enforce static release contracts"
```

### Task 5: Curated GitHub Pages workflow and operator documentation

**Files:**
- Create: `.github/workflows/pages.yml`
- Create: `README.md`
- Create: `docs/release/predeployment-checklist.md`
- Modify: `tests/site.test.mjs`

**Interfaces:**
- Consumes: exact four-file `site/` artifact and test commands.
- Produces: a disabled-until-authorized Pages workflow contract, operator steps, rollback instructions, and a release evidence template.

- [ ] **Step 1: Add a failing workflow-scope test**

Append:

```js
test('Pages workflow uploads only the curated site directory', async () => {
  const workflow = await readFile(path.join(root, '.github', 'workflows', 'pages.yml'), 'utf8');
  assert.match(workflow, /path:\s*site/);
  assert.doesNotMatch(workflow, /path:\s*\.|docs\/|\.superpowers/);
  assert.match(workflow, /pages:\s*write/);
  assert.match(workflow, /id-token:\s*write/);
});
```

- [ ] **Step 2: Run tests and verify RED**

Run: `node --test tests/site.test.mjs`

Expected: workflow test fails because `.github/workflows/pages.yml` does not exist.

- [ ] **Step 3: Create the reviewed Pages workflow**

Create `.github/workflows/pages.yml` with GitHub-owned actions pinned to the exact commits resolved from the official repositories on 2026-08-01:

```yaml
name: Deploy GitHub Pages

on:
  workflow_dispatch:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
      - uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7.0.0
        with:
          node-version: 24
      - run: node --check site/script.js
      - run: node --test tests/site.test.mjs
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
      - uses: actions/configure-pages@45bfe0192ca1faeb007ade9deae92b16b8254a0d # v6.0.0
      - uses: actions/upload-pages-artifact@fc324d3547104276b827a68afc52ff2a11cc49c9 # v5.0.0
        with:
          path: site
      - id: deployment
        uses: actions/deploy-pages@cd2ce8fcbc39b97be8ca5fce6e763baed58fa128 # v5.0.0
```

Security must verify that each 40-character commit still belongs to the named official GitHub action repository and record the tag-to-SHA mapping in the implementation handoff before commit.

- [ ] **Step 4: Write operator documentation**

Create `README.md` with these exact sections and commands:

````markdown
# Injun Lee — personal work showcase

A dependency-free static site presenting Injun Lee through three human-centered AI systems.

## Preview locally

From the repository root:

```powershell
python -m http.server 8000 --directory site
```

Open `http://localhost:8000/`.

## Verify

```powershell
node --check site/script.js
node --test tests/site.test.mjs
git diff --check
```

## GitHub Pages preparation

The intended public repository is `june74.github.io`. The Pages source is GitHub Actions, and the workflow uploads only `site/`. Repository creation, remote push, public visibility, and Pages enablement require separate owner authorization.

## Hosting and privacy limits

The site requires no paid service. GitHub Pages hosts the files and may log visitor IP addresses for security. The site adds no analytics, forms, browser storage, or nonessential third-party requests. GitHub Pages does not provide repository-configurable custom response headers; production uses a restrictive meta CSP.

## Rollback

For a later release, revert the faulty release with a new commit and push it; do not reset or force-push public history. If the first public release has no known-good predecessor, unpublish Pages in repository settings and verify the public URL is unavailable.
````

Create `docs/release/predeployment-checklist.md` with unchecked evidence fields for commit, tests, responsive widths, keyboard/touch behavior, reduced motion, console/network, accessibility, Lighthouse score/tool version, artifact inventory/bytes, secret scan, commit identity, owner public-information review, account/repository preflight, and explicit deployment authorization.

- [ ] **Step 5: Run workflow and documentation contracts**

Run: `node --test tests/site.test.mjs`

Expected: all tests pass and no workflow scope points outside `site/`.

Run: `git grep -nE 'uses: [^@]+@v[0-9]|uses: [^@]+@(main|master)' -- .github/workflows/pages.yml`

Expected: no output and exit code 1, proving no workflow action floats on a branch or major tag.

- [ ] **Step 6: Commit the deployment-preparation slice**

```powershell
git add .github/workflows/pages.yml README.md docs/release/predeployment-checklist.md tests/site.test.mjs
git commit -m "chore: prepare curated Pages deployment"
```

### Task 6: Integrated browser acceptance and handoff

**Files:**
- Create: `docs/release/local-acceptance.md`
- Modify only for evidence-backed defects: `site/index.html`, `site/styles.css`, `site/script.js`, `site/assets/favicon.svg`, `tests/site.test.mjs`

**Interfaces:**
- Consumes: complete local release candidate.
- Produces: browser evidence for the actual visitor path and a commit ready for owner predeployment review; no public side effect.

- [ ] **Step 1: Run clean static verification**

Run:

```powershell
node --check site/script.js
node --test tests/site.test.mjs
git diff --check
git status --short
```

Expected: syntax and tests pass, diff check is silent, and status shows only the intentional acceptance record while it is being written.

- [ ] **Step 2: Serve the exact site artifact**

Run: `python -m http.server 8000 --directory site`

Expected: `http://localhost:8000/` returns the release-candidate `index.html` and makes no request outside the four-file artifact.

- [ ] **Step 3: Test real visitor interaction states**

In the controlled browser, verify at widths 320, 768, 1024, and 1440 px:

- no horizontal overflow, clipped copy, overlap, or unreadable diagram;
- first viewport identifies Injun and exposes the current-work anchor;
- fine-pointer hover previews only when no project is pinned;
- click, Enter, and Space pin a project; activating another summary switches the pinned project;
- coarse/touch interaction toggles without hover preview;
- JavaScript disabled leaves native disclosures usable;
- reduced motion stops the solar orbits and displays final diagram states;
- Synapse routes start visibly and draw in order;
- June calendar events appear one at a time;
- MM values and suggestions remain legible;
- both GitHub links resolve to the approved profile with new-tab protection;
- console has no errors or CSP violations and network has no unexpected request.

- [ ] **Step 4: Capture local acceptance evidence**

Create `docs/release/local-acceptance.md` containing the tested commit, browser/version, viewport results, input methods, reduced-motion result, no-JavaScript result, console/network result, total artifact bytes, Lighthouse result/tool version, remaining limitations, and the statement `Public deployment not authorized`.

- [ ] **Step 5: Run final reviews**

Have Developer A cross-review Developer B's CSS/JavaScript and have Developer B cross-review Developer A's HTML/tests. Rotate Product in for copy/hierarchy and Security in for workflow/CSP/artifact checks. Record each disposition in `docs/release/local-acceptance.md`.

- [ ] **Step 6: Commit the local acceptance record**

```powershell
git add docs/release/local-acceptance.md
git commit -m "docs: record local portfolio acceptance"
```

- [ ] **Step 7: Stop before public side effects**

Report the release-candidate commit, verification evidence, known GitHub Pages header limitations, unresolved account/repository preflight, and exact owner actions still required. Do not create a GitHub repository, add a remote, push, change repository visibility, or enable Pages without a new explicit authorization.
