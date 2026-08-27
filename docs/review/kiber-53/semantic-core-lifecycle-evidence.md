# KIBER-53 semantic-core lifecycle evidence

## Summary

Adds a semantic-core lifecycle registry for launch query clusters without changing public content, lead routing, production settings, analytics providers, DNS, or secrets.

## Implemented scope

- Added `data/seo/semantic-core.json`.
- Added lifecycle statuses:
  - `active`
  - `deprecated`
  - `experimental`
- Added required verification metadata:
  - `verifiedAt: 2026-08-27`
  - `verificationRegion: RU`
- Added launch clusters for:
  - robot rental commercial home intent;
  - humanoid robots category;
  - robot dogs category;
  - Unitree G1 model intent;
  - scenario подборки as experimental;
  - Kiber Gosha blog as experimental;
  - legacy implementation/search terms as deprecated.
- Added smoke script `scripts/semantic-core-lifecycle-smoke.mjs`.
- Added CI script `npm run test:semantic-core`.
- Added KIBER-53 contract test `tests/visual/semantic-core-lifecycle-contract.test.ts`.

## Safety boundaries

- No production deployment.
- No DNS changes.
- No secrets.
- No forms/CRM/Telegram routing.
- No analytics provider IDs.
- No automatic publication of AI-generated internal links.
- The registry is a review/contract source, not a link autopublisher.

## Verification

RED was verified first:

```text
node --import tsx --test tests/visual/semantic-core-lifecycle-contract.test.ts — failed because registry and smoke script were missing
```

Targeted GREEN:

```text
node --import tsx --test tests/visual/semantic-core-lifecycle-contract.test.ts && npm run test:semantic-core — passed
```

Full CI:

```text
npm run ci — passed
```

Key outputs:

```text
Result (89 files): 0 errors, 0 warnings, 0 hints
KIBER-53 semantic-core lifecycle smoke passed: 7 clusters, 3 lifecycle states, region RU.
KIBER-20 CI baseline smoke passed: 13 HTML pages link-checked, dist/404.html verified, 1321 tracked files secret-scanned.
```

Generated report:

```json
{
  "issue": "KIBER-53",
  "verifiedAt": "2026-08-27",
  "verificationRegion": "RU",
  "entries": 7,
  "lifecycleCounts": {
    "active": 4,
    "deprecated": 1,
    "experimental": 2
  },
  "intentCounts": {
    "commercial": 2,
    "category": 2,
    "scenario": 1,
    "informational": 1,
    "brand": 1
  }
}
```
