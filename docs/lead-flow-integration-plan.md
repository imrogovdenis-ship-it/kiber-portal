# KIBER PORTAL — lead-flow and analytics integration plan

Дата: 2026-08-29  
Статус: `planned_deferred_until_real_destinations`

## Current owner-approved direction

- В header/footer/contact blocks можно показывать только утверждённые public contacts.
- Сейчас реальные публичные контакты ещё ожидаются от Александра, поэтому defaults/placeholders не считаются production data.
- По кнопке «Написать нам» должен открываться безопасный contact/lead сценарий.
- В попапе/форме нужны поля:
  - имя — обязательное;
  - телефон — обязательное;
  - email — необязательное.
- Заявка из формы должна уходить в выбранный lead destination после отдельного approval.
- amoCRM можно заложить как deferred integration, но не подключать без access/secrets.
- Яндекс.Метрика/Вебмастер и другие инструменты Яндекса подключаются позже, когда будут ID/доступы и consent decision.

## Current implemented safe state

```text
live routing = disabled
destinations = []
production contacts = placeholders only
PUBLIC_PHONE/PUBLIC_EMAIL/PUBLIC_TG/PUBLIC_WA = pending owner values
```

- Lead capability contract keeps routing disabled and destination-free.
- Contact/lead pages render static-safe UI and do not claim real submission.
- CTA/link-flow validators check rendered output and fail on masked/broken hrefs.
- Secrets are not stored in Git.
- If secrets are needed later, use 1Password / `op://` references or another approved server-side secret store; `OP_SERVICE_ACCOUNT_TOKEN` itself must never be committed or printed.

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
Real public phone/email/messenger links: needed
Telegram destination/link: needed
Telegram form target chat: needed
amoCRM access/webhook: needed later
Yandex IDs/verification: needed later
Consent/cookie analytics text: confirm before production
Production deploy/DNS/secrets permission: needed separately
```
