# Contact messenger popup — “Написать нам”

Implemented a public messenger chooser popup for the “Написать нам” CTA.

## Scope

Popup “Написать нам” public messenger chooser, no live backend routing.

## Visual requirements implemented

- Small label top-left: `Связаться с нами`.
- Close button top-right: `Закрыть`.
- Large title: `Напишите нам в любом удобном мессенджере`.
- Gosha image reused from CTA2: `/images/kiber-94-preview/gosha-ushanka-cta2-compact.avif`.
- Three large messenger buttons stacked vertically: MAX, WhatsApp, Telegram.

## Public links

- Telegram: by phone `+79067309691`.
- WhatsApp: by phone `+79067309691`.
- MAX: `https://max.ru/u/f9LHodD0cOJhJ-X4IZgcN132WZOzWIuvqM8KhYmQShyPoEZQ-C84DJgI4M0`.

## Evidence

- `popup-desktop.png`
- `popup-mobile.png`
- `visual-evidence.json`

## Verification

- `node --import tsx --test tests/visual/contact-messenger-popup.test.ts`
- `npm run test -- tests/visual/public-contacts-owner-input.test.ts`
- `npm run build:preview`
- `npm run test:contact-lead-visual`

## Safety boundary

No production deploy, DNS, analytics, live lead routing, merge, or push was performed.

## Owner feedback tune

- Popup proportionally reduced to fit the viewport better.
- Messenger button icons removed; labels are now text-only: `MAX`, `WhatsApp`, `Telegram`.
- Tuned evidence: `popup-desktop-tuned.png`, `popup-mobile-tuned.png`, `visual-evidence-tuned.json`.

## Owner feedback tune 2

- Popup reduced again after owner request.
- Current measured panel: desktop `800×544` on `1280×900`; mobile `366×427` on `390×844`.
- Buttons remain text-only: `MAX`, `WhatsApp`, `Telegram`.
- Evidence: `popup-desktop-smaller.png`, `popup-mobile-smaller.png`, `visual-evidence-smaller.json`.

## Owner approval

Alexander approved the current popup size/design after the second size reduction. See `OWNER_APPROVAL.md` and `data/review/contact-messenger-popup-owner-approval-20260906.json`.
