# SB-2026-08-02-023: GitHub push protection rejected a provider-shaped test fixture in branch history

- Status: contained
- First observed: 2026-08-02 00:48 CDT
- Last observed: 2026-08-02 01:40 CDT
- Phase/task: Publish feature branch and open draft pull request
- Environment: GitHub public repository `June74/June74.github.io`
- Version/commit: original branch `feature/portfolio-implementation` at `0d545ee`
- Owner: Continuity lead

## Symptom and impact

GitHub accepted the new repository's baseline `main` branch but rejected the feature-branch push with GH013. Push protection identified a Slack-token-shaped literal in `tests/site.test.mjs` across the feature history. The feature branch and pull request were not created remotely.

## Cause analysis

- The detected value is a deliberately synthetic mutation fixture used to prove that the local secret scanner rejects Slack-token-shaped strings.
- The current public `site/` artifact contains no matching value.
- The literal first entered the feature history in a test-only commit. Removing it only from the latest snapshot would not satisfy GitHub because push protection scans every commit being introduced.
- No bypass was requested because the safer path is to remove provider-shaped literals from the branch history.

## Correction and prevention

The original feature branch is preserved locally. A new `codex/portfolio-implementation-pr` branch was created from the remote-backed `main`, and the verified feature tree was squash-merged into it. A source-level regression test now rejects provider-shaped Slack literals inside the test source itself, while the mutation fixture is assembled from separate pieces at runtime so the local scanner behavior remains covered.

### Recurrence at 2026-08-02 01:40 CDT

The portfolio-polish tracked-source scan found three other intentionally synthetic credential-shaped literals in `tests/site.test.mjs`: private-key, OpenAI-key, and GitHub-token categories. They are mutation fixtures, not real credentials, and none appear in the public `site/` artifact. The full scan correctly stopped integrated acceptance before the preview could be called complete.

The existing prevention was too narrow because it rejected only Slack-shaped literals in the test source. The correction will generalize that source-level regression and assemble every provider-shaped mutation fixture from non-sensitive fragments at runtime.

## Verification

The source-level regression first failed against the embedded literal as expected. The focused security and workflow selection passed 3/3, the full static suite passed 34/34, syntax and whitespace checks passed, and the committed provider-shaped scan found zero matches. GitHub accepted commit `b1e6625` on `codex/portfolio-implementation-pr` without a bypass.

## Next diagnostic step

Generalize the source-level fixture regression, rerun focused/full tests, and repeat the tracked-source scan. Close only when every tracked provider-shaped literal category reports zero matches.
