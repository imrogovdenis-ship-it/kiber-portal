# Owner approval — Роботы-промоутеры для мероприятий

Status: owner_approved_on_jino_preview
Route: `/roboty-promoutery/`
Approved preview: https://jino-preview.kiber-portal.ru/roboty-promoutery/?v=hero-photoreal-1
Approved at: 2026-09-22T18:57:49+03:00
Owner basis: Александр подтвердил, что после фотореалистичного Hero это нужный навык/результат, и попросил зафиксировать страницу как готовую.

## Final accepted state

- H1: Роботы-промоутеры для мероприятий
- Hero: фотореалистичная 16:9 иллюстрация через `openai-codex / gpt-image-2-high` по референсам текущих карточек роботов.
- Hero asset: `/images/compilations/roboty-promoutery/hero/roboty-promoutery-hero-20260922.webp`
- Hero SHA256: `61f35825bf58d85ec65c3263dcda082774a992331af6f6cfcbe060acbdc101da`
- Gallery/scenario fixes from earlier owner feedback remain accepted.

## Gates

- Production deploy: not performed in this acceptance record.
- DNS: not touched.
- Secrets: not touched.
- Analytics/live lead routing: not changed.

## Evidence

- `docs/review/compilation-roboty-promoutery/hero-illustration-2026-09-22/prompt-photorealistic-hero.md`
- `docs/review/compilation-roboty-promoutery/hero-illustration-2026-09-22/build-test-results.json`
- `docs/review/compilation-roboty-promoutery/hero-illustration-2026-09-22/jino-http-check-photoreal-hero.json`
