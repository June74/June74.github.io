# Injun Lee portfolio UI/UX redesign — design specification

- Owner: Injun Lee
- Continuity owner: Primary agent (Agent 5)
- Status: Awaiting owner review of the written specification
- Design approved in preview: 2026-08-16
- Written specification: 2026-08-16
- Supersedes: the visual hierarchy, information architecture, and content presentation in `2026-08-01-personal-work-showcase-design.md`
- Retains: its static-site, privacy, security, honest-claims, no-cost hosting, and release-verification requirements unless this document explicitly narrows them

## 1. Decision and product boundary

The approved direction is a warm, editorial portfolio that introduces Injun Lee through selected projects, certifications, and a concise personal story. It is a project showcase and gateway into Injun's work, not a conventional web resume, an Auburn-branded graduate page, or an immersive 3D experience.

The public portfolio remains a dependency-light static site with a viable $0 hosting path. It does not require a database, authentication, analytics, forms, remote fonts, third-party scripts, or a content-management service.

The approved preview also explored a private Manager and GitHub Importer. Those screens remain an approved design concept, but they are not part of this public-site implementation. Importing repository data changes the architecture, permissions, privacy model, error handling, and deployment surface. It therefore requires a separate technical and security specification before implementation. The public site must not expose repository tokens, private repository information, or administrative controls.

## 2. Design source of truth

This written specification is the durable source of truth for implementation. The local visual companion at `.superpowers/brainstorm/20260816-idea-atlas/content/full-portfolio-uiux-preview-v1.html` records the approved look and interaction direction, but it is a review artifact rather than deployable source.

The dark `COMPLETE UI/UX PREVIEW · PAGES` bar in that companion is a prototype page switcher. It must not appear in the public portfolio.

The production result must preserve the preview's overall mood:

- warm paper background rather than stark white;
- deep green-black text rather than pure black;
- high-contrast editorial serif headings paired with restrained sans-serif interface text;
- hairline dividers, softly rounded panels, and generous breathing room;
- forest, copper, dusty blue, and pale sage accents used sparingly;
- direct, human copy without corporate phrasing or inflated claims.

## 3. Public information architecture

The public navigation contains exactly three destinations:

1. `Projects`
2. `Certificates`
3. `About Me`

The name `Injun Lee` returns to the home page. `Contact` and a header `Resume` link are not included. Project, certificate, and social destinations appear only where they have meaningful context.

The public pages are:

- Home
- Projects index
- Project case study
- Certificates index
- Certificate study map
- About Me

The static route structure should be understandable without JavaScript. Recommended routes are `/`, `/projects/`, `/projects/<slug>/`, `/certificates/`, `/certificates/<slug>/`, and `/about/`. JavaScript may enhance selection, animation, and filtering, but it must not be required to reach or read any page.

## 4. Global visual system

### 4.1 Color tokens

| Role | Token | Value |
| --- | --- | --- |
| Warm page | `paper` | `#F3EFE6` |
| Warm secondary surface | `paper-2` | `#E8E4D8` |
| Light panel | `white` | `#FBFAF6` |
| Primary text | `ink` | `#1E2924` |
| Secondary text | `muted` | `#66716A` |
| Structural accent | `forest` | `#356351` |
| Warm accent | `copper` | `#B86F4B` |
| Cool accent | `blue` | `#718999` |
| Soft information panel | `sage` | `#DFE6DC` |
| Divider | `line` | `#C9C5BA` |

Normal text must meet WCAG 2.2 AA contrast. Color cannot be the only signal for selection, status, errors, or links.

### 4.2 Typography

- Display headings use a local-first high-contrast serif stack led by Georgia.
- Body and interface text use a local-first humanist sans stack led by Segoe UI Variable / Segoe UI.
- Utility labels use small uppercase sans text with restrained tracking.
- Remote font downloads are not permitted.

### 4.3 Shape and spacing

- Cards use quiet one-pixel borders and moderate corner radii rather than heavy shadows.
- Sections are separated primarily by space and hairline rules.
- Headings are large enough to create an editorial rhythm, but body copy remains the dominant source of detail.
- The layout must remain readable from 320 px through 1440 px without horizontal body overflow.

## 5. Shared header and footer

The header shows `Injun Lee` on the left and the three public destinations on the right. On narrow screens it may wrap or collapse into a keyboard-operable menu, but every destination must remain available without horizontal scrolling.

The home-page closing panel uses:

