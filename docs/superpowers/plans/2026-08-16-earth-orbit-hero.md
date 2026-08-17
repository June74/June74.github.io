# Earth Orbit Hero Implementation Plan

> **For agentic workers:** Use the existing static-site workflow and implement these steps inline with test-first checks.

**Goal:** Replace the home hero juggler with a data-driven rotating Earth and orbiting project initials, while renaming June to Vision everywhere.

**Architecture:** Keep the inline SVG local to `site/index.html`. The external progressive-enhancement script reads the existing home project disclosures and safely creates one SVG ring and marker per project with DOM/SVG APIs. The HTML contains the Earth, orbit layer, and accessible legend shell so the page remains meaningful without JavaScript.

**Tech Stack:** Semantic HTML, inline SVG, CSS custom-property tokens and keyframes, vanilla JavaScript, Node's built-in test runner.

---

### Task 1: Update the regression contract

**Files:**
- Modify: `tests/site.test.mjs`

- [x] Replace the old juggler assertions with an Earth-orbit contract that checks the SVG label, Earth class, orbit layer, initial markers, Vision copy, reduced-motion rules, and data-driven script hook.
- [x] Add a mutation check that adds a fourth project disclosure and verifies the orbit renderer uses all four project entries.
- [x] Run `node --test --test-name-pattern "hero|person-first|project descriptions" tests/site.test.mjs` and confirm the changed contract is red before implementation.

### Task 2: Replace the hero artwork

**Files:**
- Modify: `site/index.html`

- [x] Replace `.juggle-signature` and its SVG with `.orbit-signature` containing an inline SVG viewBox, a labeled illustrated Earth, an empty `data-orbit-layer`, and an accessible `data-orbit-labels` legend.
- [x] Use original local paths and circles for soft land shapes, latitude lines, and three visual ring accents; do not add remote assets or links.
- [x] Change the June project name, case-study link label, and visible copy to Vision while preserving its existing purpose statement and diagram.

### Task 3: Add Earth and orbit styling

**Files:**
- Modify: `site/styles.css`

- [x] Remove juggler-only selectors and keyframes.
- [x] Add `.orbit-signature`, `.orbit-stage`, `.earth-sphere`, `.earth-surface`, `.project-orbit`, `.orbit-ring`, `.orbit-marker`, and `.orbit-legend` rules using existing palette tokens.
- [x] Animate the Earth surface and orbit groups slowly; counter-rotate marker faces so initials stay upright.
- [x] Add reduced-motion rules that set all transforms and animations to a readable static frame.
- [x] Keep the existing desktop/mobile hero grid and ensure the illustration remains within its column at 320–1440 px.

### Task 4: Make project rings data-driven

**Files:**
- Modify: `site/script.js`

- [x] Add a renderer that reads `.project[data-project]` and `.project-name` from the home page, derives a safe uppercase initial, and appends a ring and marker to the SVG using `createElementNS` and `textContent` only.
- [x] Set each ring radius, animation duration, and marker label from the project index; avoid `innerHTML`, network calls, URL mutation, or dynamic script creation.
- [x] Update the accessible legend text from the same project list.
- [x] No-op cleanly on nested routes without project disclosures.

### Task 5: Rename Vision on every route

**Files:**
- Modify: `site/projects/index.html`
- Add: `site/projects/vision/index.html`
- Delete: `site/projects/june/index.html`
- Modify: `site/index.html`
- Modify: `tests/site.test.mjs`

- [x] Update every visible June heading and navigation label to Vision while keeping the existing relative destination safe.
- [x] Add a test that rejects visible `June` on public HTML and requires `Vision` in the project index and case-study route.

### Task 6: Verify and document

**Files:**
- Modify: `docs/release/local-acceptance.md`

- [x] Run `node --check site/script.js`.
- [x] Run `node --test tests/site.test.mjs` and require zero failures.
- [x] Run `git diff --check`.
- [x] Use the local browser at `http://localhost:52125/` to confirm the Earth is visible, the three initials orbit, Home → Projects → Vision navigation works, all routes have no horizontal overflow, and the browser console has no warnings/errors.
- [x] Record the new hero and Vision rename in the acceptance evidence without claiming public deployment.
