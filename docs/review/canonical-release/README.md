# Canonical release candidate — NO_GO

24 robots reuse approved RobotCardTemplate; humanoid compilation reuses approved CompilationTemplate; six articles are built from isolated approved source snapshots with frozen renderer contracts. No compiled HTML imported as source. Snapshot provenance: source-manifest.json. Common article rhythm from approved style pass. Consolidation of legacy branch-specific renderer variants must not change accepted content.

Production build and Astro typecheck PASS. Text/media parity31/31; article geometry at1440/390 matches. Unique IDs repaired without copy change. Canonical route gate PASS: H1/canonical/IDs/images/sitemap, no preview href/output. Deferred news/dogs are noindex and excluded from sitemap. Two article canonical metadata mismatches corrected to match chosen /articles/<slug>/ routes; no public redirect/cutover performed.

Full local `npm run ci` PASS (exit0): 251/251 visual/source tests, production build and all post-build gates including 8 cold Chromium performance checks. Owner approved separate initial/full budgets while preserving image quality. Static initial limits and HTML/CSS/JS/CLS protections retained; browser initial1.5MB/full1.8MB measured without compression or cache. Not field CWV. Hosted CI pending Draft PR. Production remains NO_GO until runtime and separate authorization gates.

No staging changes, merge, production, DNS, secrets, analytics or lead routing. Existing staging remains approved review surface. Canonical candidate is not ready to deploy until full CI and final runtime checks pass.

Verification: npm run build:production; node scripts/check-canonical-release.mjs; python3 scripts/audit-canonical-release.py /path/to/approved-staging-snapshot. FullCI: npm run ci.
