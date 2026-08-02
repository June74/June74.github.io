# Portfolio Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the approved compact hero signature, outlined Synapse router, and four-step June task animation without changing the portfolio's content boundary or dependency-free architecture.

**Architecture:** Keep the existing static HTML/CSS/JavaScript structure. Each visual revision is one sequential test-first slice because all slices share `site/styles.css` and `tests/site.test.mjs`; the existing disclosure controller and animation replay boundary remain unchanged.

**Tech Stack:** Semantic HTML5, dependency-free CSS, inline SVG, vanilla JavaScript, Node.js built-in test runner.

**Execution status:** Complete and locally accepted on 2026-08-02. The task checkboxes below are preserved as the immutable implementation recipe; execution evidence is recorded in `.superpowers/sdd/progress.md` and `docs/release/local-acceptance.md`.

## Global Constraints

- The complete hero heading remains exposed as `Injun Lee. I build AI systems around people.` and contains no “I am” phrase.
- `Injun Lee.` uses the approved compact humanist sans-serif treatment with a short copper rule; the serif thesis is smaller than the current release.
- Synapse's router uses a light fill, visible forest outline, and readable dark text without changing SVG geometry or route timing.
- All four June task markers begin empty during animation and complete sequentially with unique start times.
- Reopening June restarts the sequence; reduced-motion and no-animation states show the completed final frame.
- Do not change `site/script.js`, page structure, project copy, three-color palette, outbound destinations, hosting, privacy boundary, or public-information boundary.
- Add no dependency, remote font, image, script, analytics, form, storage, or network request.

---

### Task 1: Compact personal hero signature

**Files:**
- Modify: `tests/site.test.mjs` near the existing person-first content test
- Modify: `site/index.html:22-26`
- Modify: `site/styles.css:26-31,160-174`

**Interfaces:**
- Consumes: the existing `.hero`, `.hero-copy`, `h1`, `--display`, `--sans`, and `--copper` contracts.
- Produces: `.hero-name` for the compact identity signature and `.hero-thesis-line` for the two display lines.

- [ ] **Step 1: Write the failing hero contract**

Add this focused test after `page contains the approved person-first content`:

```js
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
```

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```powershell
node --test --test-name-pattern "hero uses the approved compact personal signature" tests/site.test.mjs
```

Expected: FAIL because the existing `h1` has no `.hero-name` or `.hero-thesis-line` classes and still uses the oversized type scale.

- [ ] **Step 3: Implement the minimal hero markup and CSS**

Replace the hero heading with:

```html
<h1><span class="hero-name">Injun Lee.</span><span class="hero-thesis-line">I build AI systems</span><span class="hero-thesis-line">around people.</span></h1>
```

Replace the current hero heading rules with:

```css
.hero h1 { margin: 0; font: 500 clamp(2.65rem, 4.6vw, 4.65rem)/.94 var(--display); letter-spacing: -.05em; }
.hero h1 span { display: block; }
.hero-name { width: max-content; margin-bottom: 1.25rem; font: 680 clamp(1.75rem, 3vw, 2.2rem)/1 var(--sans); letter-spacing: -.045em; }
.hero-name::after { content: ''; display: block; width: 42px; height: 2px; margin-top: .75rem; background: var(--copper); }
```

Update the responsive heading sizes to:

```css
@media (max-width: 820px) {
  .hero h1 { font-size: clamp(2.8rem, 12vw, 4.6rem); }
}

@media (max-width: 420px) {
  .hero h1 { font-size: clamp(2.5rem, 12vw, 3.4rem); }
}
```

- [ ] **Step 4: Run focused and full tests and verify GREEN**

Run:

```powershell
node --test --test-name-pattern "approved person-first content|hero uses the approved compact personal signature|mobile layout" tests/site.test.mjs
node --test tests/site.test.mjs
```

Expected: the focused selection and full suite pass with zero failures.

- [ ] **Step 5: Commit Task 1**

```powershell
git add site/index.html site/styles.css tests/site.test.mjs
git commit -m "refine portfolio hero signature"
```

