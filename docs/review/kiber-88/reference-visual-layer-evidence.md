# KIBER-88: reference visual layer pass 1

## Summary

KIBER-88 starts the controlled migration from the approved desktop/mobile HTML references into the root Astro runtime without pasting raw HTML.

Visual sources:

- `docs/source/reference-desktop-v9.html`
- `docs/source/reference-mobile-v3.html`
- uploaded Qwen HTML files are treated as visual references only, not runtime source.

## Pass 1 applied areas

- `01-header`: reference-like sticky header rhythm and compact CTA.
- `02-home-hero`: dark card, blue/white CTAs, 16:9/contain mobile image behavior, stats cards, responsive typography.
- `05-robot-card`: card/badge/radius/color treatment through the visual layer.
- `09-cta-strip`: reference dark CTA, compact stacked mobile CTAs.
- `11-robot-hero`: detail-page hero layout, 16:9/contain mobile media behavior, compact stacked mobile buttons.
- `15-pricing`: dark pricing surface treatment.
- `33-footer`: reference dark footer, mobile-safe text wrapping, tablet 768 two-column arrangement with contacts top-right.

## User feedback addressed after first review

- Homepage hero image was visually too square on mobile; fixed by forcing a horizontal 16:9 viewport slot and `object-fit: contain` in the mobile/tablet stack.
- Homepage mobile 375 buttons were too wide/split; fixed as compact stacked CTAs.
- Homepage stats/value blocks overflowed on 375; fixed container/grid sizing and verified no horizontal overflow.
- Robot detail page mobile image showed only a cropped portion; fixed mobile media to 16:9 + contain.
- Robot detail page mobile text/buttons now fit within viewport and buttons stack compactly.
- Contacts/lead mobile text/form visible area no longer horizontally overflows.
- Footer mobile logo/description/contact text wraps within viewport.
- Footer tablet 768 now uses a two-column arrangement: brand/description left, contacts upper-right, catalog/content below.

## Verification

Commands run locally:

```bash
node --import tsx --test tests/visual/reference-visual-layer-pass1.test.ts
npm run build:production
npm run test:reference-visual-layer
```

Screenshot capture verification:

```text
captured 16 route x viewport variants to docs/review/kiber-88/screenshots; mobile overflow count 0
```

A full `npm run ci` is rerun after this feedback fix before pushing.

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
