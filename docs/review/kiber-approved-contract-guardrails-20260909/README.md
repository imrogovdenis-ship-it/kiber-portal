# KIBER PORTAL — approved-contract guardrails

## Purpose

This package turns repeated owner-feedback lessons into executable repository rules. It does not approve merge or production changes.

## Canonical source

`data/contracts/kiber-approved-page-contracts.json` is the active machine-readable index for `robot_card`, `article_detail`, and `compilation`:

- canonical component and data source;
- approved reference route and approval record;
- proportional gallery contract;
- media-role separation;
- deprecated/blocked sources;
- customer-facing content rules;
- owner-feedback scope lock;
- verification profiles and approval boundaries.

Historical review files remain evidence. They are not active generation sources unless the canonical contract names them.

## Owner-feedback scope lock

Copy `data/contracts/owner-feedback-scope.example.json` to a task-specific review directory and narrow `allowedFiles` before editing. Run:

```bash
npm run validate:owner-feedback-scope -- --manifest docs/review/<task>/scope.json
```

Unexpected or explicitly frozen files fail. A task-specific scope must list its required checks and real protected review URL. This prevents adjacent approved blocks, text, and media from changing during a narrow correction.

## Validation profiles

```bash
# One narrow correction: guardrail test + approved contract validator
npm run verify:narrow

# Shared article/compilation/robot template change
npm run verify:shared-templates

# Broad or release-affecting change
npm run ci
```

The narrow profile is deliberately short; full launch/readiness checks are not the default for one selector or one content field.

## Combined review staging

Copy `data/contracts/combined-review-manifest.example.json`, fill branch names and review routes, then run plan validation:

```bash
npm run build:combined-review -- --manifest docs/review/<task>/combined-review.json --plan
```

The executable builder:

- requires a clean worktree;
- creates a disposable git worktree;
- merges branches without custom conflict rewriting;
- fails on any conflict with policy `fail_do_not_reconcile`;
- runs approved-contract, preview-build, and rendered duplicate-ID checks;
- never deploys automatically.

If shared templates conflict, branches must be rebased or the shared change extracted into a base PR. Regex/manual concatenation of template conflicts is prohibited.

## Definition of done

“Done” for an owner-visible correction means all four are true:

1. source and scope are verified;
2. targeted checks pass;
3. rendered DOM/CSS/media/singleton behavior passes;
4. the actual protected review URL is verified.

A local build or green CI alone is not enough.

## Safety

This package changes no production deployment, DNS, secrets, analytics provider, lead routing, public route replacement, or merge permission.
