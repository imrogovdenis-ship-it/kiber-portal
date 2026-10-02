# Этапы исполнения

## 0. Закрепить анализ и управление — текущий этап
- Сохранить подробный аудит, ветки и условия предыдущей очистки.
- Создать одну родительскую задачу Linear, привязать GitHub docs и draft PR.
- Не создавать новый competing source-of-truth repo.
Готово: документы доступны по GitHub URL, задача прочитана обратно, ссылки взаимны.

## 1. Сохранность и подготовка source PR
- Свежий inventory common Git dirs, HEAD/status, untracked/ignored источников; координация параллельных писателей без самовольной остановки процессов.
- Персонально классифицировать 8 local-only commit heads, 5 dirty worktrees и кандидатов из основной папки.
- Разделить source/data/media/tests, финальные evidence, приватные originals и generated/temp.
- Создать проверенные частные snapshot/manifest для явно выбранных локальных источников; не называть частичный snapshot полным backup.
- Проверить secret/PII/media rights. Публичные файлы — explicit allowlist, не весь workspace.
Готово: disposition каждой группы, проверенные keeper hashes, нет необъяснённой потери, blockers описаны.

## 2. Консолидация актуального source tree в draft PR
- Из свежей main собрать изолированный кандидат без изменений рабочей папки и без подмены актуальной реализации старыми PR.
- Смысловые коммиты: contracts/approvals/index; runtime/data/tests/media; безопасные SEO/research/runbooks.
- Уточнить устаревший README и указатель источников истины; не дублировать data registries.
- Выборочно забрать missing evidence из старых веток и приватного legacy repo, не второй runtime.
Готово: manifest источников и исключений, clean staged diff, секреты отсутствуют, все связанные runtime assets учтены. Draft остаётся без merge.

## 3. Проверка кандидата
- Прочитать package scripts, не устанавливать системные зависимости на shared host без разрешения.
- Независимый checkout/install/build/targeted tests; media/LFS availability и materialized hashes.
- Полные подходящие CI gates; bounded verification без бесконечного polling.
- Проверка контрактов/SEO current-desired/approval status и отсутствия регресса принятых UI/текстов.
- Если needed Jino preview — отдельный подтверждённый preview-only scope; production не публиковать.
Готово: реальные логи с SHA и pass/fail, известные ограничения, review-ready PR. Только после отдельного разрешения переход к merge.

## 4. Согласованный merge и GitHub hygiene — ЗАПРЕЩЕНО НА ТЕКУЩЕМ ЭТАПЕ
- Merge только после разрешения и свежего CI; короткий bounded post-merge check.
- 41 ancestral branch, включая 27 open PR: подтвердить включение и отсутствие зависимостей, закрыть superseded PR, удалить refs по отдельному согласованному списку.
- 33 merged/non-ancestor: squash/rebase/content сверка; проверить late commits.
- 18 open/non-ancestor и 6 остальных: выбрать useful source, historical evidence или rejected drafts; каждое решение записать.
- Приватный legacy repo: сохранить нужное и согласовать архивацию, не удалять автоматически.
- Защиту main и auto-delete merged task branches согласовать с администратором (текущий доступ не admin).
Готово: одна актуальная постоянная main, все остальные refs имеют обоснованное решение; откатные версии не потеряны.

## 5. Независимое восстановление и разрешённая очистка диска — ЗАПРЕЩЕНО НА ТЕКУЩЕМ ЭТАПЕ
- Проверить восстановление remote main с LFS/исходными документами и отдельно закрытых данных; локальный git не доказательство off-host backup.
- Frozen allowlist: старые worktrees, temporary builds, reinstallable dependencies, дубли review. Не обещать весь measured footprint как savings.
- Перед unlink: проверить keeper hash, active processes/fd/helper/schedules/mounts/symlinks, shared providers.
- Сохранить rollback/runtime, исходные документы и final acceptance; прежние ZIP keepers не удалить без другого доказанного восстановления.
- Удалять только после разрешения, без global Docker prune/чужих сервисов.
Готово: verified deletion log, df до/после, исходники/keepers неизменны, сервисы исправны.

## 6. Закрытие и профилактика
- Обновить README/SOURCE-OF-TRUTH index, lifecycle временных веток и каталогов.
- Финальный TXT: что сохранено, где восстановить, что удалено, сколько реально освобождено, что отложено.
- Linear Done только после фактических критериев; выполненный аудит/созданный draft не равен готовой консолидации.

## Уже выполненное до этой задачи
- Предыдущая согласованная очистка: шесть старых worktrees и проверенные временные дубли; сообщённый прирост свободного места 6.11 ГБ — историческое наблюдение df, не гарантия неизменного свободного места.
- Сохранены 89 unmatched files; проблемный worktree и семь Python окружений не удалялись. Локальное Git+LFS recovery проверено; полный сетевой clone не уложился в timeout.
- ZIP audit: 50 архивов. По отдельному разрешению удалено 18 (629788672 allocated bytes); 32 сохранены; 14 unpacked trees и retained archive anchors подтверждены SHA256. Эти копии остаются защищёнными.
- Новый baseline: 99 remote branches / 45 open PR, 31 local Git working dirs, 119 tracked changes; 618 предварительных source candidates. Данные исторические, обновлять перед исполнением.

## Отложенное вне scope
Очередь лидов, внешний watchdog и полное API/host restoration не запускать по этой задаче: ранее отложенные KIBER-98/99/13 не являются скрытыми подзадачами GitHub hygiene. Production и дизайн approval не следуют из консолидации.
