FROM node:22-alpine AS build

WORKDIR /workspace

ARG DEPLOY_ENV=production
ARG DESIGN_REVIEW_ENABLED=false
ARG BUILD_SHA=unknown
ARG IMAGE_VERSION=unknown
ARG BUILD_DATE=unknown
ENV DEPLOY_ENV=$DEPLOY_ENV
ENV DESIGN_REVIEW_ENABLED=$DESIGN_REVIEW_ENABLED
ENV BUILD_SHA=$BUILD_SHA
ENV IMAGE_VERSION=$IMAGE_VERSION
ENV BUILD_DATE=$BUILD_DATE

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY . .
RUN npm run verify && npm run build

FROM nginx:alpine AS runtime

ARG BUILD_SHA=unknown
ARG IMAGE_VERSION=unknown
ARG BUILD_DATE=unknown
ARG VCS_URL=https://github.com/imrogovdenis-ship-it/kiber-portal

LABEL org.opencontainers.image.source=$VCS_URL \
  org.opencontainers.image.revision=$BUILD_SHA \
  org.opencontainers.image.version=$IMAGE_VERSION \
  org.opencontainers.image.created=$BUILD_DATE \
  org.opencontainers.image.title="kiber-portal" \
  org.opencontainers.image.description="KIBER PORTAL static Astro runtime" \
  deployed.commit=$BUILD_SHA \
  deployed.version=$IMAGE_VERSION

ENV BUILD_SHA=$BUILD_SHA
ENV IMAGE_VERSION=$IMAGE_VERSION
ENV BUILD_DATE=$BUILD_DATE

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --quiet --spider http://127.0.0.1:8080/healthz/ || exit 1
