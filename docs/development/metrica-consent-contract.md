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
Before publication: real provider delivery and replay privacy review, full green CI, backup, preserve .htaccess/API/DNS, bounded production smoke. No real lead submission.
