# ADR 0001: Иерархия визуальных источников КИБЕР ПОРТАЛ

- **Статус:** proposed / требует финального approve владельца дизайна
- **Дата:** 2026-08-26
- **Linear:** KIBER-27 / KP-040
- **Связанные решения:** KP-013, KP-041, KP-045

## Контекст

Проект КИБЕР ПОРТАЛ уже имеет Astro-реализацию, материалы из live/export источников, SEO- и launch-readiness gates. Следующий слой работ — машинно-читаемая дизайн-система: tokens, block specs, recipes, fixtures, visual baselines и PR-процесс.

Чтобы Hermes, разработчики и ревьюеры не выбирали разные «источники правды» для внешнего вида, нужна явная иерархия визуальных источников. Она определяет, какой источник выигрывает при конфликте между новым дизайном, текущей Astro-реализацией, live-сайтом, экспортом и архивными материалами.

## Решение

Утвердить следующую иерархию визуальных источников, от наиболее авторитетного к наименее авторитетному:

1. **Утверждённый дизайн Александра**
   - финальные макеты, визуальный слой, дизайн-правки и явные решения владельца;
   - включает утверждённые desktop/tablet/mobile reference screenshots, когда они появятся;
   - выигрывает у live-сайта и export archive.

2. **Машинно-читаемая дизайн-система в Git**
   - `design-system/tokens/**/*.yaml`;
   - `design-system/blocks/*.yaml`;
   - `design-system/recipes/*.yaml`;
   - `design-system/fixtures/**`;
   - generated files и validators.

3. **Astro-компоненты и текущие validated implementation patterns**
   - `app/src/components/**`;
   - `app/src/styles/**`;
   - `app/src/pages/**`;
   - rendered QA evidence в `data/design/parity-screenshots/**` и `docs/visual-parity-report.md`.

4. **Live Tilda/current production reference**
   - используется как parity/reference source для блоков, пока новый дизайн или spec не переопределили его;
   - не является источником истины для новых решений после утверждения дизайн-системы;
   - не используется для восстановления ошибочных/устаревших UX-паттернов.

5. **Export/archive/source captures**
   - `site-export/**`, `content-source/**`, `data/source-capture/**`, legacy screenshots и audit JSON;
   - используется как evidence, forensic backup и источник для миграции;
   - не может самостоятельно переопределять утверждённые tokens/specs/components.

## Правила разрешения конфликтов

| Конфликт | Побеждает | Действие |
|---|---|---|
| Новый дизайн vs live-сайт | Новый утверждённый дизайн | Зафиксировать в ADR/TRACEABILITY и обновить spec/fixture |
| Token YAML vs CSS/component hardcode | Token YAML | Исправить component/CSS или объявить техническое исключение |
| Block spec vs component behavior | Block spec для контракта; component для DOM/a11y implementation | Обновить несовпадающую сторону и fixture |
| Recipe vs страница Astro | Recipe | Обновить страницу/registry или recipe через PR |
| Live-site reference vs export archive | Live-site reference | Export archive остаётся forensic backup |
| SEO/Legal/business rule vs visual preference | Legal/business rule | Визуальное решение адаптируется без нарушения правил |

## Обязательные последствия

1. Любая визуальная правка должна указывать источник изменения: `design`, `token`, `block-spec`, `recipe`, `component`, `live-reference` или `archive`.
2. Для нового/изменённого блока требуется fixture или обновлённый reference screenshot.
3. Нельзя вносить новый визуальный hardcode в компонент без token/spec или задокументированного исключения.
4. Live Tilda больше не может быть единственным аргументом «так должно быть», если есть утверждённый дизайн или дизайн-система.
5. Export archive не используется как production wording/visual authority без дополнительной проверки.
6. PR должен перечислять затронутые `review_id`, source-of-truth и проверенные viewport.

## Граница утверждения

Этот ADR можно использовать как рабочий proposed-контракт прямо сейчас. Финальный статус `accepted` ставится после того, как Александр подтвердит:

- визуальный слой передан и считается верхним источником;
- live Tilda остаётся только fallback/reference до полного перехода;
- текущая Astro-реализация может быть временным implementation baseline, но не блокирует утверждённые design tokens/specs.

## Проверка

- `scripts/validate_visual_source_hierarchy.py --root . --json`
- `python3 scripts/run_launch_qa.py`

## Rollback

Если решение меняется, нужно:

1. создать новый ADR с supersedes/replaces;
2. обновить `docs/visual-source-hierarchy.md`;
3. обновить validators и PR template/agent rules;
4. оставить историю принятого решения в Git.
