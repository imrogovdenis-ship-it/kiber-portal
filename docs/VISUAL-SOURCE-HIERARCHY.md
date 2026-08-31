# Иерархия визуальных источников

**Статус:** принято.  
**Linear:** KIBER-27 / KP-040; KIBER-86 / KP-041A.  
**Архитектурное решение:** `docs/DECISIONS/003-controlled-rebuild-and-source-hierarchy.md`.

## Назначение

Документ определяет, какой источник выигрывает при визуальном противоречии. Он не создаёт вторую дизайн-систему и не меняет границы источников правды из `docs/DESIGN-SYSTEM-TZ.md`.

## Обязательный порядок

1. **Утверждённый дизайн и решения владельца** — финальные макеты, дизайн-ревью и два принятых базовых HTML-референса: `docs/source/reference-desktop-v9.html` и `docs/source/reference-mobile-v3.html`.
2. **Машинно-читаемая дизайн-система в Git** — `design-system/tokens/**`, `design-system/blocks/**`, `design-system/recipes/**`, fixtures и generated registry.
3. **Корневая Astro-реализация** — `src/components/**`, `src/layouts/**`, `src/pages/**` и `src/styles/**`; компонент отвечает за DOM, accessibility и поведение.
4. **Live Tilda** — временный reference для parity до cutover, если более высокий источник не определил решение.
5. **Export и legacy archive** — forensic evidence и rollback source без права переопределять принятый дизайн.

Краткая формула:

```text
утверждённый дизайн → design-system в Git → корневой Astro runtime → live Tilda → export/archive
```

`app/` не является целевым runtime. Он используется только как migration source до переноса полезного поведения и подтверждения parity.

## Обязательная роль HTML-референсов

По решению владельца от 2026-08-26 файлы `reference-desktop-v9.html` и `reference-mobile-v3.html` являются визуальной основой блоков 01–34, а не архивным evidence. Машинная карта секций и селекторов хранится в `design-system/references/visual-source-map.yaml`; её человекочитаемое представление генерируется в `docs/generated/REFERENCE-TRACEABILITY.md`.

Каждый block spec со статусом `pilot` или `stable` обязан содержать прямую traceability на оба HTML-файла с точным marker и selector из карты. Validator проверяет наличие всех 34 секций в исходных HTML и не допускает дрейф locators.

HTML-референс определяет визуальную композицию, размеры, порядок визуальных элементов и responsive-поведение. Явное более позднее решение владельца или design-review delta имеет больший приоритет. Legal, accessibility, security и подтверждённые business rules сохраняются даже тогда, когда их нет в визуальном макете; такое отклонение документируется в parity-аудите.

## Матрица конфликтов

| Конфликт | Побеждает | Обязательное действие |
|---|---|---|
| утверждённый дизайн vs live Tilda | утверждённый дизайн | обновить spec, fixture и traceability |
| token YAML vs CSS hardcode | token YAML | заменить hardcode ссылкой на token |
| block spec vs component | spec для контракта, component для DOM/a11y | синхронизировать обе стороны и fixture |
| recipe vs порядок в Astro page | recipe | обновить страницу либо recipe отдельным PR |
| live Tilda vs export | live Tilda | export оставить evidence only |
| визуальное предпочтение vs legal/business rule | legal/business rule | адаптировать дизайн без нарушения правила |
| screenshot vs YAML | последний явно принятый источник | указать дату и статус screenshot в traceability |
| принятый HTML reference vs block spec/component | HTML reference для визуальных свойств | обновить tokens/spec/component или зарегистрировать явный override/question |

## Требования к визуальному PR

PR обязан указать:

- Linear issue;
- `review_id` и смысловой block ID;
- изменённый source-of-truth;
- затронутые variants, fixtures и generated files;
- проверенные viewport `375`, `768`, `1024`, `1440`;
- результат CI и preview URL;
- необходимость human visual approval.

Сгенерированные файлы нельзя менять вручную. Новый token, block или variant сначала добавляется в source YAML, проходит schema validation и только затем используется компонентом.

## Правила для Hermes

- Не выводить решение из live/export, если существует принятый spec или review.
- Перед изменением блока найти его locators в `visual-source-map.yaml` и сверить desktop и mobile HTML.
- Не создавать постоянный код внутри legacy `app/`.
- Не менять `review_id` после утверждения легенды.
- При неопределённости записать вопрос в `OPEN-QUESTIONS.md`, а не угадывать значение.
- Не выполнять merge, production deploy, DNS или изменение secrets без соответствующего разрешения.

## Изменение решения

Если архитектура меняется, новый ADR должен явно пометить `supersedes ADR-003`, обновить этот документ, validator, Hermes rules и traceability. История принятого решения сохраняется.
