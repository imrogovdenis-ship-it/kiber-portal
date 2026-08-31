# KIBER-79 internal-link proposals evidence

## Summary

Adds deterministic internal-link proposals as review-only data. The implementation does **not** auto-publish generated links into public UI or production HTML.

## Implemented scope

- Added `data/seo/internal-link-proposals.json`.
- Proposal statuses:
  - `generated_needs_review`
  - `approved`
  - `rejected`
  - `disabled`
- `autoPublish: false` is enforced in the registry.
- All initial proposals are `generated_needs_review` and `publicRender: false`.
- Proposal inputs are documented:
  - `data/seo/launch-routes.json`
  - `data/seo/semantic-core.json`
- Added `scripts/internal-link-proposals-smoke.mjs`.
- Added `npm run test:internal-links` and included it in `npm run ci` after production build.
- Added contract test `tests/visual/internal-link-proposals-contract.test.ts`.

## Initial proposals

7 review-only proposals were generated:

- `/` → `/robots/unitree-g1/`
- `/robots/unitree-g1/` → `/lead/request/`
- `/roboty-gumanoidy/` → `/robots/unitree-g1/`
- `/` → `/roboty-gumanoidy/`
- `/` → `/roboty-sobaki/`
- `/articles/` → `/compilations/`
- `/news/` → `/articles/`

All remain human-review only.

## RED verification

The initial contract failed as expected:

```text
node --import tsx --test tests/visual/internal-link-proposals-contract.test.ts — failed
```

because the registry and smoke script did not exist.

## GREEN verification

Targeted validation:

```text
node --import tsx --test tests/visual/internal-link-proposals-contract.test.ts && npm run build:production && npm run test:internal-links — passed
```

Full CI:

```text
npm run ci — passed
```

Key outputs:

```text
Result (93 files): 0 errors, 0 warnings, 0 hints
KIBER-79 internal-link proposal smoke passed: 7 proposals checked; generated links stayed review-only across 13 HTML files.
KIBER-20 CI baseline smoke passed: 13 HTML pages link-checked, dist/404.html verified, 1330 tracked files secret-scanned.
```

Generated report:

```json
{
  "issue": "KIBER-79",
  "proposalCount": 7,
  "statusCounts": {
    "generated_needs_review": 7,
    "approved": 0,
    "rejected": 0,
    "disabled": 0
  },
  "htmlFilesChecked": 13,
  "autoPublish": false,
  "result": "passed"
}
```

## Safety boundaries

- No production deploy.
- No DNS changes.
- No secrets.
- No forms/CRM/Telegram routing changes.
- No automatic publication of AI-generated links.
- Human review remains required before any proposal can become public.
