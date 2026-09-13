# Three-mode analytics verification and release boundary

Owner scope: OWNER_SCOPE.md. Shared banner/controller and one reusable policy settings component; no per-page implementation copies.

## Reproducible gates
- `npm run verify` — Astro checks, source/unit tests and visual source contract.
- `npm run build:preview` — tracking disabled, noindex build.
- `npm run test:cookie-consent` — Chromium at 320/360/390/430/768/1440, no overflow, equal consent actions, policy-only settings and persistence.
- `npm run test:metrica-consent` — real Chromium with local site bytes and an explicitly stubbed SDK; all external requests intercepted. Includes off/basic/extended, expiry/migration, masked fields, two-tab refusal, unsaved draft visibility sync, pending SDK shutdown, and combined failed-write/destruct recovery.

The harness does NOT prove receipt/storage/replay at Yandex. No live analytics account changes or real lead submissions are part of this preview. Production promotion and any live-provider acceptance test require separate approval.

## Privacy recovery
A failed preference write stops the SDK and sets a best-effort session denial. If SDK teardown also throws, a reload is allowed only after that session denial is read back. If neither stop nor safe reload is possible, the UI explicitly says shutdown is unconfirmed and asks the visitor to close the tab; it must not claim successful shutdown.

## Cached versions
Versioned v4 URLs isolate new HTML from old controller semantics. The delivered v3 adapter now respects explicit saved v4 off. Already-open/cached OLD bytes cannot be remotely replaced; refresh/cache migration is a production release check, not a guarantee supplied by this preview.

## Unrelated built-preview assertion
The existing Batch 3 test expected `Что умеет робот-художник A4` while the current shared public template renders `Что умеет робот-художник`. The capability and scenario heading assertions are corrected to the exact current headings; no robot source data, template copy or accepted visuals change.