- Eyebrow: `Simply a work in progress`
- Heading: `A Little About Me`
- Link: `Read more →`, leading to the About Me page

Secondary page footers remain minimal. They must not repeat a large contact panel or an `AI systems · software · direction` promotional block.

## 6. Home page

### 6.1 Hero copy

Eyebrow:

> Hello! My name is

Heading:

> Injun Lee.

Supporting copy:

> I am a developer exploring how AI agents, dependable infrastructure, and practical product design can make complicated work feel more manageable.

The first viewport must identify Injun, explain his current direction, and provide a one-interaction route to projects.

### 6.2 Juggling stick figure

The right side of the hero contains an original line-drawn stick figure riding a unicycle and juggling three circular objects representing GitHub, LinkedIn, and Gmail. The approved Dribbble reference informs only the playful bounce, tilt, staggered arcs, and balancing rhythm. Its creature, lettering, composition, and artwork must not be copied.

The three juggling objects are the only social links in the home hero. The separate button grid above the illustration is removed. Each object needs an accessible name, visible focus treatment, and a touch target of at least 44 by 44 CSS pixels.

Until destinations are owner-verified, the three objects display clearly labeled placeholder behavior and are not empty or guessed links:

- `GitHub — link placeholder`
- `LinkedIn — link placeholder`
- `Gmail — contact placeholder`

When a destination is approved, the label becomes the real destination name and the link gains appropriate new-tab protection. An email address must not be published until the owner explicitly approves it.

The animation should feel hand-drawn and light rather than slick or high-tech. It may use CSS transforms and an original local SVG. It must avoid layout movement, stop on `prefers-reduced-motion: reduce`, and show a complete static pose when motion is reduced or JavaScript is unavailable.

### 6.3 Featured Projects

The heading is exactly `Featured Projects`. There is no explanatory paragraph beside it.

Three featured project cards appear in this order:

1. Synapse
2. June
3. MM

Each card shows:

- project index;
- honest status, such as `Active development` or `Planned build`;
- project name;
- one concise purpose statement;
- five or six technology tags, all visible without a `+N` counter.

Canonical purpose statements are:

- Synapse: `An AI routing system that analyzes each prompt and matches it with a suitable model.`
- June: `An AI secretary that brings scheduling, tasks, reminders, and follow-ups into one place.`
- MM: `A personal finance tracker that turns spending patterns into clear insights and practical suggestions.`

Technology and status labels must be verified against the current project source before public release. The preview's example labels are design data, not proof. When a value is not verified, the card must use an explicit `Technology placeholder` or `Status placeholder` label rather than inventing a claim. Planned technologies must be prefixed with `Planned:`.

Selecting a card updates the adjacent featured-project panel. That panel contains:

- the current project diagram already used by the project's GitHub Pages portfolio or approved local source;
- project name and status;
- purpose;
- tools used;
- skills demonstrated;
- `Explore full project →` leading to the case study.

The diagram is explanatory evidence, not a fake live product demo. If no current approved diagram is available, show a box labeled `Project diagram placeholder` with a short accessible description.

### 6.4 Featured Certificates

The heading is exactly `Certificates`.

Three featured certificate cards use the same visual family as project cards. Each includes:

- a certificate image or a clearly labeled `Certificate image placeholder`;
- credential title or `Credential title placeholder`;
- issuing organization or `Issuer placeholder`;
- a one-sentence description of what the credential covers;
- `Retest by: Month YYYY` when the credential expires or requires renewal;
- `No retest required` when the verified credential does not expire;
- `Retest date placeholder` when renewal requirements have not been verified.

Selecting a card leads to its certificate study map. Certificate images, dates, names, credential IDs, and verification links cannot be published until the owner approves them.

## 7. Projects index

The projects index uses a two-column grid of approximately square project cards on desktop and tablet widths. It becomes one column on narrow screens. It must never show three cards per row.

Each card includes the same status, name, purpose, and five or six fully visible technology tags as the featured card. The entire card may be an accessible link to the case study; nested interactive controls are not permitted.

The index may include lightweight filters only if they work with semantic controls and do not hide all projects when JavaScript fails. Search, sorting, pagination, and animated masonry are outside the first implementation.

## 8. Project case study

Every project page answers, in this order:

1. What is the project?
2. What problem is it intended to solve?
3. What did Injun contribute?
4. What is its honest current status?
5. Which tools were actually used?
6. Which skills did the work demonstrate?
7. What does the current diagram or demo explain?
8. What decisions, constraints, and next steps matter?