---

### Task 2: Outlined Synapse router node

**Files:**
- Modify: `tests/site.test.mjs` after the hero contract
- Modify: `site/styles.css:77-87`

**Interfaces:**
- Consumes: the existing `.router-box`, `.router-label`, `.router-subtitle`, `--forest`, and diagram node palette.
- Produces: an outlined light router node; no SVG markup or geometry changes.

- [ ] **Step 1: Write the failing router contract**

```js
test('Synapse router is a light outlined diagram node', async () => {
  const css = await readSite('styles.css');

  assert.equal(cssProperty(css, '.router-box', 'fill'), '#fcfbf7');
  assert.equal(cssProperty(css, '.router-box', 'stroke'), 'var(--forest)');
  assert.equal(cssProperty(css, '.router-box', 'stroke-width'), '1.4');
  assert.equal(cssProperty(css, '.router-label', 'fill'), 'var(--forest) !important');
  assert.equal(cssProperty(css, '.router-subtitle', 'fill'), '#596159 !important');
  assert.equal(cssProperty(css, '.router-subtitle', 'opacity'), '1');
});
```

- [ ] **Step 2: Run the focused test and verify RED**

```powershell
node --test --test-name-pattern "Synapse router is a light outlined diagram node" tests/site.test.mjs
```

Expected: FAIL because `.router-box` currently uses a solid forest fill and has no outline.

- [ ] **Step 3: Apply the minimal router CSS**

```css
.router-box { fill: #fcfbf7; stroke: var(--forest); stroke-width: 1.4; }
.router-label { fill: var(--forest) !important; font-weight: 700 !important; }
.router-subtitle { fill: #596159 !important; opacity: 1; }
```

- [ ] **Step 4: Run focused and full tests and verify GREEN**

```powershell
node --test --test-name-pattern "Synapse router is a light outlined diagram node|diagram secondary captions" tests/site.test.mjs
node --test tests/site.test.mjs
```

Expected: both commands pass with zero failures.

- [ ] **Step 5: Commit Task 2**

```powershell
git add site/styles.css tests/site.test.mjs
git commit -m "outline the Synapse router node"
```

---

### Task 3: Four-step June completion sequence

**Files:**
- Modify: `tests/site.test.mjs` after the router contract
- Modify: `site/index.html:78-88`
- Modify: `site/styles.css:117-122,179-186`

**Interfaces:**
- Consumes: `.task`, `.project.is-animating`, `@keyframes check-task`, and the existing animation restart controller.
- Produces: `.task-one`, `.task-two`, `.task-three`, and `.task-four` as ordered task-sequence markers.

- [ ] **Step 1: Write the failing June sequence contract**

```js
test('June animates all four completion markers in sequence', async () => {
  const html = await readSite('index.html');
  const css = await readSite('styles.css');
  const june = html.match(/<details class="project" data-project="june">([\s\S]*?)<\/details>/);

  assert.ok(june, 'June project exists');
  const taskClasses = [...june[1].matchAll(/<p class="task (task-(?:one|two|three|four))">/g)].map((match) => match[1]);
  assert.deepEqual(taskClasses, ['task-one', 'task-two', 'task-three', 'task-four']);
  assert.match(css, /\.project\.is-animating \.task::before\s*\{[^}]*background:\s*transparent[^}]*color:\s*transparent/i);

  const delays = [...css.matchAll(/\.project\.is-animating \.task-(?:one|two|three|four)::before\s*\{[^}]*animation:\s*check-task\s+\.42s\s+ease-out\s+([\d.]+s)\s+forwards/g)].map((match) => match[1]);
  assert.deepEqual(delays, ['1.82s', '2.15s', '2.48s', '2.81s']);
  assert.equal(new Set(delays).size, 4);

  const reducedMotion = cssAtRuleBody(css, '@media (prefers-reduced-motion: reduce)');
  assert.match(reducedMotion, /\.project\.is-animating \.task::before\s*\{[^}]*animation:\s*none\s*!important[^}]*background:\s*var\(--forest\)\s*!important[^}]*color:\s*#fff\s*!important/i);
});
```

