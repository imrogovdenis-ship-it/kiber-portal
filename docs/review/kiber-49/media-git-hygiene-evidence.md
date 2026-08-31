# KIBER-49 — media Git hygiene evidence

Date: 2026-08-31

## Scope

Autonomous non-design pass for `[KP-069] Оптимизировать web-media и убрать originals из обычного Git`.

Alexander selected **variant A: Git LFS** for existing legacy original/provenance images.

This pass does not change visual media choices. It keeps public/runtime assets optimized and migrates legacy review originals under `site-export/images` to Git LFS pointers without rewriting repository history.

## Implemented

- Installed/enabled Git LFS in the local repository (`git lfs install --local`).
- Added `.gitattributes` tracking for legacy originals and raw/provenance formats:
  - `site-export/images/**`
  - `*.zip`, `*.psd`, `*.ai`, `*.sketch`, `*.fig`, `*.mov`, `*.mp4`, `*.tif`, `*.tiff`, `*.heic`, `*.raw`
- Migrated existing tracked `site-export/images` files to Git LFS pointers using `git add --renormalize site-export/images`.
- Updated GitHub Actions checkout to fetch LFS objects (`actions/checkout@v4` with `lfs: true`) before CI runs the media gate.
- Kept `incoming/` and `upload/` ignored for new unreviewed drops, but did not broad-track `incoming/**` in LFS to avoid converting non-media content packages unnecessarily.
- Added `scripts/media-git-hygiene-smoke.mjs`.
- Added `npm run test:media-git-hygiene` and wired it into `npm run ci`.
- Added `tests/visual/media-git-hygiene.test.ts` source contract.
- Generated `docs/review/kiber-49/media-git-hygiene-report.json`.

## Current measured state

From the generated KIBER-49 report:

- runtime public images: 27
- runtime public image bytes: 356,930
- largest public runtime image: 29,624 bytes
- tracked legacy review originals under `site-export/images`: 510
- Git LFS tracked review originals: 510 / 510
- review originals not in LFS: 0
- `git lfs` available on this host: true

Working-tree files remain available at their normal paths for review/provenance, while the Git index stores LFS pointers for the migrated originals.

## Guardrails now enforced

- Runtime public images under `public/images/` must stay within the 200 KiB per-file budget.
- Runtime public images must use WebP/AVIF/SVG formats.
- Runtime source roots must not reference `site-export/images` originals.
- Rendered `dist` must not reference `site-export/images` originals when a build is present.
- Docker build context must exclude review/original media roots (`site-export`, `incoming`, `artifacts`).
- `.gitattributes` must route `site-export/images/**` through Git LFS.
- New originals/raw media are ignored before they enter ordinary Git unless explicitly migrated to LFS.

## Closure status

KIBER-49 variant A is closed in this PR: existing `site-export/images` review originals are tracked through Git LFS, runtime/build media are optimized, and CI prevents regressions.

## Safety boundary

No production deploy, DNS, secrets, analytics provider, or live lead routing changed.
