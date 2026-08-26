# Опись источников дизайн-системы

Дата аудита: 2026-08-26. Статусы показывают пригодность для вертикального пилота, а не финальную публикацию сайта.

| Источник | Роль | Статус | Решение |
|---|---|---|---|
| `DESIGN-SYSTEM-TZ(2).md` | архитектура и критерии приёмки | принят | хранится как `docs/DESIGN-SYSTEM-TZ.md` |
| `docs/source/BLOCK-HANDOFF.md` | сводка блоков 01–34, mobile и бизнес-правил | принят как нормализованный handoff | SHA-256 `c4e7cf…00068` |
| `docs/source/BLOCK-SPEC-SOURCE.csv` | таблица 01–34 и комментарии review | принят | строка 35 считается mobile-состоянием, не блоком |
| `docs/source/DESIGN-REVIEW-DELTAS.csv` | дельты правок | принят как evidence | конфликт решается по иерархии источников |
| `docs/source/reference-desktop-v9.html` и `reference-mobile-v3.html` | desktop/mobile визуальное evidence | принят для сравнения | не является источником токенов без трассировки |
| `montserrat.zip` | runtime-font | проверен | self-hosted WOFF2 400/500/600/700, OFL |
| `gillroy.zip` | display-font | файл получен, лицензия не подтверждена | бинарник не публикуется; используется fallback |
| GitHub `main` legacy CSS/HTML/Tilda export | миграционное evidence | неавторитетный | полезное переносится выборочно |
| Linear, 84 задачи | приоритеты и зависимости | проаудировано | статусы меняются только с evidence |

## Недостающие исходники

- оригинальный `Правки.xlsx` без преобразования;
- утверждённые assets и reference screenshots для visual regression;
- web-лицензия Gilroy;
- финальные контакты и реквизиты;
- production/preview domains и доступность preview;
- analytics provider и владелец метрик;
- серверный получатель ContactModal.

Эти пункты не блокируют токены, схемы, registry и пилот Robot Card. Они блокируют только соответствующую публикацию или production-интеграцию.
