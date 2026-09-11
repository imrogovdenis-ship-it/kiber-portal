# Robot breadcrumb labels

Owner accepted mobile revision 7fd99de (record in mobile-shared-ui/OWNER_ACCEPTANCE.md), then requested only nominative robot breadcrumb labels. No visual redesign is authorized.

`robotBreadcrumbName()` uses nominative catalog identities and explicit type prefixes, not a truncated rental H1. Production and robot preview routes share it. Existing robot prefixes are not duplicated; missing identities fail explicitly. Xiaomi model casing is preserved as CyberDog. Catalog data itself is unchanged.

Checks: regression RED on rental-H1 truncation, then both source/data tests GREEN; production build passed; 24 built labels and their two BreadcrumbList instances verified. Live exact-byte comparison passed for all 24 robot pages; 23 changed (Ardi was already correct). Mobile/tablet/desktop browser checks passed for Sophia and Agibot X2 (six cases).

Deployment modified only the visible final breadcrumb label and the equivalent final-name fields in BreadcrumbList. All other HTML remains identical under the scoped comparison. No CSS, JS, image, price, H1, form, other page type, main-domain or DNS changes. Private baselines and rollback remain in session state. Owner approval is not merge permission.
