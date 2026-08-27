# KIBER-86: parity-аудит 05 / Robot Card

Дата: 2026-08-26. Проверяемые источники:

- `docs/source/reference-desktop-v9.html` → `data-rv="05 · ROBOT CARD (каталог)"`, `.robot-card`;
- `docs/source/reference-mobile-v3.html` → `data-rv="05"`, `.robot-card`;
- `docs/DESIGN-SYSTEM-TZ.md` и обязательные legal/a11y/business rules.

## Результат

| Область | Desktop reference | Mobile reference | Статус реализации |
|---|---|---|---|
| Grid | 4→3→2, gap 32→16 | 2 колонки, gap 16 | PASS: spec/preview 2→2→3→4 |
| Media | 1:1, white, radius 16, cover/top | то же | PASS после token/CSS sync |
| Image hover | scale 1.03, 300 ms ease-in-out | hover несущественен | PASS после token/CSS sync |
| Badge | 92, inset 16, font 14/500, padding 8 | 48, inset 10, font 9, padding 4 | PASS после token/CSS sync |
| Content box | padding 24/8, interval 12 | padding 12/2, interval 6 | PASS после token/CSS sync |
| Typography | title 22/1.35; price 16/1.4; desc 13/1.45; category 10/1 | title 14/1.3; price 14; desc 10/1.3; category 9 | PASS after component tokens |
| DOM order | title → price → description → category | то же | OPEN: текущий компонент показывает category первым; нельзя менять вместе с link behavior без решения владельца |
| Link behavior | вся карточка — `<a>` | вся карточка — `<a>` | OPEN: текущий contract использует `<article>` + отдельную ссылку для явного focus-state |
| Brand mark | logo 28, inset 16 | в markup отсутствует; в CSS задано 20/inset 10 | OPEN: противоречие внутри mobile reference |
| Unitree route/content | `/arenda-unitree-g1`, `от 50 000 ₽` | то же | CONTENT OVERRIDE: непроверенные route/price не переносим автоматически |
| Price disclaimer | отсутствует | отсутствует | REQUIRED OVERRIDE: ТЗ требует «Не является публичной офертой» рядом с ценой |
| Gilroy | указан reference | указан reference | LICENSE OVERRIDE: до подтверждения web-лицензии используется Arial fallback |
| Assets | реальные изображения | реальные изображения | DEFERRED: geometry проверяется на placeholders, media добавляются после подтверждения прав |

Итог: HTML-референсы теперь являются проверяемым источником, а не справочным файлом. Неоднозначные DOM/content/media решения вынесены в `docs/OPEN-QUESTIONS.md`; они не блокируют карту 01–34, tokens, schema и последующие block specs.
