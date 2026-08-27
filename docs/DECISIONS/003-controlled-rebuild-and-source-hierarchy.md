# ADR-003: controlled rebuild, единый runtime и иерархия источников

- Статус: принято
- Дата: 2026-08-26
- Принято: 2026-08-26, решение владельца начать консолидацию PR №8/№9 с одной архитектурой
- Linear: KIBER-14 / KP-013, KIBER-15 / KP-020, KIBER-27 / KP-040, KIBER-86 / KP-041A
- Дополняет: ADR-001, ADR-002

## Контекст

В каноническом репозитории одновременно находятся несколько несовместимых представлений сайта и дизайн-системы:

- Astro-исходники в `app/`, но без `package.json`, lockfile, `astro.config`, `tsconfig` и части импортируемых компонентов;
- корневые `colors_and_type.css`, `components.css`, `styles.css`, `components/` и `preview/`;
- `SKILL.md`, `docs/kiber-portal-design-system.md`, JSON-аудиты и CSS, каждый из которых частично заявляет роль источника истины;
- полный Tilda export в `site-export/`;
- входящие материалы в `incoming/`;
- runtime-media в `app/public/` и дополнительные media в других каталогах.

Сохранённый snapshot и аудит уже зафиксированы задачами KP-002 и KP-003. Это позволяет выполнить controlled rebuild без создания постоянного параллельного приложения и без сохранения legacy-runtime в рабочей ветке `main`.

## Решение

### 1. Один application runtime в корне

Целевой Astro runtime располагается в корне репозитория:

```text
/
├── package.json
├── package-lock.json
├── astro.config.mjs
├── tsconfig.json
├── Dockerfile
├── src/
├── public/
├── design-system/
├── docs/
├── scripts/
└── tests/
```

Постоянный `app-v2`, второй package workspace или второй production Dockerfile запрещены. Содержимое `app/` рассматривается как материал миграции и переносится выборочно в корневые `src/` и `public/`. После подтверждения parity каталог `app/` удаляется в том же controlled-rebuild потоке.

### 2. Legacy не является runtime

- `site-export/` остаётся доступным через защищённый snapshot/tag и не входит в целевой runtime.
- Корневые legacy CSS, React/HTML-компоненты и preview-карточки используются только как migration evidence.
- Полезные route registry, media mapping, lead backend, validators и evidence переносятся выборочно по KP-022.
- Спорные, дублирующие или не имеющие подтверждённого происхождения файлы не переносятся.

Удаление legacy-файлов выполняется только после инвентаризации, переноса нужного содержимого и проверки восстановления из snapshot.

### 3. Иерархия визуальных источников

При конфликте применяется следующий порядок:

1. утверждённые материалы и дизайн-ревью Александра, включая `reference-desktop-v9.html` и `reference-mobile-v3.html` как обязательную визуальную основу блоков 01–34;
2. `design-system/tokens/`, block specs, Astro-компоненты и утверждённые reference screenshots;
3. live Tilda как временный визуальный reference до cutover;
4. Tilda export и старые audit-файлы как архивное evidence.

Live Tilda и export не могут автоматически перезаписать утверждённые токены или компоненты.

Операционные правила разрешения конфликтов, обязательные поля PR и границы для Hermes вынесены в `docs/VISUAL-SOURCE-HIERARCHY.md`. Этот документ является пояснением к ADR-003, а не вторым архитектурным решением.

### 4. Источник истины по областям

