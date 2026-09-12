# Owner mobile review — round 2

Implemented as a review candidate, not owner acceptance. CSS cache key: mobile-shared-3.

- Homepage Hero: full-width stacked buttons, single-line labels.
- Catalog: tile-width container queries; narrow/two-column titles/descriptions 17/13 CSS px, wide one-column cards retain 20/16.
- Robot Hero: square photograph fills the text column with symmetric insets; previous vertical gaps retained. No hard one-screen cap at the expense of image size.
- Pricing CTA only: Gosha shifted slightly right, bottom containment retained. CTA2 position unchanged.
- All six article Heroes: mobile grid placements reset; full-width text, heading → image → description; H1 now 28–32 CSS px.

Root cause: explicit desktop image grid-area created an implicit second column after the mobile grid became single-column. The reproduced article had a zero-width copy/lead column. Resetting only grid placement made the focused regression pass; sizing refinements followed. Prior geometry checks missed this because they lacked all-article Hero order and text-width assertions.

Checks: focused RED then GREEN; 24 round-2 live cases passed (six articles + home + robot, three mobile widths); 35 predeployment shared-layout cases passed; all 24 robot photo-column/order checks passed; 12 tablet/desktop geometry parity cases and 2 desktop mouse/arrow cases passed; lint and 9 targeted source tests passed; build passed. All 44 delivered files matched prepared bytes. Existing slider JS, copy, image files, prices, forms and other HTML remained unchanged; HTML changed only its CSS cache key. Private rollback snapshots retained in session state.

`mobile-round2-smoke.mjs` is included in the CI mobile runner. Catalog assertions now distinguish compact and wide tiles; robot image-width/containment assertions replace the superseded fixed-height cap. The original homepage first-screen check remains enabled.

review.kiber-portal.ru timed out from the agent environment; actual live checks and delivery used jino-preview.kiber-portal.ru. Owner phone review remains required. No production/DNS/merge/live-lead change.
