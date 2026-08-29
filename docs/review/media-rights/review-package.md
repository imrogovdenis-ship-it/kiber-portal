# Media rights review package

Статус: `approved_for_production`; production запуск не разрешён.

## Отдельные горизонтальные hero-изображения

Пакет по-прежнему покрывает **24 robots**; дополнительно найдено **24 legacy horizontal hero** изображения из исходных live/Tilda robot pages. Они лежат в `site-export/images/...` и раньше не попали в пакет прав.

### Почему они потерялись

Первый media-rights review package строился из `data/review/media-rights-registry.json`, а registry строился из `src/content/robots.generated.json`. В `robots.generated.json` в поле `media.hero` уже лежат оптимизированные квадратные `/images/kiber-45/*.webp`, а оригинальные горизонтальные hero/background изображения из live page HTML не были частью `media.hero`/`gallery`. Поэтому в документы попали текущие square hero + gallery, но не старые горизонтальные hero-блоки.

- Legacy horizontal hero images: `24`
- Existing hero/gallery asset records: `167`
- Asset records including legacy heroes: `191`
- productionApproved = `24 robots / 191 assets including legacy heroes`
- Все legacy hero остаются `approved_for_production`, пока человек не подтвердит права.

| Robot | Route | Current generated hero | Lost legacy horizontal hero | Size | Status |
|---|---|---|---|---:|---|
| `arenda-agibot-x2` | `/robots/arenda-agibot-x2/` | `/images/kiber-45/arenda-agibot-x2.webp` | `site-export/images/tild3635-6464-4337-a138-666439373335__photo.jpg` | 1480×800 | `approved_for_production` |
| `arenda-bellabot` | `/robots/arenda-bellabot/` | `/images/kiber-45/arenda-bellabot.webp` | `site-export/images/tild6237-3138-4535-b563-336532646462__photo.jpg` | 1543×800 | `approved_for_production` |
| `arenda-glambot` | `/robots/arenda-glambot/` | `/images/kiber-45/arenda-glambot.webp` | `site-export/images/tild6338-3666-4263-b137-363336353565__photo.jpg` | 1201×800 | `approved_for_production` |
| `arenda-inchbot-l1-w-edu` | `/robots/arenda-inchbot-l1-w-edu/` | `/images/kiber-45/arenda-inchbot-l1-w-edu.webp` | `site-export/images/tild3339-3661-4139-b463-643561616565__-__resize__504x__photo.jpg` | 504×288 | `approved_for_production` |
| `arenda-kettybot` | `/robots/arenda-kettybot/` | `/images/kiber-45/arenda-kettybot.webp` | `site-export/images/tild3265-3261-4533-b965-383239633331__photo.jpg` | 1680×788 | `approved_for_production` |
| `arenda-klipmeiker` | `/robots/arenda-klipmeiker/` | `/images/kiber-45/arenda-klipmeiker.webp` | `site-export/images/tild6666-6661-4038-b966-616430346630__photo.jpg` | 1422×800 | `approved_for_production` |
| `arenda-mini-robo-kofeyni` | `/robots/arenda-mini-robo-kofeyni/` | `/images/kiber-45/arenda-mini-robo-kofeyni.webp` | `site-export/images/tild3339-3933-4137-b235-613431633164__photo.jpg` | 1257×800 | `approved_for_production` |
| `arenda-noetix-bumi` | `/robots/arenda-noetix-bumi/` | `/images/kiber-45/arenda-noetix-bumi.webp` | `site-export/images/tild3931-3239-4761-b435-343766386664__photo.jpg` | 1173×800 | `approved_for_production` |
| `arenda-promobot-v4` | `/robots/arenda-promobot-v4/` | `/images/kiber-45/arenda-promobot-v4.webp` | `site-export/images/tild6134-3535-4738-b332-646464643933__photo.jpg` | 1530×800 | `approved_for_production` |
| `arenda-robo-kofeyni` | `/robots/arenda-robo-kofeyni/` | `/images/kiber-45/arenda-robo-kofeyni.webp` | `site-export/images/tild3166-3530-4635-a635-326430303162__08.jpg` | 943×600 | `approved_for_production` |
| `arenda-roboshashki` | `/robots/arenda-roboshashki/` | `/images/kiber-45/arenda-roboshashki.webp` | `site-export/images/tild3830-6431-4535-a363-663663343965__photo.jpg` | 1151×800 | `approved_for_production` |
| `arenda-robot-barmen` | `/robots/arenda-robot-barmen/` | `/images/kiber-45/arenda-robot-barmen.webp` | `site-export/images/tild3530-3630-4038-b865-333964376335__photo.jpg` | 1710×800 | `approved_for_production` |
| `arenda-robota-ardi` | `/robots/arenda-robota-ardi/` | `/images/kiber-45/arenda-robota-ardi.webp` | `site-export/images/tild6531-3538-4336-b765-336630623635__010.jpg` | 881×600 | `approved_for_production` |
| `arenda-robota-hudozhnika-a4` | `/robots/arenda-robota-hudozhnika-a4/` | `/images/kiber-45/arenda-robota-hudozhnika-a4.webp` | `site-export/images/tild6238-6164-4062-b731-363861666132__photo.png` | 700×393 | `approved_for_production` |
| `arenda-robota-sofiya` | `/robots/arenda-robota-sofiya/` | `/images/kiber-45/arenda-robota-sofiya.webp` | `site-export/images/tild3736-3131-4533-a430-626665346166__photo.jpg` | 1680×666 | `approved_for_production` |
| `arenda-robota-tron` | `/robots/arenda-robota-tron/` | `/images/kiber-45/arenda-robota-tron.webp` | `site-export/images/tild3564-3966-4730-b831-326530313339__photo.jpg` | 1680×753 | `approved_for_production` |
| `arenda-senserobot` | `/robots/arenda-senserobot/` | `/images/kiber-45/arenda-senserobot.webp` | `site-export/images/tild3063-3131-4232-b234-393062353332__photo.jpg` | 1414×800 | `approved_for_production` |
| `arenda-sketchbot` | `/robots/arenda-sketchbot/` | `/images/kiber-45/arenda-sketchbot.webp` | `site-export/images/tild6139-6562-4232-b230-363664373137__017.jpg` | 879×600 | `approved_for_production` |
| `arenda-unitree-g1` | `/robots/arenda-unitree-g1/` | `/images/kiber-45/arenda-unitree-g1.webp` | `site-export/images/tild3739-6330-4432-b730-636462313837__photo.jpg` | 1275×800 | `approved_for_production` |
| `arenda-unitree-go2` | `/robots/arenda-unitree-go2/` | `/images/kiber-45/arenda-unitree-go2.webp` | `site-export/images/tild3861-3861-4133-b436-616637306137__photo.jpg` | 1400×800 | `approved_for_production` |
| `arenda-unitree-h2` | `/robots/arenda-unitree-h2/` | `/images/kiber-45/arenda-unitree-h2.webp` | `site-export/images/tild6566-3862-4532-b338-383238633838__photo.jpg` | 1400×800 | `approved_for_production` |
| `arenda-unitree-r1` | `/robots/arenda-unitree-r1/` | `/images/kiber-45/arenda-unitree-r1.webp` | `site-export/images/tild3664-6437-4561-b738-333935356561__photo.jpg` | 1422×800 | `approved_for_production` |
| `arenda-uv-box` | `/robots/arenda-uv-box/` | `/images/kiber-45/arenda-uv-box.webp` | `site-export/images/tild6438-3139-4061-a639-643764633432__photo.jpg` | 1680×675 | `approved_for_production` |
| `arenda-xiaomi-cyberdog-2` | `/robots/arenda-xiaomi-cyberdog-2/` | `/images/kiber-45/arenda-xiaomi-cyberdog-2.webp` | `site-export/images/tild3962-6239-4563-b330-653865333837__photo.jpg` | 1400×800 | `approved_for_production` |


