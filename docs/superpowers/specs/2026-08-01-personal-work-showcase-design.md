# Injun Lee personal work showcase — design specification

- Owner: Injun Lee
- Continuity owner: Primary agent (Agent 5)
- Status: Approved
- Last reviewed: 2026-08-01
- Upstream decision: Full-page visual design Revision 9 approved by the owner on 2026-08-01
- Downstream consumers: implementation plan, developers, product review, security review, release acceptance

## Gate ledger

| Gate | Owner | Disposition | Evidence | Remaining action |
| --- | --- | --- | --- | --- |
| Visual direction | Site owner | Approved | Revision 9 approval in the 2026-08-01 design session; `docs/design/approved-revision-9-reference.html` | Preserve the approved hierarchy while replacing mockup-only markup with production semantics |
| Product alignment | Agent 2 | Pass | 2026-08-01 final review; person-first copy, honest claims, contribution statements, work navigation, and first-release exceptions verified | Owner must approve the revised written copy and exceptions |
| Security design | Agent 1 | Pass for design | 2026-08-01 final review; curated artifact, exact meta CSP, hosting privacy limitation, SVG subset, and history review verified | Pin and review GitHub-owned workflow actions during implementation; complete pre-publication evidence |
| Continuity | Agent 5 | Pass | 2026-08-01 final review; native disclosure states, durable visual reference, staged release, rollback, performance, and draft-marker contracts verified | Owner approval changes this specification from `In review` to `Approved` |
| Implementation authorization | Site owner | Approved | Owner approved the written specification on 2026-08-01 | Create the implementation plan and begin reviewed development slices |

The visual approval did not by itself approve the added technical, security, interaction-state, or release decisions. The owner subsequently approved this written specification, which authorizes local implementation but does not authorize a public repository push or deployment.

## 1. Purpose

Build a minimalist personal website that introduces Injun Lee through the AI systems he is shaping. The page is a project showcase, not a web résumé and not an Auburn University graduate page. It should feel personal, imaginative, direct, and quietly confident while remaining easy for collaborators, hiring contacts, and peers to scan.

The first release must have a viable $0 path through GitHub Pages and must not depend on a custom domain, paid service, backend, database, analytics platform, or hosted font.

## 2. Public-information boundary

The first release intentionally publishes only:

- The name `Injun Lee`.
- The GitHub profile `https://github.com/June74`.
- The approved first-person positioning copy.
- The approved project names, one-line descriptions, topic labels, and illustrative diagrams.

It does not publish an email address, telephone number, physical location, university, degree, résumé file, portrait, private repository, detailed development-progress label, release claim, or financial data. The high-level phrase `currently shaping` is approved to describe active direction; it does not state a completion percentage, launch status, or validated capability. Illustrative values inside the MM diagram are fictional interface examples, not the owner's personal finances.

No direct contact channel is included in the first release because the owner has approved no public contact detail. GitHub is the one-action public profile and work route, not a guaranteed messaging channel. Adding contact information requires a new public-information and security review.

## 3. Content

### 3.1 Navigation

- Left: `Injun Lee`.
- Right: `GitHub ↗`, linking to `https://github.com/June74`.
- The GitHub link opens in a new tab and uses `rel="noopener noreferrer"`.

### 3.2 Hero

Headline:

> Injun Lee.<br>
> I build AI systems<br>
> around people.

Supporting copy:

> I’m a software engineer focused on expanding what AI can do without losing sight of who it should serve. My work centers on AI capabilities and agent orchestration—coordinating systems that can take on large tasks and complex projects. Right now, I’m shaping accessible, affordable products grounded in practical direction and driven by imagination.

Supporting label: `Currently shaping three systems`.

The supporting label is also a subtle anchor link to `#current-work`, preserving its approved appearance while giving visitors a direct route to the project chapters.

The hero's signature visual is a blank central node with several signals orbiting on four paths at varied speeds. It suggests a growing system of connected intelligence without naming the center after the owner or referencing fictional assistants.