Public repository, demo, and live-site links appear only when their destinations are owner-verified. Labels must say exactly what opens, such as `View source repository ↗` or `Open live demo ↗`. A missing destination is omitted rather than rendered as a dead link.

Project pages must distinguish implemented behavior from planned behavior. A diagram of intended behavior is labeled `Concept diagram`; an implemented flow with evidence may be labeled `Current system diagram`.

## 9. Certificates and study maps

The certificate index uses two cards per row at desktop widths and one per row on narrow screens. Each card includes its certificate image, title, issuer, short description, earned date, validity or renewal state, and a route to the study map.

The study map explains what Injun needed to learn rather than merely displaying a badge. It includes:

- credential overview;
- major topic groups;
- practical skills gained;
- representative study activities;
- exam or assessment format only when verified;
- earned date and renewal requirement;
- credential verification destination when approved.

Placeholder cards remain clearly labeled and visually intentional. They must not use fake issuers, fake dates, fake credential IDs, or stock certificate images that could be mistaken for real credentials.

## 10. About Me

### 10.1 Personal introduction

The left column contains:

- Eyebrow: `Simply a work in progress`
- Heading: `A Little About Me`
- A small `Personal compass` panel with three labeled lines: `Currently building`, `Drawn to`, and `How I work`

The compass fills the previously empty column without competing with the personal narrative. Its values are clearly labeled placeholders until Injun supplies final copy.

The right column contains the main personal statement, supporting paragraph, and four consistently styled links:

- `Resume`
- `GitHub`
- `LinkedIn`
- `Gmail`

The link labels and visual treatment are uniform. Until owner-verified URLs, email, and resume file exist, each is presented as a non-link placeholder with its destination type stated. The Resume label must not say `Download résumé`.

Three concise values follow the introduction:

- `Build with direction`
- `Make complexity legible`
- `Stay honest about progress`

### 10.2 Primary workflow

The About Me page includes a section headed `Steps I take to create my projects`. It presents a seven-step process:

1. `Define the problem` — describe the person, need, constraint, and intended outcome.
2. `Outline requirements` — separate essential behavior from ideas that can wait.
3. `Research and select tools` — choose tools for the problem, operating constraints, and maintenance cost.
4. `Design the system` — map components, data flow, failure states, and the user journey.
5. `Build in small, reviewable pieces` — keep each slice understandable, testable, and reversible.
6. `Test the real user experience` — verify the actual path, edge cases, accessibility, and responsive behavior.
7. `Document, reflect, and iterate` — record decisions, limitations, evidence, and the next improvement.

The workflow may appear as a numbered editorial timeline or stacked cards. It must remain linear and readable without animation.

## 11. Placeholder contract

Placeholders are an intentional temporary content state, not vague implementation markers.

- Every placeholder must include the word `placeholder` in visible text.
- Placeholders cannot be focusable unless they perform a real action.
- Placeholder cards and images use local neutral geometry and cannot imply a real credential, project outcome, or external destination.
- No placeholder uses `#`, `javascript:`, an empty `href`, `example.com`, a guessed social URL, or a guessed repository URL.
- Replacing a placeholder requires owner approval of the exact public value and a link/privacy review where applicable.

## 12. Interaction and accessibility

- All navigation, card selection, and links are operable by keyboard.
- Focus indicators are always visible and meet contrast requirements.
- Interactive targets are at least 44 by 44 CSS pixels where layout permits.
- Semantic links navigate; semantic buttons change local state.
- Selected project state is communicated through text or native state in addition to color.
- Images and diagrams have useful alternative text or adjacent accessible descriptions; decorative strokes are hidden from assistive technology.
- Motion stops under `prefers-reduced-motion: reduce` and no information depends on animation timing.
- The page remains useful when JavaScript fails.
- The document has one logical `h1`, ordered headings, landmarks, and a skip link.
- Mobile layouts have no horizontal body overflow, clipped tags, overlapping controls, or off-screen navigation.

## 13. Technical shape

The public portfolio remains static and local-first:

- semantic HTML files for public routes;
- shared local CSS for tokens, components, responsive layout, and motion;
- small local JavaScript modules only for progressive enhancement;
- local SVG and certificate assets after metadata and privacy review;
- Node built-in tests for copy-to-card ownership, route integrity, placeholder rules, link safety, and static security contracts;
- no framework or package manager unless a later technical design demonstrates that it earns its cost.

