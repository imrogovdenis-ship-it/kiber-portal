# KIBER article source of truth contract

Status: **owner_approved**  
Owner approval note: Александр утвердил текущий пакет контрактов как рабочий source of truth; дальнейшие правки вносятся в эти файлы по ходу работы.
Scope: `/articles/...` production workflow, article blocks, shared article-page style dependencies, article media and SEO gates.  
Purpose: make repository files the primary durable source of truth so future agents do not reconstruct approvals from chat, memory, Linear, preview links or scattered review notes.

> Until Alexander reviews and approves each section, entries in this package are **recorded current rules / candidates**, not final new owner approval. After review, update `docs/approvals/owner-approvals.json` and the per-contract status fields to `owner_approved`.

## Authority model

1. **Repository contracts and approval registry** are the primary durable source for approved article rules.
2. **Current repo implementation** is the primary technical source for components, data contracts, routes, robot facts and media paths.
3. **Production pages** are used to verify current live rendering, but live presence alone does not prove an approval decision.
4. **Owner-provided DOCX/TXT/images** are raw source material until mapped into the contract and implemented.
5. **Wordstat/SERP evidence** is SEO input, not visible copy.
6. **Jino preview** is an acceptance surface, not source of truth until approval is written here.
7. **Chat, compressed session history, memory, Linear/task issues** are discovery/direction only. They must not be the final source for approved article rules.

## Canonical files for article work

| Area | Canonical source | Rule |
|---|---|---|
| Article template | `src/components/templates/ApprovedArticle5.astro` | Use for current article pages unless a newer owner-approved template contract replaces it. |
| Article data contract | `src/lib/approved-article-5-types.ts` | Defines available article blocks/data shape. |
| Shared homepage data | `src/data/home-live.ts` | Source for shared CTA/Gosha/home-derived blocks. |
| FAQ block | `src/components/blocks/HomeFaqBlock.astro` | Reuse approved shared style; change content only. |
| CTA2 / Остались вопросы | `src/components/blocks/HomeFinalCta.astro` | Reuse approved shared style; do not redesign without owner approval. |
| Related/cards blocks | `src/components/blocks/HomeImageCards.astro` | Reuse shared card style. |
| Robot cards | `src/components/blocks/RobotCard.astro` | Catalog cards use catalog/card images and robot data, not article gallery photos. Card H3 titles must be nominative display model names; do not rely blindly on `robot.identity.name` from generated data because it may contain inflected SEO/page-title phrases. |
| Robot facts | `data/models/robots.source-of-truth.json`, `src/lib/robot-pages.ts` | Verify robot names, roles, prices and media before writing. |
| Article planning registry | `data/content/launch-articles.json` | Registry/order only; not a copy source and not a publication/approval source. |
| Published article registry | `data/content/published-articles.json` | Runtime source for production `/articles/` index and public related article cards; contains only owner-approved/release-safe articles. |
| Routes/SEO registry | `data/seo/launch-routes.json` | Route/SEO registry; check before adding routes. |
| Editorial entry angles | `docs/contracts/kiber-article-editorial-angles-contract.md` | Choose a distinct editorial entry angle before writing; add a custom angle if none fits. |
| Related articles | `src/lib/kiber-release-related-articles.ts` | Release-safe related cards only. |
| Related compilations | `src/lib/kiber-release-related-compilations.ts` | Topical compilation cards; standard is 4 topical + all compilations. |

## Contract package

- `docs/contracts/kiber-article-block-contract.md` — available blocks, when to use them, required/optional status and design source.
- `docs/contracts/kiber-article-style-contract.md` — text style, headings, Kiber Gosha, shared visual style constraints.
- `docs/contracts/kiber-article-media-contract.md` — Hero/gallery/catalog/related/capability-image roles and file paths.
- `docs/contracts/kiber-article-seo-contract.md` — Wordstat/SERP/content-gap/SEO-passport gates.
- `docs/contracts/kiber-article-editorial-angles-contract.md` — 20 reusable article entry angles and diversity gate for first H2/SEO intro/block map.
- `docs/contracts/kiber-article-source-of-truth.json` — machine-readable index for this package.
- `docs/approvals/owner-approvals.json` — machine-readable approval registry.

## Public price display — explicit owner correction

Until the owner separately changes this policy, public article/model blocks display prices only as **«от … ₽ / час»**. An exact package price or package duration in `data/models/robot-tariffs.json` is an internal commercial fact, not authorization to publish that format. Use the verified public display field (`robot.pricing.display` or an explicitly approved equivalent); never derive a new hourly amount by dividing a package.

Replacing a compact catalog card with a large featured model must preserve this public-price policy even if the new component normally receives package tariffs. Verify both the visible price and all served HTML/metadata/schema. Positive hourly-format and negative forbidden-package regression checks are required. This does not imply hourly booking is available and does not authorize rewriting unrelated pages or internal tariffs.

Owner correction and executed evidence: `docs/review/article-promobot-v4/owner-hourly-price-2026-09-25/`; workflow lessons: `docs/review/article-promobot-v4/LESSONS-AND-SKILL-CORRECTIONS-2026-09-25.md`.

## Rule for future changes

When Alexander approves or changes a rule:

1. Update the relevant contract file in this directory.
2. Update `docs/approvals/owner-approvals.json` with exact scope and status.
3. Apply implementation changes to source files.
4. Validate preview/build.
5. Report both implementation files and contract files changed.

No durable rule should live only in chat or memory.

## Article readiness final gate

Use `docs/contracts/kiber-article-readiness-checklist.md` before preview handoff.

## Article media alt source files and policy

Article alt text policy is governed by `docs/contracts/kiber-article-media-contract.md`. Article media sources include:

```text
public/images/articles/<slug>/...
src/lib/kiber-article-*-data.ts
data/content/launch-articles.json
data/content/published-articles.json
```

Use source/migrated alt as evidence only. Public/rendered `alt` must be grounded in an `actualDescription`-style factual visual description and may include natural article intent/long-tail phrasing only when it remains visually truthful.

## Shared related-compilations contract

Article pages must follow `docs/contracts/kiber-related-compilations-block-contract.md`: bottom «Подборки» block, exactly 5 cards (4 topical + final «Все наши подборки»), shared visual style, and `Скоро` for not-ready compilation cards. This is checked before publication/readiness handoff.

## Shared Blog Gosha block contract

Article pages must follow `docs/contracts/kiber-blog-gosha-block-contract.md`: bottom «Блог Кибер Гоши» block with exactly 6 cards (5 real articles + final «Все статьи Блога Кибер Гоши»), placed immediately before the closing «Подборки» block, using canonical article-card data only.

## Article-card image consistency

- [ ] Article card image in `data/content/launch-articles.json` and `data/content/published-articles.json` matches the current rendered article Hero image; `npm run test:blog-gosha-blocks` passes the image-vs-Hero assertion.
