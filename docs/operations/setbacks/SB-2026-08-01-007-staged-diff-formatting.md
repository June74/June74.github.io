# SB-2026-08-01-007: Staged design baseline failed whitespace validation

- Status: closed
- First observed: 2026-08-01 21:30 CDT
- Last observed: 2026-08-01 21:30 CDT
- Phase/task: written specification commit gate
- Environment: Codex desktop local Git repository
- Version/commit: staged initial design baseline, no commits
- Owner: primary agent

## Symptom and impact

`git diff --cached --check` found two Markdown trailing-space line breaks and extra blank lines at the ends of three staged files. The baseline was not committed.

## Reproduction and evidence

The staged diff check reported exact file and line locations. The issues were formatting-only and did not change product meaning, security controls, or public content.

## Cause analysis

- Confirmed cause: the specification used Markdown hard-break spaces, and generated/reference files retained trailing blank lines.
- Hypothesis: none.
- Rejected hypothesis: source corruption; the approved visual reference and specification content remain present.
- Known exclusions: no remote exists and no commit or public deployment occurred.

## Correction and prevention

Use explicit HTML line breaks in the quoted hero copy, remove trailing blank lines, restage the affected files, and make `git diff --cached --check` a mandatory pre-commit gate.

### Recurrence at 2026-08-01 21:30 CDT

The correction passed for the original files, but the newly created incident record itself retained one blank line at EOF. The record will be trimmed and restaged before the same boundary is rerun.

## Verification

After the original files and the incident record were trimmed and restaged, `git diff --cached --check` completed with zero findings across 12 staged files. `.superpowers` remained untracked.

## Next diagnostic step

None.