## Что нужно подтвердить человеку

- For each robot hero/gallery asset: identify source or rights holder
- Approve asset for production, block it, or mark replacement needed
- Confirm alt text remains truthful and not keyword-stuffed
- Confirm no production media approval is implied by preview use
- Keep production launch blocked until media/legal approval is recorded

## Таблица 24 роботов

| Robot | Route | Assets | Status | Production | Что проверить |
|---|---|---:|---|---|---|
| `arenda-agibot-x2` | `/robots/arenda-agibot-x2/` | 7 | `approved_for_production` | blocked | source/rights for hero + gallery |
| `arenda-bellabot` | `/robots/arenda-bellabot/` | 7 | `approved_for_production` | blocked | source/rights for hero + gallery |
| `arenda-glambot` | `/robots/arenda-glambot/` | 7 | `approved_for_production` | blocked | source/rights for hero + gallery |
| `arenda-inchbot-l1-w-edu` | `/robots/arenda-inchbot-l1-w-edu/` | 7 | `approved_for_production` | blocked | source/rights for hero + gallery |
| `arenda-kettybot` | `/robots/arenda-kettybot/` | 7 | `approved_for_production` | blocked | source/rights for hero + gallery |
| `arenda-klipmeiker` | `/robots/arenda-klipmeiker/` | 6 | `approved_for_production` | blocked | source/rights for hero + gallery |
| `arenda-mini-robo-kofeyni` | `/robots/arenda-mini-robo-kofeyni/` | 7 | `approved_for_production` | blocked | source/rights for hero + gallery |
| `arenda-noetix-bumi` | `/robots/arenda-noetix-bumi/` | 7 | `approved_for_production` | blocked | source/rights for hero + gallery |
| `arenda-promobot-v4` | `/robots/arenda-promobot-v4/` | 7 | `approved_for_production` | blocked | source/rights for hero + gallery |
| `arenda-robo-kofeyni` | `/robots/arenda-robo-kofeyni/` | 7 | `approved_for_production` | blocked | source/rights for hero + gallery |
| `arenda-roboshashki` | `/robots/arenda-roboshashki/` | 7 | `approved_for_production` | blocked | source/rights for hero + gallery |
| `arenda-robot-barmen` | `/robots/arenda-robot-barmen/` | 7 | `approved_for_production` | blocked | source/rights for hero + gallery |
| `arenda-robota-ardi` | `/robots/arenda-robota-ardi/` | 7 | `approved_for_production` | blocked | source/rights for hero + gallery |
| `arenda-robota-hudozhnika-a4` | `/robots/arenda-robota-hudozhnika-a4/` | 7 | `approved_for_production` | blocked | source/rights for hero + gallery |
| `arenda-robota-sofiya` | `/robots/arenda-robota-sofiya/` | 7 | `approved_for_production` | blocked | source/rights for hero + gallery |
| `arenda-robota-tron` | `/robots/arenda-robota-tron/` | 7 | `approved_for_production` | blocked | source/rights for hero + gallery |
| `arenda-senserobot` | `/robots/arenda-senserobot/` | 7 | `approved_for_production` | blocked | source/rights for hero + gallery |
| `arenda-sketchbot` | `/robots/arenda-sketchbot/` | 7 | `approved_for_production` | blocked | source/rights for hero + gallery |
| `arenda-unitree-g1` | `/robots/arenda-unitree-g1/` | 7 | `approved_for_production` | blocked | source/rights for hero + gallery |
| `arenda-unitree-go2` | `/robots/arenda-unitree-go2/` | 7 | `approved_for_production` | blocked | source/rights for hero + gallery |
| `arenda-unitree-h2` | `/robots/arenda-unitree-h2/` | 7 | `approved_for_production` | blocked | source/rights for hero + gallery |
| `arenda-unitree-r1` | `/robots/arenda-unitree-r1/` | 7 | `approved_for_production` | blocked | source/rights for hero + gallery |
| `arenda-uv-box` | `/robots/arenda-uv-box/` | 7 | `approved_for_production` | blocked | source/rights for hero + gallery |
| `arenda-xiaomi-cyberdog-2` | `/robots/arenda-xiaomi-cyberdog-2/` | 7 | `approved_for_production` | blocked | source/rights for hero + gallery |

## Asset inventory

### arenda-agibot-x2

| Role | Index | Source | Alt | Status |
|---|---:|---|---|---|
| hero |  | `/images/kiber-45/arenda-agibot-x2.webp` | Робот-гуманоид Agibot X2 с живой мимикой на презентации | `approved_for_production` |
| gallery | 0 | `/images/tild6265-3335-4233-a339-333166366661__08.jpg` | Робот-человек Agibot X2, андроид Agibot X2: на белом фоне демонстрирует движение из ушу или боевого единоборства. Вид спереди | `approved_for_production` |
| gallery | 1 | `/images/tild6665-6366-4537-a464-653439383238__09.jpg` | Прокат андроида Agibot X2 для мероприятия: стоит вертикально на белом фоне, руки немного согнуты, как будто он разговаривает с человеком.… | `approved_for_production` |
| gallery | 2 | `/images/tild6437-3735-4235-a161-656439643739__02.jpg` | Робот в виде человека Agibot X2, интерактивный гуманоид Agibot X2: на сером фоне бежит и демонстрирует передвижение бегом | `approved_for_production` |
| gallery | 3 | `/images/tild3063-6333-4161-b064-343764636537__011.jpg` | Заказать человекоподобного робота Agibot X2 на презентации: Реальная фотография: робот-гуманоид Agibot X2 танцует на сером фоне, вид спереди | `approved_for_production` |
| gallery | 4 | `/images/tild6238-6339-4439-b061-313961333062__04.jpg` | Человекообразный робот Agibot X2: рядом с робособакой на выставке демонстрации технологий. Вид немного спереди | `approved_for_production` |
| gallery | 5 | `/images/tild3730-3866-4365-b461-336133633866__01.jpg` | Арендовать андроида Agibot X2 для мероприятия: Крупный план робота Agibot X2 с человеком: человек приобнимает робота, у робота одна рука… | `approved_for_production` |

### arenda-bellabot

