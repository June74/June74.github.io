# SB-2026-08-02-021: Whole-branch review package used an invalid PowerShell pathspec form

- Status: closed
- First observed: 2026-08-02 00:57 CDT
- Last observed: 2026-08-02 00:58 CDT
- Phase/task: Task 6 final integrated review
- Environment: Windows PowerShell and Git
- Version/commit: `12fd68c`
- Owner: Continuity lead

## Symptom and impact

The first attempt to generate the whole-branch review package passed an exclusion pathspec in a PowerShell command form that Git rejected with its usage output. The package variable was therefore empty and `WriteAllLines` also rejected the null content. No repository or product file was changed.

## Cause analysis

The command mixed the commit range and an exclusion pathspec in a shell form that did not survive PowerShell argument handling as intended. Error-stop handling correctly prevented a misleading review package from being reported.

## Correction and prevention

The retry computed the merge base explicitly, built one range string, generated the full binary diff without path exclusions, normalized a null result to an empty array, and then wrote the package. Future package generation should prefer a single validated range and avoid optional exclusions unless they are necessary.

## Verification

The package from merge base `d3d0e8f38bc5c064c48c264467080584fd837069` through `12fd68c` was created at 109,375 bytes and assigned to the final security reviewer.

## Next diagnostic step

None.
