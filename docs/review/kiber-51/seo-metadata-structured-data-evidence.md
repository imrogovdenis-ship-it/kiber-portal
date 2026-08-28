# KIBER-51 SEO metadata and structured data evidence

## Summary

KIBER-51 adds rendered-output SEO validation and fills the current launch routes with absolute production canonical URLs, Open Graph/Twitter metadata and page-level JSON-LD.

## Implemented scope

- Extended `SeoHead.astro` with:
  - `og:site_name`
  - absolute `og:image`
  - `twitter:title`
  - `twitter:description`
  - `twitter:url`
  - `twitter:image`
- Extended `BaseLayout.astro` with page-level `jsonLd` support.
- Added schema helpers in `src/lib/seo.ts`:
  - `organizationJsonLd`
  - `websiteJsonLd`
  - `serviceJsonLd`
  - `contactPageJsonLd`
  - `collectionPageJsonLd`
  - `webPageJsonLd`
  - `absoluteUrl`
- Added JSON-LD to launch pages:
  - `/` → `Organization`, `WebSite`
  - `/robots/unitree-g1/` → `Service`, plus `BreadcrumbList` from shared breadcrumbs component
  - `/contacts/` → `ContactPage`
  - category/index routes → `CollectionPage`
- Fixed home hero heading semantics from `h2` to `h1`.
- Expanded short launch-page meta descriptions where the rendered SEO smoke required stronger descriptions.
- Added rendered-output smoke:
  - `scripts/seo-metadata-structured-data-smoke.mjs`
- Added contract test:
  - `tests/visual/seo-metadata-structured-data-contract.test.ts`
- Added CI gate:
  - `npm run test:seo-metadata`

## RED verification

The first contract failed as expected:

```text
node --import tsx --test tests/visual/seo-metadata-structured-data-contract.test.ts — failed
```

Missing at RED:

- rendered SEO smoke script;
- CI gate;
- page-level JSON-LD layout support;
- Twitter metadata coverage;
- explicit launch-page schemas.

## GREEN verification

Targeted validation:

```text
npm run check && node --import tsx --test tests/visual/seo-metadata-structured-data-contract.test.ts && npm run build:production && npm run test:seo-metadata — passed
```

Full CI:

```text
npm run ci — passed
```

Key outputs:

```text
Result (95 files): 0 errors, 0 warnings, 0 hints
KIBER-51 SEO metadata smoke passed: 8 launch routes checked for canonical, unique H1/title, OG/Twitter and JSON-LD.
KIBER-20 CI baseline smoke passed: 13 HTML pages link-checked, dist/404.html verified, 1335 tracked files secret-scanned.
```

## Rendered routes checked

- `/` — `Organization`, `WebSite`
- `/robots/unitree-g1/` — `Service`, `BreadcrumbList`
- `/roboty-gumanoidy/` — `CollectionPage`
- `/roboty-sobaki/` — `CollectionPage`
- `/compilations/` — `CollectionPage`
- `/articles/` — `CollectionPage`
- `/news/` — `CollectionPage`
- `/contacts/` — `ContactPage`

Each launch route is checked for:

- absolute production canonical;
- unique `<title>`;
- exactly one unique `<h1>`;
- meta description;
- `robots: index, follow`;
- Open Graph title/description/url/site/image;
- Twitter title/description/url/image;
- valid schema.org JSON-LD coverage.

## Safety boundaries

- No production deploy.
- No DNS changes.
- No secrets.
- No analytics provider IDs.
- No CRM/Telegram/forms routing changes.
- No legal/business content approval claims.
