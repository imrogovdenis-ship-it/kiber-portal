# KIBER-94 robot_card structure contract draft

Status: **approved_by_owner_for_robot_card_design_and_structure**. Preview-only. Updated after Alexander's 2026-09-03 approval. This document fixes the approved robot-card generation structure before rewriting Claude/agent skills and before any public route replacement.

Owner approval quote:

> Ну все, дизайн и структуру карточки робота утверждаем. Сделаем все необходимые записи, зафиксируем информацию

Approval boundary: this approves the `robot_card` design and structure baseline only. It does not approve PR merge, public route replacement, production deploy, DNS, secrets, analytics or live lead routing.

## Goal

A robot card is not just a catalog item. It must work as a selling page, SEO landing page, AI-search source and KIBER PORTAL brand surface.

Every generated `robot_card` must:

1. sell the specific robot/model for event rental;
2. answer model-specific search intent clearly;
3. expose extractable facts for AI agents and search systems;
4. use real approved media instead of placeholders where available;
5. include Kiber Gosha as the visible mascot/brand voice;
6. link the visitor to contact/request paths, Blog Kiber Gosha and the robot catalog;
7. avoid public rendering of service-only SEO/Wordstat/SERP/internal notes.

## Canonical block order

This order follows owner feedback and is strict for future generation. Visual/design refinements inside blocks are allowed, but blocks must not be freely rearranged by agents.

1. **Hero**
   - H1 pattern: `Аренда {robotName}` or approved close variant.
   - Must show commercial intent: rental/prokat/request.
   - If the available robot image is the square catalog image, use a two-column composition: text/data/buttons on the left, square image on the right.
   - Must include immediate CTA and photo/gallery anchor.
   - Must not claim unapproved availability or fixed package.

2. **Short visible AI summary**
   - One short block only. Do not render a separate model intro plus a second AI-summary card.
   - It must combine the compact human intro and AI/search summary.
   - It must answer: what the robot is, that it is an event rental/service page, where it fits, price status, and that manager clarifies scenario/logistics.

3. **First gallery / robot appearance proof**
   - Comes immediately after the short AI summary.
   - Purpose: catch attention and prove that the model is real.
   - Use approved per-robot gallery images when imported.
   - If only one local image is available in preview, render it visibly and record media debt; do not render broken 404 images or fake unrelated images.

4. **Text block**
   - Longer explanatory copy after the gallery.
   - Can include practical setup/logistics/limitations and why the robot works for events.

5. **Capabilities**
   - Key robot abilities from source-of-truth data.
   - Phrase as practical benefits where possible.
   - No invented autonomy, movement, language, venue or client claims.

6. **Scenarios / use cases**
   - Show event formats where the robot creates wow-effect.
   - Must help users choose, not merely list keywords.

7. **Robot in action / second media surface**
   - Media/gallery area focused on action, guests, stage, stand, video/social effect.
   - May use the same approved gallery set until separate action media is imported.

8. **Kiber Gosha brand voice**
   - Required between `robot in action` and the first CTA.
   - Use `HomeGoshaQuote` or an approved Gosha helper/quote component.
   - Gosha is the mascot and brand voice, not decoration. Copy must be helpful: explain choice, scenario, limitation or next step in memorable voice.

9. **CTA #1**
   - Immediate conversion after the Gosha quote.
   - Simple CTA without changing live lead routing approvals.

10. **Included service**
   - Explain what the client receives besides the robot: scenario selection, delivery/setup, operator support, safety/logistics check.

11. **Machine facts / structured data for choosing**
   - Machine-readable and human-readable list/table.
   - Must include: model/type, rental format, operator/service, geography, price/status, manager-clarified details.
   - Do not publish claims whose source status is unknown.

12. **Order flow / what happens after request**
   - Remove conversion anxiety.
   - Explain request → clarification → price/availability → delivery/setup/support.
   - Must not imply live CRM/lead routing unless separately approved.

13. **FAQ**
   - Use existing `HomeFaqBlock` where possible.
   - Visible FAQ requires `FAQPage` JSON-LD.

14. **CTA #2 / Остались вопросы?**
   - Comes immediately after FAQ.
   - Prefer shared Gosha CTA component (`HomeFinalCta`) if used on the site.

15. **Related articles / Blog Kiber Gosha**
   - Use existing `HomeImageCards` with article data/patterns.
   - Purpose: informational support and long-tail SEO path.

16. **Related catalog**
   - Use existing `RobotCard` component; do not hand-clone cards.
   - Links/cards support comparison and next model discovery after the visitor has read the page.

## Explicitly removed from robot_card

- Visible `Подборки` block is removed from this robot-card structure. Подборки can still be linked contextually elsewhere or revisited later, but they are not part of the current canonical robot_card page order.

## Required schema/SEO/AI layer

- `Service` JSON-LD for robot rental service.
- `BreadcrumbList` JSON-LD and visible breadcrumbs where route context allows it.
- `FAQPage` JSON-LD when FAQ is visible.
- One H1 only.
- Hero title uses H1; main named content blocks use H2.
- Title/description/canonical from page passport/source-of-truth.
- One visible AI summary or equivalent extractable block.
- Internal links to contacts/request, Blog and catalog.
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


## Visible facts block decision

Owner asked to remove `Факты для выбора` from the human-visible page. We do not implement hidden SEO-only text for crawlers because that would risk cloaking. The safe contract is: no visible `structuredFacts` section; facts remain available through normal schema/machine-readable JSON data generated from the same robot source of truth.
