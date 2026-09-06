# КИБЕР ПОРТАЛ — структура страниц и блоков для Claude

## Что это
Это рабочее ТЗ для Claude/внешнего сервиса/Гермеса: как адаптировать уже написанные тексты под утверждённые шаблоны сайта без переизобретения дизайна. Claude должен писать контент строго по полям блоков, а Hermes затем маппит эти поля в Astro-шаблоны.

## Почему это нужно
SEO-аудит текущих страниц показал 0 fail-блокеров, но 37 routes с warning-долгом: secondary keywords, primary keyword в H1/title/first block, совпадение H1/title с паспортами, breadcrumbs/FAQ/schema/CTA. Поэтому перед массовой переписью контента нужен контракт, а не свободный текст.

## Что практически меняется
- Claude больше не отдаёт “статью одним полотном”.
- Каждый фрагмент должен иметь адрес: `blocks.<blockId>.<fieldName>`.
- Для каждого изображения отдельно нужны `alt`, `actualDescription`, `seoAlt`, `caption`, `sourceStatus`, `rightsStatus`.
- Стиль, порядок и компоненты approved-шаблонов не меняются через текстовую задачу.
- Для статей Claude может выбирать опциональные middle blocks, но обязательное начало и конец фиксированы.

## Что НЕ утверждается этим документом
- production deploy; DNS; secrets; analytics; live lead routing; массовая публикация страниц; изменение визуального дизайна approved блоков.

## Глобальный формат ответа Claude
```json
{
  "requiredTopLevelFields": [
    "contentPackageVersion",
    "pageType",
    "slug",
    "sourceDocuments",
    "seo",
    "aiVisibility",
    "blocks",
    "media",
    "internalLinks",
    "schema",
    "review"
  ],
  "contentPackageVersion": "1.0",
  "fieldAddressingRule": "Every piece of copy must be addressed as blocks.<blockId>.<fieldName>; no unassigned prose is allowed.",
  "sourceStatusValues": [
    "owner_approved",
    "source_document",
    "existing_site",
    "generated_needs_review",
    "needs_business_review",
    "needs_legal_review"
  ],
  "reviewStatusValues": [
    "draft",
    "structurally_valid",
    "needs_owner_review",
    "approved_for_mapping"
  ],
  "forbiddenOutput": [
    "new CSS/design instructions",
    "secret values",
    "production URLs not approved",
    "hidden SEO text",
    "unverified prices/capabilities",
    "raw Wordstat/checklist/service metadata as visible copy"
  ]
}
```

## Общие SEO / AI поля
### `metaTitle`
- required: `True`
- length: 45-65 chars
- renderTarget: <title> + og:title/twitter:title

### `metaDescription`
- required: `True`
- length: 120-160 chars
- renderTarget: meta description + og:description/twitter:description

### `canonicalPath`
- required: `True`
- format: /path/
- renderTarget: canonical

### `primaryKeyword`
- required: `True`
- notes: Must be present or semantically exact in metaTitle, H1, first visible block unless approved visual wording intentionally differs.

### `secondaryKeywords`
- required: `True`
- notes: Must be distributed naturally in visible copy; no keyword stuffing.

### `h1`
- required: `True`
- length: 35-75 chars
- notes: Один H1 на страницу; должен совпадать с page intent, но не ломать утверждённый визуальный стиль.

### `requiredSchemaTypes`
- required: `True`
- by page type: `{"robot_card": ["Service", "BreadcrumbList"], "compilation": ["CollectionPage", "BreadcrumbList", "FAQPage"], "article_detail": ["BlogPosting", "BreadcrumbList", "FAQPage"]}`

### `breadcrumbs`
- required: `True`
- notes: Header before page body, breadcrumbs before Hero.

### `aiSummary`
- required: `True`
- length: 180-320 chars
- notes: Visible concise answer for users and AI agents; no hidden crawler-only text.

