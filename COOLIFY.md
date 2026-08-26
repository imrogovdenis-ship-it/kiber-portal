# Coolify: deployment contract

## Production

- Source: GitHub App, repository `imrogovdenis-ship-it/kiber-portal`, branch `main`.
- Build: root `Dockerfile`; output обслуживает nginx на порту `8080`.
- Обязательные env: `DEPLOY_ENV=production`, `DESIGN_REVIEW_ENABLED=false`.
- Production secrets не передаются как `PUBLIC_*`.
- Healthcheck: `/healthz/`.

## Pull request preview

- Preview deployment создаётся встроенным механизмом Coolify, не GitHub Actions.
- Env: `DEPLOY_ENV=preview`, `DESIGN_REVIEW_ENABLED=true`, analytics provider `disabled`.
- Production secrets и реальные lead destinations не копируются.
- `/preview/design-review/` получает meta robots и `X-Robots-Tag`.
- Если preview содержит конфиденциальные материалы, включается авторизация на уровне proxy.

GitHub Actions выполняет только проверки. Production deploy, DNS и подключение реальных env требуют отдельного разрешения владельца.
