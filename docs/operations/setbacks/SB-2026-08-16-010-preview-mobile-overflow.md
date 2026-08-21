# SB-2026-08-16-010: Preview page navigator caused mobile horizontal overflow

- Status: closed
- First observed: 2026-08-16
- Last observed: 2026-08-16
- Phase/task: complete portfolio UI/UX preview mobile verification
- Environment: Codex desktop in-app browser at 390 by 844 viewport
- Version/commit: uncommitted visual-companion mockup
- Owner: primary agent

## Symptom and impact

All eight preview screens rendered their expected heading but reported document-level horizontal overflow at the mobile acceptance width. The desktop preview remained correct. The preview has not been handed to the owner as accepted.

## Reproduction and evidence

At the mobile viewport, the document client width was 375 pixels and scroll width was 674 pixels. Element-bound diagnostics identified the shared `.prototype-pages` navigator at 662 pixels wide on both the public Home and private Importer screens. Page-specific content stayed within its intended container.

## Cause analysis

- Confirmed cause: the horizontal flex navigator retained its intrinsic content width as a flex item because it had no shrinking boundary, so its internal overflow became document overflow.
- Hypotheses: none outstanding.
- Rejected hypothesis: individual public or private page layouts caused the overflow; the same shared navigator exceeded the viewport on both surfaces.
- Known exclusions: desktop width, page visibility, page navigation, importer approval interaction, and the browser console all passed.

## Attempts and outcomes

The first eight-page mobile pass failed on every horizontal-overflow assertion. After element-bound diagnostics isolated the shared navigator, the mobile CSS gave `.prototype-inner` and `.prototype-pages` explicit shrinking boundaries while preserving horizontal scrolling inside the navigator.

## Correction and prevention

Constrain the preview navigator to the available mobile width and allow the navigator itself to scroll horizontally. Rerun all eight mobile page checks and reset the temporary viewport afterward.

## Verification

At 390 by 844, all eight pages displayed their expected heading, matched document scroll width to client width, and retained horizontal scroll position zero. The console reported no warnings or errors.

## Next diagnostic step

None; the complete mobile acceptance loop passed.
