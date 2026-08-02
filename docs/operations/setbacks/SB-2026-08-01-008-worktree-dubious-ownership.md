# SB-2026-08-01-008: Worktree creation blocked by Git ownership check

- Status: closed
- First observed: 2026-08-01 21:43 CDT
- Last observed: 2026-08-01 21:46 CDT
- Phase/task: implementation worktree setup
- Environment: Codex desktop on Windows
- Version/commit: `4ba331b`
- Owner: primary agent

## Symptom and impact

The first `git worktree add` attempt stopped before creating a branch or directory because Git classified the repository as having dubious ownership. Implementation has not started and no partial worktree exists.

## Reproduction and evidence

Running the worktree creation command from the repository root returned Git's safe-directory ownership guard. The repository metadata and the elevated command identity belong to different local Windows security principals.

### Recurrence at 2026-08-01 21:45 CDT

The scoped retry created the worktree and feature branch successfully. Follow-up Git commands executed through the default sandbox identity then triggered the same ownership guard inside the new worktree because the creating identity and checking identity were reversed. Filesystem checks confirmed the worktree exists and that no dependency setup or baseline test suite is present.

## Cause analysis

- Confirmed cause: Git compares repository ownership with whichever local Windows identity executes the current command. The elevated and default sandbox boundaries use different identities, so either boundary can reject metadata created by the other.
- Hypothesis: using a command-scoped `safe.directory` exception for every Git command at the affected boundary will preserve safety without changing global configuration.
- Rejected hypothesis: none yet.
- Known exclusions: no tracked content, branch, remote, deployment, or public data changed.

## Correction and prevention

Use `git -c safe.directory=<exact worktree path>` for Git commands inside the implementation worktree. Keep every exception command-scoped and do not modify global Git configuration.

## Verification

The scoped retry created the feature branch and worktree. Command-scoped checks from inside the worktree confirmed branch `feature/portfolio-implementation`, a clean status, and baseline commit `4ba331b`.

## Next diagnostic step

None. Continue using the exact worktree path as a command-scoped safe-directory value for Git operations.
