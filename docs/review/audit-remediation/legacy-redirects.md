# F05 preview acceptance

Owner approved two preview-only .htaccess rules. Original policy backed up outside web root. Relative redirect targets produced HTTP behind Jino TLS termination, so that attempt was immediately rolled back. Explicit HTTPS targets then passed all 8 cases: both legacy URLs, with/without trailing slash, with/without UTM. Exactly one 301 to the correct same-host HTTPS robot card, then 200; query preserved.

Preview noindex/CSP and existing dry-run API unchanged. Production legacy URLs still 404: no production file was modified. Production proposed snippet now uses explicit production HTTPS targets and the regression test enforces this; activation remains separately gated.

Actual policy byte parity verified. Evidence and rollback: /home/alex/.hermes/state/kiber-preview-legacy-redirects/. Source preview snippet: infra/jino-preview/audit-legacy-redirects.conf. These are insertion snippets, not replacements for complete hosting policy.
