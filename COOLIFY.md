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
| Readiness path | `/readyz/` |
| CPU limit | `0.50` vCPU |
| Memory limit | `512Mi` |

Контейнер слушает `0.0.0.0:8080`; reverse proxy Coolify/Traefik должен направлять домен на внутренний порт `8080`.

## Resource limits and blast-radius contract

Для Alex-owned приложений КИБЕР ПОРТАЛ в Coolify задавать лимиты на уровне Application/Container, чтобы отказ сайта не валил shared services (`coolify`, `coolify-db`, `coolify-redis`, `coolify-proxy`, `ai-class-*`, `umami*`, `qdrant`, `hermes*`).

| Limit | Value | Reason |
|---|---:|---|
| CPU limit | `0.50` vCPU | Static Nginx runtime should not need more; prevents noisy-neighbor impact. |
| Memory limit | `512Mi` | Enough for Nginx static runtime; bounds runaway memory use. |
| Restart policy | `unless-stopped` / Coolify default managed restart | Container can recover without touching shared services. |
| Healthcheck path | `/healthz/` | Docker/Coolify liveness signal. |
| Readiness path | `/readyz/` | Proxy/readiness smoke endpoint for deployment checks. |

Контейнеры и app folders должны оставаться в Alex namespace: `alex-*`. Не задавать host ports; трафик идёт только через существующий Coolify/Traefik proxy contour.

## Environment matrix

`DEPLOY_ENV` и `DESIGN_REVIEW_ENABLED` влияют на статический output и поэтому должны быть отмечены в Coolify как **Build Variable**.

| Variable | Production | Preview | Build Variable | Runtime Variable |
|---|---|---|---|---|
| `DEPLOY_ENV` | `production` | `preview` | yes | optional |
| `DESIGN_REVIEW_ENABLED` | `false` | `true` | yes | optional |
| `PUBLIC_ANALYTICS_PROVIDER` | утверждённый provider | `disabled` | yes | no |
| `BUILD_SHA` | commit SHA | commit SHA | yes | optional |
| `IMAGE_VERSION` | `sha-<shortSha>` | `sha-<shortSha>` | yes | optional |
| `BUILD_DATE` | UTC ISO timestamp | UTC ISO timestamp | yes | optional |

Preview variables задаются в отдельной группе **Preview Deployment Environment Variables**. Production secrets, analytics IDs и реальные lead destinations туда не копируются.

## Versioned Docker images

Каждый staging/release image должен быть сопоставим с Git commit и пригоден для rollback.

Обязательный contract:

- image tag: `sha-<shortSha>`;
- build arg `BUILD_SHA=<fullGitSha>`;
- build arg `IMAGE_VERSION=sha-<shortSha>`;
- OCI label `org.opencontainers.image.revision=<fullGitSha>`;
- OCI label `org.opencontainers.image.version=sha-<shortSha>`;
- deployment label `deployed.commit=<fullGitSha>`;
- deployment label `deployed.version=sha-<shortSha>`.

Локальная/CI команда сборки:

```sh
IMAGE_REPOSITORY=alex-kiber-staging \
DEPLOY_ENV=preview \
DESIGN_REVIEW_ENABLED=true \
npm run docker:build:versioned
```

Для rollback выбирать image по SHA/tag, а не по mutable `latest`.

Подробный runbook: `docs/review/kiber-25/versioned-docker-images.md`.

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
