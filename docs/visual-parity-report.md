# Visual Parity Report — КИБЕР ПОРТАЛ

Дата обновления: 2026-08-24  
Источник: `https://www.kiber-portal.ru/`  
Astro local preview: `http://127.0.0.1:4321/`  
Статус: `robot_schema_internal_linking_pass_applied_needs_collection_template_pass`

## Цель прохода

После замены GitHub Design System на live-verified данные проверить, что Astro-preview перестал уходить в generic/SaaS-style и начал повторять базовый visual language живого сайта.

Проверялись две эталонные страницы:

- `/` — home: header, photo hero, Gosha bubble, подборки, catalog grid;
- `/arenda-unitree-g1` — robot page: header, product hero, CTA buttons, first content blocks.

## Evidence screenshots

Live site:

```text
data/design/live-screenshots/home-desktop-1280.png
data/design/live-screenshots/home-mobile-390.png
data/design/live-screenshots/unitree-g1-desktop-1280.png
data/design/live-screenshots/unitree-g1-mobile-390.png
```

Astro preview after correction:

```text
data/design/parity-screenshots/astro-home-desktop-1280.png
data/design/parity-screenshots/astro-home-mobile-390.png
data/design/parity-screenshots/astro-unitree-g1-desktop-1280.png
data/design/parity-screenshots/astro-unitree-g1-mobile-390.png
data/design/parity-screenshots/astro-unitree-g1-blocks-desktop-1280.png
data/design/parity-screenshots/astro-unitree-g1-blocks-mobile-390.png
data/design/parity-screenshots/astro-unitree-g1-faq-footer-full-desktop-1280.png
data/design/parity-screenshots/astro-unitree-g1-faq-footer-full-mobile-390.png
data/design/parity-screenshots/robot-propagation/*.png
data/design/robot-template-propagation-check.json
data/seo/robot-schema-internal-linking-check.json
```

## Applied changes in this pass

### Header

Changed Astro header toward live production baseline:

- menu now: `Каталог`, `Подборки`, `Блог`, `Новости`, `Контакты`;
- removed extra `Заполнить форму` header CTA from desktop baseline;
- kept live-style phone and single `Написать нам` blue CTA;
- mobile header now collapses to logo + blue burger icon, matching live first viewport.

### Home hero

Astro home hero now follows live style:

- inset rounded image block on `#F4F8FF` canvas;
- graphite photo scrim, not abstract SaaS gradient;
- desktop H1 `64px / 64px / 700`, `letter-spacing: 1px`;
- primary CTA `#0088FF`, secondary white pill with blue text;
- mobile hero uses live-like image crop, rounded corners, logo/burger header.

### Catalog cards

Catalog cards moved closer to live `t786` product grid:

- transparent wrapper;
- no border/shadow/rounded card container;
- square robot image on white;
- title `22px Gillroy 700 #36323E`;
- price `14px Montserrat 600 #36323E`;
- description `16px Gillroy 500 #797A91`.

### Robot page hero

Robot detail hero now uses live-style product image cover:

- full-width image hero with graphite overlay;
- centered white H1;
- buttons: `Оставить заявку` and `Задать вопрос`;
- removed visible breadcrumbs above the hero for the visual baseline.

### Robot page block-family pass

The generic source-of-truth panels below `/arenda-unitree-g1` hero were replaced with live-style robot page blocks:

- long-form intro text on the blue-tint canvas;
- numbered section eyebrow: `01 — КЛЮЧЕВЫЕ ВОЗМОЖНОСТИ`;
- transparent 3-column feature cards instead of bordered panels;
- numbered scenario section: `02 — СЦЕНАРИИ ИСПОЛЬЗОВАНИЯ`;
- horizontal live-style media rail with 8 meaningful Unitree G1 images;
- dark CTA strip for pricing/contact;
- Kiber Gosha helper bubble near the lower conversion path.

### FAQ / conversion / footer parity pass

The lower robot template was brought into the same live-style rhythm:

- FAQ rebuilt as a numbered `03 — ВОПРОСЫ И ОТВЕТЫ` section with transparent accordion rows and blue plus controls;
- Kiber Gosha helper CTA kept as the human/robot conversion bridge before related recommendations;
- related robots section rebuilt as `04 — ПОХОЖИЕ РОБОТЫ` with catalog-style product tiles and mobile single-column layout;
- footer replaced with a live-style dark footer: white logo, navigation, phone, CTA and compact meta row;
- mobile related robots were corrected from a cramped multi-column grid to readable stacked cards.

Browser DOM proof after the FAQ/footer pass:

```json
{
  "robotLiveFaq": 1,
  "faqItems": 5,
  "robotLiveRelated": 1,
  "siteFooterLive": 1,
  "footerLinks": [
    "Главная",
    "Каталог",
    "Подборки",
    "Блог Кибер Гоши",
    "Новости",
    "Контакты",
    "+7 977 479 07 49",
    "Написать нам"
  ]
}
```

### Robot template propagation pass

The corrected robot template is now verified across all 24 robot detail pages:

- every robot page builds through the shared live-style `RobotPage.astro` composition;
- all 24 built pages include the required template markers: hero, intro, gallery, CTA strip, FAQ, Gosha helper, related robots and live footer;
- representative desktop/mobile screenshots were captured for humanoid, service, media, dog, coffee and drawing robots;
- Russian generated headings were normalized from genitive source labels like `робота-официанта BellaBot` to nominative page copy like `Робот-официант BellaBot` / `Что умеет робот-официант BellaBot`;
- pricing and business facts stayed untouched.

Representative pages checked:

