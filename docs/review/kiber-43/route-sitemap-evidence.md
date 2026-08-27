# KIBER-43 route/redirect registry and clean sitemap evidence

## Summary

Adds a source-controlled launch route registry, generated sitemap endpoint, and CI smoke that verifies launch URL availability, sitemap cleanliness, canonical coverage, and redirect source exclusion.

## Source of truth

- Launch route registry: `data/seo/launch-routes.json`
- Existing redirect registry: `data/seo/redirects.json`
- Sitemap endpoint: `src/pages/sitemap.xml.ts`
- CI smoke: `scripts/route-sitemap-smoke.mjs`
- Contract test: `tests/visual/route-sitemap-contract.test.ts`

## CI gate

New npm script:

```text
npm run test:routes
```

`npm run ci` now runs the route/sitemap smoke after production build:

```text
npm run verify && npm run test:visual-regression && npm run build:production && npm run test:performance && npm run test:routes && npm run ci:baseline
```

## Sitemap contents

Generated `dist/sitemap.xml` contains exactly 8 URLs:

```text
https://www.kiber-portal.ru/
https://www.kiber-portal.ru/robots/unitree-g1/
https://www.kiber-portal.ru/roboty-gumanoidy/
https://www.kiber-portal.ru/roboty-sobaki/
https://www.kiber-portal.ru/compilations/
https://www.kiber-portal.ru/articles/
https://www.kiber-portal.ru/news/
https://www.kiber-portal.ru/contacts/
```

Intentionally excluded:

- `/preview/*`
- `/404.html`
- redirect source URLs like `/test-blok/`
- `/lead/thanks/`
- legal draft pages while `noindex` until legal approval

## Actual source fixes found by smoke

The first route smoke found sitemap/canonical issues:

```text
placeholder public pages had no canonical
privacy/cookie noindex pages were mistakenly marked sitemap=true
```

Fixed by:

- adding default canonical URL generation in `src/layouts/BaseLayout.astro` from `Astro.site` + `Astro.url.pathname`;
- marking `/privacy-policy/` and `/cookie-policy/` as `available-not-sitemap` until legal approval.

## Validation

```text
node --import tsx --test tests/visual/route-sitemap-contract.test.ts — passed
npm run build:production — passed
npm run test:routes — passed
npm run ci — passed
```

Route smoke output:

```text
KIBER-43 route/sitemap smoke passed: 12 launch routes, 8 sitemap URLs, 2 redirects checked.
```

Full CI route count after build:

```text
13 page(s) built
```

## Safety

No production deploy, DNS, secrets, analytics provider IDs, real lead destination, legal/consent policy, shared containers, or host ports changed.
