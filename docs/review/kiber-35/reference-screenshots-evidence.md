# KIBER-35 reference screenshots for approval

Prepared from `codex/kiber-15-controlled-rebuild` after KIBER-31, KIBER-32, KIBER-33, KIBER-36, KIBER-37, KIBER-29 and KIBER-21 were merged.

These screenshots are **prepared for design-owner approval**. They are not marked as approved until Alexander/design owner confirms them.

## Update after visual feedback

Alexander reported that Home Hero / CTA buttons were stretched vertically on desktop and mobile screenshots. Root cause: corrupted CSS artifacts from a px-to-rem conversion (`40.25rem`, `20.25rem`, `10.25rem`) in commercial block components.

Fix applied:

- Home Hero and CTA buttons now use normal `min-height: 2.75rem`.
- LeadForm review inputs/button now use normal `min-height: 2.75rem`.
- Related oversized card/input radii were normalized to `1.5rem` / `0.875rem`.
- Added regression test `tests/visual/control-height-regression.test.ts` to prevent these corrupted values returning.

## Scope

Viewport set:

- Desktop: 1440 px wide
- Mobile: 375 px wide

Routes captured:

- `/`
- `/robots/unitree-g1/`
- `/lead/request/?robot=unitree-g1`
- `/lead/thanks/?robot=unitree-g1`
- `/404.html`

## Validation

```text
node --import tsx --test tests/visual/control-height-regression.test.ts — passed
npm run verify — passed
npm run build:production — passed
Playwright screenshot capture — 10 route/viewport PNGs regenerated
Visual sanity check — Home Hero / CTA buttons are normal-height pills on desktop and mobile
```

## Files

| File | SHA-256 |
| --- | --- |
| `screenshots/kiber-35-contact-sheet-desktop-1440.png` | `9aeeb39df46721405fa92aedb2ee328cad809f42786e83a8f60ff558454e0acc` |
| `screenshots/kiber-35-contact-sheet-mobile-375.png` | `9b61db439d3140982768291c0c513dead73a25bf41fa191bc5bb241eecf41f77` |
| `screenshots/kiber-35-reference-home-desktop-1440.png` | `8d39e41335e39e1a9f0e7bb0eb420efdf654bc2ea9cf45c4166a8fc6ab712bbb` |
| `screenshots/kiber-35-reference-home-mobile-375.png` | `5f1bf484445c58ec197b27a0cf75b4160692a67a78b372012f6910169f45d896` |
| `screenshots/kiber-35-reference-lead-request-desktop-1440.png` | `576b52435b566c8f0c60efa5972df1b70865454be4bdfe3ef9c31d6e07c933e1` |
| `screenshots/kiber-35-reference-lead-request-mobile-375.png` | `a02502b89d7f7d04ff75f984a2f191deac84d9e15d265568d44734e2ba356fb9` |
| `screenshots/kiber-35-reference-lead-thanks-desktop-1440.png` | `268fb62faff02531e24aede8c6fdd55149917421916b92f3372c424fd4eaae70` |
| `screenshots/kiber-35-reference-lead-thanks-mobile-375.png` | `28d6f9794bc32f1f8a3e45b9d9fe6ee1ca6271dc1f2a48dccd6c026af568a8af` |
| `screenshots/kiber-35-reference-not-found-desktop-1440.png` | `6bf57769063d04465842307eebf265a49077219d462b0a34fbdbc0ed6447115a` |
| `screenshots/kiber-35-reference-not-found-mobile-375.png` | `2fdf3c3c872e8176cda74d8fcd2d1a5740246faa86553c8783322b424ee7012b` |
| `screenshots/kiber-35-reference-robot-unitree-g1-desktop-1440.png` | `3931d77fea25d27084871d6043a1e10fff4bbe8652b30ebdae00ac05050a022b` |
| `screenshots/kiber-35-reference-robot-unitree-g1-mobile-375.png` | `451d919d129dfed39961714ba6d168a26b134988f22ebb60387c38b17d4a9fc3` |

## Safety

No production deploy, DNS, secrets, analytics provider IDs, real lead destination, or legal/consent policy changed.