Project and certificate content should live in a single explicit content source or consistently structured HTML fragments so the home cards, indexes, and detail pages cannot silently contradict one another. The implementation plan must choose the smallest approach compatible with a dependency-free static site.

The existing Content Security Policy, no-referrer policy, HTTPS-only links, new-tab protections, curated Pages artifact, and zero nonessential third-party requests remain required.

## 14. Responsive behavior

- At wide widths, the hero, selected-project panel, and About introduction use two balanced columns.
- The Projects and Certificates indexes use exactly two columns at desktop widths.
- Featured home cards may use three columns only for the three-item featured row; all tags must remain visible.
- At narrow widths, all grids become one column, navigation remains usable, diagrams scale within their panels, and the stick figure remains visually secondary to the introduction.
- The home hero cannot require scrolling past an oversized illustration before visitors can reach the introduction or projects.

## 15. Acceptance criteria

The redesign is accepted only when:

1. The public site matches the approved warm editorial direction and does not include the prototype page-switcher bar.
2. The first viewport shows `Hello! My name is`, `Injun Lee.`, the approved supporting sentence, and the original juggling stick figure.
3. The hero has no separate social button grid; its three juggling objects are either verified links or visibly labeled, noninteractive placeholders.
4. Global navigation contains `Projects`, `Certificates`, and `About Me`, with no `Contact` or header `Resume` item.
5. The home page displays three featured projects with all five or six technology tags visible and no `+N` tag.
6. Selecting a featured project exposes its approved current diagram, purpose, status, tools, skills, and case-study route without changing pages unintentionally.
7. The Projects index has two square cards per row at desktop widths and one per row on mobile.
8. The home page displays three featured certificate cards with an image state, short description, and verified renewal wording or explicit placeholders.
9. Certificate details explain what was studied and never invent credential information.
10. About Me contains the Personal compass, four uniform destination rows, three values, and the seven-step project workflow.
11. Placeholder behavior follows Section 11 and no guessed public information is shipped.
12. Keyboard, reduced-motion, no-JavaScript, responsive, link, copy-ownership, secret-scan, and accessibility checks pass with no unresolved serious issue.
13. The production site makes zero nonessential third-party requests and retains a viable $0 GitHub Pages path.
14. Private Manager and GitHub Importer controls are absent from the public build and artifact manifest.
15. A local preview, committed source, deployed source, and verified public release are reported as four separate states.

## 16. Explicit non-goals for this implementation

- Torii gates, guided walking, WebGL, VR, parallax tunnels, or an immersive 3D scene.
- A conventional resume page, Auburn branding, university identity, or inflated ownership claims.
- A public contact form, newsletter, analytics, tracker, authentication flow, database, or CMS.
- A functioning GitHub importer, repository token flow, public manager, or automatic deployment pipeline driven by the manager.
- Invented social links, email address, resume file, certificate details, project outcomes, technologies, demos, or repositories.
- Copying the referenced Dribbble artwork or another developer's portfolio assets, code, or written content.

## 17. Risks and controls

| Risk | Control |
| --- | --- |
| The playful animation distracts from Injun's name | Keep it in the secondary hero column, use restrained motion, and stop it under reduced-motion settings. |
| Technology or status tags become inaccurate | Verify each value from the current project source; label planned or unknown values explicitly. |
| Placeholder information looks real | Require the visible word `placeholder` and prohibit fake issuers, dates, URLs, and credential IDs. |
| Certificate images expose private metadata | Use neutral local placeholders until owner review; inspect approved images before publication. |
| Social and resume destinations expose unapproved information | Keep them noninteractive until the owner approves the exact destination. |
| A private importer expands the public attack surface | Keep Manager and Importer out of the public artifact and require a separate architecture/security design. |
| Multi-page content drifts | Store shared content once or enforce exact mapping tests between summaries and detail pages. |
| Inspiration becomes imitation | Reuse only high-level motion and hierarchy principles; create original artwork, layout details, copy, and code. |

## 18. Change control

This document changes the earlier public-information boundary by designing locations for social links, a resume, certificates, and richer project detail. Those values remain placeholders until individually approved for publication.

Changes to public information, page inventory, navigation, project meaning, certificate claims, visual direction, motion, external services, importer behavior, deployment, privacy, or security reopen the earliest affected gate. Minor copy corrections and visual refinements that preserve this specification may proceed in implementation with related tests and recorded evidence.

Approval of this written specification authorizes creation of an implementation plan. It does not authorize public deployment, publishing personal information, or implementation of the private Manager/GitHub Importer.
