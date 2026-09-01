# KIBER-94 robot_card structure contract draft

Status: **draft_for_owner_review**. Preview-only. This document fixes the robot-card generation structure before rewriting Claude/agent skills and before any public route replacement.

## Goal

A robot card is not just a catalog item. It must work as a selling page, SEO landing page, AI-search source and KIBER PORTAL brand surface.

Every generated `robot_card` must:

1. sell the specific robot/model for event rental;
2. answer model-specific search intent clearly;
3. expose extractable facts for AI agents and search systems;
4. use real approved media instead of placeholders where available;
5. include Kiber Gosha as the visible mascot/brand voice;
6. link the visitor to catalog, Подборки, Blog and contact/request paths;
7. avoid public rendering of service-only SEO/Wordstat/SERP/internal notes.

## Canonical block order

This order is strict enough for repeatability, but allows visual/design refinements inside each block.

1. **Hero**
   - H1 pattern: `Аренда {robotName}` or approved close variant.
   - Must show commercial intent: rental/prokat/request.
   - Must include immediate CTA and photo/gallery anchor.
   - Must not claim unapproved availability or fixed package.

2. **Intro + visible AI summary**
   - This is the short text block immediately after Hero.
   - It must be useful to humans and extractable by AI agents.
   - It must answer: what the robot is, that it is available as an event rental/service page, where it fits, price status, and that manager clarifies scenario/logistics.
   - Recommended length: 80–220 visible chars for compact summary, with optional longer supporting intro below.

3. **First gallery / robot appearance proof**
   - Comes immediately after intro/AI summary.
   - Purpose: catch attention and prove that the model is real.
   - Use approved per-robot gallery images when imported.
   - If only one local image is available in preview, render it visibly and record media debt; do not render broken 404 images or fake unrelated images.
   - Public rollout requires importing/approving the real gallery assets.

4. **Structured facts / facts for choosing**
   - Machine-readable and human-readable list/table.
   - Must include: model/type, rental format, operator/service, geography, price/status, manager-clarified details.
   - Do not publish claims whose source status is unknown.

5. **Included service**
   - Explain what the client receives besides the robot: scenario selection, delivery/setup, operator support, safety/logistics check.
   - This may be visually combined with structured facts if the design requires it, but the fields must remain extractable.

6. **Capabilities**
   - Key robot abilities from source-of-truth data.
   - Phrase as practical benefits where possible.
   - No invented autonomy, movement, language, venue or client claims.

7. **Scenarios / use cases**
   - Show event formats where the robot creates wow-effect.
   - Must help users choose, not merely list keywords.
   - Must support internal links to Подборки or categories later.

8. **Order flow / what happens after request**
   - Remove conversion anxiety.
   - Explain request → clarification → price/availability → delivery/setup/support.
   - Must not imply live CRM/lead routing unless separately approved.

9. **Robot in action / second media surface**
   - Later media/gallery area focused on action, guests, stage, stand, video/social effect.
   - May use the same approved gallery set until separate action media is imported.

10. **CTA with Gosha**
   - Reuse `HomeFinalCta` where possible.
   - CTA must link to approved contact/request path.
   - Price copy must preserve “от …” and “not public offer” semantics where applicable.

11. **Kiber Gosha brand voice**
   - Required on every page type.
   - Use `HomeGoshaQuote` or an approved Gosha helper/quote component.
   - Gosha is the mascot and brand voice, not decoration. Copy must be helpful: explain choice, scenario, limitation or next step in memorable voice.

12. **Related catalog**
   - Use existing `RobotCard` component; do not hand-clone cards.
   - Links/cards should support comparison and next model discovery.

13. **Related Подборки**
   - Link to scenario/category pages using public term **Подборки**.
   - Can reuse `HomeImageCards` with `homeCompilations` until detail pages mature.

14. **FAQ**
   - Use existing `HomeFaqBlock` where possible.
   - Visible FAQ requires `FAQPage` JSON-LD.

15. **Related articles / Blog Kiber Gosha**
   - Use existing `HomeImageCards` with article data/patterns.
   - Purpose: informational support and long-tail SEO path.

## Required schema/SEO/AI layer

- `Service` JSON-LD for robot rental service.
- `BreadcrumbList` JSON-LD and visible breadcrumbs where route context allows it.
- `FAQPage` JSON-LD when FAQ is visible.
- One H1 only.
- Title/description/canonical from page passport/source-of-truth.
- Visible AI summary or equivalent extractable block.
- Internal links to contacts/request, catalog, Подборки and articles.
- No Wordstat/SERP/checklist/source-notes leaks in public HTML.

## Kiber Gosha rule

Kiber Gosha must appear across page types as the recognizable site feature:

- homepage: mascot/brand quote;
- robot cards: practical quote/helper near conversion area;
- compilations: scenario-selection helper;
- articles: editorial aside/closing advice;
- contacts/conversion pages: next-step helper;
- news: factual/context note only when appropriate.

The text must be page-specific and useful. Do not insert generic random jokes just to satisfy the marker.

## Preview/public boundary

The current implementation is preview-only under `/preview/kiber-94/robot-card/[slug]/`.

Not approved by this draft:

- replacing public `/robots/[slug]/` routes;
- production deploy;
- DNS changes;
- secrets changes;
- analytics activation;
- live lead routing;
- PR merge;
- mass page generation.

## Skill rewrite requirement

After owner approval of this structure, rewrite the card-generation skill/prompt so Claude/AI agents emit structured fields for these blocks instead of freeform page prose. The skill must require source status for facts and must reject service-only SEO notes in public copy.
