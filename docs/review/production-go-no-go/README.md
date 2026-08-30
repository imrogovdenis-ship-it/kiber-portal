# Production go/no-go пакет КИБЕР ПОРТАЛА

> Preview-first update: текущая цель — protected non-domain server preview; live analytics/routing/production DNS отложены.

Дата фиксации: `2026-08-30T02:56:33Z`  
Репозиторий: `imrogovdenis-ship-it/kiber-portal`  
Рабочая база: `codex/kiber-15-controlled-rebuild`  
HEAD базы до текущего PR: `e334c72`

## Решение: NO-GO

Сайт стал ближе к launch-readiness: media rights утверждены, visual pass 3B смержен, публичные контакты и реквизиты владелец разрешил заменить в preview/PR. Но **production запуск пока нельзя делать**.

Причина: остаются human/business/legal/routing решения, которые нельзя принимать автоматически.

Запрещено без отдельного явного разрешения:

- production deploy;
- DNS cutover;
- изменение production secrets;
- подключение real lead routing / CRM / bot / email delivery;
- подключение analytics provider IDs/cookies.

## Что уже готово

| Область | Статус | Evidence |
|---|---:|---|
| Controlled rebuild base | готово к review | `codex/kiber-15-controlled-rebuild` |
| Robot pages | структурно готово | 24 robot routes проходят `robotpage`, `content-acceptance`, `readiness` gates |
| Legal static pages | есть 4/4, нужна финальная business/legal проверка | `/privacy-policy/`, `/consent/`, `/cookie-policy/`, `/terms/` |
| Contacts/lead visual pass | визуально утверждено и смержено | PR #56, owner approval: «Утверждаю» + «Мержи PR #56» |
| Lead capability | безопасно подготовлено | routing disabled, destinations = `[]` |
| Media rights registry | утверждено owner review | 24 robot media records, productionApproved = `24`; полные карточки 24 роботов утверждены Александром 2026-08-29 |
| Public contacts/requisites | утверждено для preview/PR | phone/email/Telegram/WhatsApp/Москва/ИП/ИНН/ОГРНИП/address от owner input 2026-08-30 |
| Content package workflow | подготовлено для review | production publish remains gated |
| CI | проверяется PR-ом | local smoke gates passed after contact update |

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
  "mediaProductionApproved": 24
}
```

Источник: `docs/review/launch-readiness-crawl/report.json`

## Блокеры до production

### 1. Live lead routing

**Статус:** blocking  
**Сейчас:** routing disabled, destinations = `[]`  
**Нужно решить:** куда реально отправляются заявки, какой fallback, кто владелец канала, какие секреты используются.

### 2. Analytics provider и cookies

**Статус:** blocking  
**Сейчас:** есть provider-neutral analytics contract, но реальные IDs/cookies disabled  
**Нужно решить:** какой provider, какие IDs, какая consent/cookie policy, когда включать.

### 3. Финальный business/legal launch package

**Статус:** blocking  
**Сейчас:** content package workflow остаётся human-gated  
**Нужно решить:** подтвердить, что legal docs, prices, disclaimers, contacts и launch copy можно публиковать вместе.

### 4. Явное production permission

**Статус:** blocking  
**Сейчас:** production deploy permission = `false`  
**Нужно решить:** после закрытия предыдущих пунктов дать отдельную команду на production deploy/DNS/secrets.

## Закрытые решения

| Решение | Evidence |
|---|---|
| Media rights для production assets | Owner approval 2026-08-29; `data/review/media-rights-robot-cards.json` |
| Visual pass 3B | PR #56 merged after owner approval |
| Реальные публичные контакты и реквизиты | Owner input 2026-08-30; `src/config/site.ts`, footer, contacts page, legal data |

## Чеклист решений для Александра/Дениса

Перед production нужно ответить:

1. Куда идут заявки: Telegram, email, CRM, другое?
2. Что делать, если primary lead destination недоступен?
3. Подтверждены ли все 4 legal docs и публичные disclaimers?
4. Какую аналитику включаем и какие cookies допустимы?
5. После закрытия всего выше — есть ли явное разрешение на production deploy/DNS/secrets?

## Что можно делать дальше безопасно

Без production side effects можно продолжать:

1. Подготовить lead routing design без секретов и без отправки реальных заявок.
2. Подготовить analytics/cookie decision pack без включения provider IDs.
3. Собрать финальный business/legal launch approval package.
4. Проверить redirects/sitemap/404/legal links в preview build.
