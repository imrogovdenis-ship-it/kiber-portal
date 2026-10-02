# KIBER article media contract

Status: **owner_approved**
Owner approval note: Александр утвердил текущий пакет контрактов как рабочий source of truth; дальнейшие правки вносятся в эти файлы по ходу работы.

## Media role separation

Do not mix image roles.

| Role | Path/source | Use | Forbidden |
|---|---|---|---|
| Article Hero | `public/images/articles/<slug>/...` | Dedicated 16:9 scenario image | Low-quality local placeholder as final; wrong robot; embedded text/logos |
| Visual orientir / mediaMoment | usually same article Hero or article-owned 16:9 image | Buyer-facing visual scenario | Internal provenance in visible copy |
| Article gallery / “Роботы из сценария” | `public/images/articles/<slug>/gallery/...` optimized copies from robot-card galleries or approved/current media | Real robot/event images that show robots mentioned in the article in life and support their scenario roles | Generated photos for this block; filler robots; weak/dark/blurry/seasonally wrong photos; catalog-card duplicates when stronger gallery photos exist |
| Catalog card | robot card/source-of-truth data | Catalog block only | Gallery/event photos as catalog image |
| Related article card | prepared article card asset | Related article cards | Ad hoc unapproved covers |
| Compilation card | canonical compilation card identity | Related compilations | Article-local covers |
| Capability images | `data/models/robot-capability-images.source.json`, `public/images/robot-capabilities/<slug>/` | Robot-card “Что умеет” | Article Hero/gallery unless separately approved |

## Hero rules

### New article vs existing article rewrite

For every **new** `/articles/...` page, create a separate article-specific Hero by default. Do not close the media plan by copying a Hero from another article or by reusing a loosely related robot/gallery image as if it were final. A reused image from another article can only be a clearly marked temporary blocker/fallback, not the normal deliverable.

When **rewriting or refreshing an existing article**, keep the article's existing Hero by default. Create a new Hero for an existing article only when the owner explicitly asks for a new image, the old image is factually wrong, or the rewrite changes the scenario so much that the existing image no longer matches the article promise. Record that reason in the article report.

### Image brief before generation

Before generating a new article Hero, create an internal image brief from the article itself:

1. Read the article title, H1, SEO intro, scenario blocks, visual-orientir, catalog robots and CTA promise.
2. Extract the article's core meaning in one sentence.
3. Translate that meaning into an observable scene: setting, people/reaction, robot(s), product/idea/event object, action and mood.
4. Identify which robot models must appear and verify each model's current site/repo references before prompting.
5. Write the prompt/technical assignment from that brief; do not start from a generic “robot on event” prompt.
6. Save provenance in `actualDescription` as generated/editorial illustration when applicable.

### Multi-robot Hero generation method

For article Hero images with several concrete KIBER robots, the approved default is **reference-guided seamless scene generation**, not a collage.

Use this method when the Hero must look like a premium event moment:

1. Collect current catalog-card references for every required robot (`public/images/kiber-45/<slug>.webp`, `robot.media.hero` or current robot-card source).
2. Add gallery references only to clarify form, scale, support, camera arm/bar station details or common event placement.
3. Write one scene prompt from the article meaning: setting, people/reaction, robot roles, action, lighting and mood.
4. Pass robot references as image inputs to the generator and explicitly require: `one seamless scene`, `not a collage`, `not cut-out pasted robots`, `not a lineup`.
5. Split robot roles in the prompt: 2–3 **main visible robots** in focus, with remaining robots as **secondary event-zone elements** when many models are involved.
6. Preserve key visual constraints for each robot in the prompt: body type, head/screen, arms/legs/wheels/base, relative scale and what not to mix with.
7. Reject low-quality pasted/cutout composites as final Hero even if robot silhouettes are more exact. A rough montage can be used only as an internal reference sheet or explicitly temporary fallback.
8. If generation drifts into generic sci-fi robots, simplify the scene and regenerate; do not switch to a crude collage as final.

Approved precedent: `tematicheskaya-vecherinka-kiberpank` Hero correction on 2026-09-17 — owner rejected both generic robot generation and pasted-reference collage; approved the cohesive reference-guided generated event scene.

### Requirements

- 16:9 horizontal image;
- scenario/event moment, not isolated product pose;
- people + robot + action + context when appropriate;
- the image must illustrate the meaning of this article, not merely contain a robot;
- no embedded text or random logos;
- no accidental crop of important parts;
- locally plausible Russian/Moscow context for Russian audience when relevant;
- no low-quality Pillow/vector/montage placeholder as final;
- no final Hero that looks like pasted cut-out robots over a generated background;
- if generation quality is unavailable, stop with blocker or use owner-approved real-photo fallback.

For concrete robots:
1. Find current robot card/catalog image.
2. Open/check current robot page.
3. Inspect gallery/media for that robot.
4. Use those as visual references.
5. Do not mix models.
6. Verify final Hero shows the correct robot.
7. Wrong robot = reject/regenerate.

