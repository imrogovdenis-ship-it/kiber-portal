# Owner-approved one-attempt preview lead check

Temporary manual test, approved 2026-09-15. Not part of the production build.
Only `jino-preview.kiber-portal.ru`: overlay `scripts/contact-lead-form-popup.js` and add `manual-lead-check.php`. Existing preview API stays dry-run; production files, config, analytics and hosting rules are not changed.

The handler reads the existing private production connection config server-side, validates the actual preview Host/Origin, and forwards the configured trusted upstream Origin. It only accepts multipart FormData with `manual_check=1`, validates scalar fields, rebuilds the body and marks source_page with the preview origin. No credentials in these files.

Private account-root `.kiber-jino-manual-check/control.json` holds enabled and expiresAt (Unix seconds). Private `attempt` starts empty. Hold an exclusive lock and write an attempt marker BEFORE upstream transmission. One attempt, not one successful lead; ambiguous errors MUST NOT be retried without checking delivery with the owner. Never reset the marker while a request may still be running.

GET `manual-lead-check.php?status=1` is readiness only, never CRM proof. It does not consume the attempt; it returns 410 after expiry/attempt. Current control expires after 24 hours. Production config is read-only.

Rollback: disable private control, restore saved previous preview JS, and remove the isolated endpoint. Backup and private deployment evidence: `/home/alex/.hermes/state/kiber-preview-live-check/`. Do not commit the control file, deployment auth or submitted form data.

Validation: isolated browser response fixtures (all network intercepted), PHP parser, independent security review PASS after fixing raw-body forwarding, real GET disabled/expired/consumed guards, readiness live/200 with unchanged empty marker, published browser failure fixture (1 intercepted POST, 0 real POST), noindex/analytics-off. Real CRM delivery remains untested until the owner's submission.