- [ ] **Step 2: Run the focused test and verify RED**

```powershell
node --test --test-name-pattern "June animates all four completion markers in sequence" tests/site.test.mjs
```

Expected: FAIL because the third and fourth task rows have no sequence classes and begin in the completed base state.

- [ ] **Step 3: Add the two missing task classes**

Use this exact task list:

```html
<div class="todo-card"><div class="mini-heading"><span>To-do</span><span>4 items</span></div><p class="task task-one">Confirm appointment</p><p class="task task-two">Prepare weekly plan</p><p class="task task-three">Send follow-up</p><p class="task task-four">Block focus time</p></div>
```

- [ ] **Step 4: Generalize the empty state and add unique completion delays**

```css
.project.is-animating .task::before { border-color: #9ba59e; background: transparent; color: transparent; }
.project.is-animating .task-one::before { animation: check-task .42s ease-out 1.82s forwards; }
.project.is-animating .task-two::before { animation: check-task .42s ease-out 2.15s forwards; }
.project.is-animating .task-three::before { animation: check-task .42s ease-out 2.48s forwards; }
.project.is-animating .task-four::before { animation: check-task .42s ease-out 2.81s forwards; }
```

Replace the reduced-motion task rule with:

```css
.project.is-animating .task::before { animation: none !important; border-color: var(--forest) !important; background: var(--forest) !important; color: #fff !important; }
```

- [ ] **Step 5: Run focused and full tests and verify GREEN**

```powershell
node --test --test-name-pattern "June animates all four completion markers in sequence|project diagrams have no-JS final states" tests/site.test.mjs
node --test tests/site.test.mjs
```

Expected: both commands pass with zero failures.

- [ ] **Step 6: Commit Task 3**

```powershell
git add site/index.html site/styles.css tests/site.test.mjs
git commit -m "sequence all June task completions"
```

---

### Task 4: Integrated acceptance and preview handoff

**Files:**
- Modify: `docs/release/local-acceptance.md`

**Interfaces:**
- Consumes: the committed outputs and test evidence from Tasks 1–3.
- Produces: durable local acceptance evidence for this revision and the verified in-app browser preview shown to the owner.

- [ ] **Step 1: Run complete automated verification**

```powershell
node --check site/script.js
node --check tests/site.test.mjs
node --test tests/site.test.mjs
git diff --check origin/main...HEAD
```

Expected: both syntax checks pass, every automated test passes, and the whole branch diff has no whitespace errors.

- [ ] **Step 2: Run the tracked-source security boundary scan**

Use the existing test suite plus a tracked-file scan to confirm zero provider-shaped secrets, unapproved remote URLs, draft markers, remote assets, or new dependencies. Expected: zero findings.

- [ ] **Step 3: Exercise the real browser behaviors**

Reload `http://127.0.0.1:8000/` in the in-app browser, then:

- inspect the hero at 1440 px, 820 px, 420 px, and 320 px without horizontal overflow;
- open Synapse and confirm its router is light and outlined while route drawing still completes;
- open June and confirm all four markers begin empty, complete one-by-one, and replay after close/reopen;
- verify the reduced-motion final state and zero browser console errors.

- [ ] **Step 4: Record the revision evidence**

Append a dated portfolio-polish section to `docs/release/local-acceptance.md` containing the exact branch/commit, automated counts, viewport results, Synapse/June behavior results, reduced-motion result, console result, and the boundary that this local revision is not deployed until a later push/merge.

- [ ] **Step 5: Dispatch whole-branch review and resolve findings**

Dispatch product/security/code review against `git merge-base origin/main HEAD`. Resolve every Critical or Important finding and rerun its covering checks before presenting the preview.

- [ ] **Step 6: Commit Task 4**

```powershell
git add docs/release/local-acceptance.md
git commit -m "record portfolio polish acceptance"
```
