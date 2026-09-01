# KIBER PORTAL — SEO-component checklist и gap-анализ перед размножением страниц

Статус: **draft / на утверждение**  
Причина: Александр поставил визуальную задачу страниц на паузу и попросил до массового создания робот-карточек, статей, подборок и остальных страниц сначала утвердить обязательные SEO-компоненты.

## Решение процесса

До утверждения этого SEO-компонентного контракта **не размножаем страницы из шаблонов массово**.

Правильный порядок:

1. Дизайн страниц утверждается отдельно.
2. SEO-компонентная модель утверждается отдельно.
3. Создаётся машинный аудитор SEO-компонентов.
4. Все уже подготовленные страницы прогоняются через аудит.
5. Только после этого масштабируем шаблоны: роботы, статьи, подборки, новости, служебные страницы.

Это не production approval, не merge approval и не разрешение включать live lead routing / analytics / DNS / production secrets.

## Что уже есть в репозитории

### Уже есть / частично закрыто

| Блок | Текущее состояние | Файлы / gates |
|---|---|---|
| Базовый SEO head | Есть `title`, `description`, `canonical`, `robots`, viewport, OG/Twitter image/title/description/url | `src/components/layout/SeoHead.astro`, `src/layouts/BaseLayout.astro` |
| Canonical / sitemap registry | Есть `launch-routes`, `production-url-registry`, sitemap smoke | `data/seo/launch-routes.json`, `data/seo/production-url-registry.json`, `scripts/route-sitemap-smoke.mjs` |
| Index/noindex preview boundary | Есть preview/noindex и проверка sitemap leak | `SeoHead.astro`, `route-sitemap-smoke.mjs`, `production approval gates` |
| H1 uniqueness | Есть проверка ровно одного H1 и уникальности для launch routes | `scripts/seo-metadata-structured-data-smoke.mjs` |
| OG/Twitter | Есть rendered smoke для launch routes | `scripts/seo-metadata-structured-data-smoke.mjs` |
| Schema.org базовые helpers | Есть `Organization`, `WebSite`, `Service`, `ContactPage`, `CollectionPage`, `WebPage`, `FAQPage`, `BreadcrumbList` | `src/lib/seo.ts`, `Breadcrumbs.astro` |
| Robot detail schema | Есть `Service` + `BreadcrumbList` contract | `src/pages/robots/[slug].astro`, `scripts/seo-metadata-structured-data-smoke.mjs` |
| Breadcrumbs | Есть компонент + JSON-LD, но не везде обязателен | `src/components/layout/Breadcrumbs.astro` |
| Internal links | Есть curated registry и review-only proposal boundary | `data/seo/internal-links.json`, `data/seo/internal-link-proposals.json`, `scripts/internal-links-rendering-smoke.mjs` |
| Images / alt | Есть media rights, approved media rendering, rendered image alt audits | `data/review/media-rights-*`, `scripts/*media*`, `data/seo/rendered-image-alt-audit.json` |
| Semantic core lifecycle | Есть registry, но он ещё не связан как обязательный page passport по каждому URL | `data/seo/semantic-core.json` |
| Performance / static readiness | Есть performance budgets, route crawl, go/no-go gates | `scripts/performance-budget-smoke.mjs`, readiness/go-no-go scripts |
| Legal/contact trust | Есть legal docs, contacts route, lead safety gates | `data/legal/legal-documents.json`, `contacts`, `lead capability` |

### Главный пробел

Сейчас проверки разнесены по нескольким gates. Нет единой сущности **SEO-паспорт страницы**, где по каждому URL заранее зафиксированы:

- `pageType`;
- `indexable` / `robotsStatus`;
- `primaryKeyword`;
- `secondaryKeywords`;
- `searchIntent`;
- `title`;
- `description`;
- `h1`;
- обязательные H2/H3;
- минимальный текстовый блок;
- required schema types;
- breadcrumbs;
- internal links;
- CTA;
- image roles / actualDescription / seoAlt;
- review status.

Из-за этого агент может проверить “есть title/canonical/H1”, но ещё не может уверенно сказать: **эта страница SEO-собрана под конкретный поисковый intent**.

## Обязательный SEO-паспорт страницы

Предлагаемый тип:

