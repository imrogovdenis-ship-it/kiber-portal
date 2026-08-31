# KIBER contact/lead visual pass 3B

Status: ready for owner visual review.

## Why this corrective pass exists

This is a reference/live-style corrective pass after owner feedback that pass 3 looked too technical and visually drifted away from the previously approved KIBER PORTAL direction.

## Scope

This pass covers visual alignment only for:

- `/lead/thanks/` — branded confirmation page with public-facing wording.
- `/roboty-gumanoidy/` — category landing page with reference-style hero/media split, stats and CTA strip.
- `/roboty-sobaki/` — category landing page with reference-style hero/media split, stats and CTA strip.
- `/contacts/` — footer/contact evidence for comparison with pass 3.

## What changed from pass 3

- Removed public-facing technical labels from the affected pages.
- Kept safety facts in docs/CI instead of visible hero cards.
- Reworked category pages toward the approved reference language: dark left hero panel, light robot media panel, large headline, rounded CTA buttons, compact stats and simpler white content cards.
- Reworked thank-you page into a branded confirmation flow instead of an internal preview/status page.

## Safety boundary

This is visual approval only and does not change production deploy, DNS, secrets, analytics provider/IDs, real public contacts, payment, or live lead destinations.

Live lead routing remains disabled by `data/lead/capability-contract.json` and CI gates.

## Evidence

Screenshots are recorded in `screenshots/manifest.json` and grouped into contact sheets for mobile, tablet and desktop review.
