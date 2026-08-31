# Homepage full parity map — current Astro vs original home

Date: 2026-08-31
Branch: `codex/kiber-15-controlled-rebuild`
Source of original homepage structure: `data/design/home-live-blocks.json` from `https://www.kiber-portal.ru/`
Preview scope only: no production deploy, DNS, secrets, analytics IDs, or live lead-routing changed.

## Why these blocks were not shown earlier

The earlier visual approvals were not a full homepage approval. They were controlled passes for the foundation / vertical slice: header, hero, catalog cards, CTA, contacts/lead safety, robot template pieces, and then footer. The original lower homepage blocks had already been extracted into `data/design/home-live-blocks.json`, but they had not yet been promoted into rendered Astro homepage sections.

This pass closes that gap by rendering the original homepage sequence through Astro components and local optimized runtime media instead of pasting raw constructor HTML.

## Current vs original map

| Original order | Original block | Status before this pass | Status after this pass | Notes |
| --- | --- | --- | --- | --- |
| 1 | Header | Present | Preserved | Existing approved global chrome remains unchanged. |
| 2 | Hero | Present | Preserved | Keeps owner-provided hero image and approved mobile 16:9 behavior. |
| 3 | Кибер Гоша quote/helper | Missing from rendered home | Added | New `HomeGoshaQuote.astro`; copy/image come from `data/design/home-live-blocks.json`. |
| 4 | Подборки | Missing from rendered home | Added | New `HomeImageCards.astro` overlay variant; five original cards are rendered with safe route fallbacks where source routes are not built yet. |
| 5 | Каталог / robot cards | Present | Preserved in original sequence | Existing four-card desktop grid and clickable robot cards stay. |
| 6 | Articles / Блог Кибер Гоши | Missing from rendered home | Added | New `HomeImageCards.astro` article variant; six original article cards are shown, linking to `/articles/` until detail article routes are generated. |
| 7 | FAQ | Missing from rendered home | Added | New `HomeFaqBlock.astro`; FAQ answers come from the original homepage extraction; `FAQPage` JSON-LD is generated from the same data. |
| 8 | CTA / social/helper | Partially present as generic `CtaStrip` | Replaced on home with original final CTA data | New `HomeFinalCta.astro` uses original `Остались вопросы?` copy and Kибер Гоша image, with preview-safe contact/catalog links. |
| 9 | News | Present as separate `/news/` route, not yet distinct home block | Deferred for next pass | `homeOrder` includes `news`, but `data/design/home-live-blocks.json` has no `news` object yet. I did not invent content; leave as explicit remaining parity item. |
| 10 | Footer | Present and approved | Preserved | Owner-approved footer remains stable; only page context/spacing can be reviewed in full-page visual approval. |

## Implemented artifacts

- `src/data/home-live.ts` — typed adapter from original-home extraction to safe Astro data.
- `src/components/blocks/HomeGoshaQuote.astro` — Кибер Гоша quote/helper block.
- `src/components/blocks/HomeImageCards.astro` — shared original-style image-card section for Подборки and Articles.
- `src/components/blocks/HomeFaqBlock.astro` — homepage FAQ.
- `src/components/blocks/HomeFinalCta.astro` — original final CTA.
- `src/pages/index.astro` — full homepage order wired as: hero → Gosha → Подборки → catalog → articles → FAQ → final CTA → internal links → footer.
- `public/images/home-live/*.webp` — optimized local runtime copies of original lower-home images.
- `tests/visual/homepage-full-parity-pass.test.ts` — source regression coverage for order, data use, media optimization, safe routes, and FAQ schema.

## Remaining owner visual approval scope

Please review on staging across desktop and mobile:

- full-page rhythm from hero into lower blocks;
- whether Кибер Гоша feels like the original helper/quote, not generic testimonial UI;
- Подборки card density/image crops;
- article card density/image crops;
- FAQ density and mobile spacing;
- final CTA vs original social/helper block feeling;
- whether the page now stops feeling like a generic constructor/SaaS template;
- footer only in full-page context, because footer itself is already approved.

## Explicitly deferred

- News/home-news block: original order references it, but current extracted home data has no concrete `news` payload. Needs a follow-up extraction/implementation pass rather than invented copy.
- Article detail routes for all article cards: cards link safely to `/articles/` until article detail generation is implemented.
- Some original compilation detail routes are not generated yet; those cards use safe existing fallbacks to avoid broken public links during preview.