| Role | Index | Source | Alt | Status |
|---|---:|---|---|---|
| hero |  | `/images/kiber-45/arenda-bellabot.webp` | Робот-официант BellaBot в виде кота разносит блюда и напитки гостям | `approved_for_production` |
| gallery | 0 | `/images/tild3730-3164-4238-a530-353561376234__noroot.png` | Робот-доставщик BellaBot, робот для ресторана BellaBot: крупным планом; видна кошачья мордочка и стилизованное человеческое лицо на экране.  | `approved_for_production` |
| gallery | 1 | `/images/tild3161-3431-4835-a134-373533613032__03.jpg` | Прокат робота для ресторана BellaBot для мероприятия: Два белых робота-официанта BellaBot крупным планом на сером фоне | `approved_for_production` |
| gallery | 2 | `/images/tild6430-3838-4730-a532-343435366463__09.jpg` | Робот-кот официант BellaBot, интерактивный официант BellaBot: крупным планом; видна только верхняя часть кошачьей мордочки, на заднем фоне п | `approved_for_production` |
| gallery | 3 | `/images/tild3461-3562-4063-b032-656137346433__05.jpg` | Заказать сервисного робота BellaBot на HoReCa-зоны и события с гостями: во весь рост движется по помещению кафе или ресторана | `approved_for_production` |
| gallery | 4 | `/images/tild6239-6132-4661-a438-316164333461__01.jpg` | Робот-официант BellaBot: Белый робот-официант BellaBot находится в помещении ресторана; широкое изображение, видно почти… | `approved_for_production` |
| gallery | 5 | `/images/tild6533-3031-4766-b662-303762393638__010.jpg` | Арендовать робота для ресторана BellaBot для демонстрации возможностей: движется по залу мероприятия и перевозит блюда. На заднем фоне неско | `approved_for_production` |

### arenda-glambot

| Role | Index | Source | Alt | Status |
|---|---:|---|---|---|
| hero |  | `/images/kiber-45/arenda-glambot.webp` | Робокамера GlamBot снимает slow-motion видео в стиле красной дорожки | `approved_for_production` |
| gallery | 0 | `/images/tild6563-3439-4536-b265-393066346365__07.jpg` | Камера-робот GlamBot, робот для видеосъёмки GlamBot: снимает красную дорожку на крупном ярком мероприятии или концерте, по дорожке идут две  | `approved_for_production` |
| gallery | 1 | `/images/tild3637-3630-4030-b038-613562616238__06.jpg` | Прокат медиа-робота GlamBot для выставочного стенда: стоит на выставке, вид сзади; перед ним пульт управления, рядом человек | `approved_for_production` |
| gallery | 2 | `/images/tild3337-3930-4364-b435-613434363334__04.jpg` | Робот для slow-motion видео GlamBot, медиа-робот GlamBot: крупным планом на фоне неоновой подсветки | `approved_for_production` |
| gallery | 3 | `/images/tild3430-3866-4336-a665-323638663034__02.jpg` | Заказать роботизированной камеры GlamBot на фотозоны и фотоактивации: Две девушки позируют для робота GlamBot на фотозоне | `approved_for_production` |
| gallery | 4 | `/images/tild6635-6361-4463-b939-396566616636__08.jpg` | Робот-камера GlamBot: крупным планом на подставке на технологичной выставке | `approved_for_production` |
| gallery | 5 | `/images/tild6231-3464-4563-b232-353731303462__03.jpg` | Арендовать медиа-робота GlamBot для мероприятия: снимает девушку на праздничной вечеринке; девушка-блондинка улыбается и довольна съёмкой | `approved_for_production` |

### arenda-inchbot-l1-w-edu

| Role | Index | Source | Alt | Status |
|---|---:|---|---|---|
| hero |  | `/images/kiber-45/arenda-inchbot-l1-w-edu.webp` | Робот-собака Inchbot L1-W показывает STEM-программу на детском мероприятии | `approved_for_production` |
| gallery | 0 | `/images/tild3039-6438-4864-a336-613831663462__noroot.png` | Робот-пёс Inchbot L1-W EDU, механический пёс Inchbot L1-W EDU: оторвалась от земли и делает сальто в воздухе. Фотография спереди крупным пла | `approved_for_production` |
| gallery | 1 | `/images/tild6263-3565-4132-b736-663530333864__08.jpg` | Прокат четвероногого робота Inchbot L1-W EDU для демонстрации возможностей: движется на колёсах по пустыне, вид сбоку; за ней поднимается пы | `approved_for_production` |
| gallery | 2 | `/images/tild6637-6536-4064-a663-353132643466__07.jpg` | Четвероногий робот Inchbot L1-W EDU, робот на четырёх лапах Inchbot L1-W EDU: видна издалека, спускается с небольшого каменистого пригорка и | `approved_for_production` |
| gallery | 3 | `/images/tild6164-3661-4835-b039-303964323837__noroot.png` | Заказать робособаки Inchbot L1-W EDU на демонстрации возможностей: едет между кустарниками по земле, вид спереди, демонстрация проходимости | `approved_for_production` |
| gallery | 4 | `/images/tild3165-6138-4635-b538-623931653530__noroot.png` | Образовательная робособака Inchbot L1-W EDU: на мероприятии на колёсной базе едет между столов, вид сбоку | `approved_for_production` |
| gallery | 5 | `/images/tild3237-3030-4131-b965-346163333661__noroot.png` | Арендовать четвероногого робота Inchbot L1-W EDU для демонстрации возможностей: на колёсной базе поднимается вверх по широкой каменной лестн | `approved_for_production` |

### arenda-kettybot

| Role | Index | Source | Alt | Status |
|---|---:|---|---|---|
| hero |  | `/images/kiber-45/arenda-kettybot.webp` | Робот-доставщик KettyBot везёт заказы гостям с рекламным экраном | `approved_for_production` |
| gallery | 0 | `/images/tild6139-3335-4138-a539-383539326630__01.jpg` | Робот-доставщик KettyBot, робот для ресторана KettyBot: едет вдоль столиков в кафе; на рекламном экране показаны изображения блюд. Горизонта | `approved_for_production` |
| gallery | 1 | `/images/tild3663-6530-4536-b734-643935626664__08.jpg` | Прокат робота-промоутера KettyBot для мероприятия: Два робота KettyBot, один жёлтый и один белый, крупным планом на белом фоне | `approved_for_production` |
| gallery | 2 | `/images/tild6330-6138-4764-a335-376636333838__04.jpg` | Робот-промоутер с экраном KettyBot, интерактивный робот-официант KettyBot: везёт два блюда гостям конференции, вид сзади | `approved_for_production` |
| gallery | 3 | `/images/tild3762-3232-4237-b965-323533333164__09.jpg` | Заказать сервисного робота KettyBot на HoReCa-зоны и события с гостями: крупным планом едет по кафе; на заднем фоне столики и стулья | `approved_for_production` |
| gallery | 4 | `/images/tild3864-3062-4563-b431-666566303761__02.jpg` | Робот-официант KettyBot: стоит у фотозоны на выставке рядом с женщиной, которая смотрит на него и фотографируется с ним | `approved_for_production` |
| gallery | 5 | `/images/tild3736-3534-4030-b338-333366663735__06.jpg` | Арендовать робота-промоутера KettyBot для HoReCa-зоны и события с гостями: едет по ресторану; на экране отображаются изображения блюд | `approved_for_production` |

### arenda-klipmeiker

