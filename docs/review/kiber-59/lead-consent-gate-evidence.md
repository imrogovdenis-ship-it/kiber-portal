# KIBER-59 — lead consent gate evidence

Date: 2026-08-30

## Scope

Autonomous non-design pass while footer/design review is postponed.

Implemented a preview-safe lead consent gate for the scaffolded `/lead/request/` form and `/api/leads` handler.

## Changes

- `/lead/request/` keeps lead routing feature-flagged with `PUBLIC_LEAD_FORM_ENABLED`.
- When the preview form is enabled, it includes an explicit required `privacy_consent` checkbox.
- The checkbox links to the approved legal routes:
  - `/privacy-policy/`
  - `/consent/`
- `/api/leads` now rejects non-honeypot submissions with name/contact but without explicit privacy consent.
- Existing validation/origin/honeypot/rate-limit/idempotency/logging/dry-run/live-mode safety checks are preserved.
- Lead routing remains capability-only by default; no live destinations, production secrets, DNS, analytics provider IDs, or production deploy changed.

## Verification

Passed locally:

```bash
node --import tsx --test tests/visual/public-copy.test.ts tests/visual/api-leads-endpoint.test.ts tests/visual/contact-lead-visual-pass2.test.ts tests/visual/vertical-slice.test.ts
npm run test:lead-capability
npm run ci
npm run build:preview
```

Observed results:

- focused tests: 26/26 passed
- `test:lead-capability`: passed, routing remains capability-only with zero live destinations
- `npm run ci`: passed, 148/148 visual source tests and all smoke gates passed
- `npm run build:preview`: passed, 39 preview pages built

## Safety boundary

This does not enable live lead routing. It only tightens consent validation and prepares the feature-flagged preview form contract.
