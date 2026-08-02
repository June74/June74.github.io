# SB-20260802-055458-setback-index-table-format: Setback helper rejected the repository index table format

- **Status:** closed
- **First observed:** 2026-08-02T05:54:58.082939Z
- **Last observed:** 2026-08-02T05:54:58.082939Z
- **Phase/task:** Incident recording during clean PR verification
- **Environment:** Windows portfolio implementation worktree
- **Version/commit:** uncommitted clean squash on `codex/portfolio-implementation-pr`

## Symptom

The required setback helper rejected the valid spaced Markdown table separator in INDEX.md.

## Impact

Incident creation paused until the index separator was normalized; no product or public data was affected.

## Reproduction conditions

Run the required helper against an existing four-column `INDEX.md` whose Markdown separator uses spaced cells such as `| --- |`.

## Safe evidence

The helper searches specifically for a separator line beginning with `|---`; the repository used the equivalent valid Markdown form beginning with `| ---`.

## Attempts and outcomes

- The first helper invocation exited before retaining an incident file.
- The index separator was normalized to the compact form.
- Two subsequent helper invocations created incident files successfully.

## Cause classification

- **Confirmed cause:** The helper's separator matcher accepts only compact Markdown separators, while the repository used a spaced but valid equivalent.
- **Hypotheses:** None remaining.
- **Rejected hypotheses:** A missing setback table; the index already contained a valid table with 23 incidents.
- **Known exclusions:** The failed invocation removed its partially created file and did not change product code or public data.

## Correction and prevention

- **Correction:** Normalize the index separator to the compact form recognized by the helper.
- **Prevention:** Preserve the compact separator when editing the index and retain helper-created incident links.
- **Owner:** Continuity lead.
- **Next diagnostic step:** None unless the helper fails on the normalized index again.

## Verification and related work

Verified by two successful helper invocations immediately after the separator correction.

## Recurrence history

- 2026-08-02T05:54:58.082939Z: First observed.
