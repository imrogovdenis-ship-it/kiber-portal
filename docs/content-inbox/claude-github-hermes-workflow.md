# Claude → GitHub → Hermes content workflow for KIBER PORTAL

Status: draft safe automation contract. This document describes how external Claude work should enter the project without manual zip transfers and without production side effects.

## Goal

Claude creates structured JSON content packages in GitHub. Hermes detects those packages, validates them, maps valid packages to preview-only routes, opens a PR/evidence package, and waits for owner approval before merge/publication.

## Non-negotiable boundaries

Claude/Hermes automation must not:

- push to `main`;
- merge PRs;
- deploy production;
- change DNS;
- read or write secrets;
- enable analytics IDs/cookies;
- enable live lead routing;
- change approved design/components/styles;
- mass-generate public pages without owner approval.

## Inbox structure

```text
data/content-inbox/claude/tasks/       # task specs for Claude
data/content-inbox/claude/packages/    # Claude output JSON packages
data/content-inbox/claude/rejected/    # invalid packages after explicit quarantine step
data/content-inbox/claude/processed/   # processed packages after PR creation
data/content-inbox/claude/reports/     # intake reports
```

## Minimum package flow

1. Create a task JSON under `data/content-inbox/claude/tasks/` using `task.schema.json`.
2. Claude reads the task plus `data/content-contracts/kiber-claude-page-block-contracts.json`.
3. Claude writes one `*.content-package.json` under `data/content-inbox/claude/packages/`.
4. Hermes runs:
   ```bash
   python3 scripts/intake_claude_content_packages.py --dry-run --write-report
   python3 scripts/validate_claude_content_contracts.py
   node --test tests/content-contracts/claude-content-inbox.test.mjs
   ```
5. If valid, Hermes runs mapper dry-run:
   ```bash
   python3 scripts/map_claude_package_to_preview.py data/content-inbox/claude/packages/<file>.content-package.json
   ```
6. Hermes creates preview-only route/data in a dedicated branch only after validator pass.
7. Hermes runs preview build/noindex/smoke/SEO checks.
8. Hermes opens a PR and comments evidence in Linear.
9. Alexander approves before merge/publication.

## GitHub branch convention

Recommended branch names:

```text
claude/content-package/<slug>
hermes/ingest-claude-package/<slug>
```

## Linear mapping

- `KIBER-94`: page-type SEO/AI content contract and Claude package infrastructure.
- `KIBER-55`: content acceptance of generated/changed public pages.
- `KIBER-91`: visual QA for preview/public affected routes.
- `KIBER-95`/`KIBER-96`: SEO follow-up after package ingestion.

## Cron/webhook options

Start with Hermes cron every 30–60 minutes. Enable Hermes webhooks later for instant GitHub push events.

Cron should validate and report first; PR creation can be a second phase after dry-run stability.
