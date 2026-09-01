# KIBER-94 Sitewide SEO/AI Intent Normalization Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task after Alexander answers the open strategy question and provides sample materials/Claude skills if available.

**Goal:** Expand KIBER-94 from robot-only optimization into a sitewide SEO/AI intent normalization layer that aligns page design, block structure, SEO requirements, AI/LLM readability, and existing prepared content materials before mass page production.

**Architecture:** Treat every public page type as a controlled template with a page-type contract: H1/title/primary keyword/first meaningful block/AI summary/CTA/schema/internal links/factual-safety. Before changing templates broadly, sample the prepared materials for robots, articles, and compilations plus Claude’s content-production skills, then decide whether templates should adapt to the content structure, content should adapt to the approved templates, or both should converge through a canonical source-of-truth model.

**Tech Stack:** Astro, JSON source-of-truth datasets, KIBER-93 SEO/AI passports, rendered `dist/` auditor, Node test runner, Python audit scripts, GitHub PR #70 review workflow, Linear KIBER follow-up issues.

---

## Current context

- KIBER-93 is complete as SEO/AI audit infrastructure.
- KIBER-94 was initially framed as robot-template SEO/AI intent remediation.
- Alexander clarified that the same approach should apply to the whole site, not only robot cards.
- Visual/page multiplication remains paused until SEO/page-structure contracts are understood and approved.
- Existing approved visual pages may not match the structure of prepared materials from the previous site / Claude content workflow.
- Alexander can provide:
  - prepared robot-card materials;
  - prepared compilation materials;
  - prepared article materials;
  - Claude skills/prompts used to generate those materials.

## Key decision to resolve before implementation

We need avoid future rework by deciding how the page templates and prepared materials meet:

1. **Template-first:** keep current Astro/design templates as canonical, then rewrite/import existing materials into these structures.
2. **Content-first:** study existing prepared materials first, then adjust the page templates so they naturally fit the real content shape.
3. **Contract-first / recommended hybrid:** sample real materials and Claude skills, define a canonical page-type content schema, then adapt both templates and future content-production skills to that schema.

Recommended direction: **contract-first hybrid**.

Why:
- It preserves approved design where it already works.
- It avoids forcing rich prepared materials into too-small blocks.
- It avoids changing templates blindly based on incomplete examples.
- It creates one durable structure for Astro rendering, SEO audit, AI readability, and future Claude content generation.

---

## Sitewide KIBER-94 scope to record

### 1. Expand KIBER-94 to sitewide SEO/AI intent normalization

KIBER-94 should no longer mean only “robot template SEO”. It should mean:

> Define and normalize SEO/AI intent contracts across all public KIBER PORTAL page types before broad page/content multiplication.

### 2. Build a page-type matrix

Include these page types:

- `home`
- `robot_card`
- `category`
- `compilation`
- `article_index`
- `article_detail`
- `news_index`
- `news_detail`
- `contacts`
- `legal`
- `conversion`

### 3. Define required fields/rules per page type

For each page type define:

- required H1 pattern;
- title pattern;
- primary keyword rule;
- first-block rule;
- AI summary rule;
- CTA rule;
- schema rule;
- internal links rule;
- factual-safety rule.

### 4. Apply by priority

Order of application:

1. Templates that will be multiplied or reused heavily.
2. Then individual pages / one-off routes.

High-priority templates:

- `robot_card`
- `article_detail`
- `compilation`
- `category`
- `news_detail`

Lower-risk one-offs:

- `home`
- `contacts`
- `legal`
- `conversion`

---

## Proposed strategy for Alexander’s current question

### Option A — Template-first

**Approach:** keep current design/page blocks as canonical and adapt all prepared text materials to them.

**Pros:**
- fastest implementation path;
- preserves already approved visual design;
- easier CI/template control.

**Cons:**
- may waste good prepared content;
- may require cutting/restructuring articles and compilations later;
- Claude skills may keep generating content that does not fit templates;
- can create hidden mismatch between SEO-rich content and page layout.

**Use only if:** prepared materials are loose drafts and the current templates are clearly superior.

### Option B — Content-first

**Approach:** inspect prepared materials first and redesign templates around them.

**Pros:**
- avoids throwing away already prepared SEO/content work;
- page blocks better match real editorial structure;
- easier to update Claude skills from observed material patterns.

**Cons:**
- can reopen too much visual work;
- risks undermining approved pages;
- might overfit templates to a few examples.

