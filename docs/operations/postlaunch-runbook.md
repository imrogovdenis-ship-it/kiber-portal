# KIBER postlaunch operations

## Current deployed baseline
main 8e51a8a4ae8ce3612268b08e329489972af35c0b, PR123. Web: Jino. Lead API: existing alex-kiber-jino-live-api on separate API origin. This PR does not modify that runtime or publish website files.

## Active observer
Runtime copy: /home/alex/.hermes/state/kiber-operations/monitor.py, directory 0700.
User alex crontab marker: alex-kiber-operations-v1, every 5 minutes. Standard library only. No LLM dependency. Telegram token read at runtime from Alex default-profile env, not copied to Git. Dedicated destinations and other profiles unchanged.
GET: homepage body/noindex check, live API mode, robots, sitemap; SSL expiry warning under 14 days. Docker read-only delivery log summary only for alex-kiber-jino-live-api. No lead POST.
Two consecutive probe failures alert, recovery alerts, delivery failure event notification, durable notification outbox. At 24/72h send observation checkpoint, not automatic Done. Logs retained 30 days, no raw request data/contact in monitor state.
Limits: same-host observer cannot report its own host outage. Independent external watchdog needs separate setup/account decision. Traffic baseline and no-lead business-hours threshold unapproved; zero leads is not treated as a failure. Alerts on lead events do not detect every gateway 4xx/5xx. API durable replay queue not connected. No whole-host recovery claim.

## Verification
python3 -m unittest discover -s scripts/operations -p test_monitor.py -v
Actual first GET/API/TLS/JSON-log probes green. Telegram test accepted with message id in private deployment evidence. Do not resend test without reason.
User cron daemon active and job installed. Check state.json last timestamp after scheduled execution to distinguish scheduling from execution.

## Observer rollback
Read current crontab and remove ONLY the line with marker alex-kiber-operations-v1. Preserve all other jobs; never blindly restore an old crontab. No site/API rollback is required to remove observer.

## Backup/restore
Both release.zip and rollback.zip were really extracted into isolated directories under kiber-operations. Current archive 904 files matches complete release manifest. Previous 900-file archive homepage matches pre-deploy homepage. Details in restore-report.json. Extraction timings are LOCAL tests, not production RTO. Website .htaccess and API/private bridge config were deliberately not replaced by the static release zip.
Keep the initial rollback snapshot until postlaunch review/owner decision; no automatic backup deletion. Active release state and Jino off-webroot rollback copy are separate hosts. Current service credentials must be restored through the approved secret store, not copied into unencrypted backups. Durable API/queue/host recovery and off-host monitoring remain explicit follow-ups.

## Analytics
Browser on live humanoid collection observed no Metrica/Umami/Google analytics requests before consent, after reject, or after accept. Provider-neutral events and consent UI exist; analytics provider/account has not been configured. This is not proof of every third-party iframe being tracking-free. Dedicated authenticated Yandex research tunnel unavailable on known localhost 9222; do not create duplicate counter or use shared AI Class Umami credentials.
Pending owner input: dedicated profile with access to existing KIBER Metrica counter (or counter ID and delegated access); provider decision; conversion goals phone/messenger/lead_success and attribution; no PII in events; iframe/cookie policy review including Kinescope.

## Video/content next
8 registered humanoid videos all returned status=done from Kinescope API and appear as production iframes. Existing token works; do not request new credentials or upload duplicate videos. Registry still contains historic preview-only status text and generic upload workflow needs automation. No provider metadata changed in this pass.
Next approved direction: robots-dogs compilation using accepted CompilationTemplate, then related customer-first articles. Reuse existing Unitree Go2/CyberDog source/media corpus; inspect suitable owner-approved video; research missing category-level Wordstat/SERP data before copy. Do not rewrite already accepted cards or invent article topics/search volumes.
