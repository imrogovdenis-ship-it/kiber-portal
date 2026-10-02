# KIBER article block contract

Status: **owner_approved**  
Owner approval note: Александр утвердил текущий пакет контрактов как рабочий source of truth; дальнейшие правки вносятся в эти файлы по ходу работы.
Applies to: article pages under `/articles/...` using `ApprovedArticle5.astro` and `ArticleBlocksTemplateData`.

## Global block-selection principle

Use a block only when it improves a reader decision. Do not copy blocks from another article by inertia. The approved visual system comes from repository components; content changes are allowed only within the block’s intended role.

## Mandatory / common skeleton

Most production-quality articles should contain:

1. Hero
2. SEO intro / short answer
3. Body/scenario/explanation blocks
4. Kiber Gosha quote where it adds an editorial turn
5. FAQ
6. CTA2 / “Остались вопросы?”
7. Catalog robots
8. Related articles / Blog Kiber Gosha
9. Related compilations

If a mandatory/common block is intentionally omitted, record the reason in the article preflight/report.

## Block inventory

### Hero

- **Component/source:** `EditorialHero` via `ApprovedArticle5.astro`.
- **Required:** yes.
- **Purpose:** H1, short lead, primary visual, CTA entry points.
- **Use when:** every article.
- **Content rules:** customer-facing promise; no internal review language.
- **Media rules:** dedicated scenario 16:9 image by default for new articles; existing article rewrites keep the existing Hero unless a new image is explicitly requested or the old Hero is factually/semantically wrong.
- **Rendered mobile rule:** on article pages the Hero image must start flush at the top of the Hero block; no dark/black strip or section padding may appear above the image. Verify at mobile width after any shared rhythm/style change.

### SEO intro / short answer

- **Data field:** `articleContent.seoIntro`.
- **Required:** yes.
- **Purpose:** immediate answer to the search/user intent.
- **Use when:** every article.
- **Content rules:** 1–2 concise paragraphs; natural primary keyword; explains article value without SEO stuffing.

### Plain text section

- **Block type:** `plainText`.
- **Required:** usually at least one body section.
- **Purpose:** H2 + practical explanation.
- **Use when:** a topic needs 2–3 paragraphs without cards/table.
- **Do not use when:** the section is really a comparison/list/checklist.

### Kiber Gosha quote

- **Block type:** `goshaQuote`; shared component `HomeGoshaQuote.astro`.
- **Required:** common/brand block; placement depends on logic.
- **Purpose:** editorial accent, practical recommendation, bridge to next action.
- **Rules:** see `kiber-article-style-contract.md`.

### Media moment / visual orientir

- **Block type:** `mediaMoment`.
- **Required:** optional, but strongly expected when a new article has a scenario Hero that should be reused as visual-orientir.
- **Purpose:** one strong visual moment that helps the buyer imagine the event.
- **Use when:** a visual scene clarifies the scenario.
- **Do not use when:** only internal provenance/report text is available.
- **Visible copy:** buyer-facing only; provenance goes to `actualDescription`.

### Gallery / “Роботы из сценария”

- **Data field:** `articleContent.gallery` for the default gallery position, or ordered block `type: 'gallery'` when the gallery must sit inside the article sequence.
- **Required:** contextual. Optional for single-robot/single-scene articles; strongly expected for articles where several robots are mentioned and the buyer needs to see how they look in real use.
- **Purpose:** show real/approved robot/event images separate from Hero and catalog cards. The block helps the reader connect each robot from the article with a real-life role: scene, stand dialogue, photo moment, content zone, souvenir, welcome zone, etc.
- **Analysis gate:** before omitting the block, decide whether the article mentions multiple robots whose real appearance helps the buying decision. If yes, add the block unless there are no relevant approved photos. If no, record why the gallery is unnecessary.
- **Preferred placement:** the mid-article block named **“Роботы из сценария”** normally sits after the Cyber Gosha quote and before the **“Перед заявкой”** checklist. This placement works as a visual bridge from Gosha’s scenario advice to the buyer’s preparation checklist.
- **Use when:** visual comparison helps the reader choose, understand actual robots, or see how several robots from the scenario look in life. This is practically expected for multi-robot scenario articles.
- **Implementation principle:** one strong photo per robot/scenario is usually enough. Select photos from the relevant robot card gallery, then copy optimized article-owned versions to `public/images/articles/<slug>/gallery/`.
- **Do not use when:** images are filler, weak, not discussed, dark/blurry, too cropped, seasonally mismatched, generated for this gallery, or merely duplicate catalog-card images when a stronger real gallery photo exists.
- **Copy:** title/description must explain the article scenario, not internal provenance. Alt text should describe the robot + role in the article.
- **Design:** preserve the approved natural-ratio rounded horizontal strip/slider; do not redesign CSS without owner approval.

### Comparison block

- **Block type:** `comparisonBlock` or `articleContent.comparison`.
- **Required:** optional.
- **Purpose:** compare models, formats or choices.
- **Use when:** the reader is genuinely choosing between options.
- **Do not use when:** it is copied from another article without a real decision.
- **Labels:** role + model/function, not brand-only labels.

### Obvious choice cards

- **Data field:** `articleContent.obviousChoice`.
- **Required:** optional.
- **Purpose:** 3 quick scenarios where the best choice is clear.
- **Use when:** there are exactly clear situations and decisions.
- **Do not use when:** decisions are nuanced or require table/checklist.

### Numbered use cases

