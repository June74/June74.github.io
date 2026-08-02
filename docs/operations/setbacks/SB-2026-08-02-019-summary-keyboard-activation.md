# SB-2026-08-02-019: Focused project summary did not activate by keyboard

- Status: closed
- First observed: 2026-08-02 00:06 CDT
- Last observed: 2026-08-02 00:54 CDT
- Phase/task: Task 6 integrated browser acceptance
- Environment: Codex in-app browser at 1440 by 1000
- Version/commit: observed at `9970011`; corrected by `8411a27`
- Owner: Developer B and continuity lead

## Symptom and impact

Clicking project summaries pins and switches them correctly, but pressing Enter or Space on the focused MM summary did not open MM or close the pinned June project. Keyboard acceptance therefore remains failed.

## Reproduction and evidence

1. Opened Synapse by click, then June by click; exclusive switching worked.
2. Focused the MM summary through the browser locator.
3. Verified `document.activeElement` was the MM `SUMMARY` element.
4. Sent Enter and Space through locator, coordinate-keypress, and DOM-keypress paths.
5. MM remained closed and June remained pinned after every keypress.

The production controller registers click, pointer-enter, pointer-leave, and media-query change listeners, but no keyboard listener. It assumes native key activation will synthesize the click event in every supported runtime.

## Cause analysis

- Confirmed cause: the original controller had no explicit Enter/Space path, and the acceptance browser did not reach its click-driven state transition from the focused summary.
- The first explicit handler then exposed a second browser boundary: keyboard activation could be followed by a synthesized `detail === 0` click, causing two toggles. The original fake-DOM test modeled only keydown and missed that sequence.
- Rejected hypothesis: focus failure is excluded because the active element was the intended MM summary. Project state logic itself is also excluded because direct clicks switched projects correctly.
- Known exclusions: no coarse-pointer behavior, outbound link, remote, deployment, or private data is involved.

## Correction and prevention

The controller now deduplicates only a pending keyboard-originated `detail === 0` click, ignores repeated activation keydowns after preventing default, preserves pointer and standalone assistive clicks, and owns cleanup with an activation generation so an older timeout cannot clear newer state. The behavioral test covers Enter, Space, repeats, pointer interleaving, standalone assistive clicks, and stale cleanup.

## Verification

`8411a27` passed the focused keyboard/interleaving test, the full suite, syntax and diff checks, and independent review. In the 820 by 1000 real-browser rerun, Enter switched June to MM, a second Enter closed MM, and Space switched June to MM. The browser console remained free of warnings and errors.

## Next diagnostic step

None. Keep synthesized keyboard-click and interleaving cases in the regression suite.