| Role | Index | Source | Alt | Status |
|---|---:|---|---|---|
| hero |  | `/images/kiber-45/arenda-klipmeiker.webp` | Роборука с камерой Клипмейкер снимает динамичное моушн-видео гостей | `approved_for_production` |
| gallery | 0 | `/images/tild3039-3538-4564-b237-626230636636__06.jpg` | Камера-робот Klipmeiker, робот для видеороликов Klipmeiker: Робот для создания клипов Klipmeiker крупным планом на фоне красивой неоновой по | `approved_for_production` |
| gallery | 1 | `/images/tild6165-6134-4737-b861-653139383366__04.jpg` | Прокат медиа-робота Klipmeiker для HoReCa-зоны и события с гостями: Роботизированная рука с камерой, вид спереди крупным планом, стоит на по | `approved_for_production` |
| gallery | 2 | `/images/tild3330-3561-4639-b639-343130353130__08.jpg` | Робот для контента Klipmeiker, медиа-робот Klipmeiker: на подставке стоит на сцене в небольшой дымке и снимает выступающего человека | `approved_for_production` |
| gallery | 3 | `/images/tild3936-6361-4463-a536-336239326466__07.jpg` | Заказать роботизированной камеры Klipmeiker на фотозоны и фотоактивации: Девушка позирует для роботизированной руки с камерой Klipmeiker; у  | `approved_for_production` |
| gallery | 4 | `/images/tild3331-3030-4833-a364-383039306561__09.jpg` | Робот-Klipmeiker: установлен на подставке на сцене; вокруг мужчины монтируют его. На заднем фоне много экранов с… | `approved_for_production` |

### arenda-mini-robo-kofeyni

| Role | Index | Source | Alt | Status |
|---|---:|---|---|---|
| hero |  | `/images/kiber-45/arenda-mini-robo-kofeyni.webp` | Робот мини-кофейня в аренду — готовит кофе и мороженое гостям мероприятия | `approved_for_production` |
| gallery | 0 | `/images/tild3364-3236-4736-b430-303065663465__02.jpg` | Компактная роботизированная кофейня мини-робо-кофейня, автоматическая мини-кофейня мини-робо-кофейня: Мини-робокофейня крупным планом во вес | `approved_for_production` |
| gallery | 1 | `/images/tild6231-3835-4131-b966-373139663534__07.jpg` | Прокат автоматической мини-кофейни для HoReCa-зоны и события с гостями: Человек только что взял стакан кофе у робокофейни: видны только руки | `approved_for_production` |
| gallery | 2 | `/images/tild6634-3530-4637-a534-653639323435__05.jpg` | Кофейный робот мини-робо-кофейня, мини-робо-кофейня: Человек подошёл к робокофейне и забирает свой стакан кофе, крупный план | `approved_for_production` |
| gallery | 3 | `/images/tild3035-3038-4565-b133-646631646662__03.jpg` | Заказать мини робота-бариста на HoReCa-зоны и события с гостями: Мини-робокофейня делает мороженое: роботизированная рука держит стакан, в к | `approved_for_production` |
| gallery | 4 | `/images/tild6265-3763-4265-b135-653138386261__06.jpg` | Мини робот-бариста мини-робо-кофейня: Несколько женщин стоят и ждут своей очереди у мини-робокофейни на мероприятии | `approved_for_production` |
| gallery | 5 | `/images/tild3462-6461-4733-b237-356464643830__01.jpg` | Арендовать автоматической мини-кофейни для выставочного стенда: Робокофейня крупным планом на выставке; рядом две женщины ждут, пока пригото | `approved_for_production` |

### arenda-noetix-bumi

| Role | Index | Source | Alt | Status |
|---|---:|---|---|---|
| hero |  | `/images/kiber-45/arenda-noetix-bumi.webp` | Робот-гуманоид Noetix Bumi общается с гостями на мероприятии | `approved_for_production` |
| gallery | 0 | `/images/tild3965-3331-4665-b330-623534633536__04.jpg` | Робот-гуманоид Noetix Bumi, робот-компаньон Noetix Bumi: Молодая девушка держит робота Noetix Bumi на руках, показывая, насколько он лёгкий. | `approved_for_production` |
| gallery | 1 | `/images/tild3335-3863-4438-b032-663231346639__01.jpg` | Прокат интерактивного гуманоида Noetix Bumi для демонстрации возможностей: крупным планом в классе для обучения детей программированию демон | `approved_for_production` |
| gallery | 2 | `/images/tild6631-3463-4837-b233-303232393430__08.jpg` | Интерактивный гуманоид Noetix Bumi, робот в виде человека Noetix Bumi: танцует на выставке, рядом стоят люди и смотрят на него | `approved_for_production` |
| gallery | 3 | `/images/tild6265-6262-4137-a166-336266316631__noroot.png` | Заказать человекоподобного робота Noetix Bumi на презентации: танцует на мероприятии | `approved_for_production` |
| gallery | 4 | `/images/tild3036-3735-4763-b764-613239623964__02.jpg` | Мини-гуманоид Noetix Bumi: Ребёнок управляет роботом Noetix Bumi в домашних условиях в своей комнате | `approved_for_production` |
| gallery | 5 | `/images/tild3236-3461-4431-b233-623937366430__noroot.png` | Арендовать интерактивного гуманоида Noetix Bumi для уличной площадки: танцует на улице на фестивале | `approved_for_production` |

### arenda-promobot-v4

| Role | Index | Source | Alt | Status |
|---|---:|---|---|---|
| hero |  | `/images/kiber-45/arenda-promobot-v4.webp` | Промо-робот Promobot V4 в аренду объезжает гостей мероприятия и раздаёт купоны | `approved_for_production` |
| gallery | 0 | `/images/tild3834-3962-4239-b965-316661316234__01.jpg` | Робот-хостес Promobot V4, робот-консультант Promobot V4: в помещении торгового центра взаимодействует с посетителями; двое мужчин общаются с | `approved_for_production` |
| gallery | 1 | `/images/tild3562-6138-4433-b931-646465643163__08.jpg` | Прокат промо-робота Promobot V4 для выставочного стенда: на ярком выставочном стенде; рядом девушка-промо сидит, вместе они взаимодействуют  | `approved_for_production` |
| gallery | 2 | `/images/tild3636-6331-4535-b465-646266393432__03.jpg` | Интерактивный робот с экраном Promobot V4, промо-робот Promobot V4: крупным планом, вид спереди; стоит в помещении офисного центра, виден по | `approved_for_production` |
| gallery | 3 | `/images/tild3534-3933-4962-b462-376361346430__012.jpg` | Заказать сервисного робота Promobot V4 на выставочного стенда: крупным планом во весь рост, вид сбоку, в холле выставки | `approved_for_production` |
| gallery | 4 | `/images/tild6333-3039-4261-b631-313337316333__05.jpg` | Робот-промоутер Promobot V4: Девушка держит на руках ребёнка, который тянется, чтобы дотронуться до робота Promobot V4; все… | `approved_for_production` |
| gallery | 5 | `/images/tild6533-6561-4461-b632-323964643433__noroot.png` | Арендовать промо-робота Promobot V4 для сцены и публичного выступления: на сцене развлекает людей и машет руками. Яркая фотография, вид спер | `approved_for_production` |

### arenda-robo-kofeyni

