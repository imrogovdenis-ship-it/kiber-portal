# Shared mobile remediation — owner review candidate

Preview: https://jino-preview.kiber-portal.ru/

All twelve owner requirements: `docs/development/mobile-shared-components-contract.md`.
Implementation lives in shared `public/styles/mobile-shared-contract-v1.css`, loaded by BaseLayout; native touch behavior is shared by the slider scripts. No per-page HTML forks are used as source. Public scripts have a cache-busting version. The Ardi order CTA duplicate word is corrected in source.

Actual checks: `checks.json`. Browser tests use real touch input, not assigned scrollLeft. Desktop drag and arrow controls were exercised. `npm run test:mobile-shared` is attached to CI after a build, checks every generated HTML page loads the shared contract, and runs geometry/touch/all-model checks. Run `npm run build:production && npm run test:mobile-shared` for new pages.

Preview delivery preserved existing deployed HTML to avoid overwriting unmerged accepted content: 43 existing pages changed only by adding the shared CSS link, versioning slider URLs, and removing one duplicated word in the Ardi order CTA. Two existing scripts and one new CSS file were delivered; all 46 remote files matched the prepared bytes. Image files, prices, remaining text, forms and noindex markup were preserved. Private rollback snapshots and SFTP batch are under the active session state, not committed.

Previous source guards were updated to require versioned external scripts and passive/native touch rather than the old touch handler that cancelled scrolling. New rendered touch tests replace that obsolete implementation assumption. CSS px breakpoint was converted to equivalent rem to comply with lint. No guards were disabled.

Owner acceptance, merge and production deployment remain pending/separately gated. No DNS, analytics, live lead or primary-domain change.

Expanded CI coverage caught the compilation-index root-selector mismatch; it was corrected without relaxing the heading-size assertion. The complete new mobile CI gate then passed. CSS cache version is mobile-shared-2.
