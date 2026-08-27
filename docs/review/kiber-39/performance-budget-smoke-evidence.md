# KIBER-39 performance budget smoke evidence

## Summary

Adds a deterministic CI performance budget smoke for the controlled rebuild's key templates.

The Linear acceptance target is the Core Web Vitals envelope:

```text
LCP <= 2.5s
INP <= 200ms
CLS <= 0.1
```

Because production RUM/Lighthouse on an agreed device/network profile is not available in this autonomous branch scope, this PR does **not** claim final field CWV measurement. It enforces stable static proxies in CI so the branch cannot regress into heavy pages, JS-driven interaction risk, or obvious CLS image issues before production approval.

## CI gate

New npm script:

```text
npm run test:performance
```

`npm run ci` now runs:

```text
npm run verify && npm run test:visual-regression && npm run build:production && npm run test:performance && npm run ci:baseline
```

## Static budgets

Source of truth:

```text
docs/review/kiber-39/performance-budget.json
```

Budgets:

```text
HTML <= 100000 bytes per route
CSS <= 140000 bytes per route
JS <= 25000 bytes per route
Images <= 120000 bytes per route
Total page bytes <= 250000 per route
```

Key templates checked:

- `/`
- `/robots/unitree-g1/`
- `/lead/request/`
- `/lead/thanks/`

## Results from local production build

```text
/                  total=27351 bytes, JS=0
/robots/unitree-g1/ total=25401 bytes, JS=0, images=585
/lead/request/     total=19940 bytes, JS=0
/lead/thanks/      total=16840 bytes, JS=0
```

Generated report:

```text
docs/review/kiber-39/performance-budget-report.json
```

## Actual source fix found by smoke

The first performance smoke run failed on a CLS proxy:

```text
/robots/unitree-g1/: layout-shift image risks: /assets/placeholders/robot-card.svg missing width/height
```

Fixed by adding explicit dimensions to:

- `src/components/blocks/RobotCard.astro`
- `src/pages/robots/[slug].astro`

## Validation

```text
node --import tsx --test tests/visual/performance-budget-smoke-contract.test.ts — passed
npm run build:production — passed
npm run test:performance — passed
npm run ci — passed
```

`npm run test:performance` output:

```text
KIBER-39 performance budget smoke passed: 4 routes checked against LCP/INP/CLS static proxies.
```

`npm run ci:baseline` after this change:

```text
KIBER-20 CI baseline smoke passed: 13 HTML pages link-checked, dist/404.html verified, 1305 tracked files secret-scanned.
```

## Safety

No production deploy, DNS, secrets, analytics provider IDs, real lead destination, legal/consent policy, shared containers, or host ports changed.
