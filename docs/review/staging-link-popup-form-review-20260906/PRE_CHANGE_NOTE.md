# Pre-change note — staging link for popup/form review

## What will change

Refresh the existing Alex-owned protected staging container `alex-kiber-staging` with the current local preview build so Alexander can review the homepage and popup/form work in a browser.

## Affected scope

- Container: `alex-kiber-staging` only.
- Image: new local `alex-kiber-staging:popup-form-review-20260906`.
- Existing Traefik labels/middlewares preserved from current `alex-kiber-staging`.
- No host ports will be published.

## Out of scope

- No production deploy.
- No DNS changes.
- No analytics changes.
- No live lead routing / amoCRM / Telegram bot activation.
- No shared AI Class containers or `/root` changes.

## Rollback

Keep previous image reference from `docker inspect alex-kiber-staging`; rollback by recreating `alex-kiber-staging` from the previous image with preserved labels/network if needed.

## Verification

- `docker ps` for `alex-kiber-staging` healthy/up.
- Public staging URL returns Basic Auth challenge unauthenticated.
- Authenticated check not performed unless stored credentials are available without printing them.
- `/` contains contact popup markup and new messenger links.
- `X-Robots-Tag: noindex, nofollow` remains present.
