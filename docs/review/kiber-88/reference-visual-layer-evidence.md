# KIBER-88: reference visual layer pass 1

## Summary

KIBER-88 starts the controlled migration from the approved desktop/mobile HTML references into the root Astro runtime without pasting raw HTML.

Visual sources:

- `docs/source/reference-desktop-v9.html`
- `docs/source/reference-mobile-v3.html`

The implementation preserves the existing controlled rebuild foundation: 24 robot pages, SEO metadata, JSON-LD, sitemap, internal links, content acceptance, responsive QA, Docker/runtime and CI gates.

## What changed

- Added `src/styles/reference-layer.css` as the first controlled runtime visual layer for reference primitives and shared layout rhythm.
- Imported the reference layer from `src/layouts/BaseLayout.astro`.
- Updated `HomeHero` structure toward the reference composition:
  - dark rounded hero card;
  - large display heading;
  - visual media side;
  - primary/secondary pill CTAs;
  - compact stats inside the dark card;
  - `data-rv="02"` reference marker.
- Added a representative hero image from the existing legally tracked robot media set instead of embedding external reference HTML/media.
- Updated the robot detail hero first screen toward the reference rhythm:
  - 1:1 media card;
  - large title;
  - visible price accent;
  - full-width mobile CTA buttons;
  - `data-rv="11"` reference marker.
- Added `data/review/reference-visual-layer-pass1.json` to record scope, source hierarchy and safety boundaries.
- Added `tests/visual/reference-visual-layer-pass1.test.ts` and `scripts/reference-visual-layer-smoke.mjs`.
- Added `npm run test:reference-visual-layer` to the cumulative `npm run ci`.

## Architecture/safety boundaries

- Raw reference HTML was **not** pasted into runtime.
- Raw colors and px values are not left in `src/`; the existing design-system lint gate enforces this.
- Production deploy, DNS, secrets, analytics provider and real lead routing were not changed.
- Contacts/lead pages remain safe/static; no live form submission was enabled.

## Verification

```text
node --import tsx --test tests/visual/reference-visual-layer-pass1.test.ts
npm run build:production
npm run test:reference-visual-layer
npm run ci
```

Observed:

```text
KIBER-88 reference visual layer contract: passed
Astro production build: 36 pages built
KIBER-88 reference visual layer smoke: passed
npm run ci: passed
```

Full CI retained previous gates:

```text
KIBER-34 visual regression smoke passed: 10 approved references verified.
KIBER-39 performance budget smoke passed: 4 routes checked.
KIBER-43 route/sitemap smoke passed: 35 launch routes, 31 sitemap URLs, 2 redirects checked.
KIBER-45 RobotPage smoke passed: 24 robot pages.
KIBER-55 content acceptance smoke passed: 31 public routes checked; 31 remain human-review gated.
KIBER-63 responsive visual QA smoke passed: 24 screenshots, 11 contact sheets, 0 blocking defects.
KIBER-88 reference visual layer smoke passed.
KIBER-20 CI baseline smoke passed: 36 HTML pages link-checked.
```

## Screenshot evidence

Captured from local `dist` after `npm run ci`:

- routes: `/`, `/robots/arenda-unitree-g1/`, `/contacts/`, `/lead/request/`;
- viewports: `375x812`, `768x1024`, `1024x768`, `1440x1000`;
- artifacts:
  - `docs/review/kiber-88/screenshots/manifest.json`;
  - `docs/review/kiber-88/screenshots/*first-screen.png`;
  - `docs/review/kiber-88/screenshots/*full-page.png`;
  - `docs/review/kiber-88/contact-sheets/*`.

## Visual sanity notes

No blocking defects were found in the first-screen contact sheets:

- pages render rather than blanking;
- main CTAs remain visible and tappable;
- mobile/desktop layouts do not show obvious horizontal overflow;
- hero and robot-page first screens now visually move toward the supplied reference direction.

Nonblocking follow-ups:

- contacts and lead pages currently inherit global reference canvas/header/footer but still need a dedicated reference-composition pass;
- remaining 34-section parity should continue incrementally through tokens/specs/components/pages;
- final visual approval should happen from screenshots, not from this automated pass alone.
