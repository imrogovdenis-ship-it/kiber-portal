# Contact lead form popup — intake and implementation

## What was recalled

- amoCRM sender was already manually tested against `portalrent.amocrm.ru/api/v4/leads/unsorted/forms`.
- The real amoCRM account rejects `metadata.utm_*`; UTM must go through configured lead custom field IDs only.
- Telegram duplicate was manually tested into the dedicated chat `Заявки с сайта КИБЕР ПОРТАЛ`.
- Alexander confirmed the test lead arrived in amoCRM and Telegram.
- Secrets remain in env/1Password only and were not printed or committed.

## Implemented form UI

A global lead form popup now opens from `Оставить заявку` CTAs.

Fields:

- `Имя` — required.
- `Телефон` — required.
- `Почта` — optional.

Consent:

- required checkbox;
- links to `/consent/`, `/privacy-policy/`, `/terms/`.

Form action:

- `POST /api/leads`.

## Runtime boundary

The source `/api/leads` handler already supports dry-run/live modes and amoCRM + Telegram duplicate. Current staging container is still static nginx review runtime: it displays the form and source wiring, but real live delivery requires dynamic/API runtime and secret env injection. No live routing was activated in this step.

## Verification

- `node --import tsx --test tests/visual/contact-lead-form-popup.test.ts` — pass.
- `node --import tsx --test tests/visual/api-leads-endpoint.test.ts` — 18/18 pass.
- `npm run test:contact-lead-visual` — pass.
- `npm run test:lead-capability` — pass.
- `npm run build:preview` — pass.
- staging homepage and lead page — HTTP 200 + `X-Robots-Tag: noindex, nofollow`.

## Evidence

- `lead-form-popup-desktop.png`
- `lead-form-popup-mobile.png`
- `visual-evidence.json`
