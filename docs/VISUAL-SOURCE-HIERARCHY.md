# Иерархия визуальных источников

**Статус:** принято.  
**Linear:** KIBER-27 / KP-040.  
**Архитектурное решение:** `docs/DECISIONS/003-controlled-rebuild-and-source-hierarchy.md`.

## Назначение

Документ определяет, какой источник выигрывает при визуальном противоречии. Он не создаёт вторую дизайн-систему и не меняет границы источников правды из `docs/DESIGN-SYSTEM-TZ.md`.

## Обязательный порядок

1. **Утверждённый дизайн и решения владельца** — финальные макеты, дизайн-ревью и принятые reference screenshots.
2. **Машинно-читаемая дизайн-система в Git** — `design-system/tokens/**`, `design-system/blocks/**`, `design-system/recipes/**`, fixtures и generated registry.
3. **Корневая Astro-реализация** — `src/components/**`, `src/layouts/**`, `src/pages/**` и `src/styles/**`; компонент отвечает за DOM, accessibility и поведение.
4. **Live Tilda** — временный reference для parity до cutover, если более высокий источник не определил решение.
5. **Export и legacy archive** — forensic evidence и rollback source без права переопределять принятый дизайн.

Краткая формула:

```text
утверждённый дизайн → design-system в Git → корневой Astro runtime → live Tilda → export/archive
```

`app/` не является целевым runtime. Он используется только как migration source до переноса полезного поведения и подтверждения parity.

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
- Не создавать постоянный код внутри legacy `app/`.
- Не менять `review_id` после утверждения легенды.
- При неопределённости записать вопрос в `OPEN-QUESTIONS.md`, а не угадывать значение.
- Не выполнять merge, production deploy, DNS или изменение secrets без соответствующего разрешения.

## Изменение решения

Если архитектура меняется, новый ADR должен явно пометить `supersedes ADR-003`, обновить этот документ, validator, Hermes rules и traceability. История принятого решения сохраняется.
