# KIBER подборки: модульный контракт и быстрый Direct-first workflow

Дата: 2026-09-21  
Статус: рабочий контракт для Jino preview / не production approval.

## Зачем этот контракт

Подборки нельзя делать как жёсткий типовой шаблон статьи или карточки робота. Каждая подборка может быть уникальной: по типу робота, сценарию, площадке, празднику, аудитории, бренду или задаче. Поэтому стандартизируется не структура, а:

- коммерческая логика страницы;
- approved визуальный язык КИБЕР;
- источник данных и фактология;
- набор обязательных решений;
- библиотека возможных блоков;
- QA/readiness перед Jino handoff.

Цель для текущего этапа с активным Яндекс.Директом: быстро закрыть пользовательский спрос релевантными landing-подборками, чтобы рекламный трафик попадал на страницу с понятным выбором, релевантными роботами, честными ограничениями и быстрым путём к заявке.

## Источники данных

Приоритет источников:

1. Repo/runtime данные проекта: карточки роботов, текущие страницы, approved media, SEO-map.
2. Owner context: сведения Александра о парке, сценариях, доступности, приоритетах рекламы.
3. Уже написанные статьи и существующие подборки — только как материал для ссылок/поддержки, не как жёсткий шаблон.
4. Wordstat/Direct/SERP/конкуренты — для понимания intent, формулировок, gaps и FAQ.
5. Production pages — как зеркало текущего состояния, если страница ещё не приведена к новому стандарту.

Запрещено:

- выдумывать цены, возможности, комплектацию, срок автономности или наличие функции;
- копировать структуру другой подборки без проверки intent;
- тащить старые `/preview/kiber-94` public hrefs в рабочие страницы;
- делать SEO-текст вместо посадочной страницы для выбора;
- считать Jino approval равным production approval.

## Intent-brief перед каждой подборкой

Перед написанием подборки заполняется короткий brief:

```text
Route:
Название / H1:
Тип подборки: robot-type | scenario | venue | holiday | audience | brand/family | task
Главный intent пользователя:
Рекламная группа / Direct priority:
Primary keyword:
Secondary intents:
Что пользователь должен понять за 20 секунд:
Какие роботы входят и почему:
Какие роботы НЕ входят и почему:
Какие существующие статьи можно использовать:
Какие статьи отсутствуют, но не блокируют запуск:
Какие блоки обязательны:
Какие блоки условные:
Open questions for owner:
Launch level: fast landing | full SEO cycle | owner-approved final
```

## Обязательные элементы любой подборки

1. **Hero**  
   Ясно отвечает, для какой задачи страница. Не абстрактное SEO-обещание, а customer-first формулировка.

2. **Короткий ответ / AI summary**  
   1–2 коротких абзаца: когда эта подборка нужна, какие классы роботов рассматривать, что уточнит менеджер.

3. **Выбор или каталог роботов**  
   Не просто список: у каждой модели должна быть роль в сценарии/кластере. Карточки ведут на реальные robot-card routes.

4. **Сценарная логика выбора**  
   Пользователь должен понять, какой робот подходит под задачу: стенд, сцена, welcome, фотозона, дети, ресторан, презентация, праздник и т.д.

5. **CTA / менеджерский handoff**  
   Что сообщить менеджеру: тип события, площадка, дата, аудитория, поток гостей, безопасная зона, желаемая роль робота, бюджет/формат.

6. **FAQ**  
   Вопросы должны вытекать из intent и SERP/Direct, а не быть универсальными для всех страниц.

7. **Связанные карточки/статьи/подборки**  
   Использовать существующие материалы; если материала нет — не выдумывать, можно честно запускать без него при fast landing.

8. **Jino QA**  
   HTTP 200, noindex на preview, console errors 0, failed requests 0, robot/card/image links live, no horizontal overflow, no service notes visible.

## Библиотека блоков

### Блоки, которые почти всегда есть

