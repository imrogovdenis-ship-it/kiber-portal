import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = (path: string) => readFile(new URL(`../../${path}`, import.meta.url), 'utf8');

test('layout foundation exposes accessible navigation and SEO contracts', async () => {
  const [layout, header, breadcrumbs, seo] = await Promise.all([
    source('src/layouts/BaseLayout.astro'),
    source('src/components/layout/Header.astro'),
    source('src/components/layout/Breadcrumbs.astro'),
    source('src/components/layout/SeoHead.astro'),
  ]);

  assert.match(layout, /class="skip-link"/);
  assert.match(header, /aria-expanded="false"/);
  assert.match(header, /aria-controls="primary-navigation"/);
  assert.match(breadcrumbs, /aria-current="page"/);
  assert.match(breadcrumbs, /application\/ld\+json/);
  assert.match(seo, /property="og:title"/);
  assert.match(seo, /name="twitter:card"/);
});
