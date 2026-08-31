# KIBER-34 visual regression smoke evidence

## Summary

Adds a CI-safe visual regression smoke gate around the KIBER-35 approved reference screenshots.

The gate does not attempt to make visual approval decisions automatically. Instead, it protects the approved baseline by verifying that every key template reference PNG still matches its approved SHA-256. If any reference screenshot changes, CI fails until a human-approved baseline update is committed.

## Baseline

Approved baseline manifest:

```text
docs/review/kiber-35/approved-visual-baseline.json
```

Covered routes:

- `/`
- `/robots/unitree-g1/`
- `/lead/request/?robot=unitree-g1`
- `/lead/thanks/?robot=unitree-g1`
- `/404.html`

Covered viewports:

- desktop 1440
- mobile 375

Total approved references:

```text
10 PNGs
```

## CI gate

New npm script:

```text
npm run test:visual-regression
```

CI now includes the visual regression smoke in `npm run ci` and as an explicit workflow step.

## Validation

```text
node --import tsx --test tests/visual/visual-regression-smoke-contract.test.ts — passed
npm run test:visual-regression — passed
npm run ci — passed
```

Actual smoke output:

```text
KIBER-34 visual regression smoke passed: 10 approved references verified.
```

## Safety

No production deploy, DNS, secrets, analytics provider IDs, real lead destination, or legal/consent policy changed.
