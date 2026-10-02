# KIBER robot card block contract

Status: **working_source_of_truth_pending_owner_review**

Owner note: Александр поручил вынести правила robot-card workflow из навыка в repository contracts по модели article contracts. Эти файлы являются рабочим source of truth; при последующих изменениях править и contracts, и skill.

Applies to: `/robots/...` pages rendered by `RobotCardTemplate.astro`.

## Global block principle

Use each block to answer a buyer decision. Do not copy blocks from articles or other cards by inertia. Keep the approved PR8/home visual system; change copy/content only unless a design change is explicitly approved.

## Current block order

Preserve this order unless Alexander approves a structural redesign.

1. **Hero** (`data-block-id=hero`)
   - H1, price, primary visual, CTAs.
   - CTA `Написать нам` should use the approved contact/messenger behavior for the current implementation.
   - `Оставить заявку` goes to the lead path for the robot.

2. **SEO intent JSON** (`seoIntent`)
   - Hidden machine-readable intent: page role, search intent, verified statuses, decision logic.

3. **AI summary / short answer** (`aiSummary`)
   - First visible block after Hero; treat it as customer-facing copy first, not as an SEO dump.
   - Exactly two visible paragraphs.
   - Compact: target about 450–500 Russian characters total for normal robot cards; reduce further when it feels taller than one comfortable mobile-screen read.
   - Keep paragraph lengths close to each other; the second paragraph must not become a long keyword list.
   - Natural language only: do not repeat exact long-tail phrases such as `<model> для выставки`, `<model> для презентации`, `<model> для мероприятия` inside this block.
   - Mention the robot role, what guests will see, and the main booking/venue constraints in human wording. Move exact keyword variants to metadata, SEO maps, later body blocks or internal linking where they do not read as spam.

4. **Top gallery** (`gallery`)
   - Horizontal drag gallery with explicit runtime assets.
   - Do not use weak filler or legacy/Tilda hero backgrounds.

5. **What is included** (`includedService`)
   - Number: `01 — что входит`.
   - Checklist: preparation, delivery/setup, scenario discussion, support/operator where confirmed, timing/venue checks.

6. **Capabilities / “Что умеет”** (`capabilities`)
   - Number: `02 — ключевые возможности`.
   - Heading pattern: `Что умеет <robotDisplayName>`.
   - Prefer 4–6 observable capabilities.
   - Capability images use the capability registry only.

7. **Scenarios** (`scenarios`)
   - Number: `03 — сценарии использования`.
   - Concrete event scenarios that fit the exact robot.

8. **Quick CTA / pricing bridge** (`pricing`)
   - Reused `HomeFinalCta` with Kiber Gosha image.
   - Must not redesign CTA style.

9. **Robot in action gallery** (`robotInAction`)
   - Second visual strip with action/context images.

10. **Kiber Gosha quote** (`goshaCta`)
    - Reused `HomeGoshaQuote`.
    - First paragraph: bold joke/useful observation.
    - Second paragraph: compact manager handoff.

11. **Hidden machine facts** (`hiddenMachineFacts`)
    - JSON only; not visible sales copy.

12. **Order flow** (`orderFlow`)
    - Number: `05 — как заказать`.
    - Practical list of what happens after request.

13. **FAQ** (`faq`)
    - Reused `HomeFaqBlock`.
    - Must be robot-specific and also safe for FAQPage JSON-LD.

14. **Final CTA** (`finalQuestionsCta`)
    - Reused `HomeFinalCta`.
    - Usually `Остались вопросы?`.

15. **Blog Kiber Gosha** (`articles`)
    - Reused `HomeImageCards`.
    - Show useful related articles only; hide empty/irrelevant filler.

16. **Related catalog** (`relatedCatalog`)
    - Adjacent robot cards using shared `RobotCard` style.
    - Must be relevant alternatives/backups, not random count filler.

## Required lower-page behavior

Every finished card should end with useful next steps:

- FAQ answers practical booking questions.
- CTA2 moves to manager/contact.
- Blog Kiber Gosha helps compare/plan.
- Related catalog offers adjacent robot alternatives.

## Omission rule

If a block is intentionally omitted or hidden, record why in the card review/package. Do not show empty grids.


## Owner visual review input — Unitree G1 baseline, 2026-09-18