## Media / alt policy
- **requiredFieldsPerImage:** ['mediaId', 'role', 'src', 'alt', 'actualDescription', 'seoAlt', 'caption', 'sourceStatus', 'rightsStatus']
- **actualDescription:** Human factual visual description: what is visible, no SEO/long-tail/commercial wording, no subjective hype.
- **seoAlt:** Truthful SEO-aware alt based on actualDescription and page context; no prices, no unverified places/brands/capabilities.
- **commercialAltDistribution:** For every page/block context, roughly every second meaningful image may carry commercial long-tail phrasing, following existing KIBER media policy.
- **rightsStatusValues:** ['approved', 'needs_rights_review', 'decorative_or_service', 'rejected']

## Карточка робота / `robot_card`
- template: `src/components/templates/RobotCardTemplate.astro`
- approval: `owner_visual_structure_approved_desktop_tablet_mobile`
- Claude role: Write field-level copy for fixed blocks; do not add/remove/reorder blocks unless owner updates contract.
- required opening: `['Header', 'Breadcrumbs', 'hero', 'aiSummary']`
- required closing: `['faq', 'finalQuestionsCta', 'articles', 'relatedCatalog']`

| blockId | Название | Обязательный | Порядок | Что пишет Claude | Заголовки | Медиа |
|---|---|---:|---|---|---|---|
| `hero` | Hero карточки робота | да | 1 | eyebrow, h1, priceDisplay, primaryCtaLabel, secondaryCtaLabel, heroImage | h1→h1 | hero |
| `aiSummary` | Коротко / AI summary | да | 2 | paragraph | — | — |
| `gallery` | Галерея | да | 3 | title, images[] | title→h2 | gallery |
| `includedService` | 01 — что входит | да | 4 | eyebrow, title, items[] | title→h2 | — |
| `capabilities` | 02 — ключевые возможности | да | 5 | title, items[], capabilityImages[] | title→h2, items[].title→h3 | capability |
| `scenarios` | 03 — сценарии использования | да | 6 | title, lead, items[] | title→h2, items[].title→h3 | — |
| `pricing` | CTA #1 / аренда конкретной модели | да | 7 | title, description, buttons[] | — | — |
| `robotInAction` | 04 — робот в действии | да | 8 | title, images[] | title→h2 | action_gallery |
| `goshaCta` | Цитата Кибер Гоши | да | 9 | quote, text | — | — |
| `hiddenMachineFacts` | Machine-readable facts | да | 10 | facts[] | — | — |
| `orderFlow` | 05 — как заказать | да | 11 | title, steps[] | title→h2 | — |
| `faq` | FAQ | да | 12 | title, items[] | — | — |
| `finalQuestionsCta` | CTA2 / Остались вопросы? | да | 13 | title, description, buttons[] | — | — |
| `articles` | Блог Кибер Гоши | да | 14 | title, description, cards[] | — | — |
| `relatedCatalog` | Каталог / Вас также могут заинтересовать | да | 15 | title, description, robotSlugs[] | — | — |

### Детальные требования по блокам
#### `hero` — Hero карточки робота
- Обязательный: **да**
- Назначение: Сразу объяснить модель, тип робота, аренду и CTA.
- Component/source: `RobotCardTemplate.astro / template-live-hero`
- Поля: `eyebrow, h1, priceDisplay, primaryCtaLabel, secondaryCtaLabel, heroImage`
- Требования к тексту:
  - `h1`: 35-75 chars; содержит аренда + тип + модель
  - `priceDisplay`: только из approved tariff/source-of-truth; request/not_applicable statuses explicit

#### `aiSummary` — Коротко / AI summary
- Обязательный: **да**
- Назначение: Один короткий видимый ответ: что за робот, где полезен, что делает команда.
- Поля: `paragraph`
- Требования к тексту:
  - `paragraph`: 180-320 chars; один абзац; без склейки meta description; sourceStatus required

#### `gallery` — Галерея
- Обязательный: **да**
- Назначение: Показать approved media робота без дублирования hero/catalog card.
- Поля: `title, images[]`
- Требования к тексту:
  - `title`: короткий H2; без подзаголовка если нечего сказать

