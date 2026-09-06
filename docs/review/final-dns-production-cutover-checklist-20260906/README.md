# Final DNS / production cutover checklist — KIBER PORTAL

Status: **ready for final production command, not executed yet**.

## Candidate

- Repo: `imrogovdenis-ship-it/kiber-portal`
- Branch: `main`
- Commit: `12ef3d6dd54f1fc5c6ef780eb14e126cd0d51ea3`
- Dynamic staging URL: <https://alex-kiber-mobile-review-e489e77.38.180.37.42.nip.io>
- Dynamic image: `alex-kiber-dynamic-staging:main-dynamic-20260906-12ef3d6-r2`
- Staging container: `alex-kiber-staging`

## Verified before cutover

- Main RC approved by owner as production candidate.
- Dynamic/API staging is healthy, no host ports, and protected from indexing with `X-Robots-Tag: noindex, nofollow`.
- `/api/leads/status` returns HTTP 200.
- One owner-authorized staging `/api/leads` submission returned `ok=true`, `mode=live`, `amoCRM.ok=true`, `telegram.ok=true`.
- Analytics decision: launch without Yandex Metrica, Umami, or pixels; connect analytics after launch.
- Current public site read-only backup stored at `/home/alex/projects/kiber-portal-production-backups/20260906-pre-cutover/`.

## Before touching production/DNS

1. Get explicit final production/DNS command.
2. Confirm target domain(s): `kiber-portal.ru`, `www.kiber-portal.ru`, and redirect policy.
3. Snapshot current DNS records and current public response hashes.
4. Confirm production runtime target/container/app folder and rollback target.
5. Inject production secrets through secret store/env only; never print or commit values.
6. Set `LEAD_ALLOWED_ORIGINS` to production origins only after production route is active.
7. Keep analytics disabled at launch.
8. Ensure staging remains noindex; remove noindex only from production route if publication is intended.

## Immediate post-cutover smoke

- `/` — HTTP 200, production canonical, no staging noindex/header.
- `/robots.txt` and `/sitemap.xml` — HTTP 200 and production URLs.
- `/lead/request/` — HTTP 200, form action `/api/leads`.
- `/api/leads/status` — HTTP 200.
- Legal: `/privacy-policy/`, `/cookie-policy/`, `/terms/`, `/consent/` — HTTP 200.
- Launch routes: `/robots/arenda-unitree-g1/`, `/compilations/`, `/articles/` — HTTP 200.
- Analytics scripts: absent at launch.
- Optional only with separate owner authorization: one production test lead; verify amoCRM + Telegram receipts with secrets redacted.

## Rollback

- DNS issue: restore previous DNS target/record path.
- Container issue: recreate previous known-good production container/image.
- Lead routing issue: set production `LEAD_ROUTING_MODE=dry-run` or disable live routing; keep messenger fallback visible.
- TLS issue: route back to previous public site while fixing cert/Traefik labels.

## Explicitly deferred

- Yandex Metrica.
- Umami.
- Pixels.
- Mass content expansion beyond current `main` launch scope.
