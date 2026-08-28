# Contact and lead visual pass 2 evidence

## Summary

This pass moves `/contacts/` and `/lead/request/` closer to the active reference visual layer without pasting raw reference HTML into Astro runtime.

Implemented:

- `/contacts/` now uses a styled conversion hero, three quick-action cards, and a capability notice.
- `/lead/request/` now uses a two-column reference-style panel with form and capability sidebar.
- Review markers are explicit: `data-rv="30"` and `data-rv="31"`.
- Lead routing remains capability-only and disabled.
- No live Telegram/WhatsApp/CRM/email destinations were added.

## Verification

RED first:

```text
node --import tsx --test tests/visual/contact-lead-visual-pass2.test.ts
```

Initial failure confirmed missing registry, route markers, panel layout, smoke script, and CI wiring.

Targeted GREEN:

```text
node --import tsx --test tests/visual/contact-lead-visual-pass2.test.ts && npm run build:production && npm run test:contact-lead-visual
```

Full CI:

```text
npm run ci
```

Passed after fixing the analytics contract on the new contact CTAs:

```text
KIBER contact/lead visual pass 2 smoke passed: /contacts/ and /lead/request/ checked with lead routing disabled.
KIBER-20 CI baseline smoke passed: 37 HTML pages link-checked, dist/404.html verified, 1466 tracked files secret-scanned.
```

## Screenshots

Captured from local built `dist` at `http://127.0.0.1:4331`:

- `screenshots/contacts-desktop-1440.png`
- `screenshots/contacts-mobile-390.png`
- `screenshots/lead-request-desktop-1440.png`
- `screenshots/lead-request-mobile-390.png`
- `screenshots/contact-sheet.png`
- `screenshots/manifest.json`

Screenshot capture reported:

```json
{
  "screenshots": 4,
  "overflows": 0
}
```

## Safety boundaries

Not done:

- No production deploy.
- No DNS changes.
- No secrets changed.
- No live lead routing enabled.
- No real public contact channels introduced by this pass.
- No production analytics provider IDs/cookies added.

## Still needs owner approval

- Final visual approval for contact/lead pass 2.
- Real public contacts.
- Live lead routing destinations and backend implementation.
