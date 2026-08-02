# Synapse prompt and router tint design

- Status: approved by owner after visual comparison on 2026-08-02
- Owner: Injun Lee
- Date: 2026-08-02
- Affected surface: Synapse diagram only

## Purpose

Strengthen the beginning of the Synapse routing diagram so the Prompt and Router nodes feel as deliberate as the selected Model B and Answer nodes. The change must clarify the flow without adding a fourth color, changing the diagram's meaning, or making every node compete for attention.

## Approved visual mapping

- Prompt adopts Model B's existing selected-node treatment: pale copper fill `#f0ded3`, copper outline `var(--copper)`, and `1.6` stroke width.
- Router adopts Answer's existing output treatment: pale green fill `#e4ece7` and forest outline `var(--forest)`. Its current `1.4` stroke width remains so the routing decision stays visually firm.
- Prompt text remains ink-colored. Router's label remains forest and its subtitle remains the existing dark neutral.
- Model A, Model C, and Model D remain neutral. Model B and Answer remain unchanged.
- Owner amendment: the single Router-to-Model-B route segment uses `var(--forest)`, matching the Router outline. The Prompt-to-Router and Model-B-to-Answer selected segments remain copper.

This produces a restrained copper input/output path with a forest-green decision segment, making the Router's handoff to the selected model visually explicit without introducing another color.

## Implementation boundary

- Add a dedicated `prompt-box` class to the existing Prompt rectangle in `site/index.html`.
- Add the approved Prompt fill, stroke, and stroke-width declaration in `site/styles.css`.
- Change only the Router fill from the near-white surface to the existing Answer pale green in `site/styles.css`.
- Override only the existing `.route-b.route-selected` stroke with `var(--forest)` after the shared copper selected-route rule.
- Preserve all SVG coordinates, dimensions, corner radii, paths, text, timing, and JavaScript behavior.
- Add no new color token, dependency, asset, request, or public information.

## Acceptance criteria

1. The Prompt rectangle uses `#f0ded3`, `var(--copper)`, and a `1.6` stroke width.
2. The Router rectangle uses `#e4ece7`, `var(--forest)`, and its existing `1.4` stroke width.
3. Model B remains the selected copper reference and Answer remains the green output reference.
4. The Router-to-Model-B segment uses `var(--forest)`; the Prompt-to-Router and Model-B-to-Answer selected segments remain `var(--copper)`.
5. The Synapse route animation still draws through all four models and reveals the answer with every existing delay unchanged.
6. The diagram has no clipping, overlap, horizontal overflow, console warning, or accessibility regression at the supported desktop and mobile widths.
7. The static, dependency-free, three-accent-color, privacy, and GitHub Pages boundaries remain unchanged.

## Verification

- Start with a focused failing contract that pairs the Router-to-Model-B segment with the Router outline while preserving the copper outer segments.
- Run the focused test, then the complete Node test suite and syntax checks.
- Inspect the expanded Synapse diagram in the local browser at desktop and mobile widths.
- Confirm the Prompt and Router computed styles, selected-route completion, responsive fit, and clean console.
- Complete independent product/security review before publication.

## Release impact

The change is a presentation-only update to the existing static artifact. After owner preview approval, publish through a reviewed pull request to `main`, wait for the GitHub Pages workflow, and smoke-test the real HTTPS URL. Rollback remains a reviewed revert followed by the same Pages verification.
