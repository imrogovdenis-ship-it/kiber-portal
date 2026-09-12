# Owner acceptance and continuation

Accepted source: ff7f364c2bd791a2a8167c1c640806e49d878e62, including prior accepted mobile changes (7fd99de).
Owner: «Принято. Фиксируй все изменения, чтобы они больше не повторяли ошибки. Давай дальше собирать карточки».
All reviewed UI corrections and nominative breadcrumb names are accepted. New robot cards must inherit this shared source, mobile contract and regression gates, not start from an older main branch that lacks them. Content work resumes one model at a time, humanoids first.
No merge/production/DNS/live-routing authorization.
CI note: hosted cold-browser CLS check failed once at 0.144; three instrumented local cold runs passed without changes or relaxed thresholds. The failed hosted job was rerun; outcome is tracked in GitHub, not assumed green.
