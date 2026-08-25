# KIBER PORTAL — launch QA summary

Дата: 2026-08-25T10:37:38.305796+00:00
Статус: `passed`

## Summary

- Steps: 17
- Passed: 17
- Failed: 0

## Gates

| Gate | Status | Summary |
|---|---:|---|
| `design_tokens` | pass | `{"errors": 0, "warnings": 0, "cssFiles": 4, "colorTokens": 15}` |
| `public_pages` | pass | `{"htmlPages": 51, "errors": 0, "warnings": 0}` |
| `astro_build` | pass | `{"built": true, "pages": 51}` |
| `robot_seo_links` | pass | `{"robotPages": 24, "checkedPages": 24, "errors": 0, "warnings": 0}` |
| `collection_pages` | pass | `{"collectionPages": 2, "checkedPages": 2, "errors": 0, "warnings": 0}` |
| `content_index_pages` | pass | `{"contentIndexPages": 3, "checkedPages": 3, "errors": 0, "warnings": 0}` |
| `content_detail_pages` | pass | `{"detailPages": 7, "checkedPages": 7, "errors": 0, "warnings": 0}` |
| `whole_site_static` | pass | `{"htmlPages": 51, "publicPages": 42, "previewPages": 9, "checkedPages": 51, "errors": 0, "warnings": 0}` |
| `rendered_image_alt` | pass | `{"publicPagesChecked": 42, "errors": 0, "warnings": 0, "meaningfulImages": 440}` |
| `rendered_headings` | pass | `{"publicPagesChecked": 42, "errors": 0, "warnings": 0, "headings": 779}` |
| `rendered_schema` | pass | `{"publicPagesChecked": 42, "errors": 0, "warnings": 0, "schemaTypes": {"BreadcrumbList": 40, "FAQPage": 25, "Service": 24, "CollectionPage": 4, "Blog": 1, "WebPage": 4, "ContactPage": 1, "Organization": 2, "WebSite": 1, "BlogPosting": 7}, "pageTypes": {"robot detail": 24, "collection/content index": 5, "public other": 4, "contacts": 1, "home": 1, "article/detail": 7}}` |
| `rendered_social_metadata` | pass | `{"publicPagesChecked": 42, "errors": 0, "warnings": 0}` |
| `rendered_cta_flow` | pass | `{"publicPagesChecked": 42, "ctaLinks": 726, "hrefTypes": {"internal": 347, "same-page-anchor": 252, "approved-external": 127}, "errors": 0, "warnings": 0}` |
| `route_inventory` | pass | `{"routes": 51, "publicRoutes": 42, "previewNoindexRoutes": 9, "pageTypes": {"preview/noindex": 9, "robot detail": 24, "collection": 2, "content index": 3, "legal": 4, "contacts": 1, "home": 1, "article/detail": 7}}` |
| `production_readiness_matrix` | pass | `{"technicalGates": 10, "businessBlockers": 6, "blockingBusinessInputs": 4, "errors": 0, "warnings": 0}` |
| `production_dry_run_docs` | pass | `{"docsChecked": 2, "errors": 0, "warnings": 0}` |
| `business_input_pack` | pass | `{"docsChecked": 2, "matrixBlockersChecked": 5, "errors": 0, "warnings": 0}` |

## Artifact

```text
data/seo/launch-qa-summary.json
```

## Notes

This QA bundle validates the local static Astro output only. It does not deploy, change DNS, activate redirects, connect analytics, or touch production infrastructure.
