# КИБЕР ПОРТАЛ: Джино и API подготовлены, публикация отложена

## Актуальное решение владельца
Владелец подтвердил работу полного preview с VPN и без. Затем разрешил постоянный API и **один помеченный live-тест**, но запретил перенос основного домена до исправления текстов и доработки карточек. В статьях разрешены только два нижних блока; они исправлены отдельным PR #95 и опубликованы только на preview.

## Действующий предпросмотр
https://jino-preview.kiber-portal.ru/ — отдельный сайт/document root `/domains/jino-preview.kiber-portal.ru` на существующем Джино-хостинге qodmg. PHP 8.4 настроен только для него. SSL выпущен для preview. При его привязке Джино автоматически создал отдельную DNS-зону; это не переключение apex/www.

24 карточки, шесть статей, подборка и остальные launch routes доступны. В HTML добавлены только noindex и явная полоса dry-run. Публичные формы остаются dry-run. Статика — исходный release плюс ровно две изменённые секции в шести статьях из PR #95; styles/assets вне этого scope не менялись.

## Независимый API origin
https://api-origin.kiber-portal.ru/ указывает отдельной A-записью на API-сервер, имеет независимый TLS-сертификат/ACME route. Основной домен и www сохраняют 38.180.37.42.

- `/dry-run/api/leads` → `alex-kiber-jino-prep-api`, без provider credentials.
- `/live/api/leads` → `alex-kiber-jino-live-api`, live configuration, production approval flag, provider credentials из закрытого project .env.
- Оба маршрута защищены отдельной служебной Basic Auth. Browser никогда не получает служебные credentials и обращается только на Джино.
- Runtime image/source commit приведены в readiness.json; image собран штатным Dockerfile target api, не из staging overlay.
- Нет host ports; ограничены память/CPU и размер журналов. Общий Traefik, прежние production контейнеры и VR-сайт не заменялись.

## PHP-мост
`infra/jino-preview/bridge.php` и preview.htaccess реально развёрнуты на Джино. Default config — вне document roots в ACCOUNT_HOME/.kiber-jino-prep/config.php, mode 600; шаблон без credentials находится в config.example.php.

Upstream URL/hostname, TLS verification и origin фиксированы private config. CURLOPT_RESOLVE предотвращает DNS loop, но теперь использует именно независимый api-origin hostname. Пути/методы/типы содержимого ограничены; body до 64 KiB, файлы/массивы форм не принимаются. Multipart разбирается PHP в $_POST, затем передаётся urlencoded с корректным Content-Type. Клиентский IP берётся из REMOTE_ADDR, а не из присланного клиентом заголовка. API принимает этот отдельный заголовок только при явном LEAD_TRUSTED_CLIENT_IP_HEADER на защищённом gateway-контуре; публичный старый API не менялся.

`expected_mode` задаётся только private config, по умолчанию dry-run; неожиданный режим/upstream failure возвращает 503. HTML form fallback и JSON redirects остаются same-origin. POST timeout учитывает bounded retries API.

## Разрешённый live-тест
Один защищённый одноразовый вход вызвал тот же мост с private live config. Он был защищён токеном и атомарным маркером попытки. Получены HTTP 200/live и подтверждения amoCRM/Telegram, по одной попытке; запись amoCRM дополнительно прочитана по возвращённому UID. См. authorized-live-test.json. Это подтверждение provider API, не утверждение о прочтении уведомления владельцем.

Одноразовый web entry удалён (404), токен удалён локально. Обычный `/api/leads/status` после теста снова проверен: 200/dry-run; он не переключался в live для остальных посетителей.

## Мониторинг и проверки
Runtime пишет redacted `lead.delivery.completed` events с trace/request id и результатами каналов, без имени/контакта. LEAD_STRUCTURED_LOGGING включён на новых API контейнерах. Активное расписание внешних алертов этим PR не объявляется настроенным.

Проверены 35 routes, 8 responsive checks, два browser FormData dry-run POST → thanks; отдельно получено тело multipart ответа с skipped=dry-run для обоих каналов. Восемь негативных checks, реальный fail-closed 503 при остановке только prep API и восстановление 200/dry-run. Десять runtime tests включают RED→GREEN для per-client rate limiting и redacted log sink.

```sh
export KIBER_JINO_PREVIEW_URL=https://jino-preview.kiber-portal.ru
for f in infra/jino-preview/test-jino-bridge*.py; do python3 "$f" || exit; done
node --import tsx --test tests/runtime/*.test.ts
```
Эти HTTP tests только dry-run. **Не повторять live POST без нового разрешения владельца.**

## Изоляция и откат
Первая рабочая подпапка внутри технического VR-домена исчезла во время подготовки; инициатор не установлен. Она не восстанавливалась. КИБЕР вынесен в отдельный сайт/каталог. Архив, extractor, probes и live web entry удалены.

После решения об откате удалять только новые KIBER ресурсы; сначала проверить использование. Не удалять hosting container, VR domains или общие AI Class сервисы. Перед переключением основного домена получить новое явное разрешение; бизнес/content hold остаётся активным.
