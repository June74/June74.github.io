# SB-2026-08-02-020: Acceptance harness assumptions delayed responsive and interaction checks

- Status: closed
- First observed: 2026-08-02 00:14 CDT
- Last observed: 2026-08-02 14:10 CDT
- Phase/task: Task 6 integrated browser acceptance
- Environment: Codex in-app browser and Windows PowerShell
- Version/commit: `783ec53`
- Owner: Continuity lead

## Symptom and impact

Several acceptance probes failed before reaching the product: one probe contained a JavaScript syntax error, stale selectors targeted the earlier prototype structure, unsupported locator method shapes were attempted, the local `rg` shim could not execute, and a viewport override was applied before creating the tab it needed to affect. These failures delayed evidence collection but did not change the public artifact.

## Cause analysis

- The acceptance script reused prototype selectors (`article.work`) after the approved implementation had moved project state to `details.project`.
- The browser helper exposes a constrained Playwright subset; `focus()` and object-shaped `press()` arguments were not supported by its locator wrapper.
- The installed WinGet `rg` shim remained unusable, matching the already-known SB-002 environment limitation.
- Browser viewport overrides apply to tabs that already exist; creating a new tab after setting the override returned the default viewport.

## Correction and prevention

The checker took a fresh DOM snapshot, rebuilt selectors from the production semantics, used the documented string-shaped `press()` call, fell back to PowerShell `Select-String`, and created the responsive-test tab before setting and reloading its viewport. Browser reads now use one bounded `evaluate()` projection for layout evidence.

## Verification

Desktop evidence was collected at 1440 by 1000, mobile evidence at 390 by 844, and tablet evidence at 820 by 1000. Each measured viewport reported equal document client and scroll widths, confirming no horizontal overflow.

## Recurrence during portfolio-polish acceptance

During the 2026-08-02 portfolio-polish pass, a previously claimed preview-tab binding was released before the June timing check, and the first replacement probe called `locator()` on the tab wrapper instead of its documented `playwright` surface. The page remained running and unchanged. The checker reclaimed the existing `127.0.0.1:8000` tab, inspected the wrapper before retrying, and then used `tab.playwright.locator()` and `tab.playwright.evaluate()`.

The recovered check confirmed that all four June task markers begin empty, progress monotonically from zero to four completed markers, reset to zero after close and reopen, and generate no browser warnings or errors. This recurrence is closed without a product-code change.

## Recurrence during project-description acceptance

The first responsive probe called an upstream-style `setViewportSize` method that this constrained browser surface does not expose. The integration lead then read the browser viewport capability documentation and used `browser.capabilities.get("viewport").set(...)` after creating the acceptance tab. The earlier supervised server also reached its configured 120-second command timeout during recovery, so it was restarted with a longer supervised lifetime before the final measurements.

- Confirmed cause: the unsupported method and configured server lifetime were acceptance-harness assumptions, not product failures.
- Correction: use the documented viewport capability on an existing tab and keep the supervised loopback server alive for the full acceptance pass.
- Verification: the existing tab reported exactly 390 by 844 and 1440 by 900 CSS pixels; both sizes had equal client and scroll widths, all three collapsed descriptions remained inside the viewport, and the console had zero warnings or errors.

## Recurrence during public-URL acceptance

After GitHub Pages deployed merge `02ef82b`, the first controlled pointer click intended to open June left both June and Synapse closed. The deployed hero and Synapse checks had already passed, the page console remained clean, and no page state or source was mutated by the probe. The discrepancy is contained to the acceptance action while the exact event sequence is reproduced and compared with the already-passing keyboard and local-browser paths.

- Confirmed: the first recorded post-click snapshot showed June closed and all four markers in their static completed state.
- Hypothesis: the controlled pointer action crossed the project's `pointerleave` preview boundary during auto-scroll and closed a transient preview before the snapshot.
- Known exclusion: this is not a stale deployment; the public page contains the new hero signature and outlined Synapse router, and the workflow deployed merge `02ef82b` successfully.

The controlled public tab later disappeared from the browser's open-tab inventory and a subsequent pointer probe on that released binding timed out before reaching the selector. A fresh public tab then opened June with one pointer click, left it pinned and animating, and showed all four markers empty. The keyboard path independently opened June, completed the four markers in order, closed it, and replayed from zero.

- Confirmed cause: the acceptance harness continued using an unstable tab binding after a long chained interaction; the public artifact was not the failing boundary.
- Rejected hypothesis: the deployed June pointer interaction was broken. A fresh public-tab pointer activation and a separate keyboard activation both exercised the expected behavior.
- Correction: reacquire or recreate the public tab after a controlled tab disappears or a CDP selector command times out; keep each interaction probe bounded.
- Verification: the fresh pointer path opened June with zero completed markers, the timed keyboard replay progressed from zero to four, the browser console stayed clean, and the live responsive checks had no horizontal overflow.

## Next diagnostic step

None. Use the documented viewport capability on an existing tab, and use a fresh claimed tab for each bounded public-URL interaction sequence.
