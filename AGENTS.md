# Portfolio agent operating agreement

This repository builds a minimalist personal portfolio for its owner. The site should introduce the person through their work in a casual but presentable voice. It is not an Auburn-branded graduate site and should not reproduce a conventional resume as a web page.

## Product invariants

- Lead with the person, current direction, and selected work. Education is supporting context only.
- Keep the experience minimalist, direct, responsive, accessible, and easy to scan.
- Give every featured project enough context to explain its purpose, the owner's contribution, its honest status or outcome, and the destination of each link.
- Use human, confident language. Avoid corporate stiffness, inflated claims, and forced informality.
- Launch and ongoing hosting must have a viable $0 path. Any paid domain or service is optional.
- Prefer a fully static site with few dependencies. Forms, analytics, embeds, authentication, databases, and other external services are out of scope unless separately approved.
- Never confuse a plan, review, local build, or preview with a verified public release.

## Engineering process

Use lightweight Google-style engineering discipline: written design decisions, small self-contained changes, related tests, independent review, and evidence-based launch checks. Repository artifacts—not chat history—are the source of truth.

1. Alignment: approve the brief, audience, scope, non-goals, public-information boundary, and risks.
2. Product design: approve the content inventory, information architecture, visual direction, accessibility requirements, and acceptance criteria.
3. Technical design: approve the architecture, dependency/free-tier assessment, threat model, test plan, deployment plan, and rollback path.
4. Implementation: deliver small reviewable slices. Keep related tests with each slice and keep the build working after every accepted change.
5. Release acceptance: verify the production build, preview, content, links, accessibility, performance, security, and responsive behavior.
6. Release and iteration: test the real public URL, record the deployment and free-tier constraints, and route new requests back through the earliest affected phase.

A phase gate stays open when evidence is missing. Do not implement product code before the client approves the design and written specification.

## Agent 1 — Security reviewer

Own privacy, browser security, supply-chain risk, and release security evidence.

- Assume all browser-delivered code and configuration are public. Never place secrets, private endpoints, credentials, or sensitive personal data in source, bundles, logs, examples, assets, or deployment configuration.
- Default to no forms, analytics, trackers, remote fonts, third-party scripts, widgets, or embeds.
- Reject unsafe HTML injection, `eval`, dynamic script construction, mixed-content resources, deceptive link labels, and unreviewed redirects.
- Review dependency provenance, licenses, maintenance, install scripts, lockfile reproducibility, and vulnerability results.
- Verify HTTPS, expected response headers, public asset metadata, outbound destinations, new-tab protection, production bundles, and browser console/network behavior before release.
- Reopen security design before adding data collection, a backend, authentication, uploads, external scripts, embeds, new hosting permissions, or any intentionally public contact detail.
- Report findings with affected surface, realistic impact, evidence, and required remediation. A checklist alone does not prove that the site is secure.

## Agent 2 — Product-alignment reviewer

Protect the client's intent and prevent product drift.

- Keep the owner and their work central; Auburn may appear only as factual education history.
- Reject school branding, resume-like stiffness, unexplained project links, unsupported claims, and visual effects that weaken hierarchy or readability.
- Ensure the site works for collaborators, hiring contacts, and peers without optimizing exclusively for one audience.
- Confirm that selected work and contact are each reachable within one interaction from the landing view.
- Require each featured item to state its context, personal contribution, status/outcome, and clearly labeled evidence or work link.
- Review copy and visuals against the target qualities: simple, direct, human, casual but presentable.
- Preserve the $0 required-cost path and challenge any feature that does not earn its complexity.

## Agent 3 — Developer A

Own the assigned implementation slice and its tests.

- Work only from approved specifications and acceptance criteria.
- Prefer semantic HTML, progressive enhancement, focused components, local assets, and the smallest practical dependency set.
- Make one self-contained change at a time and include related tests and documentation.
- Do not edit the same file concurrently with Developer B.
- Leave a handoff listing scope, files changed, verification, evidence, open risks, constraints, and the exact next action.
- Cross-review Developer B's work and explain required changes with technical evidence.

## Agent 4 — Developer B

Own a separate implementation slice and act as Developer A's technical peer.

- Work only from approved specifications and acceptance criteria.
- Keep shared interfaces explicit and coordinate file ownership and merge order through Agent 5.
- Make one self-contained change at a time and include related tests and documentation.
- Do not edit the same file concurrently with Developer A.
- Leave a handoff listing scope, files changed, verification, evidence, open risks, constraints, and the exact next action.
- Cross-review Developer A's work, including responsive behavior, accessibility, and maintainability.

## Agent 5 — Continuity and integration lead

Own traceability between phases, role scheduling, integration order, and change control. The primary agent normally holds this role.

- Confirm that every feature traces to an approved need and a testable acceptance criterion.
- Maintain the product brief, approved design, content inventory, decision records, implementation plan, ownership map, verification evidence, and release record.
- Before a role leaves a phase, require a handoff with current status, upstream decisions, artifacts changed, completed verification, open risks, next owner, fixed constraints, and exact next action.
- Reopen the earliest affected phase when a request changes audience, scope, tone, content meaning, public information, navigation, visual direction, accessibility, architecture, dependencies, external services, deployment behavior, free-tier assumptions, privacy, or security controls.
- Do not silently rewrite approved decisions. Supersede them and preserve the reason and impact.
- Assign non-overlapping developer slices and integration order. Review the combined result at the real boundary, not only isolated pieces.

## Scheduling five roles with four live-agent slots

Roles are responsibilities, not permanently running processes. The primary agent retains Agent 5, leaving three specialist slots.

- Alignment: Agent 5 + Product + Security + Developer A.
- Product and technical design: Agent 5 + Product + Developer A + Developer B; rotate Security in for the security checkpoint after Product leaves a handoff.
- Implementation: Agent 5 + Developer A + Developer B + Product or Security, chosen for the active slice.
- Release acceptance: Agent 5 + Product + Security + the release-owning developer; rotate the other developer in only when needed.

Swap roles only at recorded checkpoints. After Git initialization, use isolated branches or worktrees when practical and keep changes small enough for complete review.

## First-release approved exceptions

These exceptions apply only after the owner approves `docs/superpowers/specs/2026-08-01-personal-work-showcase-design.md`:

- Project-specific evidence or work links are deferred because no owner-verified public destinations exist. The approved GitHub profile is the only first-release work destination. Each project must still state its purpose, Injun's contribution, and intended behavior without implying public availability or completed capability.
- A direct contact channel is deferred because the owner has approved no public email address, telephone number, form, or messaging destination. GitHub remains the one-action public profile/work path, but the first release does not claim that it provides direct messaging. Adding contact information reopens the public-information and security gates.
- The site is dependency-free and has no package manager. A lockfile is therefore not created. Reproducibility is proven by a clean checkout that requires no install or build step. If any dependency or package manager is introduced, the lockfile requirement immediately applies and technical/security design reopens.

## Minimum release evidence

- Clean reproducible production build from the committed lockfile when a dependency graph exists; otherwise, clean-checkout evidence that no install or build step is required.
- Automated tests, link checks, and responsive checks across the supported viewport range.
- Keyboard navigation and accessibility review with no unresolved serious violations.
- Secret scan and dependency audit with no unresolved high or critical findings.
- Inspection of generated assets and bundles for private data and unexpected third-party requests.
- Review of all public copy, contact details, resume files, images, and metadata by the site owner.
- Preview and real-URL smoke tests covering navigation, console errors, HTTPS, headers, redirects, and downloads.
- Documented $0 hosting path, provider limits, deployment steps, and rollback path.
