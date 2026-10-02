# KIBER article SEO contract

Status: **owner_approved**
Owner approval note: Александр утвердил текущий пакет контрактов как рабочий source of truth; дальнейшие правки вносятся в эти файлы по ходу работы.

## Mandatory SEO chain

For SEO-significant article work, the required order is:

```text
Wordstat → Yandex SERP → Google SERP → competitor gaps → SEO passport → article block map → writing → rendered audit
```

If any research step is not performed, record it honestly. A page can be a scaffold/draft, but not a final acceptance candidate.

For owner-ready article preview, `needs_verification` is not an acceptable silent fallback for Wordstat/Yandex SERP/Google SERP. If a live check hits captcha, login, tunnel failure or a non-parseable search shell, stop the final handoff path, preserve any completed work as draft/scaffold, and either resolve access/user-export evidence or explicitly ask Alexander whether to proceed as a non-final draft.

## Required statuses

Use these statuses in article notes/reports:

```text
wordstat: checked_live | user_export | needs_verification
yandex_serp: checked_live | needs_verification
google_serp: checked_live | needs_verification
competitor_gaps: done | missing
seo_passport: done | missing
```

## Wordstat rules

For each query, save/record:
- query;
- region;
- device/filter if used;
- period;
- total count;
- table rows;
- relevant rows;
- excluded/noisy rows;
- timestamp;
- evidence path/source.

Do not invent frequencies. Use `checked_live`, `user_export`, or `needs_verification`.

Query set should cover:
- natural primary phrase;
- commercial/rental variants;
- scenario/date/event variants;
- robot type variants;
- model/brand variants when relevant;
- synonyms/transliterations.

## SERP rules

For Yandex and Google, record:
- query;
- region/device when applicable;
- top page types;
- competitor promises;
- recurring headings/questions;
- content gaps;
- risky/noisy intent;
- FAQ opportunities.

SERP informs structure, FAQ, headings and gaps. Do not copy competitor text.

## SEO passport

Before writing final article blocks, create:

```text
primary intent:
primary keyword:
secondary keywords:
search intent:
reader:
reader decision:
article promise:
robots/services:
blocks needed:
blocks intentionally omitted:
SERP/content gaps to cover:
keywords excluded/noise:
verification statuses:
```

The passport is the article contract. If content drifts from it, update the article or update the passport before preview.

## Rendered keyword coverage gate

Before claiming alignment with the working SEO map, read the exact route's primary, desired secondary/long-tail and `gscLongTailSignals` fields. Save query → actual visible public excerpt → coverage type (`exact`, grammatical-semantic, orthographic-semantic, missing, owner-excluded). A keyword array, passport or freshly synchronized report does not prove the intent exists in the article.

Check Cyrillic model/brand naming, model rental/ordering and required geography separately. Geographical intent needs useful verified booking context, not a city token in metadata. Do not duplicate hyphenated/unhyphenated or case-inflected variants merely for exact matches. Explicitly owner-excluded intents remain excluded even when historical GSC evidence or the unchanged slug contains them. Any missing target must be fixed or explicitly disclosed; no blanket claim of full coverage with missing intents.

Existing valid research can support scoped copy corrections. Preserve Google `user_export` provenance and unknown collection metadata honestly; never promote it to live-verified evidence.

## Keyword ownership

- Home: broad/high-frequency rental/category intent.
- Compilations: generic class/scenario grouping intent.
- Robot cards: exact-model commercial intent.
- Articles: long-tail scenario, comparison, explainer and practical decision intent.

Do not make generic compilation/home keywords primary article keywords unless there is explicit owner-approved SEO strategy.
