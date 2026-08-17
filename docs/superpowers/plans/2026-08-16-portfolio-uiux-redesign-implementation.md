# Portfolio UI/UX redesign Implementation Plan

> For agentic workers: use subagent-driven development or executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Replace the earlier one-page portfolio implementation with the approved warm, editorial, multi-page portfolio UI/UX for Home, Projects, case studies, Certificates/study maps, and About Me.

**Architecture:** Keep the public experience dependency-free and static. Each public route is a semantic HTML document that shares one local stylesheet and one progressive-enhancement script; JavaScript improves selected-project states and playful motion but is not required for navigation or reading. Content values that are not owner-verified are rendered as explicit visible placeholders rather than guessed links or credentials.

**Tech Stack:** HTML5, CSS, vanilla JavaScript, inline static SVG/CSS artwork, Node.js built-in node:test, GitHub Pages-compatible static files.

---

## Scope and working boundary

- Work only in C:/Users/2006i/projects/resume_page/.worktrees/portfolio-implementation on its existing feature branch.
- The main branch contains the approved design specification at docs/superpowers/specs/2026-08-16-portfolio-uiux-redesign-design.md; merge commit 070330c into the implementation branch before the first code change so the branch carries the governing design record.
- The public pages are site/index.html, site/projects/index.html, site/projects/synapse/index.html, site/projects/june/index.html, site/projects/mm/index.html, site/certificates/index.html, site/certificates/ai-routing/index.html, site/certificates/data-engineering/index.html, site/certificates/cloud-foundations/index.html, and site/about/index.html.
- Shared files are site/styles.css, site/script.js, site/assets/favicon.svg, and tests/site.test.mjs.
- The public build contains no Manager, GitHub Importer, tokens, private data, contact form, analytics, remote assets, remote fonts, or unverified destinations.
- No public deployment, repository visibility change, push, or Pages enablement is authorized by this plan.

## File and ownership map

