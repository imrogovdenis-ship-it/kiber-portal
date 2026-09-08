# Production go/no-go пакет КИБЕР ПОРТАЛА

Дата фиксации: `2026-09-08T08:35:00Z`
Рабочая ветка: `feat/kiber-fast-launch-humanoids-articles-20260908`

## Решение: NO-GO

Fast launch scope реализован для review: главная, 24 утверждённые robot-card страницы, живая подборка `/roboty-gumanoidy/`, шесть статей Блога Кибер Гоши, контакты, Форма `Оставить заявку`, popup `Написать нам` and 4 legal documents.

Production запуск пока нельзя делать: production deploy permission = `false`, DNS/secrets/live lead routing не разрешены. Analytics отложена после запуска.

## Readiness snapshot

```json
{
  "routesChecked": 43,
  "robotRoutesChecked": 24,
  "articleRoutesChecked": 6,
  "legalRoutesPresent": ["/privacy-policy/", "/consent/", "/cookie-policy/", "/terms/"],
  "leadRoutingEnabled": false,
  "leadDestinations": 0,
  "mediaProductionApproved": 24
}
```

## Launch scope manifest

`data/review/launch-scope-manifest.json` фиксирует быстрый контур публикации: homepage, humanoid compilation, 6 articles, 24 robot cards, contacts/forms/legal; 4 legal documents present.

## Блокеры до production

1. Fast launch PR/RC package stabilization.
2. Production live lead runtime: Форма `Оставить заявку` должна работать на production domain/container после отдельного разрешения на secrets/live routing.
3. Analytics provider IDs: deferred post-launch.
4. Explicit production/DNS/secrets permission.

Запрещено без отдельной явной команды: production deploy, DNS cutover, secrets, analytics provider cookies, live lead routing.
