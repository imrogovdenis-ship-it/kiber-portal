# Утверждение четырёх юридических документов

## Статус

`owner_approved_closed`

## Формулировка владельца

> Утверждаю все четыре документа юридических в том виде в котором они есть

## Утверждённый scope

Утверждены текущие версии:

1. Политика обработки персональных данных — `/privacy-policy/`
2. Политика использования файлов cookie — `/cookie-policy/`
3. Пользовательское соглашение — `/terms/`
4. Согласие на обработку персональных данных — `/consent/`

## Evidence

- `data/legal/legal-documents.json`
- `src/pages/privacy-policy.astro`
- `src/pages/cookie-policy.astro`
- `src/pages/terms.astro`
- `src/pages/consent.astro`
- `docs/review/legal-documents-cleanup-20260906/verification-results-final.json`

## Последняя проверка

- `legal-four-documents.test.ts` — 4/4 pass
- `test:page-seo-components` — pass
- `test:production-go-no-go` — pass / общий статус всё ещё `NO_GO`
- `build:preview` — pass
- forbidden internal notices in rendered HTML — 0 hits
- duplicate numbering in privacy/cookie — 0 findings

## Границы approval

Это утверждение юридических документов. Оно не означает merge, production deploy, DNS, analytics, live lead routing, secrets/env activation или Linear Done без отдельного шага.

Git HEAD на момент записи: `17c57f65943fe5f5949a45f1084170e232562659`
