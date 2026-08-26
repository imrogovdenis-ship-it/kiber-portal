# Production sitemap and metadata drift

Linear: KIBER-6 / KP-005

The `Production metadata drift` GitHub Actions workflow runs every day at 03:17 UTC and can also be started manually. It performs read-only checks against `https://www.kiber-portal.ru/sitemap.xml`.

For all 44 baseline URLs it compares:

- URL presence in the sitemap;
- `<title>`;
- the first `<h1>` (including an intentionally empty baseline value);
- absolute canonical URL.

The initial baseline was captured on 2026-08-26 and is stored in `data/monitoring/production-metadata-baseline.json`. Eight current production routes have no H1; this is recorded as the observed baseline, not silently treated as an approved SEO state. A later addition, removal or text change still produces drift.

Requests use a one-second polite delay and bounded retry/backoff for transient HTTP 403/408/425/429/5xx responses. This avoids treating production rate limiting as metadata removal while still reporting a persistent fetch failure.

Every run uploads JSON and Markdown reports for 30 days. A drift or fetch failure fails the workflow and creates an open GitHub issue titled `[monitor] Production sitemap/metadata drift`; later failures append reports to the same issue.

## Local use

```bash
python3 scripts/monitor_production_metadata.py
```

Exit codes:

- `0`: no drift and no fetch errors;
- `1`: sitemap/page fetch error;
- `2`: metadata or URL drift.

Baseline replacement is never automatic. After an approved Tilda emergency change, regenerate it explicitly and review the diff:

```bash
python3 scripts/monitor_production_metadata.py --write-baseline
git diff -- data/monitoring/production-metadata-baseline.json
```
