# Metrica/Webvisor privacy and release contract

Owner approved counter 112523930 and production release. Old counter 112081122 must not be deleted.

- Shared BaseLayout loads only the first-party adapter; provider requires production build, exact apex/www hostname, and consent v2.
- No provider on /lead/* or /api/*, including request and success pages. Preview must never send production visits.
- Consent v1 is invalidated; rejection, expiration and cross-tab revocation are fail-closed. Revocation destructs the SDK, clears queued init and first-party _ym_ cookies, and reloads to terminate listeners and late downloads. Historical server records are not automatically deleted.
- Counter-side Write all fields OFF, automatic goals OFF, ecommerce OFF, publisher OFF, tag manager OFF. Webvisor ON. Verified through counter settings readback before release.
- All form trees carry ym-hide-content in source. Before init and on inserted DOM, forms and editable fields are marked ym-hide-content/ym-disable-keys. Never introduce ym-record-keys/ym-show-content in a form. Every new form must follow this contract.
- No raw form values or automatic link tracking; URL/referrer query and fragment are stripped. Consequently UTM-specific attribution is not implemented by this first privacy-scoped adapter; do not claim end-to-end CRM attribution or custom goals.
- No unconditional noscript beacon.
- Banner loses only the obsolete disabled-counter sentence, with no added provider names. Details are in linked cookie policy.

## Checks
npm run verify; npm run build:production; npm run test:metrica-consent.
Default browser test stubs vendor responses and never sends visits. REAL_METRICA=1 is an owner-authorized real synthetic visit, not a fixture; do not run it in CI. CDP_URL optionally uses isolated context in server browser.
Before publication: real provider delivery and replay privacy review, full green CI, backup, preserve API/DNS and non-CSP .htaccess directives, bounded production smoke. No real lead submission.

## Production CSP gate
Production originally blocked mc.yandex.ru. The versioned infra/jino-production/production.htaccess changes only CSP allowlists. Browser simulation must use that exact header; an attempted script request is not delivery. Real mode requires HTTP-200 watch acknowledgement, provider forms=0, and Webvisor websocket/HTTP acknowledgement. Modern recorder uses wss://mc.yandex.ru/solid.ws; HTTP-only logs miss it. Keep form-action, frame-ancestors and routing restrictions. No unsafe-inline/eval script grants. Verify remote header and bound post-revoke websocket traffic.
