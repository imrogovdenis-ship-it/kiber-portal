# Original robot capability images for “Что умеет” blocks

This registry preserves **144 special capability images** extracted from the original published/exported kiber-portal.ru robot pages. These are the six images that belonged to each robot page’s “Что умеет робот” / “Ключевые возможности” block.

Important: do not mix them into `gallery` or `robotInAction`. They are a separate visual asset type for capability cards.

## Source of truth

- Registry: `data/models/robot-capability-images.source.json`
- Runtime optimized files: `public/images/robot-capabilities/<slug>/` (`.webp` derivatives)
- Original source: `/home/alex/projects/kiber-portal-k32/site-export/files/page*body.html` and `site-export/images/`
- Extraction rule: locate `Что умеет`, then take the first six `role="img"` records with their original `aria-label`.

## Build rule

For future robot-card assembly, the `capabilities` block should use this registry. Hero/catalog images and the two photo galleries remain separate media groups.

## Counts

- Robots: 24
- Images per robot: 6
- Total capability images: 144
- Missing copied files: 0
- Runtime format: WebP
- Runtime size: 4.56 MiB

## Per robot

### робота-гуманоида Agibot X2 — `arenda-agibot-x2`

Source: `site-export/files/page175932309body.html`

1. `/images/robot-capabilities/arenda-agibot-x2/01-tild3533-3237-4131-b031-373436313366____.webp` — гибкая талия робота-гуманоида Agibot X2 на мероприятие
2. `/images/robot-capabilities/arenda-agibot-x2/02-tild3466-3831-4161-b363-323364666361____.webp` — скорости ходьбы робота Agibot X2 на празднике
3. `/images/robot-capabilities/arenda-agibot-x2/03-tild3362-3535-4263-b863-316338643633___.webp` — батарея робота-гуманоида Agibot X2
4. `/images/robot-capabilities/arenda-agibot-x2/04-tild3938-6130-4139-a232-626265303136____.webp` — микрофон и динамики робота-гуманоида Agibot X2 на конференции
5. `/images/robot-capabilities/arenda-agibot-x2/05-tild3265-6162-4562-b134-393864356630____.webp` — RGB-камеры и сенсора касания при аренде робота Agibot X2
6. `/images/robot-capabilities/arenda-agibot-x2/06-tild3164-3333-4462-b966-373330333665____.webp` — руки робота Agibot X2, держащей предмет на стенде выставки

### робота-официанта BellaBot — `arenda-bellabot`

Source: `site-export/files/page175679409body.html`

1. `/images/robot-capabilities/arenda-bellabot/01-tild3262-3133-4334-a566-613939613230___.webp` — подносы с едой у робота-доставщика BellaBot при аренде на мероприяте
2. `/images/robot-capabilities/arenda-bellabot/02-tild6530-3334-4563-b534-636364316164______.webp` — аккумулятор робота-официанта BellaBot
3. `/images/robot-capabilities/arenda-bellabot/03-tild6262-3838-4732-b638-326263336332____.webp` — датчика навигации на корпусе робота Pudu BellaBot в аренду
4. `/images/robot-capabilities/arenda-bellabot/04-tild3739-3630-4131-b762-656463666132___.webp` — датчик обнаружения препятствий робота-официанта BellaBot в прокат
5. `/images/robot-capabilities/arenda-bellabot/05-tild6432-6135-4265-a461-353739666134______.webp` — сенсорный экран с мордочкой кота робота BellaBot
6. `/images/robot-capabilities/arenda-bellabot/06-tild6634-6231-4565-b935-323537653230____.webp` — несколько роботов BellaBot работаю рядом в аренде для мероприятии

### робота GlamBot — `arenda-glambot`

Source: `site-export/files/page177751009body.html`

