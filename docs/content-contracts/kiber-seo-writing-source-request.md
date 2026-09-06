# What Alexander should send for KIBER SEO writing corpus

## 1. Historical texts

Please send materials as files/archives, not pasted chat walls when possible:

- all Claude-written Подборки, ideally one file per page;
- all 60+ articles, ideally with titles/slugs/metadata if available;
- robot card texts/source docs;
- old Claude prompts/skills/checklists if you can export them;
- any Wordstat tables/screenshots/CSV used for those pages;
- any SERP/competitor notes Claude produced.

Accepted formats:

```text
.zip
.docx
.md
.txt
.csv
.xlsx
.json
html export
screenshots only when no table export exists
```

## 2. Metadata to include if known

For each file/page, include if available:

```text
pageType: article_detail | compilation | robot_card
slug / intended URL
primary keyword
secondary keywords
Wordstat date/region
competitors checked
publication status
whether text is approved / draft / rejected
```

## 3. Yandex Wordstat access

Do not paste Yandex password in chat.

Preferred autonomous access options:

### Option A — safest
Create a separate Yandex account only for Wordstat/SEO research. Store credentials in 1Password in a vault visible to Hermes and send only `op://...` references.

### Option B — browser session
Log into Yandex once in a local browser profile on this machine. Hermes can use the persisted session for Wordstat research. If captcha/2FA appears, you handle it manually.

### Option C — exports
Send Wordstat CSV/screenshots. Hermes will mark those as `user_export`.

## 4. First pilot recommendation

Start with one article_detail pilot, because the article template is approved and prior DOCX conversion exposed the need for strict research/package structure.
