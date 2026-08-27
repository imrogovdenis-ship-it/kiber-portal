# KIBER-25 / KP-029 — versioned Docker images by commit SHA

Date: 2026-08-26

## Goal

Every staging/release Docker image must be traceable to a Git commit and selectable for rollback.

## Contract

A versioned KIBER PORTAL image has:

- immutable-ish tag based on commit SHA: `sha-<shortSha>`;
- OCI revision label: `org.opencontainers.image.revision=<fullSha>`;
- deployment label: `deployed.commit=<fullSha>`;
- version label: `org.opencontainers.image.version=sha-<shortSha>`;
- deployment version label: `deployed.version=sha-<shortSha>`;
- build timestamp label: `org.opencontainers.image.created=<UTC ISO timestamp>`.

The Dockerfile accepts these build args:

```text
BUILD_SHA
IMAGE_VERSION
BUILD_DATE
VCS_URL
```

The same values are exposed as runtime `ENV` for container inspection/debugging.

## Build command

Preferred script:

```bash
IMAGE_REPOSITORY=alex-kiber-staging \
DEPLOY_ENV=preview \
DESIGN_REVIEW_ENABLED=true \
npm run docker:build:versioned
```

Default output tag:

```text
alex-kiber-staging:sha-<shortSha>
```

For production/release builds, use a release repository name and production build variables; do not deploy production without explicit approval.

```bash
IMAGE_REPOSITORY=alex-kiber-portal \
DEPLOY_ENV=production \
DESIGN_REVIEW_ENABLED=false \
PUBLIC_ANALYTICS_PROVIDER=<approved-provider> \
npm run docker:build:versioned
```

## Inspect command

```bash
docker inspect <image-or-container> --format \
  'revision={{index .Config.Labels "org.opencontainers.image.revision"}} deployed={{index .Config.Labels "deployed.commit"}} version={{index .Config.Labels "deployed.version"}} image={{.Config.Image}}'
```

Expected:

- `revision` equals the Git commit SHA;
- `deployed` equals the same Git commit SHA;
- `version` equals `sha-<shortSha>`;
- image tag contains the same short SHA.

## Rollback selection

1. Pick the target SHA from Linear/PR evidence, `docs/review/*`, or Docker labels.
2. Find matching local/registry image:

```bash
docker images --format '{{.Repository}}:{{.Tag}}' | grep 'sha-<shortSha>'
```

3. Redeploy the selected image with the same Traefik/Coolify labels and `deployed.commit=<fullSha>`.
4. Verify the protected staging/release invariants:
   - healthcheck returns `ok`;
   - protected staging keeps Basic Auth/noindex/no public host ports;
   - production release checks require separate approval.

## Verification checklist

- `npm run verify` passes.
- `npm run docker:build:versioned` builds an image tagged `sha-<shortSha>`.
- `docker inspect` shows matching `org.opencontainers.image.revision`, `org.opencontainers.image.version`, `deployed.commit`, and `deployed.version` labels.
- A container created from the image preserves the same labels.
- The build script refuses dirty working trees by default; commit or stash changes before producing staging/release evidence.
- Rollback docs reference image tags by commit SHA, not mutable names like `latest`.

## Dirty tree guard

`npm run docker:build:versioned` refuses to build by default when tracked files are modified or staged. This prevents a false claim that an image exactly matches `BUILD_SHA`.

For throwaway local experiments only:

```bash
ALLOW_DIRTY_BUILD=true npm run docker:build:versioned
```

Do not cite dirty images as staging/release acceptance evidence.

## Safety

Do not use mutable `latest` as evidence for staging/release acceptance. It may exist for local convenience, but Linear/PR evidence must always cite the commit SHA and versioned image tag.
