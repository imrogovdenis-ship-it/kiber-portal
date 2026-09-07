# KIBER robot-card generation guardrails after KettyBot correction (2026-09-07)

This document is the project-level guardrail for future robot-card generation. It records the errors found during the latest KettyBot/service-card loop and the corrected rules that supersede them.

## Correct active contour

- Repo: `/home/alex/projects/kiber-portal-pr8`
- Branch: `hermes/kiber-full-site-visual-qa-20260901`
- Route: `/preview/kiber-94/robot-card/[slug]/`
- Template: `src/components/templates/RobotCardTemplate.astro`

Do not use `/home/alex/projects/kiber-portal` branch `hermes/kiber-42-44-price-decision-pack` or `app/src/components/robots/*` as robot-card design/SEO baseline. That worktree may contain archive/source evidence only.

## Errors that must not repeat

1. Built service robot cards in the old contour and presented public-like `/arenda-*` URLs.
2. Claimed readiness from build/render smoke while the approved research and visual contract were not followed.
3. Skipped/under-recorded Wordstat → SERP → competitors → content gaps before preview.
4. Allowed generic class keywords to drive robot-card SEO instead of exact model/entity intent.
5. Let service labels like `KIBER-94 preview` leak into title/description/OG.
6. Centered Hero eyebrow/buttons after owner had required left alignment.
7. Used reduced `robots.generated.json` as if it were the complete media source.
8. Added a rejected old Tilda hero/background image to the gallery.
9. Used white-background product shots as normal gallery photos.
10. Tried to fix gutters with `object-fit: cover` / fixed square frames, which broke the approved gallery aspect contract.
11. Reintroduced mobile `aspect-ratio: 1 / 1` for robot-card galleries.
12. Risked mixing gallery photos with `Что умеет` capability images.

## Correct mandatory pipeline

`approved contour audit → one pilot slug → Wordstat → SERP/competitors → content gaps → SEO passport → seoIntent → approved block map → visible copy/FAQ/Gosha → media/source/fact/price pass → preview build → rendered/staging visual+SEO audit → owner review → only then scaling`

## Correct media contract

- Hero uses only `/images/kiber-45/<slug>.webp`.
- Legacy Tilda hero/background images are archive/provenance only and blocked from runtime robot-card galleries.
- First gallery uses upper non-hero source gallery photos.
- `04 — робот в действии` uses lower non-hero source gallery photos.
- `02 — ключевые возможности` uses only `data/models/robot-capability-images.source.json` and `/images/robot-capabilities/<slug>/...`.
- Gallery CSS: one common height, proportional width, no forced squares, no default crop: `flex: 0 0 auto`, `width: fit-content`, `height: var(--robot-card-gallery-height)`, image `width:auto`, `height:100%`, `object-fit: contain`, `max-width:none`. Mobile must not contain `aspect-ratio: 1 / 1`.

## Correct SEO/AI contract

Robot-card SEO belongs to exact model/entity commercial intent. Generic class/scenario demand belongs to Подборки/articles. Each page must render parseable `seoIntent` JSON with `pageType`, `pageIntent`, `primaryKeyword`, `secondaryKeywords`, `modelNameVariants`, `entitySynonyms`, `aiAgentHints`, `entity`, and `isCrawlerOnlyText:false`.

This document does not approve production, DNS, secrets, analytics, live lead routing, merge, or mass generation.


## Owner approval checkpoint

On 2026-09-07 Alexander reviewed the current KettyBot preview and approved it as the pilot/generation-contract checkpoint. Evidence: `docs/review/kiber-kettybot-pilot-owner-approval-20260907/owner-approval.json`.

This still does not approve production, DNS, secrets, analytics, live lead routing, merge, public route replacement, or mass scaling without the next batch review.
