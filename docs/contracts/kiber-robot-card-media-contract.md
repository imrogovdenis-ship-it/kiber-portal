# KIBER robot card media contract

Status: **working_source_of_truth_pending_owner_review**

Owner note: Александр поручил вынести правила robot-card workflow из навыка в repository contracts по модели article contracts. Эти файлы являются рабочим source of truth; при последующих изменениях править и contracts, и skill.

## Media role separation

Do not mix image roles.

| Role | Source/path | Use | Forbidden |
|---|---|---|---|
| Hero | current card media flow / exact robot image | Main robot visual | wrong robot; unrelated article image; random legacy background |
| Catalog card | `data/models/robot-catalog-card-images.live.json` / catalog data | Catalog and related robot cards | gallery/event photos as catalog image unless approved |
| Top gallery | explicit card runtime assets | Visual strip of the robot | capability illustrations; old Tilda hero/background; filler |
| Robot in action | explicit action/context assets | Later gallery strip | catalog-only square image when action photo is needed |
| Capability images | `data/models/robot-capability-images.source.json` and `public/images/robot-capabilities/<slug>/` | “Что умеет” cards | hero, catalog, top gallery, robotInAction |
| Article media | `public/images/articles/...` | Article pages only | default robot-card Hero/gallery source |

## Capability image geometry

The approved `Что умеет` presentation uses **six equal 16:9 frames** when the curated card contract requires six:

- full card width;
- `object-fit: cover`;
- approved centered crop;
- equal heights within rounding tolerance.

A CSS `aspect-ratio` alone is not enough if emitted HTML height attributes fight the layout. Verify rendered geometry at mobile/tablet/desktop where possible.

## Owner directive — original two galleries, 2026-09-28

Exact owner request: «Верни все фото назад. Восстанови изначальный состав каждой из 2-х ггалерей в каждой карточке робота.»

For all 24 robot cards, restore the membership AND order of each original `.t1148__img` gallery from the initial Tilda export (commit `f7958a4`). Runtime authority is `data/media/robot-original-galleries.json`, with explicit `upper` and `lower` lists. Preserve all 250 occurrences / 249 unique original photos, including the repeated R1 occurrence and the previously excluded 54 originals. Do not concatenate and split evenly, curate, redistribute, or deduplicate these lists.

This explicit owner instruction overrides earlier exclusion/role-filter recommendations **only for these original gallery occurrences**. It is not global permission to put capability illustrations into galleries. Current independent Hero, capability images (including the owner Roboshashki power photo), catalog media, copy and gallery design remain unchanged. Reuse identity-verified optimized assets; missing originals are copied byte-for-byte to versioned gallery-only paths. No cropping or pixel editing. Use verified existing alts or neutral gallery-photo descriptions, never imported SEO spam.

Evidence: `docs/review/robot-gallery-restoration-2026-09-28/` and the original audit under `docs/review/robot-gallery-audit-2026-09-28/`.

## Gallery selection rules (general; subject to the scoped owner directive above)

Use fewer strong images rather than filler.

Reject gallery candidates when:

- robot is absent or too cropped;
- image is dark/blurry/semantically weak;
- image is a legacy Tilda `__photo` hero/background;
- image comes from `/images/kiber-45/` catalog fallback when runtime gallery is required;
- model does not match the card;
- capability illustration is being used as gallery.

## Alt / descriptions

- Public `alt` should truthfully describe the visible robot/action.
- Avoid boilerplate like `специальная иллюстрация блока...`.
- `actualDescription`-style provenance is for review/data fields, not visible public copy.

## Verification

Before owner preview, verify:

- route images return 200;
- rendered important images decode (`naturalWidth > 0`) if image issues are suspected;
- no wrong-role image leaks;
- no legacy/Tilda gallery leaks;
- capability images remain separate from gallery/Hero/catalog.


## Owner visual review input — capability images, 2026-09-18

From the Unitree G1 card review: capability images currently look cropped in a bad way. The intended rule is:

- capability images should display the full useful visual, not be aggressively cropped;
- if the source images have a different ratio than the current card frame, adjust the card/media container rather than cutting off important parts;
- preserve the same images and capability themes unless factually wrong;
- current tested implementation for Unitree G1/Humanoid capability images uses `object-fit: contain` inside the existing 16:9 card frame when it shows the image cleanly;
- if `contain` creates visible white/empty fields inside a capability card, use a scoped per-image override such as `object-fit: cover` with a checked `object-position` so the card looks full and intentional;
- if later cards need a different treatment, test adjusted padding/background or a revised aspect-ratio container and update this contract with the exact solution.

This supersedes any interpretation that `object-fit: cover` is always required for capability images. The visual goal is **clean full-image presentation** inside the card, not crop uniformity at the expense of readability.

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


### Robot-card-specific alt application

For robot cards, apply this to:

- Hero image;
- top gallery;
- `Что умеет` capability images from `data/models/robot-capability-images.source.json`;
- robot-in-action gallery;
- related catalog cards when local overrides are used.

Capability images are especially prone to imported boilerplate. Before preview, inspect the rendered `<img alt>` values for the target robot and rewrite `seoAlt` in the capability registry when the public alt describes the block/CMS instead of the image.

