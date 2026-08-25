# KIBER PORTAL — rendered CTA / lead-flow audit

Дата: 2026-08-25  
Статус: `passed`

## Scope

Проверка идёт по rendered Astro output в `app/dist` и затрагивает только public/indexable страницы. Preview/noindex/system routes исключаются из production blockers.

## Validation command

```bash
python3 scripts/audit_rendered_cta_flow.py --root . --json
```

## Latest result

```text
publicPagesChecked=38
ctaLinks=678
errors=0
warnings=0
```

CTA href types:

```text
internal=330
same-page-anchor=233
approved-external=115
```

## Checks

- CTA links have visible labels.
- CTA links do not use placeholder hrefs.
- Links do not contain masked/broken values such as literal `*`.
- Same-page anchors point to existing IDs.
- Internal links point to generated HTML routes.
- Internal links with fragments point to existing IDs on the target route.
- External links are reviewed against the approved messenger/phone/email allowlist.
- `target="_blank"` CTA links include `noopener`.
- Every public page has `data-analytics-event` CTA coverage.

## Safe fix applied

The rendered messenger modal now filters buttons with masked href values out of production HTML until the real destination is approved:

```text
app/src/components/site/ContactMessengerModal.astro
```

This avoids shipping a visually clickable but broken Telegram URL with literal mask characters. The need for a real Telegram destination remains a business-input blocker in:

```text
docs/business-inputs-request.md
```

## Machine-readable artifact

```text
data/seo/rendered-cta-flow-audit.json
```

## Notes

This audit validates CTA/link mechanics only. It does **not** connect CRM, analytics providers, forms, Telegram bots, WhatsApp Business, Max, or any secret destination. Production lead routing still requires explicit approval.
