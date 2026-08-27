# KIBER-24 / KP-030 — staging rollback runbook and evidence

Date: 2026-08-26

## Goal

Verify that the protected staging environment can be rolled back to a previous known-good image using a repeatable runbook, then restored to the current PR head.

## Scope

Only Alex-owned staging was touched:

- container: `alex-kiber-staging`;
- network: `coolify`;
- hostname: `alex-kiber-staging.38.180.37.42.sslip.io`;
- local helper scripts outside the repo: `/home/alex/kiber-24-rollback/`.

No production deploy, merge, DNS change, production secret, analytics, or lead destination was changed.

## Protected staging invariants

Rollback must preserve:

- HTTPS route through Traefik;
- Basic Auth on all routes;
- noindex header and preview meta robots;
- no direct public host port mapping;
- container healthcheck;
- rollback target selected by versioned image tag / deployed commit label.

Basic Auth credentials are intentionally not stored in Git or comments. The local secret/hash files remain server-only with mode `600` under `/home/alex/.hermes/state/kiber-23-staging-basic-auth.*`.

## Runbook

### 1. Confirm current staging state

```bash
docker inspect alex-kiber-staging \
  --format 'deployed={{index .Config.Labels "deployed.commit"}} image={{.Config.Image}} health={{.State.Health.Status}}'
```

Expected before this rehearsal:

```text
deployed=4e9bccbee63b55e1242e8907efe02fcaf49d2115 image=alex-kiber-staging:4e9bccb health=healthy
```

### 2. Verify protected staging before rollback

Run the local verifier:

```bash
/home/alex/kiber-24-rollback/verify_staging.sh baseline
```

The verifier checks:

- unauthenticated `/` returns `401` and `WWW-Authenticate`;
- authenticated `/healthz/` returns `200` and `ok`;
- authenticated `/preview/design-review/` returns `200`;
- noindex header and meta are present;
- HTTP redirects to HTTPS;
- production analytics scripts are absent.

### 3. Roll back to previous known-good image

```bash
/home/alex/kiber-24-rollback/redeploy_staging.sh \
  alex-kiber-staging:05be290 \
  05be290599ebbe734815363a08309eee1bcad8bf
```

Verify:

```bash
/home/alex/kiber-24-rollback/verify_staging.sh rollback-previous
```

Expected rollback state:

```text
deployed=05be290599ebbe734815363a08309eee1bcad8bf image=alex-kiber-staging:05be290 health=healthy
```

### 4. Restore current PR head

```bash
/home/alex/kiber-24-rollback/redeploy_staging.sh \
  alex-kiber-staging:4e9bccb \
  4e9bccbee63b55e1242e8907efe02fcaf49d2115
```

Verify:

```bash
/home/alex/kiber-24-rollback/verify_staging.sh restored-current
```

Expected restored state:

```text
deployed=4e9bccbee63b55e1242e8907efe02fcaf49d2115 image=alex-kiber-staging:4e9bccb health=healthy
```

### 5. Confirm no direct public host ports

```bash
docker port alex-kiber-staging || true
```

Expected: no output.

## Rehearsal evidence

The actual rehearsal completed successfully:

```text
## baseline current
deployed=4e9bccbee63b55e1242e8907efe02fcaf49d2115 image=alex-kiber-staging:4e9bccb health=healthy
{
  "label": "baseline",
  "unauthStatus": "HTTP/2 401 ",
  "wwwAuthenticate": true,
  "healthStatus": "HTTP/2 200 ",
  "healthBody": "ok",
  "healthNoindexHeader": true,
  "designStatus": "HTTP/2 200 ",
  "designNoindexHeader": true,
  "designNoindexMeta": true,
  "httpStatus": "HTTP/1.1 302 Found",
  "httpRedirectsHttps": true,
  "analyticsAbsent": true
}

## rollback to previous known-good image
deployed=05be290599ebbe734815363a08309eee1bcad8bf image=alex-kiber-staging:05be290 health=healthy
{
  "label": "rollback-previous",
  "unauthStatus": "HTTP/2 401 ",
  "wwwAuthenticate": true,
  "healthStatus": "HTTP/2 200 ",
  "healthBody": "ok",
  "healthNoindexHeader": true,
  "designStatus": "HTTP/2 200 ",
  "designNoindexHeader": true,
  "designNoindexMeta": true,
  "httpStatus": "HTTP/1.1 302 Found",
  "httpRedirectsHttps": true,
  "analyticsAbsent": true
}

## restore current head image
deployed=4e9bccbee63b55e1242e8907efe02fcaf49d2115 image=alex-kiber-staging:4e9bccb health=healthy
{
  "label": "restored-current",
  "unauthStatus": "HTTP/2 401 ",
  "wwwAuthenticate": true,
  "healthStatus": "HTTP/2 200 ",
  "healthBody": "ok",
  "healthNoindexHeader": true,
  "designStatus": "HTTP/2 200 ",
  "designNoindexHeader": true,
  "designNoindexMeta": true,
  "httpStatus": "HTTP/1.1 302 Found",
  "httpRedirectsHttps": true,
  "analyticsAbsent": true
}

## no host ports
deployed=4e9bccbee63b55e1242e8907efe02fcaf49d2115 image=alex-kiber-staging:4e9bccb health=healthy network=coolify
```

## Rollback command summary

Use the same redeploy helper with a known image tag and commit label:

```bash
/home/alex/kiber-24-rollback/redeploy_staging.sh <image-tag> <commit-sha>
/home/alex/kiber-24-rollback/verify_staging.sh <label>
```

This validates the KIBER-24 criterion: the previous staging version can be restored by runbook and the current staging version can be restored afterward.
