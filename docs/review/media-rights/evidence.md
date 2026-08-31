# KIBER media rights registry scaffold evidence

## Scope

- Branch: `hermes/media-rights-registry-scaffold-20260828`
- Base: `codex/kiber-15-controlled-rebuild` at `9af0cfc9897da0d59da87686061aa247c4dc3da1`
- Safe task selected while owner is offline: media rights registry scaffold.
- Production-impacting actions excluded: no deploy, no DNS, no production secrets, no analytics provider IDs/cookies, no live lead routing.

## Implemented

- Added `data/review/media-rights-registry.json` covering all 24 generated robot records from `src/content/robots.generated.json`.
- Tracked every robot hero asset path and alt text, plus gallery asset paths/alt text, as review metadata.
- Kept every record production-gated:
  - `rightsStatus: "needs_rights_review"`
  - `productionApproved: false`
  - `reviewFlags` include `needs_media_rights_review` and `blocked_for_production_until_human_approval`
- Added `scripts/media-rights-registry-smoke.mjs` and wired it into `npm run ci` as `npm run test:media-rights`.
- Added `tests/visual/media-rights-registry-contract.test.ts` to protect registry coverage and CI wiring.

## TDD / validation evidence

RED:

```text
npm run test:visual -- tests/visual/media-rights-registry-contract.test.ts
# fail: media rights registry is required
# fail: media rights smoke script is required
```

GREEN:

```text
npm run test:visual -- tests/visual/media-rights-registry-contract.test.ts
# tests 60; pass 60; fail 0

npm run test:media-rights
# KIBER media rights registry smoke passed: 24 robot media records remain human-rights gated for production.
```

Generated smoke report: `docs/review/media-rights/media-rights-registry-report.json`.

## Human blockers intentionally preserved

- Media/legal rights approval is still required before claiming production media approval.
- Contacts remain placeholders.
- Lead channels/routing remain capability-only with no live destinations.
- KIBER-55 structural approval was not converted into final business/legal/media approval.


## KIBER-47 closure update — 2026-08-31

KIBER-47 / KP-068 is now tied directly to the media-rights registry and review package. The package records rights status, robot/context, meaningful asset role, source path and alt source for the 24 launch robot media records.

Current closure evidence:

- `data/review/media-rights-registry.json` — issue marker `KIBER-47`, 24/24 robot media records `approved_for_production`.
- `data/review/media-rights-review-package.json` — issue marker `KIBER-47`, 191 approved assets including 24 legacy horizontal hero images.
- `data/review/media-rights-legacy-hero-images.json` — legacy hero coverage tied to `KIBER-47`.
- `docs/review/media-rights/review-package.md` — human-readable table of robot/context/role/source/alt/status.
- `scripts/media-rights-registry-smoke.mjs` and `scripts/media-rights-review-package-smoke.mjs` enforce registry/package consistency in CI.

This closes the media-rights/role criterion only. It does not approve production deploy, DNS/domain, production secrets, analytics provider IDs/cookies, or live lead routing.
