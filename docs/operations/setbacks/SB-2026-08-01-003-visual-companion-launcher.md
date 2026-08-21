# SB-2026-08-01-003: Visual companion shell launcher unavailable

- Status: closed
- First observed: 2026-08-01 19:14 CDT
- Last observed: 2026-08-02 12:49 CDT
- Phase/task: product design visual companion startup
- Environment: Codex desktop on Windows
- Version/commit: `ad56050`
- Owner: primary agent

## Symptom and impact

The approved visual companion did not start. No browser session or local server was opened, and no project content was exposed.

## Reproduction and evidence

Launching the provided shell script with a Windows-style path caused `/bin/bash` to report that the script did not exist. A follow-up PowerShell invocation of `bash` failed with a terminated logon-session error. PowerShell confirmed that the script itself exists at the documented skill location.

## Cause analysis

- Confirmed cause: this Windows tool environment does not provide a usable Bash invocation for the supplied shell launcher.
- Hypothesis: the underlying Node server can be started directly with the environment values normally prepared by the shell script.
- Rejected hypothesis: the visual companion launcher file was missing; `Get-Item` confirmed it exists.
- Known exclusions: no project file, browser state, or user action caused the failure.

## Attempts and outcomes

The documented shell-script launch and a Bash path check both failed before starting the server.

### Recurrence at 2026-08-01 19:19 CDT

The direct Node fallback reached the supplied server but its randomly selected port `50233` was inside Windows' excluded TCP range `50162-50361`, so binding was denied with `EACCES`. No listener existed on that port. The next attempt will use a checked port outside all reported excluded ranges.

### Recurrence at 2026-08-01 19:25 CDT

The checked-port launch served the first screen correctly, but the shell command retained a 10-second total timeout. The process was terminated after the initial verification, leaving a stale `server-info` file and a paused browser tab before the second screen could be reviewed. The restart will retain the authenticated port/token and use a one-hour command timeout so the foreground server survives across turns.

### Diagnostic limitation at 2026-08-01 19:27 CDT

After the timeout-safe restart, the authenticated HTTP request returned status 200 and contained the second layout screen. A nonessential `Get-NetTCPConnection` listener-count query then returned `Access denied`. Future verification will use the authenticated HTTP boundary and server lifecycle files, which do not require elevated network-inspection privileges.

### Recurrence at 2026-08-01 20:15 CDT

An optional authenticated request to the companion's `/files/full-page-preview-v3.html` asset route did not complete within the 10-second diagnostic timeout. The live session retained `server-info` and had no `server-stopped` marker. The revision will be pushed as a self-contained fresh screen instead of dynamically depending on the older mockup asset.

### Verification command error at 2026-08-01 20:17 CDT

The first verification command for the self-contained revision failed during PowerShell parsing because an apostrophe in the expected phrase terminated a single-quoted pattern. The request did not execute. The follow-up check will use quote-safe ASCII substrings and verify the authenticated root response.

### Helper limitation at 2026-08-01 20:21 CDT

An attempt to clone the last self-contained mockup through a Base64-encoded read failed before patching because the JavaScript isolate does not expose `atob`. No output file was created. The shell tool already returns raw textual output, so the retry will extract the content after its `Output:` marker and still create the fresh screen through `apply_patch`.

### Encoding safeguard at 2026-08-01 20:22 CDT

The raw-output retry reached the source, but PowerShell's default output encoding changed a UTF-8 middle-dot character. A required-fragment check stopped the operation before `apply_patch`, so no corrupted copy was written. The next read will explicitly set console output and file decoding to UTF-8 before applying the same guarded replacements.

### Planned lifecycle expiry at 2026-08-01 20:47 CDT

The long-lived foreground command reached its configured one-hour timeout and terminated the localhost server before the Revision 7 HTTP check. The revision file was already written safely. The same session path, authenticated token, and checked port will be restarted under a new one-hour command so the existing browser tab can reconnect.

### Verification guard mismatch at 2026-08-01 20:58 CDT

The Revision 9 transformation intentionally retained the word `ochre` in explanatory preview copy stating that the color was removed. A broad post-edit guard treated any occurrence of that word as an active palette reference and stopped before `apply_patch`; no partial screen was created. The retry will check only active CSS tokens, variables, and class names while allowing the explanatory sentence.

### Recurrence at 2026-08-01 21:19 CDT

A combined specification check embedded an apostrophe-bearing phrase inside a PowerShell single-quoted regular expression. PowerShell rejected the command during parsing before any check ran or any file changed. This repeats the earlier quote-safety failure category. The retry will count the quote-free word `shaping` and avoid nesting apostrophe-bearing text in PowerShell string literals.

### Recurrence at 2026-08-02 01:17 CDT

The persisted visual-companion session had a valid `server-info` file and no `server-stopped` marker, but an authenticated loopback request could not connect. The previous supervised process had ended, leaving stale lifecycle evidence. No public service, portfolio code, or user data was affected. The same authenticated session will be restarted on its recorded port before a new comparison screen is written.

The first post-restart content check inspected the expected 305-byte authentication bridge returned when the session key is exchanged for a cookie, so its missing-fragment result did not describe the active screen. A cookie-preserving second request reached the comparison page. The hypothesis that file timestamp ordering retained the old screen was rejected because the new file was already newest and the authenticated second request returned it.

### Recurrence at 2026-08-02 12:46 CDT

The documented Bash launch was retried with the existing Windows drive-letter path. Git Bash translated the command context but did not resolve the `C:/...` script argument, and the launcher exited before starting a server. PowerShell then confirmed the launcher still exists at the expected skill location. No portfolio source, public site, browser data, or user content changed. The recurrence is contained; the next attempt will use the already-verified direct Node server fallback rather than retrying Bash.

The direct Node fallback then started an authenticated loopback companion on a checked, non-excluded port. Two cookie-preserving requests returned HTTP 200 and the active comparison screen, no `server-stopped` marker existed, and the user approved the proposed Prompt-to-Model-B and Router-to-Answer treatment. This recurrence is closed without a portfolio-code change.

## Correction and prevention

Use the supplied `server.cjs` directly through `C:/Program Files/nodejs/node.exe`, preserving the launcher's project-local session directory, loopback bind, authenticated token, persistent port/token files, browser-open opt-in, and disabled telemetry. Select an explicit port only after checking it against active listeners and Windows excluded TCP ranges.

For palette-removal revisions, validate active CSS variables, `var(...)` references, and color-specific classes rather than rejecting explanatory prose that names a removed color.

## Verification

The same authenticated session restarted on port `52123`. The root URL returned HTTP status 200 and contained Revision 7, the paragraph ending with `driven by imagination`, and the footer `Imagination is always shaping what comes next`. No `server-stopped` marker exists.

Revision 9 was then rendered in the user's preview browser. The live page exposed forest `#356351`, copper `#B86F4B`, and dusty slate blue `#718999`; it had zero active ochre CSS tokens, no ochre variable, and no ochre event classes. The visual screenshot showed the revised three-color balance and the page remained connected.

The quote-safe specification check completed with zero `TODO` or `TBD` markers, confirmed the curated-site and deferred-link decisions, and found the exact CSP contract. The recurrence is closed.

## Next diagnostic step

None. On this Windows environment, use the direct Node fallback first and verify both authenticated HTTP delivery and the visible comparison before requesting approval.
