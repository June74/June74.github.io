# SB-2026-08-16-009: Fixed-delay Home preview assertion produced a false negative

- Status: closed
- First observed: 2026-08-16
- Last observed: 2026-08-16
- Phase/task: complete portfolio UI/UX preview verification
- Environment: Codex desktop in-app browser on Windows
- Version/commit: uncommitted visual-companion mockup
- Owner: primary agent

## Symptom and impact

The first eight-page browser pass reported the Home heading as not visible while every other page, horizontal-overflow check, importer approval state, and console check passed. Verification paused before the preview was handed to the owner. No production file changed and no content was exposed externally.

## Reproduction and evidence

The failing check reloaded the companion and used a fixed 80 ms delay after each page-navigation click before calling `isVisible()`. Immediate diagnostics after selecting Home showed `data-page="home"` was not hidden, the Home navigation control was active, the expected heading text existed exactly once, and the heading displayed as a block element.

## Cause analysis

- Confirmed cause: the initial verification relied on a fixed post-reload delay rather than waiting for the expected page condition, producing a transient false negative.
- Hypotheses: none outstanding.
- Rejected hypothesis: the Home page was hidden or its heading text was incorrect; direct DOM evidence disproved both.
- Known exclusions: no horizontal overflow, script error, console warning, or navigation-state mismatch was observed.

## Attempts and outcomes

No prototype change was made. The verification was rewritten to wait for the expected heading to become visible after each navigation.

### Recurrence after viewport reset

After the successful mobile suite, the browser viewport override was reset and Home was clicked immediately. The subsequent Home-heading wait timed out. A fresh DOM snapshot showed the prior Importer page still active with no missing controls or console failure, indicating that the click occurred during the viewport transition and did not persist. Reissuing the Home click against the stable DOM reached the exact heading immediately.

## Correction and prevention

Use condition-based visibility waits for companion page transitions, especially immediately after a reload. Do not use arbitrary short delays as the acceptance boundary.

## Verification

Three consecutive Importer-to-Home transitions each reached the exact Home heading within the condition timeout. All three visibility assertions passed without changing the preview.

After the viewport-reset recurrence, the stable-DOM Home click reached the exact Home heading, and the tab was marked as the final deliverable. No prototype change was required.

## Next diagnostic step

None; the UI was not defective and the condition-based verification is stable.
