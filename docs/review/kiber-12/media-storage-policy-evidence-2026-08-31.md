# KIBER-12 media storage policy evidence

Date: 2026-08-31
Issue: KIBER-12 / KP-012
Scope: disk reserve and media storage policy for the controlled rebuild branch.

## Summary

KIBER-12 is closed by the owner-selected Git LFS storage policy plus verified disk reserve evidence.

The policy is recorded in:

- `data/review/media-storage-policy.json`

The CI gate is recorded in:

- `scripts/media-storage-policy-smoke.mjs`
- `tests/visual/media-storage-policy.test.ts`
- `npm run test:media-storage-policy`

## Disk reserve evidence

Measured on 2026-08-31 for `/home/alex/projects/kiber-portal-pr8`:

```text
Filesystem: /dev/sda1
Size:       59G
Used:       47G
Available:  9.8G
Use:        83%
```

Policy threshold for this PR/staging work: at least `5 GiB` available.

Result: `9.8 GiB` available, sufficient for current staging and CI work.

No broad Docker/server cleanup was performed. Shared cleanup can affect non-Alex services and requires separate operator approval.

## Storage policy

Owner decision: **variant A — Git LFS** for existing legacy original/provenance images.

Policy:

- Runtime/public assets live under `public/images/`.
- Runtime raster assets must be optimized WebP/AVIF; SVG is allowed for vector/brand/service assets.
- Runtime pages must not reference `site-export/images` originals.
- Review/provenance originals live under `site-export/images/`.
- `site-export/images/**` is tracked through Git LFS:
  - `site-export/images/** filter=lfs diff=lfs merge=lfs -text`
- Incoming drops under `incoming/` / `upload/` stay ignored until explicitly optimized or migrated to Git LFS.
- Docker context excludes review/incoming roots:
  - `site-export`
  - `incoming`
  - `artifacts`

## Current media evidence

From the KIBER-49 media hygiene gate and KIBER-12 policy smoke:

- Runtime images: `39` in latest media hygiene report after current homepage pass
- Runtime image footprint: `815.4 KiB`
- Review originals under `site-export/images`: `510`
- Review originals tracked through Git LFS: `510 / 510`
- Review originals not in Git LFS: `0`
- Rendered `dist/` references to `site-export/images`: `0`

## Verification commands

```text
node --import tsx --test tests/visual/media-storage-policy.test.ts
npm run test:media-git-hygiene
npm run test:media-storage-policy
npm run ci
```

Focused result:

```text
KIBER-49 media Git hygiene smoke passed: 39 runtime images / 815.4 KiB; 510/510 review originals tracked through Git LFS.
KIBER-12 media storage policy smoke passed: 510/510 review originals in LFS; disk reserve 9.8 GiB.
```

## Safety boundaries

No production deploy, DNS/domain, production secrets, analytics provider, live lead routing, amoCRM/Telegram destinations, shared Docker cleanup, or non-`alex-*` containers were changed.

## Remaining related work

KIBER-12 closes the current storage policy/disk reserve criterion. Future large media imports should follow this policy: keep incoming drops ignored, optimize runtime images into `public/images/`, and migrate approved originals/provenance to Git LFS or external object storage only by explicit decision.
