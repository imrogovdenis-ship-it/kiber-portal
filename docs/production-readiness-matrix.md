# KIBER PORTAL — production readiness decision matrix

Дата: 2026-08-25  
Статус: `code_ready_business_inputs_required`

## Decision

```text
productionActionAllowed=false
```

Причина: локальная статическая QA проходит, но production launch всё ещё требует бизнес-данных и deployment approval. Кодовая база готова к controlled deployment discussion, но не к самовольному production switch.

## Technical gates

| Gate | Status | Evidence |
|---|---:|---|
| Launch QA bundle | passed | `data/seo/launch-qa-summary.json` |
| Whole-site static validation | passed | `data/seo/whole-site-static-check.json` |
| Route inventory | passed | `data/seo/route-inventory.json` |
| Rendered image alt audit | passed | `data/seo/rendered-image-alt-audit.json` |
| Rendered heading audit | passed | `data/seo/rendered-heading-audit.json` |
| Rendered schema audit | passed | `data/seo/rendered-schema-audit.json` |
| Rendered social metadata audit | passed | `data/seo/rendered-social-metadata-audit.json` |
| Static 404 page | ready/noindex | `app/src/pages/404.astro` |

## Business / approval blockers

| Blocker | Status | Blocks production? | Source |
|---|---:|---:|---|
| Contacts/requisites | needs input | yes | `docs/business-inputs-request.md` |
| Lead destination | needs input | yes | `docs/business-inputs-request.md` |
| Analytics IDs/events | needs input | yes | `docs/business-inputs-request.md` |
| Redirect approval | needs input | yes | `data/seo/redirects.scaffold.json` |
| SEO expansion materials | needs input | partial | `docs/business-inputs-request.md` |
| Coolify/DNS/SSL approval | needs approval | yes | `docs/production-deployment-dry-run.md` |

## Allowed without additional input

- Improve documentation and QA automation.
- Prepare additional dry-run artifacts.
- Refine non-production preview checks.
- Add validators that do not require business facts.

## Forbidden without explicit approval

- Change DNS.
- Deploy to Coolify production.
- Activate redirects.
- Connect analytics or pixels.
- Wire real lead destinations.
- Touch non-`alex-*` containers, secrets, DNS or analytics.

## Machine-readable source

```text
data/seo/production-readiness-matrix.json
```