```ts
type SeoPagePassport = {
  slug: string;
  pageType:
    | 'home'
    | 'robot_card'
    | 'collection'
    | 'article'
    | 'news'
    | 'contacts'
    | 'legal'
    | 'landing';

  indexable: boolean;
  robotsStatus: 'index' | 'noindex' | 'draft' | 'redirect' | 'canonical_duplicate' | 'excluded';
  canonical: string;

  primaryKeyword: string;
  secondaryKeywords: string[];
  searchIntent: 'commercial' | 'informational' | 'navigational' | 'transactional' | 'local';
  pageCluster: string;
  priority: 'high' | 'medium' | 'low';

  title: string;
  description: string;
  h1: string;
  h2Required: string[];
  minUsefulTextChars: number;

  ogTitle: string;
  ogDescription: string;
  ogImage: string;

  schemaTypesRequired: string[];
  breadcrumbsRequired: { label: string; href: string }[];
  internalLinksRequired: { href: string; anchorIntent: string }[];

  imagesRequired: {
    role: 'hero' | 'card' | 'gallery' | 'icon' | 'decorative' | 'og';
    meaningful: boolean;
    requiresActualDescription: boolean;
    requiresSeoAlt: boolean;
  }[];

  ctaRequired: {
    labelIntent: string;
    targetType: 'lead_form' | 'phone' | 'telegram' | 'whatsapp' | 'max' | 'email' | 'page_link';
    target: string;
  }[];

  reviewStatus: 'approved' | 'needs_review' | 'missing_required_fields';
};
```

## Минимальная проверка для каждой indexable страницы

Аудитор должен проходить по rendered `dist/` + source data и выдавать по каждому URL `pass/warn/fail`:

| Check | Severity | Комментарий |
|---|---:|---|
| HTTP status 200 | fail | Для rendered static можно проверять файл + staging smoke |
| URL человеко-понятный | fail/warn | Латиница, без случайных ID, без `.html` для новых canonical |
| indexable = true | fail | Для launch routes |
| нет `noindex` | fail | Для production indexable |
| canonical есть | fail | Уже частично есть |
| canonical совпадает с финальным URL | fail | Уже частично есть |
| title есть | fail | Уже есть |
| title уникальный | fail | Уже есть |
| title содержит primary keyword | fail/warn | **Нет единого keyword-map** |
| description есть | fail | Уже есть |
| description уникальный | fail/warn | Частично нужно усилить |
| description содержит коммерческий/informational intent | warn | Нужен паспорт |
| H1 ровно один | fail | Уже есть |
| H1 содержит primary keyword или точную тему | fail/warn | **Нужен паспорт** |
| H2 есть | warn/fail по типу | Нужен unified check |
| heading hierarchy корректная | warn | Есть отдельные audits, надо связать |
| основной текст есть | warn/fail по типу | Нужно считать полезные символы |
| primary keyword в первом смысловом блоке | warn/fail | Нужен keyword-map |
| secondary keywords естественно распределены | warn | Нужен keyword-map + visible text scan |
| meaningful images имеют alt | fail/warn | Частично есть |
| decorative images имеют `alt=""` | warn | Нужно уточнить role map |
| OG title/description/image/url | fail | Уже есть |
| Twitter card | fail | Уже есть |
| visible breadcrumbs | warn/fail по типу | Есть компонент, но не общий requirement |
| BreadcrumbList schema | fail для вложенных | Частично есть |
| required schema.org types | fail/warn | Нужно расширить по pageType |
| internal links | warn/fail | Есть curated links, но нет per-page requirement |
| CTA | warn/fail | Есть CTA gates, но не как паспорт |
| sitemap inclusion | fail | Уже есть |
| robots.txt compatibility | fail | Нужно включить в aggregate auditor |
| no broken links/images | fail | Частично есть |
| mobile viewport | fail | Уже есть в head |
| no horizontal overflow | fail | Есть visual QA / responsive gates |
| semantic HTML/accessibility | warn | Есть частично, надо включить summary |
| trust/legal/contact links where applicable | warn/fail | Есть, но надо связать с pageType |

## PageType-specific обязательные компоненты

### `home`

Required:

- primaryKeyword: `аренда роботов` / `прокат роботов`;
- one H1 with commercial rental intent;
- catalog/robots block;
- compilations block;
- article/blog block;
- CTA;
- Organization JSON-LD;
- WebSite JSON-LD;
- recommended: ItemList for popular robots/sections.

Current gap: homepage has Organization/WebSite/FAQPage and sections; no explicit page passport tying all this to primary/secondary keywords and required internal links.

### `robot_card`

Required:

- primaryKeyword: `аренда {модель}`;
- title/H1/description contain model rental intent;
- H2 blocks: abilities, scenarios, formats, included service, price/request, media, FAQ, order flow;
- media roles and truthful alts;
- Service JSON-LD;
- BreadcrumbList;
- FAQPage if visible FAQ exists;
- related robots / collections / articles;
- CTA to lead/contact path.

Current gap: robot pages have unified template, Service JSON-LD, BreadcrumbList, media and route gates; missing explicit per-robot keyword passport and per-robot H2/FAQ/related/CTA completeness audit.

### `collection`

Required:

- group/scenario primary keyword;
- scenario intro text;
- list of suitable robots;
- ItemList JSON-LD recommended;
- CollectionPage JSON-LD;
- BreadcrumbList for nested/group pages;
- internal links to robot cards/articles;
- FAQ and CTA.

Current gap: CollectionPage exists for current category/compilation pages, but ItemList/FAQ/page passport are not enforced uniformly.

### `article`

Required:

- informational primary keyword;
- title/description/H1;
- author/publisher where applicable;
- publish/update dates;
- BlogPosting or Article JSON-LD;
- BreadcrumbList;
- internal links to commercial pages;
- meaningful image alts;
- FAQ if visible.

Current gap: article index exists; detail articles are still deferred/human-gated. No Article/BlogPosting passport/audit for future detail pages yet.

### `news`

Required:

- title/description/H1;
- publish/update date;
- NewsArticle JSON-LD;
- source/context discipline: do not invent facts;
- links to related robots/services;
- no placeholder page before launch.

Current gap: `/news/` remains the active high FSVQA finding; NewsArticle detail model is not yet approved.

### `contacts`

Required:

- title/description/H1;
- NAP/trust: company name, phone, email, city/address where approved;
- messengers;
- legal links;
- ContactPage and possibly Organization/LocalBusiness if legally correct;
- CTA/form path.

Current gap: contacts/trust exists; LocalBusiness decision should be explicit before adding that schema.

### `legal`

Required:

- legal title/description/H1;
- WebPage/BreadcrumbList;
- no forced sitemap if policy says legal pages stay available but not sitemap;
- cross-links between legal docs;
- no marketing keyword stuffing.

Current gap: legal docs exist and are gated; need page passport status that distinguishes `available_not_sitemap` from SEO landing pages.

## Proposed files to add after approval

```text
data/seo/page-seo-passports.json
  Source-of-truth passports for every controlled URL.

data/seo/keyword-map.json
  Keyword/intent map, can be embedded into passports later if preferred.

scripts/audit_page_seo_components.py
  Aggregated rendered/source/sitemap/robots/image/link/schema auditor.

data/seo/page-seo-audit.json
  Machine output: per-route checks, missing, warnings, blockers.

docs/page-seo-audit.md
  Human-readable report for review in chat/PR/Linear.

tests/visual/page-seo-components-contract.test.ts
  Source contract: files exist, schema fields present, npm script wired.
```

## Proposed `npm` gate after implementation

```json
{
  "test:page-seo-components": "npm run build:production && python3 scripts/audit_page_seo_components.py"
}
```

Then add it to CI only after the first audit baseline is reviewed. First pass can be `warning` for content debt, then ratchet to `fail` for approved page types.

## Draft pass/warn/fail policy

### Fail immediately for indexable production pages

- missing/duplicate title;
- missing/duplicate H1;
- missing canonical;
- canonical mismatch;
- noindex on sitemap/indexable page;
- indexable page missing from sitemap;
- broken internal links/images;
- invalid JSON-LD;
- required schema type missing for approved page type;
- meaningful hero/card image has empty/missing alt;
- robots.txt blocks production site;
- random/legacy URL published without redirect/canonical decision.

### Warn until content approval

- primary keyword not in first paragraph;
- secondary keyword missing from visible text;
- useful text shorter than pageType target;
- FAQ schema missing where visible FAQ does not yet exist;
- ItemList missing on collection pages;
- weak internal links / too generic anchor text;
- missing related links;
- missing publish/update date on draft article/news models.

### Allowed exceptions

- preview/parity/design-review/test routes: `noindex,nofollow`, not in sitemap;
- lead thank-you pages: noindex, not in sitemap;
- legal pages: may be available and noindex/not-sitemap depending approved policy;
- decorative images: `alt=""` is correct;
- generated internal-link proposals: review-only, must not render publicly;
- live lead destinations/analytics scripts remain disabled until separate approval.

## Current conclusion

The repo already has strong **technical SEO gates**, but they are not yet the same as a full **SEO intent/component passport**.

Before multiplying pages, we should create and approve:

1. `page-seo-passports.json` schema/contract;
2. `keyword-map.json` or embedded keyword fields;
3. `audit_page_seo_components.py` aggregate auditor;
4. page-type required schema map;
5. per-route report output in JSON + Markdown;
6. Linear task that explicitly says: “no mass page generation until SEO-component audit passes or known warnings are approved.”

## Sources / owner-provided references

- Google Search Central SEO Starter Guide: `https://developers.google.com/search/docs/fundamentals/seo-starter-guide`
- Яндекс Вебмастер рекомендации: `https://yandex.ru/support/webmaster/ru/recommendations/intro.html`
- Owner-provided SEO component brief in Telegram, 2026-09-01.
