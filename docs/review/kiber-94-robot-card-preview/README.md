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

## Design pass scope

After structure/data mapping approval, the preview received a selling + SEO/AI structure pass for owner review:

- the short block immediately after Hero is now a visible `aiSummary`, so humans, search crawlers and AI agents can extract the model/service/scenario/price-status summary early;
- the first gallery is restored as a visible robot appearance/proof block directly after intro/AI summary;
- the page adds structured facts, included-service and order-flow blocks so the commercial conditions are clear before the lower CTA;
- the preview still imports and reuses existing blocks instead of re-drawing them locally: `HomeFinalCta`, `HomeGoshaQuote`, `RobotCard`, `HomeFaqBlock`, and `HomeImageCards`;
- Kiber Gosha is treated as a mandatory mascot/brand-voice layer, not decoration: `HomeGoshaQuote` remains required for robot_card and the new contract extends that rule to future page types;
- the robot catalog section uses the same `RobotCard` component/pattern as the approved homepage catalog;
- the FAQ section uses `HomeFaqBlock` with robot-specific questions and the preview route emits `FAQPage` JSON-LD;
- the article section uses `HomeImageCards` with `homeArticles` data from the approved homepage/blog block;
- the page now links to related `Подборки` using `HomeImageCards` + `homeCompilations`;
- the preview route emits `Service`, `BreadcrumbList` and `FAQPage` JSON-LD;
- missing legacy gallery assets are not rendered as broken images; media debt is recorded as a warning until approved gallery assets are imported;
- this is still a preview-only design/structure pass, not approval to replace public robot routes.

## Structure contract

The current draft structure is versioned in `robot-card-structure-contract.md`. It is the source for the later Claude/agent skill rewrite after owner approval.

## Evidence

- `report.json` records 24 generated preview pages, safety flags, owner approval scope and design-pass scope.
- Local browser inspection verified the Agibot X2 preview first viewport and full-page rhythm after the preview build.

## Design pass scope

After owner feedback on the first structural pass, the preview now follows the approved-draft order:

1. Header
2. Breadcrumbs
3. Hero with left-side title/copy/buttons and right-side square robot image when only catalog media is available
4. One short visible `aiSummary` block — no duplicate short intro + AI summary pair
5. First visible gallery
6. Long text block
7. Key capabilities
8. Use scenarios
9. Robot in action media
10. Kiber Gosha quote/brand voice
11. CTA #1
12. Included service
13. Facts for choosing
14. Order flow
15. FAQ
16. CTA #2 / “Остались вопросы?”
17. Blog Kiber Gosha
18. Related robot catalog

Owner feedback applied:

- visible `Подборки` block removed from `robot_card`;
- Gosha quote moved between `robotInAction` and CTA #1;
- Gosha remains mandatory as mascot/brand voice, not decorative filler;
- CTA with Gosha/`HomeFinalCta` moved after FAQ as CTA #2;
- articles moved before related catalog;
- catalog moved to the end;
- `Service`, `BreadcrumbList`, and `FAQPage` JSON-LD stay present;
- public `/robots/[slug]/`, production, DNS, secrets, analytics and live lead routing remain untouched.

Known non-blocking media debt: current runtime still has only one local gallery image per robot. The page renders the available real image visibly, but approved gallery assets should be imported before public rollout.
