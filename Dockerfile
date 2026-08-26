FROM node:22-alpine AS build

WORKDIR /workspace

ARG DEPLOY_ENV=production
ARG DESIGN_REVIEW_ENABLED=false
ENV DEPLOY_ENV=$DEPLOY_ENV
ENV DESIGN_REVIEW_ENABLED=$DESIGN_REVIEW_ENABLED

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY . .
RUN npm run verify && npm run build

FROM nginx:alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --quiet --spider http://127.0.0.1:8080/healthz/ || exit 1
