# GitHub Pages deployment record

This record describes the owner-authorized public release completed on 2026-08-02. It supersedes the earlier local-only disposition for the deployed revision; it does not erase the remaining product-validation notes in `product-validation.md`.

## Release identity

- Public URL: `https://june74.github.io/`
- Repository: `June74/June74.github.io`
- Source pull request: `https://github.com/June74/June74.github.io/pull/2`
- Deployed merge commit: `02ef82b9343222ceea67e05582362726b041a1ee`
- GitHub Pages workflow: `https://github.com/June74/June74.github.io/actions/runs/30737252195`
- Release authorization: the owner explicitly requested “push and deploy” on 2026-08-02.

## Deployment evidence

- GitHub Actions completed the production test job and the Pages deployment job successfully.
- The workflow ran `node --check site/script.js` and `node --test tests/site.test.mjs` before uploading only `site/`.
- The public HTTPS URL returned `200 OK`, `Content-Type: text/html; charset=utf-8`, and `Strict-Transport-Security: max-age=31556952`.
- GitHub Pages served the deployed document over HTTPS without a redirect or browser console warning/error during acceptance.

## Public-browser acceptance

- Hero: the live page displays `Injun Lee.` followed by `I build AI systems` and `around people.` with the approved compact signature treatment.
- Synapse: the live router has the light surface, forest outline, and 1.4 px stroke; its selected route drew from a 180 px dash offset to 0 px and revealed the answer.
- June: a fresh pointer activation opened and pinned the project with all four task markers empty. A separate keyboard replay started at zero, progressed to four completed markers, closed, and reopened from zero.
- Responsive behavior: at 390 and 1440 CSS-pixel viewports, client width equaled scroll width, so no horizontal overflow was present.
- Outbound and privacy boundary: the release remains a static site with no form, analytics, tracker, backend, remote font, or new public contact detail.

## Hosting and rollback

The required hosting path remains GitHub Pages for the public repository and introduces no application dependency or runtime service. GitHub controls the edge response headers beyond the static artifact.

Rollback is a reviewed revert of merge commit `02ef82b` on `main`; the same Pages workflow must then pass and the resulting public URL must be smoke-tested again. No rollback was required for this release.

## Remaining non-blocking follow-up

The five-participant product-validation exercise recorded in `product-validation.md` has not been completed. The owner authorized this release with that evidence still pending, so it remains an iteration input rather than a claim that external participant validation occurred.
