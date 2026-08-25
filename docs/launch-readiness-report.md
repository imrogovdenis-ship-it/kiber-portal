# KIBER PORTAL — launch-readiness report

Дата: 2026-08-25
Статус: `legal_pages_added_static_validation_passed_needs_business_launch_inputs`

## Проверено автоматически

Источник проверки: локальная Astro build output в `app/dist`.

```text
python3 scripts/validate_design_tokens.py --root . --json
→ errors=0, warnings=0

python3 scripts/validate_public_pages.py --root . --json
→ htmlPages=51, errors=0, warnings=0

npm --prefix app run build
→ 51 page(s) built

python3 scripts/validate_robot_seo_links.py --root . --json
→ robotPages=24, checkedPages=24, errors=0, warnings=0

python3 scripts/validate_collection_pages.py --root . --json
→ collectionPages=2, checkedPages=2, errors=0, warnings=0

python3 scripts/validate_content_index_pages.py --root . --json
→ contentIndexPages=3, checkedPages=3, errors=0, warnings=0

python3 scripts/validate_content_detail_pages.py --root . --json
→ detailPages=7, checkedPages=7, errors=0, warnings=0

python3 scripts/validate_whole_site_static.py --root . --json
→ htmlPages=51, publicPages=42, previewPages=9, checkedPages=51, errors=0, warnings=0
```

Machine-readable artifacts:

```text
data/seo/robot-schema-internal-linking-check.json
data/seo/collection-template-check.json
data/seo/content-index-template-check.json
data/seo/content-detail-template-check.json
data/seo/whole-site-static-check.json
data/seo/legal-pages-static-check.json
data/seo/route-inventory.json
docs/route-inventory.md
docs/production-launch-checklist.md
data/seo/redirects.scaffold.json
data/seo/rendered-image-alt-audit.json
docs/rendered-image-alt-audit.md
data/seo/rendered-heading-audit.json
docs/rendered-heading-audit.md
data/seo/launch-qa-summary.json
docs/launch-qa-summary.md
docs/business-inputs-request.md
docs/production-deployment-dry-run.md
data/seo/production-readiness-matrix.json
docs/production-readiness-matrix.md
data/seo/rendered-schema-audit.json
docs/rendered-schema-audit.md
data/seo/rendered-social-metadata-audit.json
docs/rendered-social-metadata-audit.md
data/seo/rendered-cta-flow-audit.json
docs/rendered-cta-flow-audit.md
docs/lead-flow-integration-plan.md
```

## Что уже готово технически

- Live-verified design tokens and visual language are used in Astro templates.
- Home, including the lower FAQ/final conversion block, robot cards, robot detail pages, collection pages, content index pages and article detail pages have live-style baselines.
- 24 robot pages have `Service`, `BreadcrumbList` and `FAQPage` JSON-LD where FAQ exists.
- Collection/content pages have dedicated schema and validation gates.
- Static validation covers all 51 generated HTML pages, including 42 public indexable pages and 9 preview/noindex pages.
- Public local images, local links, canonical URLs, robots meta, sitemap inclusion and fragment anchors pass automated checks.
- Legal pages `/privacy-policy`, `/consent`, `/cookie-policy` and `/terms` are generated from existing `content-source/pages/*.md` legal documents, with cleaned navigation/footer extraction noise, WebPage/Breadcrumb JSON-LD and internal links from footer/legal sidebar.
- Route inventory generated for 51 routes: 42 public indexable and 9 preview/noindex, including the static 404 page and 4 legal routes.
- Contacts page has a live-style quick-contact hero, legal fact cards and explicit business-fact/integration blockers.
- Production launch checklist and redirect scaffold are prepared but not activated.
- Rendered image alt audit covers 42 public pages and 440 meaningful images with errors=0, warnings=0.
- Rendered heading hierarchy audit covers 42 public pages and 779 headings with errors=0, warnings=0.
- Rendered schema audit covers 42 public pages with errors=0, warnings=0 and validates JSON-LD type coverage, including homepage `FAQPage` and 4 legal `WebPage` routes.
- Rendered social metadata audit covers 42 public pages with errors=0, warnings=0 and validates OG/Twitter coverage.
- Rendered CTA/lead-flow audit covers 42 public pages and 726 CTA links with errors=0, warnings=0.
- Header/footer/contact phone links use `tel:+79774790749`; contact popup includes messenger buttons and a deferred lead form with name, phone and optional email.
- Lead-flow/Yandex/amoCRM integration plan is prepared in `docs/lead-flow-integration-plan.md`; real IDs/accesses are deferred.
- Unified launch QA bundle runs 14 gates and currently passes 14/14 with failed=0.
- Business input request pack is prepared in `docs/business-inputs-request.md`.
- Production deployment dry-run plan is prepared in `docs/production-deployment-dry-run.md`; it does not touch infrastructure.
- Production readiness decision matrix is prepared in `data/seo/production-readiness-matrix.json` and `docs/production-readiness-matrix.md`.

## Production blockers / inputs needed before launch

These are not code blockers for the static build, but they should be resolved before replacing production:

1. **Telegram/form delivery destinations**
   - Max/WhatsApp links are present where available.
   - Telegram public link and target Telegram chat/thread for form delivery are still needed.
   - Form UI is rendered, but submit is disabled until delivery endpoint is approved.

2. **Lead capture and CRM behavior**
   - CTA structure is present and validated.
   - Telegram form delivery and amoCRM duplicate are documented in `docs/lead-flow-integration-plan.md`, but not connected yet.

3. **Analytics and conversion tracking**
   - Yandex Metrica/Webmaster stack is planned.
   - Need approved counter ID, webmaster verification value, goal names/IDs and consent/cookie decision before production wiring.

4. **Redirect policy**
   - Current canonical routes are preserved for migrated pages.
   - Before production cutover, run a final live URL inventory and add redirects only for confirmed old/legacy URLs.

5. **SEO content expansion inputs**
   - For launch-scale optimization, request Alex's prepared SEO materials: keywords, synonyms, long-tail phrases, unpublished articles/collections and alt texts.
   - This is needed before a final large-scale SEO enrichment pass.

6. **Business-approved pricing and claims**
   - Do not publish unverified prices, legal claims, availability claims or customer/event claims.
   - Any uncertain claim should remain source-backed or marked for review.

## Recommended next autonomous code step

If no new business inputs are available, continue with safe technical work:

1. Continue representative mobile/detail-page visual QA and fix only visible template issues.
2. Review below-fold lazy image behaviour separately from real missing media assets; do not copy/download replacement assets until DOM/image checks confirm they are missing.
3. Add only business-approved lead/analytics IDs when Alexander provides them; do not touch production infrastructure without approval.
