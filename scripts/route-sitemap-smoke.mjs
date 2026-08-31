import assert from 'node:assert/strict';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = process.cwd();
const distRoot = resolve(root, 'dist');
const registryPath = resolve(root, 'data/seo/launch-routes.json');
const redirectsPath = resolve(root, 'data/seo/redirects.json');
const reportPath = resolve(root, 'docs/review/kiber-43/route-sitemap-report.json');

function routeToHtmlFile(path) {
  if (path === '/') return join(distRoot, 'index.html');
  const clean = path.replace(/^\//, '').replace(/\/$/, '');
  return join(distRoot, clean, 'index.html');
}

function canonicalFor(site, path) {
  return `${site.replace(/\/$/, '')}${path}`;
}

function extractLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

assert.equal(existsSync(distRoot), true, 'dist/ missing; run npm run build:production before npm run test:routes');
assert.equal(existsSync(registryPath), true, 'data/seo/launch-routes.json missing');
assert.equal(existsSync(redirectsPath), true, 'data/seo/redirects.json missing');

const registry = JSON.parse(readFileSync(registryPath, 'utf8'));
const redirects = JSON.parse(readFileSync(redirectsPath, 'utf8'));
const site = registry.site;
const routes = registry.routes;
const sitemapRoutes = routes.filter((route) => route.sitemap === true);
const nonSitemapRoutes = routes.filter((route) => route.sitemap !== true);
const failures = [];

if (registry.schemaVersion !== 1) failures.push('launch-routes schemaVersion must be 1');
if (!site || !site.startsWith('https://')) failures.push('registry.site must be an https origin');
if (routes.some((route) => route.path.startsWith('/preview/'))) failures.push('preview routes must not be in launch registry');
if (routes.some((route) => route.path === '/404.html')) failures.push('404.html must not be in launch registry');

const duplicateRoutes = routes.map((route) => route.path).filter((path, index, all) => all.indexOf(path) !== index);
if (duplicateRoutes.length) failures.push(`duplicate launch routes: ${[...new Set(duplicateRoutes)].join(', ')}`);

for (const route of routes) {
  const htmlFile = routeToHtmlFile(route.path);
  if (!existsSync(htmlFile)) {
    failures.push(`${route.path}: missing built route ${htmlFile.replace(`${distRoot}/`, 'dist/')}`);
    continue;
  }
  const html = readFileSync(htmlFile, 'utf8');
  if (/noindex/i.test(html) && route.sitemap === true) failures.push(`${route.path}: sitemap route contains noindex`);
  if (!html.includes(canonicalFor(site, route.path))) failures.push(`${route.path}: missing canonical ${canonicalFor(site, route.path)}`);
}

const sitemapFile = join(distRoot, 'sitemap.xml');
if (!existsSync(sitemapFile)) failures.push('dist/sitemap.xml missing');
let sitemapXml = '';
let sitemapLocs = [];
if (existsSync(sitemapFile)) {
  sitemapXml = readFileSync(sitemapFile, 'utf8');
  sitemapLocs = extractLocs(sitemapXml);
  if (!sitemapXml.includes('<urlset')) failures.push('sitemap.xml missing <urlset>');
}

const expectedLocs = sitemapRoutes.map((route) => canonicalFor(site, route.path));
const duplicateLocs = sitemapLocs.filter((loc, index, all) => all.indexOf(loc) !== index);
if (duplicateLocs.length) failures.push(`duplicate sitemap locs: ${[...new Set(duplicateLocs)].join(', ')}`);
for (const expected of expectedLocs) {
  if (!sitemapLocs.includes(expected)) failures.push(`sitemap missing ${expected}`);
}
for (const loc of sitemapLocs) {
  if (!expectedLocs.includes(loc)) failures.push(`sitemap contains unexpected URL ${loc}`);
}
for (const route of nonSitemapRoutes) {
  const loc = canonicalFor(site, route.path);
  if (sitemapLocs.includes(loc)) failures.push(`non-sitemap route leaked into sitemap: ${loc}`);
}
for (const redirect of redirects.redirects || []) {
  const fromLoc = canonicalFor(site, redirect.from.endsWith('/') ? redirect.from : `${redirect.from}/`);
  if (sitemapLocs.includes(fromLoc)) failures.push(`redirect source leaked into sitemap: ${fromLoc}`);
  const targetFile = routeToHtmlFile(redirect.to);
  if (!existsSync(targetFile)) failures.push(`redirect target missing for ${redirect.from} -> ${redirect.to}`);
}
if (/preview|design-review|404\.html|lead\/thanks/i.test(sitemapXml)) failures.push('sitemap contains preview/review/404/thank-you disallowed text');

const report = {
  issue: 'KIBER-43',
  generatedAt: new Date().toISOString(),
  site,
  routesChecked: routes.length,
  sitemapUrls: sitemapLocs.length,
  sitemapLocs,
  redirectsChecked: (redirects.redirects || []).length,
  status: failures.length ? 'failed' : 'passed',
  failures,
};
mkdirSync(resolve(root, 'docs/review/kiber-43'), { recursive: true });
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

if (failures.length) {
  console.error(`KIBER-43 route/sitemap smoke failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log(`KIBER-43 route/sitemap smoke passed: ${routes.length} launch routes, ${sitemapLocs.length} sitemap URLs, ${(redirects.redirects || []).length} redirects checked.`);
