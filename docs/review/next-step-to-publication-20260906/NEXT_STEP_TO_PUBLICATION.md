# Следующий шаг к публикации — 2026-09-06

## Что уже закрыто

- Новый публичный телефон применён, включая legal docs.
- Popup `Написать нам` реализован и проверен.
- Форма `Оставить заявку` визуально утверждена и закрыта.
- Проверка amoCRM + Telegram duplicate прошла: тестовая заявка дошла.
- Все четыре юридических документа утверждены владельцем.
- Локальные smoke gates по legal/form/readiness проходят.

## Текущее состояние

- Branch: `hermes/kiber-full-site-visual-qa-20260901`
- HEAD: `17c57f65943fe5f5949a45f1084170e232562659`
- Git status entries: `154`
- Current production go/no-go smoke: `NO_GO`, 37 routes, 24 robots, 4 blockers.
- Open PRs: PR #70 full-site visual QA, PR #69 release candidate package.

## Почему статус всё ещё NO-GO

Текущий `production-go-no-go.json` устарел относительно сегодняшних решений: он ещё считает business/legal/form части незакрытыми. При этом остаются реальные gated зоны:

- packaging/stabilization of the large PR8/content workspace;
- dynamic/API runtime for real public form delivery, если хотим тестировать именно через staging URL;
- analytics IDs/cookies — либо defer post-launch, либо отдельный approval;
- final production deploy/DNS permission.

## Рекомендованный следующий шаг

**Стабилизационный release-candidate пакет.**

Смысл: не начинать новые страницы/массовый контент, а быстро упаковать уже утверждённый сайт в чистое проверяемое состояние:

1. Обновить `production-go-no-go` после закрытия legal/form/contact gates.
2. Сформировать manifest утверждённого launch scope: что входит в первую публикацию, что остаётся corpus/review/artifacts.
3. Отделить approved launch code/data от временных screenshot/raw review папок и generated timestamp churn.
4. Прогнать full gates/build.
5. Обновить staging одной проверенной RC-версией.
6. После этого принять решение: либо dynamic lead staging runtime, либо final production/DNS шаг.

## Что НЕ делать прямо сейчас

- Не начинать массовую генерацию страниц.
- Не включать analytics.
- Не менять DNS/production.
- Не раздувать текущий diff новыми визуальными задачами.

## Вывод

Самый быстрый путь к публикации сейчас: **сначала стабилизировать и зафиксировать approved RC-пакет**, затем уже включать dynamic form runtime/production deploy отдельными gated шагами.
