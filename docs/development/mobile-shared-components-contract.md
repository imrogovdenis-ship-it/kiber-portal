# Mobile shared-component contract

Status: implemented as a preview review candidate; owner acceptance pending. Actual checks are recorded in `docs/review/mobile-shared-ui/README.md`. This contract itself is not a PASS report.

## Architecture and scope
All existing and future pages must reuse shared components and template styles. Never copy a corrected page as a separate design implementation. Page-specific texts/media remain data. Mobile corrections do not authorize desktop/tablet redesign, content/price changes, production/DNS/analytics/live leads or merge. Review the actual deployed baseline before replacing preview assets/pages; preserve unmerged accepted content.

## Owner checklist
1. Equal left/right page gutters across all page types; fix intrinsic grid/overflow causes, not translateX patches.
2. Homepage Hero fits the first mobile viewport below the fixed header, including both buttons. Keep copy/image.
3. Working touch galleries on robot pages (both galleries), articles and compilations: equal image heights, natural widths, no crop/stretch, horizontal swipe both ways and vertical page scroll. Preserve desktop controls; do not add mobile arrows by default.
4. All robot catalog cards: larger readable descriptions and slightly larger model names, including homepage and related grids. Check long names and one-/two-column arrangements.
5. All article cards: content-driven mobile body height plus modest bottom padding; no large minimum-height whitespace.
6. Shared CTA2 “Остались вопросы?” everywhere: heading → smaller Gosha → context text → two buttons. Compact height; image contained. Same component/styles for homepage, robot pages, articles and compilations.
7. Robot Hero: brand eyebrow → centered existing photo → H1 → unchanged price → two buttons. Compact spacing, especially price/actions; fit a normal phone screen without clipping or excessive shrinking.
8. Robot intro below Hero: moderately reduce font weight on mobile, not plain body weight; retain text/font size.
9. Robot price/order CTA (NOT CTA2): smaller heading/spacing/Gosha; Gosha bottom inside container. Correct duplicated “робота Робот Арди”, preserving price.
10. Blog and compilation index: consistent smaller mobile H1 and introductory H2, retaining hierarchy and semantic tags.
11. Compilation Hero: H1 → existing photo → description → buttons on mobile.
12. Compilation section headings: smaller mobile scale aligned with accepted article/home heading styles; retain semantic tags and texts.

## Required regression coverage
Test rendered component occurrences across homepage, robot pages, article pages, compilation pages and both indexes. Inspect all affected routes for shared usage; select representative short/long content for browser checks. Include 320/360/390–430px mobile widths and 768/1440px regression widths. Test short and tall viewport heights, equal gutters, text containment, button hit areas, CTA visual order, gallery dimensions, and actual touch input (setting scrollLeft programmatically is not a swipe test). Preserve natural scrolling with text enlargement; never hide overflowing content to force a one-screen PASS. Retain the six full-width 16:9 cover capability frames: they are NOT gallery sizing rules.

Before acceptance: build, targeted automated checks, browser geometry/touch checks, actual deployed preview verification. Record actual outcomes separately; unchecked requirements remain pending. Future page generation must reuse these components and run these gates rather than duplicating CSS. New pages remain on hold until this mobile remediation review is complete.

## Owner review round 2 — supersedes initial sizing assumptions
- Homepage mobile Hero buttons stack full-width with single-line labels. On short viewports content may grow naturally rather than clip; one-screen fit is tested on normal-height phones.
- Catalog typography depends on tile width: compact two-column tiles use modestly enlarged text, not the same size as full-width one-column cards. Use shared container queries, not page-specific copies.
- Robot Hero image fills the text column symmetrically; keep its proportions and existing vertical gaps. A hard one-screen-height limit must not shrink the photograph.
- Pricing CTA is otherwise accepted for this pass: move Gosha slightly right, retaining bottom containment; this is not a request to move CTA2 Gosha.
- All article Hero variants use heading/copy → image → description on mobile, with full-width text and a reduced H1. Explicit desktop grid-area/column assignments must be reset when switching to one column. Check every article, not one representative.
- Regression gates must test non-overlap AND text width: text overflowing a zero-width box can paint underneath an image even when element border rectangles appear separate.
