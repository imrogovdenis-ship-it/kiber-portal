# KIBER-93 — SEO/AI remediation backlog

Status: **owner_approved_complete**

KIBER-93 infrastructure is complete when audits, passports, AI visibility, llms.txt, robots policy and remediation backlog are in CI. Remaining warnings become follow-up implementation/review tasks, not hidden debt.

Routes checked: **37**  
Technical failures: **0**  
Warning checks preserved: **198**  
Routes with warnings: **37**  


## Owner approval

- Approved by: Александр Маркин
- Approved at: `2026-09-01T11:23:48.928462+00:00`
- Quote: “Закрываем KIBER-93 по варианту А.”
- Meaning: KIBER-93 closes as SEO/AI audit infrastructure. Remaining warnings are preserved as follow-up tasks and do not block closing KIBER-93.
- Does not approve: production deploy, DNS, production secrets, analytics activation, live lead routing, PR merge, or mass page generation.

## Completed in KIBER-93

### ✅ `seo-audit-cta-query-string-detection` — CTA auditor recognizes lead-request links with query strings
- Status: `completed_in_kiber93`
- Warning keys: `cta`
- Routes: `/robots/*`
- Evidence: Robot pages link to /lead/request/?scenario=... and are now counted as CTA-covered.

### ✅ `seo-legal-conversion-webpage-schema` — Legal and conversion pages expose WebPage JSON-LD
- Status: `completed_in_kiber93`
- Warning keys: `requiredSchemaTypes`
- Routes: `/privacy-policy/`, `/consent/`, `/cookie-policy/`, `/terms/`, `/lead/request/`, `/lead/thanks/`
- Evidence: WebPage JSON-LD wired via LegalDocumentPage and lead utility pages without changing legal copy or lead routing.

## Remaining remediation tasks

### ✅ `seo-robot-template-keyword-intent-and-cta` — Strengthen robot detail template keyword intent and safe CTA coverage
- Status: `ready_for_next_issue`
- Owner/workflow: agent_can_prepare_pr_then_owner_reviews_copy_and_visuals
- Warning keys: `primaryKeywordInTitle`, `primaryKeywordInH1`, `primaryKeywordInFirstBlock`, `secondaryKeywords`, `h1MatchesPassport`, `cta`
- Routes: 37
- Route preview: `/`, `/articles/`, `/compilations/`, `/consent/`, `/contacts/`, `/cookie-policy/`, `/lead/request/`, `/lead/thanks/`, `/news/`, `/privacy-policy/`, `/robots/arenda-agibot-x2/`, `/robots/arenda-bellabot/` …
- Next work:
  - Align SEO passports with approved visible H1/title where visual copy is intentionally different.
  - Add visible short-answer/AI summary blocks only after design review.
  - Improve robot detail copy from source-of-truth without inventing prices or capabilities.
  - Keep price claims tied to approved tariff/source-of-truth data.

### ⚠️ `seo-index-pages-faq-breadcrumbs-schema` — Add FAQ/breadcrumb/schema coverage for category and index pages
- Status: `requires_design_review`
- Owner/workflow: agent_can_prepare_patterns_owner_approves_visible_blocks
- Warning keys: `faqQuestions`, `breadcrumbs`, `requiredSchemaTypes`
- Routes: 6
- Route preview: `/articles/`, `/compilations/`, `/contacts/`, `/news/`, `/roboty-gumanoidy/`, `/roboty-sobaki/`
- Next work:
  - Prepare approved visual pattern for visible breadcrumbs on category/contact/index pages.
  - Add FAQ questions to collection/category AI passports and decide which are visible.
  - Use WebPage/CollectionPage/BreadcrumbList schema according to page type without pretending article index is an article detail.

### ⚠️ `seo-markdown-alternates-for-llm` — Generate Markdown alternates for LLM-friendly retrieval
- Status: `requires_owner_content_review`
- Owner/workflow: agent_can_generate_review_only_first_owner_approves_public_policy
- Warning keys: `markdownAlternateOrLlmsEntry`, `aiSummary`, `structuredFacts`, `questionAnswerBlocks`
- Routes: 31
- Route preview: `/`, `/robots/arenda-agibot-x2/`, `/robots/arenda-bellabot/`, `/robots/arenda-glambot/`, `/robots/arenda-inchbot-l1-w-edu/`, `/robots/arenda-kettybot/`, `/robots/arenda-klipmeiker/`, `/robots/arenda-mini-robo-kofeyni/`, `/robots/arenda-noetix-bumi/`, `/robots/arenda-promobot-v4/`, `/robots/arenda-robo-kofeyni/`, `/robots/arenda-roboshashki/` …
- Next work:
  - Generate review-only Markdown from canonical source-of-truth, not from scraped rendered HTML.
  - Add rel=alternate type=text/markdown only after public policy review.
  - Keep /llms.txt as the current baseline until markdown alternates are approved.

## Safety boundaries

This backlog does not grant production deploy, DNS, secrets, analytics, live lead routing, PR merge or mass page generation approval.