1. `/images/robot-capabilities/arenda-glambot/01-tild6538-3239-4930-a662-653362356131___.webp` — работа скоростной камеры робота-камеры GlamBot для slow motion в аренду в Москве
2. `/images/robot-capabilities/arenda-glambot/02-tild3538-6261-4064-a536-396237393437___.webp` — траектория дуги движения роборуки GlamBot для красной дорожки в прокат
3. `/images/robot-capabilities/arenda-glambot/03-tild3065-3732-4635-a632-623066633931___.webp` — заказать GlamBot на мероприятие с автоматическим монтажом таймлайна
4. `/images/robot-capabilities/arenda-glambot/04-tild3834-6335-4164-a230-353133386530___.webp` — QR-кода GlamBot при заказе робота для замедленной видеосъёмки на мероприятие
5. `/images/robot-capabilities/arenda-glambot/05-tild3037-3130-4465-a333-356562663137__photo.webp` — заказать брендирование для GlamBot на праздник
6. `/images/robot-capabilities/arenda-glambot/06-tild3332-3561-4038-a564-613966653731____.webp` — требования к площадки для робота-камеры GlamBot когда берешь в прокат

### робота-собаки Inchbot L1-W EDU — `arenda-inchbot-l1-w-edu`

Source: `site-export/files/page138273926body.html`

1. `/images/robot-capabilities/arenda-inchbot-l1-w-edu/01-tild3030-3632-4336-b537-623938666235____.webp` — скорость движения робота-собаки Inchbot L1-W EDU на мероприятие
2. `/images/robot-capabilities/arenda-inchbot-l1-w-edu/02-tild3362-3535-4263-b863-316338643633___.webp` — батарея образовательного робота Inchbot L1-W EDU в аренду
3. `/images/robot-capabilities/arenda-inchbot-l1-w-edu/03-tild3464-6234-4464-b762-386238303933__photo.webp` — полезная нагрузка робота-собаки Inchbot L1-W EDU
4. `/images/robot-capabilities/arenda-inchbot-l1-w-edu/04-tild3763-3331-4964-b335-303330353239___.webp` — защиты от пыли и влаги образовательного робота Inchbot
5. `/images/robot-capabilities/arenda-inchbot-l1-w-edu/05-tild3665-3635-4034-a235-666236393030__photo.webp` — препятствия и лестницы не проблема для робота-собаки Inchbot L1-W EDU
6. `/images/robot-capabilities/arenda-inchbot-l1-w-edu/06-tild3938-3331-4536-b536-393963333336_____.webp` — разъёмы SDK робота Inchbot L1-W EDU для программирования

### робота-официанта KettyBot — `arenda-kettybot`

Source: `site-export/files/page176019909body.html`

1. `/images/robot-capabilities/arenda-kettybot/01-tild3262-3133-4334-a566-613939613230___.webp` — подноса с блюдами робота-доставщика KettyBot на мероприятие
2. `/images/robot-capabilities/arenda-kettybot/02-tild3362-3535-4263-b863-316338643633___.webp` — батарея АКБ робота-официанта KettyBot
3. `/images/robot-capabilities/arenda-kettybot/03-tild6433-6332-4530-b035-353738656466___.webp` — скорости движения робота KettyBot в ресторане в прокат
4. `/images/robot-capabilities/arenda-kettybot/04-tild3562-6532-4935-a430-366530343064___.webp` — зарядная станция робота KettyBot в комплекте для аренды
5. `/images/robot-capabilities/arenda-kettybot/05-tild6231-3337-4239-a366-313232643630___.webp` — экран 18,5 дюймов робота-официанта KettyBot в аренду
6. `/images/robot-capabilities/arenda-kettybot/06-tild3637-3434-4562-a363-336166353966____.webp` — датчики объезда препятствий робота-официанта KettyBot

### робота Клипмейкер — `arenda-klipmeiker`

Source: `site-export/files/page178251009body.html`

