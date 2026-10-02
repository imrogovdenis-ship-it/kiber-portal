# KIBER related compilations block contract

Status: **owner_approved_heading_style_and_four_of_six_rollout**  
Scope: every visible block/card-grid named «Подборки», «Подборки по теме», «Другие подборки» or related compilation navigation across KIBER PORTAL.

## General rules

1. The «Подборки» block must look visually identical everywhere it is reused: same `HomeImageCards` overlay card styling, typography, spacing, CTA style, image treatment and dark overlay. Cards may be reordered for relevance, but card presentation must not drift page-by-page.
2. Exception: `/compilations/` («Все подборки») is the index of all compilation cards. It may use its own larger horizontal card size and `compilations-page__card` styling. The card texts/identities remain the same as the canonical cards.
3. On normal content pages the block contains canonical topical compilation cards and then the last card «Все наши подборки» linking to `/compilations/`. Exactly **4 topical cards + final «Все наши подборки»** on every ordinary page including the homepage. This supersedes earlier 5-topical/6-total rules. Select from the six current ready compilations, ordered by page relevance; exclude self-links and duplicates.
4. If a topical compilation is planned but not ready, the card may still appear but its CTA must be `Скоро`, with honest disabled/planned state and no fake ready page link.
5. Card CTA text is strictly limited to `Подробнее` or `Скоро`. Do not use `Смотреть подборки`, `Все подборки`, or page-specific CTA labels inside compilation cards.
6. Cards in every reused «Подборки» block must be canonical cards from `/compilations/`: keep the approved title, description, image, href and ready/planned status. Never invent a page-local compilation title/description such as generic `Роботы-гуманоиды` or `Роботы на мероприятие`; if no close topical match exists, reuse one of the ready canonical cards.
7. Placement: on all pages except the homepage and robot cards, the «Подборки» block is the last content block immediately before the footer. On the homepage it keeps its approved homepage placement after the Gosha quote. Robot-card pages do not use this block.
8. `/compilations/` collects every compilation ever made or planned for this site, including not-yet-ready items marked `Скоро`. It does not need the final «Все наши подборки» self-card.
9. Current visual standard for reused cards is the approved `HomeImageCards` overlay style; do not change it unless Александр explicitly asks.
10. Before publication/readiness handoff, run a site-wide check that verifies: homepage card count, `/compilations/` inventory, article/compilation related block counts/order, absence of related compilation blocks on robot cards, disabled/planned CTA rules, and block placement.

## Canonical data/runtime files

- Homepage canonical cards: `data/design/home-live-blocks.json` → `compilations.cards`.
- All compilations index cards: `data/design/home-live-blocks.json` → `compilations.allCards`.
- Runtime mapping: `src/data/home-live.ts`, `src/lib/launch-navigation.ts`.
- Shared card component: `src/components/blocks/HomeImageCards.astro`.
- `/compilations/` index: `src/pages/compilations.astro`.
- Article related block: `src/components/templates/ApprovedArticle5.astro`.
- Compilation related block: `src/components/templates/CompilationTemplate.astro`.
- Robot card template: `src/components/templates/RobotCardTemplate.astro` must not render related compilations.
- Publication gate: `scripts/compilation-block-contract-smoke.mjs` / `npm run test:compilation-blocks`.

## Current canonical card identities and approved heading design

Source: `src/lib/compilation-card-headings.ts`. Each ready card has TWO separate fields/roles:

| Destination | Small semantic H3 | Large unchanged slogan |
| --- | --- | --- |
| `/roboty-gumanoidy/` | Аренда робота-гуманоида | Совсем как люди, только с батарейкой |
| `/roboty-dlya-vystavki/` | Аренда роботов для выставки | Впечатляющие роботы для выставок |
| `/roboty-promoutery/` | Аренда робота-промоутера | Очередь к стенду начинается здесь |
| `/robot-dlya-foruma-i-konferencii/` | Роботы для форумов и конференций | Форум начинается с робота |
| `/roboty-sobaki/` | Аренда робота-собаки | Роботы-собаки вместо цветов |
| `/roboty-unitree/` | Аренда роботов Unitree | На площадку выходит Unitree |

DOM and visual order: **small linked H3 → large ordinary slogan paragraph → existing description → Подробнее**.
- H3 uses the exact RobotCard category-label typography: Montserrat/body font, uppercase by CSS, category gray, responsive category size/line-height, label weight/letter-spacing. Do not uppercase stored text or apply generic editorial H3 typography here.
- Large slogan preserves previous card typography. It is not a heading; do not remove/rewrite it.
- Preserve canonical description, image, overlay, CTA, geometry and shared slider behavior.
- Accepted heading/slogan gap `.5rem`; extra separation before unchanged description is `.375rem` on heading wrapper in addition to existing card gap.
- Heading remains inside the destination anchor. Canonical public links only; dogs always `/roboty-sobaki/`.
- Shared implementation: `HomeImageCards.astro`, `src/pages/compilations.astro`, `public/styles/compilation-card-headings.css`.
- All-index retains **all six** topical cards and no self-card. «Все наши подборки» retains its existing hub-card presentation; do not duplicate its wording with a second tiny heading.

## Page relevance selection

`data/content/related-compilation-selections.json` is the explicit route → four destinations in decreasing relevance + editorial rationale matrix. `src/lib/related-compilation-selection.ts` resolves identities from canonical all-compilation data, never from four-card homepage inventory. This prevents Unitree disappearing from related blocks.

Read the page H1, introduction, substantive sections/models and intent. Prefer exact subject/class/brand, then directly discussed task/setting, then the closest complementary format. Do not rank by raw mention counts (navigation/related blocks contaminate them). A brand alternative must not imply another robot belongs to that brand; SenseRobot must not be called a humanoid. Holiday/children/chess pages have no exact match in the current six; record weaker complementary fourth choices honestly, without inventing destinations or changing their text.

For every new canonical page with a related block, add an explicit four-entry matrix row and rationale. Re-evaluate choices as inventory expands. Do not add blocks to robot cards or pages without them. Do not rewrite page body/H1/title as part of card selection.

The owner accepted the two-page visual implementation and explicitly authorized this broader preview rollout. It is not production/merge/DNS/analytics authorization. New route selections are implemented for review; visual standard approval must not be relabeled as acceptance of every newly rearranged page.

## Owner approval lock — 2026-09-23

Александр visually accepted the current implementation after Jino preview `?v=compilation-canonical-1` and instructed that this approach must be followed going forward. Treat the rules in this file as the durable project-wide contract for the «Подборки» block across homepage, articles, подборки pages, and robot-card exclusions.

This means future work must not re-open the pattern by default:

- do not invent local compilation card titles/descriptions for a page;
- do not change CTA vocabulary beyond `Подробнее`/`Скоро`;
- do not add the block to robot-card pages;
- do not change the shared visual/card style or block placement without a fresh explicit owner instruction;
- before any publication/readiness package, run `npm run test:compilation-blocks` and fix failures before handoff.

Approval/evidence:

- Approval record: `docs/approvals/compilation-block-rules-2026-09-23.json`
- Evidence pack: `docs/review/compilation-block-canonical-cards-2026-09-23/`
- Preview marker: `compilation-canonical-1`

