# SB-2026-08-01-001: Skill root expanded incorrectly

- Status: closed
- First observed: 2026-08-01 18:47 CDT
- Last observed: 2026-08-01 18:48 CDT
- Phase/task: portfolio discovery and workflow setup
- Environment: Codex desktop on Windows
- Version/commit: no Git repository exists yet
- Owner: primary agent

## Symptom and impact

The first attempt to read `scope-gate/SKILL.md` failed. No workspace content was changed, and the remaining requested skill files were still read.

## Reproduction and evidence

Expanding the catalog entry under `<user-root>/.codex/skills` fails because the entry declares the `r1` root, which maps to `<user-root>/.agents/skills`.

## Cause analysis

- Confirmed cause: the agent expanded the listed `r1` skill path using the `r0` root.
- Hypotheses: none outstanding.
- Rejected hypotheses: the skill was missing; reading it from the declared `r1` root succeeded.
- Known exclusions: no repository or user file caused the failure.

## Attempts and outcomes

The catalog mapping was reread and the file was opened from the declared `r1` root successfully.

## Correction and prevention

Resolve every short skill path through the catalog's root table before reading it. The relevant skill was fully read from the corrected location.

## Verification

`<user-root>/.agents/skills/scope-gate/SKILL.md` was read successfully in the follow-up command.

## Next diagnostic step

None; the cause is confirmed and corrected.