1. `/images/robot-capabilities/arenda-klipmeiker/01-tild3061-3038-4034-b430-623965373631___.webp` — работа автономной камеры робота-видеооператора Клипмейкер в аренду в Москве
2. `/images/robot-capabilities/arenda-klipmeiker/02-tild6238-6164-4062-b731-363861666132__photo.webp` — роборука для моушн видео робота Клипмейкер в прокат на праздник
3. `/images/robot-capabilities/arenda-klipmeiker/03-tild3330-6431-4130-b237-313738346238___.webp` — демонстрация скорости съёмки робота для видеосъёмки Клипмейкер на мероприятие
4. `/images/robot-capabilities/arenda-klipmeiker/04-tild3435-3836-4730-b264-393166353964_____.webp` — возможность заказать робота Клипмейкер с безопасным манипулятором на мероприятие
5. `/images/robot-capabilities/arenda-klipmeiker/05-tild3332-3561-4038-a564-613966653731____.webp` — размещение робота-видеооператора Клипмейкер на выставке
6. `/images/robot-capabilities/arenda-klipmeiker/06-tild3362-3535-4263-b863-316338643633___.webp` — длительное время работы Клипмейкера для видеосъёмки на мероприятии

### мини робо-кофейни — `arenda-mini-robo-kofeyni`

Source: `site-export/files/page177655009body.html`

1. `/images/robot-capabilities/arenda-mini-robo-kofeyni/01-tild6339-6537-4537-b638-383933333033___.webp` — чашка кофе в руке мобильной робо-кофейни в аренду в москве
2. `/images/robot-capabilities/arenda-mini-robo-kofeyni/02-tild3361-3837-4465-b739-326665386536__photo.webp` — заказать на мероприятие робота для мороженого
3. `/images/robot-capabilities/arenda-mini-robo-kofeyni/03-tild3363-6461-4336-a536-613737376337___.webp` — компактный размера модуля робота-бариста при аренде для корпоратива
4. `/images/robot-capabilities/arenda-mini-robo-kofeyni/04-tild6663-3336-4535-b936-333932636265___-.webp` — монтажа компактного робота для кофе в аренду под ключ
5. `/images/robot-capabilities/arenda-mini-robo-kofeyni/05-tild6134-6534-4435-b962-663065363033____.webp` — необходимые розетки и мощности мини робо-кофейни для корпоратива
6. `/images/robot-capabilities/arenda-mini-robo-kofeyni/06-tild3565-6436-4565-a131-646635653739____.webp` — заказать мини робо-кофейню с отсутствием водопровода на праздник

### робота-гуманоида Noetix Bumi — `arenda-noetix-bumi`

Source: `site-export/files/page175614509body.html`

1. `/images/robot-capabilities/arenda-noetix-bumi/01-tild3438-3136-4865-b534-396163646631____.webp` — роста робота-гуманоида Noetix Bumi рядом с детьми на празднике
2. `/images/robot-capabilities/arenda-noetix-bumi/02-tild3362-3535-4263-b863-316338643633___.webp` — батарея робота-гуманоида Bumi в аренду на мероприятие
3. `/images/robot-capabilities/arenda-noetix-bumi/03-tild6463-3230-4136-b331-666232303165___.webp` — прочный корпус робота Noetix Bumi при работе на празднике
4. `/images/robot-capabilities/arenda-noetix-bumi/04-tild3866-3739-4636-b233-373864373365_____.webp` — робот-гуманоида Noetix Bumi танцует на мероприятие
5. `/images/robot-capabilities/arenda-noetix-bumi/05-tild3736-6539-4962-b134-383538616435_____.webp` — камеры и микрофон робота-гуманоида Noetix Bumi работают на выставке
6. `/images/robot-capabilities/arenda-noetix-bumi/06-tild6335-3162-4363-b865-323661663632____.webp` — приложения для управления роботом Noetix Bumi в аренду на стенде компании

### Promobot V4 — `arenda-promobot-v4`

Source: `site-export/files/page177763209body.html`

