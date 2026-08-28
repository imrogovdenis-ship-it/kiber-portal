import assert from 'node:assert/strict';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = process.cwd();
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const json = (path) => JSON.parse(read(path));

const registry = json('data/review/launch-readiness-crawl.json');
const launchRoutes = json('data/seo/launch-routes.json');
const leadCapability = json('data/lead/capability-contract.json');
const mediaRights = json('data/review/media-rights-registry.json');

assert.equal(registry.issue, 'KIBER-launch-readiness-crawl');
assert.equal(registry.productionPermission, false);
assert.equal(registry.goNoGoStatus, 'blocked_until_owner_decisions');

const routes = launchRoutes.routes.map((route) => route.path);
const routeMeta = new Map(launchRoutes.routes.map((route) => [route.path, route]));
const routeResults = [];
for (const route of routes) {
  const file = route === '/' ? 'dist/index.html' : join('dist', route.replace(/^\//, '').replace(/\/$/, ''), 'index.html');
  const exists = existsSync(resolve(root, file));
  assert.equal(exists, true, `${route} missing ${file}`);
  const html = read(file);
  routeResults.push({ route, file, h1Count: (html.match(/<h1\b/g) || []).length, hasCanonical: /rel="canonical"/.test(html) });
}

for (const route of registry.criticalRoutes || []) {
  const meta = routeMeta.get(route.path);
  assert(meta, `Critical route ${route.path} must exist in launch route inventory`);
  assert.equal(meta.sitemap, route.sitemap, `Critical route ${route.path} sitemap mismatch`);
}

assert.equal(existsSync(resolve(root, 'dist/404.html')), true, '404 page must exist');
assert.equal(existsSync(resolve(root, 'dist/sitemap.xml')), true, 'sitemap must exist');
assert(routeResults.every((r) => r.h1Count === 1), 'every launch route must have exactly one h1');
assert(routeResults.every((r) => r.hasCanonical), 'every launch route must have canonical');

const robotRoutes = routes.filter((route) => route.startsWith('/robots/'));
assert.equal(robotRoutes.length, 24, '24 robot pages must be in launch route inventory');

for (const required of ['/privacy-policy/', '/consent/', '/cookie-policy/']) {
  assert(routes.includes(required), `${required} must be in launch routes`);
}

assert.equal(leadCapability.routing.enabled, false, 'lead routing must stay disabled');
assert.deepEqual(leadCapability.routing.destinations, [], 'lead destinations must stay empty');
assert.equal(mediaRights.summary.productionApproved, 0, 'no media rights production approval should be claimed');

const productionBlockers = registry.productionBlockers;
assert(productionBlockers.includes('explicit production deploy permission'));
assert(productionBlockers.includes('live lead routing destinations and backend'));

const report = {
  issue: registry.issue,
  status: 'passed_with_blockers',
  routesChecked: routes.length,
  robotRoutesChecked: robotRoutes.length,
  legalRoutesPresent: ['/privacy-policy/', '/consent/', '/cookie-policy/'],
  leadRoutingEnabled: leadCapability.routing.enabled,
  leadDestinations: leadCapability.routing.destinations.length,
  mediaProductionApproved: mediaRights.summary.productionApproved,
  productionBlockers,
  generatedAt: new Date().toISOString(),
};

mkdirSync(resolve(root, 'docs/review/launch-readiness-crawl'), { recursive: true });
writeFileSync(resolve(root, 'docs/review/launch-readiness-crawl/report.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(`KIBER launch readiness crawl passed: ${routes.length} routes, ${robotRoutes.length} robots; go/no-go remains blocked by ${productionBlockers.length} owner decisions.`);
