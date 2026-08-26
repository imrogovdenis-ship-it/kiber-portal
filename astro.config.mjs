import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
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
