import assert from 'node:assert/strict';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const matrixPath = resolve(root, 'data/review/kiber-65-readiness-matrix.json');
const reportPath = resolve(root, 'docs/review/kiber-65/readiness-matrix-report.json');
const failures = [];
const warnings = [];

function read(path) {
  return readFileSync(resolve(root, path), 'utf8');
}

function json(path) {
  return JSON.parse(read(path));
}

function mustExist(path) {
  if (!existsSync(resolve(root, path))) failures.push(`${path} missing`);
}

mustExist('data/review/kiber-65-readiness-matrix.json');
mustExist('data/lead/capability-contract.json');
mustExist('data/analytics/provider-neutral-events.json');
mustExist('data/seo/launch-routes.json');
mustExist('data/seo/redirects.json');
mustExist('public/robots.txt');
mustExist('dist/sitemap.xml');
mustExist('dist/404.html');

const matrix = existsSync(matrixPath) ? JSON.parse(readFileSync(matrixPath, 'utf8')) : { areas: [] };
const lead = json('data/lead/capability-contract.json');
const analytics = json('data/analytics/provider-neutral-events.json');
const launch = json('data/seo/launch-routes.json');
const redirects = json('data/seo/redirects.json');
const readiness = json('data/review/launch-readiness-crawl.json');

if (matrix.schemaVersion !== 1) failures.push('matrix schemaVersion must be 1');
if (matrix.issue !== 'KIBER-65') failures.push('matrix issue must be KIBER-65');
if (matrix.productionPermission !== false) failures.push('KIBER-65 must not grant production permission');
if (matrix.status !== 'passed_with_production_blockers') failures.push('matrix status must be passed_with_production_blockers');

const areaById = new Map((matrix.areas || []).map((area) => [area.id, area]));
for (const id of ['forms', 'analytics', 'robots', 'sitemap', 'redirects']) {
  const area = areaById.get(id);
  if (!area) failures.push(`area missing: ${id}`);
  else if (!String(area.status).startsWith('green')) failures.push(`${id}: area status must be green*`);
  for (const evidence of area?.evidence || []) mustExist(evidence);
}

// Forms / lead routing safety.
if (lead.routing?.mode !== 'capability-only') failures.push('lead routing mode must remain capability-only');
if (lead.routing?.enabled !== false) failures.push('lead routing must remain disabled');
if (!Array.isArray(lead.routing?.destinations) || lead.routing.destinations.length !== 0) failures.push('lead destinations must remain empty');
const apiTest = read('tests/visual/api-leads-endpoint.test.ts');
for (const required of ['privacy consent', 'dry-run', 'does not call amoCRM or Telegram']) {
  if (!apiTest.toLowerCase().includes(required.toLowerCase())) failures.push(`api leads tests missing ${required} coverage`);
}

// Analytics stays provider-neutral / deferred.
if (analytics.provider !== 'neutral') failures.push('analytics provider contract must remain neutral');
if (analytics.deferredProvider?.name !== 'yandex_metrica') failures.push('deferred analytics provider must remain yandex_metrica');
if (analytics.deferredProvider?.counterId !== null) failures.push('analytics counterId must be null');
if (analytics.deferredProvider?.cookieConsentEnabled !== false) failures.push('analytics cookies must remain disabled');
if (analytics.deferredProvider?.productionDeploy !== 'not-approved') failures.push('analytics provider production deploy must remain not-approved');

// Robots + sitemap + redirects.
const robotsTxt = read('public/robots.txt');
if (!robotsTxt.includes('User-agent: *')) failures.push('robots.txt missing User-agent: *');
if (!robotsTxt.includes('Allow: /')) failures.push('robots.txt must allow production crawling');
if (!robotsTxt.includes('Sitemap: https://www.kiber-portal.ru/sitemap-index.xml')) failures.push('robots.txt missing production sitemap-index URL');

