# KIBER-49 — media Git hygiene evidence

Date: 2026-08-31

## Scope

Autonomous non-design pass for `[KP-069] Оптимизировать web-media и убрать originals из обычного Git`.

This pass does not change visual media choices. It adds enforceable runtime/build hygiene and prevents new original/provenance media from being added to ordinary Git while the final storage target remains unapproved.

## Implemented

- Added `scripts/media-git-hygiene-smoke.mjs`.
- Added `npm run test:media-git-hygiene` and wired it into `npm run ci`.
- Added `tests/visual/media-git-hygiene.test.ts` source contract.
- Added `.gitignore` rules to keep new originals/provenance media out of ordinary Git:
  - `site-export/images/`
  - `incoming/`
  - `upload/`
  - large/design/archive raw formats (`*.zip`, `*.psd`, `*.ai`, `*.mov`, `*.tif`, etc.)
- Generated `docs/review/kiber-49/media-git-hygiene-report.json`.

## Current measured state

From the generated KIBER-49 report:

- tracked media files: 713
- tracked media bytes: 164,948,430
- public runtime images: 27
- public runtime image bytes: 356,930
- largest public runtime image: 29,624 bytes
- tracked legacy review originals under `site-export/images`: 510
- tracked legacy review originals bytes: 102,127,050
- oversized tracked review originals over 500 KiB: 41
- `git lfs` available on this host: false

## Guardrails now enforced

- Runtime public images under `public/images/` must stay within the 200 KiB per-file budget.
- Runtime public images must use WebP/AVIF/SVG formats.
- Runtime source roots must not reference `site-export/images` originals.
- Rendered `dist` must not reference `site-export/images` originals when a build is present.
- Docker build context must exclude review/original media roots (`site-export`, `incoming`, `artifacts`).
- New originals are ignored before they enter ordinary Git.

## Remaining blocker

Legacy originals are still present in existing Git history/current tracked files because the approved storage target is not selected and `git-lfs` is not installed on this host.

To fully close the storage half of KIBER-49, choose one of:

1. Git LFS for `site-export/images` and other raw/original media; or
2. object storage with a manifest that replaces local review links with storage references.

Until then, this PR prevents regressions and keeps production/runtime media optimized without guessing storage or deleting provenance assets.

## Safety boundary

No production deploy, DNS, secrets, analytics provider, or live lead routing changed.
