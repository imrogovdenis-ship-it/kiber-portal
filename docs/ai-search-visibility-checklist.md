# KIBER PORTAL — AI Search Visibility / LLM Optimization checklist

Статус: **draft / AI crawler policy owner-approved**
Задача: **KIBER-93**
Назначение: расширить классический SEO-паспорт страницы отдельным слоем для AI-поиска и агентных систем: ChatGPT Search, Claude/Grok/Perplexity-style answers, Gemini и будущие site agents.

## Почему это отдельный слой

Классическое SEO остаётся базой: страница должна быть индексируемой, понятной, технически доступной, с полезным контентом, title/description/H1/canonical/schema/sitemap/robots.[2]

Но AI-поиск часто работает не как “запрос → список ссылок”, а как “запрос → модель читает источники → формирует ответ → иногда даёт ссылки”. Поэтому нам нужно помогать машине быстро понять сущности, факты, вопросы, услуги, сценарии, ограничения и доверие.

OpenAI отдельно описывает поисковых/краулерных user agents: `OAI-SearchBot` связан с search features, `ChatGPT-User` — с пользовательскими действиями в ChatGPT, а `GPTBot` управляется отдельно для crawling/training use cases через robots.txt.[1]

`llms.txt` — proposal, а не официальный стандарт Google/Яндекс, но он полезен как короткий Markdown-путеводитель для LLM/агентов по важным страницам сайта.[3]

## Что уже частично реализовано в KIBER-93

- Классический SEO-аудитор уже проверяет title, description, canonical, robots, H1/H2, visible text, keywords, alts, OG/Twitter, JSON-LD, breadcrumbs, internal links, CTA, sitemap и robots.txt.
- Добавлены `aiVisibility` поля в `data/seo/page-seo-passports.json`.
- Добавлен `data/seo/ai-entity-map.json`.
- Добавлен `/llms.txt` через `public/llms.txt`.
- `scripts/audit_page_seo_components.py` расширяется AI visibility checks.

## Обязательные AI visibility условия

Для каждой важной/indexable страницы:

1. `aiSummary` — короткий ответ в начале/паспорте: что это, для кого, зачем, как заказать.
2. `entityClarity` — явно названы сущности: КИБЕР ПОРТАЛ, робот, услуга, сценарий, география.
3. `questionAnswerBlocks` — страница отвечает на реальные вопросы пользователя.
4. `structuredFacts` — есть факты в списке/таблице/структурном блоке: модель, тип, услуга, сценарии, география, цена/условия, ограничения.
5. `schema.org` — JSON-LD сохраняется как машинно-читаемый слой.
6. `breadcrumbs` — связи в структуре сайта понятны человеку и машине.
7. `internalEntityLinks` — страница связана с родительскими и родственными сущностями.
8. `llmsTxtCoverage` — важная страница или раздел присутствует в `/llms.txt`.
9. `markdownAlternateOrLlmsEntry` — Markdown-версия или хотя бы LLM-friendly запись в `llms.txt`.
10. `aiCrawlerRobotsPolicy` — нужно отдельно решить robots.txt policy для `OAI-SearchBot`, `ChatGPT-User`, `GPTBot`.
11. Важные факты не спрятаны только в картинках.
12. Важные факты не подгружаются только JS после загрузки.
13. Нет противоречий в ценах, описаниях, характеристиках.
14. Для статей/новостей есть дата публикации/обновления и источник/контекст.
15. Для спорных фактов есть source status: `owner_approved`, `page_content`, `manufacturer`, `needs_review`.

## AI-паспорт внутри SEO-паспорта

```ts
type AiVisibilityPassport = {
  aiSummary: string;
  entityType: 'service' | 'product' | 'article' | 'collection' | 'organization' | 'legal' | 'conversion';
  entities: {
    name: string;
    type: 'brand' | 'robot' | 'service' | 'scenario' | 'location' | 'topic';
  }[];
  userQuestionsAnswered: string[];
  factualClaims: {
    claim: string;
    source: 'owner_approved' | 'page_content' | 'manufacturer' | 'needs_review';
  }[];
  llmMarkdownPath?: string | null;
  schemaTypes: string[];
  faqQuestions: string[];
  comparisonTargets?: string[];
  relatedPages: string[];
};
```

## Robots.txt decision — отдельно утвердить

Owner decision от 2026-09-01: разрешить AI-агентам читать и индексировать сайт для поиска/ответов. Принятая политика:

```txt
User-agent: *
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: GPTBot
Allow: /

Sitemap: https://www.kiber-portal.ru/sitemap-index.xml
```

Смысл: AI search/user retrieval и GPTBot crawling разрешены по решению владельца. Если политика по training crawl изменится, robots.txt нужно будет пересмотреть отдельной задачей.

## Что ещё не считаем закрытым

- Финальная AI crawler policy в `robots.txt` — **утверждена владельцем как allow для OAI-SearchBot / ChatGPT-User / GPTBot**.
- Markdown-версии всех ключевых страниц — **не реализованы**, пока есть `llms.txt` как baseline.
- AI summaries в rendered page body — **пока не везде выведены как видимые блоки**, есть в паспортах; дальше нужно решать дизайн/контентный формат.
- Противоречия фактов/цен — нужен отдельный ratchet после утверждения источников и тарифов.
- Детальные Article/News markdown/schema — ждут будущего этапа статей/новостей.

## Sources

[1] OpenAI crawlers and user agents — https://platform.openai.com/docs/bots
[2] Google Search AI features and your website — https://developers.google.com/search/docs/appearance/ai-features
[3] llms.txt proposal — https://llmstxt.org