### 3.3 Current work

Section heading: `Current work`.

Supporting label: `Three systems I’m shaping`.

Projects appear in this order:

1. **Synapse**
   - One line: `I own the product direction and routing design for a system that pairs each prompt with the model best suited to it.`
   - Topics: `AI routing`, `Product direction`, `System design`.
   - Expanded visual: a prompt enters a router, four evenly aligned model choices appear, one route is selected, and that model produces an answer.
2. **June**
   - One line: `I own the product direction and behavior design for an AI secretary built around schedules, tasks, reminders, and follow-through.`
   - Topics: `AI agents`, `Calendar`, `Task planning`.
   - Expanded visual: a five-day calendar fills with five named events in sequence while two items on an adjacent to-do list are completed in sequence.
3. **MM**
   - One line: `I own the product direction and behavior design for a system that turns spending patterns into practical reflection.`
   - Topics: `AI analysis`, `Personal finance`, `Behavior patterns`.
   - Expanded visual: an illustrative seven-day spending chart totals `$461`; a `$500` weekly plan shows `$300` spent and `$200 remaining`; two suggestions reference `$86` of dining and the remaining balance.

The project numbers `01`, `02`, and `03` act as compact catalogue indexes rather than a process sequence.

Project-specific destinations are explicitly deferred from the first public release because no owner-verified URLs exist yet. The owner-approved GitHub profile is the only work destination. Project rows must not contain placeholder anchors, dead links, guessed GitHub repositories, or labels that imply a prototype is publicly available. When the owner supplies a public repository, demo, or write-up, adding that verified destination is a content change requiring link and security review, not a visual redesign.

### 3.4 Claim ledger

The three project statements describe Injun's active product direction, not completed or publicly proven capabilities:

- `I own the product direction` reflects ownership of each product idea, planning, behavior design, implementation direction, and code review.
- The expanded diagrams are labeled as illustrative glimpses of the intended product behavior.
- The site does not claim that model selection is already validated, that June currently performs calendar actions, that MM provides financial advice, or that any project is deployed.
- Capability wording may become definitive only when the owner approves evidence supporting that change.

### 3.5 Footer

- Eyebrow: `A growing system of ideas`.
- Statement: `Imagination is always shaping what comes next.`
- Link: `Follow my work on GitHub ↗`, pointing to the approved GitHub profile with new-tab protection.
- Bottom labels: `Injun Lee` and `AI systems · software · direction`.

## 4. Information architecture and layout

The site is one semantic page with this order:

1. Navigation
2. Hero and ambient system visual
3. Current-work heading
4. Three expandable project chapters
5. Footer and GitHub link

The desktop hero uses two balanced columns: copy on the left and the orbital system on the right. Project summaries form calm horizontal chapters divided by hairline rules. On narrow screens the hero and all expanded project diagrams become single-column, with project content remaining readable from 320 px through 1440 px without horizontal overflow.

The page must remain fully understandable before any project is expanded.

## 5. Visual system

### 5.1 Color

The approved accent system contains exactly three chromatic roles:

- Forest `#356351`: foundation, primary structural accent, central node, and confirmation states.
- Copper `#B86F4B`: warm counterpoint, selected routes, chart line, and small emphasis.
- Dusty slate blue `#718999`: cool technical counterweight used sparingly in orbit signals, secondary topic borders, and diagram events.

Neutrals support these accents:

- Warm paper `#F1EEE6`.
- Deep ink `#18201C`.
- Soft sage `#829A8E`.
- Pale panel `#E2E6DC`.
- Hairline rule near `#B2B2A9`.

Muted ochre is excluded. No fourth chromatic accent may be introduced without reopening visual design.

Text and interactive states must meet WCAG 2.2 AA contrast targets: 4.5:1 for normal text and 3:1 for large text and essential interface graphics.

### 5.2 Typography

