# SB-2026-08-01-002: WinGet ripgrep shim could not execute

- Status: closed
- First observed: 2026-08-01 18:48 CDT
- Last observed: 2026-08-01 23:17 CDT
- Phase/task: portfolio repository discovery
- Environment: Codex desktop on Windows
- Version/commit: no Git repository exists yet
- Owner: primary agent

## Symptom and impact

The initial repository scan stopped when the first `rg` command could not run. No project content had been read or changed by that command.

## Reproduction and evidence

PowerShell resolved `rg.exe` first through `<user-root>/AppData/Local/Microsoft/WinGet/Links/rg.exe`, which returned an application-association error. `Get-Command rg -All` also found the Codex-bundled executable.

## Cause analysis

- Confirmed cause: command resolution selected a WinGet link that PowerShell could not execute in this environment.
- Hypotheses: none outstanding.
- Rejected hypotheses: ripgrep itself was incompatible; the Codex-bundled executable printed version 15.2.0 successfully.
- Known exclusions: the workspace was empty, so a subsequent file-list query returning exit code 1 was expected.

## Attempts and outcomes

Native PowerShell enumeration completed the discovery. Calling the Codex-bundled ripgrep executable by absolute path also succeeded.

### Recurrence at 2026-08-01 22:35 CDT

During Task 4's manual static-artifact review, the default `rg.exe` path again could not start. The security reviewer used the previously verified native PowerShell `Select-String` fallback, completed the scan, and reported no effect on tests or artifact output. No new cause or exposure was introduced.

## Correction and prevention

Use the Codex-bundled `rg.exe` by absolute path in this session, or fall back to native PowerShell when its no-match exit code would complicate discovery.

## Verification

The bundled executable returned its version successfully, and PowerShell confirmed that the workspace contains no files outside the newly created operations log.

## Next diagnostic step

None; a working read-only fallback is verified.