```text
arenda-unitree-g1
arenda-bellabot
arenda-glambot
arenda-unitree-go2
arenda-mini-robo-kofeyni
arenda-sketchbot
```

Machine-readable proof:

```text
data/design/robot-template-propagation-check.json
```

### Robot schema / internal-linking validation pass

Robot pages now have a dedicated SEO/schema validation gate:

- added `FAQPage` JSON-LD for each robot page with FAQ answers from source-of-truth;
- kept existing `Service` and `BreadcrumbList` JSON-LD per robot page;
- added `scripts/validate_robot_seo_links.py` to validate all 24 built robot pages;
- validator checks canonical URL, `og:url`, absolute `og:image`, robots meta, sitemap inclusion, rendered related robot links, local fragment CTA targets and required live-style template markers;
- latest validation result: `robotPages=24`, `checkedPages=24`, `errors=0`, `warnings=0`.

Machine-readable proof:

```text
data/seo/robot-schema-internal-linking-check.json
```

Browser DOM proof after the pass:

```json
{
  "robotLiveIntro": 1,
  "liveSections": 2,
  "galleryItems": 8,
  "ctaStrip": 1,
  "gosha": 1,
  "h2": [
    "Что умеет робот Unitree G1",
    "Где робот Unitree G1 произведёт «вау-эффект»?"
  ],
  "imageResourceErrors": 0
}
```

## Computed-style proof — Astro home after correction

Measured in browser on `http://127.0.0.1:4321/`:

```json
{
  "header": {
    "backgroundColor": "rgba(255, 255, 255, 0.9)",
    "height": 80,
    "boxShadow": "none",
    "text": "Каталог Подборки Блог Новости Контакты +7 977 479 07 49 Написать нам"
  },
  "h1": {
    "fontFamily": "Gillroy, Arial, sans-serif",
    "fontSize": "64px",
    "fontWeight": "700",
    "lineHeight": "64px",
    "letterSpacing": "1px",
    "color": "rgb(255, 255, 255)"
  },
  "primaryButton": {
    "backgroundColor": "rgb(0, 136, 255)",
    "borderRadius": "24px",
    "fontSize": "14px",
    "fontWeight": "700"
  },
  "secondaryButton": {
    "backgroundColor": "rgb(255, 255, 255)",
    "color": "rgb(0, 136, 255)",
    "borderRadius": "24px"
  },
  "catalogCard": {
    "backgroundColor": "rgba(0, 0, 0, 0)",
    "borderRadius": "0px",
    "boxShadow": "none"
  },
  "catalogTitle": {
    "fontFamily": "Gillroy, Arial, sans-serif",
    "fontSize": "22px",
    "fontWeight": "700",
    "lineHeight": "30.8px"
  },
  "catalogPrice": {
    "fontFamily": "Montserrat, Arial, sans-serif",
    "fontSize": "14px",
    "fontWeight": "600"
  }
}
```

## Current visual parity status

| Area | Desktop | Mobile | Status |
|---|---:|---:|---|
| Header | close | close | pass for baseline |
| Home hero | close | close | pass for baseline |
| CTA buttons | close | close | pass for baseline |
| Catalog product tiles | close | not fully reviewed | pass for desktop baseline |
| Gosha bubble | close | needs spacing polish | partial |
| Compilation cards | close | not fully reviewed | partial |
| Robot hero | close in structure | captured, needs crop review | partial |
| Robot content below hero | live-style intro/features/scenarios applied | mobile readable, captured | pass for block-family baseline |
| Robot gallery | horizontal media rail with 8 meaningful images | scroll rail captured | pass for baseline |
| Robot CTA strip | dark live-style strip applied | stacked mobile actions | pass for baseline |
| FAQ / footer | FAQ, Gosha CTA, related robots and footer live-style baseline applied on shared robot template | mobile related cards stacked/readable | propagated across all 24 robot pages |

## Remaining known differences

1. **Related robot screenshots need image-load proof in final QA**
   Related robot product images resolve in the browser and use catalog cards, but full-page screenshot captures can show white product panels before distant images are visibly painted. Keep this as a QA watch item when doing the propagation pass.

2. **Prices differ intentionally**  
   Live catalog shows package-style values such as `от 50 000 ₽`; Astro uses structured tariff/hourly values such as `от 12 500 ₽ / час`. Do not overwrite pricing from live without business approval.

3. **Home lower blocks still need separate parity**  
   Gosha, подборки, articles, FAQ, news and footer are visually closer now, but this pass only gated first-screen and catalog baseline.

4. **Fonts need final operational decision**  
   Live computed styles use `Gillroy`; font files are named `Gilroy`. Current token follows live CSS family name. A later production pass should self-host and normalize if needed.

## Verification commands

```text
python3 scripts/validate_design_tokens.py --root . --json
→ ok=True, errors=0, warnings=0

python3 scripts/validate_public_pages.py --root . --json
→ ok=True, htmlPages=46, errors=0, warnings=0

npm --prefix app run build
→ 46 page(s) built, exit 0

python3 scripts/validate_robot_seo_links.py --root . --json
→ robotPages=24, checkedPages=24, errors=0, warnings=0

curl -sI http://127.0.0.1:4321/
→ HTTP/1.1 200 OK
```

## Recommended next step

Proceed to the **collection/article/news template passes**:

1. bring `/roboty-gumanoidy` and `/arenda-robotov-na-meropriyatie` collection pages to the same live-style component quality;
2. validate their canonical/OG/schema/internal links;
3. then handle `Блог Кибер Гоши`, `Подборки` and `Новости` templates with source-of-truth content and SEO rules.
