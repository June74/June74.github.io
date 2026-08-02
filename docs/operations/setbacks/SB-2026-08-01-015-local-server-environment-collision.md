# SB-2026-08-01-015: Local server launch hit an environment-key collision

- Status: closed
- First observed: 2026-08-01 23:53 CDT
- Last observed: 2026-08-02 14:04 CDT
- Phase/task: Task 6 integrated browser acceptance setup
- Environment: PowerShell on Windows
- Version/commit: `9970011`
- Owner: continuity lead

## Symptom and impact

The first hidden local-server launch failed before creating a process because the child-process environment contained duplicate case-insensitive path keys. Port 8000 remained unused, so no partial server or external exposure occurred.

## Reproduction and evidence

`Start-Process` reported a duplicate dictionary key while preparing the environment. A follow-up listener check confirmed no process was listening on `127.0.0.1:8000`.

### Recurrence at 2026-08-01 23:54 CDT

The retry used the absolute Python executable and `-UseNewEnvironment`, but `Start-Process` failed at the same environment-key boundary. The subsequent HTTP probe could not connect, confirming that no server was created.

### Recurrence at 2026-08-01 23:56 CDT

The detached `cmd.exe` attempt retained the command tool's output handle and did not return to the HTTP probe. The command was terminated, and a follow-up listener check again confirmed that port 8000 was clear.

### Recurrence at 2026-08-01 23:58 CDT

Python created a detached child and returned its process identifier, but the child exited before opening the loopback listener. No listener or public exposure remained.

### Recurrence at 2026-08-02 14:04 CDT

A new `Start-Process` attempt reproduced the same duplicate case-insensitive `Path` key failure before Python launched. The browser's preceding connection attempt had already returned `ERR_CONNECTION_REFUSED`, so the preview remained unavailable and no partial server or external exposure was created. The established correction below remains the required path.

## Cause analysis

- Confirmed cause: PowerShell encountered both case variants of the path environment key while constructing the child environment.
- Hypothesis: a supervised foreground server kept alive by the command cell will avoid detachment entirely and provide a controllable lifecycle for browser acceptance.
- Rejected hypothesis: `-UseNewEnvironment` does not avoid the collision, `cmd.exe /b` does not detach cleanly, and Python's detached child exits before binding in this host. The failure was also not a port collision; each listener check was empty.
- Known exclusions: no production file, remote, deployment, public URL, or sensitive data changed.

## Correction and prevention

Avoid detached launch methods on this host. Run the loopback server as a supervised long-running command cell, verify an HTTP 200 response from a separate command, and terminate the cell after acceptance.

## Verification

The supervised command cell started the loopback-only server successfully in the original occurrence. On 2026-08-02, the repeated supervised launch was verified with `curl.exe --max-time 5`: HTTP 200, the current 10,944-byte document, and a loopback-only Python server response.

## Next diagnostic step

None. Keep the supervised command cell alive through browser acceptance and terminate it afterward.
