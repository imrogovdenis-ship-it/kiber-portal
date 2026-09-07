# Robot-card generation rules cleanup — 2026-09-07

## Source reviewed

Reviewed the latest KettyBot/service-card loop from session history/current context and compared it with the approved KIBER-94 robot-card contracts, media skill references, current PR8 source, tests, and media registries.

## Errors found and blocked

1. Wrong contour was used for service-card batch work: `/home/alex/projects/kiber-portal` branch `hermes/kiber-42-44-price-decision-pack`, old `app/src/components/robots/*`, public-like `/arenda-*` routes.
2. Build/render smoke was treated as readiness even though Wordstat/SERP/competitor/content-gap chain and approved visual contract were missing.
3. Generic class demand (`аренда робота официанта`) risked being used as robot-card primary keyword; robot cards must be exact-model/entity pages.
4. Preview title/description leaked service label `KIBER-94 preview`.
5. `seoIntent` was incomplete before correction.
6. Hero eyebrow/buttons drifted to center after owner required left alignment with H1/price.
7. Gallery source was taken from reduced/generated data instead of full upper/lower source-gallery archive.
8. A legacy Tilda hero/background image was placed into KettyBot gallery; now runtime-blocked.
9. White-background product shots were used as gallery photos; gallery should prefer event/location photos.
10. White-gutter fix temporarily forced `object-fit: cover`/square/crop behavior, violating approved aspect-preserving gallery contract.
11. Mobile square `aspect-ratio: 1 / 1` was reintroduced for robot-card galleries; now guarded.
12. Capability images must stay separate from Hero/catalog/gallery and come only from `data/models/robot-capability-images.source.json`.

## Correct rules fixed in project

- `data/content-contracts/kiber-robot-card-generation-guardrails.json`
- `docs/content-contracts/kiber-robot-card-generation-guardrails.md`
- `data/review/kiber-94-robot-card-design-structure-approval.json`
- `docs/review/kiber-94-robot-card-preview/robot-card-structure-contract.md`
- `tests/visual/kiber94-robot-card-preview.test.ts`
- media registries keep legacy Tilda hero rights approval but add runtime/gallery/Hero block flags.

## Safety boundaries

No production deploy, DNS, secrets, analytics, live lead routing, merge, or mass scaling approval is implied.
