# План выполнения задач Linear

Дата аудита: 2026-08-26  
Команда: «Кибер Портал»  
Охват: 84 задачи, 7 проектов

## Состояние на момент аудита

После исправления ошибочно запущенных задач и старта архитектурного пакета:

- завершено: 7, включая тест интеграции Linear;
- в работе: KP-008 у Denis Rogov, а также документационный пакет KP-013/KP-020;
- дизайн-задачи KP-040, KP-041 и KP-043 возвращены в Backlog до закрытия blockers;
- формальные `blockedBy/blocks` почти не настроены: зависимости в основном существуют только текстом в описаниях.

Номер `KIBER-*` — идентификатор Linear. Порядок работ задаётся номером `KP-*` и зависимостями, а не номером KIBER.

## Волна 0 — уже завершённые guardrails

- KP-001 — канонический репозиторий.
- KP-002 — защищённый snapshot и restore evidence.
- KP-003 — secret/media audit snapshot.
- KP-004 — freeze изменений Tilda.
- KP-005 — monitor production metadata drift.
- KP-007 — закрыт внешний Docker-порт.
- Тестовая KIBER-1 — интеграция Linear подтверждена и закрыта.

KP-008 выполняется отдельно Denis Rogov; controlled rebuild не должен менять production secrets или Coolify env.

## Волна 1 — решения и безопасное начало

- KP-013 — ADR: repo, Tilda, design, media, deploy, approval, rollback.
- KP-020 — clean controlled-rebuild branch.
- KP-009 — перевести вторичный repo в legacy/read-only; фактически блокирует urgent KP-022.
- KP-012 — media storage policy; должна предшествовать переносу media.
- KP-011 — backup/restore сервера; должна быть gate перед staging-инфраструктурой.
- KP-064 — registry 44 production URL можно собирать read-only параллельно.
- KP-062 — контакты/реквизиты требуют решения владельца и не должны угадываться агентом.
- KP-033 — monitoring decision может выполняться отдельно от application rebuild.
- KP-073 — semantic-core lifecycle не блокирует foundation и остаётся отдельной content-задачей.

KP-006 конфликтует с freeze Tilda: выполнять только как согласованное исключение либо после cutover в route/redirect-контуре.

## Волна 2 — controlled rebuild и платформа

Критическая цепочка:

```text
KP-020
  ├─> KP-021 ─┐
  └─> KP-022 ─┴─> KP-023 -> KP-024 -> KP-025 -> KP-026
```

- KP-021 — logical commits/review snapshot.
- KP-022 — перенос только route registry, media mapping, lead backend, validators и evidence; также требует KP-009 и media policy.
- KP-023 — один root Astro runtime и один Dockerfile.
- KP-024 — pinned dependencies + valid lockfile + `npm ci`.
- KP-025 — CI: build, unit/schema, links, 404, secret scan.
- KP-026 — закрытый staging Coolify/Traefik.
- KP-027/KP-028/KP-029/KP-030/KP-031/KP-032 — headers/resources/images/rollback/404/server stability после соответствующих gates.

## Волна 3 — дизайн-система и вертикальный срез

```text
KP-013 -> KP-040 -> KP-041 -> KP-042 ─┐
                               KP-043 ─┴─> KP-044 -> KP-045 -> KP-046
```

- KP-040 — визуальная иерархия.
- KP-041 — machine-readable tokens, font/asset license policy, отсутствие Tilda CDN.
- KP-042 — BaseLayout, SeoHead, Header, Footer, Breadcrumbs.
- KP-043 — Hero, RobotCard/Grid, Pricing, FAQ, CTA/Form со states и responsive.
- KP-044 — главная → robot card → lead → confirmation на staging.
- KP-045 — утверждённые references; имеющиеся screenshots остаются evidence до приёмки.
- KP-046 — visual regression после references и CI.
- KP-047/KP-048/KP-049/KP-050 — a11y, чистый public UI, feature flag form, performance.

Реализацию KP-041 нельзя размещать как постоянное дополнение внутри старого неполного `app/`; она следует за решением о единственном runtime.

## Волна 4 — данные, content и SEO

- KP-060 → KP-061: schema robot/price и разрешение ценовых конфликтов.
- KP-062 → KP-063: контакты/реквизиты, legal и правила цен.
- KP-064 → KP-065 → KP-066: URL inventory, решения по URL, route/redirect registry.
- KP-067: 24 robots через единый RobotPage после KP-043, KP-060, KP-061.
- KP-068 → KP-069: media rights/roles, затем оптимизация и вывод originals из обычного Git.
- KP-070: review notes отделяются от public content.
- KP-071/KP-072/KP-073: metadata/schema, controlled internal links, semantic-core lifecycle.
- KP-074: content acceptance только после KP-061–073.

## Волна 5 — leads, legal и analytics

- KP-080 — утверждённые lead channels/requisites.
- KP-081 → KP-082 → KP-083: Lead API, resilience/idempotency, Telegram + amoCRM + fallback.
- KP-084 — consent UI после legal и commercial components.
- KP-085/KP-086 — structured logs/backup и `/api/leads/status`.
- KP-087 — разрешённые E2E submissions после KP-083–086 и vertical slice.
- KP-088 → KP-089 — analytics/consent policy и provider-neutral event contract.
- KP-090 — monitoring leads/site после lead integration и monitoring decision.

## Волна 6 — release

- KP-100 — полный crawl staging после routes, metadata и content acceptance; также фактически требует доступного KP-026 staging.
- KP-101 — full mobile/desktop/a11y/visual QA; фактически требует staging.
- KP-102 — проверка forms, analytics, robots, sitemap, redirects после KP-087–090 и KP-100; рекомендуется также gate KP-101.
- KP-103/KP-104 — rollback rehearsal и финальный backup.
- KP-105 — release image + commit SHA + approval.
- KP-106 — DNS cutover.
- KP-107 — post-cutover smoke.
- KP-108 — наблюдение 24–72 часа.
- KP-109 — Tilda rollback window, затем decommission.

## Волна 7 — после запуска

KP-120–128 остаются вне MVP/release critical path: media library, PDF proposal, content-package workflow, link suggestions, editorial helpers, GEO/AEO, public chat, messaging channels и store/checkout.

У этих задач сейчас нет формальных зависимостей. Их нельзя считать готовыми к старту только из-за отсутствия `blockedBy`; проектная фаза должна быть дополнительно связана минимум с KP-108/KP-109.

## Найденные проблемы планирования

1. Почти все зависимости записаны текстом, но отсутствуют как Linear relations.
2. KP-009 и KP-013 имеют High, хотя блокируют Urgent-цепочки; их эффективный приоритет — Urgent.
3. KP-012 должна блокировать media-часть KP-022.
4. KP-011 должна быть infrastructure gate до staging.
5. KP-006 конфликтует с принятым freeze Tilda.
6. KP-041 implementation должна учитывать завершение single-runtime KP-023.
7. KP-100 и KP-101 не имеют явной зависимости от staging KP-026.
8. KP-102 не имеет явного gate от финального visual QA KP-101.
9. KP-120–128 не имеют post-launch blockers.
10. Existing screenshots и design files нельзя автоматически считать выполнением KP-040/041/045: они legacy evidence и не утверждены в новой иерархии.

## Правило статусов

- `In Progress` — только если все обязательные predecessors завершены либо есть документированное исключение.
- `In Review` — commit/PR или иной evidence существует и ожидает human approval.
- `Done` — критерий готовности выполнен, evidence прикреплён, PR принят при наличии code change.
- Production/infra задачи не закрываются только документом или локальной проверкой.
