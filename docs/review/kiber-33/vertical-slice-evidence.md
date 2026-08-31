# KIBER-33 — vertical slice evidence

Scope: Main → Unitree G1 robot card → preview-safe lead request → confirmation.

Implemented routes:

- `/`
- `/robots/unitree-g1/`
- `/lead/request/?robot=unitree-g1`
- `/lead/thanks/?robot=unitree-g1`

Validation commands run:

```text
node --import tsx --test tests/visual/vertical-slice.test.ts
npm run verify
npm run build:production
```

Build output verified:

```text
dist/index.html — exists; contains /robots/unitree-g1/ and data-kiber-task="KIBER-33"
dist/robots/unitree-g1/index.html — exists; contains /lead/request/?robot=unitree-g1
dist/lead/request/index.html — exists; method="get"; no method="post"; no api/ endpoint
dist/lead/thanks/index.html — exists; contains “Заявка принята”
```

Safety notes:

- Lead flow is preview-safe/static: no POST, no API endpoint, no production lead destination.
- No production deploy, DNS, secrets, analytics provider IDs, or real lead destinations changed.
- Real submission remains blocked until contact channel + legal/consent decisions are approved.

Screenshots:

- `docs/review/kiber-33/screenshots/kiber-33-home-desktop-1440.png`
- `docs/review/kiber-33/screenshots/kiber-33-home-mobile-375.png`
- `docs/review/kiber-33/screenshots/kiber-33-lead-request-desktop-1440.png`
- `docs/review/kiber-33/screenshots/kiber-33-lead-request-mobile-375.png`
- `docs/review/kiber-33/screenshots/kiber-33-lead-thanks-desktop-1440.png`
- `docs/review/kiber-33/screenshots/kiber-33-lead-thanks-mobile-375.png`
- `docs/review/kiber-33/screenshots/kiber-33-robot-unitree-g1-desktop-1440.png`
- `docs/review/kiber-33/screenshots/kiber-33-robot-unitree-g1-mobile-375.png`
