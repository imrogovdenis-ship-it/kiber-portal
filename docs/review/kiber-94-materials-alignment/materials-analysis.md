# KIBER-94 materials alignment analysis

Status: review-only; no production/deploy/merge decision.

## Executive conclusion

The expanded article set confirms the **contract-first hybrid** path. The materials vary by size and block mix, but they are not incompatible with a single site system. We need a flexible `article_detail` contract with required core blocks and optional typed blocks, rather than one rigid article layout. Robot cards and подборки need their own reusable contracts. Current Astro templates should be expanded to support these contracts, while Claude skills should be rewritten to emit structured fields for the same contracts.

## Uploaded sample inventory

| ID | Type | Archetype | Lines | Rough words | Main structure signals | Metadata |
|---|---|---|---:|---:|---|---|
| `article_23_feb` | article_detail | scenario/occasion | 93 | 984 | hero, intro, gallery, table/checkpoint, catalog, related, FAQ, Gosha CTA, service report, prices | canonical, title, description, keywords |
| `article_price` | article_detail | price_explainer | 113 | 1510 | hero, intro, gallery, table/checkpoint, catalog, related, FAQ, Gosha CTA, service report, prices | canonical, title, description, keywords |
| `article_sofia_gala` | article_detail | scenario/occasion | 107 | 1362 | hero, intro, gallery, table/checkpoint, related, FAQ, Gosha CTA, service report, prices | canonical, title, description, keywords |
| `article_store_opening` | article_detail | scenario/occasion | 125 | 1563 | hero, intro, gallery, table/checkpoint, catalog, related, FAQ, Gosha CTA, service report, prices | canonical, title, description, keywords |
| `article_unusual_corporate` | article_detail | ideas/listicle | 142 | 1605 | hero, intro, gallery, table/checkpoint, catalog, related, FAQ, Gosha CTA, service report, prices | canonical, title, description, keywords |
| `article_unitree_comparison` | article_detail | comparison | 188 | 2884 | hero, intro, gallery, table/checkpoint, catalog, related, FAQ, Gosha CTA, service report, prices | canonical, title, description, keywords |
| `compilation_humanoids` | compilation | — | 137 | 1363 | hero, intro, gallery, table/checkpoint, catalog, related, FAQ, Gosha CTA, service report, prices | canonical, title, description, keywords |
| `compilation_wedding` | compilation | — | 143 | 1515 | hero, intro, gallery, table/checkpoint, catalog, related, FAQ, Gosha CTA, service report, prices | canonical, title, description, keywords |
| `robot_unitree_go2` | robot_card | — | 127 | 1851 | hero, gallery, table/checkpoint, FAQ, Gosha CTA, service report, prices | canonical, title, description, keywords |
| `robot_senserobot` | robot_card | — | 114 | 1786 | intro, gallery, related, FAQ, Gosha CTA, service report, prices | canonical, title, description, keywords |
| `robot_unitree_r1` | robot_card | — | 132 | 1977 | gallery, FAQ, Gosha CTA, service report, prices | canonical, title, description, keywords |

## Article-specific finding: one template must support several archetypes

The article samples now cover at least these archetypes:

- **scenario/occasion**: `article_23_feb`, `article_sofia_gala`, `article_store_opening`
- **price_explainer**: `article_price`
- **ideas/listicle**: `article_unusual_corporate`
- **comparison**: `article_unitree_comparison`

Common article core blocks: Hero, introduction, several topical text/H2 blocks, CTA/Gosha quote, FAQ, metadata, source/service report. Variable blocks: comparison tables, checkpoints, catalog/product blocks, links to articles, scenario lists, richer media/image blocks.

Therefore the `article_detail` contract should define **required core blocks** plus **optional typed blocks** selected by archetype. A single rigid “all articles must have exactly these blocks” rule would either overbuild short scenario articles or underrepresent comparison/price articles.

## Recurring prepared-material structures

### Robot cards
- Metadata: canonical URL, SEO Title, SEO Description, keyword list.
- Body: Hero → Model/introduction → Gallery → Extended practical description → Key capabilities → Use scenarios → Robot in action/media → Kiber Gosha CTA → FAQ.
- Current mismatch: `src/pages/robots/[slug].astro` renders a much smaller structure: `RobotPageHero`, generated internal links, 3 fact cards, facts/limitations, pricing, FAQ. It does not yet have the full prepared-material structure for gallery, capabilities, scenarios, “robot in action”, Gosha CTA, or rich body copy.

