# KIBER-15 — homepage owner feedback pass evidence

Date: 2026-08-31
Scope: PR #8 controlled rebuild branch, homepage visual corrections only.

## Owner feedback covered

- Header left unchanged because Alexander approved it as-is.
- Hero container reduced by 10% (`44rem` → `39.6rem`) and background image visible height reduced by ~15% via vertical inset (`7.5%` top/bottom).
- Hero title and button layout preserved.
- Kiber Gosha block now keeps the role/signature phrase below the quote body, following the provided original screenshot direction.
- Homepage block labels/headings/descriptions now use shared label/heading/body tokens and the shared large left offset.
- Compilation cards are square and rendered as a horizontal drag slider.
- Catalog robot cards are visually preserved; the required approved internal-link metadata is attached to existing cards/links, not rendered as a separate block.
- Article cards no longer show the bottom `Читать` button; image area is 9:16 and copy sits lower.
- FAQ is a single column and all answers start closed.
- Final CTA copy updated to: `Напишите нам в любом удобном мессенджере или оставьте заявку в форме. Менеджер КИБЕР ПОРТАЛА ответит и подберет роботов по вашему бюджету и дате.`
- Final CTA buttons have a larger top gap from the text.
- Final CTA right image no longer has a separate lighter rectangle background.
- The separate `Популярные направления` block below the final CTA was removed.

## Validation

Passed locally before deployment:

```bash
node --import tsx --test tests/visual/homepage-full-parity-pass.test.ts tests/visual/homepage-owner-feedback-pass.test.ts tests/visual/internal-links-rendering-contract.test.ts
npm run build:production && npm run test:internal-link-rendering
npm run ci
```

Relevant outcomes:

- focused source tests: 15/15 passed;
- `npm run ci`: 160 visual/source tests passed inside the full pipeline;
- internal-link rendering smoke passed after moving homepage internal-link metadata onto existing cards/links;
- production go/no-go remained `NO_GO` as expected because production blockers are separate.

## Protected staging deployment

- Container: `alex-kiber-staging` only.
- Image initially deployed for this pass: `alex-kiber-staging:sha-af74354`.
- Commit initially deployed: `af74354f4181a9077ff8d3b3e761827af1925ea2`.
- Rollback image recorded before replacement: `alex-kiber-staging:sha-27f5e21`.

Protected staging smoke after deployment:

- unauthenticated `/`: `401`, `WWW-Authenticate` present;
- authenticated `/`: `200` confirmed;
- authenticated `/healthz/`: `200`;
- plain HTTP `/`: `302` redirect to HTTPS;
- `X-Robots-Tag: noindex, nofollow` present;
- container health: `healthy`;
- host ports: none;
- analytics scripts absent;
- homepage contains Kiber Gosha, square-slider marker, updated final CTA copy;
- FAQ starts closed;
- `Популярные направления` no longer appears in homepage HTML.

## Safety boundaries

No production deploy, DNS/domain change, production secret, analytics provider enablement, amoCRM/live Telegram routing, or shared Coolify/Traefik service changes were performed.