#### `includedService` — 01 — что входит
- Обязательный: **да**
- Назначение: Снять риск: аренда = робот + доставка + оператор + настройка сценария.
- Поля: `eyebrow, title, items[]`
- Требования к тексту:
  - `items`: 4 items; 90-110 chars each; FAQ-like side inset; no invented service promises

#### `capabilities` — 02 — ключевые возможности
- Обязательный: **да**
- Назначение: Понятно объяснить функциональность модели.
- Поля: `title, items[], capabilityImages[]`
- Требования к тексту:
  - `items`: 4-6 capabilities; facts from source/manufacturer/site; sourceStatus required

#### `scenarios` — 03 — сценарии использования
- Обязательный: **да**
- Назначение: Показать где робот создаёт эффект на мероприятии.
- Поля: `title, lead, items[]`
- Требования к тексту:
  - `items`: 3-6 cards; each title 2-5 words; text 90-180 chars

#### `pricing` — CTA #1 / аренда конкретной модели
- Обязательный: **да**
- Назначение: Первый коммерческий переход после пользы/сценариев.
- Component/source: `HomeFinalCta`
- Поля: `title, description, buttons[]`
- Требования к тексту:
  - `title`: Арендуйте <тип> <модель> для мероприятия; no price if not approved

#### `robotInAction` — 04 — робот в действии
- Обязательный: **да**
- Назначение: Вторая media-gallery с действием/гостями/площадкой, не catalog stills.
- Поля: `title, images[]`

#### `goshaCta` — Цитата Кибер Гоши
- Обязательный: **да**
- Назначение: Брендовый голос: лёгкая фраза + практичный подвод к менеджеру.
- Component/source: `HomeGoshaQuote`
- Поля: `quote, text`
- Требования к тексту:
  - `quote`: 1 funny/useful line, not childish; text 140-260 chars

#### `hiddenMachineFacts` — Machine-readable facts
- Обязательный: **да**
- Назначение: JSON facts for schema/audit; not hidden SEO prose; safe only as structured data.
- Поля: `facts[]`
- Требования к тексту:
  - `facts`: factual, sourceStatus, no crawler-only marketing copy

#### `orderFlow` — 05 — как заказать
- Обязательный: **да**
- Назначение: Объяснить процесс заявки без лишней сложности.
- Поля: `title, steps[]`
- Требования к тексту:
  - `steps`: 3-5 steps; 90-110 chars each; FAQ-like side insets

#### `faq` — FAQ
- Обязательный: **да**
- Назначение: Закрыть возражения и дать FAQPage schema.
- Component/source: `HomeFaqBlock`
- Поля: `title, items[]`
- Требования к тексту:
  - `items`: 3-6 Q/A; answers 180-450 chars; no unsupported claims

#### `finalQuestionsCta` — CTA2 / Остались вопросы?
- Обязательный: **да**
- Назначение: Финальный контактный блок approved homepage style.
- Component/source: `HomeFinalCta`
- Поля: `title, description, buttons[]`

#### `articles` — Блог Кибер Гоши
- Обязательный: **да**
- Назначение: Внутренняя перелинковка на статьи по смыслу робота.
- Component/source: `HomeImageCards`
- Поля: `title, description, cards[]`
- Требования к тексту:
  - `cards`: 3 or 6 cards; existing/approved routes preferred

#### `relatedCatalog` — Каталог / Вас также могут заинтересовать
- Обязательный: **да**
- Назначение: Рекомендовать связанные модели.
- Component/source: `RobotCard grid`
- Поля: `title, description, robotSlugs[]`
- Требования к тексту:
  - `robotSlugs`: 3-4 relevant robots from source-of-truth; no invented items

## Подборка / `compilation`
- template: `src/components/templates/CompilationTemplate.astro`
- approval: `owner_visual_structure_approved_desktop_tablet_mobile`
- Claude role: Write into fixed подборка blocks; may choose gallery/video only if approved media exists.
- required opening: `['Header', 'Breadcrumbs', 'hero', 'intro', 'introGosha']`
- required closing: `['faq', 'cta2', 'catalogBlock', 'relatedArticles', 'otherCompilations']`

