# Подготовка КИБЕР ПОРТАЛ к Джино — без переключения production

## Рабочий предпросмотр
https://jino-preview.kiber-portal.ru/

Отдельный сайт в существующем контейнере хостинга qodmg: `/domains/jino-preview.kiber-portal.ru`. PHP **8.4** выбран только для него; SSL выпущен Джино для поддомена. При добавлении привязки Джино автоматически создал DNS-зону поддомена; apex/www КИБЕР не переключались и сохраняют прежний IP.

Полная статика извлечена из production web image указанного source commit. Медиа, CSS и JS сохранены; только в HTML добавлены noindex и заметная полоса dry-run. Используется preview.htaccess из infra/jino-preview, а не production recipe.

## Серверный мост
Браузер → same-origin PHP bridge на Джино → защищённый HTTPS маршрут на отдельный `alex-kiber-jino-prep-api`. API использует штатный source-built image, DEPLOY_ENV=preview, LEAD_ROUTING_ENABLED=true, LEAD_ROUTING_MODE=dry-run, origin только preview. CRM/Telegram credentials в тестовый контейнер не переданы. Публичных host ports нет. Только новый API подключён к существующему proxy network; общие сервисы и production контейнеры не пересоздавались.

Служебная авторизация, route/IP и конфиг находятся вне Git и вне document roots, mode 600. В PHP фиксированы upstream URL и TLS verification; CURLOPT_RESOLVE предотвращает циклическое обращение после будущего переезда основного домена. Это временный путь подготовки: независимое hostname/TLS renewal API — обязательный gate перед cutover, а не решённая этим PR задача.

Мост ограничивает методы/пути/Origin, тела до 64 KiB, типы содержимого; не поддерживает файлы. PHP разбирает multipart автоматически, поэтому $_POST конвертируется в urlencoded для исходного Node handler; бизнес-логика не дублируется. JSON/HTML результаты и ошибки relay сохраняются; успешный режим строго dry-run, неожиданный live/missing mode fail-closed. При недоступности upstream возвращается 503, не ложная благодарность.

## Реальная проверка
- 35 маршрутов: 200 и noindex.
- 8 browser viewport checks: главная, G1, X2, подборка; assets decoded, overflow отсутствует, capabilities 16:9.
- Два реальных browser FormData POST: 202 + dry-run header + same-origin /lead/thanks/.
- Отдельный multipart HTTP POST подтвердил channels.amoCRM/telegram.skipped=dry-run.
- Status, JSON POST, unsupported media, HTML fallback tests прошли.
- 8 negative security checks: 400/403/413/405/404.
- Реально остановлен только credential-free prep API: мост вернул 503, после старта восстановился 200/dry-run.
- ZIP и одноразовый распаковщик удалены; PHP probe удалён.

## Повторить проверки
```sh
export KIBER_JINO_PREVIEW_URL=https://jino-preview.kiber-portal.ru
for f in infra/jino-preview/test-jino-bridge*.py; do python3 "$f" || exit; done
```
Тесты обращаются к реальному dry-run preview, не являются заявлением о покрытии PHP в стандартном npm CI. Browser/security evidence относится к опубликованному preview.

## Осторожно с изоляцией
Первоначальная рабочая подпапка внутри технического VR-домена исчезла во время подготовки. Причина/инициатор не установлены. Не восстанавливать её и не складывать КИБЕР в чужой обновляемый document root. Копия вынесена в отдельный домен/каталог.

## Откат подготовки
После решения об откате удалить только новый preview binding/catalog, `alex-kiber-jino-prep-api` и выделенный private config. Сначала проверить, что ресурс никем не используется; не удалять весь hosting container или другие domains. Основной DNS не изменён — откат production для этой подготовки не требуется.

## До публикации
См. readiness.json: previewReady=true, productionCutoverAllowed=false. Нужны отдельный устойчивый API origin/TLS, проверка клиентского rate limiting и мониторинга, production/live конфиг и разрешённая доставка, main-domain binding/TLS на Джино и отдельное согласование DNS. Диагностическая готовность не означает, что эти шаги уже выполнены.
