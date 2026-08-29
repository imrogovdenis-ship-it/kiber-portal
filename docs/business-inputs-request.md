# KIBER PORTAL — business inputs request pack

Дата: 2026-08-29  
Статус: `needed_before_production_launch`

Этот документ перечисляет только решения, которые всё ещё нужны от Александра/команды перед production launch. Media rights по роботам уже закрыты отдельным owner approval и больше не являются открытым blocker.

Media rights статус: `approved_by_owner_for_production_media_use`  
Evidence: `data/review/media-rights-robot-cards.json`, `docs/review/media-rights/robot-cards/`, `data/review/media-rights-review-package.json`.

## 1. Реальные публичные контакты и реквизиты

Нужно подтвердить:

- реальные публичные контакты: телефон, email, Telegram, WhatsApp/Max если используются;
- юридическое название компании;
- ИНН/ОГРН/реквизиты, если они должны быть публичными;
- адрес/город/география работы, если это нужно в контактах и schema;
- финальный текст для footer/legal blocks.

Текущий статус в Astro:

- `/contacts` и footer остаются placeholder-safe до финальных значений;
- неподтверждённые реквизиты не выдумываются;
- значения из `.env.example` или локальных defaults не считаются production approval.

## 2. Lead capture / messenger routing

Нужно выбрать production-поведение CTA и lead destination:

- открыть messenger modal;
- вести в Telegram;
- вести в WhatsApp/Max;
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
Для запуска Astro-версии КИБЕР ПОРТАЛА нужны финальные данные:

1. Реальные контакты: телефон, email, Telegram/WhatsApp/Max, реквизиты, адрес/география, footer/legal text.
2. Куда вести заявки: мессенджер, форма, CRM/email, точный сценарий CTA и lead destination.
3. Аналитика: Метрика/GA4/пиксели, IDs, цели, consent если нужен.
4. SEO-пакет: ключи по страницам, синонимы, long-tail, статьи, подборки, приоритетные страницы.
5. Цены/доступность/claims: что можно публиковать, что только по запросу, какие кейсы/бренды можно упоминать.
6. Редиректы: список старых URL и куда они должны вести.
7. Отдельное подтверждение production deploy: домен, Coolify target, rollback, дата/окно запуска.
```
