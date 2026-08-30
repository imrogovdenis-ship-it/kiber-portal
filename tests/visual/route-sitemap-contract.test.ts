import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';

const root = process.cwd();

test('KIBER-43 defines launch route registry and sitemap endpoint', async () => {
  const registryPath = resolve(root, 'data/seo/launch-routes.json');
  const sitemapEndpoint = resolve(root, 'src/pages/sitemap.xml.ts');
  assert.equal(existsSync(registryPath), true, 'launch route registry is required');
  assert.equal(existsSync(sitemapEndpoint), true, 'sitemap endpoint is required');

  const registry = JSON.parse(await readFile(registryPath, 'utf8'));
  assert.equal(registry.schemaVersion, 1);
  const routes = registry.routes as Array<{ path: string; sitemap: boolean }>;
  assert.ok(routes.some((route) => route.path === '/' && route.sitemap === true));
  const robotRoutes = routes.filter((route) => route.path.startsWith('/robots/') && route.sitemap === true);
  assert.equal(robotRoutes.length, 24, 'KIBER-45 should register 24 robot detail routes');
  assert.ok(routes.some((route) => route.path === '/robots/arenda-unitree-g1/' && route.sitemap === true));
  assert.equal(routes.some((route) => route.path.startsWith('/preview/')), false);
  assert.equal(routes.some((route) => route.path === '/404.html'), false);
});

test('KIBER-43 exposes route/sitemap smoke as CI gate', async () => {
  const scriptPath = resolve(root, 'scripts/route-sitemap-smoke.mjs');
  assert.equal(existsSync(scriptPath), true, 'route sitemap smoke is required');

  const script = await readFile(scriptPath, 'utf8');
  assert.match(script, /sitemap\.xml/);
  assert.match(script, /redirects\.json/);
  assert.match(script, /noindex/);
  assert.match(script, /canonical/);

  const packageJson = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
  assert.equal(packageJson.scripts['test:routes'], 'node scripts/route-sitemap-smoke.mjs');
  assert.match(packageJson.scripts.ci, /test:routes/);
});

test('KIBER-40 tracks all 44 production URLs with canonical type and status', async () => {
  const registryPath = resolve(root, 'data/seo/production-url-registry.json');
  assert.equal(existsSync(registryPath), true, 'production URL registry is required');

  const registry = JSON.parse(await readFile(registryPath, 'utf8'));
  assert.equal(registry.issue, 'KIBER-40');
  assert.equal(registry.expectedProductionUrlCount, 44);
  assert.equal(registry.urls.length, 44);
  assert.equal(new Set(registry.urls.map((item: { path: string }) => item.path)).size, 44);
  assert.equal(registry.urls.filter((item: { status: string }) => item.status === 'deferred-content-review').length, 7);

  for (const item of registry.urls as Array<{ path: string; url: string; canonical: string; pageType: string; status: string }>) {
    assert.equal(item.url, `${registry.site}${item.path === '/' ? '' : item.path}`);
    assert.equal(item.canonical, item.url);
    assert.ok(item.pageType);
    assert.ok(item.status);
  }
});

test('KIBER-41 tracks URL keep merge delete redirect decisions with no unresolved rows', async () => {
  const decisionPath = resolve(root, 'data/seo/url-decision-registry.json');
  assert.equal(existsSync(decisionPath), true, 'URL decision registry is required');

  const registry = JSON.parse(await readFile(decisionPath, 'utf8'));
  assert.equal(registry.issue, 'KIBER-41');
  assert.equal(registry.expectedUrlCount, 44);
  assert.equal(registry.summary.total, 44);
  assert.equal(registry.summary.unresolved, 0);
  assert.equal(registry.summary.productionActionAllowed, 0);
  assert.equal(registry.decisions.length, 44);
}
);