1. `/images/robot-capabilities/arenda-promobot-v4/01-tild6433-6332-4530-b035-353738656466___.webp` — датчики движения робота-промоутера Promobot V4
2. `/images/robot-capabilities/arenda-promobot-v4/02-tild3865-3930-4363-b766-366465333436___.webp` — диалоговое облако Promobot V4 при заказе на мероприятие
3. `/images/robot-capabilities/arenda-promobot-v4/03-tild3233-3639-4030-b836-366361396438___.webp` — сканирования лица человека роботом Промобот V4 при аренде
4. `/images/robot-capabilities/arenda-promobot-v4/04-tild3634-3461-4131-a234-643464383538___.webp` — экрана робота-промоутера Promobot V4 в аренду
5. `/images/robot-capabilities/arenda-promobot-v4/05-tild3362-3535-4263-b863-316338643633___.webp` — батарея АКБ робота Promobot V4
6. `/images/robot-capabilities/arenda-promobot-v4/06-tild3365-6334-4563-a236-633633656362_____.webp` — принтер Promobot V4 в прокат в Москве

### робота-кофейни — `arenda-robo-kofeyni`

Source: `site-export/files/page177720609body.html`

1. `/images/robot-capabilities/arenda-robo-kofeyni/01-tild6339-6537-4537-b638-383933333033___.webp` — чашки кофе робота-бариста для приготовления кофе в аренду
2. `/images/robot-capabilities/arenda-robo-kofeyni/02-tild3661-6465-4634-b632-616137643334___.webp` — приготовить кофе с помощью роборуки-кофейни на мероприятие
3. `/images/robot-capabilities/arenda-robo-kofeyni/03-tild3564-3066-4338-b461-346534613562____.webp` — ввод заказа через сенсорный экран робота-бариста в процессе аренды на празднике
4. `/images/robot-capabilities/arenda-robo-kofeyni/04-tild3565-6436-4565-a131-646635653739____.webp` — отсутствия водопровода при работе робо-кофейни в прокат на празднике
5. `/images/robot-capabilities/arenda-robo-kofeyni/05-tild3233-3639-4030-b836-366361396438___.webp` — не более одного квадратного метра площадки для робо-кофейни на выставке при аренде
6. `/images/robot-capabilities/arenda-robo-kofeyni/06-tild3362-3535-4263-b863-316338643633___.webp` — заказать робо-кофейню на выставку с большим временем работы

### робота для игры в шашки — `arenda-roboshashki`

Source: `site-export/files/page178228309body.html`

1. `/images/robot-capabilities/arenda-roboshashki/01-tild3435-3936-4661-a539-373030326136___.webp` — камеры робота-шашиста при аренде робошашки в москве
2. `/images/robot-capabilities/arenda-roboshashki/02-tild3731-6664-4863-a366-336661633563__photo.webp` — манипулятора робота для игры в шашки в прокат на мероприятии
3. `/images/robot-capabilities/arenda-roboshashki/03-tild3734-6665-4936-b731-333438346566___.webp` — как регулировать сложность если заказать робота для шашек на мероприятие
4. `/images/robot-capabilities/arenda-roboshashki/04-tild3265-3065-4430-b030-616437323931___.webp` — робот шашки с большой доской в аренда на соревнования
5. `/images/robot-capabilities/arenda-roboshashki/05-tild3233-3639-4030-b836-366361396438___.webp` — размер квадратного метра для робошашки для аренды робота для игры в шашки
6. `/images/robot-capabilities/arenda-roboshashki/06-tild3362-3535-4263-b863-316338643633___.webp` — времени работы робошашек при заказе на мероприятие

### робота-бармена «Робобар» — `arenda-robot-barmen`

Source: `site-export/files/page175967809body.html`

