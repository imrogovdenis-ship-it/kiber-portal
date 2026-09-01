# KIBER-70 — release candidate approval package

## Решение: AWAITING OWNER GO/NO-GO

Release candidate собран от текущего `main`, но это **не production approval**.

- Repository: `imrogovdenis-ship-it/kiber-portal`
- Source branch: `main`
- Source commit: `6b88d7eb5720d88430b3ea74375d4d74f209b6be`
- Image: `alex-kiber-release:sha-6b88d7e`
- Image ID: `sha256:744aafb03514c5573cb8e8b39da229f26bc52f3291fdbb7033e731455bbe24cf`
- Build date: `2026-09-01T04:05:12Z`
- Deploy env: `production`
- Design review routes: disabled
- Analytics provider: disabled

## Immutable image evidence

Image labels verified by `docker image inspect`:

- `deployed.commit = 6b88d7eb5720d88430b3ea74375d4d74f209b6be`
- `deployed.version = sha-6b88d7e`
- `org.opencontainers.image.revision = 6b88d7eb5720d88430b3ea74375d4d74f209b6be`
- `org.opencontainers.image.version = sha-6b88d7e`
- `org.opencontainers.image.created = 2026-09-01T04:05:12Z`

The versioned build script refused dirty trees by default, so the image maps to the committed source SHA.

## Verification

Commands/evidence:

- Docker release build: `BUILD_SHA=6b88d7eb5720d88430b3ea74375d4d74f209b6be IMAGE_REPOSITORY=alex-kiber-release DEPLOY_ENV=production DESIGN_REVIEW_ENABLED=false PUBLIC_ANALYTICS_PROVIDER=disabled scripts/docker-versioned-build.sh`
- Build log: `/home/alex/.hermes/cache/terminal-output/out-1788235512-3621618-1ad0.log`
- Dockerfile build stage ran `npm run verify` and production `npm run build` successfully.
- Smoke container: `alex-kiber-release-smoke-6b88d7e`
- Host ports: none published.
- Smoke result: `/healthz/` returned `ok`, `/readyz/` returned `ready`, `/` and `/robots/arenda-unitree-g1/` served content, container health became `healthy`.
- Smoke log: `/home/alex/.hermes/cache/terminal-output/out-1788235649-3621618-dc90.log`

## Explicitly not approved / not changed

- production deploy allowed = `false`
- DNS change allowed = `false`
- production secrets change allowed = `false`
- live lead routing allowed = `false`
- analytics provider IDs/cookies allowed = `false`

## Remaining before production

1. **Full-site visual QA** — собрать и проверить дизайн остальных страниц сайта: категории/подборки/блог/новости/контакты/заявка/legal/404/карточки роботов на desktop/tablet/mobile.
2. **KIBER-57/KIBER-58/KIBER-64** — live lead routing: amoCRM + Telegram duplicate + разрешённые тестовые заявки.
3. **KIBER-67** — analytics provider IDs/cookies and consent policy approval.
4. **KIBER-68** — финальный backup Tilda/sitemap/production data.
5. **KIBER-72** — DNS cutover только отдельным явным разрешением.

## Owner decision needed

KIBER-70 can be considered approved only after the owner explicitly says the release candidate is approved for the next launch step. Production/DNS/secrets/live-routing still remain separate explicit approvals.
