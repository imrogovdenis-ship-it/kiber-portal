# Открытые решения

| Решение | Владелец | Блокирует | Временная политика |
|---|---|---|---|
| Выбрать lead destination/backend | владелец/техлид | production forms/E2E lead | `destinations = []`, live routing disabled |
| Выбрать analytics provider и consent policy | владелец/маркетинг | production analytics | provider-neutral contract, отправка выключена |
| Дать отдельное production deploy/DNS/secrets approval | владелец/техлид | запуск на live domain | все production side effects запрещены до явной команды |
| Утвердить preview domain и защиту | техлид | Coolify preview acceptance | noindex + X-Robots-Tag; production secrets запрещены |
| Предоставить оригинальный `Правки.xlsx` | владелец | финальную архивную трассировку | используется нормализованный CSV без удаления строк |
| Robot Card 05: ссылка на всю карточку как в HTML refs или отдельная ссылка «Подробнее» | владелец/дизайн | финальную DOM/a11y parity блока 05 | сохраняется отдельная заметная ссылка и focus-state; визуальное расхождение документировано |
| Robot Card 05: показывать ли logo на mobile | владелец/дизайн | финальную media parity блока 05 | logo не добавляется: desktop markup его содержит, mobile markup — нет, хотя mobile CSS содержит правило |
| Robot Card 05: канонические route, цена и описание Unitree G1 | владелец/контент | publication-ready fixture/content | сохраняются schema route `/robots/…` и текущие непубличные данные; reference price `50 000 ₽` не публикуется автоматически |

## Закрытые решения

| Решение | Evidence |
|---|---|
| Media rights по 24 full robot cards | `data/review/media-rights-robot-cards.json`, `docs/review/media-rights/robot-cards/`, owner approval 2026-08-29 |
| Контакты и реквизиты | Owner input 2026-08-30: +7 985 266-65-82, markinas28@yandex.ru, Telegram/WhatsApp by phone, Москва, ИП Маркин Александр Сергеевич, ИНН 771898397717, ОГРНИП 326774600084499, Нижний Сусальный переулок, 9, стр. 4А |
