import assert from 'node:assert/strict';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const root = process.cwd();
const site = 'https://www.kiber-portal.ru';
const jsonLdMime = 'application/ld+json';
const distRoot = resolve(root, 'dist');
const routesPath = resolve(root, 'data/seo/launch-routes.json');
const reportPath = resolve(root, 'docs/review/kiber-51/seo-metadata-structured-data-report.json');

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function htmlFileForRoute(routePath) {
  if (routePath === '/') return resolve(distRoot, 'index.html');
  return resolve(distRoot, routePath.replace(/^\//, ''), 'index.html');
}

function getFirst(html, pattern, label) {
  const match = html.match(pattern);
  assert.ok(match, `${label} is missing`);
  return match[1].trim();
}

function getAll(html, pattern) {
  return [...html.matchAll(pattern)].map((match) => match[1].trim());
}

function normalizeText(value) {
  return value.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function metaContent(html, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`<meta\\s+(?:name|property)=["']${escaped}["']\\s+content=["']([^"']+)["']\\s*\\/?>(?:<\\/meta>)?`, 'i');
  return getFirst(html, pattern, selector);
}

function parseJsonLd(html) {
  return getAll(html, new RegExp(`<script\\s+type=["']${jsonLdMime.replace('/', '\\/').replace('+', '\\+')}["'][^>]*>([\\s\\S]*?)<\\/script>`, 'gi')).map((raw) => JSON.parse(raw));
}

function schemaTypes(items) {
  const types = [];
  for (const item of items) {
    const type = item['@type'];
    if (Array.isArray(type)) types.push(...type);
    else if (type) types.push(type);
  }
  return types;
}

const launchRoutes = readJson(routesPath).routes.filter((route) => route.sitemap === true && route.status === 'launch');
assert.ok(launchRoutes.length > 0, 'launch routes required');
assert.equal(existsSync(distRoot), true, 'dist/ missing; run npm run build:production before test:seo-metadata');

const seenTitles = new Map();
const seenH1 = new Map();
const checked = [];

for (const route of launchRoutes) {
  const file = htmlFileForRoute(route.path);
  assert.equal(existsSync(file), true, `${route.path}: rendered HTML missing`);
  const html = readFileSync(file, 'utf8');
  const expectedCanonical = new URL(route.path, site).toString();

  const title = normalizeText(getFirst(html, /<title>([\s\S]*?)<\/title>/i, `${route.path}: title`));
  assert.ok(title.length >= 12, `${route.path}: title too short`);
  assert.equal(seenTitles.has(title), false, `${route.path}: duplicate title also used by ${seenTitles.get(title)}`);
  seenTitles.set(title, route.path);

  const h1s = getAll(html, /<h1(?:\s[^>]*)?>([\s\S]*?)<\/h1>/gi).map(normalizeText).filter(Boolean);
  assert.equal(h1s.length, 1, `${route.path}: expected exactly one H1`);
  assert.equal(seenH1.has(h1s[0]), false, `${route.path}: duplicate H1 also used by ${seenH1.get(h1s[0])}`);
  seenH1.set(h1s[0], route.path);

  const canonical = getFirst(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i, `${route.path}: canonical`);
  assert.equal(canonical, expectedCanonical, `${route.path}: canonical must be absolute production URL`);

  const description = metaContent(html, 'description');
  assert.ok(description.length >= 40, `${route.path}: meta description too short`);
  assert.equal(metaContent(html, 'robots'), 'index, follow', `${route.path}: launch route must be indexable`);

  assert.equal(metaContent(html, 'og:title'), title, `${route.path}: og:title must match title`);
  assert.equal(metaContent(html, 'og:description'), description, `${route.path}: og:description must match description`);
  assert.equal(metaContent(html, 'og:url'), canonical, `${route.path}: og:url must match canonical`);
  assert.equal(metaContent(html, 'og:site_name'), 'КИБЕР ПОРТАЛ', `${route.path}: og:site_name`);
  assert.match(metaContent(html, 'og:image'), /^https:\/\/www\.kiber-portal\.ru\//, `${route.path}: og:image must be absolute production URL`);

  assert.equal(metaContent(html, 'twitter:title'), title, `${route.path}: twitter:title must match title`);
  assert.equal(metaContent(html, 'twitter:description'), description, `${route.path}: twitter:description must match description`);
  assert.equal(metaContent(html, 'twitter:url'), canonical, `${route.path}: twitter:url must match canonical`);
  assert.match(metaContent(html, 'twitter:image'), /^https:\/\/www\.kiber-portal\.ru\//, `${route.path}: twitter:image must be absolute production URL`);

  const jsonLd = parseJsonLd(html);
  assert.ok(jsonLd.length > 0, `${route.path}: JSON-LD required`);
  for (const item of jsonLd) {
    assert.equal(item['@context'], 'https://schema.org', `${route.path}: JSON-LD context must be schema.org`);
  }
  const types = schemaTypes(jsonLd);
  if (route.path === '/') {
    assert.ok(types.includes('Organization'), `${route.path}: Organization JSON-LD required`);
    assert.ok(types.includes('WebSite'), `${route.path}: WebSite JSON-LD required`);
  } else if (route.template === 'robot-detail') {
    assert.ok(types.includes('Service'), `${route.path}: Service JSON-LD required`);
    assert.ok(types.includes('BreadcrumbList'), `${route.path}: BreadcrumbList JSON-LD required`);
  } else if (route.path === '/contacts/') {
    assert.ok(types.includes('ContactPage'), `${route.path}: ContactPage JSON-LD required`);
  } else {
    assert.ok(types.includes('CollectionPage'), `${route.path}: CollectionPage JSON-LD required`);
  }

  checked.push({ path: route.path, title, h1: h1s[0], jsonLdTypes: types });
}

mkdirSync(dirname(reportPath), { recursive: true });
writeFileSync(reportPath, `${JSON.stringify({
  issue: 'KIBER-51',
  generatedAt: new Date().toISOString(),
  launchRoutesChecked: checked.length,
  site,
  checks: ['canonical', 'meta description', 'robots', 'unique title', 'unique h1', 'Open Graph', 'Twitter', 'JSON-LD'],
  routes: checked,
  result: 'passed',
}, null, 2)}\n`);

console.log(`KIBER-51 SEO metadata smoke passed: ${checked.length} launch routes checked for canonical, unique H1/title, OG/Twitter and JSON-LD.`);
