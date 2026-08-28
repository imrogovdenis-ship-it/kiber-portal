# KIBER-52 safe internal links evidence

## Summary

KIBER-52 configures public internal links without aggressive auto-publication. The implementation separates curated approved links from the KIBER-79 generated proposal registry and renders only explicit `approved` links.

## Implemented scope

- Added curated link registry:
  - `data/seo/internal-links.json`
- Added internal-link loader:
  - `src/lib/internal-links.ts`
- Added reusable renderer:
  - `src/components/content/InternalLinks.astro`
- Connected curated links to current public launch pages:
  - `/`
  - `/robots/unitree-g1/`
  - `/roboty-gumanoidy/`
  - `/roboty-sobaki/`
  - `/compilations/`
  - `/articles/`
  - `/news/`
  - `/contacts/`
- Added rendered-output smoke:
  - `scripts/internal-links-rendering-smoke.mjs`
- Added contract test:
  - `tests/visual/internal-links-rendering-contract.test.ts`
- Added CI gate:
  - `npm run test:internal-link-rendering`

## Link policy

- `autoPublishGenerated: false`
- rendered status: `approved` only
- max curated links per source page: `3`
- KIBER-79 generated proposal registry remains review-only:
  - `status: generated_needs_review`
  - `publicRender: false`
  - `autoPublish: false`
- Generated proposal IDs/markers are forbidden in public production HTML.
- Targets must be launch routes or the explicitly allowed CTA target `/lead/request/`.

## Curated public links

The rendered registry currently includes 11 approved links across 8 source routes.

Examples:

- `/` → `/robots/unitree-g1/`, `/roboty-gumanoidy/`, `/roboty-sobaki/`
- `/robots/unitree-g1/` → `/lead/request/?robot=unitree-g1`, `/compilations/`
- `/roboty-gumanoidy/` → `/robots/unitree-g1/`
- `/roboty-sobaki/` → `/contacts/`
- `/articles/` → `/compilations/`
- `/news/` → `/articles/`

## RED verification

Initial contract failed as expected:

```text
node --import tsx --test tests/visual/internal-links-rendering-contract.test.ts — failed
```

Missing at RED:

- approved internal link registry;
- reusable loader;
- reusable Astro renderer;
- rendered smoke;
- CI gate.

## GREEN verification

Targeted validation:

```text
node --import tsx --test tests/visual/internal-links-rendering-contract.test.ts && npm run build:production && npm run test:internal-links && npm run test:internal-link-rendering — passed
```

Full CI:

```text
npm run ci — passed
```

Key outputs:

```text
Result (99 files): 0 errors, 0 warnings, 0 hints
KIBER-79 internal-link proposal smoke passed: 7 proposals checked; generated links stayed review-only across 13 HTML files.
KIBER-52 internal-link rendering smoke passed: 11 curated links across 8 source routes; generated proposals stayed review-only.
KIBER-20 CI baseline smoke passed: 13 HTML pages link-checked, dist/404.html verified, 1339 tracked files secret-scanned.
```

## Safety boundaries

- No production deploy.
- No DNS changes.
- No secrets.
- No analytics provider IDs.
- No CRM/Telegram/forms routing changes.
- No generated AI proposal auto-publication.
- No legal/business approval claims.
