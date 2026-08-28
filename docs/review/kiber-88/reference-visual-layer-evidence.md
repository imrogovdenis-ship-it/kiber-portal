# KIBER-88: reference visual layer pass 1

## Summary

KIBER-88 starts the controlled migration from the approved desktop/mobile HTML references into the root Astro runtime without pasting raw HTML.

Visual sources:

- `docs/source/reference-desktop-v9.html`
- `docs/source/reference-mobile-v3.html`
- uploaded Qwen HTML files are treated as visual references only, not runtime source.

## Pass 1 applied areas

- `01-header`: reference-like sticky header rhythm and compact CTA.
- `02-home-hero`: dark card, blue/white CTAs, horizontal 16:9/contain mobile image behavior, stats cards, responsive typography.
- `05-robot-card`: card/badge/radius/color treatment through the visual layer.
- `09-cta-strip`: reference dark CTA, compact stacked mobile CTAs.
- `11-robot-hero`: detail-page hero layout; mobile/tablet image card remains square 1:1 with contained image per review feedback.
- `15-pricing`: dark pricing surface treatment.
- `33-footer`: reference dark footer, mobile-safe text wrapping, tablet 768 two-column arrangement with contacts top-right.

## User feedback addressed

First feedback pass:

- Home mobile 375: fixed square/cropped hero image behavior by using a horizontal 16:9 slot with contained image.
- Home mobile 375: compact stacked hero buttons, stats fit within viewport.
- Root mobile overflow: fixed erroneous `320px -> 31.25rem` conversion and added sizing guard; screenshot capture verified `mobile overflow count 0`.
- Robot page mobile 375: text/buttons fit within viewport.
- Contacts/lead mobile: verified visible text/form area no longer horizontally overflows.
- Footer mobile: text/logo/contact blocks wrap within viewport.
- Footer tablet 768: two-column arrangement with brand/description left, contacts upper-right, catalog/content below.

Second feedback pass:

- Home was accepted and left unchanged.
- Robot page mobile 375 and tablet 768 image card returned to square 1:1 format instead of horizontal 16:9.
- Robot image remains `object-fit: contain` in the square card so the robot fits without destructive crop.
- Regression test now protects this distinction: HomeHero keeps 16:9 mobile image, RobotPage media stays square 1:1.

## Verification

Commands run locally:

```bash
node --import tsx --test tests/visual/reference-visual-layer-pass1.test.ts
npm run build:production
npm run test:reference-visual-layer
npm run ci
```

Screenshot capture verification:

```text
captured 16 route x viewport variants to docs/review/kiber-88/screenshots; mobile overflow count 0
```

## Screenshot evidence

- `docs/review/kiber-88/screenshots/manifest.json`
- `docs/review/kiber-88/contact-sheets/home__kiber-88-contact-sheet.jpg`
- `docs/review/kiber-88/contact-sheets/robot-unitree-g1__kiber-88-contact-sheet.jpg`
- `docs/review/kiber-88/contact-sheets/contacts__kiber-88-contact-sheet.jpg`
- `docs/review/kiber-88/contact-sheets/lead-request__kiber-88-contact-sheet.jpg`
- `docs/review/kiber-88/contact-sheets/all-routes__mobile-desktop__kiber-88-contact-sheet.jpg`

## Safety boundaries

- No production deployment.
- No DNS changes.
- No production secrets.
- No analytics provider scripts/IDs/cookies.
- No live lead-routing destination.
- No raw reference HTML copied into Astro runtime.

## Follow-up after approval

Pass 1 intentionally does not claim full 34-block parity. Next controlled pass should continue with deeper reference composition for contacts/lead pages and remaining commercial sections.
