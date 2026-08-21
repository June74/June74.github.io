# Synapse Node Tints Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Synapse Prompt match Model B's copper treatment and make Router match Answer's green treatment without changing diagram geometry, copy, motion, or architecture.

**Architecture:** Keep the existing inline SVG and static CSS. Add one semantic class to the existing Prompt rectangle, reuse the two already-approved fill/stroke combinations, and strengthen the existing structural test so future changes cannot separate the paired treatments.

**Tech Stack:** Semantic HTML5, inline SVG, dependency-free CSS, Node.js built-in test runner, controlled Chromium browser.

## Global Constraints

- Prompt uses pale copper `#f0ded3`, `var(--copper)`, and `1.6` stroke width.
- Router uses pale green `#e4ece7`, `var(--forest)`, and `1.4` stroke width.
- Model B and Answer remain unchanged as the visual references.
- Preserve every SVG coordinate, dimension, corner radius, path, label, and animation delay.
- Add no new color token, dependency, asset, request, public information, or JavaScript behavior.
- Keep the existing static, three-accent-color, privacy, accessibility, and GitHub Pages boundaries.

---

### Task 1: Pair Prompt and Router with their reference nodes

**Files:**
- Modify: `tests/site.test.mjs:524-533`
- Modify: `site/index.html:48`
- Modify: `site/styles.css:81-89`

**Interfaces:**
- Consumes: the existing `cssProperty(css, selector, property)` test helper, `.diagram-box`, `.model-selected`, `.answer-box`, `.router-box`, and the `--copper` / `--forest` tokens.
- Produces: `.prompt-box` as the Prompt-specific SVG surface contract and an updated `.router-box` fill contract.

- [ ] **Step 1: Write the failing paired-node contract**

Replace the existing `Synapse router is a light outlined diagram node` test with:

```js
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
});
```

- [ ] **Step 2: Run the focused contract and confirm RED**

Run:

```powershell
node --test --test-name-pattern="Synapse entry nodes reuse" tests/site.test.mjs
```

Expected: one failure because the Prompt rectangle lacks `prompt-box`, `.prompt-box` has no declarations, and Router still uses `#fcfbf7`.

- [ ] **Step 3: Apply the minimal SVG and CSS treatment**

Change the Prompt rectangle in `site/index.html` to:

```html
<rect class="diagram-box prompt-box" x="18" y="82" width="112" height="56" rx="9"/>
```

Keep `.diagram-box` unchanged and add the Prompt rule immediately after it:

```css
.prompt-box { fill: #f0ded3; stroke: var(--copper); stroke-width: 1.6; }
```

Change only the Router fill in its existing rule:

```css
.router-box { fill: #e4ece7; stroke: var(--forest); stroke-width: 1.4; }
```

- [ ] **Step 4: Run the focused contract and confirm GREEN**

Run:

```powershell
node --test --test-name-pattern="Synapse entry nodes reuse" tests/site.test.mjs
```

Expected: one passing test and zero failures.

- [ ] **Step 5: Run the complete static verification**

Run:

```powershell
node --test tests/site.test.mjs
node --check site/script.js
node --check tests/site.test.mjs
git diff --check
```

Expected: all tests pass, both syntax checks exit zero, and the diff check emits no errors.

- [ ] **Step 6: Commit the implementation slice**

```powershell
git add site/index.html site/styles.css tests/site.test.mjs
git commit -m "tint Synapse prompt and router nodes"
```

---

### Task 2: Review and preview the real implementation

**Files:**
- Modify: `docs/release/local-acceptance.md`
- Read: `site/index.html`, `site/styles.css`, `site/script.js`, `tests/site.test.mjs`

**Interfaces:**
- Consumes: Task 1's `.prompt-box` and updated `.router-box` contracts plus the existing disclosure/replay controller.
- Produces: local-browser acceptance evidence and an owner-visible real-site preview; no public deployment occurs before owner approval.

- [ ] **Step 1: Complete independent product/security review**

Review `origin/main...HEAD` for exact spec alignment, three-color preservation, accessibility, responsive behavior, static security boundary, test quality, and absence of unrelated changes. Required disposition: no unresolved Critical or Important findings before preview.

- [ ] **Step 2: Exercise the expanded Synapse diagram at desktop width**

Open the local static preview at `http://127.0.0.1:8000/`, expand Synapse, and record:

```text
Prompt: fill rgb(240, 222, 211), stroke rgb(184, 111, 75), stroke width 1.6px
Router: fill rgb(228, 236, 231), stroke rgb(53, 99, 81), stroke width 1.4px
Selected route: stroke dash offset moves from 180px to 0px
Answer copy: opacity reaches 1
Console: zero warnings or errors
```

- [ ] **Step 3: Exercise responsive fit**

At 390 by 844 and 1440 by 900 CSS pixels, confirm `document.documentElement.scrollWidth === document.documentElement.clientWidth`, both tinted nodes remain fully inside the SVG viewport, and labels remain readable.

- [ ] **Step 4: Record local evidence**

Append a dated Synapse node tint section to `docs/release/local-acceptance.md` with the tested commit, automated results, browser results, reviewer disposition, and the explicit statement that this is local preview evidence rather than a public deployment.

- [ ] **Step 5: Commit the acceptance record**

```powershell
git add docs/release/local-acceptance.md
git commit -m "record Synapse node tint acceptance"
```

- [ ] **Step 6: Show the real preview and wait for owner release approval**

Leave the local page open at the expanded Synapse diagram. Do not push, merge, or run GitHub Pages until the owner approves the actual implementation preview.
