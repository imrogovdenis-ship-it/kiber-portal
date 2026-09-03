# Kinescope video workflow for KIBER PORTAL

This document records Alexander's decision for future KIBER PORTAL video work so the team does not need to redesign the process later.

## Owner decision

Alexander will provide Kinescope access through the safe API/1Password path:

- the agent may directly upload videos to Kinescope;
- access must be provided as an API token through 1Password / `op://` or local env;
- passwords, raw API tokens, cookies, and Authorization headers must not be sent in chat and must not be committed to Git.

## Source of truth

- Contract: `data/media/kinescope-video-contract.json`
- Video registry: `data/media/kinescope-video-library.json`
- Rendering component: `src/components/blocks/KinescopeVideo.astro`
- Smoke gate: `scripts/kinescope-video-contract-smoke.mjs`

Concrete Kinescope URLs should be stored in the central registry, not pasted ad hoc into Markdown or Astro pages.

## Folder plan in Kinescope

```text
KIBER PORTAL/
  raw-inbox/
  robots/<robot-slug>/
  compilations/<compilation-slug>/
  articles/<article-slug>/
  cases/<case-slug>/
```

`raw-inbox` is only for owner-provided files before final assignment.

## Upload workflow

1. Alexander attaches video files and says the intended page/block, or leaves them for `raw-inbox` classification.
2. The agent inspects format, duration, orientation, audio presence, and whether a poster is needed.
3. The agent uploads through the Kinescope API using `KINESCOPE_API_TOKEN` from 1Password/op or local env only.
4. The upload uses Kinescope metadata such as `X-Video-Title`, `X-Video-Description`, `X-File-Name`, optional `X-Poster-URL`, and target parent/folder when available.
5. The agent waits until Kinescope returns/reads back `status = done`.
6. The agent stores `id`, `project_id`, `folder_id`, `play_link`, `embed_link`, `hls_link`, duration, poster and usage mapping in `data/media/kinescope-video-library.json`.
7. Site pages reference videos by registry `videoId`, not by loose pasted links.
8. The agent runs build, rendered smoke tests, SEO checks, and secret scan before PR/commit.

## Rendering rule

Use `KinescopeVideo.astro` for Kinescope embeds. Blocks must be:

- responsive with a fixed aspect-ratio box;
- lazy-loaded;
- fullscreen-capable;
- poster-aware;
- safe fallback link enabled;
- free of secrets/auth headers.

## SEO rule

Meaningful approved videos should produce `VideoObject` JSON-LD with at least:

- `name`;
- `description`;
- `thumbnailUrl`;
- `uploadDate`;
- `duration`;
- `embedUrl`.

The text layers stay separate:

- `actualDescription` — what is actually visible in the video;
- `seoTitle` / `seoDescription` — SEO-aware but truthful;
- `caption` — visible user-facing short caption;
- `transcriptSummary` — optional summary/transcript layer.

## Page usage

Allowed page types:

- `compilation` / Подборки;
- `article` / Блог Кибер Гоши;
- `case`;
- optional `robot_card` video blocks;
- landing sections.

Video is its own media class. It is not an image gallery asset and should not be mixed with robot hero/card/capability/gallery records unless a separate page contract explicitly says so.

## Linear tracking

Created tracking issue: [KIBER-97](https://linear.app/ai-class/issue/KIBER-97/kinescope-video-upload-and-rendering-pipeline).

The future implementation task should cover:

- Kinescope API token mapping via 1Password/op;
- upload script/CLI;
- folder discovery/creation or selected folder IDs;
- registry updates from API readback;
- `KinescopeVideo.astro` integration into real compilation/article/case templates;
- `VideoObject` JSON-LD;
- rendered smoke tests;
- privacy/cookie review before production.

## Approval boundaries

This contract does not approve or change:

- production deploy;
- DNS;
- analytics provider/scripts;
- live lead routing;
- publication of unreviewed video rights;
- cookie/consent activation.

Those remain separate owner-gated decisions.
