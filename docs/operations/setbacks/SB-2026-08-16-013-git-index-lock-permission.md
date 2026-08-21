# SB-2026-08-16-013: Git index lock creation denied while staging redesign specification

- Status: closed
- First observed: 2026-08-16 22:06 CDT
- Last observed: 2026-08-16 22:07 CDT
- Phase/task: UI/UX redesign specification documentation
- Environment: Codex desktop on Windows, workspace-write filesystem profile
- Version/commit: `d3d0e8f`
- Owner: primary agent

## Symptom and impact

The redesign specification was written and passed its content checks, but the exact-file `git add` command could not create the repository index lock. The specification remains untracked and cannot be committed from the current default command boundary. No production code, public site, deployment, or existing tracked content changed as part of the failed staging action.

## Reproduction and evidence

- Reproduction condition: run exact-file staging for `docs/superpowers/specs/2026-08-16-portfolio-uiux-redesign-design.md` from the repository root.
- Safe result category: Git reported permission denial while creating `.git/index.lock`.
- Follow-up check: the specification remained untracked.
- Logging helper attempt: the skill-referenced `scripts/new_setback.py` is absent from this repository, so the incident and index row were created with the repository's existing incident format.

## Cause analysis

- Confirmed cause: the current command boundary does not have permission to create the repository's Git index lock.
- Hypothesis: the managed workspace grants read access to `.git` but not the write access required for staging and committing.
- Rejected hypothesis: the specification contains invalid Git path characters. The file exists at a normal repository-relative path and is readable.
- Known exclusions: no evidence of a stale `index.lock`, destructive command, private-data exposure, or partial commit.

## Attempts and outcomes

1. Ran exact-file staging. Outcome: stopped before the file entered the index.
2. Looked for an existing incident with the same index-lock symptom. Outcome: no matching incident was present.
3. Invoked the setback creation helper required by the skill. Outcome: the helper file was not present.

## Correction and prevention

Use the approved Git-write boundary together with the repository's known command-scoped `safe.directory` exception. Do not change global Git configuration or repository ownership. Stage only the exact intended paths and inspect the staged-file list before committing.

## Verification

The design-content checks passed before staging was attempted. The approved command-scoped retry staged only the redesign specification. `git diff --cached --name-only` showed that single file, `git diff --cached --check` passed, and commit `070330c` created the documentation commit. Unrelated worktree changes were not included.

## Next diagnostic step

None. Reuse the narrow Git-write boundary and exact-path staging procedure if another documentation commit is required.
