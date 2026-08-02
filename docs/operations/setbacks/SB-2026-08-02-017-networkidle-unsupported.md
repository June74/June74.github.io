# SB-2026-08-02-017: Browser runtime rejected networkidle wait mode

- Status: contained
- First observed: 2026-08-02 00:03 CDT
- Last observed: 2026-08-02 00:03 CDT
- Phase/task: Task 6 integrated browser acceptance
- Environment: Codex in-app browser Playwright subset
- Version/commit: `9970011`
- Owner: continuity lead

## Symptom and impact

The browser created a tab and navigated to the local site, but its documented load-state helper rejected `networkidle`. The static page has no runtime network dependencies, so acceptance can use `domcontentloaded` plus direct DOM and resource checks.

## Reproduction and evidence

The first `waitForLoadState` call returned an unsupported-mode error for `networkidle`. The error occurred after tab creation and navigation and did not change the page or repository.

## Cause analysis

- Confirmed cause: this browser backend does not implement the `networkidle` state in its Playwright subset.
- Hypothesis: `domcontentloaded`, followed by title/DOM/resource readiness checks, will provide deterministic evidence for this fully static page.
- Rejected hypothesis: none yet.
- Known exclusions: no application error, remote, deployment, public URL, or sensitive data is implicated.

## Correction and prevention

Use `domcontentloaded` and explicit page assertions in this browser backend. Do not retry the unsupported state.

## Verification

Pending the supported wait and DOM snapshot.

## Next diagnostic step

Wait for `domcontentloaded`, verify the title and stylesheet/script readiness, then capture the DOM snapshot.
