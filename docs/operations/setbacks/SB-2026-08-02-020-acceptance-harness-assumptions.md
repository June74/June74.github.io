# SB-2026-08-02-020: Acceptance harness assumptions delayed responsive and interaction checks

- Status: closed
- First observed: 2026-08-02 00:14 CDT
- Last observed: 2026-08-02 00:25 CDT
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

## Next diagnostic step

None. Keep browser probes grounded in a fresh DOM snapshot and the constrained browser API documentation.
