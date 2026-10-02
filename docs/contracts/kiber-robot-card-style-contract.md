# KIBER robot card style contract

Status: **working_source_of_truth_pending_owner_review**

Owner note: Александр поручил вынести правила robot-card workflow из навыка в repository contracts по модели article contracts. Эти файлы являются рабочим source of truth; при последующих изменениях править и contracts, и skill.

## Audience and voice

Write for a potential buyer, not for an internal reviewer or SEO report.

Every block should help the reader understand:

- what the robot is;
- what guests will see/do;
- which event formats fit;
- what must be checked before booking;
- what the manager needs from the client;
- what limitation matters.

Avoid dry logistics as the main tone. Keep logistics in checklists/order flow, not as the whole page voice.

## Headings

H1/H2/H3 should include role + model/function when needed. Do not rely on a brand/model name alone if the reader needs context.

Good examples:

```text
Аренда робота-гуманоида Unitree G1
Аренда робота-собаки Unitree Go2
Робот-бармен Робобар: барная зона после официальной части
```

Avoid dirty/generated names and doubled categories:

```text
робота-официанта робота-официанта
Открыть карточку робота робота-...
```

Use nominative customer-facing titles from `data/content/home-catalog-titles.json` or an approved display-title mapping when generated identity names are inflected.

## Shared visual constraints

Shared blocks must reuse approved PR8/home styles:

- FAQ / `HomeFaqBlock`;
- CTA2 / `HomeFinalCta`;
- catalog cards / `RobotCard`;
- Blog Kiber Gosha / `HomeImageCards`;
- related catalog cards.

Do not redesign these while rewriting content.

## Button color rule

Do not darken approved blue buttons. Alexander rejected changing `#0088ff` to darker blue; approvals for grey text/color elsewhere do not apply to blue buttons.

## Gosha voice

Kiber Gosha is an editorial accent, not filler.

Pattern:

1. bold first paragraph: joke/useful observation, 1–3 short sentences;
2. normal second paragraph: manager handoff, 12–25 words;
3. handoff matches the exact robot/card promise.

For robot cards, the handoff usually helps check audience, venue, timing, scenario, safety/zone and availability.

## Forbidden visible language

Avoid visible internal/generator phrases such as:

```text
Карточка объясняет...
по данным исследования...
preview
Сценарий под мероприятие
роботические сюрпризы
```

Research/provenance belongs in hidden review fields or repo notes, not public copy.


## Owner visual review input — text density, 2026-09-18

Use Unitree G1 as the current baseline for readable density.

- AI summary under Hero: two compact visible paragraphs; this is the first text after Hero, so write it for a real customer reading on a phone.
- AI summary length: target about 450–500 Russian characters total for a normal card; if the block feels like it cannot be comfortably read on one mobile screen, shorten by ~15–20% before handoff.
- AI summary paragraph balance: the second paragraph should be close to the first in length, not a long qualification block.
- AI summary SEO tone: no visible keyword stuffing or repeated exact long-tail sequences. Bad pattern: `аренда робота Tron для выставки, аренда робота Tron для презентации, аренда робота Tron для мероприятия`. Use one natural phrase or distribute exact phrases into later page text/metadata instead.
- AI summary content: state what the robot is, what guests will actually see, and the main practical constraint/confirmation. Do not force every scenario keyword into this top block.
- Capabilities lead: should be a real 2–3 line lead, not a one-line stub.
- Capability descriptions: shorten if they become 6–7 desktop lines; target up to about 5 lines.
- Scenario lead: can be 2–3 lines.
- Scenario descriptions: shorten by about 20–30% when too long.
- FAQ answers may remain medium length; item count is flexible 5–8.
- Avoid making mobile users scroll through long repeated copy when a shorter customer-facing sentence answers the decision.
