# Protected staging pre-change note — homepage full parity pass

Date: 2026-08-31
Scope: PR #8 / KIBER-15 controlled rebuild, non-production protected staging only.

## What will change

Update the Alex-owned protected staging container `alex-kiber-staging` to a new SHA-tagged preview image after the homepage full parity pass.

The staging build includes:
- full homepage block order map from current Astro vs original homepage;
- Astro-rendered lower homepage blocks: Кибер Гоша, Подборки, Статьи, FAQ, final CTA;
- optimized local homepage media under `public/images/home-live/`;
- FAQPage JSON-LD on the homepage;
- regression tests for homepage block order, data use, media policy, and FAQ schema.

## Affected files / containers

Files in repository only plus new Docker image tag:
- `src/pages/index.astro`
- `src/components/blocks/HomeGoshaQuote.astro`
- `src/components/blocks/HomeImageCards.astro`
- `src/components/blocks/HomeFaqBlock.astro`
- `src/components/blocks/HomeFinalCta.astro`
- `src/data/home-live.ts`
- `public/images/home-live/*.webp`
- `data/review/homepage-owner-media-assets.json`
- `src/lib/seo.ts`
- `tests/visual/homepage-full-parity-pass.test.ts`
- `docs/review/kiber-homepage-full-parity-map-2026-08-31.md`

Container affected:
- `alex-kiber-staging` only.

## Rollback plan

Before replacing the container, record the currently running `alex-kiber-staging` image. If smoke fails, recreate `alex-kiber-staging` from that rollback image while preserving the existing Traefik Basic Auth/noindex labels and networks.

## Verification plan

- `node --import tsx --test tests/visual/homepage-full-parity-pass.test.ts`
- `npm run check`
- `npm run test:visual`
- `npm run build:preview`
- `npm run ci`
- local browser visual sanity on homepage desktop; mobile covered by responsive/source gates and protected staging visual review by owner
- Docker SHA-tagged preview build
- protected staging smoke: Basic Auth 401 unauthenticated, authenticated `/` and `/healthz/` 200, noindex, no analytics scripts, no host ports, container healthy

## Approval / safety

Denis approval required: no — this touches only Alex-owned `alex-kiber-staging` and repository files.

Not included:
- no production deploy;
- no DNS/domain changes;
- no production secrets;
- no analytics provider enablement;
- no live lead routing / amoCRM / Telegram destination changes.
