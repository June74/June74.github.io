# Earth Orbit Hero Design

**Status:** Approved by Injun Lee on 2026-08-16

## Goal

Replace the home hero's juggling illustration with a warm, softly illustrated rotating Earth surrounded by project initials. The hero should make the portfolio feel like a living system without introducing a high-tech, immersive, or dependency-heavy experience.

## Design

- The center object is an original inline SVG Earth illustration using the existing paper, sage, forest, blue, and copper tokens.
- The Earth rotates slowly in place through a subtle surface animation.
- Each featured project receives one concentric orbit ring and one circular initial marker.
- Current markers are `S` for Synapse, `V` for Vision, and `M` for MM.
- Initial markers remain upright while their orbit rings move.
- A visible text legend names the initials for readers who do not rely on the animation.
- The visual is data-driven from the existing home project disclosures. Adding a new project disclosure creates its own ring and initial marker automatically.
- The Earth and rings are decorative; project navigation remains in the Featured Projects section and route navigation.

## Content update

The project previously called June is renamed to Vision across the home page, Projects index, case-study route, and all visible case-study headings/copy.

## Accessibility and safety

- The SVG has a substantive accessible label and the adjacent legend exposes project names.
- `prefers-reduced-motion: reduce` stops Earth and orbit animation while preserving all markers.
- The static site remains dependency-free, local-only, and CSP-compatible.
- No external image, remote font, guessed project link, or new data collection is introduced.

## Acceptance criteria

1. The old juggler markup and styles are removed from the public home artifact.
2. The home hero shows a rotating illustrated Earth with `S`, `V`, and `M` circular markers.
3. The marker set is generated from the home project disclosures, so a fourth project creates a fourth ring and marker.
4. Vision replaces June on every public route and visible project description.
5. Reduced motion and no-JavaScript states remain legible.
6. Existing route, security, artifact, and responsive checks remain green.
