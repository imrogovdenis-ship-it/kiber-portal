# KIBER PORTAL Design System

Дата обновления: 2026-08-24
Статус: `verified_from_live_site`

## Назначение

Этот документ фиксирует дизайн-систему КИБЕР ПОРТАЛА для Astro-сайта. Предыдущий вариант был основан в основном на данных сайта в GitHub и export CSS, поэтому часть токенов ушла в generic/SaaS-стиль. Этот проход заменяет первоисточник на данные, снятые с живого сайта `https://www.kiber-portal.ru/`.

## Источники

Machine-readable live audit:

```text
data/design/kiber-portal-style-audit.generated.json
```

Machine-readable tokens:

```text
data/design/kiber-portal-tokens.json
```

CSS implementation:

```text
app/src/styles/tokens.css
app/src/styles/base.css
app/src/styles/components.css
app/src/styles/global.css
colors_and_type.css
```

Visual evidence:

```text
data/design/live-screenshots/home-desktop-1280.png
data/design/live-screenshots/home-mobile-390.png
data/design/live-screenshots/unitree-g1-desktop-1280.png
```

Аудированные live pages:

- `/` — главная, hero, подборки, каталог, статьи, FAQ, новости, footer;
- `/arenda-unitree-g1` — карточка робота, продуктовый hero, галереи, CTA strips, feature/scenario cards, FAQ, related catalog grid.

## Принцип

```text
live site computed styles + screenshots -> verified audit -> tokens -> clean Astro CSS/components
```

Generated wrapper CSS не переносим целиком. Но токены теперь должны соответствовать тому, что реально видно на production-сайте.

## Live-verified стиль

### Цвета

- `#F4F8FF` — основной фон/canvas почти всех секций.
- `#FFFFFF` — header, кнопки на тёмном/синем фоне, поверхности, квадратные подложки изображений.
- `#0088FF` — основной action blue: resting CTA, ссылки, стрелки, логотипный акцент.
- `#005EFF` — deep blue внутри радиального/градиентного CTA strip и hover/pressed, не обычный resting CTA.
- `#36323E` — основной ink/headings и тёмные секции.
- `#25222B` — graphite scrim/overlay и тёмная база.
- `#797A91` — muted body/meta text.
- `#A1A2B8` — secondary muted/captions.
- `#E7E7E7` — FAQ/divider lines.
- `#FF991D` — редкий badge/accent, использовать точечно.

Не использовать как основу нового UI без отдельного live-доказательства: `#134EEF`, `#2B72DD`, `#FA876B`.

### Типографика

- Основной meaningful font на живом сайте: `Gillroy, Arial, sans-serif`.
- `Montserrat, Arial, sans-serif` встречается во вторичных блоках: footer/meta/prices/Gosha.
- `body` может вычисляться как Times New Roman, но это технический fallback Tilda-обёртки; его нельзя брать как токен.

Desktop scale по live computed styles:

- H1 hero: `64px / 64px`, `700`, `letter-spacing: 1px`, white.
- H2: `44px / 44px`, `700`, normal tracking, `#36323E`.
- Feature titles: `28px / 28px`, `700`.
- Scenario titles: `34px / 34px`, `700`.
- Catalog card title: `22px / 30.8px`, `700`.
- Body/description: `16px / 25.6px`, `500`.
- Buttons: `14px / 19.6px`, `700`.

Важно: не применять негативный SaaS-style letter-spacing к заголовкам по умолчанию. На live у H1 `+1px`, у H2 normal.

### Layout

- Global canvas: light-first `#F4F8FF`.
- Container: `1200px`; внутренняя section width часто `1160px`; текстовые блоки часто `960px`; FAQ/title narrow — `760px`.
- Desktop gutters: около `40px`, при 1280px контент часто начинается на `x≈53px`.
- Section rhythm: Tilda-паттерн `60px / 30px / 90px`, а не равномерный generic spacing.

### Форма и глубина

- Button radius: `24px`, высота `48px`, padding `14px 32px`.
- Основной radius карточек/изображений/подборок: `18px`.
- `30px` — panel/product-page cards, не глобальный card default.
- Pills/arrows: `50px–100px`.
- Core UI почти без теней; heavy SaaS shadows не являются live-стилем. Допустимое исключение: bubble Кибер Гоши `0 0 15px rgba(0,0,0,.1)`.

## Компонентные правила

### Header

- Высота около `80px`; фон `rgba(255,255,255,.90)`.
- Логотип `100px`.
- Nav: Gillroy `16px`, `400`, `#222222`, gap около `30px`.
- Телефон: Gillroy `16px`, `500`, `#36323E`, `letter-spacing: 1px`.
- CTA: `#0088FF`, white text, `48px`, radius `24px`, `14px/700`, `14px 32px`.

### Hero

Live hero — это photo/image block с graphite scrim, а не абстрактный тёмный SaaS-gradient. Для главной использовать image + dark overlay, radius `18px`, light canvas вокруг.

### Catalog robot cards

Каталог — не card deck с border/shadow. Live model:

- transparent wrapper;
- квадратное изображение робота на white background;
- текст под изображением;
- title `22px Gillroy 700 #36323E`;
- price `14px Montserrat 600 #36323E`;
- description `16px Gillroy 500 #797A91`;
- no shadow, no rounded card container.

### Подборки / image cards

- Image card radius `18px`;
- bottom dark overlay;
- title `28px Gillroy 700 white`;
- CTA white pill with blue text.

### CTA strips

- Background: `radial-gradient(circle, #0088FF 0%, #005EFF 100%)`;
- height около `260px` на desktop;
- title `44px Gillroy 700 white`;
- buttons white pill, `#36323E` text.

### FAQ

- Question: `22px Gillroy 700 #36323E`, line-height `30.8px`;
- dividers `#E7E7E7`;
- section background `#F4F8FF`.

## Правила для новых страниц

1. Использовать live-verified tokens из `data/design/kiber-portal-tokens.json` и `app/src/styles/tokens.css`.
2. Resting CTA — `#0088FF`; `#005EFF` — hover/gradient/deep state.
3. Не добавлять heavy shadows по умолчанию.
4. Не делать catalog/product cards rounded SaaS cards: live source uses transparent product tiles.
5. Не использовать negative heading tracking как default.
6. Если нужен новый визуальный паттерн, сначала добавить live/reference evidence в audit, затем token/CSS.
7. После изменений запускать:

```bash
python3 scripts/validate_design_tokens.py --root . --json
npm --prefix app run build
```

## Оставшиеся вопросы

- Финально подтвердить self-hosting шрифта Gillroy/Gilroy и точное имя семейства в Astro. Live CSS использует `Gillroy`, старые font-face файлы названы `Gilroy`.
- Расширить live-аудит на остальные классы страниц: подборка, статья, новость, контакты. Текущий первоисточник достаточен, чтобы исправить базовые токены и не продолжать generic-дизайн.
