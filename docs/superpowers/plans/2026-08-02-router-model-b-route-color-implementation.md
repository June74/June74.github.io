# Router-to-Model-B Route Color Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make only the Router-to-Model-B route segment match the Router's forest outline while preserving the copper outer selected-route segments.

**Architecture:** Keep the current inline SVG, classes, paths, animation controller, and timing. Add one higher-specificity CSS override for the already-semantic `.route-b.route-selected` element and extend the existing static contract to lock the intended three-segment color sequence.

**Tech Stack:** Semantic HTML5, inline SVG, dependency-free CSS, Node.js built-in test runner, controlled Chromium browser.

## Global Constraints

- Router-to-Model-B uses `var(--forest)`, matching the Router outline.
- Prompt-to-Router and Model-B-to-Answer remain `var(--copper)`.
- Preserve every SVG class, coordinate, path, label, stroke width, animation delay, and JavaScript behavior.
- Add no color token, dependency, asset, request, public information, or external service.
- Keep the existing static, three-accent-color, privacy, accessibility, and GitHub Pages boundaries.

---

### Task 1: Lock and apply the Router-to-Model-B forest segment

**Files:**
- Modify: `tests/site.test.mjs:524-547`
- Modify: `site/styles.css:87-90`
- Modify: `docs/release/local-acceptance.md`

**Interfaces:**
- Consumes: the existing `.route-selected`, `.route-b`, `.router-box`, `.route-inbound`, and `.route-answer` selectors and `cssProperty(css, selector, property)` helper.
- Produces: `.route-b.route-selected` as the route-segment color contract; no markup or runtime interface changes.

- [ ] **Step 1: Write the failing route-color contract**

Add these assertions to the existing `Synapse entry nodes reuse the selected and answer treatments` test after the Router assertions:

```js
  assert.match(html, /<path class="route route-inbound route-selected" d="M130 110 C151 110 161 110 181 110"\/>/);
  assert.match(html, /<path class="route route-b route-selected" d="M267 110 C290 92 304 76 330 75"\/>/);
  assert.match(html, /<path class="route route-answer route-selected" d="M406 75 C427 75 438 95 456 103"\/>/);
  assert.equal(cssProperty(css, '.route-selected', 'stroke'), 'var(--copper)');
  assert.equal(cssProperty(css, '.route-b.route-selected', 'stroke'), 'var(--forest)');
  assert.equal(cssProperty(css, '.route-b.route-selected', 'stroke'), cssProperty(css, '.router-box', 'stroke'));
  assert.doesNotMatch(css, /\.route-(?:inbound|answer)\.route-selected\s*\{[^}]*stroke\s*:/i);
```

- [ ] **Step 2: Run the focused contract and confirm RED**

Run:

```powershell
node --test --test-name-pattern="Synapse entry nodes reuse" tests/site.test.mjs
```

Expected: one failure stating that `.route-b.route-selected` must exist or declare `stroke`; the current shared selected-route stroke is still copper.

- [ ] **Step 3: Add the minimal forest override**

Immediately after the existing shared selected-route rule in `site/styles.css`, add:

```css
.route-b.route-selected { stroke: var(--forest); }
```

Do not change `.route-selected`, any SVG markup, or any animation rule.

- [ ] **Step 4: Run the focused contract and confirm GREEN**

Run the focused command from Step 2 again.

Expected: one passing test and zero failures.

- [ ] **Step 5: Run full static verification**

Run:

```powershell
node --test tests/site.test.mjs
node --check site/script.js
node --check tests/site.test.mjs
git diff --check
```

Expected: all 37 tests pass, both syntax checks exit zero, and the diff check emits no errors.

- [ ] **Step 6: Exercise the real diagram**

Reload `http://127.0.0.1:8000/`, expand Synapse, and confirm after animation completion:

```text
Prompt-to-Router stroke: rgb(184, 111, 75)
Router-to-Model-B stroke: rgb(53, 99, 81)
Model-B-to-Answer stroke: rgb(184, 111, 75)
All three selected segments: stroke dash offset 0px
Answer copy: opacity 1
Console: zero warnings or errors
```

At 390 by 844 and 1440 by 900 CSS pixels, confirm no horizontal overflow and the diagram remains fully contained.

- [ ] **Step 7: Record local-preview evidence**

Append a dated route-color addendum to `docs/release/local-acceptance.md` containing the tested commit, computed colors, completed animation state, responsive result, console result, reviewer disposition, and an explicit statement that this is not deployment evidence.

- [ ] **Step 8: Commit the implementation and acceptance record**

```powershell
git add site/styles.css tests/site.test.mjs docs/release/local-acceptance.md
git commit -m "color Router to Model B route"
```
