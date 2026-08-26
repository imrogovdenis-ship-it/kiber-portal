# KIBER PORTAL — решения keep/merge/delete/redirect по production URL

Дата: 2026-08-26
Задача: KP-065 / KIBER-41. Вход: `data/seo/production-url-registry.json` (KP-064) + живой обход внутренних ссылок.
Выход: вход для KP-066 (registry редиректов и чистый sitemap).

## Итог

- Всего URL: 44
- keep: 37
- redirect: 2
- delete: 5
- merge: 0
- Требуют решения владельца: 1

Правило: ни одно решение не применяется к production до cutover. Пока меняется только реестр,
Tilda остаётся замороженной (KIBER-5).

## Требуют решения владельца

- `/astri` → **redirect**: Astribot возвращается в каталог как отдельная страница робота или URL закрывается редиректом на /roboty-gumanoidy?

## Решения

| # | URL | Тип | Решение | Цель | HTTP | Внутренние ссылки | Обоснование |
|---:|---|---|---|---|---|---:|---|
| 1 | `/` | home | keep | `/` | 200 на том же адресе | 41 | Публичная страница с рабочим адресом и соответствующим маршрутом в controlled rebuild — URL сохраняется без изменений. |
| 2 | `/arenda-agibot-x2` | robot detail | keep | `/arenda-agibot-x2` | 200 на том же адресе | 15 | Публичная страница с рабочим адресом и соответствующим маршрутом в controlled rebuild — URL сохраняется без изменений. |
| 3 | `/arenda-bellabot` | robot detail | keep | `/arenda-bellabot` | 200 на том же адресе | 13 | Публичная страница с рабочим адресом и соответствующим маршрутом в controlled rebuild — URL сохраняется без изменений. |
| 4 | `/arenda-glambot` | robot detail | keep | `/arenda-glambot` | 200 на том же адресе | 11 | Публичная страница с рабочим адресом и соответствующим маршрутом в controlled rebuild — URL сохраняется без изменений. |
| 5 | `/arenda-inchbot-l1-w-edu` | robot detail | keep | `/arenda-inchbot-l1-w-edu` | 200 на том же адресе | 6 | Публичная страница с рабочим адресом и соответствующим маршрутом в controlled rebuild — URL сохраняется без изменений. |
| 6 | `/arenda-kettybot` | robot detail | keep | `/arenda-kettybot` | 200 на том же адресе | 14 | Публичная страница с рабочим адресом и соответствующим маршрутом в controlled rebuild — URL сохраняется без изменений. |
| 7 | `/arenda-klipmeiker` | robot detail | keep | `/arenda-klipmeiker` | 200 на том же адресе | 12 | Публичная страница с рабочим адресом и соответствующим маршрутом в controlled rebuild — URL сохраняется без изменений. |
| 8 | `/arenda-mini-robo-kofeyni` | robot detail | keep | `/arenda-mini-robo-kofeyni` | 200 на том же адресе | 12 | Публичная страница с рабочим адресом и соответствующим маршрутом в controlled rebuild — URL сохраняется без изменений. |
| 9 | `/arenda-noetix-bumi` | robot detail | keep | `/arenda-noetix-bumi` | 200 на том же адресе | 18 | Публичная страница с рабочим адресом и соответствующим маршрутом в controlled rebuild — URL сохраняется без изменений. |
| 10 | `/arenda-promobot-v4` | robot detail | keep | `/arenda-promobot-v4` | 200 на том же адресе | 4 | Публичная страница с рабочим адресом и соответствующим маршрутом в controlled rebuild — URL сохраняется без изменений. |
| 11 | `/arenda-robo-kofeyni` | robot detail | keep | `/arenda-robo-kofeyni` | 200 на том же адресе | 12 | Публичная страница с рабочим адресом и соответствующим маршрутом в controlled rebuild — URL сохраняется без изменений. |
| 12 | `/arenda-roboshashki` | robot detail | keep | `/arenda-roboshashki` | 200 на том же адресе | 9 | Публичная страница с рабочим адресом и соответствующим маршрутом в controlled rebuild — URL сохраняется без изменений. |
| 13 | `/arenda-robot-barmen` | robot detail | keep | `/arenda-robot-barmen` | 200 на том же адресе | 17 | Публичная страница с рабочим адресом и соответствующим маршрутом в controlled rebuild — URL сохраняется без изменений. |
| 14 | `/arenda-robota-ardi` | robot detail | keep | `/arenda-robota-ardi` | 200 на том же адресе | 11 | Публичная страница с рабочим адресом и соответствующим маршрутом в controlled rebuild — URL сохраняется без изменений. |
| 15 | `/arenda-robota-hudozhnika-a4` | robot detail | keep | `/arenda-robota-hudozhnika-a4` | 200 на том же адресе | 13 | Публичная страница с рабочим адресом и соответствующим маршрутом в controlled rebuild — URL сохраняется без изменений. |
| 16 | `/arenda-robota-sofiya` | robot detail | keep | `/arenda-robota-sofiya` | 200 на том же адресе | 12 | Публичная страница с рабочим адресом и соответствующим маршрутом в controlled rebuild — URL сохраняется без изменений. |
| 17 | `/arenda-robota-tron` | robot detail | keep | `/arenda-robota-tron` | 200 на том же адресе | 2 | Публичная страница с рабочим адресом и соответствующим маршрутом в controlled rebuild — URL сохраняется без изменений. |
| 18 | `/arenda-robotov-na-meropriyatie` | collection | keep | `/arenda-robotov-na-meropriyatie` | 200 на том же адресе | 3 | Публичная страница с рабочим адресом и соответствующим маршрутом в controlled rebuild — URL сохраняется без изменений. |
| 19 | `/arenda-senserobot` | robot detail | keep | `/arenda-senserobot` | 200 на том же адресе | 12 | Публичная страница с рабочим адресом и соответствующим маршрутом в controlled rebuild — URL сохраняется без изменений. |
| 20 | `/arenda-sketchbot` | robot detail | keep | `/arenda-sketchbot` | 200 на том же адресе | 13 | Публичная страница с рабочим адресом и соответствующим маршрутом в controlled rebuild — URL сохраняется без изменений. |
| 21 | `/arenda-unitree-g1` | robot detail | keep | `/arenda-unitree-g1` | 200 на том же адресе | 28 | Публичная страница с рабочим адресом и соответствующим маршрутом в controlled rebuild — URL сохраняется без изменений. |
| 22 | `/arenda-unitree-go2` | robot detail | keep | `/arenda-unitree-go2` | 200 на том же адресе | 19 | Публичная страница с рабочим адресом и соответствующим маршрутом в controlled rebuild — URL сохраняется без изменений. |
| 23 | `/arenda-unitree-h2` | robot detail | keep | `/arenda-unitree-h2` | 200 на том же адресе | 11 | Публичная страница с рабочим адресом и соответствующим маршрутом в controlled rebuild — URL сохраняется без изменений. |
| 24 | `/arenda-unitree-r1` | robot detail | keep | `/arenda-unitree-r1` | 200 на том же адресе | 18 | Публичная страница с рабочим адресом и соответствующим маршрутом в controlled rebuild — URL сохраняется без изменений. |
| 25 | `/arenda-uv-box` | robot detail | keep | `/arenda-uv-box` | 200 на том же адресе | 11 | Публичная страница с рабочим адресом и соответствующим маршрутом в controlled rebuild — URL сохраняется без изменений. |
| 26 | `/arenda-xiaomi-cyberdog-2` | robot detail | keep | `/arenda-xiaomi-cyberdog-2` | 200 на том же адресе | 9 | Публичная страница с рабочим адресом и соответствующим маршрутом в controlled rebuild — URL сохраняется без изменений. |
| 27 | `/articles` | content index | keep | `/articles` | 200 на том же адресе | 41 | URL сохраняется, но перед релизом нужно закрыть: missing h1. |
| 28 | `/astri` | stub/system | redirect ⚠️ | `/roboty-gumanoidy` | 301 | 0 | Заглушка Astribot без контента и с http-canonical. Робота нет в каталоге 24 позиций, поэтому ближайшая релевантная цель — коллекция гуманоидов. |
| 29 | `/compilations` | content index | keep | `/compilations` | 200 на том же адресе | 41 | URL сохраняется, но перед релизом нужно закрыть: missing h1. |
| 30 | `/neobychnyi-podarok-direktoru-robot` | article/detail | keep | `/neobychnyi-podarok-direktoru-robot` | 200 на том же адресе | 4 | Публичная страница с рабочим адресом и соответствующим маршрутом в controlled rebuild — URL сохраняется без изменений. |
| 31 | `/news` | content index | keep | `/news` | 200 на том же адресе | 41 | URL сохраняется, но перед релизом нужно закрыть: missing h1. |
| 32 | `/noetix-bumi-robot-gumanoid-dlya-meropriyatiy` | article/detail | keep | `/noetix-bumi-robot-gumanoid-dlya-meropriyatiy` | 200 на том же адресе | 1 | Публичная страница с рабочим адресом и соответствующим маршрутом в controlled rebuild — URL сохраняется без изменений. |
| 33 | `/page135835866.html` | tilda system page | delete | — | 410 + удалить из sitemap | 0 | Служебная страница Tilda без публичного контента, опубликована в sitemap и индексируется. |
| 34 | `/page135870606.html` | tilda system page | delete | — | 410 после cutover; до cutover оставить как обработчик 404 в Tilda | 0 | Системная страница 404 Tilda. Из sitemap убирается сразу, но саму страницу нельзя удалять, пока Tilda обслуживает production (см. KIBER-29). |
| 35 | `/page145061706.html` | tilda system page | delete | — | 410 + удалить из sitemap | 0 | Служебная страница Tilda без публичного контента, опубликована в sitemap и индексируется. |
| 36 | `/page185196309.html` | tilda system page | redirect | `/neobychnyi-podarok-direktoru-robot` | 301 | 0 | Служебный дубль статьи: страница уже указывает canonical на статью, поэтому вес нужно передать редиректом, а не терять. |
| 37 | `/page205493309.html` | tilda system page | delete | — | 410 + удалить из sitemap | 0 | Служебная страница Tilda без публичного контента, опубликована в sitemap и индексируется. |
| 38 | `/pozdravlenie-robotom-na-svadbe` | article/detail | keep | `/pozdravlenie-robotom-na-svadbe` | 200 на том же адресе | 4 | Публичная страница с рабочим адресом и соответствующим маршрутом в controlled rebuild — URL сохраняется без изменений. |
| 39 | `/robot-ofitsiant-na-meropriyatii` | article/detail | keep | `/robot-ofitsiant-na-meropriyatii` | 200 на том же адресе | 3 | Публичная страница с рабочим адресом и соответствующим маршрутом в controlled rebuild — URL сохраняется без изменений. |
| 40 | `/roboty-gumanoidy` | collection | keep | `/roboty-gumanoidy` | 200 на том же адресе | 1 | Публичная страница с рабочим адресом и соответствующим маршрутом в controlled rebuild — URL сохраняется без изменений. |
| 41 | `/sravnenie-unitree-g1-r1-h2` | article/detail | keep | `/sravnenie-unitree-g1-r1-h2` | 200 на том же адресе | 1 | Публичная страница с рабочим адресом и соответствующим маршрутом в controlled rebuild — URL сохраняется без изменений. |
| 42 | `/test2` | test page | delete | — | 410 + удалить из sitemap | 0 | Служебная страница Tilda без публичного контента, опубликована в sitemap и индексируется. |
| 43 | `/unitree-g1-ili-agibot-x2` | article/detail | keep | `/unitree-g1-ili-agibot-x2` | 200 на том же адресе | 4 | Публичная страница с рабочим адресом и соответствующим маршрутом в controlled rebuild — URL сохраняется без изменений. |
| 44 | `/velkom-zona-na-svadbe-robot` | article/detail | keep | `/velkom-zona-na-svadbe-robot` | 200 на том же адресе | 3 | Публичная страница с рабочим адресом и соответствующим маршрутом в controlled rebuild — URL сохраняется без изменений. |

## Как обновлять

```bash
python3 scripts/build_production_url_registry.py
python3 scripts/build_production_url_decisions.py
```
