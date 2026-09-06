# Linear sync after PR70 merge — 2026-09-06

```json
{
  "generatedAt": "2026-09-06T15:36:30.915889Z",
  "source": "Linear GraphQL read-only sync; no Linear statuses changed.",
  "team": {
    "id": "adf1d08a-2c74-4ed2-b59e-aeba5678438b",
    "key": "KIBER",
    "name": "Кибер Портал"
  },
  "counts": {
    "total": 97,
    "selected": 82,
    "openSelected": 22,
    "urgentOpen": 12,
    "highOpen": 9
  },
  "mainHead": "12ef3d6dd54f1fc5c6ef780eb14e126cd0d51ea3",
  "mainRcStaging": "docs/review/main-rc-after-pr70-20260906/summary.json",
  "classification": [
    {
      "identifier": "KIBER-10",
      "title": "[KP-008] Исправить права `.env` и перенести production secrets в Coolify",
      "priority": "Urgent",
      "state": "In Progress",
      "classification": "secrets_ops_blocker",
      "note": "production secrets/Coolify env migration remains blocked until production runtime decision; do not modify secrets now.",
      "url": "https://linear.app/ai-class/issue/KIBER-10/kp-008-ispravit-prava-env-i-perenesti-production-secrets-v-coolify"
    },
    {
      "identifier": "KIBER-16",
      "title": "[KP-022] Выборочно перенести полезные активы из legacy repo",
      "priority": "Urgent",
      "state": "Backlog",
      "classification": "defer_unless_missing_assets_found",
      "note": "approved main RC does not require more legacy asset transfer now.",
      "url": "https://linear.app/ai-class/issue/KIBER-16/kp-022-vyborochno-perenesti-poleznye-aktivy-iz-legacy-repo"
    },
    {
      "identifier": "KIBER-57",
      "title": "[KP-080] Утвердить каналы и реквизиты лидов",
      "priority": "Urgent",
      "state": "Backlog",
      "classification": "production_runtime_decision_blocker",
      "note": "source/API integration evidence exists, but production dynamic runtime/secrets/live destinations require explicit approval; safe next: dynamic staging runtime test from main.",
      "url": "https://linear.app/ai-class/issue/KIBER-57/kp-080-utverdit-kanaly-i-rekvizity-lidov"
    },
    {
      "identifier": "KIBER-58",
      "title": "[KP-083] Настроить Telegram + amoCRM и резервный канал/очередь",
      "priority": "Urgent",
      "state": "Backlog",
      "classification": "production_runtime_decision_blocker",
      "note": "source/API integration evidence exists, but production dynamic runtime/secrets/live destinations require explicit approval; safe next: dynamic staging runtime test from main.",
      "url": "https://linear.app/ai-class/issue/KIBER-58/kp-083-nastroit-telegram-amocrm-i-rezervnyj-kanalochered"
    },
    {
      "identifier": "KIBER-59",
      "title": "[KP-084] Добавить consent checkbox и ссылки на legal",
      "priority": "Urgent",
      "state": "Backlog",
      "classification": "likely_satisfied_needs_linear_evidence",
      "note": "consent checkbox/legal links implemented and CI/form tests pass; can comment/close only with permission.",
      "url": "https://linear.app/ai-class/issue/KIBER-59/kp-084-dobavit-consent-checkbox-i-ssylki-na-legal"
    },
    {
      "identifier": "KIBER-62",
      "title": "[KP-107] Выполнить post-cutover smoke",
      "priority": "Urgent",
      "state": "Backlog",
      "classification": "post_cutover_only",
      "note": "must wait until production deploy/DNS approval.",
      "url": "https://linear.app/ai-class/issue/KIBER-62/kp-107-vypolnit-post-cutover-smoke"
    },
    {
      "identifier": "KIBER-64",
      "title": "[KP-087] Провести разрешённые end-to-end тестовые заявки",
      "priority": "Urgent",
      "state": "Backlog",
      "classification": "production_runtime_decision_blocker",
      "note": "source/API integration evidence exists, but production dynamic runtime/secrets/live destinations require explicit approval; safe next: dynamic staging runtime test from main.",
      "url": "https://linear.app/ai-class/issue/KIBER-64/kp-087-provesti-razreshyonnye-end-to-end-testovye-zayavki"
    },
    {
      "identifier": "KIBER-68",
      "title": "[KP-104] Сделать финальный backup Tilda, sitemap и production data",
      "priority": "Urgent",
      "state": "Backlog",
      "classification": "pre_cutover_or_external_decision",
      "note": "not closed by code merge; needs owner/Denis/business/infrastructure decision or separate safe prep.",
      "url": "https://linear.app/ai-class/issue/KIBER-68/kp-104-sdelat-finalnyj-backup-tilda-sitemap-i-production-data"
    },
    {
      "identifier": "KIBER-7",
      "title": "[KP-006] Удалить `/test-blok` и blank page из Tilda/sitemap",
      "priority": "Urgent",
      "state": "Backlog",
      "classification": "pre_cutover_or_external_decision",
      "note": "not closed by code merge; needs owner/Denis/business/infrastructure decision or separate safe prep.",
      "url": "https://linear.app/ai-class/issue/KIBER-7/kp-006-udalit-test-blok-i-blank-page-iz-tildasitemap"
    },
    {
      "identifier": "KIBER-70",
      "title": "[KP-105] Собрать release image с commit SHA и получить approval",
      "priority": "Urgent",
      "state": "In Review",
      "classification": "satisfied_by_main_rc_staging_needs_owner_approval_or_linear_update",
      "note": "main SHA-tagged staging image built/deployed and healthy; no production; can update Linear evidence if allowed.",
      "url": "https://linear.app/ai-class/issue/KIBER-70/kp-105-sobrat-release-image-s-commit-sha-i-poluchit-approval"
    },
    {
      "identifier": "KIBER-72",
      "title": "[KP-106] Переключить DNS на новую production-версию",
      "priority": "Urgent",
      "state": "Backlog",
      "classification": "post_cutover_only",
      "note": "must wait until production deploy/DNS approval.",
      "url": "https://linear.app/ai-class/issue/KIBER-72/kp-106-pereklyuchit-dns-na-novuyu-production-versiyu"
    },
    {
      "identifier": "KIBER-75",
      "title": "[KP-108] Наблюдать production 24–72 часа",
      "priority": "Urgent",
      "state": "Backlog",
      "classification": "post_cutover_only",
      "note": "must wait until production deploy/DNS approval.",
      "url": "https://linear.app/ai-class/issue/KIBER-75/kp-108-nablyudat-production-24-72-chasa"
    },
    {
      "identifier": "KIBER-11",
      "title": "[KP-009] Перевести `kiber-portal-site` в legacy/read-only",
      "priority": "High",
      "state": "Backlog",
      "classification": "pre_cutover_or_external_decision",
      "note": "not closed by code merge; needs owner/Denis/business/infrastructure decision or separate safe prep.",
      "url": "https://linear.app/ai-class/issue/KIBER-11/kp-009-perevesti-kiber-portal-site-v-legacyread-only"
    },
    {
      "identifier": "KIBER-13",
      "title": "[KP-011] Проверить backup сервера и выполнить тест восстановления",
      "priority": "High",
      "state": "Backlog",
      "classification": "pre_cutover_or_external_decision",
      "note": "not closed by code merge; needs owner/Denis/business/infrastructure decision or separate safe prep.",
      "url": "https://linear.app/ai-class/issue/KIBER-13/kp-011-proverit-backup-servera-i-vypolnit-test-vosstanovleniya"
    },
    {
      "identifier": "KIBER-26",
      "title": "[KP-032] Стабилизировать сервер: swap/ресурсы/очистка Docker",
      "priority": "High",
      "state": "Backlog",
      "classification": "pre_cutover_or_external_decision",
      "note": "not closed by code merge; needs owner/Denis/business/infrastructure decision or separate safe prep.",
      "url": "https://linear.app/ai-class/issue/KIBER-26/kp-032-stabilizirovat-server-swapresursyochistka-docker"
    },
    {
      "identifier": "KIBER-28",
      "title": "[KP-033] Восстановить здоровье Umami либо утвердить другой мониторинг",
      "priority": "High",
      "state": "Backlog",
      "classification": "pre_cutover_or_external_decision",
      "note": "not closed by code merge; needs owner/Denis/business/infrastructure decision or separate safe prep.",
      "url": "https://linear.app/ai-class/issue/KIBER-28/kp-033-vosstanovit-zdorove-umami-libo-utverdit-drugoj-monitoring"
    },
    {
      "identifier": "KIBER-55",
      "title": "[KP-074] Провести content acceptance 24 роботов и launch-страниц",
      "priority": "High",
      "state": "In Review",
      "classification": "mostly_satisfied_needs_owner_content_acceptance",
      "note": "CI says content acceptance gates pass, but owner content acceptance for publication scope should be explicit.",
      "url": "https://linear.app/ai-class/issue/KIBER-55/kp-074-provesti-content-acceptance-24-robotov-i-launch-stranic"
    },
    {
      "identifier": "KIBER-67",
      "title": "[KP-088] Утвердить аналитику и consent policy",
      "priority": "High",
      "state": "Backlog",
      "classification": "pre_cutover_or_external_decision",
      "note": "not closed by code merge; needs owner/Denis/business/infrastructure decision or separate safe prep.",
      "url": "https://linear.app/ai-class/issue/KIBER-67/kp-088-utverdit-analitiku-i-consent-policy"
    },
    {
      "identifier": "KIBER-69",
      "title": "[KP-090] Настроить monitoring заявок и сайта",
      "priority": "High",
      "state": "Backlog",
      "classification": "pre_cutover_or_external_decision",
      "note": "not closed by code merge; needs owner/Denis/business/infrastructure decision or separate safe prep.",
      "url": "https://linear.app/ai-class/issue/KIBER-69/kp-090-nastroit-monitoring-zayavok-i-sajta"
    },
    {
      "identifier": "KIBER-74",
      "title": "[KP-109] Сохранить Tilda как временный rollback и затем вывести из эксплуатации",
      "priority": "High",
      "state": "Backlog",
      "classification": "pre_cutover_or_external_decision",
      "note": "not closed by code merge; needs owner/Denis/business/infrastructure decision or separate safe prep.",
      "url": "https://linear.app/ai-class/issue/KIBER-74/kp-109-sohranit-tilda-kak-vremennyj-rollback-i-zatem-vyvesti-iz"
    },
    {
      "identifier": "KIBER-8",
      "title": "[KP-010] Обновить память обоих Hermes и убрать ссылку на вторичный repo",
      "priority": "High",
      "state": "Backlog",
      "classification": "needs_human_or_external",
      "note": "",
      "url": "https://linear.app/ai-class/issue/KIBER-8/kp-010-obnovit-pamyat-oboih-hermes-i-ubrat-ssylku-na-vtorichnyj-repo"
    }
  ],
  "recommendedOrder": [
    "KIBER-70 evidence/approval",
    "KIBER-57/KIBER-58/KIBER-64 dynamic lead-runtime staging",
    "KIBER-67 analytics defer/approval",
    "KIBER-68/KIBER-72 cutover/backup/DNS",
    "KIBER-62/KIBER-75 post-cutover smoke/monitoring"
  ],
  "excluded": [
    "No Linear mutations",
    "No production deploy",
    "No DNS",
    "No analytics activation",
    "No production secrets changes"
  ]
}
```
