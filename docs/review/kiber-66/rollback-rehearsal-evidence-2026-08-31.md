# KIBER-66 rollback rehearsal evidence

Date: 2026-08-31
Issue: KIBER-66 / KP-103
Scope: protected staging only, Alex-owned `alex-kiber-staging`.

## Summary

Rollback rehearsal completed and current staging was restored.

Sequence performed:

1. Started from current homepage full parity image:
   - image: `alex-kiber-staging:sha-27f5e21`
   - commit: `27f5e214d43dfe62c9cec0109190dbb088d7d4e9`
2. Rolled back to previous known-good image:
   - image: `alex-kiber-staging:sha-d5e2ddc`
   - commit: `d5e2ddc13359236bcded9b5878082e7950496950`
3. Verified rollback stage.
4. Restored current homepage full parity image:
   - image: `alex-kiber-staging:sha-27f5e21`
   - commit: `27f5e214d43dfe62c9cec0109190dbb088d7d4e9`
5. Verified final restored stage.

## Measured timings

From `docs/review/kiber-66/rollback-rehearsal-report.json`:

- Total rehearsal time: `49.03s`
- Previous image healthy before swap: `6.26s`
- Rollback swap + final healthy: `0.76s`
- Current image healthy before restore swap: `6.2s`
- Restore swap + final healthy: `1.05s`
- Restore-from-rollback window: `38.98s`

Note: immediate restore verification saw a transient stale/empty home response during Traefik/container swap propagation. A delayed final verification passed with current image, current commit, expected homepage markers, Basic Auth and noindex intact.

## Verification evidence

Rollback stage passed:

- image label matched `alex-kiber-staging:sha-d5e2ddc`
- commit label matched `d5e2ddc13359236bcded9b5878082e7950496950`
- container health: `healthy`
- no host ports published
- unauthenticated `/` returned `401`
- `WWW-Authenticate` present
- authenticated `/healthz/` returned `200`
- authenticated `/` returned `200`
- `X-Robots-Tag: noindex, nofollow` present
- analytics scripts absent

Final restored stage passed:

- image: `alex-kiber-staging:sha-27f5e21`
- commit: `27f5e214d43dfe62c9cec0109190dbb088d7d4e9`
- container health: `healthy`
- no host ports published
- unauthenticated `/` returned `401`
- `WWW-Authenticate` present
- authenticated `/healthz/` returned `200`
- authenticated `/` returned `200`
- `X-Robots-Tag: noindex, nofollow` present
- homepage markers present:
  - `Кибер Гоша`
  - `Тематические подборки роботов для аренды`
  - `Популярные модели для мероприятий`
  - `Тематические статьи по аренде роботов на мероприятия`
  - `Вопросы и ответы по аренде роботов`
  - `Остались вопросы?`
- analytics scripts absent

Final smoke result: `13/13 passed`.

## Safety boundaries

No production deploy, DNS/domain changes, production secrets, analytics provider enablement, live lead routing, amoCRM/Telegram destinations, or shared non-`alex-*` containers were touched.

## Artifacts

- Pre-change note: `docs/review/kiber-66/rollback-rehearsal-prechange-note-2026-08-31.md`
- Machine-readable report: `docs/review/kiber-66/rollback-rehearsal-report.json`
