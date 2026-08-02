# SB-2026-08-02-018: Browser URL policy blocked an isolated native-control page

- Status: contained
- First observed: 2026-08-02 00:08 CDT
- Last observed: 2026-08-02 00:08 CDT
- Phase/task: Task 6 keyboard root-cause investigation
- Environment: Codex in-app browser
- Version/commit: `9970011`
- Owner: continuity lead

## Symptom and impact

An attempt to open a self-contained data URL for isolating native `summary` keyboard behavior was rejected by browser safety policy. No navigation or page mutation occurred. The policy explicitly prohibits indirect circumvention, so the diagnostic will not be retried through another encoded or indirect URL.

## Reproduction and evidence

The browser rejected the local data-scheme navigation before page creation. This limits one comparison experiment but does not block evidence from the actual local portfolio page.

## Cause analysis

- Confirmed cause: the browser URL policy disallows the requested data-scheme page.
- Hypothesis: none; this is an intentional browser safety boundary.
- Rejected hypothesis: none.
- Known exclusions: no site source, remote, public URL, deployment, or sensitive data changed.

## Correction and prevention

Do not bypass the URL policy. Use the actual page's focus, event, and state evidence plus automated controller tests for the keyboard fix.

## Verification

The browser remained on the approved loopback site; no disallowed page was opened.

## Next diagnostic step

None.