| blockId | Название | Обязательный | Порядок | Что пишет Claude | Заголовки | Медиа |
|---|---|---:|---|---|---|---|
| `hero` | Hero подборки | да | 1 | eyebrow, h1, lead, heroImage | h1→h1 | hero_group_or_theme |
| `intro` | SEO / AI intro подборки | да | 2 | title, paragraphs[] | title→h2 | — |
| `introGosha` | Вводный комментарий Кибер Гоши | да | 3 | quote, text | — | — |
| `gallery` | Галерея подборки | нет | 4 | title, lead, images[] | — | collection_gallery |
| `choiceGuide` | Гид по выбору | да | 5 | title, lead, steps[] | title→h2, steps[].title→h3 | — |
| `video` | Видео | нет | 6 | title, lead, videoId|embedLink, posterImage | — | video |
| `scenarioExplanation` | Сценарии | да | 7 | title, lead, items[] | title→h2, items[].title→h3 | — |
| `goshaConclusion` | Финальный комментарий Кибер Гоши | да | 8 | quote, text | — | — |
| `faq` | FAQ подборки | да | 9 | title, items[] | — | — |
| `cta2` | CTA2 / Остались вопросы? | да | 10 | title, description, buttons[] | — | — |
| `catalogBlock` | Каталог роботов по теме | да | 11 | eyebrow, title, description, robotSlugs[] | — | — |
| `relatedArticles` | Блог Кибер Гоши | да | 12 | title, lead, cards[] | — | — |
| `otherCompilations` | Подборки | да | 13 | title, description, cards[] | — | — |

### Детальные требования по блокам
#### `hero` — Hero подборки
- Обязательный: **да**
- Назначение: Назвать сценарий/класс роботов и коммерческий intent.
- Поля: `eyebrow, h1, lead, heroImage`

#### `intro` — SEO / AI intro подборки
- Обязательный: **да**
- Назначение: Коротко объяснить, что выбрать и кому подходит подборка.
- Поля: `title, paragraphs[]`
- Требования к тексту:
  - `paragraphs`: 1-3 paragraphs, visible, with primary/secondary keywords naturally

#### `introGosha` — Вводный комментарий Кибер Гоши
- Обязательный: **да**
- Назначение: Брендовый помощник перед разбором моделей.
- Component/source: `HomeGoshaQuote`
- Поля: `quote, text`

#### `gallery` — Галерея подборки
- Обязательный: **нет**
- Назначение: Показывает класс/сценарий, если есть approved media.
- Поля: `title, lead, images[]`

#### `choiceGuide` — Гид по выбору
- Обязательный: **да**
- Назначение: Объяснить критерии выбора внутри подборки.
- Поля: `title, lead, steps[]`
- Требования к тексту:
  - `steps`: 3-5 cards; compare scenarios, not generic sales copy

#### `video` — Видео
- Обязательный: **нет**
- Назначение: Kinescope/approved video if meaningful.
- Поля: `title, lead, videoId|embedLink, posterImage`

#### `scenarioExplanation` — Сценарии
- Обязательный: **да**
- Назначение: Сценарные карточки применения подборки.
- Поля: `title, lead, items[]`

#### `goshaConclusion` — Финальный комментарий Кибер Гоши
- Обязательный: **да**
- Назначение: Переход от объяснения к выбору/заявке.
- Component/source: `HomeGoshaQuote`
- Поля: `quote, text`

#### `faq` — FAQ подборки
- Обязательный: **да**
- Назначение:
- Component/source: `HomeFaqBlock`
- Поля: `title, items[]`
- Schema: `['FAQPage']`

#### `cta2` — CTA2 / Остались вопросы?
- Обязательный: **да**
- Назначение:
- Component/source: `HomeFinalCta`
- Поля: `title, description, buttons[]`

#### `catalogBlock` — Каталог роботов по теме
- Обязательный: **да**
- Назначение: Связать статью с релевантными моделями каталога и дать коммерческий путь после FAQ/CTA.
- Component/source: `RobotCard grid`
- Поля: `eyebrow, title, description, robotSlugs[]`
- Требования к тексту:
  - `robotSlugs`: all relevant approved robots; order by business/SEO meaning