1. `/images/robot-capabilities/arenda-robot-barmen/01-tild3564-3066-4338-b461-346534613562____.webp` — планшета для заказа коктейля у робота-бармена «Робобар» в прокат
2. `/images/robot-capabilities/arenda-robot-barmen/02-tild3661-6465-4634-b632-616137643334___.webp` — скорость работы Робобар в аренду
3. `/images/robot-capabilities/arenda-robot-barmen/03-tild3534-3665-4762-b061-393831646535____.webp` — бокала пива в руке робота-бармена «Робобар» на празднике
4. `/images/robot-capabilities/arenda-robot-barmen/04-tild6439-3335-4739-b235-306465303565___.webp` — бокал с коктейлем робота-бармена «Робобар» в Москве
5. `/images/robot-capabilities/arenda-robot-barmen/05-tild6663-3336-4535-b936-333932636265___-.webp` — размера корпуса робота-бармена «Робобар» 145×155 см
6. `/images/robot-capabilities/arenda-robot-barmen/06-tild6234-3137-4634-b161-376539633533_____.webp` — время работы робота-бармена «Робобар» в аренду на мероприятии

### робота Арди — `arenda-robota-ardi`

Source: `site-export/files/page177733909body.html`

1. `/images/robot-capabilities/arenda-robota-ardi/01-tild6633-6339-4633-a336-646638303832___.webp` — лицо с мимикой робота-андроида Арди на мероприятии
2. `/images/robot-capabilities/arenda-robota-ardi/02-tild6632-6336-4231-b536-316364633932____.webp` — общение робота Арди с помощью ИИ на выставке
3. `/images/robot-capabilities/arenda-robota-ardi/03-tild6364-3435-4763-a430-356331633632___.webp` — руки-манипуляторы человекоподобного робота Арди при работе на стенде
4. `/images/robot-capabilities/arenda-robota-ardi/04-tild3361-6435-4361-a263-613032636434___.webp` — подвижный торса робота Арди на празднике
5. `/images/robot-capabilities/arenda-robota-ardi/05-tild3662-3633-4563-b935-666566656538____.webp` — динамики и микрофон робота Арди с ИИ модулем
6. `/images/robot-capabilities/arenda-robota-ardi/06-tild3732-3562-4936-a566-366438336635____.webp` — подключение к розетке робота Арди при заказе на мероприятие

### робота-художника большого формата — `arenda-robota-hudozhnika-a4`

Source: `site-export/files/page177789609body.html`

1. `/images/robot-capabilities/arenda-robota-hudozhnika-a4/01-tild6232-3735-4032-b138-383132346463___.webp` — секундомера робота-художника для портрета А4
2. `/images/robot-capabilities/arenda-robota-hudozhnika-a4/02-tild6238-6164-4062-b731-363861666132__photo.webp` — роборука, которая рисует портрет карандашом, в аренду на мероприятие
3. `/images/robot-capabilities/arenda-robota-hudozhnika-a4/03-tild3462-3438-4636-a630-303633326536___.webp` — листа А4 для рисования робота-художника на празднике
4. `/images/robot-capabilities/arenda-robota-hudozhnika-a4/04-tild3233-3639-4030-b836-366361396438___.webp` — распознавания лица робота-художника большого формата в прокат
5. `/images/robot-capabilities/arenda-robota-hudozhnika-a4/05-tild6663-3732-4337-a238-356261633361______.webp` — аренда робота-художника большого формата
6. `/images/robot-capabilities/arenda-robota-hudozhnika-a4/06-tild3362-3535-4263-b863-316338643633___.webp` — время работы робота-художника при заказе на мероприятие

### робота София — `arenda-robota-sofiya`

Source: `site-export/files/page177695209body.html`

1. `/images/robot-capabilities/arenda-robota-sofiya/01-tild3534-6365-4064-b435-323637316338__noroot.webp` — мимики робота Софии — более 60 выражений
2. `/images/robot-capabilities/arenda-robota-sofiya/02-tild3863-6233-4033-b366-356630373339__noroot.webp` — диалога робота София Hanson Robotics в аренду
3. `/images/robot-capabilities/arenda-robota-sofiya/03-tild3764-6163-4463-a364-393236616631__noroot.webp` — аренда человекоподобного робота София на мероприятие
4. `/images/robot-capabilities/arenda-robota-sofiya/04-tild3336-3237-4331-b366-613435326463__noroot.webp` — жестикуляции робота-андроида София
5. `/images/robot-capabilities/arenda-robota-sofiya/05-tild3037-6130-4064-b066-646161643932__noroot.webp` — заказать робота Софию для мероприятия
6. `/images/robot-capabilities/arenda-robota-sofiya/06-tild6338-3264-4538-b633-653264326339__noroot.webp` — стационарной установки робота Софии на выстаке

