# Footer staging update note — 2026-08-30

## Change

Publish the owner-requested footer composition update to the existing Alex-owned protected staging container `alex-kiber-staging` for visual review.

## Scope

Affected files/areas:

- `src/components/layout/Footer.astro`
- `src/styles/layout.css`
- `src/styles/reference-layer.css`
- footer design-system fixtures and generated token/registry outputs
- `tests/visual/homepage-owner-feedback-pass.test.ts`

Expected user-visible change:

- darker footer background
- footer description split into two lines
- requisites moved below the description as three lines
- separate left-side `Москва` removed
- address rendered as `г. Москва, Нижний Сусальный переулок, 9, стр. 4А`
- old `Каталог` footer column replaced with header-style vertical `Меню`
- `Меню` and `Контент` columns shifted right toward contacts
- contact text uses muted footer-body styling
- bottom copyright changed to `Все права защищены ©`
- legal links use smaller text and explicit two-line breaks

## Protected staging container

- Container: `alex-kiber-staging`
- Existing rollback path: retag previous image before replacement and recreate the previous container config if needed.

## Safety boundaries

Do not change production deploy, DNS, live lead routing, production secrets, analytics IDs, shared Coolify services, or non-Alex containers.

## Verification plan

- `npm run ci`
- local browser/DOM visual verification of the footer
- versioned Docker preview image build
- replace only `alex-kiber-staging`
- smoke: health, protected Basic Auth, key routes, noindex/no analytics/live-routing safety