- Hero
- Short answer / AI summary
- Robot catalog / featured robots
- How to choose / selection guide
- FAQ
- CTA2 / «Остались вопросы?»
- Related compilations

### Блоки по необходимости

- Gallery / визуальные примеры — если есть релевантные approved media.
- Video — только если embed/playback реально проверен.
- Scenario cards — для scenario/venue/holiday подборок.
- Comparison matrix — если пользователь реально сравнивает классы/модели.
- “Для кого подходит / не подходит” — если есть риск неправильного ожидания.
- “Что уточнить до бронирования” — для сложных площадок, выставок, сцены, детей, улицы.
- Related articles — только существующие или подготовленные release-safe статьи.
- Gosha quote — коротко и полезно, без превращения страницы в статью.

## Как выбирать структуру

### Robot-type подборка

Примеры: `/roboty-gumanoidy/`, `/roboty-sobaki/`.

Главный вопрос: «Какую модель этого типа выбрать?»

Подходящие блоки:

- различия моделей;
- роли роботов;
- ограничения;
- каталог моделей;
- сценарии применения;
- статьи по этому типу;
- FAQ про безопасность, оператора, площадку, стоимость.

### Scenario / venue подборка

Примеры: `/roboty-dlya-vystavki/`, `/roboty-dlya-prazdnika/`.

Главный вопрос: «Какого робота поставить под эту задачу?»

Подходящие блоки:

- задачи на площадке;
- карта сценариев: welcome, стенд, фотозона, презентация, поток гостей;
- подбор роботов по ролям;
- что уточнить менеджеру;
- ссылки на карточки;
- статьи только если они помогают выбору.

### Holiday / audience подборка

Примеры: Новый год, 8 марта, детский праздник, выпускной.

Главный вопрос: «Как сделать событие необычным и не промахнуться с форматом?»

Подходящие блоки:

- возраст/аудитория;
- тайминг;
- площадка;
- риск перегруза/очереди;
- подбор 3–6 форматов;
- короткий FAQ;
- CTA с менеджерским handoff.

### Brand/family подборка

Примеры: Unitree.

Главный вопрос: «Какие модели одного семейства/бренда подходят для разных задач?»

Подходящие блоки:

- семейство моделей;
- когда выбрать гуманоид vs робособаку;
- ссылки на карточки;
- сценарии;
- ограничения по фактическому парку.

## Быстрый Direct-first launch level

Если задача — быстро закрыть рекламный спрос, допускается launch level `fast landing`:

Минимум:

- route создан;
- Hero + short answer;
- 5–8 релевантных роботов/форматов или меньше, если парк фактически меньше;
- сценарная логика выбора;
- CTA;
- FAQ 5–8 вопросов;
- links на реальные карточки/существующие статьи;
- Jino rendered QA pass;
- статус в Preview Control Center и SEO key map обновлён.

Можно отложить:

- полный SERP gap-report;
- новые статьи;
- длинную галерею;
- видео;
- production публикацию;
- full owner-approved SEO final.

Нельзя отложить:

- фактологическую честность;
- релевантность intent;
- рабочие ссылки/картинки;
- noindex на Jino;
- понятный CTA.

## Fast landing для `/roboty-dlya-vystavki/`

Предварительная структура:

1. Hero: «Аренда робота для выставки» / стенд, форум, презентация, welcome-зона.
2. Short answer: робот нужен для роли на площадке: привлечь поток, объяснить продукт, создать фотоповод, удержать гостей у стенда.
3. Блок «Выберите задачу на выставке»:
   - привлечь внимание к стенду;
   - встретить гостей;
   - показать технологичность бренда;
   - сделать фотозону;
   - провести презентацию продукта;
   - занять гостей в очереди/ожидании.
4. Каталог роботов под выставки:
   - Promobot V4 — промоутер/консультант/welcome;
   - Unitree G1 — вау-эффект, фотозона, движение;
   - Agibot X2 — динамичный гуманоид;
   - Unitree Go2 — робот-собака для привлечения внимания;
   - Робобар — зона общения/ожидания;
   - Sketchbot — интерактивный сувенир/портрет;
   - Арди/София — премиальная сцена/форум, если уместно.
