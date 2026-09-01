# KIBER-94 robot_card preview-first real-data slice

## Scope

Preview-only integration of the reusable `robot_card` template with the existing 24 robot source-of-truth records from `src/content/robots.generated.json`.

## Preview route

- Pattern: `/preview/kiber-94/robot-card/[slug]/`
- Example: `/preview/kiber-94/robot-card/arenda-agibot-x2/`
- Generated only when `DEPLOY_ENV !== 'production'` and `DESIGN_REVIEW_ENABLED !== 'false'`.
- The route renders with `noindex` and is excluded from the production build.

## Owner approval scope

Alexander reviewed the protected preview and approved only the structure/data-mapping layer:

> Вроде бы все верно.

Recorded meaning:

- approved: `robot_card` block set and real source-of-truth data mapping look correct;
- not approved: final visual design;
- not approved: final/public text quality;
- not approved: replacing current public `/robots/[slug]/` pages;
- not approved: production deploy or any production-side effect.

## Safety boundaries

This slice does not change:

- production deploy;
- DNS;
- secrets;
- analytics provider activation;
- live lead routing;
- mass page generation;
- current public `/robots/[slug]/` routes.

## Verification run

```bash
node --import tsx --test tests/visual/kiber94-robot-card-preview.test.ts
npm run check
npm run build:preview
npm run test:kiber94-robot-card-preview
npm run build:production
npm run ci
```

Additional production guard:

```bash
if test -d dist/preview/kiber-94/robot-card; then echo 'preview route leaked into production build'; exit 1; else echo 'production build excludes KIBER-94 robot_card preview route'; fi
```

## Evidence

- `report.json` records 24 generated preview pages and safety flags.
