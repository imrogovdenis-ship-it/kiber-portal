# Release preparation — not production GO

Requested navigation changes built and tested. Owner approval of humanoid compilation recorded. No merge/production changes.

Blocking integration:
- Six approved article canonical routes /articles/<slug>/ must be built from approved source; currently approved content lives at preview URLs across separate branches.
- Public /robots/[slug]/ still uses legacy renderer, unlike approved RobotCardTemplate previews. Preserve approved content when routing all24.
- Public /roboty-gumanoidy/ must use approved CompilationTemplate, currently separate preview.
- Kinescope CSP currently allows embed only on compilation preview; canonical runtime needs equivalent scoped policy and production privacy/rights gate.
- Unready legacy category/article routes must be classified for keep/redirect/404/noindex; do not use blanket home redirects. Exclude unready pages from sitemap in release.
- Final lead runtime/API E2E, production secrets/ingress, fresh backup/rollback and separate merge/deploy approval remain mandatory.

The staged index links intentionally use real approved previews until canonical source integration passes. Production rendering uses canonical targets, so this branch alone is NOT deploy-ready. Whole rendered audit is an HTML/link pass, not a claim that every page received manual visual review.
