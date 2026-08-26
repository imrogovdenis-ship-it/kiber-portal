# КИБЕР ПОРТАЛ

Канонический репозиторий сайта и будущей машинно-читаемой дизайн-системы: `imrogovdenis-ship-it/kiber-portal`.

## Текущий статус

Идёт controlled rebuild. Сохранённый snapshot и legacy Tilda export используются как evidence и rollback source, но не как основа нового runtime.

Текущий `main` содержит полезные Astro-исходники и материалы миграции, но ещё не является воспроизводимым application runtime: в нём отсутствуют package manifest/lockfile, Astro config, production Dockerfile и часть импортируемых файлов. Исторические launch-readiness отчёты описывают прежнее локальное состояние и не заменяют проверку clean clone.

Архитектурное решение предлагается в [ADR-003](docs/adr/003-controlled-rebuild-and-source-hierarchy.md). Карта переноса находится в [controlled-rebuild-inventory](docs/controlled-rebuild-inventory.md), а порядок Linear-задач — в [task-execution-plan](docs/task-execution-plan.md).

## Канонические правила

- Любое изменение выполняется в короткоживущей ветке и попадает в `main` через PR.
- Постоянный `app-v2`, второй runtime и второй production Dockerfile запрещены.
- До DNS cutover действует [freeze изменений Tilda](docs/adr/002-tilda-change-freeze.md).
- Production deploy, DNS, secrets, реальные lead destinations и analytics IDs требуют отдельного approval.
- Старые CSS, component examples, live audits и screenshots пока являются migration evidence, а не окончательным machine-readable source of truth.

## Целевая структура

После controlled rebuild единственный Astro runtime располагается в корне:

```text
design-system/   tokens, schemas, block specs, fixtures, recipes, generators
src/             Astro layouts, components, content, pages, styles, generated files
public/          только runtime public assets
tests/           unit, schema, integration, visual
scripts/         repository and QA tooling
docs/            ADR, ТЗ, traceability, runbooks
package.json
package-lock.json
astro.config.mjs
tsconfig.json
Dockerfile
```

## Иерархия визуальных источников

1. Утверждённый дизайн и review Александра.
2. Machine-readable tokens/specs, Astro components и принятые reference screenshots.
3. Live Tilda как временный reference до cutover.
4. Tilda export и прежние audits как архивное evidence.

До принятия ADR-003 старые файлы не удаляются. Новые дизайн-токены и компоненты также не добавляются как параллельная система внутри неполного `app/`.

## Сохранение и восстановление

Канонический repo и процедура snapshot описаны в:

- [ADR-001](docs/adr/001-canonical-repository.md);
- [KP-002 restore evidence](docs/recovery/kp-002-snapshot.md);
- [KP-003 secret/media audit](docs/security/kp-003-snapshot-audit.md).
