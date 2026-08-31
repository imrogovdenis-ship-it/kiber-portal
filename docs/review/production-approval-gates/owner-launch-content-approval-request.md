# Owner launch-content approval request

Этот пакет нужен, чтобы Александр мог одним сообщением закрыть human/business/legal approval по launch-контенту. Он **не включает production deploy**, DNS, production secrets, analytics provider IDs/cookies и live lead routing.

## Что нужно утвердить

1. **legal pages можно публиковать**
   - `/privacy-policy/`
   - `/consent/`
   - `/cookie-policy/`
   - `/terms/`
   - Evidence: `data/legal/legal-documents.json`, `tests/visual/legal-four-documents.test.ts`.

2. **реквизиты верные**
   - ИП Маркин Александр Сергеевич
   - ИНН `771898397717`
   - ОГРНИП `326774600084499`
   - адрес: Нижний Сусальный переулок, 9, стр. 4А
   - Evidence: `src/config/site.ts`, `data/legal/legal-documents.json`.

3. **цены/дисклеймер “Не является публичной офертой” ок**
   - Цены на карточках и robot pages можно публиковать в текущем виде.
   - Дисклеймер `Не является публичной офертой` остаётся рядом с ценовыми формулировками.
   - Evidence: `data/models/robots.source-of-truth.json`, `data/models/robot-tariffs.json`, `docs/review/kiber-55/content-approval-pack.md`.

4. **контакты ок**
   - Телефон: `+7 985 266-65-82`
   - Email: `markinas28@yandex.ru`
   - Telegram: public link from `src/config/site.ts`
   - WhatsApp: `https://wa.me/79852666582`
   - MAX: public link from `src/config/site.ts`
   - Это approval только на публичное отображение контактов, не на backend live routing.

5. **тексты на launch-страницах ок**
   - Главная
   - Контакты
   - `/lead/request/` и `/lead/thanks/`
   - категории роботов
   - 24 robot pages
   - Evidence: `docs/review/kiber-55/content-approval-pack.md`, `data/review/content-acceptance.json`.

## Рекомендуемая формулировка approval

```text
Утверждаю launch-content package: legal pages можно публиковать, реквизиты верные, цены и дисклеймер «Не является публичной офертой» ок, контакты ок, тексты на launch-страницах ок. Это не является разрешением на production deploy, DNS, production secrets, analytics IDs/cookies или live lead routing.
```

## Что остаётся отдельно

- Яндекс.Метрика: функциональный contract заложен, counter ID и cookies отложены до публикации сайта и привязки домена.
- `/api/leads`: preview/dry-run scaffold, live delivery выключена.
- Production deploy/DNS/Coolify/secrets: требуется отдельное явное approval.
