# KIBER PORTAL — business inputs request pack

Дата: 2026-08-30  
Статус: `needed_before_production_launch`

Этот документ перечисляет решения, которые ещё нужны перед production launch. Media rights и public contacts/requisites уже закрыты owner input/approval и больше не являются открытыми blockers.

Media rights статус: `approved_by_owner_for_production_media_use`  
Evidence: `data/review/media-rights-robot-cards.json`, `docs/review/media-rights/robot-cards/`, `data/review/media-rights-review-package.json`.

Public contacts approved: `yes`  
Evidence: owner input 2026-08-30; defaults in `src/config/site.ts`; rendered header/footer/contacts/legal docs use the approved values.

## 1. Закрыто: реальные публичные контакты и реквизиты

Утверждено для preview/PR:

- телефон: `+7 985 266-65-82`;
- email: `markinas28@yandex.ru`;
- Telegram: phone-based public contact;
- WhatsApp: phone-based public contact;
- регион: Москва;
- оператор: ИП Маркин Александр Сергеевич;
- ИНН: `771898397717`;
- ОГРНИП: `326774600084499`;
- адрес: Нижний Сусальный переулок, 9, стр. 4А.

## 2. Lead capture / messenger routing

Нужно выбрать production-поведение CTA и lead destination:

- вести сразу в Telegram/WhatsApp;
- оставить форму только как бриф без автоматической отправки;
- отправлять форму в CRM/email;
- комбинированный сценарий.

Нужны точные destination values. Секреты/токены нельзя передавать в открытом виде и нельзя хранить в Git; использовать 1Password / `op://` references или approved server-side secret store.

## 3. Analytics / conversion tracking

Нужно подтвердить:

- какие системы подключаем: Яндекс.Метрика, GA4, пиксели, CRM events;
- public counter IDs;
- список целевых событий;
- нужна ли cookie/consent логика.

Текущее ограничение:

- шаблоны уже используют provider-neutral CTA events;
- реальные analytics IDs не добавлены, чтобы не выдумывать и не подключать лишнее.

## 4. SEO content expansion package

Для финального SEO pass нужны подготовленные материалы Александра/Клода:

- список ключевых запросов по страницам;
- синонимы и long-tail phrases;
- неопубликованные статьи;
- неопубликованные подборки;
- приоритетные коммерческие страницы;
- региональная стратегия, если нужна: Москва/Россия/конкретные города;
- список роботов/сценариев, которые нужно усилить в первую очередь.

Alt/описания по media review уже объединены и утверждены для robot media package; новые SEO-материалы нужны только для расширения страниц/статей/подборок.

## 5. Pricing / availability / claims approval

Нужно подтвердить:

- какие цены показываем публично;
- какие роботы `цена по запросу`;
- какие роботы доступны постоянно, а какие под запрос;
- можно ли писать про конкретные площадки, клиентов, бренды, кейсы;
- какие claims нельзя публиковать без менеджера.

Правило:

- не публикуем неподтверждённые цены, юридические claims, availability claims или customer/event claims.

## 6. Redirect approval

Текущее состояние:

```text
data/seo/redirects.scaffold.json
```

Это только scaffold. Редиректы не активированы.

Перед активацией нужен:

- финальный live crawl старого production сайта;
- список старых URL, которые должны вести на новые URL;
- решение по slash/no-slash;
- решение по preview/parity/noindex routes;
- approval перед подключением в Astro/Coolify/Traefik.

## 7. Production deploy / DNS / secrets permission

Перед любыми infrastructure changes нужно отдельно подтвердить:

- target Coolify app/container;
- домен и DNS;
- rollback plan;
- список затронутых файлов/контейнеров;
- что не трогаем чужие AI Class контейнеры/секреты/аналитику/DNS.

## Copy-paste request for Alex/team

```text
Для запуска Astro-версии КИБЕР ПОРТАЛА ещё нужны финальные данные:

1. Куда вести заявки: мессенджер, форма, CRM/email, точный сценарий CTA и lead destination.
2. Аналитика: Метрика/GA4/пиксели, IDs, цели, consent если нужен.
3. SEO-пакет: ключи по страницам, синонимы, long-tail, статьи, подборки, приоритетные страницы.
4. Цены/доступность/claims: что можно публиковать, что только по запросу, какие кейсы/бренды можно упоминать.
5. Редиректы: список старых URL и куда они должны вести.
6. Отдельное подтверждение production deploy: домен, Coolify target, rollback, дата/окно запуска.
```
