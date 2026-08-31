# KIBER-47 media rights and meaningful asset roles closure

Date: 2026-08-31
Issue: KIBER-47 / KP-068
Scope: launch media rights and role registry for robot media assets.

## Summary

KIBER-47 is closed by the current media-rights registry and review package. The package records, for every launch robot media record:

- robot/context route;
- meaningful asset role (`hero`, `gallery`, `legacy_horizontal_hero` where applicable);
- source path;
- alt source/text;
- rights status;
- owner approval evidence.

This closure depends on the now-closed KIBER-12 media storage policy: originals/provenance stay under Git LFS and runtime assets stay optimized under `public/images/`.

## Artifacts

- `data/review/media-rights-registry.json` — KIBER-47 registry for generated robot hero/gallery media.
- `data/review/media-rights-review-package.json` — KIBER-47 review package for 24 robots and 191 assets including legacy horizontal heroes.
- `data/review/media-rights-legacy-hero-images.json` — legacy horizontal hero coverage tied to KIBER-47.
- `data/review/media-rights-robot-cards.json` — per-robot owner-approved media cards.
- `docs/review/media-rights/review-package.md` — human-readable package.
- `docs/review/media-rights/media-rights-registry-report.json` — generated smoke report.
- `docs/review/media-rights/review-package-report.json` — generated review-package smoke report.

## Evidence

- Robots covered: `24 / 24`.
- Generated hero/gallery media records: `167`.
- Legacy horizontal hero images covered: `24`.
- Total package assets including legacy heroes: `191`.
- Production-media approval recorded: `24 robots / 191 assets`.
- Needs rights review: `0`.
- Owner approval recorded: `Александр Маркин`, `2026-08-29T00:55:09Z`.

## Verification

Focused commands run:

```text
node --import tsx --test tests/visual/media-rights-registry-contract.test.ts tests/visual/media-rights-review-package.test.ts tests/visual/media-rights-legacy-hero-images.test.ts tests/visual/media-rights-robot-cards.test.ts
npm run test:media-rights
npm run test:media-rights-review-package
npm run ci
```

Results:

```text
media-rights focused tests: 8/8 passed
KIBER media rights registry smoke passed: 24 robot media records have owner media approval; production deploy remains separately blocked.
KIBER media rights review package smoke passed: 24 robots, 191 assets including legacy heroes, productionApproved=24; production deploy remains separately blocked.
npm run ci: passed locally, including 156 visual tests and media-rights gates.
```

## Safety boundary

KIBER-47 closes media rights / meaningful asset role readiness only.

It does **not** approve or change:

- production deploy;
- DNS/domain;
- production secrets;
- analytics provider IDs/cookies;
- live lead routing;
- amoCRM / Telegram destinations;
- shared Docker cleanup;
- non-`alex-*` containers.

Production go/no-go remains controlled by separate approval gates.
