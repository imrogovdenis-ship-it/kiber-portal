# KIBER production approval gates evidence

## Scope

- Branch: `hermes/kiber-approval-gate-registry-20260828`
- Base: `codex/kiber-15-controlled-rebuild`
- Safe autonomous task while Александр is offline: add a production approval gate registry and CI smoke guard.
- Production-impacting actions excluded: no deploy, no DNS, no production secrets, no analytics provider IDs/cookies, no live lead routing, no shared Coolify/Traefik/Hermes/ai-class container changes.

## What changed

- Added `data/review/production-approval-gates.json` as a single registry of the seven approval boundaries that must remain explicit:
  - visual direction;
  - final business/legal content;
  - media rights;
  - real public contacts;
  - live lead routing;
  - analytics provider IDs/cookies;
  - production deploy/DNS/secrets/shared infrastructure.
- Added `scripts/production-approval-gates-smoke.mjs` to cross-check the registry against:
  - `data/review/owner-decisions-2026-08-28.json`;
  - `data/review/launch-readiness-crawl.json`;
  - `data/review/content-package-workflow.json`;
  - `data/seo/production-readiness-matrix.json`.
- Added `tests/visual/production-approval-gates-contract.test.ts` and wired `npm run test:production-approval-gates` into `npm run ci`.
- Generated smoke report: `docs/review/production-approval-gates/report.json`.

## TDD trace

RED:

```text
npm run test:visual -- tests/visual/production-approval-gates-contract.test.ts
# fail: production approval gates registry is required
# fail: production approval gates smoke is required
```

GREEN:

```text
npm run test:visual -- tests/visual/production-approval-gates-contract.test.ts
# tests 68; pass 68; fail 0

npm run test:production-approval-gates
# KIBER production approval gates smoke passed: 7 gates remain explicitly human-gated before production.
```

## Human blockers preserved

This PR does not convert any previous owner decision into production permission. Remaining human-gated blockers are still:

- visual approval for pending visual PRs where applicable;
- final business/legal/content approval beyond KIBER-55 structural approval;
- media rights/legal approval for production assets;
- real public contacts;
- live lead destinations/routing;
- analytics provider decision and IDs/cookies;
- explicit production deploy/DNS/secrets/shared infrastructure permission.
