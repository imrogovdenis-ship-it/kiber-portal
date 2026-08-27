# KIBER-35 reference screenshots for approval

Prepared from `codex/kiber-15-controlled-rebuild` after KIBER-31, KIBER-32, KIBER-33, KIBER-36, KIBER-37, KIBER-29 and KIBER-21 were merged.

These screenshots are **prepared for design-owner approval**. They are not marked as approved until Alexander/design owner confirms them.

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
npm run verify — passed
npm run build:production — passed
Playwright screenshot capture — 10 route/viewport PNGs generated
Visual sanity check — no obvious blank/broken pages, severe clipping or blocking overlaps
```

## Files

| File | SHA-256 |
| --- | --- |
| `screenshots/kiber-35-contact-sheet-desktop-1440.png` | `7e17a56a66dce311dd9afd2f7eec133cf59d03e891c027762e6f0d2ce53d2b01` |
| `screenshots/kiber-35-contact-sheet-mobile-375.png` | `78109597324cee7fabb2e2534b52d866fb9ef32a74a05b1a7dff6d88d59ee2dd` |
| `screenshots/kiber-35-reference-home-desktop-1440.png` | `cf96a38d754fa5c068764fd5f7b9e7c243670b262d93c2c86277ef18652c973b` |
| `screenshots/kiber-35-reference-home-mobile-375.png` | `5bd89a5c700b5d6f9805737a2e3b63c36828a554fcd8f32756e8c3934e314015` |
| `screenshots/kiber-35-reference-lead-request-desktop-1440.png` | `576b52435b566c8f0c60efa5972df1b70865454be4bdfe3ef9c31d6e07c933e1` |
| `screenshots/kiber-35-reference-lead-request-mobile-375.png` | `a02502b89d7f7d04ff75f984a2f191deac84d9e15d265568d44734e2ba356fb9` |
| `screenshots/kiber-35-reference-lead-thanks-desktop-1440.png` | `268fb62faff02531e24aede8c6fdd55149917421916b92f3372c424fd4eaae70` |
| `screenshots/kiber-35-reference-lead-thanks-mobile-375.png` | `28d6f9794bc32f1f8a3e45b9d9fe6ee1ca6271dc1f2a48dccd6c026af568a8af` |
| `screenshots/kiber-35-reference-not-found-desktop-1440.png` | `6bf57769063d04465842307eebf265a49077219d462b0a34fbdbc0ed6447115a` |
| `screenshots/kiber-35-reference-not-found-mobile-375.png` | `2fdf3c3c872e8176cda74d8fcd2d1a5740246faa86553c8783322b424ee7012b` |
| `screenshots/kiber-35-reference-robot-unitree-g1-desktop-1440.png` | `bedc1c4a139f542fca931da9f41c600713bd901a2c47b49badcfe78b29105c9f` |
| `screenshots/kiber-35-reference-robot-unitree-g1-mobile-375.png` | `5fb81922b165638e71480f2949a81569b19f94847637dc0508fa0f8c4cb330b5` |

## Safety

No production deploy, DNS, secrets, analytics provider IDs, real lead destination, or legal/consent policy changed.
