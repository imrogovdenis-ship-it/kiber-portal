# KIBER SEO Content Research & Writing Protocol

Status: `draft_for_owner_review`
Created: `2026-09-06T09:14:58.222351+00:00`

## Goal

From now on, KIBER PORTAL content can be written by Hermes/Gefest without Claude as the writing tool, but with the same research discipline:

```text
Brief → Wordstat → SERP → competitor gaps → SEO passport → block map → Kiber Gosha draft → fact/media safety → JSON package → validation → preview → owner review
```

This protocol applies to:

- `robot_card` — карточки роботов;
- `compilation` — Подборки;
- `article_detail` — статьи Блога Кибер Гоши.

## Critical rule

Hermes must not write “just prose”. Every content result must be a structured content package with fields:

```text
contentPackageVersion
pageType
slug
sourceDocuments
research
seo
aiVisibility
blocks
media
internalLinks
schema
review
```

Research notes such as Wordstat tables and competitor analysis stay in `research.*` and review docs. They must not appear as visible public page copy.

## Stage checklist

1. **Brief** — define page type, slug, audience, conversion goal, source files, claim risks.
2. **Wordstat** — check live Wordstat or mark `needs_wordstat_verification`; never invent volumes.
3. **SERP** — inspect top search results for selected queries.
4. **Competitor gaps** — record what competitors miss; do not mock competitors publicly.
5. **SEO passport** — title, description, H1, canonical, primary/secondary/long-tail keys, schema, AI summary.
6. **Block map** — map every text item to approved blocks before writing.
7. **Kiber Gosha style pass** — apply dosage by format; no Gosha in metadata/alt/tables.
8. **Fact/media safety pass** — prices/capabilities/media/legal claims require sources or open questions.
9. **Internal links** — reviewable proposals only, with route validation.
10. **Validation/preview** — run validators and preview-only/noindex checks.

## Source corpus policy

Alexander may provide old Claude-written content:

- 6–7 Подборки;
- 60+ articles;
- robot card texts;
- any old Claude skills/prompts/checklists.

Use them as source corpus and examples, not as blind final copy. Extract:

- successful structure;
- tone patterns;
- SEO decisions;
- fact sources;
- recurring FAQ/CTA patterns;
- content gaps;
- weak/obsolete claims.

## Wordstat access policy

Preferred autonomous options:

1. Dedicated Yandex research account stored in 1Password; Hermes receives only `op://...` references, never password in chat.
2. Alexander logs into Yandex once in a browser profile; Hermes uses persisted session cookies without knowing the password.
3. Alexander exports CSV/screenshots; Hermes marks research as `user_export`.

If Yandex asks for captcha/2FA, Hermes stops and asks for human action. No captcha/2FA bypass.

## Validation

Run:

```bash
python3 scripts/validate_kiber_seo_research_writing_protocol.py
npm run test:kiber-seo-writing-protocol
python3 scripts/validate_claude_content_contracts.py
```

## Publication boundary

This protocol does not authorize production, DNS, secrets, analytics, live lead routing, merge, or mass generation. First use one pilot per page type, then scale after approval.
