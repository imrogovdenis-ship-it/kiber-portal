---
name: kiber-portal-brand
description: Фирменный стиль «Кибер Портал» — live-verified design system по https://www.kiber-portal.ru/. Применяй при создании ЛЮБОГО фронтенд-артефакта для Кибер Портала: лендинг, страница робота, презентация, письмо, баннер, дашборд, HTML/CSS/React. Триггерь также на «Кибер Портал», «Кибер Гоша», «сайт по роботам», «страница аренды робота», «в стиле Кибер Портала», а также на упоминания синего #0088FF, Gillroy/Gilroy или Tilda-сайта по робототехнике. Используй ДО написания первой строки CSS.
---

# Кибер Портал — live-verified Design System

Бренд по аренде и продаже сервисных роботов: гуманоиды, робо-собаки, официанты, промо-роботы.
Тон визуала — **технологичный, коммерческий и живой**: светлый `#F4F8FF` canvas, реальные фото роботов, graphite scrim, один насыщенный синий на действие.

Источник истины обновлён 2026-08-24 по live computed styles и screenshots с:

- `https://www.kiber-portal.ru/`
- `https://www.kiber-portal.ru/arenda-unitree-g1`

Machine-readable evidence в Astro workspace:

- `data/design/kiber-portal-style-audit.generated.json`
- `data/design/kiber-portal-tokens.json`
- `data/design/live-screenshots/`

## Правила, которые нельзя нарушать

1. **Resting CTA = `#0088FF`.** `#005EFF` — deep/hover/часть radial CTA strip, не основная кнопка по умолчанию.
2. **Шрифт live-блоков: `Gillroy, Arial, sans-serif`.** `Montserrat` допустим как вторичный live-font для footer/meta/prices/Gosha. `Times New Roman` из body — технический fallback Tilda, не токен.
3. **Скругление 18px** — базовая подпись бренда для image/card surfaces. Кнопка 24px, product-page panel 30px, pills/arrows 50–100px.
4. **Теней почти нет.** Не делать generic SaaS shadows. Исключение: bubble Кибер Гоши `0 0 15px rgba(0,0,0,.1)`.
5. **Заголовки без negative tracking.** Live H1: 64/64/700 с `letter-spacing: 1px`; H2: 44/44/700 normal.
6. **Light-first canvas.** Основной фон секций `#F4F8FF`; тёмные блоки — новости/footer/hero scrim/CTA strip, а не весь сайт.
7. **Каталог — не карточки SaaS.** Product grid live: прозрачная плитка, квадратное изображение на белом, текст под ним, без border/shadow/rounded wrapper.
8. **Hero = фото + graphite scrim.** Не заменять production-ощущение абстрактным тёмно-синим gradient-only hero.

## Токены

Всё в `colors_and_type.css` и `app/src/styles/tokens.css`. Никогда не хардкодь hex — бери переменную.

| Роль | Токен | Значение |
|---|---|---|
| Action / resting CTA | `--kp-blue` | `#0088FF` |
| Deep / hover / gradient end | `--kp-blue-deep` | `#005EFF` |
| Site canvas | `--kp-sky` / alias `--kp-blue-tint` | `#F4F8FF` |
| Dark scrim/section | `--kp-ink-dark` / alias `--kp-ink-900` | `#25222B` |
| Headings/ink | `--kp-ink` / alias `--kp-ink-800` | `#36323E` |
| Nav ink | `--kp-nav-ink` | `#222222` |
| Muted text | `--kp-muted` / alias `--kp-gray` | `#797A91` |
| Captions/secondary muted | `--kp-muted-soft` / alias `--kp-gray-light` | `#A1A2B8` |
| Dividers | `--kp-line` / alias `--kp-border` | `#E7E7E7` |
| Surface | `--kp-surface` | `#FFFFFF` |
| Rare badge accent | `--kp-orange` / alias `--kp-amber` | `#FF991D` |

**Типографика.** H1 64/1.0/700 +1px · H2 44/1.0/700 · scenario title 34/1.0/700 · feature title 28/1.0/700 · catalog title 22/1.4/700 · body 16/1.6/500 · button 14/1.4/700.

**Ритм.** Container 1200px; section content 1160px; text blocks 960px; narrow FAQ/title 760px. Частый section rhythm Tilda: 60/30/90px, desktop gutters около 40px. Breakpoints 1200 / 960 / 640 / 480.

## Компоненты

| Компонент | Файл | Live правило |
|---|---|---|
| `Nav` | `components/Nav/` | Белая/полупрозрачная шапка 80px, logo 100px, nav Gillroy 16/400 `#222`, CTA `#0088FF` 48px/24px |
| `Hero` | `components/Hero/` | Фотообложка + graphite scrim, light canvas вокруг; H1 64/64/700 white, +1px tracking |
| `ProductCard` / `ProductGrid` | `components/ProductCard/` | Прозрачная плитка: square image on white, title 22px, price 14px Montserrat 600, no card border/shadow |
| `FeatureGrid` | `components/FeatureGrid/` | Feature title 28px or scenario title 34px; body 16/25.6 muted; panels may use 30px radius |
| `ExpertQuote` | `components/ExpertQuote/` | «Кибер Гоша» bubble на light canvas, 18px radius, только лёгкая тень `0 0 15px rgba(0,0,0,.1)` |
| `Faq` | `components/Faq/` | Вопрос 22px Gillroy 700 `#36323E`, dividers `#E7E7E7`, фон `#F4F8FF` |
| `LeadForm` / CTA strip | `components/LeadForm/` | Radial blue strip `#0088FF → #005EFF`, white pill buttons, title 44px white |
| `Footer` | `components/Footer/` | Тёмный подвал, `Montserrat` links/text допустимы, ссылки светлые |

Каркас страницы робота: шапка → фотообложка → вводный блок → галерея → CTA strip → «что умеет» → «где вау-эффект» → CTA strip → галерея/Гоша → FAQ с ценой → похожие роботы → подвал.

## Контент

Заголовки — по формуле «действие + объект + география»: «Аренда робота-официанта в Москве». Описания короткие, с конкретикой (что входит, за сколько, как быстро). Цену показываем всегда, даже «от» или «цена по запросу». Гости, мероприятие, вау-эффект — язык клиента; «квадропед», «манипулятор» — только в техблоке.
