# Local acceptance evidence

This record captures local release-candidate observations only. It does not prove or authorize a public release.

- Evidence date: 2026-08-02 (CDT)
- Browser-observation reference: `82518e2` (`fix: deduplicate project keyboard activation`)
- Integration note: `8411a27` (`fix: harden keyboard activation deduplication`) landed after those browser observations and became this ledger commit's parent; its integrated syntax, automated, and browser regression checks remain pending
- Preview origin: `http://127.0.0.1:8000/`
- Browser: controlled Codex in-app Chromium browser; the exact browser version was not exposed in the recorded session
- Current disposition: **local acceptance remains open** while the MM number inconsistency is corrected and rechecked
- **Public deployment not authorized**

## Served artifact

The exact `site/` directory was served with Python's static HTTP server. A direct request to `http://127.0.0.1:8000/` returned HTTP `200` and the expected portfolio document.

The locally inspected artifact contains four files and totals 27,999 bytes:

| File | Bytes |
| --- | ---: |
| `site/index.html` | 10,763 |
| `site/styles.css` | 14,156 |
| `site/script.js` | 2,604 |
| `site/assets/favicon.svg` | 476 |

## Responsive browser evidence

| Viewport | Result |
| --- | --- |
| 1440 by 1000 | Document client width equaled scroll width, so no horizontal overflow was present. The hero and footer used their intended two-column layouts. All three project summaries were present. Keyboard focus rendered a 3 px copper outline. The browser console contained no warnings or errors. |
| 820 by 1000 | Document client width equaled scroll width. The hero and footer collapsed to one column. The open June and MM visual panels each measured 695 px wide and remained readable. |
| 390 by 844 | Document client width equaled scroll width. The hero and footer used one column. All three projects and the footer were visually inspected without overlap or clipped horizontal content. |

The approved implementation supports narrower widths through CSS, but this evidence record does not claim a native-browser check at every width listed in the broader test plan.

## Input and disclosure behavior

- Pointer click pinned Synapse and exposed its expanded visual.
- With June open, pressing `Enter` on MM switched the pinned disclosure from June to MM.
- Pressing `Space` again on MM closed it.
- Keyboard focus used the visible 3 px copper outline recorded above.
- Automated interaction checks cover fine-pointer hover preview and replay behavior. Native hover replay was not independently exercised through the controlled browser capability in this pass.
- Native JavaScript-disabled behavior was not independently exercised in this pass; progressive disclosure behavior remains covered by the static/automated contract.

## Motion and diagram evidence

- Synapse routing strokes were observed progressing from a `180px` dash offset to `0px`, showing that the routing lines draw into their completed state.
- June displayed five calendar events after its animation, with event timing checked as sequential rather than simultaneous.
- Reduced-motion behavior is covered by automated/static checks. The controlled browser capability did not expose native reduced-motion emulation for this pass, so this record does not claim a native-browser reduced-motion result.
- **Pending: MM contains an active number inconsistency.** Its values must be reconciled under the current test-driven correction and the completed MM visual must be rechecked before local acceptance can close.

## Checks not yet closed

- Reconcile and recheck the MM numeric story.
- Rerun the complete syntax and automated test suite after the MM correction is committed.
- Record a Lighthouse run and tool version if it remains part of the release gate.
- Complete any native-browser gaps required by the final release decision, including reduced-motion emulation, hover replay, and JavaScript-disabled behavior where the available tooling permits them.
- Complete the owner review of public copy, metadata, and the release commit.

## Public-release boundary

GitHub Pages has not been enabled and no public URL has been accepted. Live-URL availability, HTTPS behavior, response headers, redirects, public console/network behavior, and final hosted-artifact confirmation remain pending a separate owner authorization and an actual deployment. This local record must not be used to describe the site as publicly released or production-verified.
