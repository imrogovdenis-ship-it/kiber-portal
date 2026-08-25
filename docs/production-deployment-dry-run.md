# KIBER PORTAL — production deployment dry-run plan

Дата: 2026-08-25  
Статус: `dry_run_only_no_infrastructure_changes`

Этот документ описывает безопасный план production deployment для Astro-версии КИБЕР ПОРТАЛА. Он **не выполняет деплой**, не меняет DNS, не трогает Coolify/Traefik, не активирует редиректы, формы или аналитику.

## Scope

Target project:

```text
/home/alex/projects/kiber-portal
```

Preferred production app/container naming:

```text
alex-kiber-portal-web
```

Allowed Alex-owned zones:

```text
/home/alex
/home/alex/projects
/home/alex/.hermes
/data/coolify/applications/alex-*
```

Do not touch without explicit Denis approval:

```text
/root
/root/.hermes
/data/coolify/applications/ai-class-*
/data/coolify/applications/denrogov*
/data/coolify/applications/qdrant
/data/coolify/applications/umami*
/data/coolify/proxy
shared Coolify/Traefik containers
shared Hermes gateway/system services
 чужие DNS/analytics/secrets/containers
```

## Pre-change note template

Перед любым production/server action отправить отдельное сообщение:

```text
Что меняю:
- [точное действие]

Затронутые файлы/контейнеры/app folders:
- [например /data/coolify/applications/alex-kiber-portal-web]

Откат:
- [предыдущий commit/image/Coolify rollback]

Проверка:
- [docker ps/logs/curl/QA commands]

Нужно ли подтверждение Дениса:
- [да/нет и почему]
```

## Required approval before actual deployment

Production deployment requires explicit approval for:

- target Coolify application name;
- domain/subdomain;
- DNS target and whether Cloudflare proxy is allowed;
- SSL issuance through existing Coolify/Traefik contour;
- production lead destination;
- analytics/counter IDs;
- redirect activation;
- rollback window and owner.

## Local QA gate before deployment

Run from repo root:

```bash
cd /home/alex/projects/kiber-portal
python3 scripts/run_launch_qa.py
```

Required result:

```text
status=passed
steps=16
passed=16
failed=0
```

The gate includes the production-readiness matrix guard and writes:

```text
data/seo/launch-qa-summary.json
docs/launch-qa-summary.md
```

## Build artifact expectation

Astro build command:

```bash
npm --prefix app run build
```

Expected output directory:

```text
/home/alex/projects/kiber-portal/app/dist
```

The latest local QA currently expects:

```text
51 generated HTML files
42 public indexable routes
9 preview/noindex/system routes
```

## Docker/Coolify dry-run plan

No commands in this section should be run against production without explicit approval.

### 1. Identify target safely

Read-only discovery only:

```bash
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Image}}'
```

Allowed target should begin with:

```text
alex-
```

Do not stop/recreate/prune containers named:

```text
coolify
coolify-db
coolify-redis
coolify-proxy
ai-class-*
denrogov*
qdrant
umami*
hermes*
```

### 2. Build candidate image only after approval

Example name:

```bash
docker build -t alex-kiber-portal-web:<commit-sha> ./app
```

If using repo-level Dockerfile instead, document exact Dockerfile path before running.

### 3. Local container smoke test only

Use localhost-only bind, not public ports:

```bash
docker run --rm --name alex-kiber-portal-web-smoke -p 127.0.0.1:18081:80 alex-kiber-portal-web:<commit-sha>
```

Smoke checks:

```bash
curl -I http://127.0.0.1:18081/
curl -I http://127.0.0.1:18081/arenda-unitree-g1
curl -I http://127.0.0.1:18081/roboty-gumanoidy
curl -I http://127.0.0.1:18081/contacts
curl -I http://127.0.0.1:18081/404.html
curl -I http://127.0.0.1:18081/sitemap-index.xml
```

### 4. Coolify deployment only after approval

Expected Coolify app:

```text
alex-kiber-portal-web
```

Deployment should use existing Coolify/Traefik contour. Do not install another Coolify.

Required Traefik/Coolify facts before deployment:

- final domain;
- SSL policy;
- app port inside container;
- health check path;
- environment variables, if any;
- rollback image/commit.

## Rollback plan

Rollback options must be confirmed before launch:

1. Coolify rollback to previous deployment/image.
2. Git rollback to previous commit and redeploy.
3. DNS rollback to previous production target if DNS was changed.
4. Disable activated redirects/forms/analytics if they cause regressions.

Current safe git rollback reference after this dry-run doc pass:

```bash
git log --oneline -5
```

Use the previous known good commit selected during deployment approval.

## Post-deploy verification checklist

After deployment, verify without exposing secrets:

```bash
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Image}}'
docker logs --tail=100 alex-kiber-portal-web
curl -I https://www.kiber-portal.ru/
curl -I https://www.kiber-portal.ru/arenda-unitree-g1
curl -I https://www.kiber-portal.ru/roboty-gumanoidy
curl -I https://www.kiber-portal.ru/contacts
curl -I https://www.kiber-portal.ru/404.html
curl -I https://www.kiber-portal.ru/sitemap-index.xml
```

Also check:

- browser console on representative pages;
- broken images;
- CTA behavior against approved lead destination;
- analytics events in approved account only;
- robots/sitemap/canonicals after live domain is active;
- no unrelated AI Class containers changed.

## Production blockers still outside code

Deployment must wait for:

- approved contacts/requisites;
- approved lead destination;
- approved analytics IDs/events;
- approved redirect map;
- SEO expansion materials from Alexander/Claude;
- approval from Denis for DNS/SSL/Coolify production switch if required.

## Current dry-run decision

Status remains:

```text
dry_run_only_no_infrastructure_changes
```

The repository is technically prepared for a controlled deployment discussion, but no production infrastructure should be changed until the approvals above are provided.
