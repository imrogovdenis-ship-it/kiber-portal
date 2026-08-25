# KIBER PORTAL — launch QA summary

Дата: 2026-08-25T00:25:39.908008+00:00
Статус: `passed`

## Summary

- Steps: 11
- Passed: 11
- Failed: 0

## Gates

| Gate | Status | Summary |
|---|---:|---|
| `design_tokens` | pass | `{"errors": 0, "warnings": 0, "cssFiles": 4, "colorTokens": 15}` |
| `public_pages` | pass | `{"htmlPages": 47, "errors": 0, "warnings": 0}` |
| `astro_build` | pass | `{"built": true, "pages": 47}` |
| `robot_seo_links` | pass | `{"robotPages": 24, "checkedPages": 24, "errors": 0, "warnings": 0}` |
| `collection_pages` | pass | `{"collectionPages": 2, "checkedPages": 2, "errors": 0, "warnings": 0}` |
| `content_index_pages` | pass | `{"contentIndexPages": 3, "checkedPages": 3, "errors": 0, "warnings": 0}` |
| `content_detail_pages` | pass | `{"detailPages": 7, "checkedPages": 7, "errors": 0, "warnings": 0}` |
| `whole_site_static` | pass | `{"htmlPages": 47, "publicPages": 38, "previewPages": 9, "checkedPages": 47, "errors": 0, "warnings": 0}` |
| `rendered_image_alt` | pass | `{"publicPagesChecked": 38, "errors": 0, "warnings": 0, "meaningfulImages": 435}` |
| `rendered_headings` | pass | `{"publicPagesChecked": 38, "errors": 0, "warnings": 0, "headings": 729}` |
| `route_inventory` | pass | `{"routes": 47, "publicRoutes": 38, "previewNoindexRoutes": 9, "pageTypes": {"preview/noindex": 9, "robot detail": 24, "collection": 2, "content index": 3, "contacts": 1, "home": 1, "article/detail": 7}}` |

## Artifact

```text
data/seo/launch-qa-summary.json
```

## Notes

This QA bundle validates the local static Astro output only. It does not deploy, change DNS, activate redirects, connect analytics, or touch production infrastructure.
