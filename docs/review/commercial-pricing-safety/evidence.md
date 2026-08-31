# Commercial pricing safety pass

Task: safe non-blocked controlled rebuild pass for commercial pricing/legal-disclaimer behavior.

Branch: `hermes/kiber-commercial-pricing-safety-20260828`
Base: `codex/kiber-15-controlled-rebuild`

## Scope

- Kept prices as capability/copy only; no production deployment or lead routing changes.
- Preserved the approved disclaimer text: `Не является публичной офертой`.
- Added a design-system contract rule that the legal disclaimer remains programmatically attached to every tariff card.
- Updated `Pricing.astro` so each tariff card references the shared disclaimer with `aria-describedby`.

## TDD record

RED:

```text
node --import tsx --test tests/visual/commercial-pricing-safety-contract.test.ts
# fail: pricing contract lacked tariff-card disclaimer rule
# fail: Pricing.astro lacked robot-pricing-disclaimer id and aria-describedby
```

GREEN:

```text
node --import tsx --test tests/visual/commercial-pricing-safety-contract.test.ts
# pass: 2/2
```

## Safety notes

This PR does not:

- publish real contacts;
- enable live lead destinations;
- enable analytics provider IDs/cookies;
- deploy production, change DNS, or touch secrets/containers.

## Validation

```text
node --import tsx --test tests/visual/commercial-pricing-safety-contract.test.ts
# pass: 2/2

npm run ci
# pass: verify, visual regression, production build, performance/routes/SEO/content/readiness gates and ci:baseline
```
