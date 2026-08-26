# Иерархия визуальных источников

**Статус:** proposed, ожидает финального approve владельца дизайна.  
**Linear:** KIBER-27 / KP-040.  
**ADR:** `docs/DECISIONS/0001-visual-source-hierarchy.md`.

## Назначение

Этот документ говорит Hermes, разработчикам и ревьюерам, какой источник считать главным при визуальных противоречиях. Он нужен перед фиксацией design tokens, specs, recipes и reference screenshots.

## Иерархия источников

Короткая формула для Linear KIBER-27:

```text
Дизайн Александра → tokens/components/screenshots → live Tilda reference → export archive
```

### 1. Утверждённый дизайн Александра

Главный источник визуальных решений:

- финальные макеты и визуальный слой;
- утверждённые дизайн-правки;
- утверждённые screenshots desktop/tablet/mobile;
- явные решения владельца дизайна.

Если этот источник конфликтует с текущим сайтом, побеждает новый дизайн.

### 2. Машинно-читаемая дизайн-система в Git

После переноса в repo источником правды становятся:

```text
design-system/tokens/**/*.yaml
design-system/blocks/*.yaml
design-system/recipes/*.yaml
design-system/fixtures/**
```

Она определяет tokens, variants, block contracts, recipes, fixtures и validation rules. Generated CSS/TS/docs считаются производными.

### 3. Astro implementation baseline

Текущая Astro-реализация используется как проверенный implementation baseline:

```text
app/src/components/**
app/src/styles/**
app/src/pages/**
app/src/content.config.ts
```

Она важна для DOM, accessibility, SEO, routing и real build. Но если component/CSS расходится с утверждённым token/spec, правится component/CSS, а не spec задним числом.

### 4. Live Tilda/current production reference

Live-сайт используется как reference для parity, пока новый дизайн или spec не переопределил конкретный блок. Он полезен для:

- сверки композиции;
- исходной бизнес-логики блоков;
- проверки, что миграция не потеряла важный смысл.

Но live Tilda не является главным источником после утверждения новой дизайн-системы.

### 5. Export/archive/source captures

Архивные источники:

```text
site-export/**
content-source/**
data/source-capture/**
data/live-site-audit/**
legacy screenshots/audit JSON
```

Используются как forensic backup и вспомогательные материалы. Они не должны автоматически переопределять дизайн, tokens, specs или текущие business/legal decisions.

## Матрица конфликтов

| Если конфликтуют | Что делать |
|---|---|
| Александр/design vs live Tilda | принять design, записать отклонение от live в traceability |
| token vs CSS hardcode | заменить hardcode token reference или оформить исключение |
| block spec vs component | синхронизировать contract, component и fixture |
| recipe vs Astro page order | привести page order к recipe или обновить recipe отдельным PR |
| live Tilda vs export archive | считать live более свежим, archive — evidence only |
| visual preference vs legal/business rule | legal/business rule выше визуального решения |
| screenshot vs YAML spec | проверить дату/статус screenshot; accepted screenshot может обновить spec через PR |

## Что Hermes должен делать в PR

Каждый PR с визуальным изменением обязан указать:

- Linear issue;
- затронутые `review_id` / block ids;
- какой source-of-truth изменён;
- какие generated files обновлены;
- какие fixtures/screenshots проверены;
- viewport: 375, 768, 1024, 1440 или почему меньше;
- какие проверки запускались;
- нужен ли human visual approval.

## Что нельзя делать

- Нельзя переносить случайный CSS из export archive как новый стандарт.
- Нельзя использовать live Tilda как единственный аргумент против утверждённого дизайна.
- Нельзя менять generated files вручную.
- Нельзя добавлять новый variant без fixture/test.
- Нельзя закрывать visual task без evidence или явного human approval, если критерий требует approval.

## Definition of Done для KIBER-27

Задача считается технически готовой к review, когда:

- ADR создан;
- эта иерархия зафиксирована в docs;
- validator проверяет наличие ключевых источников/правил;
- Linear issue содержит ссылку на branch/PR;
- финальный статус остаётся `In Review` до approve Александра.

Финальное закрытие `Done` возможно только после подтверждения владельца дизайна.
