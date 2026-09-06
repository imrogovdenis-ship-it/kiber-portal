# Launch scope manifest — КИБЕР ПОРТАЛ

Дата: `2026-09-06T13:30:55.561501+00:00`
Branch: `hermes/kiber-full-site-visual-qa-20260901`
HEAD: `17c57f65943fe5f5949a45f1084170e232562659`

## Решение

`RC_PACKAGE_IN_PROGRESS_NO_PRODUCTION_PERMISSION`

Этот manifest отделяет утверждённый launch scope от черновиков, raw corpus и review artifacts перед первым release-candidate пакетом.

## Входит в RC scope

1. Public phone/contacts — утверждены для первой публикации.
2. Popup `Написать нам` — public messenger chooser.
3. Popup `Оставить заявку` — визуально утверждён, overflow fixed, live amoCRM+Telegram function test passed.
4. Четыре legal documents — утверждены владельцем.
5. PR8 visual/page-type/template work — review scope для текущего сайта.
6. SEO/content contracts + Wordstat prep — supporting material, не массовая публикация.

## Не входит в первую публикацию по умолчанию

- raw corpus archives;
- большие screenshot/contact-sheet iteration folders;
- `test-results/`;
- analytics provider activation;
- production DNS/secrets/deploy.

## Gated

- production deploy: `false`
- DNS: `false`
- secrets changes: `false`
- analytics cookies/IDs: `false`
- production live lead routing: `false`
- merge: `false`

## RC gates

См. `data/review/launch-scope-manifest.json` → `rcGates`.
