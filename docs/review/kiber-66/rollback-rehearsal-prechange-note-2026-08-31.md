# KIBER-66 rollback rehearsal pre-change note

Date: 2026-08-31
Issue: KIBER-66 / KP-103
Scope: non-production protected staging rollback rehearsal only.

## What will change

Temporarily replace the Alex-owned protected staging container `alex-kiber-staging` from the current homepage full parity image to the previous known-good image, verify it, then restore the current image and verify again.

Planned sequence:

1. Record current image/commit/version and rollback target.
2. Recreate `alex-kiber-staging` with previous known-good image while preserving existing labels, Basic Auth middleware, noindex header, env, restart policy and network.
3. Verify staging invariants.
4. Recreate `alex-kiber-staging` back to current image.
5. Verify final staging invariants and record measured recovery timings.

## Affected infrastructure

Only:
- Docker container: `alex-kiber-staging`
- Docker images already present locally: `alex-kiber-staging:sha-27f5e21` and `alex-kiber-staging:sha-d5e2ddc`
- existing Coolify/Traefik network attachment: `coolify`

No changes to:
- production container/domain/DNS;
- shared Coolify/Traefik services;
- non-`alex-*` containers;
- secrets/analytics/live lead routing.

## Rollback plan

If restoring current image fails, restore the last verified image recorded immediately before the rehearsal and keep Basic Auth/noindex labels intact. If both target images fail, stop and report without touching shared services.

## Verification plan

For both rollback and restore stages:
- container exists and is `healthy`;
- no host ports are published;
- unauthenticated `/` returns `401` and `WWW-Authenticate`;
- authenticated `/healthz/` returns `200`;
- authenticated `/` returns `200`;
- `X-Robots-Tag: noindex, nofollow` header remains present;
- analytics scripts remain absent;
- expected page marker is present.

## Approval boundary

Denis approval required: no, because this is limited to Alex-owned `alex-kiber-staging` and does not modify shared services or production.