**Use only if:** prepared materials are high-quality, consistent, and closer to final SEO/content goals than current templates.

### Option C — Contract-first hybrid (recommended)

**Approach:** inspect representative materials and Claude skills, extract the underlying content shape, then define a canonical page-type content contract that both Astro templates and Claude skills must follow.

**Pros:**
- minimizes future rework;
- preserves approved visual direction while allowing block-structure corrections;
- gives Claude a precise writing target;
- makes SEO/AI audit deterministic;
- separates source content from visual rendering.

**Cons:**
- requires a short discovery pass before implementation;
- may reveal that some approved pages need small structural adjustments.

**Recommendation:** choose this option.

---

## Materials discovery pass before implementation

Ask Alexander to provide representative samples, not the full library at first.

### Requested samples

1. **Robot cards:** 3 examples
   - one humanoid, e.g. Unitree G1 or Agibot X2;
   - one robot-dog, e.g. Unitree Go2 / CyberDog / Inchbot;
   - one service/special robot, e.g. robot-barman / BellaBot / Robo-Кофейня.

2. **Compilations:** 2 examples
   - one scenario/event compilation;
   - one category/model-family compilation.

3. **Articles:** 2 examples
   - one informational/how-to article;
   - one comparison/scenario article.

4. **News:** 1 example if already prepared.

5. **Claude skills/prompts:**
   - skills used to generate robot cards;
   - skills used to generate articles;
   - skills used to generate compilations;
   - any SEO/AI/GEO instructions Claude used.

### What to extract from each sample

For each material, record:

- source type;
- intended page type;
- target keyword/intent if present;
- actual block structure;
- headings depth;
- FAQ/Q&A presence;
- facts and claim sources;
- CTA wording;
- internal-link opportunities;
- schema suitability;
- AI-summary readiness;
- content that should be visible vs review-only;
- conflicts with current template;
- content that is valuable but currently has no page block.

---

## Proposed canonical page-type matrix structure

Create or update a review-only planning artifact before code changes, for example:

- `docs/seo-ai-page-type-intent-matrix.md`
- `data/seo/page-type-intent-contract.draft.json`

Each page type should include:

```json
{
  "pageType": "robot_card",
  "purpose": "Commercial detail page for one rentable robot model",
  "requiredBlocks": [
    "hero",
    "aiSummary",
    "capabilities",
    "scenarios",
    "media",
    "faq",
    "relatedLinks",
    "cta"
  ],
  "seoRules": {
    "h1Pattern": "Аренда {robotName}|{robotName} для мероприятий with approved exception",
    "titlePattern": "Аренда {robotName} — {robotType} на мероприятие | КИБЕР ПОРТАЛ",
    "primaryKeywordRule": "Must appear in title and first meaningful visible block; H1 exception requires owner/design note",
    "firstBlockRule": "Must answer what the robot is, who it is for, and next action",
    "aiSummaryRule": "Short visible extractable summary from approved/source facts",
    "ctaRule": "Visible lead/contact CTA to preview-safe approved route",
    "schemaRule": "Service + BreadcrumbList; Offer only when price/legal conditions are approved",
    "internalLinksRule": "Links to category, related robots, relevant compilations/articles",
    "factualSafetyRule": "No invented prices, capabilities, venues, cities, brands, or guarantees"
  },
  "contentSourceRules": {
    "allowedSources": ["owner_approved", "tariff_xlsx", "robots.source-of-truth", "manufacturer", "prepared_material_needs_review"],
    "reviewStatuses": ["approved", "needs_review", "generated_needs_review"]
  }
}
```

---

## Implementation plan after discovery

### Task 1: Inventory materials and Claude skills

**Objective:** Understand the true prepared-content structure before changing templates.

**Files likely to create:**
- `docs/review/kiber-94-materials-inventory.md`
- `data/review/kiber-94-materials-inventory.json`

**Steps:**
1. Save provided samples under a review/source directory, preserving original filenames and source notes.
2. Extract block structures and SEO/AI signals.
3. Compare against current KIBER-93 passports and current Astro templates.
4. Produce a mismatch table.

**Verification:**
- Every provided sample has a source record.
- No source material is silently discarded.
- Review-only status is clear.

### Task 2: Draft sitewide page-type intent matrix

**Objective:** Define page-type contracts before changing templates.

**Files likely to create/modify:**
- `docs/seo-ai-page-type-intent-matrix.md`
- `data/seo/page-type-intent-contract.draft.json`
- possibly `data/seo/page-seo-components-contract.draft.json`

