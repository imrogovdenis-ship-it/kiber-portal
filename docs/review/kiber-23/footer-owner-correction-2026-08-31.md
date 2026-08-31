# Footer owner correction — 2026-08-31

## Scope

Owner approved the footer direction overall and requested two narrow corrections:

1. Remove the separate `Контент` block.
2. Replace the visible `Меню` heading with the actual page link `Главное`, and render the footer page links in the same muted gray tone as the left description text.

## Implemented

- Removed the second default footer section (`Контент`).
- Kept one footer page navigation section with links:
  - `Главное`
  - `Каталог`
  - `Подборки`
  - `Блог`
  - `Новости`
  - `Контакты`
- Removed the visible `Меню` section heading from footer page navigation while preserving the accessible `aria-label="Главное"` for the nav landmark.
- Changed footer page-link typography to the muted description color (`var(--kp-muted-soft)` / `var(--kp-reference-muted-soft)`) with normal weight.
- Updated the footer design-system block contract and fixtures.

## Validation

```text
npm run ds:generate
node --import tsx --test tests/visual/homepage-owner-feedback-pass.test.ts
npm run check
npm run test:visual
npm run build:preview
```

All validation passed locally.

## Visual sanity

Local preview at `http://127.0.0.1:4181/` was inspected after `npm run build:preview`:

- no separate `Контент` block is visible;
- no visible `Меню` heading is visible;
- the footer page nav shows `Главное`, `Каталог`, `Подборки`, `Блог`, `Новости`, `Контакты`;
- page nav links are muted gray like the left description text.

## Safety

No production deploy, DNS, secrets, analytics provider IDs, or live lead-routing destinations changed.