#### `relatedArticles` — Блог Кибер Гоши
- Обязательный: **да**
- Назначение: Продолжить чтение в Блоге Кибер Гоши по близким вопросам и усилить тематическую перелинковку.
- Component/source: `HomeImageCards`
- Поля: `title, lead, cards[]`

#### `otherCompilations` — Подборки
- Обязательный: **да**
- Назначение: Показать соседние подборки, чтобы пользователь мог перейти к альтернативному сценарию выбора роботов.
- Component/source: `HomeImageCards`
- Поля: `title, description, cards[]`

## Статья / `article_detail`
- template: `src/components/templates/ArticleBlocksTemplate.astro`
- approval: `owner_visual_structure_meaning_approved_desktop_tablet_mobile`
- Claude role: Choose appropriate optional middle blocks and output block-labeled fields. Required start/end cannot be omitted.
- required opening: `['Header', 'Breadcrumbs', 'hero', 'seoIntro']`
- mandatory flexible middle: `['plainText', 'goshaQuote']`
- required closing: `['faq', 'cta2', 'catalogBlock', 'relatedArticles', 'relatedCompilations']`
- optional blocks: `['mediaMoment', 'robotCardGallery', 'comparisonBlock', 'obviousChoice', 'numberedUseCases', 'checkpointList', 'pairedEnumeration', 'productCard']`

| blockId | Название | Обязательный | Порядок | Что пишет Claude | Заголовки | Медиа |
|---|---|---:|---|---|---|---|
| `hero` | Hero статьи | да | 1 | eyebrow, h1, lead, heroImage | h1→h1 | — |
| `seoIntro` | SEO / AI intro | да | 2 | eyebrow, title, paragraphs[] | title→h2 | — |
| `plainText` | Простой текстовый блок с заголовком | да | after seoIntro, flexible | title, paragraphs[] | title→h2 | — |
| `goshaQuote` | Цитата Кибер Гоши | да | after seoIntro, flexible | quote, text | — | — |
| `mediaMoment` | Фото / видео момент | нет | optional middle | eyebrow, title, lead, image|video, caption | — | article_moment |
| `robotCardGallery` | Галерея | нет | optional middle | eyebrow, title, lead, images[] | — | article_gallery |
| `comparisonBlock` | Сравнение | нет | optional middle | eyebrow, title, lead, columns[]|table | title→h2 | — |
| `obviousChoice` | Выбор | нет | optional middle | eyebrow, title, cards[] | — | — |
| `numberedUseCases` | Форматы / сценарии | нет | optional middle | eyebrow, title, items[] | — | — |
| `checkpointList` | Чек-лист | нет | optional middle | eyebrow, title, items[] | — | — |
| `pairedEnumeration` | Перечисление | нет | optional middle | eyebrow, title, items[] | — | — |
| `productCard` | Одна рекомендованная модель | нет | optional before closing | eyebrow, title, featuredSlug, reason, ctaLabel | — | — |
| `faq` | FAQ статьи | да | closing 1 | title, items[] | — | — |
| `cta2` | CTA2 / Остались вопросы? | да | closing 2 | title, description, buttons[] | — | — |
| `catalogBlock` | Каталог роботов | да | closing 3 | eyebrow, title, description, robotSlugs[] | — | — |
| `relatedArticles` | Блог Кибер Гоши | да | closing 4 | eyebrow, title, description, cards[] | — | — |
| `relatedCompilations` | Подборки | да | closing 5 | eyebrow, title, description, cards[] | — | — |

### Детальные требования по блокам
#### `hero` — Hero статьи
- Обязательный: **да**
- Назначение: Название статьи и быстрый смысл.
- Поля: `eyebrow, h1, lead, heroImage`
- Требования к тексту:
  - `h1`: article intent; no generic 'шаблон' for real article

