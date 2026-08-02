# SB-2026-08-01-006: Git identity diagnostic exposed a private email

- Status: closed
- First observed: 2026-08-01 21:28 CDT
- Last observed: 2026-08-01 21:28 CDT
- Phase/task: pre-commit identity privacy review
- Environment: Codex desktop local workspace
- Version/commit: local repository has no commits
- Owner: primary agent

## Symptom and impact

A read-only Git identity diagnostic printed the configured local and global identity values into tool output, including a private email address. The value was visible in the current task output. It was not written into a project file, committed, pushed, transmitted to GitHub, or exposed on a public site.

## Reproduction and evidence

The diagnostic requested complete identity values instead of testing whether a privacy-safe repository-local identity was configured.

## Cause analysis

- Confirmed cause: the command emitted raw Git identity values where a boolean or redacted check would have been sufficient.
- Hypothesis: none.
- Rejected hypothesis: the address was already in repository history; the repository has no commits.
- Known exclusions: no remote exists and no public network write occurred.

## Correction and prevention

Stop printing raw identity values. Configure a repository-local GitHub-style no-reply author before the first commit. Future checks report only whether the local author name is present and whether the email ends in the no-reply domain.

## Verification

A redacted check confirmed that the repository-local author name is present, its email uses the GitHub no-reply domain, no project file contains a Gmail address, and the repository still has zero commits. The private address is absent from project files and Git history.

## Next diagnostic step

None.
