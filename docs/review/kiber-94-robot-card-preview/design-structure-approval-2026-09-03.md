# KIBER-94 robot_card design and structure approval — 2026-09-03

## Owner decision

Александр утвердил дизайн и структуру карточки робота:

> Ну все, дизайн и структуру карточки робота утверждаем. Сделаем все необходимые записи, зафиксируем информацию

Recorded status: **approved_by_owner** for `robot_card_design_and_structure`.

## Approved scope

This approval records the robot-card design/structure baseline demonstrated on Unitree G1 / KIBER-94:

- Hero: dark-gray article-style underlay, `H1 = Аренда <тип робота> <модель>`, stable price meta, centered eyebrow and CTA placement, catalog image on the right.
- One short visible `aiSummary` after Hero; no duplicate intro/summary pair.
- Main gallery and `04 — робот в действии` are real-media horizontal drag sliders.
- `01 — что входит` and `05 — как заказать` use FAQ-like side insets and owner-expanded 90–110 character phrases.
- `02 — ключевые возможности` uses the dedicated original capability image registry, not gallery photos.
- `03 — сценарии использования` white cards keep the approved catalog-like animation.
- FAQ, Blog Kiber Gosha and related robot catalog remain part of the approved page ending.
- Heading semantics are approved: one Hero `H1`; named main blocks as `H2`.

## Boundary / not approved here

This approval **does not** approve:

- PR merge;
- replacement of public `/robots/[slug]/` routes;
- production deployment;
- DNS changes;
- secrets changes;
- analytics provider activation;
- live lead routing;
- new pricing/legal/business claims beyond current source-of-truth.

## Evidence

- Machine-readable record: `data/review/kiber-94-robot-card-design-structure-approval.json`
- Preview report: `docs/review/kiber-94-robot-card-preview/report.json`
- Latest owner-feedback evidence: `docs/review/kiber-94-robot-card-preview/latest-owner-feedback-2026-09-03.md`
- Responsive screenshot manifest: `docs/review/kiber-94-robot-card-preview/screenshots/latest-owner-feedback-2026-09-03/manifest.json`
- Contact sheet: `docs/review/kiber-94-robot-card-preview/screenshots/latest-owner-feedback-2026-09-03/unitree-g1-owner-feedback-contact-sheet.jpg`
- PR: https://github.com/imrogovdenis-ship-it/kiber-portal/pull/70
- Approved commit: `a24d66646ef6160eae19e17defadea695c798a8c`
- Protected staging image: `alex-kiber-staging:sha-a24d666`
