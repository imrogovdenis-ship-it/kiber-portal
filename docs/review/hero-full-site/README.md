# Full-site Hero and heading-only A review

Owner approved the final R5 Hero composition and requested a complete Jino preview before any production promotion. Homepage design is explicitly protected.

Live preview: https://jino-preview.kiber-portal.ru/

## Scope
- Shared `EditorialHero` for12 articles and2 collection details. Desktop/tablet image cover and dark overlay; phone <=600 natural image above dark copy panel. H1 preserved; article/collection lead shared (collection original style); blue primary, white/black model action.
- Heading-only A on these14 details plus `/articles/` and `/compilations/`: H1/H2/H3 only. No body/label/summary override.
- Homepage, robot cards and other pages: no redesign. Main/header/footer homepage DOM matches production; existing global token values unchanged; new overlay token is unused on home.

## Build and preview isolation
`npm run build:production` produces source-based, production-shaped routes without old review-link remapping. **This is a build, not publication permission.**
`node scripts/prepare-full-site-preview.mjs <fresh-output-directory>` copies that build excluding API runtime; forces noindex, disables the site analytics production flag, keeps internal links on the preview and blocks form submission with a visible notice. Never upload this preview package/guard to production. Hosting/API/robots settings and old `/preview/` comparisons were not modified.

## Evidence
- Production build and source check PASS (0 errors/warnings; existing hints). Content tests PASS. Initial visual source suite333/336; three extraction-related marker contracts reconciled, all14 focused tests then PASS. Hosted CI remains a separate gate.
- All50 public page main text compared with production, excluding approved Hero subtree.34 protected page main DOM equality;16 target pages.
- Local36 + live36 responsive page/viewports PASS (390/1280): heading sizes/scope, Hero image geometry, lead/control colors, model anchors, no horizontal overflow.
-50 deployed HTML pages verified over HTTPS with noindex headers;59 changed file hashes verified;877 unchanged assets reused.52 replaced originals saved privately,7 new files recorded; rollback prepared.
- Real lead popup opens; synthetic submit handled by preview guard with a visible non-send notice; zero first-party POST requests. No real lead sent.
- All50 production HTML hashes remain unchanged; technical-domain .htaccess unchanged.
- Additional Codex independent review could not run (401 authentication failure); no independent PASS is claimed.

## Release boundary
Full-preview acceptance, merge and production publication are pending. Do not promote automatically. Existing production budgets and legal/analytics gates remain intact.
