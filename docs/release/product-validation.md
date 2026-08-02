# Five-participant product validation gate

This document implements acceptance criterion 10 from the approved personal-work-showcase design specification. It is a validation protocol and evidence register, not evidence that validation has happened.

- Status: **pending — no participant results have been collected**
- Candidate commit: pending; record the exact independently reviewed visual-accessibility candidate before testing
- Required sample: at least five participants
- Product acceptance: **open**
- Public deployment: **not authorized**

Do not mark this gate passed from internal review, automated tests, browser checks, or an empty template. Record only observations from actual participants. Use anonymous IDs such as `P1`; do not put participant names, email addresses, recordings, or other personal information in this public repository.

## Facilitator protocol

Use the same candidate commit for every participant unless a defect requires a new candidate. If the candidate changes, stop the round, record the superseded commit, and begin a new five-participant round.

1. Record the candidate commit, date, viewport, and input method.
2. Show the landing view for five seconds without coaching, scrolling, or opening a project.
3. Hide the page and ask the recognition prompts in order. Do not supply project names or answer choices.
4. Restore the page and run the usability prompts without directing the participant to a control.
5. Ask for separate 1–5 ratings for `simple`, `direct`, and `casual but presentable`.
6. Record concise, factual notes and an evidence reference. Preserve the participant's meaning without placing identifying information in the repository.

## Recognition prompts

Ask these after the five-second view:

1. Whose page is this?
2. What does this person personally contribute to the work?
3. What is Synapse intended to do?
4. What is June intended to do?
5. What is MM intended to do?
6. Where would you go to inspect or follow the work?

Score recognition as passed only when the participant identifies Injun Lee, his personal product-direction or behavior/routing-design contribution, all three project purposes, and GitHub as the work destination. Do not award a pass for a generic answer such as “an AI developer” without the personal-contribution element.

## Tone prompts

After the participant can inspect the full page, ask for one score per quality:

- `Simple` — 1 means cluttered or difficult to parse; 5 means focused and easy to scan.
- `Direct` — 1 means the purpose is unclear; 5 means the person and work are immediately understandable.
- `Casual but presentable` — 1 means either stiff or careless; 5 means human, confident, and polished.

Ask: “What on the page most influenced each score?” Record a short reason beside each rating.

## Usability prompts

Observe rather than coach:

1. From the landing view, find the current work.
2. Open one project, explain its purpose, close it, and open another project.
3. Find the destination for inspecting or following Injun's work.
4. Identify any copy, control, animation, diagram, color, or layout that was hard to notice, read, understand, or use.

For each task, record `completed without help`, `completed with help`, or `not completed`, plus the viewport, input method, and concise observation.

## Participant register

Every row remains pending until one actual participant completes the protocol.

| Participant | Recognition | Tone scores | Usability | Evidence reference | Disposition |
| --- | --- | --- | --- | --- | --- |
| P1 | Pending | Pending | Pending | Pending | Pending |
| P2 | Pending | Pending | Pending | Pending | Pending |
| P3 | Pending | Pending | Pending | Pending | Pending |
| P4 | Pending | Pending | Pending | Pending | Pending |
| P5 | Pending | Pending | Pending | Pending | Pending |

## Evidence fields for each participant

- Anonymous participant ID:
- Candidate commit:
- Test date and timezone:
- Viewport and input method:
- Five-second recognition answers:
  - Person:
  - Personal contribution:
  - Synapse purpose:
  - June purpose:
  - MM purpose:
  - Work destination:
- Recognition disposition and reason:
- Tone ratings and reasons:
  - Simple `/5`:
  - Direct `/5`:
  - Casual but presentable `/5`:
- Usability task outcomes:
  - Find current work:
  - Open, close, and switch projects:
  - Find GitHub destination:
- Confusion, readability, or interaction observations:
- Evidence reference:
- Facilitator initials or anonymous ID:

## Success criteria

This gate passes only when all of the following are true:

1. At least five actual participants complete the protocol against the same reviewed candidate.
2. At least four participants pass the complete recognition set: Injun Lee, his personal contribution, Synapse's purpose, June's purpose, MM's purpose, and GitHub as the place to inspect his work.
3. The mean score for each separate quality—`simple`, `direct`, and `casual but presentable`—is at least 4.0 out of 5 across all completed participants. Record the individual scores and arithmetic; do not substitute a combined tone score.
4. Every usability task has an outcome and evidence note. Any repeated confusion or blocking issue is resolved and the affected validation is rerun before passing the gate.
5. Agent 5 records the final counts, calculations, candidate commit, and pass/fail disposition in this file.

## Current gate disposition

No participant results have been collected. All five participant rows are pending, the success criteria have not been evaluated, and product acceptance remains open. This template does not authorize repository publication, GitHub Pages enablement, or any other public deployment action.