- Display headings: a local-first high-contrast serif stack led by Georgia.
- Project names and interface text: a local-first humanist sans stack led by Segoe UI Variable / Segoe UI.
- Utility labels: uppercase sans text with restrained tracking.

No remote fonts or font-loading scripts are permitted. Type scale and spacing must preserve the approved editorial hierarchy without mimicking a conventional résumé.

### 5.3 Motion

The orbital hero is the one continuous ambient motion. Orbits use different slow durations and directions so the center feels active without becoming a loading indicator.

Project motion is purposeful and finite:

- Synapse routes draw only after the project panel opens; the first route begins late enough to be observed.
- June events appear one at a time; no two calendar events share the same start time.
- MM draws the spending path, fills the budget bar, and reveals two suggestions in sequence.
- A project animation runs once per expansion. It resets only after the project collapses and may replay on the next expansion.

When `prefers-reduced-motion: reduce` is active, continuous motion stops and all diagrams show their final informative state immediately.

## 6. Interaction contract

Each project uses the native HTML `details` / `summary` disclosure pattern. The summary has a clear accessible name and includes the project name, one-line contribution statement, topics, and plus indicator. Native disclosure behavior keeps the content operable when JavaScript fails.

| State | Visible behavior | Accessibility behavior | Exit condition |
| --- | --- | --- | --- |
| Collapsed | Summary is visible; diagram panel is closed | Native disclosure reports collapsed and the closed content is absent from the accessibility tree | Fine-pointer hover, summary activation, or scripted opening |
| Hover preview | On `(hover: hover) and (pointer: fine)` only, entering a collapsed project temporarily opens it and runs the diagram once, but only when no project is pinned | Native disclosure reports open while the panel is visible | Pointer leave closes it unless the visitor activated the summary to pin it |
| Persistently open | Click, tap, Enter, or Space opens and pins the project; a hover preview becomes pinned if activated | Native disclosure reports open; focus remains on the summary | Activating the same summary closes it, or opening another project closes it |
| Reduced motion | State behavior is unchanged; orbital and diagram animation stops and the final informative frame is visible | Information is identical to the animated state | Normal disclosure controls |
| No JavaScript | Native `details` elements start collapsed and independently toggle with pointer, keyboard, or touch; exclusive-open and hover-preview enhancements are absent | Browser-native disclosure semantics and focus behavior apply | Normal native disclosure controls |

Only one project is persistently open when JavaScript is active. While a project is pinned, all other hover previews are suppressed. Deliberately activating another summary closes the pinned project and opens the new one. Coarse pointers never receive hover-preview listeners. The plus icon rotates to communicate the open state but is not the sole state indicator. Focus is never moved automatically into a diagram.

The three diagrams are explanatory visuals. Each has a concise accessible description; purely decorative SVG details are hidden from assistive technology.

## 7. Technical design

The product is a dependency-free static site:

- `site/index.html`: semantic structure, approved copy, inline explanatory SVG markup, metadata, and accessible controls.
- `site/styles.css`: tokens, responsive layout, component states, animation keyframes, visible focus, and reduced-motion behavior.
- `site/script.js`: small progressive-enhancement controller for project expansion and input modality. No framework and no network calls.
- `site/assets/favicon.svg`: local, metadata-safe site icon derived from the three-color orbital motif.
- `tests/site.test.mjs`: Node built-in tests for the public content and critical static contracts.
- `README.md`: local preview, verification, GitHub Pages deployment, public URL, zero-cost limits, and rollback steps.
- `.github/workflows/pages.yml`: a GitHub-owned Pages workflow that uploads only the curated `site/` directory as the deployable artifact.

The page retains its complete content, native disclosure controls, diagrams, and GitHub links if JavaScript fails.

No package manager, build step, analytics, form, cookie, local storage, service worker, third-party script, iframe, embed, remote image, or remote font is required.

## 8. Browser security and privacy

