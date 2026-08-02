# SB-2026-08-01-004: Git cannot read user-level ignore file

- Status: closed
- First observed: 2026-08-01 21:19 CDT
- Last observed: 2026-08-01 21:21 CDT
- Phase/task: design specification repository preparation
- Environment: Codex desktop on Windows
- Version/commit: local repository has no commits
- Owner: primary agent

## Symptom and impact

`git status` returned the correct repository status but also warned that Git could not access a user-level ignore file outside the workspace. Repository files were not changed, but future Git commands need a repository-local ignore configuration to remain deterministic.

## Reproduction and evidence

Running `git status --short --branch` in the repository produced a permission warning for a user configuration path. A first attempted command-line override using the Windows null device was rejected because Git does not accept it as an exclude file.

The repository-local correction then failed because the managed workspace exposes `.git/config` as read-only to the default sandbox. No configuration or tracked file changed.

The first approved retry did not retain the repository working-directory context and Git reported that `--local` was outside a repository. The next retry will bind the repository explicitly with `git -C`.

Binding the path explicitly produced the same result, confirming that the elevated command boundary cannot see the sandbox-overlay `.git` directory. Configuration retries are stopped. The correction is to initialize the same empty repository once at the actual workspace boundary, then apply repository-local configuration there.

The boundary initialization reported an existing repository, but a subsequent `git -C ... config --local` still reported no repository. Rather than repeat the same command, the next diagnostic will check the absolute Git-directory path and use explicit `--git-dir` / `--work-tree` binding only if it exists.

## Cause analysis

- Confirmed cause: Git is attempting to consult a user-level exclude path that the managed workspace cannot read, while the default sandbox also prevents the required repository-local `.git/config` write.
- Hypothesis: setting `core.excludesFile` locally to the repository's own `.git/info/exclude` file will prevent the inaccessible user-level lookup.
- Rejected hypothesis: no repository `.gitignore` syntax error is involved; status still listed the expected untracked files.
- Known exclusions: no file contents, public data, or GitHub remote were affected.

## Correction and prevention

With explicit sandbox approval, configure only this repository to use its local `.git/info/exclude`, then rerun `git status`. Do not change global Git configuration.

## Verification

The Git directory was verified through its absolute path, repository-local `core.excludesFile` was written through that explicit boundary, and the original status check then completed without the user-level permission warning while listing the expected untracked files.

## Next diagnostic step

None.