5. «Как выбрать робота для стенда».
6. «Что уточнить до выставки».
7. Related articles: только существующие релевантные материалы.
8. Related compilations: гуманоиды, роботы-собаки, все подборки; planned релевантные — честно.
9. FAQ.
10. CTA.

## Readiness статусы для подборки

- `planned_only` — есть строка в SEO-map, route нет.
- `fast_landing_on_jino` — есть релевантная посадочная Jino-страница, но не полный SEO/owner final.
- `seo_cycle_ready` — Wordstat/SERP/gaps/passport + QA закрыты.
- `owner_approved_on_jino` — владелец принял Jino preview.
- `production_pending` — принята на Jino, но production не обновлён.
- `production_current` — production опубликован и проверен как current.

## Acceptance evidence

Для каждой подборки сохранять:

```text
docs/review/compilation-<slug>/<cycle-date>/
  intent-brief.json
  source-map.json
  jino-render-audit.json
  readiness-summary.json
```

Если использовались Wordstat/SERP/competitor sources — отдельные raw/evidence файлы там же.

## Governance: skill is navigation, repo is source of truth

The Hermes skill is only a navigation/workflow layer: it tells the agent what steps to take and where to look. Durable КИБЕР подборка rules must be recorded in this repository as contracts, review plans, SEO evidence, and implementation data. If a new rule is discovered during owner review, update the relevant repo contract/review file first or in the same working step as the skill patch.

Source hierarchy for workflow rules:

1. `docs/contracts/*` — durable site/process contracts.
2. `docs/review/<page-or-topic>/*` — page-specific plans, evidence, owner corrections, readiness reports.
3. `data/content/*`, `src/*`, `public/*` — implementation.
4. Hermes skills — navigation to these sources, not the primary source of truth.

## Approval-gated workflow for complex подборки

For complex подборки, do not write copy or assemble the page immediately after research. Use gates:

1. **Owner brief** — collect owner intent, included/excluded robots, scenario facts, equipment facts, future separate pages, and open questions.
2. **Research pack** — run or reuse recorded Wordstat, Yandex SERP, competitor/gap analysis, SEO passport, robot-card facts, gallery/media sources, related articles/compilations.
3. **Plan for owner approval** — return a block-by-block plan before writing. The plan must specify block purpose, content bullets, component idea, media source, related links, FAQ plan, CTA plan, exclusions, and acceptance checklist.
4. **Text and assembly** — only after owner approval, write copy and assemble components according to the approved plan.
5. **Media and QA** — generate/draw Hero if required, select gallery/scenario media from approved robot-card gallery/event sources, run local/Jino rendered QA, and report evidence.

Existing подборки may be inspected for component/styling references, but must not be copied as the thematic base or forced block order for a new подборка.

## Owner-approved default block order after `/roboty-dlya-vystavki/`

This is the default block order for future KIBER подборки. The order is source-of-truth in this repo contract; Hermes skills only point here and describe how to use it.

1. **Hero with H1**
2. **Heading + text in 2 paragraphs**
3. **Robot catalog**
4. **Gosha quote**
5. **Heading + text in 2 paragraphs**
6. **Gallery**
7. **Choice guide**
8. **Video** — conditional; omit if there is no approved, verified playable video.
9. **Scenarios**
10. **Gosha quote / joke**
11. **Robot catalog repeat**
12. **FAQ**
13. **CTA2**
14. **Blog Kiber Gosha** — default 6 real/release-safe articles.
15. **Related compilations** — default 5 cards.

Conditional omissions are allowed when there is not enough real material. Do not fill missing blocks with weak/fake/internal content. Example: omit Video if no approved playable video exists.

### Default text volumes and block intent

