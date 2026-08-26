# Трассируемость требований

| Источник/требование | Реализация | Проверка | Статус |
|---|---|---|---|
| ТЗ §3: один источник правды на область | `design-system/`, `src/content.config.ts`, `src/config/site.ts` | `ds:validate` | pilot |
| ТЗ §7: primitive/semantic/component | `design-system/tokens/**` | token schema + reference validation | реализовано |
| Комментарии: compact padding 36→24→16→10 | `spacing.padding.compact` | generated CSS на `sm/md/lg/xl` | реализовано |
| Комментарии: container 1160 | `layout.container.max` | generated CSS | реализовано |
| Блок 05: 4→3→2→2 | `05-robot-card.yaml` | block schema + visual contract test | реализовано |
| Блок 05: badge 92, mobile 48 | component tokens | generated CSS | реализовано |
| Блок 05: чёрная цена | `robot-card.price.color` | component test | реализовано |
| ТЗ §8: полный block contract | `05-robot-card.yaml` | `blockSchema` | реализовано |
| ТЗ §13: payload analytics | `analytics/events.yaml`, `ANALYTICS-CONTRACT.md` | `analyticsSchema` | pilot |
| ТЗ §15: 5 fixture-состояний | `fixtures/robot-card/**` | `ds:validate` | реализовано |
| ТЗ §11.2: сопровождение и no standalone rental | `robotSchema`, `unitree-g1.yaml` | content test | реализовано |
| ТЗ §12.3: preview noindex и отсутствует в production | dynamic preview route + nginx header | visual test + production build | реализовано |
| ТЗ §18: generated drift | `ci.yml` | `git diff --exit-code` | реализовано |
| Шрифты | `fonts.css`, `licenses/FONTS.md` | file existence test | Montserrat готов; Gilroy открыт |

Полное покрытие 34 блоков добавляется после визуального approve вертикального пилота 05.
