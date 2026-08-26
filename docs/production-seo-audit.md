# KIBER PORTAL — SEO-аудит production

Дата: 2026-08-26
Задача: KP-071 / KIBER-51. Вход: реестр URL KIBER-40 и решения KIBER-41.

Проверяется статический HTML, который отдаёт сервер, — то же, что видит краулер до исполнения JS.
Новая сборка уже проверена (`docs/rendered-schema-audit.md` и соседние отчёты). Здесь —
состояние сайта, который индексируется прямо сейчас, и baseline метаданных, который
не должен потеряться при cutover.

## Итог

- Проверено страниц: 44
- Без дефектов: 0
- С дефектами: 44
- Дубли title: 2
- Дубли description: 2

## Дефекты по частоте

- нет JSON-LD (в микроразметке: 44
- нет twitter: 44
- нет og: 16
- нет meta description: 9
- нет hN: 8
- длина title N вне диапазона N–N: 6
- canonical вне https: 1

## Страницы с дефектами

| URL | Тип | Решение KIBER-41 | Дефекты |
|---|---|---|---|
| `/` | home | keep | нет twitter:card; нет JSON-LD (в микроразметке: ImageObject) |
| `/arenda-agibot-x2` | robot detail | keep | нет twitter:card; нет JSON-LD (в микроразметке: ImageObject) |
| `/arenda-bellabot` | robot detail | keep | нет twitter:card; нет JSON-LD (в микроразметке: ImageObject) |
| `/arenda-glambot` | robot detail | keep | нет twitter:card; нет JSON-LD (в микроразметке: ImageObject) |
| `/arenda-inchbot-l1-w-edu` | robot detail | keep | нет twitter:card; нет JSON-LD (в микроразметке: ImageObject) |
| `/arenda-kettybot` | robot detail | keep | нет twitter:card; нет JSON-LD (в микроразметке: ImageObject) |
| `/arenda-klipmeiker` | robot detail | keep | нет twitter:card; нет JSON-LD (в микроразметке: ImageObject) |
| `/arenda-mini-robo-kofeyni` | robot detail | keep | нет twitter:card; нет JSON-LD (в микроразметке: ImageObject) |
| `/arenda-noetix-bumi` | robot detail | keep | нет twitter:card; нет JSON-LD (в микроразметке: ImageObject) |
| `/arenda-promobot-v4` | robot detail | keep | нет twitter:card; нет JSON-LD (в микроразметке: ImageObject) |
| `/arenda-robo-kofeyni` | robot detail | keep | нет twitter:card; нет JSON-LD (в микроразметке: ImageObject) |
| `/arenda-roboshashki` | robot detail | keep | нет twitter:card; нет JSON-LD (в микроразметке: ImageObject) |
| `/arenda-robot-barmen` | robot detail | keep | нет twitter:card; нет JSON-LD (в микроразметке: ImageObject) |
| `/arenda-robota-ardi` | robot detail | keep | нет twitter:card; нет JSON-LD (в микроразметке: ImageObject) |
| `/arenda-robota-hudozhnika-a4` | robot detail | keep | нет twitter:card; нет JSON-LD (в микроразметке: ImageObject) |
| `/arenda-robota-sofiya` | robot detail | keep | нет twitter:card; нет JSON-LD (в микроразметке: ImageObject) |
| `/arenda-robota-tron` | robot detail | keep | нет twitter:card; нет JSON-LD (в микроразметке: ImageObject) |
| `/arenda-robotov-na-meropriyatie` | collection | keep | нет twitter:card; нет JSON-LD (в микроразметке: ImageObject) |
| `/arenda-senserobot` | robot detail | keep | нет twitter:card; нет JSON-LD (в микроразметке: ImageObject) |
| `/arenda-sketchbot` | robot detail | keep | нет twitter:card; нет JSON-LD (в микроразметке: ImageObject) |
| `/arenda-unitree-g1` | robot detail | keep | нет twitter:card; нет JSON-LD (в микроразметке: ImageObject) |
| `/arenda-unitree-go2` | robot detail | keep | нет twitter:card; нет JSON-LD (в микроразметке: ImageObject) |
| `/arenda-unitree-h2` | robot detail | keep | нет twitter:card; нет JSON-LD (в микроразметке: ImageObject) |
| `/arenda-unitree-r1` | robot detail | keep | нет twitter:card; нет JSON-LD (в микроразметке: ImageObject) |
| `/arenda-uv-box` | robot detail | keep | нет twitter:card; нет JSON-LD (в микроразметке: ImageObject) |
| `/arenda-xiaomi-cyberdog-2` | robot detail | keep | нет twitter:card; нет JSON-LD (в микроразметке: ImageObject) |
| `/articles` | content index | keep | нет meta description; нет h1; нет og:description; нет og:image; нет twitter:card; нет JSON-LD (в микроразметке: ImageObject) |
| `/astri` | stub/system | redirect | длина title 8 вне диапазона 10–70; нет meta description; canonical вне https://www.kiber-portal.ru: http://kiber-portal.ru/astri; нет og:description; нет twitter:card; нет JSON-LD (в микроразметке: ImageObject) |
| `/compilations` | content index | keep | длина title 8 вне диапазона 10–70; нет meta description; нет h1; нет og:description; нет og:image; нет twitter:card; нет JSON-LD (в микроразметке: ImageObject) |
| `/neobychnyi-podarok-direktoru-robot` | article/detail | keep | нет twitter:card; нет JSON-LD (в микроразметке: ImageObject) |
| `/news` | content index | keep | длина title 4 вне диапазона 10–70; нет meta description; нет h1; нет og:description; нет og:image; нет twitter:card; нет JSON-LD (в микроразметке: ничего) |
| `/noetix-bumi-robot-gumanoid-dlya-meropriyatiy` | article/detail | keep | нет twitter:card; нет JSON-LD (в микроразметке: ImageObject) |
| `/page135835866.html` | tilda system page | delete | нет meta description; нет h1; нет og:description; нет twitter:card; нет JSON-LD (в микроразметке: ImageObject) |
| `/page135870606.html` | tilda system page | delete | длина title 3 вне диапазона 10–70; нет meta description; нет h1; нет og:description; нет og:image; нет twitter:card; нет JSON-LD (в микроразметке: ImageObject) |
| `/page145061706.html` | tilda system page | delete | длина title 4 вне диапазона 10–70; нет meta description; нет h1; нет og:description; нет og:image; нет twitter:card; нет JSON-LD (в микроразметке: ImageObject) |
| `/page185196309.html` | tilda system page | redirect | нет twitter:card; нет JSON-LD (в микроразметке: ImageObject) |
| `/page205493309.html` | tilda system page | delete | нет meta description; нет h1; нет og:description; нет og:image; нет twitter:card; нет JSON-LD (в микроразметке: ничего) |
| `/pozdravlenie-robotom-na-svadbe` | article/detail | keep | нет twitter:card; нет JSON-LD (в микроразметке: ImageObject) |
| `/robot-ofitsiant-na-meropriyatii` | article/detail | keep | нет twitter:card; нет JSON-LD (в микроразметке: ImageObject) |
| `/roboty-gumanoidy` | collection | keep | нет twitter:card; нет JSON-LD (в микроразметке: ImageObject) |
| `/sravnenie-unitree-g1-r1-h2` | article/detail | keep | нет twitter:card; нет JSON-LD (в микроразметке: ImageObject) |
| `/test2` | test page | delete | длина title 5 вне диапазона 10–70; нет meta description; нет h1; нет og:description; нет og:image; нет twitter:card; нет JSON-LD (в микроразметке: ничего) |
| `/unitree-g1-ili-agibot-x2` | article/detail | keep | нет twitter:card; нет JSON-LD (в микроразметке: ImageObject) |
| `/velkom-zona-na-svadbe-robot` | article/detail | keep | нет twitter:card; нет JSON-LD (в микроразметке: ImageObject) |

## Baseline метаданных для сохраняемых URL

Эти значения новая сборка обязана воспроизвести на тех же адресах: расхождение здесь —
потеря накопленных сигналов, а не косметика.

| URL | title | h1 | JSON-LD | микроразметка |
|---|---|---|---|---|
| `/` | Аренда роботов для мероприятий в Москве — от 20 000 ₽ | КИБЕР ПОРТАЛ | Аренда роботов для мероприятий | — | ImageObject |
| `/arenda-agibot-x2` | Аренда робота-гуманоида Agibot X2 в Москве | КИБЕР ПОРТАЛ | Аренда робота-гуманоида Agibot X2 | — | ImageObject |
| `/arenda-bellabot` | Аренда робота-официанта BellaBot | КИБЕР ПОРТАЛ | Аренда робота-официанта BellaBot | — | ImageObject |
| `/arenda-glambot` | Аренда робота GlamBot | КИБЕР ПОРТАЛ | Аренда робота GlamBot | — | ImageObject |
| `/arenda-inchbot-l1-w-edu` | Аренда робота-собаки Inchbot L1-W EDU | КИБЕР ПОРТАЛ | Аренда робота-собаки Inchbot L1-W EDU | — | ImageObject |
| `/arenda-kettybot` | Аренда робота-официанта KettyBot в Москве| КИБЕР ПОРТАЛ | Аренда робота-официанта KettyBot | — | ImageObject |
| `/arenda-klipmeiker` | Аренда робота Клипмейкер | КИБЕР ПОРТАЛ | Аренда робота Клипмейкер | — | ImageObject |
| `/arenda-mini-robo-kofeyni` | Аренда мини робо-кофейни | КИБЕР ПОРТАЛ | Аренда мини робо-кофейни | — | ImageObject |
| `/arenda-noetix-bumi` | Аренда робота-гуманоида Noetix Bumi в Москве | КИБЕР ПОРТАЛ | Аренда робота-гуманоида Noetix Bumi | — | ImageObject |
| `/arenda-promobot-v4` | Аренда Promobot V4 | КИБЕР ПОРТАЛ | Аренда Promobot V4 | — | ImageObject |
| `/arenda-robo-kofeyni` | Аренда робо-кофейни | КИБЕР ПОРТАЛ | Аренда робота-кофейни | — | ImageObject |
| `/arenda-roboshashki` | Аренда робота для игры в шашки | КИБЕР ПОРТАЛ | Аренда робота для игры в шашки | — | ImageObject |
| `/arenda-robot-barmen` | Аренда робота-бармена «Робобар» на праздник | КИБЕР ПОРТАЛ | Аренда робота-бармена «Робобар» | — | ImageObject |
| `/arenda-robota-ardi` | Аренда робота Арди (Promobot) | КИБЕР ПОРТАЛ | Аренда робота Арди | — | ImageObject |
| `/arenda-robota-hudozhnika-a4` | Аренда робота-художника большого формата | КИБЕР ПОРТАЛ | Аренда робота-художника большого формата | — | ImageObject |
| `/arenda-robota-sofiya` | Аренда робота София | КИБЕР ПОРТАЛ | Аренда робота София | — | ImageObject |
| `/arenda-robota-tron` | Аренда модульного робота Tron | КИБЕР ПОРТАЛ | Аренда модульного робота Tron | — | ImageObject |
| `/arenda-robotov-na-meropriyatie` | Аренда роботов на мероприятие в Москве | КИБЕР ПОРТАЛ | Аренда роботов на мероприятие: зачем это нужно и как выбрать формат | — | ImageObject |
| `/arenda-senserobot` | Аренда робота-шахматиста SenseRobot | КИБЕР ПОРТАЛ | Аренда робота-шахматиста SenseRobot | — | ImageObject |
| `/arenda-sketchbot` | Аренда робота-художника Sketchbot в Москве | КИБЕР ПОРТАЛ | Аренда робота-художника Sketchbot | — | ImageObject |
| `/arenda-unitree-g1` | Аренда робота-гуманоида Unitree G1 в Москве | КИБЕР ПОРТАЛ | Аренда робота-гуманоида Unitree G1 | — | ImageObject |
| `/arenda-unitree-go2` | Аренда робота-собаки Unitree Go2 в Москве | КИБЕР ПОРТАЛ | Аренда робота-собаки Unitree Go2 | — | ImageObject |
| `/arenda-unitree-h2` | Аренда робота-гуманоида Unitree H2 в Москве | КИБЕР ПОРТАЛ | Аренда робота-гуманоида Unitree H2 | — | ImageObject |
| `/arenda-unitree-r1` | Аренда робота-гуманоида Unitree R1 в Москве | КИБЕР ПОРТАЛ | Аренда робота-гуманоида Unitree R1 | — | ImageObject |
| `/arenda-uv-box` | Аренда UV-BOX | КИБЕР ПОРТАЛ | Аренда интерактивной витрины UV-BOX | — | ImageObject |
| `/arenda-xiaomi-cyberdog-2` | Прокат робота-собаки Xiaomi Cyberdog 2 | КИБЕР ПОРТАЛ | Аренда робота-собаки Xiaomi Cyberdog 2 | — | ImageObject |
| `/articles` | Все статьи | — | — | ImageObject |
| `/compilations` | Подборки | — | — | ImageObject |
| `/neobychnyi-podarok-direktoru-robot` | Необычный подарок директору: робот в подарок | КИБЕР ПОРТАЛ | Необычный подарок директору: робот в кабинете вместо галстука | — | ImageObject |
| `/news` | news | — | — | — |
| `/noetix-bumi-robot-gumanoid-dlya-meropriyatiy` | Noetix Bumi: робот-гуманоид ростом с ребёнка | КИБЕР ПОРТАЛ | Noetix Bumi: робот-гуманоид ростом с ребёнка для мероприятий | — | ImageObject |
| `/pozdravlenie-robotom-na-svadbe` | Необычное поздравление на свадьбе роботом | КИБЕР ПОРТАЛ | Необычное поздравление на свадьбе: робот выходит с тостом и танцем | — | ImageObject |
| `/robot-ofitsiant-na-meropriyatii` | Робот-официант на мероприятие — аренда | КИБЕР ПОРТАЛ | Робот-официант на мероприятии: свадьба, конференция, фестиваль | — | ImageObject |
| `/roboty-gumanoidy` | Аренда робота-гуманоида в Москве от 35 000 ₽ | КИБЕР ПОРТАЛ | Аренда робота-гуманоида для мероприятий | — | ImageObject |
| `/sravnenie-unitree-g1-r1-h2` | Unitree G1, R1, H2: сравнение гуманоидов | КИБЕР ПОРТАЛ | Unitree G1, R1 и H2: сравнение роботов-гуманоидов для мероприятий | — | ImageObject |
| `/unitree-g1-ili-agibot-x2` | Unitree G1 или Agibot X2: что выбрать для мероприятия | КИБЕР ПОРТАЛ | Unitree G1 или Agibot X2: какого робота-гуманоида выбрать для мероприятия | — | ImageObject |
| `/velkom-zona-na-svadbe-robot` | Велком-зона на свадьбе с роботом | КИБЕР ПОРТАЛ | Необычная велком-зона на свадьбе: робот, который встречает гостей | — | ImageObject |

## Как обновлять

```bash
python3 scripts/audit_production_seo.py
```
