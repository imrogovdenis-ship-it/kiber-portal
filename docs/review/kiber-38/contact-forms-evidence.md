# KIBER-38 contact forms evidence

## User-approved form structure

The lead/contact page must contain two separate sections/forms:

1. **Написать нам**
   - Messenger-only contact section.
   - Buttons: Max, Telegram, WhatsApp.
   - Does not collect personal data.

2. **Запросить обратный звонок**
   - Callback request form.
   - Required: name, phone.
   - Optional: email.
   - Required checkbox acknowledging privacy policy and personal-data processing rules.
   - Submission is feature-gated until real routing is configured.

## Implemented safe scope

- Reworked `src/pages/lead/request.astro` into two separate public sections.
- Added `PUBLIC_MAX_URL`, `PUBLIC_LEAD_FORM_ENABLED`, and `PUBLIC_LEAD_FORM_ENDPOINT` env contract.
- Added `siteConfig.max`, `siteConfig.leadFormEnabled`, and `siteConfig.leadFormEndpoint`.
- Added KIBER-38 regression tests in `tests/visual/contact-forms-contract.test.ts`.
- Updated older KIBER-33/KIBER-36 contracts to match the new callback-form behavior.
- Kept callback submit disabled by default.
- Did not add amoCRM credentials, Telegram bot token, production lead routing, DNS, or production deploy.

## Verification

Targeted tests:

```text
node --import tsx --test tests/visual/public-copy.test.ts tests/visual/contact-forms-contract.test.ts tests/visual/accessibility-states.test.ts tests/visual/vertical-slice.test.ts — passed
```

Full CI:

```text
npm run ci — passed
```

Relevant CI outputs:

```text
Result (88 files): 0 errors, 0 warnings, 0 hints
KIBER-34 visual regression smoke passed: 10 approved references verified.
KIBER-39 performance budget smoke passed: 4 routes checked against LCP/INP/CLS static proxies.
KIBER-43 route/sitemap smoke passed: 12 launch routes, 8 sitemap URLs, 2 redirects checked.
KIBER-71 analytics event contract smoke passed: 88 DOM events checked against 8 provider-neutral events.
KIBER-20 CI baseline smoke passed: 13 HTML pages link-checked, dist/404.html verified, 1321 tracked files secret-scanned.
```

## Local visual verification

Built static preview served locally at:

```text
http://127.0.0.1:4178/lead/request/
```

Browser snapshot verified:

- Region `Написать нам` includes links `Max`, `Telegram`, `WhatsApp`.
- Region `Запросить обратный звонок` includes fields `Имя`, `Телефон`, optional `Email`.
- Required checkbox text references `Политикой конфиденциальности` and `обработки персональных данных`.
- Submit button is disabled while routing is not enabled.

## Still required before enabling real routing

- Approved public Max URL.
- Approved public Telegram URL.
- Approved public WhatsApp URL.
- Final privacy/personal-data policy URLs/text.
- amoCRM credentials through secret store/op:// references, not chat.
- Telegram bot token and target chat id through secret store/op:// references, not chat.
- Backend hosting decision for callback form handler.
