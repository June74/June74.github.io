# Personal work showcase

A dependency-free, multi-page static portfolio presenting Injun Lee's current direction, selected work, certificate study, and supporting personal context. It is intentionally a local implementation and preview artifact.

## Routes

| Page | Local route |
| --- | --- |
| Home | `/` |
| Projects | `/projects/` |
| Synapse case study | `/projects/synapse/` |
| Vision case study | `/projects/vision/` |
| MM case study | `/projects/mm/` |
| Certificates | `/certificates/` |
| AI routing study map | `/certificates/ai-routing/` |
| Data engineering study map | `/certificates/data-engineering/` |
| Cloud foundations study map | `/certificates/cloud-foundations/` |
| About Me | `/about/` |

## Preview locally

Run the preview server from the implementation worktree:

```powershell
Set-Location C:\Users\2006i\projects\resume_page\.worktrees\portfolio-implementation
python -m http.server 8000 --directory site
```

Open `http://localhost:8000/` and use the route paths above. This server is local only; it is not a deployment.

## Verify

From the implementation worktree, run:

```powershell
node --check site/script.js
node --test tests/site.test.mjs
git diff --check
```

See `docs/release/local-acceptance.md` for the evidence record, responsive route matrix, and remaining release-boundary checks.

## Content and authorization boundaries

The warm, editorial visual direction uses clearly labeled placeholders wherever owner-verified public information is absent. Placeholders are not claims of completed credentials, project outcomes, dates, affiliations, or capabilities.

Public deployment is not authorized. Public contact details are not authorized. Manager and Importer functionality is not authorized. Do not add a hosting configuration, publish a repository, push for release, enable a hosting provider, add contact mechanisms, or introduce Manager or Importer flows without separate owner approval and a reopened design, privacy, and security review.

## $0 static-hosting boundary

The intended release model, if later authorized, is a $0 static host serving only the contents of `site/`. This repository has no backend, forms, analytics, authentication, database, uploads, browser storage, package manager, or runtime dependency. Any paid service is optional and out of scope; adding an external service, a data-collection path, or server-side behavior reopens the technical, security, and release decisions.
