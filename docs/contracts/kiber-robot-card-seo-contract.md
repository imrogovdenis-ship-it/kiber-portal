# KIBER robot card SEO contract

Status: **working_source_of_truth_pending_owner_review**

Owner note: Александр поручил вынести правила robot-card workflow из навыка в repository contracts по модели article contracts. Эти файлы являются рабочим source of truth; при последующих изменениях править и contracts, и skill.

## SEO hierarchy

Robot cards own exact model/brand/product commercial queries.

Good primary examples:

```text
аренда Unitree G1
аренда Promobot V4
аренда робота София
аренда Xiaomi CyberDog 2
```

Broad keys belong elsewhere:

```text
аренда роботов                         # homepage / high-frequency commercial
аренда робота-гуманоида                # подборка/hub
роботы для выставки                    # scenario подборка
роботы для детского праздника          # scenario подборка/article support
```

## Visible SEO copy guardrails

The AI summary directly under Hero is not a place to dump exact query variants.

- Keep exact model primary/secondary/long-tail phrases in `seo`, `seoIntent`, SEO maps, metadata and natural body distribution.
- In visible top copy, use human wording and at most one natural model-commercial phrase when it reads normally.
- Do not list scenario long tails back-to-back, for example: `аренда робота Tron для выставки`, `аренда робота Tron для презентации`, `аренда робота Tron для мероприятия`.
- If exact long-tail coverage is needed, distribute it into later relevant sections, FAQ, related/internal link context, or hidden/structured fields; do not make the first post-Hero block look machine-written.
- Before owner handoff, inspect `blocks.aiSummary` for repeated exact keyword stems and shorten by about 15–20% if it reads like SEO copy.

If a card has a generic primary, fix desired SEO state in:

```text
data/seo/working-key-map/seo-key-map.table.json
```

and record source conflicts in `auditIssues` instead of silently overwriting.

## Required research statuses

Use honest statuses:

```text
wordstat: checked_live | user_export | needs_verification
serp: checked_live | needs_verification
seo_passport: done | missing
readiness: ready | draft_for_owner_review | needs_verification
```

Never invent Wordstat volume, SERP results or competitor gaps.

## Required SEO fields for a finished card

- H1 / public title;
- SEO title;
- meta description;
- primary keyword;
- secondary keywords;
- long-tail keywords when available;
- `seoIntent` with commercial robot-rental intent;
- FAQ aligned with robot-specific buying questions;
- parent подборка/hub and internal-link role;
- next action and owner-review status.

## Interlinking

A robot card is usually a conversion endpoint, but should not be a dead end.

Record/check:

```text
parent подборка/hub
supporting articles
adjacent related robots
userJourneyGoal
plannedOutgoingLinks
interlinkingStatus
```

Exact anchors and placements can be implemented during block refresh, but the intended direction must be clear in the working SEO map.


## Owner visual review input — SEO wording in card headings, 2026-09-18

For card sections, SEO wording is useful only when it remains natural and visually manageable.

Example for scenarios:

- Acceptable short heading: `Где использовать Unitree G1`.
- Possible SEO-enriched heading: `Где использовать робота-гуманоида Unitree G1`.

Choose the enriched version only if it fits the layout and does not make the block feel overloaded. Do not force keywords into every H2/H3.

Related article cards and related catalog must be relevant to the robot and journey. Exact card selection can be refined later through the SEO/interlinking plan, but random filler is not acceptable.
