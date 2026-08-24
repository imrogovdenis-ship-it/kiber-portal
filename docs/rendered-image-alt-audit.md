# KIBER PORTAL — rendered image alt audit

Дата: 2026-08-24  
Статус: `passed`

## Scope

Проверка идёт по rendered Astro output в `app/dist` и затрагивает только public/indexable страницы. Preview/noindex routes исключаются из media SEO blockers.

## Validation command

```bash
python3 scripts/audit_rendered_image_alt.py --root . --json
```

## Latest result

```text
publicPagesChecked=38
meaningfulImages=435
errors=0
warnings=0
```

## Checks

- Meaningful rendered images must not have missing/empty `alt`.
- Very long `alt` values are reported as warnings.
- For pages with 4+ meaningful images, the audit warns if there is no commercial/long-tail alt coverage on even meaningful-image positions.
- Decorative/service SVG assets such as logos and messenger icons are excluded from meaningful-image counts.

## Machine-readable artifact

```text
data/seo/rendered-image-alt-audit.json
```

## Notes

This audit verifies rendered output, not only source JSON/frontmatter. It complements robot media source-of-truth review and catches template-level regressions where an alt is lost during rendering.
