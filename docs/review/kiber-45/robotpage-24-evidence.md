# KIBER-45 RobotPage 24 robots evidence

## Summary

KIBER-45 expands the controlled rebuild from the single MVP robot page to 24 robot detail pages rendered through one reusable `src/pages/robots/[slug].astro` template.

The implementation imports the existing 24-robot source-of-truth dataset into the controlled rebuild branch and generates a normalized public rendering layer. Imported records remain marked as review status so this task does not claim final content acceptance; KIBER-55 remains the next human/content acceptance pass.

## Scope

Implemented:

- Added source datasets under `data/models/`:
  - `robots.source-of-truth.json`
  - `robot-catalog-card-images.live.json`
  - `robot-tariffs.json`
- Added normalized generated render registry:
  - `src/content/robots.generated.json`
- Added loader:
  - `src/lib/robot-pages.ts`
- Reworked unified RobotPage template:
  - `src/pages/robots/[slug].astro`
- Added optimized hero images:
  - `public/images/kiber-45/*.webp`
- Updated route and SEO registries for canonical robot routes:
  - `/robots/arenda-*/`
- Updated internal link registries from old pilot `/robots/unitree-g1/` to `/robots/arenda-unitree-g1/`.
- Added rendered smoke:
  - `scripts/robotpage-24-smoke.mjs`
- Added contract test:
  - `tests/visual/robotpage-24-contract.test.ts`
- Added CI gate:
  - `npm run test:robotpage-24`

## Route contract

The production build now renders 24 robot pages through one route template:

```text
/robots/arenda-agibot-x2/
/robots/arenda-bellabot/
/robots/arenda-glambot/
/robots/arenda-inchbot-l1-w-edu/
/robots/arenda-kettybot/
/robots/arenda-klipmeiker/
/robots/arenda-mini-robo-kofeyni/
/robots/arenda-noetix-bumi/
/robots/arenda-promobot-v4/
/robots/arenda-robo-kofeyni/
/robots/arenda-roboshashki/
/robots/arenda-robot-barmen/
/robots/arenda-robota-ardi/
/robots/arenda-robota-hudozhnika-a4/
/robots/arenda-robota-sofiya/
/robots/arenda-robota-tron/
/robots/arenda-senserobot/
/robots/arenda-sketchbot/
/robots/arenda-unitree-g1/
/robots/arenda-unitree-go2/
/robots/arenda-unitree-h2/
/robots/arenda-unitree-r1/
/robots/arenda-uv-box/
/robots/arenda-xiaomi-cyberdog-2/
```

## Rendered validation

`npm run test:robotpage-24` checks rendered output after `npm run build:production`:

- source dataset contains 24 robots;
- generated render registry contains the same 24 slugs;
- `dist/robots/*/index.html` contains exactly 24 robot directories;
- each robot page has:
  - unified RobotPage marker `data-kiber-task="KIBER-45"`;
  - one H1;
  - absolute production canonical;
  - matching OG URL;
  - Twitter image metadata;
  - `index, follow` robots metadata;
  - Service JSON-LD;
  - BreadcrumbList JSON-LD;
  - pricing disclaimer `Не является публичной офертой`;
  - no review-only note leak;
  - no KIBER-50 sentinel leak;
  - existing optimized hero image asset.

## Safety boundaries

Not done:

- No production deploy.
- No DNS changes.
- No production secrets/provider IDs/analytics scripts.
- No CRM/Telegram/form routing changes.
- No claim that imported content is final marketing/legal approval.
- No auto-publication from generated internal-link proposals.

Review status preserved:

```json
{
  "sourceStatus": "stage2_enriched_needs_review",
  "generatedStatus": "generated_from_stage2_source_needs_review"
}
```

## Verification

Initial RED:

```text
node --import tsx --test tests/visual/robotpage-24-contract.test.ts
```

Failed because controlled rebuild did not have:

- `data/models/robots.source-of-truth.json`;
- KIBER-45 rendered smoke;
- 24 built robot pages.

Targeted GREEN:

```text
npm run build:production && node --import tsx --test tests/visual/robotpage-24-contract.test.ts && npm run test:routes && npm run test:seo-metadata && npm run test:internal-links && npm run test:internal-link-rendering && npm run test:robotpage-24
```

Passed.

Full CI:

```text
npm run ci
```

Passed.

Relevant final output:

```text
Result (102 files):
- 0 errors
- 0 warnings
- 0 hints

1..48
# tests 48
# pass 48
# fail 0

KIBER-39 performance budget smoke passed: 4 routes checked against LCP/INP/CLS static proxies.
KIBER-43 route/sitemap smoke passed: 35 launch routes, 31 sitemap URLs, 2 redirects checked.
KIBER-71 analytics event contract smoke passed: 294 DOM events checked against 8 provider-neutral events.
KIBER-53 semantic-core lifecycle smoke passed: 7 clusters, 3 lifecycle states, region RU.
KIBER-50 review-notes isolation smoke passed: 36 HTML files checked; review-only sentinel stayed out of production render.
KIBER-79 internal-link proposal smoke passed: 7 proposals checked; generated links stayed review-only across 36 HTML files.
KIBER-51 SEO metadata smoke passed: 31 launch routes checked for canonical, unique H1/title, OG/Twitter and JSON-LD.
KIBER-52 internal-link rendering smoke passed: 11 curated links across 8 source routes; generated proposals stayed review-only.
KIBER-45 RobotPage smoke passed: 24 robot pages rendered through one /robots/[slug]/ template.
KIBER-20 CI baseline smoke passed: 36 HTML pages link-checked, dist/404.html verified, 1346 tracked files secret-scanned.
```
