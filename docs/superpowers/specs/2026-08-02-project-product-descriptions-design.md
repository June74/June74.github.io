# Project product descriptions design

- Status: approved by owner in chat on 2026-08-02
- Owner: Injun Lee
- Affected surface: the one-line summary beneath Synapse, June, and MM

## Purpose

Replace contribution-led statements with brief product definitions so a visitor immediately understands what each project is. The summaries remain casual, direct, and factual; they do not read like résumé bullets or imply that intended capabilities are already validated.

## Approved copy

- **Synapse:** `An AI routing system that analyzes each prompt and matches it with a suitable model.`
- **June:** `An AI secretary that brings scheduling, tasks, reminders, and follow-ups into one place.`
- **MM:** `A personal finance tracker that turns spending patterns into clear insights and practical suggestions.`

## Boundaries

- Replace only the three `.project-line` strings in `site/index.html`.
- Preserve project names, numbers, topic chips, diagrams, accessible disclosure behavior, layout, typography, animation, and links.
- Do not add status language, completion claims, development percentages, financial-advice claims, or a statement about how much code was AI-generated.
- Keep each description to one sentence and render it within the existing summary structure.
- Update the static content contract so all three exact sentences are required and the former `I own the product direction...` wording is rejected.

## Acceptance criteria

1. Each collapsed project summary displays its approved product definition directly beneath the project name.
2. The exact approved sentences appear once each in the public HTML.
3. The three former contribution-led sentences no longer appear.
4. Topic chips and all expanded diagrams remain unchanged.
5. The summaries remain readable without clipping or horizontal overflow at 390 by 844 and 1440 by 900 CSS pixels.
6. The browser console remains free of warnings and errors.
7. The static, dependency-free, three-accent-color, privacy, security, and GitHub Pages boundaries remain unchanged.

## Release boundary

This is a public-copy change. After independent content, product-alignment, and security review, publish through a pull request to `main`, wait for the GitHub Pages workflow, then verify the exact sentences and responsive layout at the public HTTPS URL.
