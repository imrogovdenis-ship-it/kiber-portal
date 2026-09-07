# KIBER Batch 2 SERP / competitor-source review

Status: `partial_checked`. Server-side Yandex SERP returned captcha, and Bing/DDG exact-rental SERPs were noisy; direct vendor/competitor pages were fetched and used for content-gap review.

Evidence: `data/seo/serp-research/batch2-robot-cards-20260907/batch2-robot-cards.competitor-source-summary.json`

| Robot | URLs inspected | Key content gap |
|---|---|---|
| `arenda-unitree-g1` | https://www.unitree.com/g1/ | Humanoid pages need safety zone, stage/floor readiness, operator-controlled scenario, and why exact G1 differs from generic humanoid demand. |
| `arenda-bellabot` | https://www.pudurobotics.com/en/products/bellabot | Waiter robot pages need route setup, aisle/table constraints, staff handoff, and HoReCa use cases rather than only “cute cat robot” product copy. |
| `arenda-kettybot` | https://www.pudurobotics.com/en/products/kettybot | KettyBot pages should explain advertising screen + delivery route scenarios and sync with existing Wordstat evidence. |
| `arenda-unitree-go2` | https://www.unitree.com/go2/ | Robot dog pages need tricks/photo-zone/event-safety framing and distinguish Go2 from generic robot-dog queries. |
| `arenda-xiaomi-cyberdog-2` | https://www.mi.com/cyberdog2 | CyberDog 2 has awareness demand but zero exact rental demand; page should keep exact model SEO while answering “is it rentable for a show/promo?” clearly. |
| `arenda-promobot-v4` | https://promo-bot.ru/products/promobot-v4/ | Promobot V4 has low entity demand and zero exact rental demand; page should emphasize practical promo-host scenarios, screen, prepared dialogue and queue limits. |

## Shared content gaps

- Exact-model robot cards should answer rental/event intent, not only product specs.
- Keep operator, safety/venue, logistics, price request, and scenario framing visible.
- Do not invent unsupported capabilities or final availability.

Production/DNS/secrets/analytics/live routing/public route replacement are not approved.
