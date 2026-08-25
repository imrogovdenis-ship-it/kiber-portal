# KIBER PORTAL — lead-flow and analytics integration plan

Дата: 2026-08-25  
Статус: `planned_deferred_until_ids_and_accesses`

## User-approved direction

- В шапке сайта и в необходимых блоках показываем телефон: `+7 977 479 07 49`.
- По кнопке «Написать нам» открываем попап связи.
- В попапе показываем мессенджеры: Telegram, WhatsApp, Max.
- В попапе показываем форму заявки с полями:
  - имя — обязательное;
  - телефон — обязательное;
  - email — необязательное.
- Переходы по кнопкам социальных сетей должны вести напрямую в соответствующие мессенджеры.
- Заявка из формы должна отправляться в Telegram-чат и позже дублироваться в amoCRM.
- Подключение CRM/amoCRM нужно заложить, но реализовывать позже.
- Подключаем Яндекс.Метрику, Яндекс.Вебмастер и другие инструменты Яндекса позже, когда будут ID/доступы.

## Current implemented safe state

- Header/footer/contact page phone links use a real `tel:+79774790749` href.
- Contact popup includes direct messenger buttons for available non-masked destinations from `data/block-library/contact-messenger-modal.json`.
- Telegram destination is displayed as pending if the only available value contains a literal mask (`*`). It is not rendered as a broken clickable link.
- Contact popup form fields are rendered but submission is disabled until Telegram/amoCRM destinations are provided.
- CTA/link-flow validator checks rendered output and fails on masked/broken hrefs.

## Deferred implementation targets

### Telegram form delivery

Needed inputs:

- Telegram bot token or approved server-side gateway path — **do not put token in Git**.
- Target Telegram chat ID/thread ID for lead notifications.
- Message template.
- Spam/rate-limit policy.
- Consent/privacy text confirmation.

Expected message fields:

```text
Имя
Телефон
Email, если заполнен
Страница заявки
UTM/source, если доступны
Время заявки
```

### amoCRM duplicate

Needed inputs:

- amoCRM domain/account.
- OAuth/client setup or approved webhook path.
- Pipeline/status for new leads.
- Responsible user.
- Custom fields mapping.

Do not store amoCRM tokens in Git.

### Yandex analytics stack

Planned tools:

- Яндекс.Метрика counter.
- Яндекс.Вебмастер verification.
- Conversion goals for:
  - click phone;
  - click messenger;
  - open contact popup;
  - submit lead form;
  - robot card click;
  - collection/article CTA click.

Needed later:

```text
YANDEX_METRIKA_ID
YANDEX_WEBMASTER_VERIFICATION
goal names / goal IDs if manually created
consent/cookie policy decision
```

## Current blockers

```text
Telegram destination/link: needed
Telegram form target chat: needed
amoCRM access/webhook: needed later
Yandex IDs/verification: needed later
Consent/cookie analytics text: confirm before production
```
