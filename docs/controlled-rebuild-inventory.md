# Controlled rebuild: инвентаризация и карта переноса

Дата: 2026-08-26  
Статус: подготовлено для review  
Linear: KIBER-15, KIBER-17, KIBER-16, KIBER-19, KIBER-27, KIBER-30

## Наблюдаемое состояние `main`

- 1127 tree entries.
- Защищённый snapshot и restore evidence существуют.
- В `app/src/` есть часть Astro pages/components/styles.
- В репозитории нет `package.json`, lockfile, `astro.config`, `tsconfig`, production Dockerfile.
- Отсутствуют импортируемые `BaseLayout.astro`, `RobotCard.astro`, content config и часть style entrypoints.
- Открытых pull request на момент аудита нет.
- Корень содержит несколько конкурирующих дизайн-представлений и полный Tilda export.

Следствие: текущий `main` нельзя считать воспроизводимым application runtime, несмотря на исторические отчёты о прежней локальной сборке.

## Карта путей

| Текущий путь | Роль сейчас | Целевое действие | Задача |
|---|---|---|---|
| `app/src/` | неполный Astro source | выборочно перенести в корневой `src/` | KP-021–023 |
| `app/public/` | runtime public assets | перенести подтверждённые файлы в `public/` | KP-022, KP-068–069 |
| `app/` | временный контейнер runtime | удалить после parity и build | KP-023 |
| `site-export/` | raw Tilda runtime/reference | не переносить в новый runtime; восстановление через snapshot | KP-021–023 |
| `incoming/` | входящие материалы | валидировать и переносить выборочно | KP-022, KP-060–074 |
| `colors_and_type.css` | legacy token CSS + CDN fonts | заменить generated CSS из YAML | KP-040–041 |
| `components.css`, `styles.css` | legacy component CSS | заменить компонентным слоем Astro/generated styles | KP-041–043 |
| `components/` | React/HTML design examples | использовать как evidence, затем удалить | KP-021, KP-043 |
| `preview/` | legacy preview cards | заменить единой Astro design-review page | KP-041, KP-045 |
| `assets/` | примеры/legacy media | классифицировать, перенести только разрешённые | KP-012, KP-068–069 |
| `data/design/*tokens*.json` | live audit evidence | сохранить как reference, не authority | KP-040–041 |
| `data/design/live-screenshots/` | live evidence | сохранить ниже утверждённых references | KP-040, KP-045 |
| `app/src/styles/tokens.css` | ручной token CSS | заменить generated output | KP-041 |
| `docs/kiber-portal-design-system.md` | прежнее описание | пометить superseded и связать с новым ТЗ/registry | KP-040–041 |
| `SKILL.md` | агентская копия правил и токенов | сократить до правил + ссылок на authority | KP-010, KP-040–041 |
| `scripts/validate_*.py` | validators/evidence | перенести только актуальные gates | KP-022, KP-025 |
| `.github/workflows/production-metadata-drift.yml` | действующий monitor | сохранить; не смешивать с deploy | KP-005, KP-025 |

## Целевая корневая структура

```text
/
├── .github/
├── design-system/
│   ├── tokens/{primitive,semantic,component}/
│   ├── schemas/
│   ├── blocks/
│   ├── fixtures/
│   ├── recipes/
│   └── scripts/
├── docs/
├── public/
├── src/
│   ├── components/
│   ├── content/
│   ├── generated/
│   ├── layouts/
│   ├── lib/
│   ├── pages/
│   └── styles/
├── scripts/
├── tests/
├── package.json
├── package-lock.json
├── astro.config.mjs
├── tsconfig.json
└── Dockerfile
```

## Правила переноса

1. Один логический commit — одна проверяемая цель.
2. Сначала создаётся destination и тест, затем удаляется source.
3. Большие/спорные media не переносятся без rights и role audit.
4. Старый source-of-truth не остаётся активным после появления нового.
5. Generated-файлы меняются только генератором.
6. Каждая удаляемая группа должна восстанавливаться из snapshot/tag.
7. До появления package/lock/build не добавляется CI, который заведомо не может пройти.

## Предлагаемые логические commits

1. `docs: approve controlled rebuild architecture (KIBER-14 KIBER-15)`
2. `build: establish root Astro runtime (KIBER-17 KIBER-19)`
3. `chore: migrate approved runtime sources and validators (KIBER-16)`
4. `build: pin dependencies and CI baseline (KIBER-18 KIBER-20)`
5. `design: add machine-readable tokens and font policy (KIBER-27 KIBER-30)`
6. `design: add layouts and robot-card pilot (KIBER-31 KIBER-32)`
7. `chore: retire superseded design/runtime sources` after parity evidence.

## Условия удаления legacy

Удаление разрешается только когда одновременно выполнены:

- destination существует;
- данные/поведение перенесены либо явно отклонены;
- build и релевантные validators проходят;
- diff рассмотрен человеком;
- путь и восстановление указаны в migration evidence.
