# Protected staging update pre-change note — 2026-08-30

## Change

Update the existing Alex-owned protected staging container `alex-kiber-staging` to the current controlled rebuild HEAD of `codex/kiber-15-controlled-rebuild`.

## Affected scope

- Docker image: `alex-kiber-staging:sha-<current commit>`
- Docker container: `alex-kiber-staging`
- Existing Docker network: `coolify`
- Existing Traefik labels on the same container will be preserved.

## Explicitly excluded scope

- No production deploy.
- No DNS/domain changes.
- No production secrets changes.
- No analytics provider IDs/cookies activation.
- No live lead routing / amoCRM / Telegram destination activation.
- No changes to shared containers (`coolify`, `coolify-proxy`, `ai-class-*`, `umami*`, `qdrant`, `hermes*`).

## Rollback

Rollback to the previous staging image tag recorded before replacement via `docker inspect alex-kiber-staging`.
Only the Alex-owned `alex-kiber-staging` container would be replaced back; no shared services touched.

## Verification

- `npm run ci` passes locally before image build.
- Versioned Docker image labels match Git commit SHA.
- Container health is `healthy`.
- No host ports are published.
- Unauthenticated HTTPS returns `401` with Basic Auth.
- Authenticated `/healthz/`, `/readyz/`, `/`, robot/category/contact/lead/thanks/design-review routes return `200`.
- Unknown URL returns `404`.
- `X-Robots-Tag: noindex, nofollow` is present.
- Production analytics scripts remain absent.
- GitHub PR #8 CI remains green.

## Approval boundary

This is a protected staging update for first server-visible review. Denis approval is not required because it stays inside Alex-owned container/image scope and does not modify DNS, production, secrets, or shared services.
