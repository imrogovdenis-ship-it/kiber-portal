# KIBER PORTAL — rendered schema audit

Дата: 2026-08-25  
Статус: `passed`

## Scope

Проверка идёт по rendered Astro output в `app/dist` и затрагивает только public/indexable страницы. Preview/noindex/system routes исключаются из SEO blockers.

## Validation command

```bash
python3 scripts/audit_rendered_schema.py --root . --json
```

## Latest result

```text
publicPagesChecked=38
errors=0
warnings=0
```

Schema type coverage:

```text
BreadcrumbList=36
FAQPage=24
Service=24
CollectionPage=4
Blog=1
ContactPage=1
Organization=2
WebSite=1
BlogPosting=7
```

Page type coverage:

```text
robot detail=24
collection/content index=5
contacts=1
home=1
article/detail=7
```

## Checks

- JSON-LD scripts must parse successfully.
- Every public/indexable page must have at least one schema type.
- Home page must include `Organization` and `WebSite`.
- Contacts page must include `ContactPage`.
- Robot pages must include `Service` and `BreadcrumbList`.
- Article/detail pages warn if `BreadcrumbList` disappears.

## Machine-readable artifact

```text
data/seo/rendered-schema-audit.json
```

## Notes

This gate audits rendered HTML, so it catches schema regressions after Astro component/template changes. It does not call external rich-result validators and does not claim Google eligibility for rich snippets; that remains a post-deploy check on the live domain.
