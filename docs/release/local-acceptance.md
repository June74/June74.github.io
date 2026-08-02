# Local acceptance evidence

This record captures local release-candidate observations only. It does not prove or authorize a public release.

- Evidence date: 2026-08-02 (CDT)
- Local candidate reference: `30b8519ae7cd0d527ab9b48fdb9bebbd7ac9ba71` (`fix: preserve footer hover contrast`)
- Browser-observation reference for the visual-accessibility correction: `6f15536` (`fix: strengthen visual accessibility cues`)
- Review note: local product-alignment and security reviews approved the integrated implementation with no findings. The independent keyboard and MM reviews remained approved, and the `30b8519` footer-hover correction was independently reviewed and tested
- Preview origin: `http://127.0.0.1:8000/`
- Browser: controlled Codex in-app Chromium browser; the exact browser version was not exposed in the recorded session
- Current disposition: **local implementation accepted and prepared for owner predeployment review**. Five-participant product validation, owner release review and authorization, Lighthouse/native-browser gaps, deployment, and real-URL acceptance remain open
- **Public deployment not authorized**

## Served artifact

The exact `site/` directory was served with Python's static HTTP server. A direct request to `http://127.0.0.1:8000/` returned HTTP `200` and the expected portfolio document.

The locally inspected artifact contains four files and totals 28,394 bytes:

| File | Bytes |
| --- | ---: |
| `site/index.html` | 10,820 |
| `site/styles.css` | 14,494 |
| `site/script.js` | 2,604 |
| `site/assets/favicon.svg` | 476 |

## Responsive browser evidence

| Viewport | Result |
| --- | --- |
| 1440 by 1000 | Document client width equaled scroll width, so no horizontal overflow was present. The hero and footer used their intended two-column layouts. All three project summaries were present. Keyboard focus rendered a 3 px copper outline. The browser console contained no warnings or errors. |
| 820 by 1000 | After reloading `6f15536`, document client width and scroll width both measured 805 px, so no horizontal overflow was present. The hero and footer collapsed to one column, June was open, and the corrected secondary labels rendered in forest. The browser console contained no warnings or errors. |
| 390 by 844 | Document client width equaled scroll width. The hero and footer used one column. All three projects and the footer were visually inspected without overlap or clipped horizontal content. |

The approved implementation supports narrower widths through CSS, but this evidence record does not claim a native-browser check at every width listed in the broader test plan.

## Input and disclosure behavior

- Pointer click pinned Synapse and exposed its expanded visual.
- With June open, pressing `Enter` on MM switched the pinned disclosure from June to MM; a second `Enter` closed MM.
- With June open, pressing `Space` on MM switched the pinned disclosure from June to MM.
- Keyboard focus used the visible 3 px copper outline recorded above.
- Automated interaction checks and independent review cover fine-pointer hover preview, replay behavior, and the footer hover correction. The footer hover contrast was tested at 14.35:1. Native fine-pointer hover replay was not independently exercised through the controlled browser capability in this pass.
- Native JavaScript-disabled behavior was not independently exercised in this pass; progressive disclosure behavior remains covered by the static/automated contract.

## Motion and diagram evidence

- Synapse routing strokes were observed progressing from a `180px` dash offset to `0px`, showing that the routing lines draw into their completed state.
- June displayed five calendar events after its animation, with event timing checked as sequential rather than simultaneous.
- Reduced-motion behavior is covered by automated/static checks. The controlled browser capability did not expose native reduced-motion emulation for this pass, so this record does not claim a native-browser reduced-motion result.
- MM's reconciled visual displayed `This week $300`, `Weekly plan $500`, `Spent $300`, and `$200 remaining`. The values reconcile arithmetically, remained visible at 820 by 1000, and produced no browser console warnings or errors.

## Automated verification

At `30b8519ae7cd0d527ab9b48fdb9bebbd7ac9ba71`, `node --check site/script.js` passed and `node --test tests/site.test.mjs` reported 33 passing tests with no failures, skips, cancellations, or todo tests. `git diff --check` passed across the whole feature range from merge base `d3d0e8f` through the candidate, and the worktree was clean before this ledger-only refresh.

## Local review disposition

- Product-alignment review: approved with no findings after the visual-accessibility and footer-hover corrections.
- Security review: approved with no findings for the local static implementation.
- Accessibility contrast evidence: secondary labels use forest on the light surface; footer hover text measured 14.35:1.
- Scope boundary: these local reviews do not replace participant validation, owner authorization, hosting checks, or real-public-URL security acceptance.

## Checks not yet closed