const routes = launch.routes || [];
const robotRoutes = routes.filter((route) => route.path?.startsWith('/robots/'));
const sitemapRoutes = routes.filter((route) => route.sitemap === true);
const sitemap = read('dist/sitemap.xml');
if (routes.length !== 37) failures.push(`expected 37 launch routes, got ${routes.length}`);
if (robotRoutes.length !== 24) failures.push(`expected 24 robot routes, got ${robotRoutes.length}`);
if ((sitemap.match(/<loc>/g) || []).length !== 31) failures.push('expected 31 sitemap <loc> entries');
for (const route of sitemapRoutes) {
  const loc = `${launch.site.replace(/\/$/, '')}${route.path}`;
  if (!sitemap.includes(`<loc>${loc}</loc>`)) failures.push(`sitemap missing ${loc}`);
}
for (const forbidden of ['/preview/', '/design-review', '/lead/thanks/', '/404.html', '/test-blok']) {
  if (sitemap.includes(forbidden)) failures.push(`sitemap contains forbidden route fragment ${forbidden}`);
}

const redirectSources = new Set();
for (const redirect of redirects.redirects || []) {
  if (!redirect.from?.startsWith('/') || !redirect.to?.startsWith('/')) failures.push('redirect paths must be absolute');
  if (redirect.status !== 301) failures.push(`${redirect.from}: redirect status must be 301`);
  if (redirectSources.has(redirect.from)) failures.push(`${redirect.from}: duplicate redirect source`);
  redirectSources.add(redirect.from);
}
if (!redirectSources.has('/test-blok/') || !redirectSources.has('/test-blok')) failures.push('redirects must include both /test-blok variants');
const redirectsConf = read('nginx.redirects.conf');
if (!redirectsConf.includes('location = /test-blok/')) failures.push('nginx.redirects.conf missing /test-blok/ location');
if (!read('nginx.conf').includes('error_page 404 /404.html;')) failures.push('nginx.conf must serve static 404');

// KIBER-65 is a verification gate, not production GO.
const productionBlockers = readiness.productionBlockers || [];
for (const blocker of ['live lead routing destinations and backend', 'analytics provider decision and IDs', 'explicit production deploy permission']) {
  if (!productionBlockers.includes(blocker)) failures.push(`readiness blockers missing: ${blocker}`);
}
for (const flag of ['productionDeployChanged', 'dnsChanged', 'productionSecretsChanged', 'analyticsProviderEnabled', 'analyticsCookiesEnabled', 'liveLeadRoutingEnabled', 'realTestLeadsSubmitted']) {
  if (matrix.safety?.[flag] !== false) failures.push(`safety.${flag} must be false`);
}

if ((matrix.blockingProductionDependencies || []).length) {
  warnings.push('Production matrix is not GO: KIBER-64/KIBER-67/KIBER-69 remain separate approval-dependent tasks.');
}

const report = {
  issue: 'KIBER-65',
  status: failures.length ? 'failed' : 'passed_with_production_blockers',
  generatedAt: new Date().toISOString(),
  areas: Object.fromEntries([...areaById.entries()].map(([id, area]) => [id, area.status])),
  routesChecked: routes.length,
  robotRoutesChecked: robotRoutes.length,
  sitemapUrls: (sitemap.match(/<loc>/g) || []).length,
  redirectsChecked: (redirects.redirects || []).length,
  leadRoutingEnabled: lead.routing?.enabled,
  leadDestinations: lead.routing?.destinations?.length ?? null,
  analyticsProvider: analytics.provider,
  analyticsDeferredProvider: analytics.deferredProvider?.name,
  analyticsCounterIdConfigured: analytics.deferredProvider?.counterId !== null,
  productionBlockers,
  safety: matrix.safety,
  failures,
  warnings,
};

mkdirSync(resolve(root, 'docs/review/kiber-65'), { recursive: true });
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

if (failures.length) {
  console.error(`KIBER-65 readiness matrix smoke failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log(`KIBER-65 readiness matrix smoke passed: forms/analytics/robots/sitemap/redirects green; production remains blocked by ${productionBlockers.length} approval gates.`);
assert.equal(failures.length, 0);
