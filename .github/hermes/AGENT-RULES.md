# Hermes: обязательные правила

## Процесс

1. Работать только в отдельной ветке и открывать PR; прямой push в `main` запрещён.
2. До изменения прочитать `DESIGN-SYSTEM-TZ`, `TRACEABILITY`, `visual-source-map.yaml`, оба HTML-референса по locators затронутого блока, этот файл и block spec.
3. Правка блока включает source YAML, компонент, fixture, тест и changelog. Generated-файлы обновляются только `npm run ds:generate`.
4. Перед PR выполнить `npm ci` и `npm run ci`.
5. В PR указать Linear ID, источник требования, блок/review ID, screenshots четырёх viewport и preview URL.

## Дизайн и контент

- Использовать только зарегистрированные блоки 01–34 и variants. Новый блок/variant сначала проходит отдельный design-system PR.
- `reference-desktop-v9.html` и `reference-mobile-v3.html` — обязательная визуальная основа. Visual-ready spec без точной traceability на оба файла запрещён.
- Явное отклонение от HTML-референса допускается только по более позднему решению владельца, review delta или legal/accessibility/security/business rule; причина фиксируется в parity-аудите.
- Не добавлять HEX/RGB/HSL вне primitive color tokens и размеры вне primitive dimension tokens.
- Responsive map использует только `sm/md/lg/xl`; массивы размеров запрещены.
- Компонент использует semantic/component tokens, а не ручные значения.
- Spec описывает контракт и не содержит реальный контент или произвольный CSS.
- Gilroy не подключать без подтверждённой web-лицензии; Tilda CDN запрещён.
- Alt описывает видимое без цены и SEO-спама; рядом с ценой обязательна юридическая пометка.
- Самостоятельная аренда робота запрещена; сопровождающий специалист обязателен.
- JSON-LD строится через `src/lib/seo.ts`, analytics — только по контракту.

## Безопасность и production

- Не читать, копировать и менять production secrets.
- Не выполнять production deploy, DNS/cutover, merge и изменение реальных lead destinations без явного разрешения владельца.
- `PUBLIC_*` не содержит секретов.
- Preview не получает production analytics/secrets, имеет noindex и не генерируется в production.
- Не удалять legacy до миграционного evidence, passing CI и человеческого review.