- Complete the five-participant validation recorded as pending in `docs/release/product-validation.md`; no participant results have been collected yet.
- Record a Lighthouse run and tool version if it remains part of the release gate.
- Complete any native-browser gaps required by the final release decision, including reduced-motion emulation, hover replay, and JavaScript-disabled behavior where the available tooling permits them.
- Complete the owner release review of public copy, metadata, commit identity, repository/account preflight, and the exact release commit.
- Obtain separate owner authorization before any repository publication, push, visibility change, or GitHub Pages deployment.

## Public-release boundary

GitHub Pages has not been enabled and no public URL has been accepted. Live-URL availability, HTTPS behavior, response headers, redirects, public console/network behavior, and final hosted-artifact confirmation remain pending a separate owner authorization and an actual deployment. This local implementation is prepared, not publicly released or production-verified.

---

## Portfolio-polish acceptance — 2026-08-02

This addendum records local evidence for `codex/portfolio-polish` through candidate `fbde71d`. It covers only the approved hero, Synapse router, and June task-marker refinements. It does not represent a deployment or a test of the public GitHub Pages URL.

### Browser evidence

- Hero: the accessible heading reads “Injun Lee. I build AI systems around people.” and contains no “I am” prefix. The name uses the compact sans-serif signature treatment with a 42 by 2 px copper rule, while the thesis remains serif.
- Responsive layout: at 1440, 820, 420, and 320 CSS pixels, the document client width equaled its scroll width and the hero name remained inside the viewport. The heading measured approximately 66.24, 73.6, 50.4, and 40 px respectively.
- Synapse: the router renders with a clear `rgb(252, 251, 247)` surface, forest `rgb(53, 99, 81)` outline and label, and 1.4 px stroke. The selected route progressed from a 180 px dash offset to 0 px and revealed the answer.
- June: all four task markers were transparent immediately after opening, with their empty outlines using the approved forest token for clear non-text contrast. During a fresh replay, completed-marker counts progressed monotonically from 0 to 1 to 2 to 3 to 4; closing and reopening reset the count to 0 before the sequence replayed.
- Console: the controlled in-app Chromium browser reported no warnings or errors during the Synapse and June interaction checks.
- Reduced motion: the automated contract verifies the final visible state under `prefers-reduced-motion: reduce`. The controlled browser did not expose native media-preference emulation, so no native reduced-motion claim is made here.

### Automated evidence

- `node --test tests/site.test.mjs`: 37 passing tests; 0 failures, skips, cancellations, or todo tests.
- `node --check site/script.js`: passed.
- `node --check tests/site.test.mjs`: passed.
- `git diff --check origin/main...HEAD`: passed before this evidence-only update.
- A tracked-source scan for provider-shaped credential literals reported `tracked_secret_matches=0`. No external runtime request, analytics, form, backend, or dependency was introduced.

### Disposition

The three requested polish changes are locally accepted for owner preview. The branch remains local and ahead of `origin/main`; it has not been pushed, merged, or deployed as part of this pass. Public-release gates and real-URL acceptance remain unchanged.

---

## Synapse node-tint acceptance — 2026-08-02

This addendum records local browser evidence for implementation commit `a7433cd` on `codex/synapse-node-tints`. It covers only the owner-approved Prompt and Router surface treatments. It is local-preview evidence, not a public deployment.

### Automated evidence

- The focused `Synapse entry nodes reuse the selected and answer treatments` contract passed.
- `node --test tests/site.test.mjs`: 37 passing tests with zero failures.
- `node --check site/script.js` and `node --check tests/site.test.mjs`: passed.
- `git diff --check`: passed; Git emitted only the repository's expected LF-to-CRLF working-tree notices.

### Browser evidence

- At 1280 by 720 CSS pixels, Prompt rendered with `rgb(240, 222, 211)` fill, `rgb(184, 111, 75)` stroke, and `1.6px` stroke width.
- At the same viewport, Router rendered with `rgb(228, 236, 231)` fill, `rgb(53, 99, 81)` stroke, and `1.4px` stroke width.
- The selected route completed at a `0px` dash offset and the answer copy reached opacity `1`, confirming that the existing routing animation still completes.
- At 390 by 844 and 1440 by 900 CSS pixels, the document client width equaled its scroll width and both tinted nodes remained fully inside the SVG viewport.
- The browser console reported zero warnings or errors during the interaction check.

### Review disposition

- Independent task review found no Critical or Important issues and approved the implementation/test quality.
- The only Minor observation was a stale pre-commit sentence in the implementer handoff; the handoff was corrected after the primary agent completed commit `a7433cd`.
- No dependency, asset, request, token, script behavior, public information, or external-service boundary changed.

### Disposition

The real implementation is locally accepted for owner visual review. It has not been pushed, merged, or deployed in this pass; public release still requires the owner's approval of the implemented preview.
