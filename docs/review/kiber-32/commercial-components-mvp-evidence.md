# KIBER-32 — Commercial components MVP evidence

Scope: Hero, RobotCard/Grid, Pricing, FAQ, CTA/Form review components.

Implemented blocks:

- `home-hero` / review 02
- `robot-card` / review 05 (existing pilot grid retained)
- `faq` / review 07
- `cta-strip` / review 09
- `pricing` / review 15
- `lead-form` / review 31

Validation commands run:

```text
npm run verify
npm run build:preview
npm run build:production
```

Preview build confirmed `dist/preview/design-review/index.html` contains:

```text
data-kiber-task="KIBER-32"
data-block-id="home-hero"
data-block-id="robot-card"
data-block-id="faq"
data-block-id="cta-strip"
data-block-id="pricing"
data-block-id="lead-form"
```

Screenshots:

- `docs/review/kiber-32/screenshots/kiber-32-design-review-mobile-375.png`
- `docs/review/kiber-32/screenshots/kiber-32-design-review-tablet-768.png`
- `docs/review/kiber-32/screenshots/kiber-32-design-review-desktop-1440.png`

Notes:

- Lead form remains disabled until approved lead destination and legal/consent policy exist.
- Production build excludes the design-review route.
- No production deploy, DNS, secrets, analytics IDs, or real lead destinations changed.
