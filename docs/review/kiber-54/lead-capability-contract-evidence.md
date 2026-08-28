# KIBER-54 lead capability contract evidence

## Scope

Adds a destination-free lead capability contract for the controlled rebuild. This records the current owner-approved posture: lead handling is capability-only, production contacts remain placeholders, live routing is disabled, and analytics provider IDs remain disabled until separate owner approval.

## Files

- `data/lead/capability-contract.json` — machine-readable contract.
- `scripts/lead-capability-contract-smoke.mjs` — CI smoke gate that verifies the contract and static lead/contacts pages.
- `tests/visual/lead-capability-contract.test.ts` — TDD coverage for the contract and CI integration.
- `docs/review/kiber-91/lead-capability-contract-report.json` — generated smoke report.

## Validation

RED:

```text
node --import tsx --test tests/visual/lead-capability-contract.test.ts
not ok 1 - KIBER lead capability contract keeps routing disabled and destination-free
error: lead capability contract is required
```

GREEN:

```text
node --import tsx --test tests/visual/lead-capability-contract.test.ts && npm run test:lead-capability
# pass 2
KIBER-54 lead capability contract smoke passed: routing remains capability-only with zero live destinations.
```

Generated report:

```json
{
  "issue": "KIBER-54",
  "routingMode": "capability-only",
  "routingEnabled": false,
  "destinationsCount": 0,
  "status": "passed",
  "failures": []
}
```

## Hashes

```text
78c00d45f6bca13c43654cb6b3fbb72a0686819388486e6430e01834e875d164  data/lead/capability-contract.json
19b9e09e4253fdcd5fb08d8696f412160d3db760e28ac85fd3fb298b67492bff  scripts/lead-capability-contract-smoke.mjs
f742460a1665e8eacfe078d6620a29574f66f4cb41464429f1e57982194da55e  tests/visual/lead-capability-contract.test.ts
a318eb638c534acb7a605008184a237c7838fbbacda41adf0a42235e610d7397  docs/review/kiber-54/lead-capability-contract-report.json
```

## Explicit non-goals

- No production deploy.
- No DNS change.
- No production secrets touched.
- No analytics provider IDs or cookies enabled.
- No live lead destination, webhook, CRM, email, Telegram, WhatsApp, or other routing endpoint added.
