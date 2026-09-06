# Проверка live routing формы заявки — amoCRM + Telegram

## Результат

`PASSED`

Выполнена одна контролируемая тестовая заявка через source handler `/api/leads` в режиме `LEAD_ROUTING_MODE=live`.

## Что проверено

- 1Password item `KIBER PORTAL lead routing` читается для нужных секретов.
- Telegram Bot API:
  - `getMe` — ok;
  - `getChat` — ok;
  - бот: `lead_kiberportal_bot`;
  - чат: `Заявки с сайта КИБЕР ПОРТАЛ`;
  - тип: `group`.
- amoCRM:
  - endpoint `POST /api/v4/leads/unsorted/forms` принял заявку;
  - `unsortedUid`: `9b281c7aae1426cbe4f49eb154e1d6369d1c26e1417289474c7f98e9ea65`.
- Telegram duplicate:
  - message sent;
  - `messageId`: `12`.

## Test lead

- requestId: `lead_staging_owner_test_20260906_130007`
- name: `Тест Гефест staging`
- contact: `[TEST_PHONE_REDACTED]`
- email: `hermes-test@example.invalid`
- robot: `manual-staging-live-test`

## Границы

Секреты не выводились и не коммитились. Это не production deploy, не DNS, не analytics и не merge. Live routing остаётся env-gated.