- Use only HTTPS outbound destinations.
- Use descriptive links and new-tab protection.
- Do not use `innerHTML`, `eval`, dynamic script creation, or unsafe URL construction.
- Site code adds no analytics, tracking, browser storage, forms, or nonessential network requests. GitHub Pages is the hosting processor and may log visitor IP addresses for security under GitHub's published terms; the site does not add to that collection.
- Add `<meta name="referrer" content="no-referrer">`.
- Place this exact Content Security Policy meta element as early in `<head>` as practical: `default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-src 'none'; media-src 'none'; worker-src 'none'; manifest-src 'none'`.
- CSP requires external local JavaScript and CSS. Inline event handlers, inline `<style>` blocks, `style` attributes, SVG scripts, and remote resources are prohibited.
- Inline SVG and the SVG favicon use static geometry and text only. They may not contain scripts, event attributes, `foreignObject`, external `href` or `use` references, remote resources, or embedded data payloads.
- Document that a meta CSP cannot enforce `frame-ancestors`, `sandbox`, reporting, X-Frame-Options, HSTS, Permissions-Policy, or MIME-sniffing response headers. GitHub Pages supplies HTTPS but not repository-configurable custom response headers. Clickjacking response-header protection therefore remains unavailable on this host; its practical impact is low for this read-only, no-form site and must be reassessed if interactivity expands.
- Generated public files must contain no local absolute paths, session keys, private endpoints, source maps, or `.superpowers` review artifacts.

## 9. Metadata

- Document title: `Injun Lee — AI Systems`.
- Description: `Injun Lee shapes human-centered AI systems through product direction, agent orchestration, and careful software engineering.`
- Canonical metadata is omitted until the account/repository preflight passes. Once confirmed, its value is `https://june74.github.io/`.
- Set the language to English and include responsive viewport metadata.
- Do not publish speculative social-profile metadata or remote preview images in the first release.

## 10. Verification plan

### Automated checks

- `node --test tests/site.test.mjs` passes.
- `node --check site/script.js` passes.
- All required public copy and the two approved GitHub links are present.
- Every new-tab link includes `noopener noreferrer`.
- No draft marker (`TODO`, `TBD`, `FIXME`, lorem ipsum, `example.com`, empty `href`, or `href="#"`), prohibited personal data, remote asset, external script, analytics, form, or active ochre token is present. Approved illustrative diagram microcopy such as `Plan my week...` is intentional content, not a placeholder.
- Every project uses a valid native `details` / `summary` disclosure with the correct initial collapsed state.
- CSS contains visible-focus and reduced-motion rules.

### Browser acceptance

- Test at representative widths near 320, 768, 1024, and 1440 px.
- Verify no horizontal overflow, clipped copy, overlapping controls, or unreadable diagrams.
- Exercise collapsed, hover-previewed, persistently open, reduced-motion, and no-JavaScript states for all three projects. Confirm coarse pointers do not receive hover previews.
- Confirm animation sequencing, replay behavior, and reduced-motion final states.
- Confirm the GitHub links reach the expected profile and no console errors or unexpected network requests occur.
- Run an accessibility review with no unresolved serious violation. Here, `serious` means a WCAG 2.2 A/AA failure or an issue that blocks core content, navigation, disclosure control, focus visibility, or intended assistive-technology use.
- Verify the four-file deployed artifact is at most 150 KB uncompressed, JavaScript is at most 10 KB uncompressed, and the page makes zero nonessential third-party requests. Run a mobile Lighthouse check against the release candidate with a performance score of at least 90, cumulative layout shift at most 0.1, and largest contentful paint at most 2.5 seconds; record the tool version and environment with the result.

### Pre-deployment release acceptance

