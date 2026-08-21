# SB-2026-08-01-009: Task-brief helper cannot locate awk

- Status: closed
- First observed: 2026-08-01 21:49 CDT
- Last observed: 2026-08-01 21:50 CDT
- Phase/task: implementation orchestration, Task 1 brief generation
- Environment: Codex desktop on Windows with Git Bash
- Version/commit: `d3d0e8f`
- Owner: primary agent

## Symptom and impact

The provided task-brief helper exited before writing a brief because its Bash process could not locate `awk`. No implementation code has started and no partial brief exists.

## Reproduction and evidence

Invoking the helper through the available Git Bash executable reached the helper but stopped at its heading-extraction command with an unavailable-command error.

## Cause analysis

- Confirmed cause: the selected Git Bash process does not expose `awk` on its executable search path.
- Hypothesis: a PowerShell extraction using the helper's same fenced-code and task-heading rules can create an equivalent brief safely.
- Rejected hypothesis: the plan file is not missing; the helper reached its extraction phase.
- Known exclusions: no production file, branch, remote, deployment, or public data changed.

## Correction and prevention

Use a small read-only PowerShell extraction for task briefs on this Windows host, writing only to the ignored `.superpowers/sdd/` directory. Verify the output starts at the requested task heading, ends before the next task heading, and is non-empty.

## Verification

The PowerShell state machine wrote a 204-line Task 1 brief. Verification confirmed its first line is the Task 1 heading, it is non-empty, and no Task 2 heading leaked into the output.

## Next diagnostic step

None. Reuse the verified PowerShell extraction for later task briefs on this host.
