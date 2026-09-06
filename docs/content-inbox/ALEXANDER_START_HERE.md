# Инструкция Александру: запуск Claude → GitHub → Hermes content pipeline

## Что делаем

Claude больше не передаёт файлы руками. Он создаёт JSON content package в GitHub. Hermes по расписанию или webhook видит новый package, валидирует его, маппит в preview-only страницу, создаёт PR/evidence и ждёт твоего утверждения.

## Что нужно от тебя на старте

1. Выбрать первый пилот:
   - одна статья (`article_detail`), или
   - одна подборка (`compilation`), или
   - одна карточка робота (`robot_card`).
2. Дать Claude исходный текст/материалы.
3. Сказать Claude использовать файл `docs/content-inbox/CLAUDE_GITHUB_CONTENT_PACKAGE_PROMPT.md`.
4. Попросить Claude сделать PR/commit только с файлом:
   ```text
   data/content-inbox/claude/packages/<taskId>.content-package.json
   ```
5. Не просить Claude менять дизайн, компоненты, production, DNS, аналитику или лиды.

## Что делает Hermes

1. Проверяет inbox:
   ```bash
   python3 scripts/intake_claude_content_packages.py --dry-run --write-report
   ```
2. Проверяет общий контракт:
   ```bash
   python3 scripts/validate_claude_content_contracts.py
   node --test tests/content-contracts/claude-content-inbox.test.mjs
   ```
3. Делает mapper dry-run:
   ```bash
   python3 scripts/map_claude_package_to_preview.py data/content-inbox/claude/packages/<file>.content-package.json
   ```
4. Если всё pass — создаёт preview route/data branch.
5. Запускает build/smoke/noindex/SEO checks.
6. Создаёт PR и Linear evidence.
7. Ждёт твоего approval.

## Безопасность

Автоматизация не имеет права:

- публиковать сайт;
- переключать DNS;
- включать analytics;
- включать live lead routing;
- менять secrets;
- менять approved design;
- merge без тебя.

## Первый рекомендуемый pilot

Начать с `article_detail`, потому что article template уже утверждён, а неудачный DOCX-прототип показал, зачем нужен строгий JSON package.
