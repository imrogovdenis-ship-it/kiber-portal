# Protected staging pre-change note — homepage owner feedback pass

Date: 2026-08-31
Scope: PR #8 / KIBER-15 controlled rebuild, non-production protected staging only.

## What will change

Update the Alex-owned protected staging container `alex-kiber-staging` to a new SHA-tagged preview image after applying Alexander's targeted homepage visual feedback.

The staging build includes only homepage visual corrections:
- header preserved as approved;
- hero container reduced and background image height reduced by ~15%;
- Kiber Gosha quote/signature layout aligned toward the provided original screenshot;
- homepage section labels/headings/descriptions unified with the catalog heading scale and large left offset;
- подборки cards changed to square horizontal drag slider;
- catalog cards preserved visually, while the existing approved internal-link metadata remains attached to existing cards instead of rendering the removed extra link block;
- article card CTA buttons removed and image ratio changed to 9:16;
- FAQ changed to one closed column;
- final CTA copy/spacing/image background updated;
- the separate `Популярные направления` block under the final CTA removed.

## Affected files / containers

Repository files:
- `src/pages/index.astro`
- `src/components/blocks/HomeHero.astro`
- `src/components/blocks/HomeGoshaQuote.astro`
- `src/components/blocks/HomeImageCards.astro`
- `src/components/blocks/HomeFaqBlock.astro`
- `src/components/blocks/HomeFinalCta.astro`
- `src/components/blocks/RobotCard.astro`
- `src/data/home-live.ts`
- `tests/visual/homepage-full-parity-pass.test.ts`
- `tests/visual/homepage-owner-feedback-pass.test.ts`

Container affected:
- `alex-kiber-staging` only.

## Rollback plan

Before replacing the container, record the currently running `alex-kiber-staging` image. If smoke fails, recreate `alex-kiber-staging` from that rollback image while preserving existing Traefik Basic Auth/noindex labels and networks.

## Verification plan

- focused homepage/internal-link source tests;
- `npm run check`;
- `npm run build:preview`;
- local browser visual sanity on homepage desktop;
- `npm run ci`;
- Docker SHA-tagged preview build;
- protected staging smoke: Basic Auth 401 unauthenticated, authenticated `/` and `/healthz/` 200, noindex, no analytics scripts, no host ports, container healthy.

## Approval / safety

Denis approval required: no — this touches only Alex-owned `alex-kiber-staging` and repository files.

Not included:
- no production deploy;
- no DNS/domain changes;
- no production secrets;
- no analytics provider enablement;
- no live lead routing / amoCRM / Telegram destination changes.
