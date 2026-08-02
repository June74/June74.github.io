# SB-2026-08-01-014: Workflow inventory check omitted the repeated checkout invocation

- Status: closed
- First observed: 2026-08-01 23:25 CDT
- Last observed: 2026-08-01 23:25 CDT
- Phase/task: implementation Task 5 final static verification
- Environment: PowerShell static workflow inspection on Windows
- Version/commit: uncommitted Task 5 Pages workflow
- Owner: Developer A

## Symptom and impact

The first workflow inventory assertion expected five full-SHA `uses` entries. It failed because `actions/checkout` is intentionally used by both the test and deploy jobs, producing six invocations across five distinct official action repositories. The workflow, documentation, and tests were unchanged.

## Reproduction and evidence

The static check counted six valid full-SHA action invocations in `.github/workflows/pages.yml`. The workflow has two checkout invocations and one invocation each of setup-node, configure-pages, upload-pages-artifact, and deploy-pages.

## Cause analysis

- Confirmed cause: the verification script counted distinct action repositories but asserted the count against total invocations.
- Hypothesis: none remains.
- Rejected hypothesis: an unapproved or floating action had been added; the action inventory contains only the approved pinned references.
- Known exclusions: no remote, repository, public URL, GitHub Pages setting, secret, or public content changed.

## Correction and prevention

Verify both dimensions explicitly: six total full-SHA invocations and five distinct `actions/*` repositories. Retain the separate check that rejects major-tag and branch references.

## Verification

The corrected static check found six full-SHA invocations across five distinct action repositories, one `path: site` artifact path, and no floating action references. The focused Node suite then remained green.

## Next diagnostic step

None.
