# KIBER PORTAL — launch-readiness report

Дата: 2026-08-24  
Статус: `static_validation_passed_needs_business_launch_inputs`

## Проверено автоматически

Источник проверки: локальная Astro build output в `app/dist`.

```text
python3 scripts/validate_design_tokens.py --root . --json
→ errors=0, warnings=0

python3 scripts/validate_public_pages.py --root . --json
→ htmlPages=46, errors=0, warnings=0

npm --prefix app run build
→ 46 page(s) built

python3 scripts/validate_robot_seo_links.py --root . --json
→ robotPages=24, checkedPages=24, errors=0, warnings=0

python3 scripts/validate_collection_pages.py --root . --json
→ collectionPages=2, checkedPages=2, errors=0, warnings=0

python3 scripts/validate_content_index_pages.py --root . --json
→ contentIndexPages=3, checkedPages=3, errors=0, warnings=0

python3 scripts/validate_content_detail_pages.py --root . --json
→ detailPages=7, checkedPages=7, errors=0, warnings=0

python3 scripts/validate_whole_site_static.py --root . --json
→ htmlPages=46, publicPages=38, previewPages=8, checkedPages=46, errors=0, warnings=0
```

Machine-readable artifacts:

```text
data/seo/robot-schema-internal-linking-check.json
data/seo/collection-template-check.json
data/seo/content-index-template-check.json
data/seo/content-detail-template-check.json
data/seo/whole-site-static-check.json
data/seo/route-inventory.json
docs/route-inventory.md
docs/production-launch-checklist.md
data/seo/redirects.scaffold.json
data/seo/rendered-image-alt-audit.json
docs/rendered-image-alt-audit.md
```

## Что уже готово технически

- Live-verified design tokens and visual language are used in Astro templates.
- Home, robot cards, robot detail pages, collection pages, content index pages and article detail pages have live-style baselines.
- 24 robot pages have `Service`, `BreadcrumbList` and `FAQPage` JSON-LD where FAQ exists.
- Collection/content pages have dedicated schema and validation gates.
- Static validation covers all 46 generated pages, including 38 public indexable pages and 8 preview/noindex pages.
- Public local images, local links, canonical URLs, robots meta, sitemap inclusion and fragment anchors pass automated checks.
- Route inventory generated for 46 routes: 38 public indexable and 8 preview/noindex.
- Contacts page has a live-style safe placeholder template with explicit business-fact blockers.
- Production launch checklist and redirect scaffold are prepared but not activated.
- Rendered image alt audit covers 38 public pages and 435 meaningful images with errors=0, warnings=0.

## Production blockers / inputs needed before launch

These are not code blockers for the static build, but they should be resolved before replacing production:

1. **Final business/contact details**
   - Contacts page currently has a safe placeholder.
   - Need approved legal/company details, address if public, email, messenger links and any required footer/legal copy.

2. **Lead capture and messenger behavior**
   - CTA structure is present, but production endpoints/messenger routing must be approved.
   - Need confirmed destination for forms or messenger modal behavior.

3. **Analytics and conversion tracking**
   - Need approved analytics IDs/events before production wiring.
   - Do not fabricate IDs or silently connect third-party analytics.

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

1. Generate a route inventory report from `app/dist` with page type, schema types, image/link counts and public/noindex status.
2. Improve Contacts page visual parity while keeping factual placeholders clearly marked.
3. Add a reusable launch checklist in `docs/production-launch-checklist.md` without touching production infrastructure.
4. Prepare redirect scaffolding/data model, but do not activate production redirects until old URL mapping is confirmed.
