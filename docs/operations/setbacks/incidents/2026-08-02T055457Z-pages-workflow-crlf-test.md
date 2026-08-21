# SB-20260802-055457-pages-workflow-crlf-test: Pages workflow test assumed LF line endings

- **Status:** closed
- **First observed:** 2026-08-02T05:54:57.926350Z
- **Last observed:** 2026-08-02T05:54:57.926350Z
- **Phase/task:** Clean PR branch verification
- **Environment:** Windows portfolio implementation worktree
- **Version/commit:** uncommitted clean squash on `codex/portfolio-implementation-pr`

## Symptom

The Pages workflow permission test failed after the verified feature tree was squashed onto a clean Windows branch.

## Impact

The final verification run stopped before the clean branch could be committed and pushed.

## Reproduction conditions

Read `.github/workflows/pages.yml` from a Windows checkout with CRLF line endings, then run the workflow least-privilege contract test in `tests/site.test.mjs`.

## Safe evidence

The workflow contained 45 CRLF sequences and no bare LF sequences. Its permissions and checkout hardening were unchanged; only the test parser failed to find LF-only section boundaries.

## Attempts and outcomes

- The full suite failed only the Pages workflow permission test.
- Inspecting the workflow's line endings confirmed the parser assumption.
- The test now normalizes CRLF to LF before applying its structural assertions.

## Cause classification

- **Confirmed cause:** The test parsed raw file text with LF-only boundaries even though Git materialized the workflow with CRLF in this checkout.
- **Hypotheses:** None remaining.
- **Rejected hypotheses:** The workflow permissions had regressed; direct inspection showed the expected permission and checkout settings remained present.
- **Known exclusions:** No product code, deployment behavior, or public content changed.

## Correction and prevention

- **Correction:** Normalize `\r\n` to `\n` in the test fixture before parsing workflow sections.
- **Prevention:** Keep repository text-contract tests independent of checkout line-ending policy.
- **Owner:** Continuity lead.
- **Next diagnostic step:** None unless a checkout with different line endings reproduces the parser failure.

## Verification and related work

The focused workflow and secret-regression selection passed 3/3. The full static suite passed 34/34, JavaScript syntax checks passed, and both staged and unstaged whitespace checks passed.

## Recurrence history

- 2026-08-02T05:54:57.926350Z: First observed.
