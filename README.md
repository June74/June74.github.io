# Injun Lee — personal work showcase

A dependency-free static site presenting Injun Lee through three human-centered AI systems.

## Preview locally

From the repository root:

```powershell
python -m http.server 8000 --directory site
```

Open `http://localhost:8000/`.

## Verify

```powershell
node --check site/script.js
node --test tests/site.test.mjs
git diff --check
```

## GitHub Pages preparation

The intended public repository is `june74.github.io`. The Pages source is GitHub Actions, and the workflow uploads only `site/`. Repository creation, remote push, public visibility, and Pages enablement require separate owner authorization.

## Hosting and privacy limits

The site requires no paid service. GitHub Pages hosts the files and may log visitor IP addresses for security. The site adds no analytics, forms, browser storage, or nonessential third-party requests. GitHub Pages does not provide repository-configurable custom response headers; production uses a restrictive meta CSP.

## Rollback

For a later release, revert the faulty release with a new commit and push it; do not reset or force-push public history. If the first public release has no known-good predecessor, unpublish Pages in repository settings and verify the public URL is unavailable.
