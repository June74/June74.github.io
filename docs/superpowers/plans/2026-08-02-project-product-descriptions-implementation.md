# Project Product Descriptions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the three contribution-led project summaries with the owner-approved product definitions and publish the verified copy through GitHub Pages.

**Architecture:** Keep the current static HTML and native disclosure structure. Strengthen the existing person-first content contract to require the exact three descriptions and reject the former contribution-led wording, then replace only the three `.project-line` text nodes.

**Tech Stack:** Semantic HTML5, dependency-free CSS/JavaScript, Node.js built-in test runner, controlled Chromium browser, GitHub Pages.

## Global Constraints

- Synapse: `An AI routing system that analyzes each prompt and matches it with a suitable model.`
- June: `An AI secretary that brings scheduling, tasks, reminders, and follow-ups into one place.`
- MM: `A personal finance tracker that turns spending patterns into clear insights and practical suggestions.`
- Replace only the three `.project-line` strings in the public artifact.
- Preserve project names, numbers, topics, diagrams, layout, typography, animation, links, and disclosure behavior.
- Add no status language, completion claim, financial-advice claim, dependency, asset, request, or external service.
- Keep the existing static, three-accent-color, privacy, security, accessibility, and GitHub Pages boundaries.

---

### Task 1: Replace and lock the three product descriptions

**Files:**
- Modify: `tests/site.test.mjs:502-511`
- Modify: `site/index.html:41,72,96`
- Modify: `docs/release/local-acceptance.md`

**Interfaces:**
- Consumes: the existing `readSite('index.html')` helper and `.project-line` summary structure.
- Produces: the three exact owner-approved public product descriptions; no runtime interface changes.

- [ ] **Step 1: Write the failing exact-copy contract**

Replace the contribution assertions in `page contains the approved person-first content` with:

```js
  const productDescriptions = [
    'An AI routing system that analyzes each prompt and matches it with a suitable model.',
    'An AI secretary that brings scheduling, tasks, reminders, and follow-ups into one place.',
    'A personal finance tracker that turns spending patterns into clear insights and practical suggestions.',
  ];
  for (const description of productDescriptions) {
    assert.equal(html.split(description).length - 1, 1, `${description} appears exactly once`);
  }
  assert.doesNotMatch(html, /I own the product direction/i);
```

- [ ] **Step 2: Run focused RED**

Run:

```powershell
node --test --test-name-pattern="page contains the approved person-first content" tests/site.test.mjs
```

Expected: failure because none of the three approved product descriptions appears in `site/index.html`.

- [ ] **Step 3: Replace only the three summary sentences**

Use these exact `.project-line` values in `site/index.html`:

```html
<span class="project-line">An AI routing system that analyzes each prompt and matches it with a suitable model.</span>
<span class="project-line">An AI secretary that brings scheduling, tasks, reminders, and follow-ups into one place.</span>
<span class="project-line">A personal finance tracker that turns spending patterns into clear insights and practical suggestions.</span>
```

Do not change surrounding markup or any other copy.

- [ ] **Step 4: Run focused GREEN**

Run the Step 2 command again.

Expected: one passing test and zero failures.

- [ ] **Step 5: Run full static verification**

```powershell
node --test tests/site.test.mjs
node --check site/script.js
node --check tests/site.test.mjs
git diff --check
```

Expected: all 37 tests pass, both syntax checks exit zero, and the diff check emits no errors.

- [ ] **Step 6: Commit the implementation**

```powershell
git add site/index.html tests/site.test.mjs
git commit -m "describe projects by product purpose"
```

- [ ] **Step 7: Verify the real collapsed summaries**

Reload `http://127.0.0.1:8000/` and confirm all three exact sentences are visible while their projects are collapsed. At 390 by 844 and 1440 by 900 CSS pixels, confirm no clipping or horizontal overflow and zero browser console warnings/errors.

- [ ] **Step 8: Record local acceptance**

Append the candidate commit, exact-copy result, responsive result, console result, reviewer disposition, and explicit local-only boundary to `docs/release/local-acceptance.md`, then commit it with subject `record project description acceptance`.

- [ ] **Step 9: Publish and verify**

Push `codex/project-product-descriptions`, open a ready pull request to `main`, merge the reviewed head, wait for the Pages test and deploy jobs, then verify the three exact sentences, responsive fit, console, HTTPS `200`, and expected headers at `https://june74.github.io/`.
