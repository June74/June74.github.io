# SB-2026-08-01-011: Favicon namespace conflicts with planned URL test

- Status: closed
- First observed: 2026-08-01 21:59 CDT
- Last observed: 2026-08-01 22:12 CDT
- Phase/task: implementation Task 2 visual system
- Environment: Node built-in test runner on Windows
- Version/commit: task base `0dff9ba`
- Owner: Developer B and continuity lead

## Symptom and impact

Task 2 cannot reach GREEN because the planned favicon security assertion rejects the standard SVG namespace URL that the same task's exact favicon markup requires. The developer stopped before committing partial work.

## Reproduction and evidence

The Task 2 brief requires an SVG root with the standard namespace attribute. Its planned test also rejects any `http:` or `https:` substring in the entire favicon. The standard namespace therefore matches the forbidden pattern even though it is metadata, not a fetched resource. The current run reports five passing tests and one failure at this assertion.

## Cause analysis

- Confirmed cause: the test's broad URL regular expression does not distinguish the required SVG namespace from remotely fetched resources.
- Hypothesis: narrowing the test to allow only the exact standard namespace while continuing to reject every other URL preserves both the valid SVG and the intended no-remote-resource control.
- Rejected hypothesis: omitting the namespace is not equivalent to following the task's exact favicon contract.
- Known exclusions: no partial Task 2 file is committed, no remote request occurs, and no deployment or public data is involved.

## Correction and prevention

Owner decision is required because the plan mandates both conflicting conditions. Recommended resolution: preserve the required namespace and narrow the test so only that exact namespace value is allowed; continue rejecting scripts, event handlers, `foreignObject`, `data:` URLs, external references, and all other HTTP(S) values.

## Verification

The owner selected Option A. The test now permits only the exact standard namespace and applies the full security scan to all remaining SVG text. A focused favicon check passed, the full suite reported 8 passing tests, and independent Task 2 review approved the namespace control with no remaining findings.

## Next diagnostic step

None. Preserve the exact namespace-only exception if the favicon changes.
