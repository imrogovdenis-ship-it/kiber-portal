# KIBER-91 — Full-site visual QA перед production cutover

## Decision: NO-GO for production until remaining findings are accepted or fixed

Это QA-пакет, а не production approval. Production/DNS/secrets/analytics/live lead routing не менялись.

## Source

- Repository: `imrogovdenis-ship-it/kiber-portal`
- Base branch: `main`
- Base commit: `6b88d7eb5720d88430b3ea74375d4d74f209b6be`
- Build used for capture: `npm run build:production`
- Local preview: `python3 -m http.server 4193 --bind 127.0.0.1 --directory dist`

## Scope

- Routes checked: **15**
- Viewports: **3** — mobile 390, tablet 768, desktop 1440
- Screenshots: **45**
- Contact sheets: **3**

Routes:

- `/` — home
- `/robots/arenda-unitree-g1/` — robot-unitree-g1
- `/robots/arenda-bellabot/` — robot-bellabot
- `/robots/arenda-robot-barmen/` — robot-barmen
- `/roboty-gumanoidy/` — category-humanoids
- `/roboty-sobaki/` — category-dogs
- `/compilations/` — compilations
- `/articles/` — articles
- `/news/` — news
- `/contacts/` — contacts
- `/lead/request/?robot=arenda-unitree-g1` — lead-request
- `/lead/thanks/` — lead-thanks
- `/privacy-policy/` — privacy
- `/terms/` — terms
- `/404.html` — not-found

## Baseline from approved homepage

Александр уточнил, что при Full-site visual QA нужно использовать наработки с утверждённой главной страницы. Поэтому baseline для остальных страниц:

- approved header/footer/nav;
- homepage card language for robots/scenarios/articles where applicable;
- blue CTA strip and clear primary action rhythm;
- FAQ/accordion spacing/separators;
- unified typography, gutters, rounded cards, blue accent system;
- mobile/tablet rules without horizontal overflow;
- preserve approved media aspect-ratio distinctions: HomeHero mobile/tablet 16:9 contain; RobotPage hero mobile/tablet remains 1:1 contained.

## Automated audit

- DOM/render checks: **45**
- Failures: **0**
- Horizontal overflow: **0 blocking cases**
- Broken images: **0 blocking cases**
- Analytics scripts while disabled: **0**
- Design-review leak in production build: **0**

Evidence:

- `docs/review/kiber-91-full-site-visual-qa/dom-audit.json`
- `docs/review/kiber-91-full-site-visual-qa/screenshots/manifest.json`

## Findings

### FSVQA-01 — HIGH — Блог / Новости are placeholder-style index pages

Routes: `/articles/`, `/news/`

These pages are functional and branded, but visually thin compared with the approved homepage. They should reuse homepage-approved patterns before production: richer section hero, card/list blocks, consistent spacing, and CTA rhythm.

**Recommendation:** fix before production visual approval.

### FSVQA-01A — RESOLVED — Подборки promoted from placeholder to filled page

Route: `/compilations/`

Owner feedback: the page was empty and needed the actual compilations as on the homepage, adjusted card styling, two columns, bottom text block with heading, and CTA.

Implementation: `/compilations/` now renders four compilation cards from the approved homepage data in a two-column wide-card grid, followed by an explanatory text block and the approved homepage CTA component.

### FSVQA-02 — MEDIUM — Robot detail pages need final design alignment review

Routes sampled: `/robots/arenda-unitree-g1/`, `/robots/arenda-bellabot/`, `/robots/arenda-robot-barmen/`

Robot pages are technically stable and readable. They use an earlier detail-page visual language. Before launch, review whether card/spacing/CTA rhythm should be aligned further with the approved homepage while preserving the approved RobotPage mobile/tablet 1:1 media rule.

**Recommendation:** review and either accept explicitly or refine.

### FSVQA-03 — MEDIUM — Legal and 404 pages are branded but minimal

Routes: `/privacy-policy/`, `/terms/`, `/404.html`

Functional, readable, and branded. They can ship if accepted, but visually they are more minimal than the approved homepage system.

**Recommendation:** owner accepts as-is or we add light launch polish.

## Contact sheets

- Mobile: `docs/review/kiber-91-full-site-visual-qa/screenshots/contact-sheet-mobile-390.jpg`
- Tablet: `docs/review/kiber-91-full-site-visual-qa/screenshots/contact-sheet-tablet-768.jpg`
- Desktop: `docs/review/kiber-91-full-site-visual-qa/screenshots/contact-sheet-desktop-1440.jpg`

## Safety boundary

- production deploy allowed = `false`
- DNS change allowed = `false`
- production secrets change allowed = `false`
- live lead routing allowed = `false`
- analytics provider IDs/cookies allowed = `false`

## Next safe work

1. Continue FSVQA-01 for `/articles/` and `/news/` using approved homepage patterns. `/compilations/` has been implemented in this PR follow-up.
2. Review/refine robot detail pages for homepage rhythm while preserving approved RobotPage media rules.
3. Ask owner whether legal/404 pages can remain minimal or need light polish.