### модульного робота Tron — `arenda-robota-tron`

Source: `site-export/files/page177678709body.html`

1. `/images/robot-capabilities/arenda-robota-tron/01-tild6266-3131-4264-b030-353266656635____.webp` — смены модуля стопы робота с колёсно-шаговой платформой Tron
2. `/images/robot-capabilities/arenda-robota-tron/02-tild3665-3635-4034-a235-666236393030__photo.webp` — препятствия для двуногого робота Tron в аренду на выставку
3. `/images/robot-capabilities/arenda-robota-tron/03-tild3466-6537-4034-a665-353435393638__________tron.webp` — датчика баланса робота TRON 1 LimX Dynamics
4. `/images/robot-capabilities/arenda-robota-tron/04-tild3233-3639-4030-b836-366361396438___.webp` — схема процессора модульного робота Tron в прокат
5. `/images/robot-capabilities/arenda-robota-tron/05-tild3966-3464-4563-a634-333363306365____.webp` — параметры габаритов робота Tron в аренду на мероприятие
6. `/images/robot-capabilities/arenda-robota-tron/06-tild3362-3535-4263-b863-316338643633___.webp` — АКБ батарея двуногого робота Tron на выставку

### робота-шахматиста SenseRobot — `arenda-senserobot`

Source: `site-export/files/page176336009body.html`

1. `/images/robot-capabilities/arenda-senserobot/01-tild3935-3536-4835-b562-633238666535___.webp` — чип с искусственным интеллектом робота-шахматиста SenseRobot в аренду
2. `/images/robot-capabilities/arenda-senserobot/02-tild6561-6234-4138-a266-646433326336____.webp` — сканера шахматной доски при заказе робота-шахматиста на мероприятие
3. `/images/robot-capabilities/arenda-senserobot/03-tild3162-6337-4832-b134-393566613136___.webp` — манипулятора робота-шахматиста SenseRobot в прокат
4. `/images/robot-capabilities/arenda-senserobot/04-tild3133-6136-4265-b864-323432393163_____.webp` — схема магнитной доски робота-шахматиста SenseRobot для проката в Москве
5. `/images/robot-capabilities/arenda-senserobot/05-tild3362-3535-4263-b863-316338643633___.webp` — батарея робота-шахматиста SenseRobot при заказе на мероприятие
6. `/images/robot-capabilities/arenda-senserobot/06-tild3136-6232-4534-a363-343930363332___.webp` — настройки робота-шахматиста SenseRobot на выставке

### робота-художника Sketchbot — `arenda-sketchbot`

Source: `site-export/files/page175905109body.html`

1. `/images/robot-capabilities/arenda-sketchbot/01-tild3363-3662-4233-a461-343265336666_____.webp` — секундомер робота-художника Sketchbot
2. `/images/robot-capabilities/arenda-sketchbot/02-tild3664-6237-4264-b163-633833636165_____.webp` — роборука с карандашом — скетчбот в аренду в Москве
3. `/images/robot-capabilities/arenda-sketchbot/03-tild6134-6534-4435-b962-663065363033____.webp` — розетки и площадка для прокат робота-художника Sketchbot
4. `/images/robot-capabilities/arenda-sketchbot/04-tild3137-3734-4435-a466-376536343338____.webp` — лист бумаги с портретом при аренде робота-художника
5. `/images/robot-capabilities/arenda-sketchbot/05-tild6362-6630-4239-a231-356633366431___.webp` — очереди гостей у робота Sketchbot в прокат для выставки
6. `/images/robot-capabilities/arenda-sketchbot/06-tild3436-6235-4335-a139-626634373037____.webp` — палитры и логотип робота-художника Sketchbot на празднике

