# F10: below-fold image loading (preview scope)

Owner approved deferring lower card backgrounds and article robot images, without changing assets, copy, approved colors, layout or homepage. No production permission.

- Early external runtime opts into CSS background suppression only when IntersectionObserver initializes. Default/failure/no-JS remains eager.
- 1600px preload margin; an intersecting horizontal card releases all siblings for fast swipes.
- Only 23 internal pages with approved related-card blocks include the runtime. Built regression matches eligibility to rendered cards and confirms below-fold positions at 390/1280 across all eligible routes.
- Existing homepage slider source is reused by the generated internal bundle. Home HTML and slider bytes remain unchanged. Original slider still serves non-opted-in pages.
- Native lazy loading replaces eager on lower article RobotCard instances, not first-screen heroes or collection main catalogs.
- CSS, images, fonts, text and geometry otherwise unchanged; fixed budgets not raised. Generator runs with ds:generate.

## Verification

RED/GREEN unit regression; 351 tests passed; Astro check and unchanged static/browser budgets passed. Independent static review PASS after narrowing asset eligibility. Browser: active/no-IO/no-JS/blocked-script fallbacks, 17 backgrounds visible after fast scroll, exact sampled card screenshot parity and mouse-drag navigation prevention PASS.

Local initial bytes for comparison article: active 761557 vs same-markup no-IO fallback 1849619. This is local uncached data, NOT Jino mobile field CWV. Public measurements and backup live outside repo in the task state. This change does not claim the entire F10 or field CWV passes.
