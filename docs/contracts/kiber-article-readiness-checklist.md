# KIBER article readiness checklist

Status: **owner_approved_workflow**  
Owner instruction: when Alexander says “пиши статью”, “делай статью”, or gives a new KIBER article task, the expected deliverable is the complete article ready for Jino preview, not intermediate research/progress reports. Use this checklist as the final gate before sending the preview link.

Applies to: `/articles/...` pages using `ApprovedArticle5.astro` and KIBER article contracts.

## Operating mode

Run the full article pipeline silently/autonomously unless a hard blocker requires owner input.

Do **not** stop after:
- first draft;
- Wordstat/SERP only;
- text-only article;
- local build only;
- generated Hero only;
- partial preview upload.

Stop and ask only for true blockers: missing source scope, missing approved robot facts, missing credentials/tool access, impossible media generation, or production/legal/business decisions.

## Required pipeline before preview

1. **Scope and source intake**
   - [ ] Article title/theme and target URL are fixed.
   - [ ] Article type is classified: scenario, comparison, explainer, event ideas, overview, FAQ/guide.
   - [ ] Repo contracts and approvals are read before implementation.
   - [ ] Existing article vs new article status is known.
   - [ ] Production is explicitly out of scope unless separately approved.

2. **SEO and market research**
   - [ ] Wordstat is checked live or user-exported with evidence. For a final owner-ready article, `needs_verification` is a blocker unless Alexander explicitly accepts a draft/scaffold.
   - [ ] Yandex SERP is checked live or user-exported with evidence. Captcha/login/anti-bot is a blocker to final handoff; do not bypass it and do not present the article as ready until resolved or explicitly scoped as draft.
   - [ ] Google SERP is checked live or user-exported with evidence. Anti-bot/non-parseable shell is a blocker to final handoff; do not silently continue as final.
   - [ ] Competitor/page-type gaps are recorded from real SERP evidence or the article is labeled draft/scaffold.
   - [ ] Noise/excluded intent is recorded.
   - [ ] SEO passport exists: primary intent, keyword cluster, reader decision, article promise, blocks needed/omitted.

3. **Robot and fact verification**
   - [ ] Every mentioned robot exists in current repo/source-of-truth.
   - [ ] Names, URLs, categories and prices (if used) match current robot data.
   - [ ] **Robot display names are checked separately from SEO/page-title names:** catalog/card H3 titles must use nominative model names (`SenseRobot`, `Unitree Go2`, `Робобар`, `Promobot V4`, etc.), not inflected phrases like `робота-шахматиста ...` pulled from generated identity/SEO fields.
   - [ ] The source of each visible robot name is recorded/understood: route override, article data, `robot.identity.name`, `robot.identity.model`, or another field. If the source field is inflected, add a scoped display-title mapping or a normalized display-name field before preview.
   - [ ] Built/rendered HTML is checked for duplicate-case artifacts in card titles and aria labels, e.g. `Открыть карточку робота робота-...`, `>робота-...<`, wrong quotes/case, or mixed model names.
   - [ ] Capabilities and limitations are verified or softened.
   - [ ] No unsupported EDU/Ultra/model-variant claims are added.
   - [ ] Robot selection follows article intent, not count-filling.

4. **Article structure and writing**
   - [ ] H1, SEO intro, body, Gosha handoff, checklist, FAQ, CTA and catalog share one article promise.
   - [ ] H2/H3 headings explain meaning, not only brand names.
   - [ ] Text is customer/funnel-first, not internal report language.
   - [ ] No SEO stuffing or copied competitor text.
   - [ ] Gosha uses a strong first paragraph and compact manager handoff.
   - [ ] FAQ count is **5–8 rendered questions**; count actual Jino/rendered `<details>` or FAQ items and record the number.
   - [ ] “Перед заявкой” checklist exists when buyer inputs/venue/timing/scenario matter.

5. **Blocks and galleries**
   - [ ] Required/common article blocks are present or intentionally omitted with a reason.
   - [ ] If several robots/roles are mentioned, analyze whether **“Роботы из сценария”** is needed.
   - [ ] If needed, **“Роботы из сценария”** is placed after Cyber Gosha and before **“Перед заявкой”**.
   - [ ] This block uses one strong real photo per mentioned robot/role from robot-card galleries, copied to `public/images/articles/<slug>/gallery/`.
   - [ ] No generated photos, filler robots, weak catalog-card duplicates, dark/blurry/cropped/seasonally wrong images are used in this block.
   - [ ] Catalog block uses catalog/card robot images, not scenario gallery photos.
   - [ ] Related articles / “Блог Кибер Гоши” renders **exactly 6 article cards** selected for this article, not the global registry dump.
   - [ ] Related articles and compilations are release-safe and contain no public `/preview/kiber-94` links.