## Gallery rules

### “Роботы из сценария” mid-article gallery

For multi-robot scenario articles, evaluate whether the reader needs to see the actual robots mentioned in the text. If several robots are presented as different roles and real appearance helps the decision, add the block **“Роботы из сценария”**. This is normally expected for such articles.

Preferred placement: after the Cyber Gosha quote and before the **“Перед заявкой”** checklist. The block should work as a visual bridge: Gosha explains the scenario logic, the gallery shows the robots in life, then the checklist asks what to prepare before the request.

Implementation:
- one strong photo per robot or scenario role;
- source photos from the corresponding robot card gallery, not newly generated images;
- copy optimized article-owned versions to `public/images/articles/<slug>/gallery/`;
- choose images by semantic fit to the article role, not by file availability;
- write buyer-facing heading/description and role-specific alt text;
- use the approved natural-ratio rounded horizontal strip/slider.

Reject images that are filler, weak, too dark, blurry, too cropped, seasonally mismatched, show a robot not mentioned in the article, or duplicate the catalog card when a stronger gallery photo is available.

### General gallery process

Gallery is optional for single-robot/single-scene articles. Do not fill it for count.

Selection process:
1. List robots/scenarios actually discussed in article.
2. Search current repo/public media candidates.
3. Create contact sheet when multiple options exist.
4. Visually inspect candidates.
5. Reject images where:
   - robot is absent or too cropped;
   - only object/board is visible;
   - costume/season contradicts article topic;
   - image is dark, blurry or less expressive than available alternatives;
   - robot/scenario is not discussed in article.
6. Copy optimized article-owned files to `public/images/articles/<slug>/gallery/` when used as scenario gallery assets.
7. Verify final URLs return 200 and images decode.

Usually one strong image per robot/scenario is enough. Fewer relevant images are better than filler.

## Gallery design

Preserve approved natural-ratio rounded horizontal strip behavior from the current article/template/gallery implementation. Do not convert to forced square cards, fixed equal-width boxes, cover crops, backgrounds or shadows without explicit owner approval.

## Alt and actualDescription

- `alt`: concise truthful description for accessibility/SEO, visible to assistive tech.
- `actualDescription`: internal factual/provenance description; can mention generated/editorial nature when needed.
- visible caption: customer-facing event explanation, not provenance.

## Alt text source-of-truth contract — 2026-09-18

Alt text is a production accessibility and SEO surface. Do **not** copy migrated/source alt text blindly into public HTML.

Keep these fields conceptually separate whenever media metadata exists:

```text
sourceAlt          # imported/live/Tilda/source value; evidence only, may be stale or SEO-stuffed
actualDescription  # factual human-readable visual description of what is really visible
seoAlt             # public/rendered alt derived from actualDescription + page intent + entity
caption            # optional visible caption
role               # hero / gallery / catalog / capability / article-content / decorative
reviewStatus       # whether the visual description and seoAlt were reviewed
```

Public `alt` must come from `seoAlt` or an equivalent checked value, not from raw `sourceAlt` unless it has been verified.

### Required public alt qualities

- truthful about the visible robot/action/scene;
- names the exact robot/model when it is visible and known;
- may include one natural page-intent phrase such as `на мероприятии`, `для выставки`, `для презентации`, `в аренду`, `прокат`, or `заказать` only when it fits the image;
- no prices, fake cities, fake venues, fake companies, unverified capabilities, or hidden keyword lists;
- no internal/CMS/block wording.

### Forbidden boilerplate in public alt

Reject or rewrite public alts containing internal phrases such as:

```text
специальная иллюстрация блока
карточка аренды ... на сайте
для блока Что умеет робот
source / tilda / imported / generated block
```

Example correction from the Unitree G1 pass:

```text
Bad:
габариты робота-гуманоида для робота-гуманоида Unitree G1: специальная иллюстрация блока «Что умеет робот» в карточке аренды робота-гуманоида Unitree G1 на сайте КИБЕР ПОРТАЛ.

Good:
Габариты робота-гуманоида Unitree G1 для планирования зоны показа на мероприятии
```

### Commercial distribution

Do not optimize every image. Use approximately every-second meaningful image for a commercial/long-tail phrase when the visual content supports it. Other meaningful images should stay neutral and descriptive.

### Evidence and planning surface

The full alt inventory belongs in media/source files or a dedicated media review page, not in the main SEO-key table. The SEO working table may show compact media-alt health fields such as `Media / alt status`, `Meaningful images`, and `Media evidence` when needed.


### Article-specific alt application

For articles, apply this to:

- article Hero / `actualDescription` and rendered `alt`;
- `mediaMoment` images;
- “Роботы из сценария” gallery images;
- catalog robot cards and related article cards when the article owns or overrides the image text.

Article alts must support the article promise and the reader's scenario. If a generated Hero is used, `actualDescription` must honestly say it is a generated/editorial illustration; the rendered `alt` must still describe the scene for the reader, not the generation process.

