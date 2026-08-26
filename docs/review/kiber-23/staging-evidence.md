# KIBER-23 / KP-026 — protected staging evidence

Date: 2026-08-26

## Scope

This is the first protected staging slice for PR #8 / controlled rebuild.

No production deploy, DNS change, production secret, analytics, or lead destination was changed.

## Staging endpoint

- URL: `https://alex-kiber-staging.38.180.37.42.sslip.io/`
- Design review: `https://alex-kiber-staging.38.180.37.42.sslip.io/preview/design-review/`
- Health: `https://alex-kiber-staging.38.180.37.42.sslip.io/healthz/`

Access is protected by Traefik Basic Auth. The password is intentionally not stored in Git or comments.

Credential material on the server:

- `/home/alex/.hermes/state/kiber-23-staging-basic-auth.env` — local secret file, mode `600`;
- `/home/alex/.hermes/state/kiber-23-staging-basic-auth.hash` — Traefik htpasswd hash, mode `600`.

## Runtime

- Container: `alex-kiber-staging`
- Image: `alex-kiber-staging:05be290`
- Network: `coolify`
- Deployed commit label: `05be290599ebbe734815363a08309eee1bcad8bf`
- Direct host ports: none (`docker port alex-kiber-staging` returns no mappings)
- Internal exposed ports only: `80/tcp`, `8080/tcp`
- Health: `healthy`

## Verification

Unauthenticated HTTPS request:

```text
GET https://alex-kiber-staging.38.180.37.42.sslip.io/
→ HTTP/2 401
→ WWW-Authenticate present
```

Authenticated checks:

```text
GET /healthz/
→ HTTP/2 200
→ body: ok
→ X-Robots-Tag: noindex, nofollow

GET /preview/design-review/
→ HTTP/2 200
→ X-Robots-Tag: noindex, nofollow
→ <meta name="robots" content="noindex, nofollow"> present
→ production analytics scripts absent
```

Plain HTTP request:

```text
GET http://alex-kiber-staging.38.180.37.42.sslip.io/
→ HTTP/1.1 302 Found
→ Location: https://alex-kiber-staging.38.180.37.42.sslip.io/
```

## Rollback

```bash
docker rm -f alex-kiber-staging
```

Rotate/remove local Basic Auth material if needed:

```bash
rm -f /home/alex/.hermes/state/kiber-23-staging-basic-auth.env \
      /home/alex/.hermes/state/kiber-23-staging-basic-auth.hash
```

## Caveat

This satisfies the observable staging criteria — HTTPS, Basic Auth, noindex, no direct public host ports — through the existing Traefik/Coolify network using an Alex-owned container.

If KIBER-23 is interpreted strictly as “must be created as a managed Coolify application in the Coolify UI”, that remains a separate Coolify-application registration step. This slice deliberately avoided production/DNS/shared-service changes.
