# SB-2026-08-02-025: Sandboxed GitHub preflight produced a false authentication failure

- Status: closed
- First observed: 2026-08-02 14:11 CDT
- Last observed: 2026-08-02 14:11 CDT
- Phase/task: project-description GitHub release preflight
- Environment: restricted and approved-network PowerShell on Windows
- Version/commit: `2462fa5`
- Owner: continuity lead

## Symptom and impact

The first restricted-network `gh auth status` call reported an invalid saved token, while the following repository query also showed a blocked outbound socket. No push, pull request, merge, deployment, or other GitHub state change occurred.

## Reproduction and evidence

The restricted call failed before reaching GitHub. Repeating the same authentication and repository checks through the approved live-network boundary succeeded for the expected account and repository. No credential value was recorded.

## Cause analysis

- Confirmed cause: the restricted network prevented the preflight from reaching GitHub and produced a false authentication failure.
- Rejected hypothesis: the saved GitHub authentication was invalid; the approved live check authenticated successfully.
- Known exclusions: no GitHub mutation occurred during either check, and no credential material was stored in repository evidence.

## Correction and prevention

When a restricted GitHub preflight also contains an outbound socket denial, repeat the same read-only check through the approved live-network boundary before asking the owner to re-authenticate.

## Verification

The approved live check returned an authenticated account, the repository `June74/June74.github.io`, and default branch `main`.

## Next diagnostic step

None.
