# Visual Parity Report — КИБЕР ПОРТАЛ

Дата обновления: 2026-08-24  
Источник: `https://www.kiber-portal.ru/`  
Astro local preview: `http://127.0.0.1:4321/`  
Статус: `deployment_dry_run_plan_ready_needs_business_launch_inputs`

## Цель прохода

После замены GitHub Design System на live-verified данные проверить, что Astro-preview перестал уходить в generic/SaaS-style и начал повторять базовый visual language живого сайта.

Проверялись две эталонные страницы:

- `/` — home: header, photo hero, Gosha bubble, подборки, catalog grid;
- `/arenda-unitree-g1` — robot page: header, product hero, CTA buttons, first content blocks.

## Evidence screenshots

Live site:

```text
data/design/live-screenshots/home-desktop-1280.png
data/design/live-screenshots/home-mobile-390.png
data/design/live-screenshots/unitree-g1-desktop-1280.png
data/design/live-screenshots/unitree-g1-mobile-390.png
```

Astro preview after correction:

```text
data/design/parity-screenshots/astro-home-desktop-1280.png
data/design/parity-screenshots/astro-home-mobile-390.png
data/design/parity-screenshots/astro-unitree-g1-desktop-1280.png
data/design/parity-screenshots/astro-unitree-g1-mobile-390.png
data/design/parity-screenshots/astro-unitree-g1-blocks-desktop-1280.png
data/design/parity-screenshots/astro-unitree-g1-blocks-mobile-390.png
data/design/parity-screenshots/astro-unitree-g1-faq-footer-full-desktop-1280.png
data/design/parity-screenshots/astro-unitree-g1-faq-footer-full-mobile-390.png
data/design/parity-screenshots/robot-propagation/*.png
data/design/robot-template-propagation-check.json
data/seo/robot-schema-internal-linking-check.json
data/design/parity-screenshots/collection-template/*.png
data/seo/collection-template-check.json
data/design/parity-screenshots/content-index/*.png
data/seo/content-index-template-check.json
data/design/parity-screenshots/content-detail/*.png
data/seo/content-detail-template-check.json
data/seo/whole-site-static-check.json
docs/launch-readiness-report.md
data/seo/route-inventory.json
docs/route-inventory.md
docs/production-launch-checklist.md
data/seo/redirects.scaffold.json
data/design/parity-screenshots/launch-prep/*.png
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
```

## Applied changes in this pass

### Header

Changed Astro header toward live production baseline:

- menu now: `Каталог`, `Подборки`, `Блог`, `Новости`, `Контакты`;
- removed extra `Заполнить форму` header CTA from desktop baseline;
- kept live-style phone and single `Написать нам` blue CTA;
- mobile header now collapses to logo + blue burger icon, matching live first viewport.

### Home hero

Astro home hero now follows live style:

- inset rounded image block on `#F4F8FF` canvas;
- graphite photo scrim, not abstract SaaS gradient;
- desktop H1 `64px / 64px / 700`, `letter-spacing: 1px`;
- primary CTA `#0088FF`, secondary white pill with blue text;
- mobile hero uses live-like image crop, rounded corners, logo/burger header.

### Catalog cards

Catalog cards moved closer to live `t786` product grid:

- transparent wrapper;
- no border/shadow/rounded card container;
- square robot image on white;
- title `22px Gillroy 700 #36323E`;
- price `14px Montserrat 600 #36323E`;
- description `16px Gillroy 500 #797A91`.

### Robot page hero

Robot detail hero now uses live-style product image cover:

- full-width image hero with graphite overlay;
- centered white H1;
- buttons: `Оставить заявку` and `Задать вопрос`;
- removed visible breadcrumbs above the hero for the visual baseline.

### Robot page block-family pass

The generic source-of-truth panels below `/arenda-unitree-g1` hero were replaced with live-style robot page blocks:

- long-form intro text on the blue-tint canvas;
- numbered section eyebrow: `01 — КЛЮЧЕВЫЕ ВОЗМОЖНОСТИ`;
- transparent 3-column feature cards instead of bordered panels;
- numbered scenario section: `02 — СЦЕНАРИИ ИСПОЛЬЗОВАНИЯ`;
- horizontal live-style media rail with 8 meaningful Unitree G1 images;
- dark CTA strip for pricing/contact;
- Kiber Gosha helper bubble near the lower conversion path.