### Articles
- Metadata and Wordstat/SERP/checklist service sections are separate from public article body.
- Public body uses block sequence, not freeform markdown: Hero → intro → topical H2/text blocks → optional typed blocks (comparison/table/checkpoint/catalog/links/media) → Gosha quote/CTA → FAQ.
- Current mismatch: there is an `/articles/` index page, but no article detail route/template yet in `src/pages`. Article materials are detail pages and need a dedicated article content model/template.

### Подборки / “сборки”
- Internal material name is “сборка”; public site term should remain **«Подборки»**.
- Structure is rich landing/category page: Hero → intro → Gallery → theme explanation → optional video → scenarios → catalog/product block → related articles → FAQ → Kiber Gosha CTA → other подборки → homepage promo card → metadata/service report.
- Current mismatch: `/compilations/` is an index page with cards and a short explainer, not detail pages like `/roboty-gumanoidy/` or `/roboty-na-svadbu/`. Existing category pages such as `/roboty-gumanoidy/` cover part of this but are much thinner than the uploaded подборка material.

## Important compatibility decisions

1. Keep current Astro/design system as the visual foundation, but expand templates only through approved reusable blocks.
2. Treat Claude/Tilda block names as source structure, not literal frontend implementation. Translate them into Astro components/data fields.
3. Preserve service-only sections such as Wordstat, SERP analysis, checklist, and source notes as review metadata; do not render them publicly.
4. Prices must come from approved tariff/source-of-truth data, not from old draft prose. Uploaded texts that mention prices become candidates to reconcile, not automatic public facts.
5. Capabilities/specs must carry source status (`owner_approved`, `manufacturer`, `page_content`, `needs_review`); do not publish claims just because they appear in generated materials.
6. Internal links in old copy may be placeholders. They should enter a review-only internal-link proposal registry before rendering.
7. Use public term “Подборки” even if source skills/materials say “сборки”.

## Recommended next build artifact
Create `data/seo/page-type-intent-contract.draft.json` plus `docs/seo-ai-page-type-intent-matrix.md`, then build source schemas for three repeating detail templates first: `robot_card`, `article_detail`, `compilation`.

## Page-type matrix draft direction

| Page type | Public role | Must support from materials | Current gap | Priority |
|---|---|---|---|---|
| home | commercial gateway | catalog links, подборки/articles promos, AI summary, CTA | Needs contract alignment; existing home not analyzed in this pass | medium |
| robot_card | one model rental page | 9-block service card: hero, intro, gallery, description, features, scenarios, media, Gosha CTA, FAQ | Current template is much thinner | high |
| category | robot type/category hub | hero, model grid, scenarios, FAQ, related content | Existing category pages are partial | high |
| compilation | scenario/theme landing page | 12-block подборка structure, catalog, related articles, other подборки, promo card | Only index exists; detail routes/data model needed | high |
| article_index | blog listing | index intro, filtered cards, internal links, CTA | Current page OK as index, not detail | medium |
| article_detail | informational/how-to page | core + archetype optional blocks, CTA/Gosha quote, FAQ, metadata | No detail template found; must support short/medium/comparison variants | high |
| news_index | news listing | index listing, dates, source context, related services | Current page not analyzed deeply | medium |
| news_detail | event/news page | NewsArticle, dates, source, related robot/service links | No detail template found | medium |
| contacts | conversion/support page | NAP, messengers, request path, ContactPage schema | Must stay aligned with approved contact facts only | medium |
| legal | legal content page | legal text, cross-links, WebPage schema, no keyword stuffing | Already has pages; keep different SEO logic | low |
| conversion | lead/request/thanks pages | clear next action, noindex policy if needed, preview-safe routing | Must not imply live lead routing approval | medium |

## Recommended next action
Proceed with a short non-production **KIBER-94 contract extraction task**, not visual page implementation yet. Turn these materials into a machine-readable page-type contract and mismatch report, then ask Alexander to approve the matrix before changing/expanding templates.

## Files in this review package
- `inventory.json` — source copies, hashes, extracted text paths.
- `extracted-text/*.md` — extracted text from DOCX and `.skill` archives.
- `materials-analysis.json` — structured analysis summary.
