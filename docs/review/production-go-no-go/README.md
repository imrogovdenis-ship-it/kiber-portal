# Production go/no-go пакет КИБЕР ПОРТАЛА

Дата фиксации: `2026-08-28T21:22:42Z`  
Репозиторий: `imrogovdenis-ship-it/kiber-portal`  
Рабочая база: `codex/kiber-15-controlled-rebuild`  
HEAD базы: `5698898` — `feat: add fourth legal document`

## Решение: NO-GO

Сайт уже близок к launch-readiness на уровне структуры, маршрутов, CI и preview-safe визуального слоя, но **production запуск пока нельзя делать**.

Причина: остаются human/business/legal/media/routing решения, которые нельзя принимать автоматически.

Запрещено без отдельного явного разрешения:

- production deploy;
- DNS cutover;
- изменение production secrets;
- подключение real lead routing;
- подключение analytics provider IDs/cookies;
- публикация неподтверждённых media assets как production-approved.

## Что уже готово

| Область | Статус | Evidence |
|---|---:|---|
| Controlled rebuild base | готово к review | `codex/kiber-15-controlled-rebuild` at `5698898` |
| Robot pages | структурно готово | 24 robot routes проходят `robotpage`, `content-acceptance`, `readiness` gates |
| Legal static pages | есть 4/4, нужна финальная business/legal проверка | `/privacy-policy/`, `/consent/`, `/cookie-policy/`, `/terms/` |
| Contacts/lead visual pass | визуально утверждено и смержено | PR #40, approval: «PR #40 визуально утверждаю, можно мержить» |
| Lead capability | безопасно подготовлено | routing disabled, destinations = `[]` |
| Media rights registry | подготовлено для review | 24 robot media records, productionApproved = `0` |
| Content package workflow | подготовлено для review | 4 секции пакета, production publish gated |
| CI | зелёный | `npm run ci` проходил перед merge PR #40; GitHub `validate` зелёный |

## Readiness crawl

Текущий readiness report:

```json
{
  "routesChecked": 37,
  "robotRoutesChecked": 24,
  "legalRoutesPresent": [
    "/privacy-policy/",
    "/consent/",
    "/cookie-policy/",
    "/terms/"
  ],
  "leadRoutingEnabled": false,
  "leadDestinations": 0,
  "mediaProductionApproved": 0
}
```

Источник: `docs/review/launch-readiness-crawl/report.json`

## Блокеры до production

### 1. Реальные публичные контакты

**Статус:** blocking  
**Сейчас:** contacts are `placeholder-only`  
**Нужно решить:** запускать с placeholder-контактами нельзя без отдельного разрешения. Нужно утвердить телефон, Telegram, WhatsApp, email и, если нужно, реквизиты/адрес.

### 2. Live lead routing

**Статус:** blocking  
**Сейчас:** routing disabled, destinations = `[]`  
**Нужно решить:** куда реально отправляются заявки, какой fallback, кто владелец канала, какие секреты используются.

### 3. Media rights для production assets

**Статус:** blocking  
**Сейчас:** 24 robot media records требуют rights review; `productionApproved = 0`  
**Нужно решить:** подтвердить права/источники или заменить неподтверждённые изображения.

### 4. Analytics provider и cookies

**Статус:** blocking  
**Сейчас:** есть provider-neutral analytics contract, но реальные IDs/cookies disabled  
**Нужно решить:** какой provider, какие IDs, какая consent/cookie policy, когда включать.

### 5. Финальный business/legal launch package

**Статус:** blocking  
**Сейчас:** content package workflow остаётся human-gated  
**Нужно решить:** подтвердить, что legal docs, prices, disclaimers, contacts и launch copy можно публиковать вместе.

### 6. Явное production permission

**Статус:** blocking  
**Сейчас:** production deploy permission = `false`  
**Нужно решить:** после закрытия предыдущих пунктов дать отдельную команду на production deploy/DNS/secrets.

## Открытые PR, которые надо учесть

| PR | Статус | CI | Mergeability на момент фиксации | Что делать |
|---:|---|---|---|---|
| #43 — production approval gates registry | open | success | conflicting | Обновить от базы или закрыть/заменить этим go/no-go пакетом, если он перекрывает смысл #43 |
| #44 — critical route crawl | open | success | mergeable | Можно рассмотреть merge как усиление readiness crawl |
| #45 — pricing disclaimer safety | open | success | mergeable | Можно рассмотреть merge как safety-защиту цен/дисклеймеров |

## Чеклист решений для Александра/Дениса

Перед production нужно ответить:

1. Какие реальные публичные контакты публикуем?
2. Куда идут заявки: Telegram, email, CRM, другое?
3. Что делать, если primary lead destination недоступен?
4. Какие изображения утверждены для production?
5. Какие изображения нужно заменить или убрать?
6. Подтверждены ли все 4 legal docs (`/privacy-policy/`, `/consent/`, `/cookie-policy/`, `/terms/`) и публичные disclaimers?
7. Какую аналитику включаем и какие cookies допустимы?
8. Мержим ли PR #43, #44, #45 до production?
9. После закрытия всего выше — есть ли явное разрешение на production deploy/DNS/secrets?

## Что можно делать дальше безопасно

Без production side effects можно продолжать:

1. Сделать **media rights review table** для 24 robot assets.
2. Подготовить **public contacts config scaffold** без реальных контактов/destinations.
3. Обновить/смержить безопасные PR #44 и #45 после проверки конфликтов.
4. Подготовить **visual pass 3** для `/lead/thanks/`, категорий и footer.
5. Подготовить production runbook, но не выполнять deploy.

## Итог

**Технический статус:** preview/controlled rebuild сильно продвинут, CI покрытие хорошее.  
**Production статус:** **NO-GO** до закрытия 6 блокеров; legal set теперь 4/4, но финальная business/legal проверка всё ещё нужна.  
**Следующий лучший шаг:** media rights review package или contacts/lead routing decision package.
