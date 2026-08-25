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
| Robots.txt / sitemap policy | passed | `app/public/robots.txt` |
| Route inventory | passed | `data/seo/route-inventory.json` |
| Rendered image alt audit | passed | `data/seo/rendered-image-alt-audit.json` |
| Rendered heading audit | passed | `data/seo/rendered-heading-audit.json` |
| Rendered schema audit | passed | `data/seo/rendered-schema-audit.json` |
| Rendered social metadata audit | passed | `data/seo/rendered-social-metadata-audit.json` |
| Rendered CTA/lead-flow audit | passed | `data/seo/rendered-cta-flow-audit.json` |
| Static 404 page | ready/noindex | `app/src/pages/404.astro` |
| Lead-flow integration plan | planned/deferred | `docs/lead-flow-integration-plan.md` |
| Production dry-run docs | passed | `docs/production-deployment-dry-run.md` |
| Business input request pack | passed | `docs/business-inputs-request.md` |

## Business / approval blockers

| Blocker | Status | Blocks production? | Source |
|---|---:|---:|---|
| Contacts/requisites | partially resolved from legal docs | no | `content-source/pages/privacy-policy.md`, `content-source/pages/terms.md` |
| Lead destination | partially defined, Telegram/form targets needed | yes | `docs/lead-flow-integration-plan.md` |
| Analytics IDs/events | planned, IDs needed | yes | `docs/lead-flow-integration-plan.md` |
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

## Validation gate

The matrix is checked by `python3 scripts/validate_production_readiness_matrix.py --root . --json` and by the `production_readiness_matrix` step inside `python3 scripts/run_launch_qa.py`. The adjacent `production_dry_run_docs` step checks the deployment dry-run and launch checklist docs; `business_input_pack` checks the business-input and lead-flow request docs. These gates verify conservative `productionActionAllowed=false`, required blockers, existing evidence paths, forbidden production actions and current non-operative deployment docs.

## Machine-readable source

```text
data/seo/production-readiness-matrix.json
```