- Hero lead: 1 concise commercial sentence, normally 18–35 words.
- Intro/explanation text blocks: H2 + exactly 2 useful customer-facing paragraphs by default; each paragraph normally 45–80 words.
- Catalog lead: 1–2 sentences, normally 25–55 words; robot cards use canonical/base card descriptions and media.
- Gosha quote: practical bold first thought/joke + normal explanatory paragraph; signature/subtitle must render as `Кибер Гоша / Ваш цифровой помощник`.
- Gallery: H2 + short lead, normally 30–60 words; visible copy explains value for the customer, not how the block was assembled.
- Choice guide: 5–7 cards/checkpoints; varied headings; card body normally 25–55 words.
- Scenarios: 5–7 scenario cards; title is task-first; body normally 35–70 words and customer-facing.
- FAQ: normally 5–8 questions from intent/SERP/Direct objections; answers normally 45–95 words.
- CTA2: reuse approved shared style and ask for the exact details a manager needs.
- Blog Kiber Gosha: 6 real articles by relevance; article card image must match the current article source.
- Related compilations: 5 canonical/honest cards; future pages must be marked honestly, not fake-linked.

### Customer-facing copy rule

Visible copy must be written for the buyer. Do not write process/report language such as “we selected these photos”, “this block was assembled”, “the gallery shows sources”, or “the page was built from”. Explain what the visitor can understand, choose, prepare, or send to the manager.

### Media rules for Gallery and Scenarios

Gallery and Scenarios are separate visual surfaces and should not reuse the same exact image `src` unless the owner explicitly approves duplication.

Gallery accepted layout requirement:

- same rendered height for every photo;
- width auto/proportional to image aspect ratio;
- no forced equal-width cards;
- no width crop used to hide white fields;
- image `height: 100%`, `width: auto`, `object-fit: contain`, wrapper `flex: 0 0 auto`, `width: fit-content`, transparent background;
- if white fields are baked into the image, choose/prepare a better asset rather than cropping every card.

Scenarios accepted layout requirement:

- scenario image must match the scenario/model;
- no catalog covers unless explicitly approved;
- do not crop important robot parts vertically;
- check all scenario cards, not only the screenshot example;
- prefer event/gallery photos, preserving full image height inside the frame.

### Approval/status recording

When a подборка is owner-approved on Jino preview, update all repository truth surfaces:

- dedicated `docs/approvals/<route>-YYYY-MM-DD.json` and `.md`;
- `docs/approvals/owner-approvals.json`;
- `data/seo/working-key-map/seo-key-map.table.json`;
- `public/review/seo-key-map/index.html` if that surface is in use;
- `public/review/preview-index/index.html` if that surface is in use;
- evidence under `docs/review/<page>/...`.

Owner approval of Jino preview does **not** imply production, merge, DNS, secrets, analytics or live lead-routing approval.

## Detailed process safeguards from accepted exhibition подборка

These safeguards are repo source-of-truth and exist because they were missed during the `/roboty-dlya-vystavki/` work. A Hermes skill may summarize them, but the operative rule is here.

### Stage gates that must appear in the plan

Every complex подборка must pass these explicit gates:

1. **Stage 0 — owner brief**: route, H1, type, business goal, Direct/SEO priority, primary keyword, included/excluded robots, owner facts, available articles/media, required and conditional blocks.
2. **Stage 1 — research/source pack**: Wordstat, SERP, competitors/gaps, SEO passport, Direct/key-map status, robot-card facts, media sources, related articles/compilations.
3. **Stage 2 — owner-approved plan**: block-by-block order, purpose, visible component, text scope, media source, links, FAQ, related articles, related compilations, hero plan and acceptance checklist.
4. **Stage 3 — implementation**: only after plan approval, patch runtime data/components and keep visible copy customer-facing.
5. **Stage 4 — rendered QA**: local + Jino QA with saved evidence.
6. **Stage 5 — approval recording**: if owner accepts, record approvals/status in repo truth surfaces.

### Exhibition accepted references

