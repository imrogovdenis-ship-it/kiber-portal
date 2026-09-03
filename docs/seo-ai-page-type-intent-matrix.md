# KIBER-94 — SEO/AI page-type intent matrix

Status: **draft_for_owner_review**. This is a contract/modeling artifact only: no production deploy, DNS, secrets, analytics activation, live lead routing, PR merge, or mass page generation approval.

## Strategy

Use **contract-first hybrid**: preserve the structure discovered in uploaded DOCX/Claude materials, translate Tilda/source block names into Astro/data blocks, then adapt repeating templates and Claude skills to this shared contract. Do not copy old source blocks literally and do not force all pages into one rigid layout.

## Source material base

The draft is grounded in `docs/review/kiber-94-materials-alignment/materials-analysis.md`, covering 11 representative materials: 6 article details, 2 подборки/сборки, 3 robot cards, plus extracted Claude skills for rent/articles/sborki.

## Page-type matrix

| Page type | Role | H1 pattern | Primary keyword rule | First block / AI summary | CTA | Schema | Safety |
|---|---|---|---|---|---|---|---|
| `home` | commercial gateway for robot rental demand | Commercial H1 contains owner-approved high-frequency service intent such as “Аренда роботов …”. | One approved high-frequency commercial cluster; usually аренда/прокат роботов. | First visible block answers who, what service, for which events, and how to request selection. / 80–220 visible chars summarizing brand, service, event use cases, and next action for AI extraction. | Primary CTA to request/contact; secondary to catalog/подборки. No live routing implication beyond approved forms. | Organization + WebSite; ItemList when catalog/promo lists are visible. | Only approved brand/contact/service claims; do not imply availability/prices for all models. |
| `robot_card` | one model rental/service page | Pattern: “Аренда {robotName}” or approved close equivalent with rental intent visible. | Model-specific commercial query: аренда/прокат/заказать {robotName}; do not invent search volume. | First block must answer what model is, rental availability, scenarios, operator/logistics boundary, and price status if approved/request-only. / Short answer for AI: model, service context, suitable scenarios, price status, what manager clarifies. | Lead/request CTA with robot/scenario context; price CTA must not claim unapproved package. | Service + BreadcrumbList; FAQPage only when visible FAQ exists; Offer only for approved public prices. | Prices from approved tariff source only; capabilities with source status; no invented autonomy, movement, language, or venue claims. |
| `category` | robot type/category hub | Category name + rental/category intent, e.g. “Гуманоидные роботы в аренду”. | Mid-frequency category/service query; not a single model query. | First block defines category, when to use it, and points to model list. / Category-level answer: what robots are in the class, common scenarios, how to choose. | CTA to selection/request plus model cards. | CollectionPage + ItemList + BreadcrumbList; FAQPage if visible FAQ. | Do not claim every robot fits every scenario; category copy must defer uncertain selection to manager. |
| `compilation` | scenario/theme landing page built from source “сборка” materials | Scenario/theme phrase + robots/rental intent where natural, using public label Подборки in navigation. | Scenario/theme query, not only model query; may be commercial or informational-commercial hybrid. | First block states the occasion/scenario, who it is for, and what robot formats are compared/recommended. / AI summary names scenario, recommended robot formats, selection logic, and request path. | CTA to discuss scenario; catalog/product block links to approved robot cards. | CollectionPage + ItemList + BreadcrumbList; FAQPage if visible FAQ. | Catalog prices must be sourced; scenario recommendations must not overpromise venue outcomes or availability. |
| `article_index` | blog/article listing page | Index H1 is section label, currently “Блог Кибер Гоши”; no need to force individual article keyword. | Section-level informational/commercial-support query; not one article keyword. | First block explains what the blog contains and how to use articles to choose robots. / AI summary describes section scope and links to article/detail pages. | CTA to articles and contact/request; no fake article count promises. | WebPage or Blog; ItemList recommended when article cards exist. | Index copy must not pretend unpublished article detail pages exist publicly. |
| `article_detail` | informational/how-to/detail content page | Specific article headline; contains the primary query naturally, not keyword stuffing. | One article-level query mapped to archetype: scenario, price explainer, ideas/listicle, or comparison. | Hero + intro must answer the user’s search question within first 1–2 paragraphs. / 80–220 char extractable answer: what the article explains, involved robots/scenarios, and when to contact manager. | Gosha quote or CTA near end plus contextual links to robot cards/request. | Article or BlogPosting + BreadcrumbList; FAQPage when visible FAQ exists. | Generated article claims start as needs_review; price/model specs must reconcile to source-of-truth before publication. |
| `news_index` | news listing page | Section H1 such as “Новости” or approved КИБЕР ПОРТАЛ news label. | Freshness/news section query; not model rental keyword unless section copy supports it. | First block explains what news/events are collected and links to items. / AI summary gives section scope, publication policy, and source context. | CTA to related service pages only when news item context supports it. | WebPage or CollectionPage + ItemList; not NewsArticle for index alone. | No invented dates, participants, awards, venues, or client names. |
| `news_detail` | event/news detail page | Specific event/news headline; includes date/context where appropriate. | News/entity query or event-specific informational query. | First block states what happened, when, where, source/evidence, and why it matters. / AI summary gives factual who/what/when/where without promotional invention. | Contextual CTA only after factual report; link to relevant robot/service if directly related. | NewsArticle + BreadcrumbList; images with factual alt/source. | Every factual claim needs source/date; no fabricated client/event details. |
| `contacts` | contact/conversion support page | Contacts H1; no need to force commercial keyword unnaturally. | Navigational/local/contact intent. | First block exposes approved ways to contact and what happens after request. / AI summary lists approved contact channels and service scope. | CTA to request/contact methods; no unapproved live routing assumptions. | ContactPage; Organization/LocalBusiness only with approved legal/business data. | Use only approved public contacts/requisites; do not expose secrets or internal routing. |
| `legal` | legal/compliance utility page | Legal document H1; exact document title. | Legal/navigational intent; do not optimize for robot rental unless naturally relevant. | First block states the document scope and effective context. / AI summary names document type and scope without changing legal meaning. | CTA optional; links to contacts/legal set. | WebPage; specific legal schema only after legal review. | Do not rewrite legal copy for SEO; no commercial keyword stuffing. |
| `conversion` | lead/request/thanks utility page | Action H1: request, thanks, next step; not a landing keyword target. | Transactional/conversion support intent. | First block explains current action, expected next step, and privacy boundary. / AI summary explains request/thanks function; no false promise of live CRM. | Primary form/contact action only where approved; thanks page next links. | WebPage; noindex policy may apply by route. | Do not imply production lead routing, analytics, or secret changes unless separately approved. |

