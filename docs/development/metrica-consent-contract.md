# Basic Metrica / optional Webvisor contract — v3 candidate

Owner requested the split model, using try-vr.ru only as an architectural reference. This branch is not production activation or a legal certification.

- Counter 112523930; no new counter and no deletion of 112081122.
- BaseLayout loads analytics-provider-v3.js. Cookie controller cookie-consent-v3.js emits the initial state during page load without waiting for a click. Basic mode starts at that event; only production apex/www hosts. /lead/* and /api/* remain excluded.
- v3 accepted at page load enables webvisor/clickmap; absent/rejected/old v2 state keeps both false. A new acceptance takes effect on the next page, avoiding reinit/double pageview.
- Withdrawal from recording: destruct or discard queued init, erase only _ym_visorc, reload into basic mode. _ym_uid is retained. Short-lived same-path sessionStorage marker sets defer:true on this automatic reload; it is consumed once. If sessionStorage is blocked, reload still stops recording; duplicate-hit suppression is best effort in that degraded case.
- Old v2 assets are retained for cached old HTML. Do not reuse an old script URL for a new consent contract.
- Preserve ym-hide-content form trees, editable-field protections and counter-side field recording OFF. No ClientID in forms. Do not add marketing tracking or CRM attribution in this change.
- No raw query/hash/referrer query in adapter, no automatic link tracking, ecommerce:false and disableYtm:true. Existing neutral robot-card event bus remains optional.
- Banner buttons/design unchanged; text discloses base collection regardless of choice and links to policy. Policies describe operator-selected legitimate interest, not anonymity or implied consent. Form consent remains separate.

## Verification
npm run verify; npm run build:production; npm run test:metrica-consent.
Default split browser test uses stubs and exact production CSP. REAL_METRICA=1 is an explicit synthetic QA visit and must not be used in CI. Verify real acknowledged pageviews, recorder init flags, no duplicate on accept/revoke, old consent invalidation, masking and rejected-state transition. A WebSocket alone is not evidence of recording (basic mode uses it too).

## Publication gate
Separate owner publication approval remains required. Record actual recipients/retention and assess the legitimate-interest basis with legal support; do not declare it proven merely because another site uses it. No DNS/API/CSP modifications in this candidate.
