# KIBER-20 CI baseline evidence

## Summary

Adds the missing CI baseline gate for links, 404, and secret scan. Existing CI already covered schema/unit/visual checks and production build; this task completes the KP-025 baseline contract.

## What changed

### CI baseline gate

New script:

```text
scripts/ci-baseline-smoke.mjs
```

New npm script:

```text
npm run ci:baseline
```

Updated CI command:

```text
npm run verify && npm run test:visual-regression && npm run build:production && npm run ci:baseline
```

The existing GitHub workflow already runs `npm run ci`, so no workflow YAML change is needed.

### Baseline checks

`npm run ci:baseline` verifies:

- production `dist` exists after build;
- all generated HTML pages are link-scanned;
- same-page and cross-page fragments resolve;
- internal static assets resolve;
- `dist/404.html` exists;
- `dist/404.html` contains `noindex`;
- tracked text files are scanned for private-key blocks and explicit credential assignments without printing values.

### Broken-link fixes discovered by the gate

The first real link-smoke run found missing public routes and a missing `/#catalog` anchor. The PR fixes those rather than weakening the test:

- adds `id="catalog"` on the homepage catalog section;
- replaces the production CTA link to preview review with `/contacts`;
- adds safe static routes for:
  - `/compilations`
  - `/articles`
  - `/news`
  - `/contacts`
  - `/roboty-gumanoidy`
  - `/roboty-sobaki`
  - `/privacy-policy`
  - `/cookie-policy`

Legal/contact pages are safe placeholders and do not introduce real lead routing, analytics, cookies, or legal final approval.

## Validation

```text
node --import tsx --test tests/visual/ci-baseline-contract.test.ts — passed
npm run ci:baseline — passed
npm run ci — passed
```

Actual baseline output:

```text
KIBER-20 CI baseline smoke passed: 13 HTML pages link-checked, dist/404.html verified, 1292 tracked files secret-scanned.
```

Full CI local output also includes:

```text
Result (79 files): 0 errors, 0 warnings, 0 hints
25 visual tests passed
13 page(s) built
```

## Safety

No production deploy, DNS, secrets, analytics provider IDs, real lead destination, legal/consent policy, or workflow permission changes.
