# Консолидация репозиториев и безопасная очистка диска

Статус: **execution_in_progress; source_consolidation_not_completed**.
Владелец разрешил фиксацию плана в GitHub/Linear и подготовку draft PR консолидации. Это НЕ разрешение на merge, закрытие старых PR, удаление веток/файлов или production.

## Цель
Одна постоянная актуальная `main` canonical-репозитория `imrogovdenis-ship-it/kiber-portal`, воспроизводимые исходники и данные, прозрачный индекс источников истины. После доказанного восстановления — уменьшение числа worktrees и удаление избыточных артефактов. Временные task-ветки допустимы, не новая постоянная линия разработки.

## Источники этого workstream
- [Подробный аудит и план с приложениями](audit-baseline.txt): исторический срез, не текущее разрешение на удаление.
- [Этапы и критерии готовности](execution-plan.md).
- [Машинный статус](status.json): Linear, PR, границы разрешений, текущий checkpoint.
- [Классификация 99 remote branches](branch-groups.json).
- [Локальные ветки без одноимённых remote refs](local-only-refs.json).
- [Содержательная сверка открытых веток](open-branch-content-review.json).
- [Обязательные копии после прошлой ZIP-очистки](protected-prior-cleanup-keepers.json).
- [Подготовка source-консолидации](preparation.md).

## Неизменяемые границы
1. Не `git add .`, не reset/clean грязной рабочей папки, не mass-merge старых веток.
2. Уникальные local commits, dirty/untracked/ignored originals сохраняются до очистки. Общий Git-dir не резервная копия.
3. Публичный repo/`public/` сайта не хранилище секретов, cookies, CRM/клиентских данных и необработанных приватных экспортов. Только разрешённые после проверки материалы.
4. Pending approvals не превращать в approved. SEO current/desired и состояние публикации сохраняются раздельно. Редизайн и переписывание контента не входят в консолидацию.
5. Active runtime/bind mounts, shared dependency providers и keeper-деревья предыдущей очистки защищены.
6. Содержимое ZIP может быть восстановимо без побайтового воспроизведения ZIP/checksum старого upload-helper. Не перезапускать старые deploy scripts.
7. Production/DNS/secrets/analytics/live routing, смена приватности, удаление репозиториев, history rewrite и GC/LFS prune — отдельные решения.
8. Все цифры baseline относятся к моменту аудита; перед действием обязательны свежие SHA/status/consumer checks. Суммы вложенных каталогов не складывать.

## Критерий завершения всей задачи
Remote main содержит проверенный актуальный набор источников/данных; CI и независимое восстановление с медиа подтверждены; старые ветки/PR разобраны с основаниями; файлы удалены только по согласованным allowlist; приватные оригиналы сохранены; runtime не нарушен; экономия подтверждена df. Наличие этого PR само по себе не выполняет эти критерии.

## Трекер
[KIBER-114: задача консолидации](https://linear.app/ai-class/issue/KIBER-114/konsolidaciya-github-odna-aktualnaya-main-sohranenie-istochnikov-i).
