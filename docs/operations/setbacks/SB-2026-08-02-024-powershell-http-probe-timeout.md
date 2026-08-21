# SB-2026-08-02-024: PowerShell HTTP probe timed out while curl succeeded

- Status: closed
- First observed: 2026-08-02 14:05 CDT
- Last observed: 2026-08-02 14:06 CDT
- Phase/task: project-description local browser acceptance
- Environment: PowerShell on Windows
- Version/commit: `fc340b1`
- Owner: continuity lead

## Symptom and impact

`Invoke-WebRequest` did not return within the ten-second command budget while probing the supervised loopback preview. The probe was terminated by its timeout. No source, deployment, remote, or public state changed.

## Reproduction and evidence

The supervised Python server remained active. A bounded `curl.exe --max-time 5` request immediately returned HTTP 200, content length 10,944, and the expected local Python server headers.

## Cause analysis

- Confirmed cause: the PowerShell probe path timed out even though the loopback server was responsive through curl.
- Hypothesis: host-specific `Invoke-WebRequest` behavior stalled after connection.
- Rejected hypothesis: the server was not listening; the fresh curl response disproved this.
- Known exclusions: no remote request, deployment, sensitive data, or public exposure occurred.

## Correction and prevention

Use bounded `curl.exe` probes for supervised loopback acceptance on this host. Keep the browser acceptance check separate from the transport probe.

## Verification

`curl.exe --max-time 5 -sS -D - http://127.0.0.1:8000/ -o NUL` exited zero and returned HTTP 200.

## Next diagnostic step

None.