#### `seoIntro` — SEO / AI intro
- Обязательный: **да**
- Назначение: Первый видимый ответ для людей и AI agents.
- Поля: `eyebrow, title, paragraphs[]`
- Требования к тексту:
  - `paragraphs`: 1-3 paragraphs; primary keyword/intent in first paragraph; no hidden text

#### `plainText` — Простой текстовый блок с заголовком
- Обязательный: **да**
- Назначение: Нормальный editorial explanation without complex layout.
- Поля: `title, paragraphs[]`

#### `goshaQuote` — Цитата Кибер Гоши
- Обязательный: **да**
- Назначение: Брендовый голос/объяснение сложного выбора.
- Component/source: `HomeGoshaQuote`
- Поля: `quote, text`

#### `mediaMoment` — Фото / видео момент
- Обязательный: **нет**
- Назначение: Иллюстрация момента из статьи.
- Поля: `eyebrow, title, lead, image|video, caption`

#### `robotCardGallery` — Галерея
- Обязательный: **нет**
- Назначение: Несколько изображений/кадров по теме статьи.
- Поля: `eyebrow, title, lead, images[]`

#### `comparisonBlock` — Сравнение
- Обязательный: **нет**
- Назначение: Сравнить модели/форматы/характеристики.
- Поля: `eyebrow, title, lead, columns[]|table`
- Требования к тексту:
  - `table`: headers + rows + optional note; no unsupported specs

#### `obviousChoice` — Выбор
- Обязательный: **нет**
- Назначение: Когда читателю нужно быстро понять что выбрать.
- Поля: `eyebrow, title, cards[]`
- Требования к тексту:
  - `cards`: 2-4 cards with title/text

#### `numberedUseCases` — Форматы / сценарии
- Обязательный: **нет**
- Назначение: Нумерованный список сценариев применения.
- Поля: `eyebrow, title, items[]`

#### `checkpointList` — Чек-лист
- Обязательный: **нет**
- Назначение: Практические пункты проверки перед заявкой.
- Поля: `eyebrow, title, items[]`

#### `pairedEnumeration` — Перечисление
- Обязательный: **нет**
- Назначение: Пары/варианты/фирменные моменты.
- Поля: `eyebrow, title, items[]`

#### `productCard` — Одна рекомендованная модель
- Обязательный: **нет**
- Назначение: Рекомендовать одну или несколько моделей; для сравнений может быть несколько instances.
- Поля: `eyebrow, title, featuredSlug, reason, ctaLabel`
- Требования к тексту:
  - `featuredSlug`: must exist in robot source-of-truth

#### `faq` — FAQ статьи
- Обязательный: **да**
- Назначение:
- Component/source: `HomeFaqBlock`
- Поля: `title, items[]`
- Schema: `['FAQPage']`

#### `cta2` — CTA2 / Остались вопросы?
- Обязательный: **да**
- Назначение:
- Component/source: `HomeFinalCta`
- Поля: `title, description, buttons[]`

#### `catalogBlock` — Каталог роботов
- Обязательный: **да**
- Назначение:
- Component/source: `RobotCard grid`
- Поля: `eyebrow, title, description, robotSlugs[]`

#### `relatedArticles` — Блог Кибер Гоши
- Обязательный: **да**
- Назначение:
- Component/source: `HomeImageCards`
- Поля: `eyebrow, title, description, cards[]`

#### `relatedCompilations` — Подборки
- Обязательный: **да**
- Назначение: Показать подборки по смыслу статьи для перехода от чтения к выбору группы роботов.
- Component/source: `HomeImageCards`
- Поля: `eyebrow, title, description, cards[]`

## Примеры content package
- `data/content-contracts/examples/robot_card.unitree-g1.example.json`
- `data/content-contracts/examples/compilation.roboty-gumanoidy.example.json`
- `data/content-contracts/examples/article.unitree-g1-r1-h2.example.json`

## Следующий безопасный шаг
После owner review этого ТЗ: дать Claude один пробный пакет для одной карточки робота, одной подборки и одной статьи; прогнать validator; только затем масштабировать на остальные тексты.
