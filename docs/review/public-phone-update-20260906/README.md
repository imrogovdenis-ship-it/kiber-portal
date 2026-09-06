# Public phone update

New public phone received from Alexander:

- Display: `+7 (906) 730-96-91`
- `tel:` digits: `+79067309691`
- Legal documents: updated

Messenger links were **not** changed in this step because Telegram/WhatsApp/MAX links are a separate popup/contact decision.

## Changed files

- `src/config/site.ts`
- `data/legal/legal-documents.json`
- `.env.example`
- `tests/visual/public-contacts-owner-input.test.ts`
- `data/review/production-go-no-go.json`
- `data/review/owner-launch-content-approval-request.json`
- `docs/OPEN-QUESTIONS.md`
- `docs/business-inputs-request.md`
- `scripts/contact-lead-visual-smoke.mjs`

## Verification

All checks passed:

- `node scripts/contact-lead-visual-smoke.mjs`
- `npm run test -- tests/visual/public-contacts-owner-input.test.ts`
- `npm run test:page-seo-components`
- `npm run test:production-go-no-go`
- `npm run build:preview`

## Safety

- No production deploy.
- No DNS changes.
- No analytics changes.
- No live lead routing.
- No merge.
