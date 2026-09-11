# Owner correction: article navigation only

Owner requested current images/links in Blog Kiber Gosha and homepage readiness/«Скоро» placeholders in Compilations, across all six articles. Only cards in these two existing blocks are changed; both use the exact launch-navigation registry used by the homepage. Existing block headings/descriptions, article body, galleries, quotes, styles, all other page types remain frozen.

Source edits: six ApprovedArticle renderers, with the registry import placed after existing imports to preserve emitted CSS chunk names.

Evidence: live Jino baseline captured before editing. The rendered regression initially failed all 12 article/block cases. Full local npm run ci passed. Final production build passed. After applying the identical Jino preview wrapper, HTML is byte-identical outside exactly the two allowed section subtrees on all six pages. Ten referenced stylesheets are byte-identical to the deployed release.

Only these six compiled article HTML files are uploaded to the existing isolated Jino preview; no shared assets or other pages are replaced.

Run `BASE_URL=https://jino-preview.kiber-portal.ru node scripts/article-related-navigation-smoke.mjs` for real rendered card parity.

Publication remains forbidden by the latest owner instruction until text corrections and robot-card work finish. Separate API preparation and ONE marked live delivery test are authorized; this content PR does not activate live forms or change DNS.
