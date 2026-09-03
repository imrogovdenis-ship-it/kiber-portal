# Home / Compilations / Articles CTA2 and homepage gradient pass — 2026-09-03

## Scope

Owner requested three narrow visual changes:

1. Home page: replace the bottom `Остались вопросы` block before footer with the robot-card CTA2.
2. Home page: strengthen the dark top gradient on `Тематические подборки` image cards by 50% because white text was hard to read.
3. Compilations and Blog pages: replace the bottom `Остались вопросы` block before footer with the robot-card CTA2.

## Implementation

- Added shared data export `homeRobotCardFinalCta` in `src/data/home-live.ts`.
- Reused the robot-card CTA2 visual through a compact runtime derivative:
  - `/images/kiber-94-preview/gosha-ushanka-cta2-compact.avif`
  - source visual: `/images/kiber-94-preview/gosha-ushanka-cta2.webp`
  - alt: `Кибер Гоша в красной шапке помогает ответить на вопросы по аренде робота`
- Added `variant="robot-card-final"` support to `HomeFinalCta.astro` so the same CTA2 visual can be reused outside the robot-card template.
- Updated pages:
  - `/` (`src/pages/index.astro`)
  - `/compilations/` (`src/pages/compilations.astro`)
  - `/articles/` (`src/pages/articles.astro`)
- Updated robot-card template to share `homeRobotCardFinalCta` as the CTA2 base instead of keeping a separate local image object.
- Strengthened overlay card gradient in `HomeImageCards.astro`:
  - top layer: `30%` → `45%`
  - early fade layer: `12%` → `18%`
  - fade-to-transparent midpoint remains `52%`, so the lower button area is not darkened.

## Verification

Targeted tests and build:

```bash
node --import tsx --test tests/visual/homepage-full-parity-pass.test.ts tests/visual/compilations-index-page.test.ts tests/visual/articles-index-page.test.ts tests/visual/kiber94-robot-card-preview.test.ts
npm run check
npm run build:preview
```

Rendered HTML smoke checked:

- `/` renders `data-cta-variant="robot-card-final"`, `Остались вопросы?`, `gosha-ushanka-cta2-compact.avif`, `Написать нам`, `Оставить заявку`, `/lead/request/`.
- `/compilations/` renders the same CTA2 contract.
- `/articles/` renders the same CTA2 contract.
- Built CSS contains the stronger gradient: `45%`, `18%`, `transparent 52%`.

## Visual evidence

Screenshots generated locally from preview build:

- `screenshots/home-compilations-desktop.png`
- `screenshots/home-compilations-mobile.png`
- `screenshots/home-cta-desktop.png`
- `screenshots/home-cta-mobile.png`
- `screenshots/compilations-cta-desktop.png`
- `screenshots/compilations-cta-mobile.png`
- `screenshots/articles-cta-desktop.png`
- `screenshots/articles-cta-mobile.png`
- `screenshots/home-cta-gradient-contact-sheet.jpg`
- `screenshots/manifest.json`

## Safety boundary

This pass does not approve or change production deploy, DNS, secrets, analytics provider activation, or live lead routing.
