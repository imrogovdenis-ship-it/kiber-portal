# KIBER-22 health/readiness and resource limits evidence

## Summary

Adds the missing readiness endpoint and documents the Coolify resource-limit/blast-radius contract for the static Nginx runtime.

## Runtime contract

- Docker `HEALTHCHECK` remains on `/healthz/`.
- Nginx exposes `/healthz/` returning `ok`.
- Nginx now exposes `/readyz/` returning `ready`.
- Both endpoints are plain text, no-cache, and include the runtime security headers.

## Coolify resource contract

Documented in `COOLIFY.md`:

```text
CPU limit: 0.50 vCPU
Memory limit: 512Mi
Healthcheck path: /healthz/
Readiness path: /readyz/
Container namespace: alex-*
No host ports; route only through existing Coolify/Traefik proxy contour
```

The contract explicitly bounds blast radius so KIBER Portal failure does not impact shared services (`coolify`, `coolify-db`, `coolify-redis`, `coolify-proxy`, `ai-class-*`, `umami*`, `qdrant`, `hermes*`).

## Validation

Static/TDD gates:

```text
node --import tsx --test tests/visual/runtime-readiness-limits.test.ts — passed
npm run ci — passed
```

Docker build/runtime smoke:

```text
docker build -t alex-kiber-k22-readiness-test:<shortSha> . — passed
docker run --cpus=0.50 --memory=512m --network none --name alex-kiber-k22-readiness-test ...
Docker health status — healthy
/healthz/ — ok
/readyz/ — ready
ports={} cpus=500000000 memory=536870912 health=healthy
```

The temporary test container was removed after verification.

## Safety

No production deploy, DNS, secrets, analytics provider IDs, real lead destination, legal/consent policy, shared containers, or host ports changed.