6. **Hero and media**
   - [ ] New article: dedicated article-specific Hero is generated/drawn from an internal brief based on article meaning.
   - [ ] Existing article rewrite: current Hero is kept unless owner requested a new image or the old image is factually/semantically wrong.
   - [ ] Hero is 16:9, article-owned, decodes, has no embedded text/logos, wrong robots, severe artifacts or bad crop.
   - [ ] `alt` is truthful and useful.
   - [ ] `actualDescription` records factual/provenance details, including generated/editorial nature when applicable.
   - [ ] Article Hero/media/gallery public `alt` values are checked against the media contract: truthful visual/entity/scene description, no raw unverified `sourceAlt`, no internal boilerplate such as `специальная иллюстрация блока...`.
   - [ ] Visible alt describes the buyer-facing scene, not internal provenance; provenance stays in `actualDescription`.
   - [ ] Commercial/long-tail phrasing in alts is balanced: roughly every second meaningful image may carry SEO context when visually truthful, not every image.
   - [ ] Visual-orientir/mediaMoment visible copy is buyer-facing, not provenance.

7. **Implementation and routing**
   - [ ] Article data file exists and matches TypeScript contract.
   - [ ] Route exists at `/articles/<slug>/`.
   - [ ] Launch/content registries and SEO route config are updated when required.
   - [ ] Draft/preview article keeps `noindex` and sitemap exclusion until publication approval.
   - [ ] Public runtime asset paths are stable; no local filesystem paths leak into HTML.

8. **Local validation**
   - [ ] `npm run check` passes with 0 errors.
   - [ ] `npm run build:production` passes.
   - [ ] `npm run test:routes` passes.
   - [ ] `npm run build:preview` passes.
   - [ ] Built HTML references the intended Hero/gallery assets.
   - [ ] Built HTML contains no unintended `/preview/kiber-94` public links.

9. **Rendered/browser audit**
   - [ ] Desktop rendered audit passes.
   - [ ] Tablet rendered audit passes.
   - [ ] Mobile rendered audit passes.
   - [ ] Robot catalog cards are visually/a11y checked: H3 titles show nominative model names and aria labels do not contain doubled case (`робота робота-...`).
   - [ ] No horizontal overflow.
   - [ ] Browser console errors: 0.
   - [ ] Failed requests: 0.
   - [ ] Unsafe analytics/POST requests on preview: 0 unless explicitly expected.
   - [ ] Hero and gallery are visible/usable in browser.

10. **Jino preview gate**
    - [ ] Updated article and all required assets are uploaded to Jino preview.
    - [ ] Preview article URL returns 200.
    - [ ] Hero/gallery/catalog assets return 200 and decode.
    - [ ] `X-Robots-Tag: noindex, nofollow` is present for draft/preview.
    - [ ] Preview `robots.txt` disallows indexing.
    - [ ] Final preview URL is checked in browser.
    - [ ] Production was not touched.

11. **Final owner response**
    - [ ] Provide only the ready preview link and concise summary of what is ready.
    - [ ] Mention validations passed and any honest remaining blocker/risk.
    - [ ] Do not send intermediate “I did draft / next step?” reports unless explicitly requested.

## Completion rule

If any checklist item fails and can be fixed without owner decision, fix it and run the checklist again. Only send the preview when the checklist is complete or when a true blocker is clearly reported.

   - [ ] Mobile Hero image starts flush with the Hero block: `imgTop - heroTop = 0`, `heroPaddingTop = 0px`, no dark/black strip above the image.

## Related compilations block gate

- [ ] `docs/contracts/kiber-related-compilations-block-contract.md` checked.
- [ ] Article renders a bottom «Подборки» block as the last content block before the footer.
- [ ] The block has exactly 5 cards: 4 topical compilation cards plus final «Все наши подборки» linking to `/compilations/`.
- [ ] Planned/not-ready compilation cards use CTA `Скоро`.
- [ ] Card styling uses the shared `HomeImageCards` approved overlay style, with no page-local redesign.

## Blog Gosha block gate

- [ ] `docs/contracts/kiber-blog-gosha-block-contract.md` checked.
- [ ] Article renders «Блог Кибер Гоши» as the penultimate block before «Подборки».
- [ ] The block has exactly 6 cards: 5 real existing articles + final «Все статьи Блога Кибер Гоши» linking to `/articles/`.
- [ ] Article cards use canonical article-card data from the registry/runtime source; no invented page-local article cards.
- [ ] `npm run test:blog-gosha-blocks` passes before Jino/readiness handoff.

## Article-card image consistency

- [ ] Article card image in `data/content/launch-articles.json` and `data/content/published-articles.json` matches the current rendered article Hero image; `npm run test:blog-gosha-blocks` passes the image-vs-Hero assertion.
