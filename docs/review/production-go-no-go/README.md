# Production go/no-go пакет КИБЕР ПОРТАЛА

Дата фиксации: `2026-09-06T13:32:37.469052+00:00`
Репозиторий: `imrogovdenis-ship-it/kiber-portal`
Рабочая ветка: `hermes/kiber-full-site-visual-qa-20260901`
HEAD: `17c57f65943fe5f5949a45f1084170e232562659`

## Решение: NO-GO

Сайт значительно ближе к release candidate: закрыты публичные контакты/телефон, popup `Написать нам`, форма `Оставить заявку`, тест amoCRM + Telegram duplicate и все четыре юридических документа.

Но **production запуск пока нельзя делать**. Остались не дизайн-задачи, а release/infra gates:

- стабилизировать большой PR8/content workspace в clean RC package;
- решить production/live dynamic runtime для формы и env secrets;
- analytics/cookie IDs либо явно отложить, либо approve отдельно;
- получить отдельное production/DNS/secrets permission.

Запрещено без отдельного явного разрешения:

- production deploy;
- DNS cutover;
- изменение production secrets;
- постоянное включение production live lead routing;
- подключение analytics provider IDs/cookies;
- merge/push, если не дано отдельно.

## Что уже готово / закрыто

| Область | Статус | Evidence |
|---|---:|---|
| Public phone/contacts | утверждено | `src/config/site.ts`, `data/legal/legal-documents.json`, `docs/review/public-phone-update-20260906/` |
| Popup `Написать нам` | реализован и проверен | `docs/review/contact-messenger-popup-20260906/` |
| Форма `Оставить заявку` | визуально утверждена и закрыта | `docs/review/contact-lead-form-popup-20260906/OWNER_APPROVAL_CONTACT_LEAD_FORM_POPUP.md` |
| amoCRM + Telegram duplicate | live function test passed | `docs/review/contact-lead-form-popup-20260906/LIVE_ROUTING_TEST_EVIDENCE.md` |
| 4 legal documents | утверждены владельцем | `docs/review/legal-documents-cleanup-20260906/OWNER_APPROVAL_FOUR_LEGAL_DOCUMENTS.md` |
| Media rights registry | утверждено owner review | 24 robot media records, productionApproved = `24` |
| Launch scope manifest | создан | `data/review/launch-scope-manifest.json` |

## Readiness snapshot

```json
{
  "routesChecked": 37,
  "robotRoutesChecked": 24,
  "legalRoutesPresent": ["/privacy-policy/", "/consent/", "/cookie-policy/", "/terms/"],
  "leadRoutingEnabled": false,
  "leadDestinations": 0,
  "mediaProductionApproved": 24,
  "legalDocumentsApproved": true,
  "leadFormVisualApproved": true,
  "leadRoutingStagingFunctionTested": true
}
```

## Блокеры до production

### 1. RC package stabilization

**Статус:** blocking
**Сейчас:** launch-scope manifest создан, но рабочее дерево содержит большой uncommitted PR8/content/evidence слой.
**Нужно:** clean commit/PR-ready RC package, полный gate run, staging RC evidence.

### 2. Production live lead runtime

**Статус:** blocking
**Сейчас:** source `/api/leads` live function test passed; публичный review staging сейчас static nginx.
**Нужно:** решить dynamic/API runtime + env secrets для настоящей public form delivery.

### 3. Analytics provider и cookies

**Статус:** blocking/deferable
**Сейчас:** provider-neutral analytics contract есть, реальные IDs/cookies disabled.
**Нужно:** либо явно defer post-launch, либо approve provider/IDs/goals/cookies отдельно.

### 4. Явное production permission

**Статус:** blocking
**Сейчас:** production deploy permission = `false`
**Нужно:** отдельная команда на production deploy/DNS/secrets после RC gates.

## Следующая безопасная работа

1. Довести release-candidate stabilization package до commit/PR-ready state.
2. Прогнать full RC gates.
3. Обновить staging одной RC-версией.
4. После этого выбрать: dynamic lead-runtime staging или final production/DNS request.

## 2026-09-06 owner-approved dynamic staging update

- Main RC staging from `main` commit `12ef3d6dd54f1fc5c6ef780eb14e126cd0d51ea3` is owner-approved as production candidate.
- Dynamic/API staging is live on the staging URL and passed one owner-authorized `/api/leads` e2e submission: `amoCRM.ok=true`, `telegram.ok=true`.
- Analytics are intentionally deferred after launch: no Yandex Metrica, Umami, or pixels at publication.
- Production/DNS/live production routing still require a separate explicit final command.
