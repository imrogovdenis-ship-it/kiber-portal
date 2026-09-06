# Release-candidate stabilization — 2026-09-06

## Status

`RC_STABILIZATION_PACKAGE_GREEN_NO_PRODUCTION_DEPLOY`

## Что сделано

- Зафиксирован launch-scope manifest: `data/review/launch-scope-manifest.json`.
- Обновлён production go/no-go под актуальные approvals: `data/review/production-go-no-go.json` и `docs/review/production-go-no-go/README.md`.
- Legal/form/contact approvals включены в RC scope.
- В `npm run ci` добавлен gate `test:launch-scope-manifest`.
- Исправлены найденные full-CI проблемы:
  - raw color в Article/Compilation templates заменён на token;
  - invalid `obviousChoice` markup в ArticleBlocksTemplate исправлен;
  - RobotCard analytics placement type приведён к допустимому значению;
  - CompilationTemplate сохраняет оба нужных markers: `cta2` и `goshaCta`;
  - тесты обновлены под утверждённые статусы и новый MAX link.

## Verification

- `npm run ci` — pass.
- `build:preview` / `build:production` входят в CI и проходят.
- `test:production-go-no-go` — pass, статус остаётся `NO_GO`.
- `test:launch-scope-manifest` — pass.
- `ci:baseline` — 41 HTML pages link-checked, 1722 tracked files secret-scanned.

Лог CI: `npm-run-ci-green-with-launch-scope.log`.

## Staging

Обновлён staging image:

```text
alex-kiber-staging:rc-stabilization-20260906-ci-green
```

URL:

```text
https://alex-kiber-mobile-review-d190abc.38.180.37.42.nip.io/
```

Smoke retry: all checked routes HTTP 200, `X-Robots-Tag: noindex`, служебные legal notices отсутствуют.

## Production gates still closed

- production deploy: not approved;
- DNS: not approved;
- production secrets/runtime activation: not approved;
- analytics IDs/cookies: not approved;
- merge/push: not performed in this step.