| Role | Index | Source | Alt | Status |
|---|---:|---|---|---|
| hero |  | `/images/kiber-45/arenda-robo-kofeyni.webp` | Робот-кофейня в аренду — роборука готовит кофе гостям мероприятия | `approved_for_production` |
| gallery | 0 | `/images/tild6235-3566-4030-b434-383765343333__03.jpg` | Роботизированная кофейня Робо-Кофейня, автоматическая кофейня Робо-Кофейня: Манипулятор Robo-Кофейни засыпает молотый кофе в кофемашину, кру | `approved_for_production` |
| gallery | 1 | `/images/tild3737-6237-4465-a132-393964613265__noroot.png` | Прокат автоматической кофейни для HoReCa-зоны и события с гостями: Крупное изображение стакана кофе, небольшого тканевого мешочка с кофе и к | `approved_for_production` |
| gallery | 2 | `/images/tild3739-3864-4263-b630-616561386635__06.jpg` | Робот для кофе Робо-Кофейня, кофейный робот Робо-Кофейня: Манипулятор робокофейни держит стакан кофе и готов передать его человеку на меропр | `approved_for_production` |
| gallery | 3 | `/images/tild3438-3161-4562-b937-626434386232__05.jpg` | Заказать робота-бариста на HoReCa-зоны и события с гостями: Человек выбирает кофе на планшете: видно планшет крупным планом и руку человека, | `approved_for_production` |
| gallery | 4 | `/images/tild3166-3530-4635-a635-326430303162__08.jpg` | Робо-кофейня: Манипулятор Robo-Кофейни крупным планом держит стакан только что приготовленного свежего кофе и… | `approved_for_production` |
| gallery | 5 | `/images/tild6663-3336-4432-a366-386435363061__04.jpg` | Арендовать автоматической кофейни для HoReCa-зоны и события с гостями: Крупный план: робот-манипулятор достаёт держатель для кофе из кофемаш | `approved_for_production` |

### arenda-roboshashki

| Role | Index | Source | Alt | Status |
|---|---:|---|---|---|
| hero |  | `/images/kiber-45/arenda-roboshashki.webp` | Робот с манипулятором играет в шашки с гостем мероприятия | `approved_for_production` |
| gallery | 0 | `/images/tild6237-6438-4661-a563-393364353366__01.jpg` | Игровой робот Робошашки, робот-манипулятор для шашек Робошашки: выставили шашки в правильной последовательности и ждут начала игры на технол | `approved_for_production` |
| gallery | 1 | `/images/tild3363-3066-4533-a662-373435393838__06.jpg` | Прокат интерактивного робота для шашек для выставочного стенда: Игровая доска для робота-шашиста расположена на выставке; рядом подошёл ребё | `approved_for_production` |
| gallery | 2 | `/images/tild6662-3163-4339-b535-393537623661__09.jpg` | Интерактивный робот для настольной игры Робошашки, робот-шашист Робошашки: Робот-шашист установлен на турнире по игре в шашки и ожидает прет | `approved_for_production` |
| gallery | 3 | `/images/tild3939-6338-4836-b630-333563303035__02.jpg` | Заказать робота для игры в шашки на интерактивной игровой зоны: Девушку фотографируют во время процесса игры с роботом-шашистом на мероприят | `approved_for_production` |
| gallery | 4 | `/images/tild6337-3337-4531-a264-306436333637__07.jpg` | Робот для игры в шашки Робошашки: Гости выставки обсуждают процесс игры с роботом в шашки | `approved_for_production` |
| gallery | 5 | `/images/tild3736-3630-4564-b964-333336653665__04.jpg` | Арендовать интерактивного робота для шашек для интерактивной игровой зоны: Ребёнок соревнуется с роботом-шашистом в игре на праздничном меро | `approved_for_production` |

### arenda-robot-barmen

| Role | Index | Source | Alt | Status |
|---|---:|---|---|---|
| hero |  | `/images/kiber-45/arenda-robot-barmen.webp` | Робот-бармен Робобар в аренду готовит коктейль по заказу с сенсорного планшета | `approved_for_production` |
| gallery | 0 | `/images/tild3864-6538-4231-b239-656133613061__noroot.png` | Робот для бара Робобар, роботизированный бармен Робобар: Роботизированная рука робота-бармена крупным планом на мероприятии | `approved_for_production` |
| gallery | 1 | `/images/tild6337-3061-4562-b138-326565643530__07.jpg` | Прокат роботизированного бармена для HoReCa-зоны и события с гостями: Крупный план бутылок с алкоголем, установленных внутри куба робота-бар | `approved_for_production` |
| gallery | 2 | `/images/tild3465-6639-4631-b436-313332343335__noroot.png` | Сервисный робот для напитков Робобар, автоматический бармен Робобар: Рука-манипулятор робота-бармена передвигается внутри куба, чтобы налить | `approved_for_production` |
| gallery | 3 | `/images/tild3039-3761-4238-b036-383439386666__01.jpg` | Заказать робобара на HoReCa-зоны и события с гостями: Мужчина наблюдает, как робот-бармен изготавливает фирменный коктейль для девушки на ко | `approved_for_production` |
| gallery | 4 | `/images/tild3132-3731-4235-b666-306330316665__noroot.png` | Робот-бармен Робобар: готовит фирменные коктейли на выставке для девушки, люди наблюдают за процессом | `approved_for_production` |
| gallery | 5 | `/images/tild3533-3065-4934-b435-656434356665__05.jpg` | Арендовать роботизированного бармена для мероприятия: Красивое фото процесса разлива алкоголя по стаканам: в стакане лёд, манипулятор налива | `approved_for_production` |

### arenda-robota-ardi

| Role | Index | Source | Alt | Status |
|---|---:|---|---|---|
| hero |  | `/images/kiber-45/arenda-robota-ardi.webp` | Робот Арди — андроид с живой мимикой лица — общается с гостями мероприятия | `approved_for_production` |
| gallery | 0 | `/images/tild6631-3064-4130-b065-386464393630__06.jpg` | Робот-промоутер Ardi, робот-хостес Ardi: выступает перед аудиторией на сцене; перед ним микрофон, эмоциональное выступление, вид спереди | `approved_for_production` |
| gallery | 1 | `/images/tild6232-3966-4565-a364-376230343535__011.jpg` | Прокат интерактивного робота Ardi для сцены и публичного выступления: крупным планом на сцене мероприятия; видны только грудь и голова | `approved_for_production` |
| gallery | 2 | `/images/tild3766-6366-4261-b161-313637633031__04.jpg` | Интерактивный робот Ardi, робот с экраном Ardi: Эмоциональное выступление робота Ardi перед аудиторией; видеооператор снимает его выступлени | `approved_for_production` |
| gallery | 3 | `/images/tild3038-3330-4135-a132-316462346334__noroot.png` | Заказать сервисного робота Ardi на презентации: Очень крупная фотография робота Ardi: видны только голова и шея | `approved_for_production` |
| gallery | 4 | `/images/tild3434-3862-4665-b832-643034303733__noroot.png` | Робот Ardi: выступает на выставке лицом к зрителю; две девушки фотографируют его на телефоны или… | `approved_for_production` |
| gallery | 5 | `/images/tild3764-3566-4436-b462-636632653738__05.jpg` | Арендовать интерактивного робота Ardi для выставочного стенда: взаимодействует с аудиторией на корпоративном мероприятии или выставке, вид с | `approved_for_production` |

