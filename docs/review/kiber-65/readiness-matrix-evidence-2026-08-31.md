# KIBER-65 readiness matrix evidence

Date: 2026-08-31
Issue: KIBER-65 / KP-102
Scope: forms, analytics, robots, sitemap and redirects verification for PR #8 controlled rebuild.

## Summary

KIBER-65 now has a dedicated readiness matrix and CI smoke gate.

The checked areas are green for the controlled rebuild branch:

- forms / lead endpoint — green in preview-safe dry-run mode;
- analytics — green provider-neutral contract, real provider deferred;
- robots.txt — green source policy;
- sitemap — green launch route inventory alignment;
- redirects / 404 — green legacy test-route redirect + static 404 policy.

Production remains **NO-GO** because KIBER-65 depends on separate production/live approvals that are intentionally not changed here.

## Artifacts

- `data/review/kiber-65-readiness-matrix.json`
- `scripts/kiber-65-readiness-matrix-smoke.mjs`
- `tests/visual/kiber-65-readiness-matrix.test.ts`
- `docs/review/kiber-65/readiness-matrix-report.json`

## Underlying gates reused

- `tests/visual/api-leads-endpoint.test.ts`
- `scripts/lead-capability-contract-smoke.mjs`
- `scripts/analytics-event-contract-smoke.mjs`
- `scripts/route-sitemap-smoke.mjs`
- `tests/visual/http-404-redirects.test.ts`
- `scripts/production-go-no-go-smoke.mjs`

## Current verified state

- Forms:
  - `/api/leads` validates payloads.
  - Privacy consent is required.
  - Dry-run remains default.
  - No amoCRM/Telegram calls happen unless live mode is separately enabled.
  - `data/lead/capability-contract.json` keeps `routing.enabled=false` and `destinations=[]`.

- Analytics:
  - Provider-neutral events are registered.
  - Yandex Metrica is only deferred metadata.
  - Counter ID is `null`.
  - Analytics cookies are disabled.
  - Provider script injection is not enabled.

- Robots/indexability:
  - `public/robots.txt` allows production crawl and declares the production sitemap index.
  - Protected staging noindex is enforced separately through Basic Auth + Traefik header, not by changing production robots policy.

- Sitemap/routes:
  - Launch routes checked: `37`.
  - Robot routes checked: `24`.
  - Sitemap URLs checked: `31`.
  - Preview/review/404/thank-you/redirect-source routes are excluded from sitemap.

- Redirects/404:
  - `/test-blok/` and `/test-blok` redirect to `/` with 301.
  - Redirect sources are excluded from sitemap.
  - `dist/404.html` exists and static 404 remains noindex.

## Verification commands

```text
npm run build:production
node --import tsx --test tests/visual/kiber-65-readiness-matrix.test.ts
npm run test:kiber-65-readiness
npm run test:routes
npm run test:analytics-events
npm run test:lead-capability
npm run test:api-leads
npm run test:production-go-no-go
npm run ci
```

## Production blockers that remain separate

KIBER-65 does not execute or approve these items:

- KIBER-64 — allowed end-to-end test leads require approved live destinations.
- KIBER-67 — analytics provider IDs/cookies and consent activation require owner approval.
- KIBER-69 — real alert destinations require monitoring-channel approval.
- Explicit production deploy/DNS/secrets permission is still separate.

## Safety boundary

No production deploy, DNS/domain, production secrets, analytics provider IDs/cookies, live lead routing, real test leads, amoCRM/Telegram destinations, shared Docker cleanup, or non-`alex-*` containers were changed.
