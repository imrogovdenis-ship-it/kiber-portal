# Утверждение формы заявки на обратную связь

## Статус

`owner_visual_approved_closed`

## Формулировка владельца

> Всё читаем задачу с формой заявки на обратную связь закрытой утверждаемую в том виде в котором она есть сейчас

## Что утверждено

- Popup формы заявки, открывающийся по кнопке `Оставить заявку`.
- Текущий уменьшенный размер формы.
- Отсутствие горизонтального overflow/ползунка.
- Поля:
  - Имя — обязательно.
  - Телефон — обязательно.
  - Почта — необязательно.
  - Согласие — обязательно.
- Юридические ссылки: `/consent/`, `/privacy-policy/`, `/terms/`.

## Evidence

- `lead-form-popup-desktop-no-overflow.png`
- `lead-form-popup-mobile-no-overflow.png`
- `overflow-probe-after.json`
- `lead-form-overflow-fix-summary.json`

## Границы approval

Это визуальное утверждение и закрытие задачи по форме заявки. Оно **не означает**:

- merge;
- production deploy;
- DNS changes;
- analytics activation;
- live amoCRM/Telegram routing;
- secrets/env activation;
- Linear Done без отдельного шага.

Git HEAD на момент записи: `17c57f65943fe5f5949a45f1084170e232562659`.
