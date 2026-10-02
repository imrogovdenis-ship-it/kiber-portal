# Owner approval: shared «Подборки» block rules

Status: **owner_approved**  
Date: 2026-09-23  
Production approved: **false**

Александр подтвердил, что текущий вид и поведение блока «Подборки» соблюдают правила визуально и должны стать постоянным проектным правилом.

## Approved rules

- Reused «Подборки» block: exactly 5 cards — 4 topical canonical compilation cards + final «Все наши подборки».
- Homepage placement: after Gosha quote.
- Normal articles/compilation pages: last content block immediately before footer.
- Robot-card pages: no shared «Подборки» block.
- `/compilations/`: visual exception and full index of all ready/planned подборки.
- Reused cards must be canonical cards from `/compilations/`: same title, description, image, href/status.
- Never invent page-local подборки titles/descriptions. If no close match exists, reuse a ready canonical card.
- CTA only `Подробнее` or `Скоро`.
- Publication/readiness gate: `npm run test:compilation-blocks`.

Evidence: `docs/review/compilation-block-canonical-cards-2026-09-23/`  
Preview marker: `compilation-canonical-1`
