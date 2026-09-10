# Canonical release candidate — NO_GO

24 robots reuse approved RobotCardTemplate; humanoid compilation reuses approved CompilationTemplate; six articles are built from isolated approved source snapshots with frozen renderer contracts. No compiled HTML imported as source. Snapshot provenance: source-manifest.json. Common article rhythm from approved style pass. Consolidation of legacy branch-specific renderer variants must not change accepted content.

Production build and Astro typecheck PASS. Text/media parity31/31; article geometry at1440/390 matches. Unique IDs repaired without copy change. Canonical route gate PASS: H1/canonical/IDs/images/sitemap, no preview href/output. Deferred news/dogs are noindex and excluded from sitemap. Two article canonical metadata mismatches corrected to match chosen /articles/<slug>/ routes; no public redirect/cutover performed.

FullCI is NOT green: 229 passing/22 failing source-contract tests. Old robot template/four-card-home/empty video registry assumptions and SEO/acceptance coverage require reconciliation, not disabling gates. See RELEASE_STATUS.json. Raw CI/check/build logs kept locally, not committed.

No staging changes, merge, production, DNS, secrets, analytics or lead routing. Existing staging remains approved review surface. Canonical candidate is not ready to deploy until full CI and final runtime checks pass.

Verification: npm run build:production; node scripts/check-canonical-release.mjs; python3 scripts/audit-canonical-release.py /path/to/approved-staging-snapshot. FullCI: npm run ci.