### робота-гуманоида Unitree G1 — `arenda-unitree-g1`

Source: `site-export/files/page174102409body.html`

1. `/images/robot-capabilities/arenda-unitree-g1/01-tild6632-3663-4234-a237-353162663362____unitree_g1.webp` — габариты робота-гуманоида
2. `/images/robot-capabilities/arenda-unitree-g1/02-tild3261-3664-4733-a363-666637613732__31__.webp` — суставы человекоподобного робота Unitree G1 в аренду
3. `/images/robot-capabilities/arenda-unitree-g1/03-tild3362-3535-4263-b863-316338643633___.webp` — батарея робота-гуманоида Unitree G1 в аренду
4. `/images/robot-capabilities/arenda-unitree-g1/04-tild3337-3631-4531-a236-616331626333___.webp` — высокая скорость передвижения робота-гуманоида Unitree G1 на мероприятие
5. `/images/robot-capabilities/arenda-unitree-g1/05-tild3662-3633-4563-b935-666566656538____.webp` — микрофон робота-гуманоида Unitree G1
6. `/images/robot-capabilities/arenda-unitree-g1/06-tild3061-3866-4735-b635-323965623538____.webp` — складывание робота-гуманоида Unitree G1 напрокат

### робота-собаки Unitree Go2 — `arenda-unitree-go2`

Source: `site-export/files/page153266796body.html`

1. `/images/robot-capabilities/arenda-unitree-go2/01-tild3362-3535-4263-b863-316338643633___.webp` — батарея робота-пса Unitree Go2
2. `/images/robot-capabilities/arenda-unitree-go2/02-tild6536-6333-4033-a663-363732353239____.webp` — танцующая робот-собакиа Unitree Go2 на празднике
3. `/images/robot-capabilities/arenda-unitree-go2/03-tild3030-3632-4336-b537-623938666235____.webp` — демонстрация скорости передвижения робота-собаки Unitree Go2
4. `/images/robot-capabilities/arenda-unitree-go2/04-tild3131-6234-4466-b465-313436326636___.webp` — датчика-«глаза» интерактивной робособаки в аренду на конференцию
5. `/images/robot-capabilities/arenda-unitree-go2/05-tild6263-6234-4764-a466-373064626137_____.webp` — звуковые волны у робота-собаки при аренде на мероприятие
6. `/images/robot-capabilities/arenda-unitree-go2/06-tild3761-6262-4862-b364-383063383635_____.webp` — лапы робота-собаки Unitree Go2 на поверхности стенда на выставке

### робота-гуманоида Unitree H2 — `arenda-unitree-h2`

Source: `site-export/files/page175743809body.html`

1. `/images/robot-capabilities/arenda-unitree-h2/01-tild6335-3235-4430-b536-373733663937_______.webp` — рост робота-гуманоида Unitree H2
2. `/images/robot-capabilities/arenda-unitree-h2/02-tild3261-3664-4733-a363-666637613732__31__.webp` — подвижность суставов робота Unitree H2 при аренде на мероприятие
3. `/images/robot-capabilities/arenda-unitree-h2/03-tild3164-6535-4135-b964-396466313032_____.webp` — лица робота-гуманоида Unitree H2 с мимикой при прокате на выступлении
4. `/images/robot-capabilities/arenda-unitree-h2/04-tild3266-3766-4265-b961-303365633739___.webp` — руки с грузом робота-гуманоида Unitree H2 на выставке
5. `/images/robot-capabilities/arenda-unitree-h2/05-tild3362-3535-4263-b863-316338643633___.webp` — заряженная батарея робота-гуманоида Unitree H2 на мероприятие
6. `/images/robot-capabilities/arenda-unitree-h2/06-tild3631-3264-4533-b463-663533383933_____.webp` — процессора внутри робота Unitree H2 для ИИ

### робота-гуманоида Unitree R1 — `arenda-unitree-r1`