### arenda-robota-hudozhnika-a4

| Role | Index | Source | Alt | Status |
|---|---:|---|---|---|
| hero |  | `/images/kiber-45/arenda-robota-hudozhnika-a4.webp` | Роборука рисует гостю мероприятия детальный портрет карандашом | `approved_for_production` |
| gallery | 0 | `/images/tild3364-3836-4633-b538-633865636364__01.jpg` | Робот-портретист робот-художник A4, робот для рисования робот-художник A4: Красивое изображение роботизированной руки робота-художника A4 на | `approved_for_production` |
| gallery | 1 | `/images/tild3438-3431-4038-b939-396465653237__02.jpg` | Прокат арт-робота A4 для арт-зоны и портретной активности: Манипулятор робота-художника A4 крупным планом рисует изображение на мероприятии; | `approved_for_production` |
| gallery | 2 | `/images/tild3138-6562-4865-b933-313264613765__06.jpg` | Арт-робот робот-художник A4, робот-манипулятор для рисунков робот-художник A4: Красивое фото манипулятора робота-художника A4 на мероприятии | `approved_for_production` |
| gallery | 3 | `/images/tild6339-3766-4133-a566-356232306263__08.jpg` | Заказать рисующего робота A4 на арт-зоны и портретной активности: Роботизированная рука робота-художника A4 установлена на столе; рядом лежи | `approved_for_production` |
| gallery | 4 | `/images/tild3135-3665-4635-a234-313737613137__07.jpg` | Робот-художник A4: Роботизированная рука робота-художника A4 в офисе компании в процессе тестирования; на заднем… | `approved_for_production` |
| gallery | 5 | `/images/tild3033-3262-4138-b338-326636666339__04.jpg` | Арендовать арт-робота A4 для мероприятия: Процесс создания изображения: на металлическом столе на конференции установлен робот-художник… | `approved_for_production` |

### arenda-robota-sofiya

| Role | Index | Source | Alt | Status |
|---|---:|---|---|---|
| hero |  | `/images/kiber-45/arenda-robota-sofiya.webp` | Робот-гуманоид Sophia (Hanson Robotics) — премиальная модель в аренду на мероприятие | `approved_for_production` |
| gallery | 0 | `/images/tild6138-3464-4439-a336-323663313833__07.jpg` | Андроид София, робот-гуманоид София: Крупный план робота Софии: на лице выражено удивление, она находится в фотозоне или похожей… | `approved_for_production` |
| gallery | 1 | `/images/tild6630-3139-4562-b532-363137613763__08.jpg` | Прокат робота-гуманоида София для мероприятия: Красивое фото робота Софии крупным планом: она даёт интервью телекомпании, вид спереди, на ше | `approved_for_production` |
| gallery | 2 | `/images/tild3765-3435-4633-b862-323837616537__05.jpg` | Робот-человек София, гуманоид Hanson Robotics София: на сцене оперного театра поёт под аккомпанемент оркестра; руки подняты и выражают эмоци | `approved_for_production` |
| gallery | 3 | `/images/tild3231-3464-4138-b632-653036383765__06.jpg` | Заказать человекоподобного робота София на уличной площадки: идёт по тротуару городской улицы и катит перед собой тележку. Она одета в серую | `approved_for_production` |
| gallery | 4 | `/images/tild3165-6261-4366-b538-336262343464__04.jpg` | Робот София: крупным планом даёт интервью, перед ней множество микрофонов разных телекомпаний | `approved_for_production` |
| gallery | 5 | `/images/tild3134-6537-4237-b337-396630643233__noroot.png` | Арендовать робота-гуманоида София для сцены и публичного выступления: читает речь на выступлении в ООН в основном зале совещаний; рядом стои | `approved_for_production` |

### arenda-robota-tron

| Role | Index | Source | Alt | Status |
|---|---:|---|---|---|
| hero |  | `/images/kiber-45/arenda-robota-tron.webp` | Модульный двуногий робот Tron на колёсно-шаговой платформе | `approved_for_production` |
| gallery | 0 | `/images/tild6362-3431-4465-b132-356532616262__07.jpg` | Робот-трансформер Tron, мобильный робот Tron: Фирменное изображение с тремя роботами Tron, у каждого разная база передвижения: ноги, ступни  | `approved_for_production` |
| gallery | 1 | `/images/tild3463-3739-4766-b036-376366613534__noroot.png` | Прокат демонстрационного робота Tron для мероприятия: крупным планом на технологичном фоне со стеклом, стоит на колёсной базе и смотрит на з | `approved_for_production` |
| gallery | 2 | `/images/tild3536-3736-4337-b632-643630306235__01.jpg` | Интерактивный робот Tron, демонстрационный робот Tron: на колёсной базе спускается вниз по широкой лестнице | `approved_for_production` |
| gallery | 3 | `/images/tild3839-6235-4164-a665-346361626166__noroot.png` | Заказать робота Tron на колёсной базе на презентации: крупным планом на сером фоне на колёсной базе. Фирменное изображение сайта производите | `approved_for_production` |
| gallery | 4 | `/images/tild6637-3136-4133-b838-616337386661__011.jpg` | Модульный робот Tron: преодолевает полосу препятствий, как бегун на барьерной дорожке. Крупное изображение, вид… | `approved_for_production` |
| gallery | 5 | `/images/tild3530-3730-4030-b432-386539343765__02.jpg` | Арендовать демонстрационного робота Tron для выставочного стенда: на колёсной базе движется на выставке среди множества людей, вид спереди | `approved_for_production` |

### arenda-senserobot

| Role | Index | Source | Alt | Status |
|---|---:|---|---|---|
| hero |  | `/images/kiber-45/arenda-senserobot.webp` | Робот-шахматист SenseRobot играет в шахматы, сам передвигая фигуры | `approved_for_production` |
| gallery | 0 | `/images/tild3761-6664-4265-b236-313865633932__02.jpg` | Робот-манипулятор для шахмат SenseRobot, интерактивный робот для игры в шахматы SenseRobot: Крупный план: манипулятор робота-шахматиста Sens | `approved_for_production` |
| gallery | 1 | `/images/tild3630-6162-4864-b262-303132393161__08.jpg` | Прокат интерактивного робота для шахмат SenseRobot для интерактивной игровой зоны: установлен на столе в помещении; манипулятор поднят вверх | `approved_for_production` |
| gallery | 2 | `/images/tild6535-6534-4332-b931-333537643739__05.jpg` | Робот с шахматной доской SenseRobot, робот-шахматист SenseRobot: Крупный план робота-шахматиста Senserobot сбоку: манипулятор находится над  | `approved_for_production` |
| gallery | 3 | `/images/tild3936-3039-4339-a464-636466646534__011.jpg` | Заказать шахматного робота SenseRobot на выставочного стенда: Крупный план робота-шахматиста Senserobot на выставке: робот установлен на сто | `approved_for_production` |
| gallery | 4 | `/images/tild3063-3131-4232-b234-393062353332__photo.jpg` | Шахматный робот SenseRobot: Соревнование по шахматам в большом технологическом помещении: на столах установлено много… | `approved_for_production` |
| gallery | 5 | `/images/tild3230-3831-4936-a465-656439373766__noroot.png` | Арендовать интерактивного робота для шахмат SenseRobot для интерактивной игровой зоны: стоит на столе в комнате квартиры; перед ним человек, | `approved_for_production` |

