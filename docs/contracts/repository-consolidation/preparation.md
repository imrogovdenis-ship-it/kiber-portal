# Подготовка PR консолидации — checkpoint 1

Tracker: [KIBER-114](https://linear.app/ai-class/issue/KIBER-114/konsolidaciya-github-odna-aktualnaya-main-sohranenie-istochnikov-i).

## Что реально выполнено
- Изолированная task-ветка `chore/repository-consolidation-plan` создана от remote main `f13efdc7ac00c50bcb975bcec9504a63af936cba`. Исходная рабочая папка не переключалась/не очищалась.
- Сохранены 1004 выбранных файла: существующие изменённые tracked-файлы из dirty worktrees, предварительные source/document кандидаты и новые публичные изображения. Архив прочитан обратно, SHA256 каждого вложения проверен.
- Восемь local-only branch heads сохранены в отдельном Git bundle; `git bundle verify` успешен, все 8 refs присутствуют.
- Резервные файлы находятся только в приватном task-owned локальном каталоге с ограниченными правами. Они НЕ включены в этот публичный PR. Это не off-host backup.
- В PR входят только план, аудит, правила и preparation status. Актуальный runtime/data source tree ещё не перенесён: запрещено считать документационный draft полной консолидацией.

## Что эта копия НЕ доказывает
Это не полный backup всех ignored/untracked/review/private original файлов, всей машины или всех LFS payloads. Git bundle хранит Git objects, не содержимое LFS. Данные на одном диске не защищены от его потери. Удаление оригиналов по факту этой копии запрещено.

## Следующий checkpoint этой же задачи
1. Рассортировать сохранённые sources и дополнительные исходные документы: approved/current, draft, superseded, private, generated. Сверить файлы 8 локальных веток, не сливать их вслепую.
2. Проверить secret/PII/media rights у каждого публичного candidate. Документы внутри public/docs отдельно проверить как реально публикуемые сайтом.
3. Зафиксировать source allowlist/exclusions; добавлять актуальные code/data/tests/media согласованными пакетами в эту же draft-ветку (либо связанную source PR, если размер потребует разделения).
4. Независимая чистая сборка и тесты, source preservation diff, свежий CI. До этих результатов PR остаётся draft.

## Разрешения
Подготовка разрешена владельцем. Merge, удаление веток/файлов, закрытие старых PR и production не разрешены. Новых UI/контентных approval этот checkpoint не выдаёт.
