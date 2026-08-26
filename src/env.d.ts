/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_PHONE?: string;
  readonly PUBLIC_TG?: string;
  readonly PUBLIC_WA?: string;
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_ANALYTICS_PROVIDER?: string;
  readonly DEPLOY_ENV?: 'development' | 'preview' | 'production';
  readonly DESIGN_REVIEW_ENABLED?: 'true' | 'false';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