| Область | Авторитетный источник | Производные файлы |
|---|---|---|
| Значения дизайна | `design-system/tokens/**/*.yaml` | `src/styles/tokens.css`, TypeScript registry |
| Контракт блока | `design-system/blocks/*.yaml` | block registry, review-страница |
| DOM, a11y, поведение | `src/components/**/*.astro` | статический HTML/JS |
| Композиция страниц | `design-system/recipes/*.yaml` | Astro pages/layouts |
| Контент | schema-validated records в `src/content/` и `src/content.config.ts` | страницы |
| Контакты и публичная конфигурация | typed config + разрешённые public env overrides | значения сборки |
| Визуальная основа | `docs/source/reference-desktop-v9.html`, `docs/source/reference-mobile-v3.html`, `design-system/references/visual-source-map.yaml` | block spec traceability и generated reference table |
| Визуальная приёмка | versioned reference screenshots | visual regression artifacts |
| Legacy evidence | snapshot/tag, live audit и export | только сравнение/миграция |

`SKILL.md` остаётся точкой входа для агентов, но после миграции содержит ссылки на эти источники и не дублирует числовые токены.

### 5. Media и шрифты

- Runtime-media хранится в `src/assets/` либо `public/` согласно способу использования.
- Originals не должны бесконтрольно храниться в обычном Git; решение object storage/LFS принимается по KP-012/KP-069.
- Meaningful asset допускается в runtime только после фиксации происхождения, роли, alt-контракта и прав.
- Montserrat может self-hosted использоваться по OFL.
- Перед self-hosting Gilroy требуется подтверждённая web-лицензия; до этого применяется явно задокументированный fallback без Tilda CDN.
- Runtime-зависимость от Tilda CDN запрещена после KP-041.

### 6. Deploy и preview

- GitHub Actions отвечает за проверку, а не за дублирование deploy-механизма Coolify.
- Coolify использует один production Dockerfile и commit SHA.
- Production строится только из принятого `main`.
- PR preview закрыт от индексации и не получает production secrets или production analytics.
- Staging разворачивается после воспроизводимой сборки, CI baseline и выполнения KP-023–025.

### 7. Approval и полномочия агента

- Hermes/Codex работает только в короткоживущей ветке и через PR.
- Изменение design tokens, block specs, recipes, CI, Dockerfile, SEO/legal и аналитики требует human review.
- Production deploy, DNS, secrets, реальные lead destinations и analytics IDs не разрешаются обычным code PR.
- Наличие доступа к GitHub, Linear, Coolify или Tilda не является разрешением на production-действие.

### 8. Rollback

- До cutover Tilda сохраняется как временный production rollback.
- Release image версионируется commit SHA.
- До DNS change выполняется staging rollback rehearsal.
- После cutover проводится smoke, затем наблюдение 24–72 часа.
- Tilda выводится из эксплуатации только после успешного окна наблюдения и отдельного approval.

## Порядок реализации

1. KP-020: создать clean controlled-rebuild branch от канонического `main`.
2. KP-021: разложить перенос на логические reviewable commits.
3. KP-009/KP-012/KP-022: закрыть legacy и media policy, перенести только полезные assets/code.
4. KP-023: поднять один корневой Astro runtime и один Dockerfile.
5. KP-024/KP-025: зафиксировать зависимости и CI baseline.
6. KP-040/KP-041: заменить конкурирующие дизайн-источники машинно-читаемой системой.
7. KP-042/KP-043/KP-044: реализовать layouts, коммерческие компоненты и вертикальный срез.
8. После staging и приёмки продолжить content, lead, QA и release-цепочки.

## Последствия

- Структура с корневыми `src/`, `public/` и `design-system/` принята как единственная целевая архитектура.
- Добавлять дизайн-систему внутрь текущего неполного `app/` как постоянное решение нельзя.
- Старые CSS/JSON/Skill-файлы не удаляются первым коммитом, но получают запланированный статус `superseded` после переноса.
- Документы о прежней успешной локальной сборке остаются историческим evidence и не доказывают, что текущий `main` воспроизводим.
- Миграция считается завершённой только после clean clone, `npm ci`, build, CI и staging preview.

## Не входит в это решение

- DNS/cutover;
- production deploy;
- подключение реальных lead destinations;
- публикация неподтверждённых цен, реквизитов или legal-текстов;
- автоматическое удаление originals и истории Git.
