# Canonical release candidate — NO_GO

24 robots reuse approved RobotCardTemplate; humanoid compilation reuses approved CompilationTemplate; six articles are built from isolated approved source snapshots with frozen renderer contracts. No compiled HTML imported as source. Snapshot provenance: source-manifest.json. Common article rhythm from approved style pass. Consolidation of legacy branch-specific renderer variants must not change accepted content.

Production build and Astro typecheck PASS. Text/media parity31/31; article geometry at1440/390 matches. Unique IDs repaired without copy change. Canonical route gate PASS: H1/canonical/IDs/images/sitemap, no preview href/output. Deferred news/dogs are noindex and excluded from sitemap. Two article canonical metadata mismatches corrected to match chosen /articles/<slug>/ routes; no public redirect/cutover performed.

Source/typecheck tests: 251/251 PASS, content tests 2/2 PASS, compilation post-build tests 3/3 PASS. Post-build chain: 35/36 PASS. Only legacy total-image/per-page byte budget remains red; limits NOT raised and approved media NOT recompressed. Exact status: RELEASE_STATUS.json, postbuild-gates-current.json and performance-budget-report.json. Width/height attributes added from verified raster files to remove layout-shift guard failures. Article schemas corrected to BlogPosting. Metadata titles keep brand; visible approved body text/images still31/31 identical.

No staging changes, merge, production, DNS, secrets, analytics or lead routing. Existing staging remains approved review surface. Canonical candidate is not ready to deploy until full CI and final runtime checks pass.

Verification: npm run build:production; node scripts/check-canonical-release.mjs; python3 scripts/audit-canonical-release.py /path/to/approved-staging-snapshot. FullCI: npm run ci.
