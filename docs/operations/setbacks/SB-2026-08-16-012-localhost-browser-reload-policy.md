# SB-2026-08-16-012: Browser policy blocked localhost preview reload

- Status: closed
- First observed: 2026-08-16
- Last observed: 2026-08-17
- Phase/task: revised portfolio mockup acceptance
- Environment: Codex desktop in-app browser
- Version/commit: uncommitted visual-companion mockup
- Owner: primary agent

## Symptom and impact

After the mockup was revised, the in-app browser rejected an automated reload of the existing `http://localhost:52123/` preview under its URL security policy. The file update completed, but browser-rendered acceptance could not continue in this turn.

## Reproduction and evidence

One reload call was issued against the already-claimed localhost preview tab. The browser policy rejected the action and explicitly prohibited retries, workarounds, raw browser commands, or alternate browser surfaces.

## Cause analysis

- Confirmed cause: the in-app browser URL policy blocked the localhost reload action.
- Hypotheses: none pursued because the policy response forbids workaround attempts.
- Known exclusions: the preview source file and local server process were not changed by the rejected browser action.

## Attempts and outcomes

No retry or alternate browser automation was attempted. Acceptance continued through source-level structure, script syntax, and responsive-contract checks only.

### Reload recovery recurrence

After the companion server was restored, the previously retained preview-tab binding returned `Unknown tab: 1`. The server itself was healthy and every preview endpoint returned HTTP 200. Per the browser-control contract, the stale tab binding will be discarded and the currently open tab will be reacquired from the existing browser connection rather than opening a duplicate browser surface.

The first fresh-tab attempt called an unsupported `browser.tabs.open` method and failed before navigation. No tab was created. The next step is bounded API inspection of the existing browser binding followed by the supported tab-creation call.

### Workflow screenshot helper limitation

The revised About page loaded and its complete seven-step workflow appeared in the live DOM, but an optional locator-level `scrollIntoViewIfNeeded` call was unavailable in this browser API. The call made no page or file change. Rendered acceptance continues through direct page interaction, viewport checks, and screenshots that do not depend on the unsupported helper.

### Browser helper path mismatch recurrence (2026-08-17)

- Status: closed after reconnection verification.
- Symptom: the persistent browser binding was absent in the new turn; the first reconnect attempt used a `skills/.../scripts` path, but the helper is stored at the browser plugin root and the import failed before any browser action.
- Confirmed cause: incorrect local helper path, not a site or preview-server failure.
- Impact: no page, source file, browser tab, or user data was changed; refresh was delayed until the supported browser runtime could be reconnected.
- Correction: used the plugin-root `scripts/browser-client.mjs` path, started the same local preview server, opened the preview, and performed one bounded refresh verification.

### Preview server lifecycle recurrence (2026-08-17)

- Symptom: after the prior turn ended, the retained localhost tab reopened to a connection error because its supervised preview server was no longer running.
- Confirmed cause: the foreground preview process ended with the prior tool session; source files and the browser tab were unchanged.
- Impact: the requested reload could not complete until the local preview was restarted; no production, remote, or user data was affected.
- Correction: restarted the loopback preview on a checked local port, reacquired the existing user tab, and reloaded it. The live DOM then reported three `ellipse` rings and three `solar-orbit-spin` tracks, and the tab console was empty.
- Prevention: after a turn boundary, verify the local listener before claiming a retained preview is reloadable; restart the supervised server when needed.

### URL-policy reload recurrence (2026-08-17)

- Status: contained.
- Symptom: after the server restart, the in-app browser rejected the requested reload of the existing localhost tab under its URL policy.
- Confirmed cause: browser policy enforcement, not a source or server response failure.
- Impact: automated visual reload could not be completed in this turn; no page, source, remote, or user data changed.
- Rejected workaround: alternate localhost URLs, fresh browser surfaces, raw browser commands, and CDP-style control were not attempted because the browser contract forbids policy circumvention.
- Next action: the user can click the tab's normal reload control; once the policy permits the page, the preview should load from the already-running local server.

## Correction and prevention

Keep the existing local preview URL available for a normal user refresh. Do not claim browser-rendered acceptance until a permitted browser session can reload and inspect the revision.

## Verification

The companion server restarted on loopback port `52123`. The root preview and all thirteen named HTML preview routes returned HTTP 200. A fresh tab from the existing in-app browser connection loaded the full portfolio preview, and live interaction checks opened Home, Projects, project case study, Certifications, study map, About Me, Manager, and GitHub importer with their expected page content. A final screenshot confirmed the Home view rendered visibly rather than returning a blank or error page.

## Next diagnostic step

None; the refreshed preview is open in the in-app browser and marked as the deliverable tab.
