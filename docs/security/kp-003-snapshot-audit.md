# KP-003: snapshot secret and binary audit

- Date: 2026-08-26 UTC
- Linear: KIBER-4 / KP-003
- Snapshot tag: `snapshot/kp-002-2026-08-26`
- Snapshot commit: `02d417a84a18c72b93c59f57ef01d6ee8d31797d`
- Scanner: Gitleaks 8.30.1
- Scope: complete Git history (45 commits at scan time)

## Secret scan

The first redacted scan reported 278 instances of one repeated value in 98 legacy Tilda export files. Every finding had the same rule and markup attribute:

```text
rule: generic-api-key
match shape: data-tilda-formskey="REDACTED"
unique values: 1
first-introducing commit: f7958a43cf6a1dcc3b7d781f4955b585be5d9198
```

`data-tilda-formskey` is a public client-side form identifier emitted into the downloaded HTML by Tilda, not a server credential. The identifier must be present in the public page markup for the legacy form integration. Its redacted-value fingerprint for future comparison is:

```text
sha256: a05992376875c174dd5b67c6713fc9e493a9afe1248f12c085e10e374805c8c7
```

The repository configuration suppresses only this match shape for the `generic-api-key` rule. It does not exclude `site-export/` from other secret rules. After applying the narrow allowlist, the complete-history scan returns no actionable findings.

No credential was exposed by this audit output and no revocation was required. A change in the identifier fingerprint or a finding from another rule must be reviewed as a new incident.

## Large binary inventory

Threshold: 1 MiB, across all reachable Git history.

| Class | Count | Total size | Disposition |
|---|---:|---:|---|
| PNG design/QA evidence | 5 | 9,512,310 bytes | Keep temporarily as review evidence; candidate for artifact storage after launch |
| PNG legacy Tilda asset | 1 | 1,102,569 bytes | Keep inside frozen legacy export until media migration is approved |
| **Total** | **6** | **10,614,879 bytes** | No blob approaches GitHub's 100 MiB hard limit |

Large paths:

```text
2,791,981  data/design/parity-screenshots/mobile-detail-qa-2026-08-25/article-unitree-g1-agibot-x2-mobile-390.png
1,962,303  data/design/parity-screenshots/mobile-qa-2026-08-25/home-mobile-390-after-grid-fix.png
1,943,733  data/design/parity-screenshots/mobile-qa-2026-08-25/home-mobile-390.png
1,622,066  data/design/parity-screenshots/astro-unitree-g1-faq-footer-full-desktop-1280.png
1,193,227  data/design/parity-screenshots/content-index-qa-2026-08-25/compilations-desktop-1280.png
1,102,569  site-export/images/tild3265-6338-4163-b136-316230653365__404.png
```

Current media inventory also contains 110 DOCX, 278 JPG, 264 PNG, 27 SVG and 1 WebP files. These are classified by role rather than treated as application dependencies:

- `site-export/`: frozen legacy reference;
- `data/design/parity-screenshots/`: visual review evidence;
- `incoming/claude-seo-package/`: source editorial documents pending controlled ingest;
- `app/public/`: runtime web media.

Moving originals to object storage/LFS and defining retention is intentionally deferred to KP-012/KP-069; this audit does not delete or rewrite history.

## Reproduction

```bash
gitleaks git --config .gitleaks.toml --redact=100 .
git rev-list --objects --all \
  | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)'
```
