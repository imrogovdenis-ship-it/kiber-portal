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

### FSVQA-01 — HIGH — Новости remains a placeholder-style index page

Routes still unresolved: `/news/`

`/compilations/` and `/articles/` have been promoted from placeholder-style pages and received owner design approval in this PR follow-up. `/news/` still needs the same homepage-approved depth before production visual approval.

**Recommendation:** fix or explicitly accept `/news/` before production visual approval.

### FSVQA-01A — OWNER DESIGN APPROVED — Подборки promoted from placeholder to filled page

Route: `/compilations/`

Owner feedback: the page was empty and needed the actual compilations as on the homepage, adjusted card styling, two columns, explanatory guide block, CTA, and iterative card/button refinements.

Implementation: `/compilations/` now renders four compilation cards from the approved homepage data in a two-column wide-card grid, includes the approved guide/CTA rhythm, hides the unwanted visible “Следующие шаги” block while preserving the SEO/internal-link contract, and pins `Подробнее` buttons bottom-left inside each card.

Owner design approval recorded: **“Страницу "Подборки" утверждаю по дизайну.”**

Approval scope: `/compilations/` visual design only at commit `f9034281fead595072c210e67f4617dfe74b7e60` / staging image `alex-kiber-staging:sha-f903428`. This is not PR merge permission and not production/DNS/secrets/analytics/live lead routing approval.

### FSVQA-01B — OWNER DESIGN APPROVED — Блог Кибер Гоши promoted from placeholder to filled article index

Route: `/articles/`

Owner feedback: the page was empty and should use approved homepage/compilations patterns: article cards, section description above articles, CTA at the bottom, shared page gutters, no visible `Читать` buttons, no white “О разделе” container, and final H1 `Блог Кибер Гоши` styled black like other headings.

Implementation: `/articles/` now renders a single black `<h1 id="page-title">Блог Кибер Гоши</h1>`, an SEO-adaptation intro block above the feed without a white container, all six article cards from the approved homepage/live article data, the approved homepage final CTA, and hidden internal links to preserve the SEO/internal-link CI contract without adding an extra visible block. Card links retain the current homepage-safe `/articles/` fallback until article detail routes are migrated, because full CI blocks broken internal links.

Owner design approval recorded: **“Я Утверждаю дизайн Блога”**

Approval scope: `/articles/` / «Блог Кибер Гоши» visual design only at commit `8901052da67ceac6eef83983ae7a78cf17fbe256` / staging image `alex-kiber-staging:sha-8901052`. This is not PR merge permission and not production/DNS/secrets/analytics/live lead routing approval.

Deferred follow-ups:

- `KIBER-91-FILTER-ARTICLES` / Linear `KIBER-92` — implement article filtering on this page in a later stage.
- `KIBER-91-ARTICLE-DETAIL-MIGRATION` — migrate/rebuild article detail pages and restore cards to real article URLs instead of the safe index fallback.

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

1. Continue FSVQA-01 for `/news/` using approved homepage patterns. `/compilations/` and `/articles/` have owner design approval in this PR follow-up.
2. Review/refine robot detail pages for homepage rhythm while preserving approved RobotPage media rules.
3. Ask owner whether legal/404 pages can remain minimal or need light polish.
