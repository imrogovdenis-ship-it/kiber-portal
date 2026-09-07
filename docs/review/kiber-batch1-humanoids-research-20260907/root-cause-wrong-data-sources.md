# Root cause — wrong data sources in robot-card batch generation

The repeated gallery/Gosha failures came from keeping unsafe fallbacks in the active render path.

## Removed/demoted

- Removed component-level generic Gosha quote fallback from `RobotCardTemplate.astro`.
- Curated robot cards now receive `goshaQuote` from explicit per-slug data; curated cards throw if it is missing.
- Demoted `robots.generated.json` gallery fallback to unprepared preview-only use; curated Batch/approved cards require explicit converted gallery assets.
- `/images/kiber-45/<slug>.webp` remains Hero/catalog only and is blocked from gallery runtime.
- `legacy_horizontal_hero` / `__photo` Tilda backgrounds remain archive/provenance only.

## Why it happened

Earlier tests accepted structural presence (`H1`, `seoIntent`, capability images) but did not assert the actual content source. That allowed the wrong data layer to look technically valid. The fix adds source and rendered guards for exact runtime image paths, balanced split, vertical-first mobile affordance, and unique model-specific Gosha quotes.
