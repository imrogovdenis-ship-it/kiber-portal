# API runtime — тестовый кандидат поверх PR #88

Production NO_GO. Новый runtime находится в целях api/web единственного Dockerfile: source-built web (Nginx) + bundled Node API. Цель runtime по умолчанию остаётся статической и не предназначен для финальной отправки заявок.

## Безопасный тест
`BUILD_SHA=$(git rev-parse HEAD) docker compose -f compose.api-preview.yml build`
`BUILD_SHA=$(git rev-parse HEAD) docker compose -f compose.api-preview.yml up -d`
Только контейнеры alex-kiber-runtime-qa-api/web, отдельная internal-сеть, без ports/Traefik/volumes/секретов. API dry-run; это НЕ реальная доставка. Production content собран на публичных маршрутах, но сеть не публичная.

## Откат теста
`BUILD_SHA=$(git rev-parse HEAD) docker compose -f compose.api-preview.yml down`
Удаляются только тестовые контейнеры/сеть. Существующие staging/production не заменяются. Не использовать down -v или global prune.

## Проверки
HTTP API tests, собранная Nginx→Node цепочка, браузер desktop/mobile: G1→форма→POST→thanks. Невалидные/чужие Origin/oversize/disabled должны отклоняться. /healthz/ — liveness, /api/leads/status — текущая configuration readiness, не подтверждение CRM-доставки.

## Предусловия live — отдельное разрешение
Секреты только через существующий 1Password/env workflow. Требуются enabled=true, mode=live, configured amoCRM+Telegram+allowed origins; для DEPLOY_ENV=production дополнительно LEAD_PRODUCTION_APPROVED=true. В этом пакете значения секретов отсутствуют и live режим не включается.
Внешний gateway должен доверенно устанавливать client IP; не публиковать API-порт наружу. Preview internal-сеть намеренно запрещает внешний доступ; для live потребуется отдельно утверждённый сетевой контур.

## Оставшиеся границы
Rate-limit/idempotency cache существующего handler — process-local, один API процесс. Перезапуск сбрасывает cache; multi-replica/durable retry не обещаются. Реальная доставка и ошибки провайдеров требуют отдельного разрешённого теста. Rollback production и merged-main image не проверены этим закрытым тестом. Содержимое страниц и дизайн не менялись.
