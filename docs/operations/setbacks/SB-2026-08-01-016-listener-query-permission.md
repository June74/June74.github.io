# SB-2026-08-01-016: Listener query was denied during local acceptance setup

- Status: closed
- First observed: 2026-08-01 23:59 CDT
- Last observed: 2026-08-02 00:00 CDT
- Phase/task: Task 6 integrated browser acceptance setup
- Environment: PowerShell CIM networking query on Windows
- Version/commit: `9970011`
- Owner: continuity lead

## Symptom and impact

The supervised server command remained active, but the follow-up listener diagnostic was denied by Windows management permissions before it could print the combined status line. This affects only process-level evidence; browser acceptance can rely on a direct loopback HTTP request.

## Reproduction and evidence

`Get-NetTCPConnection` returned an access-denied CIM error when asked to inspect port 8000. The command did not mutate the server or project files.

## Cause analysis

- Confirmed cause: the current sandbox identity lacks permission for the Windows listener-management query.
- Hypothesis: a direct `Invoke-WebRequest` status/content check will prove the actual HTTP boundary without privileged listener inspection.
- Rejected hypothesis: none yet.
- Known exclusions: no remote, deployment, public URL, or sensitive data is involved; the server is configured for loopback only.

## Correction and prevention

Use direct loopback HTTP requests for server readiness and browser navigation. Do not require privileged listener enumeration.

## Verification

A direct request to the loopback root returned HTTP 200, the expected 10,763-byte document, and the approved page title. Privileged listener enumeration is not needed for acceptance.

## Next diagnostic step

None.