The accepted reference process and final state for the first complex scenario подборка are:

- Approval: `docs/approvals/roboty-dlya-vystavki-2026-09-21.json`
- Page data: `data/content/compilation-exhibition.json`
- Template: `src/components/templates/CompilationTemplate.astro`
- SEO passport: `docs/review/compilation-roboty-dlya-vystavki/fresh-full-cycle-2026-09-21/04-seo-passport-fresh.json`
- Owner-approved plan: `docs/review/compilation-roboty-dlya-vystavki/plan-approval-2026-09-21/plan-before-writing-owner-corrections.txt`
- Final QA: `docs/review/compilation-roboty-dlya-vystavki/owner-feedback-6-2026-09-21/readiness-summary-feedback6.json`
- Review surfaces: `/review/seo-key-map/?v=roboty-vystavki-approved-1`, `/review/preview-index/?v=roboty-vystavki-approved-1`

### Exhibition exclusions

For `/roboty-dlya-vystavki/` and future work derived from it:

- `forum` / `форум` / `conference` / `конференция` is a separate future подборка, not a block inside the exhibition подборка.
- `Sophia` / `София` is excluded from this exhibition подборка as too premium/expensive for the intent.
- `Арди` stays in the exhibition подборка as the technological image / premium-looking option.

### Gallery and scenario non-regression checks

Rendered QA must check:

- Gallery and Scenarios duplicate image `src` intersection is `0`, unless owner explicitly approved duplication.
- Scenario images must match the named model/task; do not show Promobot V4 in a Unitree G1 scenario.
- All scenario images are checked, not only a user-provided screenshot example.
- Scenario photos must avoid vertical cropping of important robot parts.
- Gallery natural-ratio requirement remains: same rendered height, auto/proportional widths, `object-fit: contain`, no forced equal-width crop.

### Required rendered QA assertions

At minimum, save evidence for:

- HTTP 200;
- preview `X-Robots-Tag: noindex, nofollow`;
- meta robots `noindex, nofollow`;
- one H1;
- expected block order;
- broken images = 0;
- missing alt = 0;
- console errors = 0;
- failed relevant requests = 0;
- horizontal overflow = false;
- no public `/preview/kiber-94` hrefs;
- gallery/scenario media assertions;
- Gosha signature assertions;
- production untouched.

### Jino domain/link precision

When reporting document or review links, distinguish:

- Jino preview domain, usually `https://jino-preview.kiber-portal.ru/...`, for site/review/control surfaces.
- Jino technical domain, e.g. `https://professor-alex28.myjino.ru/...`, only when the user explicitly asks for technical-domain links.

Do not substitute one domain for the other. Verify public URL status before reporting.

## Shared related-compilations block

Use `docs/contracts/kiber-related-compilations-block-contract.md` for every «Подборки» block. For normal подборка pages this is the final content block before the footer: exactly 5 cards, 4 topical + «Все наши подборки». Planned/not-ready cards use CTA `Скоро`; visual styling must not diverge from the approved shared card style. `/compilations/` is the only allowed visual-size/style exception and contains all compilations ever made/planned.

## Shared Blog Gosha block

Use `docs/contracts/kiber-blog-gosha-block-contract.md` for the «Блог Кибер Гоши» block on подборка pages: exactly 6 cards, 5 real relevant article cards + final «Все статьи Блога Кибер Гоши», placed immediately before the closing «Подборки» block. Article cards must come from canonical article-card data, not page-local invented copy.


## Approved shared compilation-card headings and selection

For related cards, the current source of truth is `kiber-related-compilations-block-contract.md`: small category-style linked H3 above unchanged large slogan, then unchanged description/CTA. Reuse `public/styles/compilation-card-headings.css`. All ordinary pages: four relevant topical cards plus «Все наши подборки»; index: all six; no robot-card blocks. Explicit order/rationale: `data/content/related-compilation-selections.json`. This supersedes older five-topical-card variants. Production publication remains separately gated.
