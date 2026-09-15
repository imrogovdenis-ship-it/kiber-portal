# F06 — approved internal gray adjustment

Owner approved #797a91 → #6e6f84 for gray text on internal pages after the G1 included-services comparison. No home palette, blue, font, size, spacing or copy change is approved by this patch.

Implementation: internal-only stylesheet link in BaseLayout; two gray tokens overridden using html:root so generated :root defaults cannot win later in the cascade. Canonical generated tokens stay unchanged. Derived Gosha gray signature shades follow the same muted token; unrelated colors remain unchanged.

Evidence: source test RED for missing override, then GREEN; browser regression caught the initial :root cascade failure, then passed after the specificity correction. All 50 built HTML pages checked for stylesheet inclusion/exclusion. Real Chromium baseline-versus-candidate: home, G1, G1/X2 article, humanoids compilation, privacy page × 390/1280. Text geometry, fonts, backgrounds and non-gray colors unchanged. Home HTML hash identical to pre-change build. Full visual suite 349 PASS; static performance gate PASS (does not close the separate F10 mobile lab issue).

For Jino, preserve the currently published HTML (including manual lead runtime) and insert only the new stylesheet link on 49 internal pages; upload the stylesheet first. Save exact original HTML and hosting-policy witness outside web root; on failure restore original HTML. Never upload dist API/.htaccess or change production as part of this adjustment. Live evidence/backup: /home/alex/.hermes/state/kiber-internal-gray/.

Contrast of the new gray: approximately 4.62:1 on #f4f8ff and 4.92:1 on white. Blue-label/button and other distinct-color contrast findings remain open. F06 is only partially addressed; production release stays gated.