## Repeating templates to solve first

1. `robot_card` — most commercially important and repeated across robot pages; source materials show richer 9-block service cards than the current Astro template.
2. `article_detail` — uploaded articles vary by archetype and size; needs a typed block renderer instead of a single rigid article layout.
3. `compilation` — Claude calls these “сборки”, public UI should say “Подборки”; needs landing/detail support, not just `/compilations/` index.

## Article detail archetypes

| Archetype | Sample materials | Required behavior |
|---|---|---|
| `scenario/occasion` | `article_23_feb`, `article_sofia_gala`, `article_store_opening` | Use required article core plus optional typed blocks relevant to the query. |
| `price_explainer` | `article_price` | Use required article core plus optional typed blocks relevant to the query. |
| `ideas/listicle` | `article_unusual_corporate` | Use required article core plus optional typed blocks relevant to the query. |
| `comparison` | `article_unitree_comparison` | Use required article core plus optional typed blocks relevant to the query. |

## Public vs review-only boundary

- Public blocks: hero, intro/body blocks, galleries after media review, catalog links after route/source validation, CTA, FAQ, related public links.
- Review-only blocks: Wordstat, SERP analysis, checklist reports, source notes, keyword density, price reconciliation, claim source status, internal-link proposals, CRM/analytics/lead-routing implementation notes.
- Public term: **Подборки**. Preserve “сборка” only as source alias/internal migration label.

## Implementation gate

Before changing templates or importing many pages, this matrix and `data/seo/page-type-intent-contract.draft.json` should be reviewed. CI now has a contract test that ensures all sitewide page types keep H1/title/keyword/first-block/AI-summary/CTA/schema/internal-link/factual-safety rules.
