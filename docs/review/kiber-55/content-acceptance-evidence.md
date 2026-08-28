# KIBER-55 content acceptance evidence

## Summary

KIBER-55 adds a content acceptance framework for the 24 robot pages and public launch pages created by KIBER-45.

This PR deliberately separates:

- **structural acceptance** — validated automatically by CI;
- **final content/legal/media approval** — remains human-gated and is not claimed by this automated task.

## Scope

Implemented:

- Content acceptance registry:
  - `data/review/content-acceptance.json`
- Rendered content acceptance smoke:
  - `scripts/content-acceptance-smoke.mjs`
- Source-level contract test:
  - `tests/visual/content-acceptance-contract.test.ts`
- CI gate:
  - `npm run test:content-acceptance`
- Public copy cleanup on homepage:
  - removed visible draft phrases like “вертикальный срез”, “пилотная карточка”, “Пилотный робот”.

## Coverage

The registry covers:

- 24 robot detail pages;
- 7 non-robot public launch pages;
- 31 public routes total.

Acceptance statuses are explicit:

```json
[
  "accepted_structurally",
  "needs_copy_review",
  "needs_media_rights_review",
  "needs_price_review",
  "blocked_by_business_approval"
]
```

Final human approval is intentionally not claimed:

```json
{
  "finalApproved": 0,
  "humanReviewRequired": 31,
  "finalApprovalRequiresHumanOwner": true
}
```

## Rendered checks

`npm run test:content-acceptance` checks rendered production HTML for every covered route:

- no visible placeholder/draft phrases;
- no visible internal project phrases;
- exactly one H1;
- meta description exists;
- canonical exists;
- JSON-LD exists;
- robot hero alt exists;
- robot pricing disclaimer exists;
- no item can be marked `finalApprovalStatus: approved` without human evidence.

## Verification

RED first:

```text
node --import tsx --test tests/visual/content-acceptance-contract.test.ts
```

Initial failure confirmed missing:

- `data/review/content-acceptance.json`;
- `scripts/content-acceptance-smoke.mjs`;
- `npm run test:content-acceptance` CI gate.

Targeted GREEN:

```text
node --import tsx --test tests/visual/content-acceptance-contract.test.ts && npm run build:production && npm run test:content-acceptance
```

Passed:

```text
KIBER-55 content acceptance smoke passed: 31 public routes checked; 31 items remain human-review gated.
```

Full CI:

```text
npm run ci
```

Passed:

```text
Result (104 files):
- 0 errors
- 0 warnings
- 0 hints

1..51
# tests 51
# pass 51
# fail 0

KIBER-55 content acceptance smoke passed: 31 public routes checked; 31 items remain human-review gated.
KIBER-20 CI baseline smoke passed: 36 HTML pages link-checked, dist/404.html verified, 1379 tracked files secret-scanned.
```

## Human review required

KIBER-55 cannot be honestly closed as final content approval without human/business review of:

- robot copy and marketing claims;
- price semantics and disclaimer policy;
- media rights for meaningful assets;
- contacts/legal/business facts on launch pages;
- editorial acceptance for articles/news/compilations launch pages.

This PR makes that review explicit and CI-enforced instead of silently marking generated content as approved.

## Safety boundaries

Not done:

- No production deploy.
- No DNS changes.
- No production secrets/provider IDs.
- No CRM/Telegram/form routing changes.
- No final legal/marketing/media approval asserted.
