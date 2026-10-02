# KIBER robot card readiness checklist

Status: **working_source_of_truth_pending_owner_review**

Owner note: Александр поручил вынести правила robot-card workflow из навыка в repository contracts по модели article contracts. Эти файлы являются рабочим source of truth; при последующих изменениях править и contracts, и skill.

Use this checklist as the final gate before sending Alexander a robot-card preview link.

## Operating mode

Run the card pipeline for exactly one card unless the owner explicitly requests a batch.

Do not stop after:

- first draft;
- source read only;
- SEO-only pass;
- local build only;
- unverified preview upload.

Stop and ask only for true blockers: missing source scope, missing required facts, inaccessible required credentials/tooling, impossible media issue, or production/legal/business decisions.

## Scope

- [ ] Exactly one card is in scope unless explicitly requested otherwise.
- [ ] Slug and route are fixed.
- [ ] Parent подборка/block is known.
- [ ] Production is not touched without explicit approval.

## Sources and facts

- [ ] `docs/contracts/kiber-robot-card-source-of-truth.md` read.
- [ ] Block/style/media/SEO contracts read.
- [ ] `data/content/robot-card-pilot/<slug>.json` inspected.
- [ ] `src/content/robots.generated.json` inspected.
- [ ] `data/models/robots.source-of-truth.json` inspected when facts/capabilities changed.
- [ ] `data/models/robot-tariffs.json` inspected when price changed.
- [ ] Variant/EDU/Ultra/Plus claims confirmed or removed.
- [ ] Unverified capabilities softened or marked for manager confirmation.

## SEO

- [ ] Primary keyword is exact model/brand/product.
- [ ] Broad home/подборка keys are not used as card primary.
- [ ] Secondary/long-tail support the card without stuffing.
- [ ] SEO working map row updated or conflict recorded.
- [ ] Wordstat/SERP/passport/readiness status is honest.

## Copy and blocks

- [ ] H1/title/meta fit card promise.
- [ ] AI summary is specific, factual and split into exactly 2 visible paragraphs.
- [ ] AI summary is compact for mobile: about 450–500 Russian characters total unless the card needs less; if it looks too tall, shorten by ~15–20%.
- [ ] AI summary paragraphs are balanced; the second paragraph is not a long SEO/constraint dump.
- [ ] AI summary has no visible keyword stuffing or repeated exact long-tail sequences; exact scenario phrases are distributed outside this top block when needed.
- [ ] Included-service checklist is customer-facing.
- [ ] Capabilities are observable and specific.
- [ ] Scenarios fit the robot and buyer decisions.
- [ ] Gosha quote has bold accent + short manager handoff.
- [ ] FAQ is robot-specific.
- [ ] Order flow is practical.
- [ ] Bottom Blog/related catalog blocks are useful and release-safe.
- [ ] No visible internal/generator/research language.

## Media

- [ ] Hero matches exact robot.
- [ ] Gallery has relevant runtime photos, not filler.
- [ ] Capability images come from capability registry only.
- [ ] Catalog images remain separate.
- [ ] No legacy/Tilda gallery leak.
- [ ] Important rendered images decode and are not blank.
- [ ] Capability cards satisfy approved 16:9 geometry where applicable.
- [ ] Public `alt` values for meaningful images are checked against the media contract: truthful visual/entity description, no raw unverified `sourceAlt`, no internal boilerplate such as `специальная иллюстрация блока...`.
- [ ] For capability images, `data/models/robot-capability-images.source.json` has usable `actualDescription`/`seoAlt`; rendered HTML has 0 boilerplate alts for the target card.
- [ ] Commercial/long-tail phrasing in alts is balanced: roughly every second meaningful image may carry SEO context when visually truthful, not every image.

## Technical validation

- [ ] `npm run check` passes or unrelated existing hints are reported.
- [ ] `npm run build:preview` passes.
- [ ] Targeted rendered checks pass: one H1, CTA behavior, `seoIntent`, FAQ, no image role leaks.
- [ ] Jino preview route returns 200.
- [ ] Browser console has 0 JS errors.
- [ ] No public `/preview/kiber-94` links unless intentionally a review/reference surface.
- [ ] No secrets or private transport details in owner report.

## Owner handoff

Report compactly:

```text
Готова карточка: <name>
Preview: <Jino URL>
Что изменено: <3–6 bullets>
Проверки: <short build/check/browser summary>
Осталось/риски: <real blockers only>
Production не трогал.
```


## Owner visual review additions — 2026-09-18

Before handing off a rewritten card, additionally verify:

### Text density

- [ ] AI summary is split into two paragraphs and stays roughly within 520–700 characters unless the tested card needs otherwise.
- [ ] Capabilities lead is not a one-line stub; target 2–3 lines.
- [ ] Capability descriptions are not visually overlong; target up to about 5 desktop lines.
- [ ] Scenario lead is 2–3 lines when useful.
- [ ] Scenario descriptions are shortened by about 20–30% if visually heavy.

### Robot-specific shared blocks

- [ ] “Что входит” does not contradict how this robot works.
- [ ] “Как заказать” does not contradict how this robot is booked/used.
- [ ] Robot-in-action heading is individual to the robot, not a fixed generic line.

### Media

- [ ] Capability images show the useful image content without ugly cropping.
- [ ] Any container/object-fit change is checked visually before owner handoff.

### FAQ and lower blocks

- [ ] FAQ has 5–8 useful questions.
- [ ] Blog Kiber Gosha has 3 relevant article cards.
- [ ] Related catalog has 4 relevant robot cards with some useful variety when possible.

## Related compilations exclusion

- [ ] Robot-card pages do **not** render the shared «Подборки»/related compilations block.
- [ ] If compilation/navigation cards are considered for a robot card, stop and get explicit owner approval; the current general rule excludes them.

## Blog Gosha exclusion

- [ ] Robot-card pages do **not** render the shared «Блог Кибер Гоши» block.
- [ ] If article recommendations are considered for robot cards, stop and get explicit owner approval; current general rule excludes them.
