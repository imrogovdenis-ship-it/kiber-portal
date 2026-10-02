# KIBER «Блог Кибер Гоши» block contract

Status: **owner_rule_pending_home_article_selection_2026-09-23**  
Scope: every visible block/card-grid named «Блог Кибер Гоши», related articles, or article recommendations on KIBER PORTAL.

## General rules

1. The «Блог Кибер Гоши» block is used only on:
   - Homepage `/`;
   - article detail pages `/articles/.../`;
   - compilation pages such as `/roboty-gumanoidy/`, `/roboty-sobaki/`, `/roboty-dlya-vystavki/`, `/roboty-promoutery/`.
2. The block is not used on robot-card pages, legal/service pages, contacts, thanks/request pages, news or other page types unless Александр explicitly changes the rule.
3. The block always contains exactly 6 cards:
   - first 5 cards link to real existing article pages;
   - 6th card is the canonical «Все статьи Блога Кибер Гоши» card linking to `/articles/`.
4. Article cards must be selected by relevance to the current page. If no exact match exists, use the closest relevant ready articles. Never invent non-existent articles.
5. Every article card must use canonical article-card data tied to the article: title, description, image and href from the article registry/runtime source. Do not write page-local card titles/descriptions/images by hand in page templates.
6. When creating a new article, create/update its canonical card data at the same time: card image, public title, description and href. The card image must match the current real article Hero/card image, not a stale launch-index image.
7. Placement:
   - Homepage: «Блог Кибер Гоши» is the final content block immediately before footer.
   - Article detail pages: «Блог Кибер Гоши» is the penultimate block, immediately before the closing «Подборки» block.
   - Compilation pages: «Блог Кибер Гоши» is the penultimate block, immediately before the closing «Подборки» block.
8. Visual style: current `HomeImageCards` `variant="article"` card style is the approved reference. Do not change the shared visual style, typography, spacing, image treatment or grid/card design without explicit owner instruction.
9. Homepage article selection: show the most important articles. Until Александр chooses a final set, keep the current first five ready article cards plus «Все статьи» and present alternative sets for owner approval rather than silently changing the homepage editorial selection.
10. Before publication/readiness handoff, run `npm run test:blog-gosha-blocks` and fix failures. This gate also verifies that every canonical article-card image and every rendered Blog Gosha card image matches the linked article Hero.

## Canonical runtime files

- Canonical article registry: `data/content/launch-articles.json` and `data/content/published-articles.json`.
- Runtime navigation/cards: `src/lib/launch-navigation.ts` and `src/lib/kiber-related-article-cards.ts`.
- Shared card component/style: `src/components/blocks/HomeImageCards.astro` with `variant="article"`.
- Homepage usage: `src/pages/index.astro`.
- Article detail usage: `src/components/templates/ApprovedArticle5.astro`.
- Compilation page usage: `src/components/templates/CompilationTemplate.astro`.
- Robot-card exclusion: `src/components/templates/RobotCardTemplate.astro`.
- Publication gate: `scripts/blog-gosha-block-contract-smoke.mjs` / `npm run test:blog-gosha-blocks`.

## Current canonical index card

The final 6th card is:

- Title: «Все статьи Блога Кибер Гоши»
- Description: «Гайды, идеи и сравнения по роботам для мероприятий: от выбора модели до подготовки площадки и сценария.»
- Href: `/articles/`
- Image: reuse the approved «Все подборки» visual asset until a separate article-index visual is approved.

## Homepage article-selection candidates pending approval

Current temporary homepage set keeps the first five real article cards from the article registry and appends «Все статьи». Proposed alternative sets for Александр’s approval are recorded in `docs/review/blog-gosha-block-contract-2026-09-23/homepage-article-selection-options.md`.
