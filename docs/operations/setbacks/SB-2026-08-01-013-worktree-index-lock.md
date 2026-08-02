# SB-2026-08-01-013 — worktree index lock denied by sandbox

**Status:** closed
**First observed:** 2026-08-01 22:39 CDT
**Last observed:** 2026-08-01 23:17 CDT
**Phase/task:** Task 4 static release contracts
**Environment:** Windows worktree `portfolio-implementation` at the Task 4 base commit lineage

## Symptom and impact

The scoped `git add` and commit action could not create the worktree index lock. The Task 4 production and test changes remain unstaged and uncommitted; no release artifact or Git history was modified by the failed command.

## Safe reproduction evidence

`git add site tests/site.test.mjs` reported that creation of the worktree `index.lock` was denied. The command used the required worktree safe-directory configuration.

## Cause and exclusions

- **Confirmed cause:** the active filesystem sandbox denied the required write at Git's worktree metadata location.
- **Hypothesis:** an approved escalated Git invocation will allow the same scoped staging and commit action.
- **Rejected hypotheses:** no source-file permission failure was observed; the failure occurred at Git metadata lock creation.
- **Exclusions:** no secrets, personal contact data, external endpoint, or production deployment was involved.

## Attempts and outcome

1. Ran final static verification: JavaScript syntax, 13 Node tests, and whitespace check all exited successfully.
2. Ran scoped staging and commit; both stopped at the sandbox lock denial.

## Correction and prevention

An escalated Git invocation successfully staged the three Task 4 files, passed the staged whitespace check, and created commit `ae14a9a` (`test: enforce static release contracts`). The sandbox limitation remains relevant to ordinary Git writes in this worktree; use a narrowly scoped escalation when a future Git write is required.

## Verification

A follow-up commit inspection confirmed `ae14a9a` contains only the intended Task 4 HTML, CSS, and test files. Repository status shows those paths clean.

## Next diagnostic step

None. Continue using narrowly scoped escalation for Git metadata writes in this worktree.

### Recurrence at 2026-08-01 23:28 CDT

Task 5 staging again failed at the same worktree `index.lock` path before any files were staged. The narrowly scoped escalated retry staged exactly `.github/workflows/pages.yml`, `README.md`, `docs/release/predeployment-checklist.md`, and `tests/site.test.mjs`; staged whitespace validation passed; and commit `7d8e73f` (`chore: prepare curated Pages deployment`) was created. The cause and prevention remain unchanged.
