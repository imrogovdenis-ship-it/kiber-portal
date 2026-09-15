# Short technical package — preview only
Owner scope: font delivery without design/photo/budget change; confirmed historical redirects; search settings; whole-site QA. Production/merge separately gated.

Internal Montserrat common subset plus original full fallback, disjoint unicode ranges. Inputs use full originals to preserve arbitrary mixed-script shaping. Static coverage gate requires expanding common coverage before publishing rare static text. Home retains original files. Generator preserves bbox/timestamp, contours/hmtx and OFL; pinned manual tooling: fonttools[woff]==4.65.0, brotli==1.2.0. Before/after Chromium geometry and pixels match at390/1280, including isolated969-glyph grids/weight and arbitrary input. Regression: scripts/split-fonts-browser.mjs; FONT_QA_STATE points to private output containing font-baseline/.

42 historical public routes probed. 22 robot predecessors and3 unambiguous article predecessors mapped; previous Sketchbot/UV-BOX retained. Exact built slash aliases avoid Jino upstream TLS HTTP redirects. No arbitrary404→home redirect. Five old content families need owner/content decisions.

Removed Preview: SEO-title prefix on two public articles; no H1/body change. Robots/sitemap/favicon inspected live. SVG favicon already200/image-svg: older Webmaster recommendation does not justify branding changes. Search table28 rows/27 unique visible paths; no excluded pages shown. Canonical-processing messages are not canonical errors. No reindex submission or settings change.

Deferred: Linear KIBER-102 and separate tasks; KIBER-76/82/100 linked, not duplicated. Actual CI, backup/parity, browser and performance evidence kept in private state; this note alone does not grant production readiness.
