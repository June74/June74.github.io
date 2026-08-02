# Predeployment evidence checklist

This checklist records only local and predeployment evidence before explicit owner deployment authorization. It is not authority to create a repository, push, enable GitHub Pages, or represent the site as publicly released.

- [ ] **Commit** — candidate commit SHA and subject:
- [ ] **Tests** — `node --check site/script.js` and `node --test tests/site.test.mjs` output:
- [ ] **Responsive widths** — evidence at the approved supported viewport range:
- [ ] **Keyboard and touch behavior** — navigation, focus, disclosures, and touch interaction evidence:
- [ ] **Reduced motion** — `prefers-reduced-motion: reduce` verification:
- [ ] **Console and network** — local preview evidence with no unexpected console errors or network requests:
- [ ] **Accessibility** — manual review and any automated scan results, including unresolved issues:
- [ ] **Lighthouse** — performance, accessibility, best-practices, and SEO scores with tool version:
- [ ] **Artifact inventory and bytes** — exact `site/` file list and total byte count:
- [ ] **Secret scan** — command, scope, date, and result:
- [ ] **Commit identity** — author and committer identity review:
- [ ] **Owner public-information review** — approval of copy, metadata, links, images, and any public contact information:
- [ ] **Account and repository preflight** — owner controls the intended account; repository name, visibility, GitHub Actions Pages source, and available free-tier limits are confirmed:
- [ ] **Explicit deployment authorization** — owner authorizes repository creation or use, remote push, public visibility, Pages enablement, and the specific release commit:

## Post-authorization live-URL acceptance

Complete this section only after explicit owner deployment authorization and the authorized deployment. These checks use the actual public URL and cannot be filled by local preview. All post-authorization live-URL items must have evidence before the release is called accepted or publicly verified.

- [ ] **Actual public URL availability** — public URL resolves to the intended site:
- [ ] **HTTPS and expected redirects** — HTTPS is valid and redirects match the approved deployment path:
- [ ] **Public interaction behavior** — navigation, each project disclosure, and the GitHub link work at the public URL:
- [ ] **Browser console errors and unexpected network requests** — browser console is clean and network activity contains no unexpected requests:
- [ ] **Final URL/artifact confirmation** — final public URL serves the approved `site/` artifact:

## $0 hosting constraints

GitHub Pages is the intended no-required-cost hosting path. Confirm the account and repository configuration can use it before deployment; provider plans, limits, and availability are external conditions and may change. A paid domain or paid service is not required.

## Rollback record

- [ ] **Known-good release commit** — commit SHA or `none` for first release:
- [ ] **Rollback decision** — revert with a new commit and push; do not reset or force-push public history:
- [ ] **First-release fallback** — if there is no known-good predecessor, unpublish Pages in repository settings and verify the public URL is unavailable:
