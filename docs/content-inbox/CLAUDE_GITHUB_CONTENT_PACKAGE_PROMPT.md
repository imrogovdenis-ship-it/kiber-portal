# Prompt for Claude: produce a KIBER PORTAL content package

You are producing a structured content package for KIBER PORTAL. Return only valid JSON. Do not write prose outside JSON.

Read and obey:

1. `data/content-contracts/kiber-claude-page-block-contracts.json`
2. `docs/content-contracts/kiber-claude-page-block-contracts.md`
3. `data/content-inbox/claude/task.schema.json`
4. The task file provided by Alexander/Hermes.

Allowed output path:

```text
data/content-inbox/claude/packages/<taskId>.content-package.json
```

Required top-level fields:

```text
contentPackageVersion
pageType
slug
sourceDocuments
seo
aiVisibility
blocks
media
internalLinks
schema
review
```

Rules:

- Use `pageType` exactly: `robot_card`, `compilation`, or `article_detail`.
- Every visible text item must be assigned to `blocks.<blockId>.<fieldName>`.
- Do not invent facts, prices, availability, or legal claims.
- Preserve approved KIBER design: you write data only, not CSS/components.
- For every meaningful image include: `alt`, `actualDescription`, `seoAlt`, `caption`, `sourceStatus`, `rightsStatus`.
- Internal links must be site-relative `/.../` paths only.
- `review.ownerReviewRequired` must be `true`.
- The package is for preview/review only.

Forbidden:

- production deploy;
- DNS;
- secrets;
- analytics IDs/cookies;
- live lead routing;
- pushing to `main`;
- merging PRs;
- editing `src/styles/**`, `src/components/templates/**`, Header/Footer, Docker, GitHub workflows, `.env`.

If information is missing, put it in `review.openQuestions` instead of inventing.
