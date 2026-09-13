import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
test('shared head preloads every existing above-fold Montserrat weight with matching CORS', () => {
  const head = readFileSync('src/components/layout/SeoHead.astro', 'utf8');
  for (const weight of ['Regular', 'Medium', 'SemiBold', 'Bold']) {
    const tag = head.match(new RegExp('<link[^>]*href="/fonts/montserrat/Montserrat-' + weight + '\\.woff2"[^>]*>'))?.[0];
    assert.ok(tag, `Missing preload for ${weight}: late fallback swaps shift headings/banner`);
    assert.match(tag, /rel="preload"/);
    assert.match(tag, /as="font"/);
    assert.match(tag, /type="font\/woff2"/);
    assert.match(tag, /crossorigin/);
  }
});
