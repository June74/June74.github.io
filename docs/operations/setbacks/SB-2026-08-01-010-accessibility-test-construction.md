# SB-2026-08-01-010: Accessibility test used the wrong assertion input type

- Status: closed
- First observed: 2026-08-01 21:55 CDT
- Last observed: 2026-08-01 21:56 CDT
- Phase/task: implementation Task 1 reviewer fix
- Environment: Node built-in test runner on Windows
- Version/commit: before `e4927af`
- Owner: Developer A, recorded by the continuity lead

## Symptom and impact

The first focused accessibility-test run stopped with an assertion argument-type error instead of producing the intended failing assertion. No production HTML had been changed, so the invalid run did not compromise the test-first boundary.

## Reproduction and evidence

The draft test passed a string to an assertion API that expected a regular expression. The implementer corrected the test construction, reran it against unchanged production HTML, and then observed the expected missing-description failure before implementing the fix.

## Cause analysis

- Confirmed cause: the draft assertion used an input type unsupported by that assertion API.
- Hypothesis: none remains.
- Rejected hypothesis: the test runner and HTML parser were not responsible; the corrected assertion reached the intended semantic check.
- Known exclusions: no public content, production HTML, remote, deployment, or sensitive data changed before the valid RED run.

## Correction and prevention

Use a direct string inclusion assertion for dynamically extracted caption text. Treat only the later assertion failure as TDD RED evidence.

## Verification

The corrected focused test failed for the missing June description, passed after both descriptions were implemented, and the full suite then reported 4 passing tests with no failures.

## Next diagnostic step

None.
