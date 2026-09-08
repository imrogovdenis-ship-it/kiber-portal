# KIBER fast launch scope — humanoids + six articles

Generated: `2026-09-08T08:35:00Z`
Branch: `feat/kiber-fast-launch-humanoids-articles-20260908`
Base after PR #79: `eab98c1c349160891192b5009f8894296599bfc8`

## Included

- Homepage `/`
- Live compilation `/roboty-gumanoidy/` through approved CompilationTemplate
- Articles index `/articles/`
- Six launch article pages:
  - `/articles/robot-gumanoid-dlya-vystavki/` — Робот-гуманоид для выставки: как использовать на стенде
  - `/articles/kak-vybrat-robota-gumanoida-dlya-meropriyatiya/` — Как выбрать робота-гуманоида для мероприятия
  - `/articles/unitree-g1-r1-h2-sravnenie-dlya-arendy/` — Unitree G1, R1 и H2: сравнение для аренды
  - `/articles/promobot-ili-gumanoid-dlya-prezentatsii/` — Promobot или гуманоид для презентации: что выбрать
  - `/articles/robot-gumanoid-na-korporativ/` — Робот-гуманоид на корпоратив: сценарии и подготовка
  - `/articles/skolko-stoit-arenda-robota-gumanoida/` — Сколько стоит аренда робота-гуманоида
- 24 approved robot pages under `/robots/<slug>/`
- Contacts, lead request/thanks, legal pages

## Excluded / noindex policy

- `/news/` is deferred and removed from sitemap for this fast launch.
- Future empty compilations/articles remain excluded or noindex until real content exists.
- Preview/review routes are not part of public launch scope.

## Boundaries

Production deploy, DNS, production secrets, live lead routing and public cutover are not included in this PR. Analytics remains deferred post-launch.
