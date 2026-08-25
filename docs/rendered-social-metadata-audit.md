# KIBER PORTAL — rendered social metadata audit

Дата: 2026-08-25  
Статус: `passed`

## Scope

Проверка идёт по rendered Astro output в `app/dist` и затрагивает только public/indexable страницы. Preview/noindex/system routes исключаются.

## Validation command

```bash
python3 scripts/audit_rendered_social_metadata.py --root . --json
```

## Latest result

```text
publicPagesChecked=42
errors=0
warnings=0
```

## Checks

- `og:type`, `og:site_name`, `og:title`, `og:description`, `og:url`, `og:image` присутствуют и не пустые.
- `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image` присутствуют и не пустые.
- `og:url` совпадает с canonical.
- `og:url` и `og:image` абсолютные и начинаются с `https://www.kiber-portal.ru`.
- `twitter:image` совпадает с `og:image` или получает warning.
- `twitter:card` — `summary` или `summary_large_image`.

## Fix applied

Homepage now has explicit `ogImage`/`twitter:image` via:

```text
app/src/pages/index.astro
```

## Machine-readable artifact

```text
data/seo/rendered-social-metadata-audit.json
```