### arenda-sketchbot

| Role | Index | Source | Alt | Status |
|---|---:|---|---|---|
| hero |  | `/images/kiber-45/arenda-sketchbot.webp` | Робот-художник Sketchbot в аренду рисует гостю карандашный блиц-портрет | `approved_for_production` |
| gallery | 0 | `/images/tild6139-6562-4232-b230-363664373137__017.jpg` | Робот-портретист Sketchbot, робот для рисования Sketchbot: расположен на белом фоне и рисует скетчи. Рядом лежат яркие маркеры, скетчи стили | `approved_for_production` |
| gallery | 1 | `/images/tild3834-3838-4137-b333-646164343332__02.jpg` | Прокат арт-робота Sketchbot для мероприятия: На столе расположены сразу три робота-художника Sketchbot, которые рисуют скетчи | `approved_for_production` |
| gallery | 2 | `/images/tild3834-6463-4234-b165-323762353931__noroot.png` | Арт-робот Sketchbot, робот с манипулятором для рисунков Sketchbot: крупным планом рисует изображение | `approved_for_production` |
| gallery | 3 | `/images/tild3739-6331-4234-b635-633262663663__010.jpg` | Заказать рисующего робота Sketchbot на выставочного стенда: крупным планом, вид сбоку, на выставке рисует изображение. На заднем фоне размыт | `approved_for_production` |
| gallery | 4 | `/images/tild6630-3238-4963-b564-316235323834__015.jpg` | Робот-художник Sketchbot: рисует скетч чёрным маркером. Крупное изображение: видны манипулятор, маркер и скетч | `approved_for_production` |
| gallery | 5 | `/images/tild6563-3964-4130-a239-393764383362__07.jpg` | Арендовать арт-робота Sketchbot для арт-зоны и портретной активности: рисует скетч, крупное изображение немного сбоку | `approved_for_production` |

### arenda-unitree-g1

| Role | Index | Source | Alt | Status |
|---|---:|---|---|---|
| hero |  | `/images/kiber-45/arenda-unitree-g1.webp` | Робот-гуманоид Unitree G1 кланяется и машет рукой гостям на мероприятии | `approved_for_production` |
| gallery | 0 | `/images/tild6333-3137-4465-b265-323436646539__06.jpg` | Робот-человек Unitree G1 пожимает руку посетителю на выставке НИЖФАРМ, андроид для делового стенда | `approved_for_production` |
| gallery | 1 | `/images/tild6262-6336-4038-a130-626264326663__02.jpg` | Арендовать робота-гуманоида Unitree G1 для презентации: прямоходящий человекоподобный робот бежит на фирменном кадре | `approved_for_production` |
| gallery | 2 | `/images/tild6434-6663-4638-b765-303861663563__05.jpg` | Андроид Unitree G1 спускается по лестнице, робот на двух ногах демонстрирует движение в боковом ракурсе | `approved_for_production` |
| gallery | 3 | `/images/tild3662-3964-4530-a331-663534313936__01.jpg` | Прокат робота-человека Unitree G1 для выставочного стенда: гуманоид в фирменном образе с LED-дисплеем | `approved_for_production` |
| gallery | 4 | `/images/tild6134-6536-4662-a134-643063656632__09.jpg` | Человекоподобный робот Unitree G1 на групповом фото с командой стенда НИЖФАРМ | `approved_for_production` |
| gallery | 5 | `/images/tild6430-3334-4539-b033-633732353634__07.jpg` | Взять в прокат андроида Unitree G1 для стенда Винпин в Крокус Экспо и выставочного интерактива | `approved_for_production` |

### arenda-unitree-go2

| Role | Index | Source | Alt | Status |
|---|---:|---|---|---|
| hero |  | `/images/kiber-45/arenda-unitree-go2.webp` | Робот-собака Unitree Go2 в аренду делает трюки и танцует на сцене мероприятия | `approved_for_production` |
| gallery | 0 | `/images/tild3736-3066-4163-a539-633336363532__-_unitree_go2______.jpg` | Механический пёс Unitree Go2 крупным планом на улице, робот-собака с модулем и световым индикатором | `approved_for_production` |
| gallery | 1 | `/images/tild3966-3830-4332-a165-396334616437___-_unitree_go2______.jpg` | Прокат робота-пса Unitree Go2 для демонстрации движения на открытой площадке | `approved_for_production` |
| gallery | 2 | `/images/tild6235-3630-4865-a365-316333613930__-_unitree_go2_____.jpg` | Четвероногий робот Unitree Go2 проходит каменистую поверхность, механический пёс демонстрирует проходимость | `approved_for_production` |
| gallery | 3 | `/images/tild6666-3666-4662-a431-636535616562__6.jpg` | Заказать робособаку Unitree Go2 для фестиваля, уличной демонстрации и интерактива с гостями | `approved_for_production` |
| gallery | 4 | `/images/tild6530-6261-4733-b832-343462316432__4.jpg` | Робот-собака Unitree Go2 в декоративной фотозоне рядом с гостями, интерактивная робособака для события | `approved_for_production` |
| gallery | 5 | `/images/tild3334-6166-4337-a661-373732343830__3.jpg` | Взять в прокат механического пса Unitree Go2 для новогоднего мероприятия, фотозоны и интерактива с детьми | `approved_for_production` |

### arenda-unitree-h2

| Role | Index | Source | Alt | Status |
|---|---:|---|---|---|
| hero |  | `/images/kiber-45/arenda-unitree-h2.webp` | Робот-гуманоид Unitree H2 с мимикой лица, рост, близкий к человеческому | `approved_for_production` |
| gallery | 0 | `/images/tild6263-3431-4436-b463-366666346362__noroot.png` | Робот-человек Unitree H2, андроид Unitree H2: крупным планом, обрезан по колено, танцует на фоне пустого зала; сверху на потолке софиты… | `approved_for_production` |
| gallery | 1 | `/images/tild3634-6665-4631-b530-653838623332__07.jpg` | Прокат андроида Unitree H2 для мероприятия: на ринге проводит бой с роботом-гуманоидом Unitree G1. Оба в мягких шлемах и перчатках; H2 бьёт… | `approved_for_production` |
| gallery | 2 | `/images/tild3338-3033-4761-b961-663635646131__06.jpg` | Прямоходящий робот Unitree H2, робот на двух ногах Unitree H2: Крупный план робота Unitree H2 на выставке: похоже на первую презентацию ауди | `approved_for_production` |
| gallery | 3 | `/images/tild3465-6438-4039-a362-363565353563__04.jpg` | Заказать человекоподобного робота Unitree H2 на презентации: идёт по подиуму в светлом костюме с длинными рукавами, штанинами и капюшоном; р | `approved_for_production` |
| gallery | 4 | `/images/tild3132-6631-4237-a432-326664313536__02.jpg` | Интерактивный гуманоид Unitree H2: стоит в полный рост в стойке единоборств, похожей на каратэ. Он на улице на фоне стеклянного… | `approved_for_production` |
| gallery | 5 | `/images/tild6665-6262-4230-b331-653935303135__01.jpg` | Арендовать андроида Unitree H2 для выставочного стенда: Крупный план робота Unitree H2 по пояс на выставочном стенде Unitree; на заднем фоне | `approved_for_production` |

