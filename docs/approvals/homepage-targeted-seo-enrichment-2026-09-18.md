# Owner approval — главная КИБЕР ПОРТАЛ

Дата: 2026-09-18  
Статус: **owner-approved on Jino preview**  
Preview: https://jino-preview.kiber-portal.ru/?v=home-owner-fixes-1

## Что утверждено

Главная страница `/` после targeted SEO enrichment и правок владельца.

Финальное состояние:

- H1: `Аренда роботов для мероприятий`
- Hero lead: `Подберём робота в аренду на выставку, презентацию, корпоратив, праздник или в welcome-зону. Берём на себя всю подготовку: сценарий, площадку, тайминг и оператора. Вам останется только встречать гостей.`
- Блок `01 — что входит` стоит после каталога и оформлен как чек-лист.
- `Блог Кибер Гоши` стоит после CTA2 и перед footer.

## Границы approval

- Jino preview: **согласовано / принято владельцем**.
- Production: **не выкладывать**.
- Merge/production deploy/DNS/secrets/analytics/live lead routing: **не одобрено этим решением**.
- Следующий режим работы: продолжаем собирать дальше по блокам.

## Проверки

- `npm run check` → 0 errors, 0 warnings, 32 hints.
- `npm run build:preview` → 90 pages built.
- Browser preview → page opens, noindex/nofollow, console 0 JS errors.