- **Data field:** `articleContent.numberedUseCases`.
- **Required:** optional.
- **Purpose:** listicle/event-ideas structure.
- **Use when:** article promises multiple ideas/formats.
- **Do not use when:** the article has one scenario or a model comparison.

### Checkpoint list

- **Block type:** `checkpointList` or `articleContent.checklist`.
- **Required:** optional but common before CTA.
- **Purpose:** prepare buyer inputs before request.
- **Use when:** venue, timing, audience, safety, roles or constraints matter.
- **Card count:** prefer 4 or 6 cards; avoid 5 unless specifically justified.

- **Repetition guard:** normally use **one** checkpoint/checklist block per article, usually before CTA/заявкой. A second checkpoint block is allowed only when it answers a materially different buyer decision and is separated by other block types. Three or more checkpoint/checklist blocks in one article are a structural failure unless an owner-approved plan explicitly requires it.
- **Not for:** do not turn every explanation into cards. A contact journey, function explanation, scenario example, or rehearsal advice usually belongs in `plainText`, `comparisonBlock`, `mediaMoment`, `pairedEnumeration`, FAQ, or a short table instead.

### Article block map discipline

Before writing or rewriting an article, create a short internal block map. For every body block record:

```text
block id:
block type:
reader decision it improves:
why this block type fits better than plain text:
why it does not duplicate another block:
```

Rules:

- Choose blocks by **reader decision**, not by the desire to make the page look varied.
- A visually different block is not useful if it repeats the same editorial function.
- If two blocks both mean “things to check before order”, merge them or keep only the strongest one near CTA.
- If a block explains a process (`заметил → понял → продолжил`), prefer prose/process copy over `checkpointList`.
- If a block compares situations or routes a buyer between options, use a table/comparison/paired enumeration rather than checklist cards.
- If the page starts to look like `text + cards + cards + cards`, stop and rebuild the block map before implementation.

### Paired enumeration

- **Data field:** `articleContent.pairedEnumeration`.
- **Required:** optional.
- **Purpose:** short alternatives without heavy comparison UI.
- **Use when:** several small options need concise explanation.

### Product / featured robot

- **Data field:** `articleContent.product`.
- **Required:** optional.
- **Purpose:** one featured model.
- **Use when:** article genuinely recommends or focuses on one model.
- **Do not use when:** article is multi-model and no single model is featured.

### FAQ

- **Data field:** `faq`.
- **Required:** yes.
- **Count:** every article must have **5–8 FAQ items**. Fewer than 5 does not cover enough buyer/SEO objections; more than 8 becomes too heavy and must be split into body/checklist content.
- **Purpose:** answer Wordstat/SERP/customer objections and support snippets.
- **Source:** SEO research + real buyer questions + scenario constraints.
- **Do not use:** invented generic questions not tied to reader decision.
- **Rendered check:** before owner handoff, count actual rendered FAQ items/details on Jino and record the number in readiness evidence.

### CTA2 / Остались вопросы?

- **Component:** `HomeFinalCta.astro`.
- **Required:** yes.
- **Purpose:** final conversion block.
- **Style source:** approved homepage/shared block style.
- **Allowed changes:** article-specific text where data contract allows.
- **Forbidden:** visual redesign without owner approval.

### Catalog robots

- **Component:** `RobotCard.astro` rendered in article template.
- **Required:** yes/common.
- **Purpose:** show models relevant to article.
- **Use:** only robots discussed or strongly scenario-fit.
- **Display-name rule:** card H3 titles must use nominative customer-facing model names (`SenseRobot`, `Unitree Go2`, `Робобар`, `Promobot V4`, etc.). Do not pass inflected SEO/page-title phrases such as `робота-шахматиста SenseRobot` or `робота-бармена «Робобар»` into `RobotCard.title`.
- **Source rule:** before preview, identify where each visible title comes from. `src/content/robots.generated.json` / `robot.identity.name` may contain inflected SEO phrases; article routes must override with a local display-title mapping or use a normalized display-name field when available.
- **Rendered check:** inspect built/Jino HTML for duplicate-case artifacts in visible titles and aria labels, especially strings like `Открыть карточку робота робота-...`, `>робота-...<`, or title forms that are not model names.
- **Forbidden:** adding robots for count; using gallery photos as catalog images; leaking SEO declensions/page-title phrases into catalog-card headings.

### Related articles / Blog Kiber Gosha

- **Source:** article-specific related list filtered from release-safe approved/prepared article data; production uses `data/content/published-articles.json` unless a preview task explicitly uses prepared launch items.
- **Required:** yes/common.
- **Count:** every article must render **exactly 6 related article cards** in the “Блог Кибер Гоши” block — no more, no fewer.
- **Purpose:** release-safe internal article navigation and continuation path with the six most relevant prepared materials.
- **Forbidden:** `/preview/kiber-94`, generic fallback links, unrelated old articles, links to articles that are not owner-approved/prepared for the current preview scope, or pulling the entire global article registry into an article detail page.
- **Publication gate:** the article index and public related cards must use `data/content/published-articles.json`, not every item from `data/content/launch-articles.json`. Launch registry presence is not approval to show on production.
- **Rendered check:** before owner handoff, count `.home-image-cards__card` inside `data-block-id="relatedArticles"` on Jino and record `relatedArticles = 6`.

### Related compilations

- **Source:** `src/lib/kiber-release-related-compilations.ts`.
- **Required:** yes/common when topical compilations exist.
- **Standard:** 5 cards — 4 topical + `Все наши подборки` linking to `/compilations/`.
- **Forbidden:** ad hoc article-local covers or unready pages presented as final.
