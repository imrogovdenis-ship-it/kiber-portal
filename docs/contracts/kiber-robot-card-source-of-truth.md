# KIBER robot card source of truth contract

Status: **working_source_of_truth_pending_owner_review**

Owner note: Александр поручил вынести правила robot-card workflow из навыка в repository contracts по модели article contracts. Эти файлы являются рабочим source of truth; при последующих изменениях править и contracts, и skill.

Scope: robot-card pages under `/robots/...`, current KIBER PORTAL preview/review workflow, card data packages, media, SEO and QA gates.

Purpose: make repository files the primary durable source of truth for robot-card production so future agents do not reconstruct approvals from chat, memory, preview links or scattered review notes.

## Authority model

1. **Repository contracts and approval registry** are the primary durable source for robot-card rules.
2. **Current repo implementation** is the primary technical source for components, data contracts, routes, facts and media paths.
3. **SEO working map** records current/desired SEO state, priorities, next actions and conflicts.
4. **Jino preview** is an owner review surface, not production approval.
5. **Chat/session/memory** are discovery and immediate owner direction only; stable rules must be converted into these contracts and source files.

## Contract package

- `docs/contracts/kiber-robot-card-source-of-truth.md`
- `docs/contracts/kiber-robot-card-source-of-truth.json`
- `docs/contracts/kiber-robot-card-block-contract.md`
- `docs/contracts/kiber-robot-card-style-contract.md`
- `docs/contracts/kiber-robot-card-media-contract.md`
- `docs/contracts/kiber-robot-card-seo-contract.md`
- `docs/contracts/kiber-robot-card-readiness-checklist.md`

## Canonical runtime implementation

```text
src/pages/robots/[slug].astro
src/lib/robot-pages.ts
src/content/robots.generated.json
src/lib/kiber94-robot-template-data.ts
src/components/templates/RobotCardTemplate.astro
src/lib/page-type-templates.ts
```

## Canonical data sources

```text
data/content/robot-card-pilot/<slug>.json
src/content/robots.generated.json
data/models/robots.source-of-truth.json
data/models/robot-tariffs.json
data/models/robot-catalog-card-images.live.json
data/models/robot-capability-images.source.json
data/content/home-catalog-titles.json
data/content/catalog-short-descriptions.json
data/seo/working-key-map/seo-key-map.table.json
```

## Work mode

Robot cards are remediated **one card at a time**:

```text
card selection → source/SEO/media audit → card package update → implementation/build → Jino preview → owner acceptance → next card
```

Do not mass-rewrite all 24 cards unless Alexander explicitly changes the workflow.

## Update rule

When robot-card workflow rules change, update:

1. the relevant `docs/contracts/kiber-robot-card-*.md` file;
2. `docs/contracts/kiber-robot-card-source-of-truth.json` if source paths/statuses change;
3. the Hermes skill `kiber-robot-card-approved-batch-workflow` only as a compact instruction pointing to these contracts.

## Media alt source files and policy

Robot-card alt text policy is governed by `docs/contracts/kiber-robot-card-media-contract.md`. Source media metadata lives primarily in:

```text
data/models/robot-capability-images.source.json
data/models/robot-catalog-card-images.live.json
src/content/robots.generated.json
```

Use `sourceAlt` as evidence only. Public/rendered `alt` must be checked `seoAlt`/equivalent text grounded in `actualDescription`, with no internal block/CMS boilerplate. The Unitree G1 correction on 2026-09-18 is the current reference pattern.

## Related compilations rule

Robot-card pages are excluded from the shared «Подборки» related-compilations block by owner rule. The cross-site block contract is `docs/contracts/kiber-related-compilations-block-contract.md`; use it for audits, but do not add that block to robot-card templates without explicit owner instruction.

## Blog Gosha rule

Robot-card pages are excluded from the shared «Блог Кибер Гоши» block by owner rule. The cross-site block contract is `docs/contracts/kiber-blog-gosha-block-contract.md`; use it for audits, but do not add that block to robot-card templates without explicit owner instruction.