### FAQ / conversion / footer parity pass

The lower robot template was brought into the same live-style rhythm:

- FAQ rebuilt as a numbered `03 — ВОПРОСЫ И ОТВЕТЫ` section with transparent accordion rows and blue plus controls;
- Kiber Gosha helper CTA kept as the human/robot conversion bridge before related recommendations;
- related robots section rebuilt as `04 — ПОХОЖИЕ РОБОТЫ` with catalog-style product tiles and mobile single-column layout;
- footer replaced with a live-style dark footer: white logo, navigation, phone, CTA and compact meta row;
- mobile related robots were corrected from a cramped multi-column grid to readable stacked cards.

Browser DOM proof after the FAQ/footer pass:

```json
{
  "robotLiveFaq": 1,
  "faqItems": 5,
  "robotLiveRelated": 1,
  "siteFooterLive": 1,
  "footerLinks": [
    "Главная",
    "Каталог",
    "Подборки",
    "Блог Кибер Гоши",
    "Новости",
    "Контакты",
    "+7 977 479 07 49",
    "Написать нам"
  ]
}
```

### Robot template propagation pass

The corrected robot template is now verified across all 24 robot detail pages:

- every robot page builds through the shared live-style `RobotPage.astro` composition;
- all 24 built pages include the required template markers: hero, intro, gallery, CTA strip, FAQ, Gosha helper, related robots and live footer;
- representative desktop/mobile screenshots were captured for humanoid, service, media, dog, coffee and drawing robots;
- Russian generated headings were normalized from genitive source labels like `робота-официанта BellaBot` to nominative page copy like `Робот-официант BellaBot` / `Что умеет робот-официант BellaBot`;
- pricing and business facts stayed untouched.

Representative pages checked:

```text
arenda-unitree-g1
arenda-bellabot
arenda-glambot
arenda-unitree-go2
arenda-mini-robo-kofeyni
arenda-sketchbot
```

Machine-readable proof:

```text
data/design/robot-template-propagation-check.json
```

### Robot schema / internal-linking validation pass

Robot pages now have a dedicated SEO/schema validation gate:

- added `FAQPage` JSON-LD for each robot page with FAQ answers from source-of-truth;
- kept existing `Service` and `BreadcrumbList` JSON-LD per robot page;
- added `scripts/validate_robot_seo_links.py` to validate all 24 built robot pages;
- validator checks canonical URL, `og:url`, absolute `og:image`, robots meta, sitemap inclusion, rendered related robot links, local fragment CTA targets and required live-style template markers;
- latest validation result: `robotPages=24`, `checkedPages=24`, `errors=0`, `warnings=0`.

Machine-readable proof:

```text
data/seo/robot-schema-internal-linking-check.json
```

### Collection template pass

Collection routes now share a live-style template baseline:

- `/arenda-robotov-na-meropriyatie` renders a photo/scrim hero, numbered intro block, source-of-truth robot catalog and conversion CTA;
- `/roboty-gumanoidy` uses the same template with filtered humanoid robot data;
- collection schema now uses `CollectionPage` with `ItemList`/`ListItem` service entries plus `BreadcrumbList`;
- added `scripts/validate_collection_pages.py` to validate canonical, `og:url`, absolute `og:image`, robots meta, sitemap inclusion, robot links, fragment CTAs and live-style collection markers;
- latest validation result: `collectionPages=2`, `checkedPages=2`, `errors=0`, `warnings=0`.

Evidence:

```text
data/design/parity-screenshots/collection-template/*.png
data/seo/collection-template-check.json
```

### Content index template pass

Top-level content sections now have a shared live-style index baseline:

- `/articles` is renamed in UI to `Блог Кибер Гоши`, with photo/scrim hero, article cards and `Blog` + `BreadcrumbList` JSON-LD;
- `/compilations` uses scenario-based live-style groups with robot cards and `CollectionPage` + `BreadcrumbList` JSON-LD;
- `/news` uses the same visual language and a clear preview/empty state until editor-approved news are published;
- added `scripts/validate_content_index_pages.py` to validate canonical, `og:url`, absolute `og:image`, robots meta, sitemap inclusion, internal links, fragment CTAs and content template markers;
- latest validation result: `contentIndexPages=3`, `checkedPages=3`, `errors=0`, `warnings=0`.

Evidence:

```text
data/design/parity-screenshots/content-index/*.png
data/seo/content-index-template-check.json
```

### Content detail template pass

Blog/article detail pages now use a live-style reading template:

- `[...slug].astro` keeps robot detail routing intact and applies a photo/scrim article hero, readable article body and sticky next-step aside to non-robot content;
- news detail pages use the same live-style structure with `NewsArticle` JSON-LD when editor-approved news are generated;
- added `scripts/validate_content_detail_pages.py` for `BlogPosting`/`NewsArticle`, `BreadcrumbList`, canonical, `og:url`, robots meta, sitemap inclusion, fragment CTAs and live-style detail markers;
- latest validation result: `detailPages=7`, `checkedPages=7`, `errors=0`, `warnings=0`.

Evidence:

```text
data/design/parity-screenshots/content-detail/*.png
data/seo/content-detail-template-check.json
```

### Whole-site static validation pass

A whole-site static validation gate now checks every generated Astro `index.html` file and treats preview/noindex routes separately from public launch blockers:

- added `scripts/validate_whole_site_static.py`;
- validates title, description, canonical, robots meta, sitemap inclusion, JSON-LD presence for public pages, local image assets, local internal routes and fragment CTA targets;
- latest validation result: `htmlPages=46`, `publicPages=38`, `previewPages=8`, `checkedPages=46`, `errors=0`, `warnings=0`;
- added `Organization`/`WebSite` schema to home and `ContactPage`/`Organization` schema to contacts;
- recorded production blockers and safe next steps in `docs/launch-readiness-report.md`.

Evidence:

```text
data/seo/whole-site-static-check.json
docs/launch-readiness-report.md
```

### Launch-prep documentation pass

Safe launch-prep artifacts were generated without touching production infrastructure:

- route inventory report: `docs/route-inventory.md` and `data/seo/route-inventory.json`;
- live-style Contacts placeholder page with explicit factual blockers and ContactPage/Organization schema;
- production launch checklist: `docs/production-launch-checklist.md`;
- redirect scaffold: `data/seo/redirects.scaffold.json`, not wired into deployment;
- contacts visual evidence: `data/design/parity-screenshots/launch-prep/*.png`.

Evidence:

```text
data/seo/route-inventory.json
docs/route-inventory.md
docs/production-launch-checklist.md
data/seo/redirects.scaffold.json
data/design/parity-screenshots/launch-prep/*.png
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
```

### Rendered image alt audit pass

Rendered public pages now have a media SEO regression gate:

- added `scripts/audit_rendered_image_alt.py`;
- public/indexable pages only are checked; preview/noindex routes are excluded;
- meaningful rendered images must not lose `alt` during template rendering;
- very long alts and missing even-position commercial coverage are reported as warnings;
- latest validation result: `publicPagesChecked=38`, `meaningfulImages=435`, `errors=0`, `warnings=0`.

Evidence:

```text
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
```

### Rendered heading hierarchy audit pass

Rendered public pages now have a heading SEO regression gate:

- added `scripts/audit_rendered_headings.py`;
- public/indexable pages only are checked; preview/noindex routes are excluded;
- every public page must have exactly one non-empty H1;
- empty headings and skipped heading-level jumps are reported as warnings;
- latest validation result: `publicPagesChecked=38`, `headings=729`, `errors=0`, `warnings=0`.

Evidence:

```text
data/seo/rendered-heading-audit.json
docs/rendered-heading-audit.md
data/seo/launch-qa-summary.json
docs/launch-qa-summary.md
docs/business-inputs-request.md
docs/production-deployment-dry-run.md
data/seo/production-readiness-matrix.json
docs/production-readiness-matrix.md
```

### Unified launch QA bundle pass

A single pre-production QA command now runs all local static gates in order:

```bash
python3 scripts/run_launch_qa.py
```

Current result: `status=passed`, `steps=11`, `passed=11`, `failed=0`.

The bundle writes:

```text
data/seo/launch-qa-summary.json
docs/launch-qa-summary.md
docs/business-inputs-request.md
docs/production-deployment-dry-run.md
data/seo/production-readiness-matrix.json
docs/production-readiness-matrix.md
```

It does not deploy, change DNS, activate redirects, connect analytics, or touch production infrastructure.

### Static 404 readiness pass

A live-style static `404.html` route is now generated for production error handling:

- added `app/src/pages/404.astro`;
- page is `noindex,nofollow` and therefore treated as preview/system route, not a public SEO route;
- whole-site static validation now includes non-index root HTML files and checks `47` generated HTML files;
- route inventory now includes `47` routes: `38` public and `9` preview/noindex.

### Business input request pack

A structured request pack is prepared for the remaining non-code blockers:

```text
docs/business-inputs-request.md
docs/production-deployment-dry-run.md
data/seo/production-readiness-matrix.json
docs/production-readiness-matrix.md
```

It asks for final contacts/requisites, lead destination, analytics IDs/events, SEO keyword/long-tail materials, pricing/claims approval, redirect approval and production deploy approval.

### Production deployment dry-run plan

A deployment dry-run plan is prepared without changing infrastructure:

```text
docs/production-deployment-dry-run.md
data/seo/production-readiness-matrix.json
docs/production-readiness-matrix.md
```

It documents allowed Alex-owned zones, hard server boundaries, pre-change note template, approval gates, local QA, Docker/Coolify dry-run commands, rollback options, post-deploy checks and production blockers.

Browser DOM proof after the pass:

```json
{
  "robotLiveIntro": 1,
  "liveSections": 2,
  "galleryItems": 8,
  "ctaStrip": 1,
  "gosha": 1,
  "h2": [
    "Что умеет робот Unitree G1",
    "Где робот Unitree G1 произведёт «вау-эффект»?"
  ],
  "imageResourceErrors": 0
}
```

## Computed-style proof — Astro home after correction

Measured in browser on `http://127.0.0.1:4321/`:

```json
{
  "header": {
    "backgroundColor": "rgba(255, 255, 255, 0.9)",
    "height": 80,
    "boxShadow": "none",
    "text": "Каталог Подборки Блог Новости Контакты +7 977 479 07 49 Написать нам"
  },
  "h1": {
    "fontFamily": "Gillroy, Arial, sans-serif",
    "fontSize": "64px",
    "fontWeight": "700",
    "lineHeight": "64px",
    "letterSpacing": "1px",
    "color": "rgb(255, 255, 255)"
  },
  "primaryButton": {
    "backgroundColor": "rgb(0, 136, 255)",
    "borderRadius": "24px",
    "fontSize": "14px",
    "fontWeight": "700"
  },
  "secondaryButton": {
    "backgroundColor": "rgb(255, 255, 255)",
    "color": "rgb(0, 136, 255)",
    "borderRadius": "24px"
  },
  "catalogCard": {
    "backgroundColor": "rgba(0, 0, 0, 0)",
    "borderRadius": "0px",
    "boxShadow": "none"
  },
  "catalogTitle": {
    "fontFamily": "Gillroy, Arial, sans-serif",
    "fontSize": "22px",
    "fontWeight": "700",
    "lineHeight": "30.8px"
  },
  "catalogPrice": {
    "fontFamily": "Montserrat, Arial, sans-serif",
    "fontSize": "14px",
    "fontWeight": "600"
  }
}
```

## Current visual parity status

