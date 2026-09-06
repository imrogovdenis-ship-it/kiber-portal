# KIBER PORTAL — repository data/context preservation package

Generated: `2026-09-01T10:33:07.053776+00:00`  
Issue: **KIBER-93**  
Branch: `hermes/kiber-full-site-visual-qa-20260901`  
Head at package creation: `32409a009a10c744c4defe92bd79767a06291009`  
Remote: `https://github.com/imrogovdenis-ship-it/kiber-portal.git`  
PR: #70

## What the “memory problem” was

The warning Alexander saw was about **Hermes internal persistent memory budget**: the assistant's compact always-on notes were almost full. It was **not** a Linux server RAM failure and not a GitHub problem.

Measured server state at the start of this package:

- RAM: 11 GiB total, 5.3 GiB available.
- Swap: 2.0 GiB total, 1.8 GiB used.
- Disk `/`: 59G size, 52G used, 5.4G available, **91% used**.
- Inodes `/`: 30% used.

So there are two separate things:

1. **Hermes memory/context limit** — solved by saving durable project context into the repo instead of trying to keep everything in chat memory.
2. **Server disk pressure** — real but separate; `/` has only 5.4G free. Do not do broad cleanup without explicit approval because this is a shared host.

## Preservation scope

This package records what is safely preserved in GitHub for KIBER PORTAL.

Included:

- source code: `src/`, `scripts/`, `tests/`, `design-system/`
- site data: `data/`
- documentation and review packages: `docs/`
- public assets and policy files: `public/`
- source/export provenance currently tracked by Git/LFS: `site-export/`
- package/build configuration files tracked by Git

Excluded deliberately:

- secrets: `.env`, tokens, passwords, Basic Auth values, API keys
- `/root`
- other Coolify applications/containers/data not belonging to this project
- generated build/cache folders: `dist`, `node_modules`, `.astro`, `scripts/__pycache__`
- live production side effects: DNS, deployment, analytics activation, live lead routing

## Current Git preservation summary

- Tracked files: **1324**
- Git LFS tracked files: **510**
- Tracked bytes in working tree: **197,348,918**

Top-level summary:

| Root | Files | Bytes | LFS files |
|---|---:|---:|---:|
| `.dockerignore` | 1 | 134 | 0 |
| `.editorconfig` | 1 | 156 | 0 |
| `.env.example` | 1 | 1,323 | 0 |
| `.gitattributes` | 1 | 570 | 0 |
| `.github` | 8 | 9,334 | 0 |
| `.gitignore` | 1 | 396 | 0 |
| `.gitleaks.toml` | 1 | 268 | 0 |
| `.nvmrc` | 1 | 3 | 0 |
| `COOLIFY.md` | 1 | 5,977 | 0 |
| `Dockerfile` | 1 | 1,420 | 0 |
| `README.md` | 1 | 4,223 | 0 |
| `SKILL.md` | 1 | 6,650 | 0 |
| `assets` | 5 | 924,787 | 0 |
| `astro.config.mjs` | 1 | 239 | 0 |
| `colors_and_type.css` | 1 | 3,701 | 0 |
| `components` | 24 | 28,788 | 0 |
| `components.css` | 1 | 6,397 | 0 |
| `data` | 113 | 38,456,357 | 0 |
| `design-system` | 85 | 103,916 | 0 |
| `docs` | 319 | 53,247,614 | 0 |
| `incoming` | 2 | 43,205 | 0 |
| `licenses` | 1 | 962 | 0 |
| `nginx.conf` | 1 | 5,799 | 0 |
| `nginx.redirects.conf` | 1 | 232 | 0 |
| `package-lock.json` | 1 | 184,779 | 0 |
| `package.json` | 1 | 4,980 | 0 |
| `preview` | 15 | 33,710 | 0 |
| `public` | 50 | 1,102,612 | 0 |
| `scripts` | 49 | 265,630 | 0 |
| `site-export` | 510 | 102,127,050 | 510 |
| `src` | 62 | 581,411 | 0 |
| `styles.css` | 1 | 138 | 0 |
| `tests` | 60 | 194,844 | 0 |
| `thumbnail.html` | 1 | 1,104 | 0 |
| `tsconfig.json` | 1 | 209 | 0 |

## Restore path

```bash
git clone https://github.com/imrogovdenis-ship-it/kiber-portal.git
cd kiber-portal
git lfs pull
git checkout <approved branch or main>
npm ci
npm run ci
```

For PR #70 / KIBER-93 context specifically:

```bash
git fetch origin hermes/kiber-full-site-visual-qa-20260901
git checkout hermes/kiber-full-site-visual-qa-20260901
git lfs pull
npm ci
npm run ci
```

## Machine manifest

Full tracked-file manifest with `path`, `bytes`, `sha256`, and `lfsTracked` is stored at:

```text
data/review/kiber-93-repository-preservation-manifest.json
```

This lets us later verify whether a restored checkout matches the saved context without relying on compressed chat history.

## Safety note

This is a repo-backed context/data preservation package. It does **not** grant approval for:

- production deploy;
- DNS/domain cutover;
- production secrets;
- analytics/cookies activation;
- live amoCRM/Telegram lead routing;
- PR merge.