- Review the actual files that will be public.
- Secret-scan the tracked source and generated public surface.
- Secret-scan all reachable local history, branches, and tags before the first public push.
- Review commit author and committer names and email addresses, then configure the repository to use the owner's approved GitHub `noreply` address before any public push.
- Confirm with `git ls-files` that `.superpowers/`, tokens, session state, and local preview artifacts were never tracked.
- Compare the Pages artifact inventory against the explicit public manifest: `index.html`, `styles.css`, `script.js`, and `assets/favicon.svg` only.
- Verify a clean checkout needs no dependency install or build step.
- Preview the exact committed revision over a local HTTP server.
- Confirm the owner controls the `June74` account, verify whether `june74.github.io` already exists or would replace an existing user site, and confirm the repository name and Pages settings. Until this passes, canonical metadata is omitted from the produced HTML rather than guessed.
- Record the candidate release commit and rollback procedure.

### Deployment authorization

Making the source repository public and enabling GitHub Pages are separate external actions requiring explicit owner authorization after pre-deployment acceptance. Local implementation approval does not authorize a public push, repository creation, visibility change, or Pages deployment.

### Live-URL acceptance

After authorized deployment, test the real URL for HTTPS, navigation, content, console errors, response behavior, artifact inventory, and unexpected network requests. Record the deployment commit and evidence in `docs/release/release-record.md`.

For a later release, rollback means creating and pushing a new revert commit that restores the last verified deployment; never reset or force-push public history. For the first release, when no prior verified deployment exists, rollback means unpublishing GitHub Pages while retaining the repository for diagnosis. Every rollback requires the same real-URL smoke checks to confirm the restored or unpublished state.

## 11. GitHub Pages preparation

The intended remote repository name is `june74.github.io`, subject to the required owner/account and existing-site preflight. The source repository uses branch `main`, while the GitHub Pages workflow publishes only the curated contents of `site/`. In the repository's Pages settings, Source is set to `GitHub Actions`.

The required recurring cost is $0 when the repository is public and GitHub Pages remains within its published service limits. A custom domain is optional and excluded from this release.

The review-only `.superpowers/` directory is ignored and must never be tracked or pushed. Because the source repository will be public, every tracked file and all reachable history—including internal design and engineering documents, tests, workflow configuration, commit identities, branches, and tags—must pass the owner's final public-information and privacy review. Only the four files in the explicit site manifest are deployed as web content.

## 12. Acceptance criteria

The implementation is accepted only when:

1. The first viewport identifies Injun Lee, his human-centered AI direction, and a route to current work.
2. The page contains exactly the approved hero, three project chapters, and footer; it contains no résumé or Auburn content.
3. All three project diagrams are understandable, responsive, keyboard accessible, touch operable, and motion-safe.
4. The page uses forest, copper, and dusty slate blue as its only chromatic accents.
5. The only live outbound destination is the approved GitHub profile; project-specific links are intentionally deferred until the owner supplies verified public URLs.
6. The site makes no unsupported completion, deployment, employment, or financial-advice claim.
7. Automated and browser acceptance checks pass with no unresolved serious accessibility, security, or responsive issue.
8. The repository is ready for the account/repository preflight and, if confirmed, can publish at `https://june74.github.io/` with no required paid service.
9. Each project statement names Injun's product-direction or behavior/routing-design contribution without presenting intended behavior as completed capability.
10. Before public deployment, Agent 5 records a five-second review in `docs/release/product-validation.md` with at least five participants. At least four must identify Injun, his personal contribution, the three project purposes, and GitHub as the place to inspect his work; reviewers score `simple`, `direct`, and `casual but presentable` at least 4/5.

## 13. Explicit non-goals

- A résumé page or résumé download.
- University, degree, or graduation content.
- Contact form, email collection, newsletter, analytics, or visitor tracking.
- Blog, CMS, authentication, database, backend, search, or project detail routes.
- Detailed progress labels or unsupported completion, deployment, or validated-capability claims.
- Invented project links or evidence.
- Paid domain, hosting plan, or third-party design asset.

## 14. Change control

Changes to the public-information boundary, page structure, project meaning, contact channels, chromatic palette, motion behavior, external services, deployment provider, or security posture reopen the earliest affected design gate. Minor copy corrections that preserve meaning and fixes that restore this approved behavior may proceed as implementation changes with recorded verification.