| Area | Desktop | Mobile | Status |
|---|---:|---:|---|
| Header | close | close | pass for baseline |
| Home hero | close | close | pass for baseline |
| CTA buttons | close | close | pass for baseline |
| Catalog product tiles | close | not fully reviewed | pass for desktop baseline |
| Gosha bubble | close | needs spacing polish | partial |
| Compilation cards | close | not fully reviewed | partial |
| Robot hero | close in structure | captured, needs crop review | partial |
| Robot content below hero | live-style intro/features/scenarios applied | mobile readable, captured | pass for block-family baseline |
| Robot gallery | horizontal media rail with 8 meaningful images | scroll rail captured | pass for baseline |
| Robot CTA strip | dark live-style strip applied | stacked mobile actions | pass for baseline |
| FAQ / footer | FAQ, Gosha CTA, related robots and footer live-style baseline applied on shared robot template | mobile related cards stacked/readable | propagated across all 24 robot pages |
| Collection pages | photo/scrim hero, numbered intro, robot source-of-truth catalog, CTA strip | mobile hero/cards readable | pass for `/arenda-robotov-na-meropriyatie` and `/roboty-gumanoidy` |
| Content index pages | live-style heroes and cards for `Блог Кибер Гоши`, `Подборки`, `Новости` | mobile heroes/cards readable | pass for `/articles`, `/compilations`, `/news` |
| Content detail pages | live-style article hero, article body and next-step aside | mobile article layout stacks | pass for 7 blog detail pages |
| Whole-site static validation | 47 generated HTML files checked, including 38 public routes and static 404 | no visual change | errors=0, warnings=0 |
| Rendered image alt audit | 435 meaningful images on 38 public pages checked | no visual change | errors=0, warnings=0 |
| Rendered heading audit | 729 rendered headings on 38 public pages checked | no visual change | errors=0, warnings=0 |
| Unified launch QA bundle | 11 local static gates run in one command | no visual change | passed=11, failed=0 |

## Remaining known differences

1. **Related robot screenshots need image-load proof in final QA**
   Related robot product images resolve in the browser and use catalog cards, but full-page screenshot captures can show white product panels before distant images are visibly painted. Keep this as a QA watch item when doing the propagation pass.

2. **Prices differ intentionally**  
   Live catalog shows package-style values such as `от 50 000 ₽`; Astro uses structured tariff/hourly values such as `от 12 500 ₽ / час`. Do not overwrite pricing from live without business approval.

3. **Home lower blocks still need separate parity**  
   Gosha, подборки, articles, FAQ, news and footer are visually closer now, but this pass only gated first-screen and catalog baseline.

4. **Fonts need final operational decision**  
   Live computed styles use `Gillroy`; font files are named `Gilroy`. Current token follows live CSS family name. A later production pass should self-host and normalize if needed.

## Verification commands

```text
python3 scripts/validate_design_tokens.py --root . --json
→ ok=True, errors=0, warnings=0

python3 scripts/validate_public_pages.py --root . --json
→ ok=True, htmlPages=46, errors=0, warnings=0

npm --prefix app run build
→ 46 page(s) built, exit 0

python3 scripts/validate_robot_seo_links.py --root . --json
→ robotPages=24, checkedPages=24, errors=0, warnings=0

python3 scripts/validate_collection_pages.py --root . --json
→ collectionPages=2, checkedPages=2, errors=0, warnings=0

python3 scripts/validate_content_index_pages.py --root . --json
→ contentIndexPages=3, checkedPages=3, errors=0, warnings=0

python3 scripts/validate_content_detail_pages.py --root . --json
→ detailPages=7, checkedPages=7, errors=0, warnings=0

python3 scripts/validate_whole_site_static.py --root . --json
→ htmlPages=47, publicPages=38, previewPages=9, checkedPages=47, errors=0, warnings=0

python3 scripts/audit_rendered_image_alt.py --root . --json
→ publicPagesChecked=38, meaningfulImages=435, errors=0, warnings=0

python3 scripts/audit_rendered_headings.py --root . --json
→ publicPagesChecked=38, headings=729, errors=0, warnings=0

python3 scripts/run_launch_qa.py
→ status=passed, steps=11, passed=11, failed=0

curl -sI http://127.0.0.1:4321/
→ HTTP/1.1 200 OK
```

## Recommended next step

Proceed to **safe launch-readiness preparation without touching production**:

1. generate a route inventory report with page type, schema types, image/link counts and public/noindex status;
2. improve Contacts visual parity while keeping factual placeholders explicit;
3. prepare `docs/production-launch-checklist.md` and redirect scaffolding, but do not activate production deployment/DNS/redirects until business inputs are approved.
