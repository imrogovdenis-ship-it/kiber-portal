# Открытые решения

| Решение | Владелец | Блокирует | Временная политика |
|---|---|---|---|
| Подтвердить web-лицензию Gilroy | владелец проекта | production self-hosting Gilroy | fallback Arial, Tilda CDN запрещён |
| Передать утверждённые изображения и права | владелец/дизайн | reference screenshots и production media | технические placeholders |
| Утвердить телефон, TG, WA, реквизиты | владелец | публикацию контактов | значения `.env.example` не считаются production |
| Выбрать analytics provider и consent policy | владелец/маркетинг | production analytics | provider-neutral contract, отправка выключена |
| Выбрать backend ContactModal | владелец/техлид | production forms/E2E lead | форма не подключается к реальным лидам |
| Утвердить preview domain и защиту | техлид | Coolify preview acceptance | noindex + X-Robots-Tag; production secrets запрещены |
| Предоставить оригинальный `Правки.xlsx` | владелец | финальную архивную трассировку | используется нормализованный CSV без удаления строк |
| Robot Card 05: ссылка на всю карточку как в HTML refs или отдельная ссылка «Подробнее» | владелец/дизайн | финальную DOM/a11y parity блока 05 | сохраняется отдельная заметная ссылка и focus-state; визуальное расхождение документировано |
| Robot Card 05: показывать ли logo на mobile | владелец/дизайн | финальную media parity блока 05 | logo не добавляется: desktop markup его содержит, mobile markup — нет, хотя mobile CSS содержит правило |
| Robot Card 05: канонические route, цена и описание Unitree G1 | владелец/контент | publication-ready fixture/content | сохраняются schema route `/robots/…` и текущие непубличные данные; reference price `50 000 ₽` не публикуется автоматически |
