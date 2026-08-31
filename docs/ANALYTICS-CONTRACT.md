# Контракт аналитики

## `robot_card_click`

- Триггер: активация ссылки «Подробнее» мышью или клавиатурой.
- Источник: `robot-card` на catalog/related/collection/design-review.
- Обязательные параметры: `robot_slug: string`, `block_id: string`, `placement: enum`.
- Необязательный параметр: `position: integer`.
- Consent: `analytics`.
- Владелец метрики: commercial.
- Запрещены персональные данные, значения форм и секреты.

```json
{"robot_slug":"unitree-g1","block_id":"robot-card","placement":"catalog","position":1}
```

Машинный источник: `design-system/analytics/events.yaml`.
