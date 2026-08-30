import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';

const root = process.cwd();

test('KIBER-40 defines all 44 production URLs with type canonical and status', async () => {
  const registryPath = resolve(root, 'data/seo/production-url-registry.json');
  assert.equal(existsSync(registryPath), true, 'production URL registry is required');

  const registry = JSON.parse(await readFile(registryPath, 'utf8')) as {
    schemaVersion: number;
    issue: string;
    site: string;
    expectedProductionUrlCount: number;
    urls: Array<{
      url: string;
      path: string;
      pageType: string;
      canonical: string;
      status: string;
      sitemap: boolean;
      source: string;
      controlledPath?: string;
      blocker?: string;
    }>;
  };

  assert.equal(registry.schemaVersion, 1);
  assert.equal(registry.issue, 'KIBER-40');
  assert.equal(registry.site, 'https://www.kiber-portal.ru');
  assert.equal(registry.expectedProductionUrlCount, 44);
  assert.equal(registry.urls.length, 44);

  const paths = registry.urls.map((item) => item.path);
  assert.equal(new Set(paths).size, paths.length, 'production URL paths must be unique');
  assert.equal(paths.includes('/'), true);
  assert.equal(paths.filter((path) => path.startsWith('/robots/')).length, 24);

  const deferredArticles = registry.urls.filter((item) => item.status === 'deferred-content-review');
  assert.equal(deferredArticles.some((item) => item.path.startsWith('/articles/')), false, 'legacy article URLs should stay at their known production slugs until migrated');
  assert.equal(deferredArticles.length, 7, 'the 7 legacy article/detail URLs must be inventoried but human-gated');

  for (const item of registry.urls) {
    assert.match(item.path, /^\//);
    assert.equal(item.url, `${registry.site}${item.path === '/' ? '' : item.path}`);
    assert.equal(item.canonical, item.url);
    assert.ok(item.pageType.length > 0, `${item.path}: pageType is required`);
    assert.ok(item.status.length > 0, `${item.path}: status is required`);
    assert.ok(item.source.length > 0, `${item.path}: source is required`);
    assert.doesNotMatch(item.url, /preview|design-review|parity|404|lead\/thanks/i);
    if (item.status === 'deferred-content-review') {
      assert.equal(item.sitemap, false);
      assert.match(item.blocker ?? '', /content\/SEO owner review/i);
    }
  }
});

test('KIBER-40 exposes the production URL registry through CI route contract checks', async () => {
  const routeTest = await readFile(resolve(root, 'tests/visual/route-sitemap-contract.test.ts'), 'utf8');
  assert.match(routeTest, /production-url-registry\.json/);
  assert.match(routeTest, /expectedProductionUrlCount/);

  const packageJson = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
  assert.match(packageJson.scripts['test:visual'], /tests\/visual\/\*\*\/\*\.test\.ts/);
});