**Steps:**
1. Add the 11 page types.
2. For each page type define H1/title/keyword/first-block/AI-summary/CTA/schema/internal-link/factual-safety rules.
3. Add field-level statuses: `approved`, `needs_review`, `generated_needs_review`, `not_applicable`.
4. Mark which rules are hard blockers vs warnings.

**Verification:**
- JSON validates.
- The matrix covers all current route `pageType` values.
- The matrix explicitly says not to keyword-stuff legal pages.

### Task 3: Update KIBER-94 Linear scope

**Objective:** Make tracker scope match Alexander’s sitewide decision.

**Files / systems:**
- Linear KIBER-94
- PR #70 evidence comment if work remains in that PR

**Steps:**
1. Read KIBER-94 current title/description.
2. Update title/scope to sitewide SEO/AI intent normalization if appropriate.
3. Comment with this plan and the content-discovery dependency.

**Verification:**
- KIBER-94 no longer sounds robot-only.
- Safety boundaries remain explicit.

### Task 4: Decide template/content convergence strategy

**Objective:** Choose how templates and prepared materials should meet.

**Decision options:**
- Template-first.
- Content-first.
- Contract-first hybrid.

**Recommended decision:** contract-first hybrid.

**Output:**
- short decision record in `docs/seo-ai-page-type-intent-matrix.md` or a dedicated ADR/review note.

### Task 5: Only then update templates and Claude skills

**Objective:** Implement the decided structure safely.

**Likely later files:**
- `src/pages/articles.astro`
- `src/pages/compilations.astro`
- robot detail components/templates
- category/news/contact/legal page templates
- KIBER SEO/AI audit scripts
- Claude/Hermes skill documents or external Claude skills, rewritten to output the canonical page-type schema

**Verification:**
- TDD: failing contract tests first.
- Rendered build/audit after every template class.
- Full `npm run ci` before PR evidence.
- No production/DNS/secrets/analytics/live-routing side effects.

---

## How to rewrite Claude skills later

After the matrix is approved, rewrite Claude’s content-production skills so they generate structured content that matches the canonical page contracts, not free-form pages.

Each Claude skill should output, where relevant:

- page type;
- slug;
- primary keyword;
- secondary keywords;
- H1;
- title;
- description;
- first block / AI summary;
- visible content blocks;
- FAQ/Q&A;
- structured facts;
- factual-claim sources;
- internal link suggestions;
- CTA;
- schema hints;
- review status;
- fields that must not be publicly rendered yet.

Important: Claude-generated text should default to `generated_needs_review` unless facts are tied to approved sources.

---

## Risks and tradeoffs

- **Risk:** Current approved visual pages may need small structural changes after materials review.
  - **Mitigation:** Treat changes as narrow follow-up visual tasks, not a full redesign.

- **Risk:** Prepared materials may contain good content that does not fit current blocks.
  - **Mitigation:** Preserve all source material in inventory; map unmatched content to proposed blocks.

- **Risk:** Claude skills may generate text too long or structurally inconsistent.
  - **Mitigation:** Rewrite skills to output JSON/Markdown sections matching the page-type contract.

- **Risk:** SEO pressure could damage human readability or approved visual style.
  - **Mitigation:** Keep keyword rules as intent checks, not keyword stuffing. Allow approved H1 exceptions when title/summary/first block carry the primary intent.

- **Risk:** Facts/prices/capabilities could be invented during rewrite.
  - **Mitigation:** Require source/status per factual claim; prices only from approved tariff XLSX/source-of-truth.

---

## Open questions for Alexander

1. Can you send 3 robot-card examples, 2 compilation examples, and 2 article examples first?
2. Can you send Claude’s skills/prompts that generated those materials?
3. Should the first review compare materials against currently approved pages `/articles/`, `/compilations/`, and current robot template?
4. Are the prepared materials considered final/approved content, or drafts that can be reshaped?
5. Do you want Claude skills rewritten into strict structured output after we approve the page-type matrix?

---

## Recommendation

Do **not** continue with template implementation immediately.

First do a short **KIBER-94 materials alignment pass**:

1. ingest representative prepared materials and Claude skills;
2. extract their real structure;
3. compare against current page templates and KIBER-93 SEO/AI contract;
4. draft the sitewide page-type matrix;
5. approve the matrix;
6. then update templates and future Claude skills.

This is the safest path to avoid unnecessary future rework and to make design, SEO, AI readability, and prepared content converge into one durable site system.
