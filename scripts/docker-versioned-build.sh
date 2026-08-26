#!/usr/bin/env bash
set -euo pipefail

IMAGE_REPOSITORY="${IMAGE_REPOSITORY:-alex-kiber-portal}"
DEPLOY_ENV="${DEPLOY_ENV:-production}"
DESIGN_REVIEW_ENABLED="${DESIGN_REVIEW_ENABLED:-false}"
PUBLIC_ANALYTICS_PROVIDER="${PUBLIC_ANALYTICS_PROVIDER:-disabled}"
VCS_URL="${VCS_URL:-https://github.com/imrogovdenis-ship-it/kiber-portal}"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "docker-versioned-build must be run inside the git repository" >&2
  exit 1
fi

if [ "${ALLOW_DIRTY_BUILD:-false}" != "true" ]; then
  if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "Refusing to build a versioned release/staging image from a dirty working tree." >&2
    echo "Commit or stash changes first so BUILD_SHA maps exactly to the image contents." >&2
    echo "For throwaway local experiments only, set ALLOW_DIRTY_BUILD=true." >&2
    exit 1
  fi
fi

BUILD_SHA="${BUILD_SHA:-$(git rev-parse HEAD)}"
SHORT_SHA="${BUILD_SHA:0:7}"
BUILD_DATE="${BUILD_DATE:-$(date -u +%Y-%m-%dT%H:%M:%SZ)}"
IMAGE_VERSION="${IMAGE_VERSION:-sha-${SHORT_SHA}}"
IMAGE_TAG="${IMAGE_TAG:-${IMAGE_REPOSITORY}:${IMAGE_VERSION}}"

case "$BUILD_SHA" in
  [0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f]*) ;;
  *) echo "BUILD_SHA must start with a git SHA prefix: $BUILD_SHA" >&2; exit 1 ;;
esac

docker build \
  --build-arg DEPLOY_ENV="$DEPLOY_ENV" \
  --build-arg DESIGN_REVIEW_ENABLED="$DESIGN_REVIEW_ENABLED" \
  --build-arg PUBLIC_ANALYTICS_PROVIDER="$PUBLIC_ANALYTICS_PROVIDER" \
  --build-arg BUILD_SHA="$BUILD_SHA" \
  --build-arg IMAGE_VERSION="$IMAGE_VERSION" \
  --build-arg BUILD_DATE="$BUILD_DATE" \
  --build-arg VCS_URL="$VCS_URL" \
  --label deployed.commit="$BUILD_SHA" \
  --label deployed.version="$IMAGE_VERSION" \
  --label org.opencontainers.image.revision="$BUILD_SHA" \
  --label org.opencontainers.image.version="$IMAGE_VERSION" \
  --label org.opencontainers.image.created="$BUILD_DATE" \
  -t "$IMAGE_TAG" \
  .

printf 'IMAGE_TAG=%s\n' "$IMAGE_TAG"
printf 'BUILD_SHA=%s\n' "$BUILD_SHA"
printf 'IMAGE_VERSION=%s\n' "$IMAGE_VERSION"
printf 'BUILD_DATE=%s\n' "$BUILD_DATE"
