# Coolify: deployment contract

GitHub Actions выполняет проверки, а Coolify — единственный deploy-механизм. Production deploy, DNS, secrets и реальные lead destinations требуют отдельного разрешения владельца.

## Application

| Поле Coolify | Значение |
|---|---|
| Source | GitHub App |
| Repository | `imrogovdenis-ship-it/kiber-portal` |
| Production branch | `main` |
| Build pack | Dockerfile |
| Dockerfile location | `/Dockerfile` |
| Base directory | `/` |
| Ports Exposes | `8080` |
| Healthcheck path | `/healthz/` |

Контейнер слушает `0.0.0.0:8080`; reverse proxy Coolify/Traefik должен направлять домен на внутренний порт `8080`.

## Environment matrix

`DEPLOY_ENV` и `DESIGN_REVIEW_ENABLED` влияют на статический output и поэтому должны быть отмечены в Coolify как **Build Variable**.

| Variable | Production | Preview | Build Variable | Runtime Variable |
|---|---|---|---|---|
| `DEPLOY_ENV` | `production` | `preview` | yes | optional |
| `DESIGN_REVIEW_ENABLED` | `false` | `true` | yes | optional |
| `PUBLIC_ANALYTICS_PROVIDER` | утверждённый provider | `disabled` | yes | no |

Preview variables задаются в отдельной группе **Preview Deployment Environment Variables**. Production secrets, analytics IDs и реальные lead destinations туда не копируются.

## Pull request preview

1. В `Configuration → Advanced → Deployment` включить **Preview Deployments**.
2. Оставить **Allow Public PR Deployments** выключенным: запускаются только PR доверенных участников.
3. Указать URL template: `pr-{{pr_id}}.preview.kiber-portal.ru`.
4. Wildcard DNS `*.preview.kiber-portal.ru` должен указывать на Coolify/Traefik.
5. GitHub App должна иметь `Pull requests: Read and write` и подписку на событие `Pull requests`, чтобы публиковать статус и URL в PR.
6. Если PR был открыт до включения preview, нажать **Load Pull Requests**, затем **Deploy** у нужного PR.

Для PR №8 ожидаемый review URL: `https://pr-8.preview.kiber-portal.ru/preview/design-review/`.

## Acceptance checks

```sh
curl -fsS https://pr-8.preview.kiber-portal.ru/healthz/
curl -fsSI https://pr-8.preview.kiber-portal.ru/preview/design-review/
```

Ожидается `ok` от healthcheck, HTTP 200 от design-review, `X-Robots-Tag: noindex, nofollow` и `<meta name="robots" content="noindex, nofollow">`. Preview не входит в sitemap и не генерируется при production-сборке.

## Диагностика

- `502 ... Connection refused`: контейнер не запущен либо proxy направлен не на `8080`; проверить deployment/container logs и `Ports Exposes`, затем redeploy preview.
- `/healthz/` отвечает, но design-review возвращает 404: проверить preview Build Variables и пересобрать image без cache.
- В PR нет комментария Coolify: проверить GitHub App permissions/event subscription; для уже открытого PR выполнить **Load Pull Requests** и ручной **Deploy**.
- Конфиденциальный preview закрывается Basic Auth или allowlist на proxy; `robots.txt` не является средством контроля доступа.
