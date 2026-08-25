# KIBER PORTAL — rendered heading hierarchy audit

Дата: 2026-08-25
Статус: `passed`

## Scope

Проверка идёт по rendered Astro output в `app/dist` и затрагивает только public/indexable страницы. Preview/noindex routes исключаются из SEO blockers.

## Validation command

```bash
python3 scripts/audit_rendered_headings.py --root . --json
```

## Latest result

```text
publicPagesChecked=42
headings=779
errors=0
warnings=0
```

## Checks

- На каждой public/indexable странице ровно один непустой `<h1>`.
- Пустые headings отмечаются warning.
- Skipped heading-level jumps, например `h1 → h3`, отмечаются warning.

## Machine-readable artifact

```text
data/seo/rendered-heading-audit.json
```

## Notes

Этот gate проверяет уже собранный HTML, поэтому ловит регрессии в шаблонах и компонентах, а не только ошибки в source-of-truth данных.