Source: `site-export/files/page175648709body.html`

1. `/images/robot-capabilities/arenda-unitree-r1/01-tild3438-3136-4865-b534-396163646631____.webp` — габариты робота-гуманоида — Unitree R1
2. `/images/robot-capabilities/arenda-unitree-r1/02-tild6231-3634-4832-a265-363137623165____.webp` — суставы робота-гуманоида Unitree R1 при движении
3. `/images/robot-capabilities/arenda-unitree-r1/03-tild3362-3535-4263-b863-316338643633___.webp` — дополнительная батарея робота-гуманоида Unitree R1 в аренду
4. `/images/robot-capabilities/arenda-unitree-r1/04-tild3337-3631-4531-a236-616331626333___.webp` — скорость передвижения робота-гуманоида Unitree R1 на мероприятие
5. `/images/robot-capabilities/arenda-unitree-r1/05-tild6238-6561-4461-b637-636437653835____.webp` — микрофон робота-гуманоида Unitree R1 в процессе работы на выставке
6. `/images/robot-capabilities/arenda-unitree-r1/06-tild3132-3237-4762-a264-393461333263____.webp` — процесс работы модуля Wi-Fi робота-гуманоида Unitree R1 на празднике

### интерактивной витрины UV-BOX — `arenda-uv-box`

Source: `site-export/files/page178304409body.html`

1. `/images/robot-capabilities/arenda-uv-box/01-tild3337-3736-4937-a338-373430373834___3d-.webp` — Потрясающий 3D-эффект интерактивной витрины в аренду в Москве
2. `/images/robot-capabilities/arenda-uv-box/02-tild3135-3462-4334-b335-396533396630__touch-.webp` — Возможность сенсорного управления голографической витрины в прокат для мероприятия
3. `/images/robot-capabilities/arenda-uv-box/03-tild3737-6161-4636-b263-323339363562___.webp` — Множество механик интерактива phygital-витрины в аренду
4. `/images/robot-capabilities/arenda-uv-box/04-tild6231-3561-4436-a466-306663636539____.webp` — Возможности QR-конверсии 3D витрины с сенсорным экраном
5. `/images/robot-capabilities/arenda-uv-box/05-tild3036-3934-4664-b734-663962346539_____.webp` — Способы аналитики интерактивной витрины UV-BOX при аренде на мероприятие
6. `/images/robot-capabilities/arenda-uv-box/06-tild3565-6565-4534-a632-343338326438___.webp` — Создание контента любого формата для аренды 3D витрины с сенсорным экраном

### робота-собаки Xiaomi Cyberdog 2 — `arenda-xiaomi-cyberdog-2`

Source: `site-export/files/page175708109body.html`

1. `/images/robot-capabilities/arenda-xiaomi-cyberdog-2/01-tild3362-3535-4263-b863-316338643633___.webp` — батареи робота-собаки Xiaomi Cyberdog 2
2. `/images/robot-capabilities/arenda-xiaomi-cyberdog-2/02-tild3461-6463-4362-a331-303362343163____.webp` — танцующий робот Xiaomi Cyberdog 2 в прокат на празднике
3. `/images/robot-capabilities/arenda-xiaomi-cyberdog-2/03-tild3564-3833-4163-a130-346439363730___.webp` — брендирование корпуса робота-собаки Cyberdog 2 на детском празднике
4. `/images/robot-capabilities/arenda-xiaomi-cyberdog-2/04-tild3030-3632-4336-b537-623938666235____.webp` — скорости робота-собаки CyberDog 2 в аренду на мероприятие
5. `/images/robot-capabilities/arenda-xiaomi-cyberdog-2/05-tild3064-6433-4931-a361-316438613463_____.webp` — датчика-«глаза» робота-собаки Xiaomi Cyberdog 2
6. `/images/robot-capabilities/arenda-xiaomi-cyberdog-2/06-tild3139-3163-4763-a465-333631323833_____.webp` — звуковые волны у робота-собаки Xiaomi Cyberdog 2

