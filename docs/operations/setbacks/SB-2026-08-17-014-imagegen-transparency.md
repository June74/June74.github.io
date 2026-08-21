# SB-2026-08-17-014: Background extraction exported opaque checkerboard PNGs

- Status: contained
- First observed: 2026-08-17 20:48 CDT
- Last observed: 2026-08-17 20:51 CDT
- Phase/task: attached cat image background removal
- Environment: Codex desktop built-in image editor on Windows
- Version/commit: `6a5822473a9a4dfdb733ddab18cd896760f24073`
- Owner: primary agent

## Symptom and impact

Eight background-extraction previews visually resembled transparent cutouts, but the saved PNG files contained an opaque checkerboard rather than transparent pixels. They are unsuitable as transparent website assets and must not be presented as completed deliverables.

## Reproduction and evidence

The built-in image editor was asked for genuine alpha transparency on each edit target. After the outputs were copied into `output/background-removed/`, a local file inspection reported `Format24bppRgb` for all eight files. A narrower retry for the first image explicitly required RGBA output, alpha-zero background pixels, and no rendered checkerboard; its saved file also reported `Format24bppRgb`.

## Cause analysis

- Confirmed cause: the saved built-in editor outputs do not contain an alpha channel, despite the transparency request.
- Hypothesis: the editor rendered a checkerboard as image content instead of encoding transparency.
- Rejected hypothesis: insufficient prompt specificity; the explicit RGBA retry reproduced the same opaque RGB result.
- Known exclusions: the attached source images were not modified or overwritten.

## Attempts and outcomes

The initial eight edits and one explicit RGBA retry all produced visually isolated subjects but opaque RGB files. No alternate CLI, API, or local image-processing workflow was used because switching paths requires the owner's approval.

## Correction and prevention

- Correction: treat the current outputs as invalid, remove the invalid workspace copies, and request approval before using the documented CLI fallback or another explicitly chosen image-processing path.
- Prevention: inspect PNG alpha-channel data before presenting any background-removal output as transparent.

## Verification

The alpha-channel inspection was rerun on the explicit retry and again reported `Format24bppRgb`, confirming that the built-in path remains unsuitable for this request.

## Next diagnostic step

If the owner approves a fallback, run it on one source image first, verify that transparent pixels are encoded, visually inspect the fur and whisker mask, and only then process the remaining seven images.