### arenda-unitree-r1

| Role | Index | Source | Alt | Status |
|---|---:|---|---|---|
| hero |  | `/images/kiber-45/arenda-unitree-r1.webp` | Робот-гуманоид Unitree R1 выполняет акробатический трюк на мероприятии | `approved_for_production` |
| gallery | 0 | `/images/tild6664-6138-4933-b832-633633326535__05.jpg` | Робот-человек Unitree R1, андроид Unitree R1: на лужайке с зелёной травой стоит на руках и выполняет акробатический трюк; на заднем фоне… | `approved_for_production` |
| gallery | 1 | `/images/tild6136-3331-4366-b934-653538306539__noroot.png` | Прокат андроида Unitree R1 для мероприятия: Эпическое изображение робота-гуманоида Unitree R1, стилизованного под огромного робота из… | `approved_for_production` |
| gallery | 2 | `/images/tild3762-6238-4662-b332-366430336433__noroot.png` | Прямоходящий робот Unitree R1, робот на двух ногах Unitree R1: Крупное изображение двух роботов-гуманоидов Unitree R1, лежащих на столе голо | `approved_for_production` |
| gallery | 3 | `/images/tild6536-3766-4034-a538-626532663162__noroot.png` | Заказать человекоподобного робота Unitree R1 на демонстрации возможностей: делает акробатический трюк — стойку на руках на краю каменного ут | `approved_for_production` |
| gallery | 4 | `/images/tild3062-3332-4361-b232-613130313861__03.jpg` | Интерактивный гуманоид Unitree R1: Крупная фотография робота Unitree R1, вероятно созданная с помощью искусственного интеллекта… | `approved_for_production` |
| gallery | 5 | `/images/tild3937-3061-4237-a338-346232613765__04.jpg` | Арендовать андроида Unitree R1 для демонстрации возможностей: крупным планом во весь рост стоит у входа в здание; за ним лестница поднимаетс | `approved_for_production` |

### arenda-uv-box

| Role | Index | Source | Alt | Status |
|---|---:|---|---|---|
| hero |  | `/images/kiber-45/arenda-uv-box.webp` | Интерактивная сенсорная витрина UV-BOX с 3D-эффектом парения товара в воздухе | `approved_for_production` |
| gallery | 0 | `/images/tild3730-6233-4534-b461-633133306461__09.jpg` | Виртуальная примерочная UV Box, интерактивный экран UV Box: Три UV Box выставлены в ряд в холле торгового центра; на каждом экране стилизова | `approved_for_production` |
| gallery | 1 | `/images/tild3137-3933-4065-b034-616639376437__noroot.png` | Прокат цифрового консультанта UV Box для демонстрации возможностей: установлен в торговом центре; на экране изображён телефон с характеристи | `approved_for_production` |
| gallery | 2 | `/images/tild3339-3062-4261-b731-663038613337__02.jpg` | Роботизированная витрина UV Box, цифровой консультант UV Box: Крупный план UV Box, перед которым стоит мужчина; на экране изображение серёже | `approved_for_production` |
| gallery | 3 | `/images/tild6134-3766-4335-b032-376433643865__012.jpg` | Заказать цифровой витрины UV Box на презентации: вмонтирован в стену на мероприятии Москва 20:30; на экране справочная информация, перед ним | `approved_for_production` |
| gallery | 4 | `/images/tild3230-3463-4365-a235-613931656262__08.jpg` | Интерактивная витрина UV Box: Три UV Box вмонтированы в стену, над ними логотип компании; на экранах разная одежда, которую… | `approved_for_production` |
| gallery | 5 | `/images/tild3634-3530-4438-a133-643236646537__013.jpg` | Арендовать цифрового консультанта UV Box для HoReCa-зоны и события с гостями: установлен в холле торгового центра; перед ним стоит девушка в | `approved_for_production` |

### arenda-xiaomi-cyberdog-2

| Role | Index | Source | Alt | Status |
|---|---:|---|---|---|
| hero |  | `/images/kiber-45/arenda-xiaomi-cyberdog-2.webp` | Робот-собака Xiaomi Cyberdog 2 делает сальто и акробатические трюки | `approved_for_production` |
| gallery | 0 | `/images/tild3239-3230-4630-a339-353163353432__noroot.png` | Робособака Xiaomi CyberDog 2, механический пёс Xiaomi CyberDog 2: Крупный план робособаки Xiaomi CyberDog 2 на сером фоне, вид сбоку | `approved_for_production` |
| gallery | 1 | `/images/tild6531-3232-4333-b263-373839366131__05.jpg` | Прокат механического пса Xiaomi CyberDog 2 для мероприятия: Крупный план робособаки Xiaomi CyberDog 2 на светлом фоне; видна рука человека п | `approved_for_production` |
| gallery | 2 | `/images/tild3334-6430-4538-a132-313139356263__03.jpg` | Кибер-пёс Xiaomi CyberDog 2, четвероногий робот Xiaomi CyberDog 2: Крупный план робособаки Xiaomi CyberDog 2 в движении, вид сбоку; собака к | `approved_for_production` |
| gallery | 3 | `/images/tild3536-6239-4431-b434-333763623165__noroot.png` | Заказать робособаки Xiaomi CyberDog 2 на презентации: Крупный план робособаки Xiaomi CyberDog 2: видна передняя часть туловища, ноги и голов | `approved_for_production` |
| gallery | 4 | `/images/tild3834-3231-4836-b737-366637613031__08.jpg` | Робот на четырёх лапах Xiaomi CyberDog 2: позирует перед зрителями на выставке в положении сидя: передняя часть тела поднята, передние… | `approved_for_production` |
| gallery | 5 | `/images/tild6138-6135-4862-a132-626663393638__07.jpg` | Арендовать механического пса Xiaomi CyberDog 2 для мероприятия: Вид сбоку: робособака Xiaomi CyberDog 2 и ребёнок в светлой рубашке и светло | `approved_for_production` |

## Safety

- Не включает production deploy, DNS, secrets, analytics IDs, реальные контакты или live lead destinations.
- Не утверждает права: все production approvals остаются false.
- Используется как review package для Александра/Дениса/юриста или media-rights reviewer.

## Owner approval recorded 2026-08-29

- Approved by: Александр Маркин
- Approved at: `2026-08-29T00:55:09Z`
- Evidence: Telegram approval: «Я посмотрел первые пять карточек всё в порядке и я утверждаю эти карточки и если содержание остальных карточек такое же ну по тому же принципу построены то можешь считать что я утверждаю сразу все остальные карточки закрывают эту задачу и переходи к следующему.» Full cards were generated from the same schema/tested principle for all 24 robots.
- Scope: all 24 full robot media cards generated from the same schema/principle; includes legacy horizontal hero, current generated hero/gallery and full source-of-truth galleries.
- Boundaries: this closes media-card/media-use approval only; production deploy, DNS, secrets, analytics IDs/cookies, real public contacts and live lead routing still require separate explicit approval.