These rules were recorded from Alexander's visual review of `/robots/arenda-unitree-g1/`. Treat them as current working rules for subsequent card rewrites and adjust after live testing if needed.

### Hero

- Keep the current Hero block as-is for now.
- Do not use this pass to redesign Hero layout or CTA styling.

### AI summary / short-answer block

- Keep approximately the current amount of text; do not make this block larger.
- Target length: **about 520–700 characters total** until measured tests suggest a better range.
- Render as **two paragraphs** separated by a blank line / paragraph break so the block is not one heavy monolith.
- The text should remain factual and card-specific, not internal review prose.

### Top gallery

- Keep the gallery visually as-is for now.
- Do not change gallery layout while testing copy/contract corrections.

### Included service / “Что входит”

- The shared pattern is acceptable, but it must be checked against the exact robot.
- If a sentence contradicts how the robot is used, rewrite that sentence for the card.
- Example: wording about `выход робота`, `паузы под зарядку`, or `роль в сценарии` can fit a humanoid, but may not fit a stationary Robo-Кофейня or GlamBot.
- Keep the block style and approximate volume as-is unless the robot-specific facts require a correction.

### Capabilities / “Что умеет”

- Heading pattern `Что умеет <robotDisplayName>` is acceptable.
- Add a real lead/subtitle when missing or too short.
- Target lead length: **2–3 lines on desktop review**, approximately **160–240 characters**.
- Keep the current capability card themes, headings and images unless there is a factual mismatch.
- Shorten capability descriptions where they become visually heavy. Target: **up to about 5 lines per card on desktop review**, normally **20–30% shorter** than the currently overlong Unitree G1 examples.

### Scenarios / “Где использовать”

- The section heading may stay short when it reads well, e.g. `Где использовать Unitree G1`.
- Consider an SEO-enriched heading only if it remains natural and fits visually, e.g. `Где использовать робота-гуманоида Unitree G1`.
- Do not force SEO wording when it makes the heading bulky.
- Target lead length: **2–3 lines**, approximately **170–260 characters**.
- Keep scenario card headings unless factually wrong.
- Shorten scenario card descriptions by about **20–30%** when they are too long; keep cards visually balanced and comparable in length.

### Robot in action

- Do not use a fixed generic heading like `Покажите гостям движение, общение и фото-контент` for every robot.
- The heading must be generated from the robot's actual use, visible gallery and card promise.
- It should still fit the public meaning of “robot in action”, but be individual per robot.
- Examples of what to account for: some robots move and interact; some are stationary; some create drinks, portraits, coffee, slow-motion video or STEM demonstrations.

### Kiber Gosha quote

- Keep the current formation principle: two text blocks plus signature.
- First block: Gosha joke/useful accent in bold.
- Second block: manager handoff.
- Signature: `Кибер Гоша, ваш ... помощник` as currently styled.
- Do not rewrite Gosha unless there is a specific reason.

### Order flow / “Как заказать”

- The shared block style and volume are acceptable.
- As with “Что входит”, check every sentence against the robot's actual use.
- Rewrite only sentences that contradict the robot's operation or booking scenario.

### FAQ

- FAQ block looks acceptable, but the item count must be flexible.
- Use **5–8 questions** per robot card.
- Fewer than 5 is not enough for buyer questions/SEO; more than 8 is usually too much.
- Choose count by actual buyer questions and SEO needs, not a fixed template.

### Blog Kiber Gosha / related materials

- Heading pattern can remain model-specific, e.g. materials about renting Unitree G1.
- Description can be slightly expanded when useful; one-line description is acceptable if it reads well.
- Keep **three article cards** in this block.
- Cards must link to relevant articles about this robot, its class, use cases or preparation. Exact selection rules can be refined later through the interlinking plan.

### Related catalog / “Вас также могут заинтересовать”

- Keep heading and subtitle style approximately as-is.
- Always show **four robot cards**.
- Related set should be relevant, but not monotonous.
- Prefer a mix such as: 2 close same-category alternatives + 1 adjacent/functional alternative + 1 nearby different-category robot for variety, when the catalog supports it.
- Example for Unitree G1: not only humanoids; keep close humanoids/promobot-like alternatives and consider adding one robot dog or another near-relevant category to show range.
