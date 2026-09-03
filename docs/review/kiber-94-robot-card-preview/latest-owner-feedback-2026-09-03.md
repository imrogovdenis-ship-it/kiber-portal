# KIBER-94 robot card latest owner feedback — 2026-09-03

## Scope

Route checked locally from the preview build:

- `/preview/kiber-94/robot-card/arenda-unitree-g1/`

Owner feedback implemented for the robot card page:

1. Block `01 — что входит` restores FAQ-like side insets for the phrase container on desktop/tablet and expands each phrase to 90–110 characters.
2. Block `05 — как заказать` restores the same phrase-container side insets and expands each phrase to 90–110 characters.
3. Hero keeps `Аренда робота-гуманоида Unitree G1` and `от 12 500 ₽ / час` in place, moves `КИБЕР ПОРТАЛ · аренда роботов` into the upper center band, and lowers the two CTA buttons under the price.
4. Block `02 — ключевые возможности` uses the dedicated original capability image registry (`data/models/robot-capability-images.source.json`) and adds the same hover/scale animation pattern as catalog robot images.
5. Block `03 — сценарии использования` white text cards receive the same hover/scale animation pattern.

## Source changes

- `src/components/templates/RobotCardTemplate.astro`
- `tests/visual/kiber94-robot-card-preview.test.ts`

## Verification

Commands run locally:

```bash
node --import tsx --test tests/visual/kiber94-robot-card-preview.test.ts
npm run check
npm run build:preview
```

Results:

- robot-card visual/source test: passed (`19/19`)
- design-system validation/lint/Astro check: passed (`0 errors`, `0 warnings`, `0 hints`)
- preview build: passed (`63 page(s) built`)

## Rendered measurements

Captured with Playwright against local loopback preview server (`127.0.0.1`, not a user-facing URL).

- desktop: included/order phrase container side margins ≈ `100.8px`
- tablet: included/order phrase container side margins ≈ `53.76px`
- mobile: phrase containers collapse to mobile-safe full width (`0px` extra side inset)
- included phrase lengths: `95`, `90`, `97`, `90`
- order phrase lengths: `97`, `99`, `92`, `94`
- capability image sources: `/images/robot-capabilities/arenda-unitree-g1/01...06-*.webp`
- capability image transition: `transform 0.3s ease-in-out`
- scenario card transition: `transform 0.3s ease-in-out`

## Screenshot evidence

Manifest:

- `docs/review/kiber-94-robot-card-preview/screenshots/latest-owner-feedback-2026-09-03/manifest.json`

Contact sheet:

- `docs/review/kiber-94-robot-card-preview/screenshots/latest-owner-feedback-2026-09-03/unitree-g1-owner-feedback-contact-sheet.jpg`

Captured viewports:

- desktop `1440×1200`
- tablet `768×1200`
- mobile `390×1200`

Captured sections per viewport:

- full page
- hero
- included / `01 — что входит`
- capabilities / `02 — ключевые возможности`
- scenarios / `03 — сценарии использования`
- order / `05 — как заказать`

## Approval boundary

This is preview/PR visual evidence only. It does not approve production deploy, DNS, secrets, analytics, live lead routing, or merge by itself.
