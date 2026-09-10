import { defineConfig } from 'astro/config';
import { rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  output: 'static',
  integrations: [{ name: 'exclude-review-artifacts-from-production', hooks: { 'astro:build:done': ({ dir }) => { if (process.env.DEPLOY_ENV === 'production') rmSync(fileURLToPath(new URL('preview/', dir)), { recursive: true, force: true }); } } }],
  site: 'https://www.kiber-portal.ru',
  build: {
    format: 'directory',
  },
  vite: {
    build: {
      sourcemap: false,
    },
  },
});
