# KIBER-50 review notes isolation evidence

## Summary

KIBER-50 separates review/internal notes from public production-rendered content and adds a CI guard proving review-only data stays out of `dist` HTML.

## Implemented scope

- Added `reviewOnlySchema` in `src/content/schemas.ts`.
- Added optional `review` block to robot and publication content schemas.
- Review blocks are explicit non-public data:
  - `publicRender: false`
  - `owner`
  - `lastReviewedAt`
  - `internalNotes[]`
- Added a review-only sentinel note to `src/content/robots/unitree-g1.yaml`:
  - `KIBER-50-REVIEW-ONLY-SENTINEL`
- Added `scripts/review-notes-isolation-smoke.mjs` to scan production `dist/**/*.html` and fail if review-only markers leak.
- Added `npm run test:review-notes`.
- Included `npm run test:review-notes` in `npm run ci` after production build.
- Added contract test `tests/visual/review-notes-isolation-contract.test.ts`.

## RED verification

The first contract run failed as expected because:

- `reviewOnlySchema` was absent;
- `review` source block was absent;
- smoke script and CI gate were absent.

Command:

```text
node --import tsx --test tests/visual/review-notes-isolation-contract.test.ts — failed
```

## GREEN verification

Targeted validation:

```text
node --import tsx --test tests/visual/review-notes-isolation-contract.test.ts && npm run build:production && npm run test:review-notes — passed
```

Full CI:

```text
npm run ci — passed
```

Key outputs:

```text
Result (91 files): 0 errors, 0 warnings, 0 hints
KIBER-50 review-notes isolation smoke passed: 13 HTML files checked; review-only sentinel stayed out of production render.
KIBER-20 CI baseline smoke passed: 13 HTML pages link-checked, dist/404.html verified, 1326 tracked files secret-scanned.
```

Generated report:

```json
{
  "issue": "KIBER-50",
  "htmlFilesChecked": 13,
  "forbiddenPublicMarkers": [
    "KIBER-50-REVIEW-ONLY-SENTINEL",
    "internalNotes",
    "publicRender",
    "review-only fields"
  ],
  "sourceFixture": "src/content/robots/unitree-g1.yaml",
  "result": "passed"
}
```

## Safety boundaries

- No production deploy.
- No DNS changes.
- No secrets.
- No CRM/Telegram/forms routing.
- No public content approval claims.