| File group | Responsibility | Implementer |
| --- | --- | --- |
| site/index.html, site/projects/**, site/certificates/**, site/about/index.html | Semantic routes, navigation, page copy, diagrams, visible placeholders | Developer A |
| site/styles.css, site/assets/favicon.svg | Tokens, editorial layout, two-column grids, responsive states, motion, focus | Developer B |
| site/script.js, tests/site.test.mjs | Progressive enhancement, route/content/security contracts, interaction assertions | Developer C |
| README.md, docs/release/local-acceptance.md | Local preview and evidence handoff | Primary agent with Product/Security review |

No two implementation agents edit the same file group at the same time. Each task is reviewed for specification compliance first and code quality second before the next task starts.

## Task 1: Establish the branch and the route/content contract

**Files:**

- Modify: implementation branch history by merging 070330c
- Create or modify: tests/site.test.mjs

- [ ] Step 1: Merge the governing design commit into the implementation worktree

Run from C:/Users/2006i/projects/resume_page/.worktrees/portfolio-implementation:

    git -c safe.directory=C:/Users/2006i/projects/resume_page/.worktrees/portfolio-implementation merge --no-edit 070330c

Expected: the worktree contains the approved redesign specification and no production file is changed by the merge.

- [ ] Step 2: Replace the earlier single-page test assumptions with failing route/content tests

The test file must discover the ten public HTML routes listed in the scope, assert that each has lang="en", a local stylesheet, the shared navigation labels Projects, Certificates, and About Me, and no prototype page-switcher bar. It must assert that Home contains Hello! My name is, Injun Lee., Featured Projects, Certificates, and Simply a work in progress; Projects contains the exact two-column contract marker class; About contains Steps I take to create my projects; and every certificate route contains a visible placeholder label.

The tests must also assert the canonical purpose statements for Synapse, June, and MM, six visible technology-tag slots per project card, no +N counter, and no Contact or header Resume navigation item.

- [ ] Step 3: Run the new tests and verify the expected RED state

Run:

    node --test tests/site.test.mjs

Expected: failures identify missing routes and the new content contract; do not weaken the assertions to accommodate the old one-page implementation.

- [ ] Step 4: Commit only the contract change

    git add tests/site.test.mjs
    git commit -m "test: define multi-page portfolio route contract"

## Task 2: Build the semantic pages and explicit placeholder content

**Files:**

- Modify: site/index.html
- Create: site/projects/index.html
- Create: site/projects/synapse/index.html
- Create: site/projects/june/index.html
- Create: site/projects/mm/index.html
- Create: site/certificates/index.html
- Create: site/certificates/ai-routing/index.html
- Create: site/certificates/data-engineering/index.html
- Create: site/certificates/cloud-foundations/index.html
- Create: site/about/index.html

- [ ] Step 1: Write failing semantic route fixtures before page implementation

Extend tests/site.test.mjs with route-specific assertions for:

- Home hero, juggling illustration labels, featured project cards, featured certificate cards, and About teaser.
- Projects index: exactly two project cards per desktop row through a .project-grid hook, six visible tool tags per card, and links to all three case studies.
- Case studies: purpose, status, contribution, tools used, skills demonstrated, diagram, and a case-study heading for the matching project.
- Certificates: exactly three cards, image placeholders, short descriptions, and reset-date wording.
- Certificate study maps: topic groups, practical skills, and a clear placeholder state for unverified credential facts.
- About: Personal compass, four destination placeholders (Resume, GitHub, LinkedIn, Gmail), three values, and all seven workflow step titles.

- [ ] Step 2: Run the route fixtures and confirm RED

Run node --test tests/site.test.mjs. Expected: route files and required semantic hooks are absent or incomplete.

- [ ] Step 3: Implement shared semantic header/footer and Home

Use the exact approved copy from the design specification. Home must have a single logical h1, skip link, semantic navigation, an original local SVG or CSS stick figure juggling three objects, and noninteractive placeholders until social/resume destinations are owner-verified. Do not add empty links or guessed URLs.

The featured project cards must show Synapse, June, and MM with the canonical purpose statements and six visible tool slots. Use explicit labels such as Tool placeholder 1 where a current repository check has not yet verified a tool. The featured certificate cards must show image/title/issuer/reset-date placeholders and link to their study maps.

- [ ] Step 4: Implement the Projects index and three case-study routes

Use a two-column .project-grid on wide screens and one column on narrow screens. Each card is a single accessible link, not a nested button/link combination. Case-study pages use the shared header and answer purpose, contribution, status, tools, skills, diagram, and next-step questions in that order. Missing public repositories or demos are omitted rather than represented by dead links.

- [ ] Step 5: Implement Certificates and study-map routes

The index has three cards with one local neutral Certificate image placeholder each, a short description, and Retest date placeholder or No retest required text. Each study map explains topics studied and practical skills while keeping credential title, issuer, date, and ID visibly marked as placeholders.

- [ ] Step 6: Implement About Me and workflow

Use the approved Simply a work in progress / A Little About Me treatment, a Personal compass panel, uniform destination placeholders, the three values, and the seven exact workflow step titles from the specification. Keep the workflow readable without animation.

- [ ] Step 7: Run the route/content tests and commit

Run node --test tests/site.test.mjs. Expected: all semantic route/content assertions pass once shared styling hooks exist or the tests are scoped to HTML structure. Then run git diff --check and commit:

    git add site/index.html site/projects site/certificates site/about
    git commit -m "feat: add complete portfolio page structure"

## Task 3: Implement the distinctive visual system and responsive UI

**Files:**

- Modify: site/styles.css
- Create: site/assets/favicon.svg

- [ ] Step 1: Add failing visual-contract tests

Assert in tests/site.test.mjs that the stylesheet defines paper #F3EFE6, paper-2 #E8E4D8, white #FBFAF6, ink #1E2924, muted #66716A, forest #356351, copper #B86F4B, blue #718999, sage #DFE6DC, and line #C9C5BA; defines :focus-visible, a reduced-motion media query, a desktop .project-grid two-column rule, and mobile one-column rules. Assert the favicon is local static SVG with no script, external URL, foreignObject, or event attribute.

- [ ] Step 2: Run the visual tests and verify RED

Run node --test tests/site.test.mjs. Expected: the new token and asset assertions fail before the stylesheet or asset exists.

- [ ] Step 3: Implement the shared editorial tokens and components

Build the warm paper canvas, deep ink text, Georgia display face, Segoe body face, copper action accents, hairline rules, moderate card radius, visible keyboard focus, skip link, shared header/footer, project/certificate cards, diagram panels, placeholder treatment, and two-column case-study layout. The CSS must not import a remote font or use an unapproved chromatic token.

- [ ] Step 4: Implement responsive states

Use two columns for project and certificate indexes at desktop widths, one column below the mobile breakpoint, and no horizontal overflow at 320 px. Keep all six tags visible; allow them to wrap rather than truncate or collapse into +N. Ensure the hero illustration remains secondary to the introduction.

- [ ] Step 5: Implement the restrained signature motion

Animate the original juggling figure with a small bounce/tilt rhythm and use finite, purposeful reveals for diagram elements. Under prefers-reduced-motion: reduce, stop continuous motion and show final informative states immediately. Do not use WebGL, immersive movement, parallax tunnels, or torii gates.

- [ ] Step 6: Create the local favicon and run tests

Create a small static SVG using only the approved palette. Run node --test tests/site.test.mjs, git diff --check, and an artifact-size check; all must pass before commit.

- [ ] Step 7: Commit the visual slice

    git add site/styles.css site/assets/favicon.svg tests/site.test.mjs
    git commit -m "feat: apply warm editorial portfolio system"

## Task 4: Add progressive enhancement and release contracts

**Files:**

- Modify: site/script.js
- Modify: tests/site.test.mjs
- Modify only for evidence-backed defects: route HTML, CSS, or assets

- [ ] Step 1: Write failing interaction and safety tests

Assert that the script uses no innerHTML, eval, fetch, storage, or dynamic script construction; applies selected state only through classes and attributes; supports keyboard and pointer selection; and honors prefers-reduced-motion. Assert every route has the same navigation labels, no unknown external links, no empty href, no draft marker, no personal email or phone, and no manager/importer control.

- [ ] Step 2: Run tests and verify RED

Run node --test tests/site.test.mjs. Expected: the interaction/security assertions fail until the shared script and final route inventory are complete.

- [ ] Step 3: Implement progressive enhancement

The script may enhance project selection, active navigation, finite diagram replay, and hero motion. It must not be required for route navigation or certificate study-map reading. Use semantic buttons for local state and links for navigation. Respect coarse pointers and reduced motion.

- [ ] Step 4: Add artifact and static-security checks

Assert a curated static manifest that contains only the intended public route files, styles.css, script.js, favicon, and approved local images; enforce restrictive CSP/referrer metadata on every route; reject remote assets, unapproved outbound URLs, inline handlers, forms, trackers, and oversized bundles.

- [ ] Step 5: Run the full static suite

Run:

    node --check site/script.js
    node --test tests/site.test.mjs
    git diff --check

Expected: syntax passes, all tests pass, and the diff check is silent.

- [ ] Step 6: Commit the interaction and contract slice

    git add site/script.js tests/site.test.mjs site
    git commit -m "test: enforce portfolio interaction and release contracts"

## Task 5: Integrated browser acceptance and handoff

**Files:**

- Create: docs/release/local-acceptance.md
- Modify only for verified defects: site/** or tests/site.test.mjs

- [ ] Step 1: Serve the exact worktree artifact

Run from the implementation worktree:

    python -m http.server 52123 --directory site

Open the local URL in the in-app browser and verify the actual visitor path, not only source text.

- [ ] Step 2: Test every public route at representative widths

Check Home, Projects, all three project case studies, Certificates, all three study maps, and About Me at approximately 320, 768, 1024, and 1440 px. Verify no horizontal overflow, clipped tags, overlapping controls, unreadable diagrams, missing local assets, or console errors.

- [ ] Step 3: Test interaction and accessibility states

Verify keyboard navigation, visible focus, skip link, selected project state, mobile one-column behavior, reduced-motion final state, no-JavaScript navigation/readability, link labels, placeholder clarity, and screen-reader names for the juggling objects and diagrams.

- [ ] Step 4: Record evidence

Write docs/release/local-acceptance.md with the tested commit, browser/version, route and viewport results, reduced-motion result, no-JavaScript result, console/network result, artifact inventory/bytes, known limitations, and the explicit line Public deployment not authorized.

- [ ] Step 5: Run final reviews

Product review checks that the owner and work stay central, the tone remains warm/casual-presentable, and no resume/Auburn drift appears. Security review checks placeholders, public links, local assets, CSP, artifact inventory, and absence of Manager/Importer controls. Developer cross-review checks responsive behavior and maintainability.

- [ ] Step 6: Commit the acceptance record and stop before deployment

    git add docs/release/local-acceptance.md
    git commit -m "docs: record portfolio UIUX acceptance"

Do not push, create a repository, change visibility, enable Pages, or publish contact/certificate data.

## Final plan self-review

- Spec coverage: Home hero and juggling signature are covered in Tasks 2 and 3; two-column Projects and Certificates are covered in Tasks 2 and 3; case studies and study maps are covered in Task 2; About workflow is covered in Task 2; placeholders, security, reduced motion, responsive behavior, and public/private boundary are covered in Tasks 2 through 5; browser evidence is covered in Task 5.
- Placeholder scan: No vague implementation placeholders are used in the plan. All temporary public content is specified as visible, intentional placeholder text and tied to an owner-review action.
- Consistency: All routes use shared styles.css and script.js; navigation labels are consistent; project and certificate grids use two columns at desktop and one at mobile; the private Manager/Importer is excluded from every public task.
- Scope: The work is one cohesive public static portfolio subsystem. The GitHub importer remains a separately gated subsystem and is intentionally not included.

