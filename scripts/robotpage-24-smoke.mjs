import assert from 'node:assert/strict';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const root = process.cwd();
const distRoot = resolve(root, 'dist');
const sourcePath = resolve(root, 'data/models/robots.source-of-truth.json');
const generatedPath = resolve(root, 'src/content/robots.generated.json');
const launchRoutesPath = resolve(root, 'data/seo/launch-routes.json');
const reportPath = resolve(root, 'docs/review/kiber-45/robotpage-24-report.json');
const site = 'https://www.kiber-portal.ru';

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function routeToHtml(route) {
  return route === '/' ? resolve(distRoot, 'index.html') : resolve(distRoot, route.replace(/^\//, ''), 'index.html');
}

function getAll(html, pattern) {
  return [...html.matchAll(pattern)].map((match) => match[1]);
}

function jsonLdTypes(html) {
  return getAll(html, /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)
    .flatMap((raw) => {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [parsed];
    })
    .map((item) => item['@type'])
    .filter(Boolean);
}

assert.equal(existsSync(distRoot), true, 'dist/ missing; run npm run build:production before npm run test:robotpage-24');
assert.equal(existsSync(sourcePath), true, 'robots source-of-truth missing');
assert.equal(existsSync(generatedPath), true, 'generated robot records missing');
assert.equal(existsSync(launchRoutesPath), true, 'launch route registry missing');

const source = readJson(sourcePath);
const generated = readJson(generatedPath);
const launchRoutes = readJson(launchRoutesPath);

assert.equal(source.count, 24, 'source-of-truth must contain 24 robots');
assert.equal(source.robots.length, 24, 'source-of-truth robot count mismatch');
assert.equal(generated.count, 24, 'generated robot count mismatch');
assert.equal(generated.robots.length, 24, 'generated robot list mismatch');

const sourceSlugs = new Set(source.robots.map((robot) => robot.slug));
const generatedSlugs = new Set(generated.robots.map((robot) => robot.slug));
assert.equal(sourceSlugs.size, 24, 'source robot slugs must be unique');
assert.deepEqual(generatedSlugs, sourceSlugs, 'generated slugs must match source slugs');

const robotRoutes = launchRoutes.routes.filter((route) => route.template === 'robot-detail');
assert.equal(robotRoutes.length, 24, 'launch registry must expose 24 robot-detail routes');

const rendered = [];
for (const robot of generated.robots) {
  const route = `/robots/${robot.slug}/`;
  const htmlPath = routeToHtml(route);
  assert.equal(existsSync(htmlPath), true, `${robot.slug}: rendered HTML missing`);
  const html = readFileSync(htmlPath, 'utf8');

  assert.ok(robot.slug.startsWith('arenda-'), `${robot.slug}: canonical source slug expected`);
  assert.equal(robot.route, route, `${robot.slug}: generated route mismatch`);
  assert.equal(robot.status, 'review', `${robot.slug}: imported record must stay review status`);
  assert.equal(robot.review.publicRender, false, `${robot.slug}: review block must be private`);
  assert.equal(html.includes('KIBER-45 import source status'), false, `${robot.slug}: review note leaked`);
  assert.equal(html.includes('KIBER-50-REVIEW-ONLY-SENTINEL'), false, `${robot.slug}: KIBER-50 sentinel leaked`);

  assert.match(html, new RegExp(`data-kiber-task="KIBER-45"[^>]+data-robot-slug="${robot.slug}"|data-robot-slug="${robot.slug}"[^>]+data-kiber-task="KIBER-45"`), `${robot.slug}: unified RobotPage marker missing`);
  assert.match(html, /data-vertical-step="robot-to-lead"/, `${robot.slug}: CTA path missing`);
  assert.match(html, /Не является публичной офертой/, `${robot.slug}: pricing disclaimer missing`);

  const title = getAll(html, /<title>([^<]+)<\/title>/g)[0] || '';
  const h1 = getAll(html, /<h1[^>]*>([\s\S]*?)<\/h1>/gi).map((text) => text.replace(/<[^>]+>/g, '').trim());
  assert.ok(title.includes('КИБЕР ПОРТАЛ'), `${robot.slug}: branded title missing`);
  assert.equal(h1.length, 1, `${robot.slug}: expected exactly one H1`);
  assert.ok(h1[0].length > 0, `${robot.slug}: empty H1`);

  const canonical = `${site}${route}`;
  assert.ok(html.includes(`<link rel="canonical" href="${canonical}"`), `${robot.slug}: canonical missing`);
  assert.ok(html.includes(`property="og:url" content="${canonical}"`), `${robot.slug}: og:url must match canonical`);
  assert.ok(html.includes('name="twitter:image"'), `${robot.slug}: twitter image missing`);
  assert.ok(html.includes('name="robots" content="index, follow"'), `${robot.slug}: robots index/follow missing`);

  const types = jsonLdTypes(html);
  assert.ok(types.includes('Service'), `${robot.slug}: Service JSON-LD missing`);
  assert.ok(types.includes('BreadcrumbList'), `${robot.slug}: BreadcrumbList JSON-LD missing`);

  const heroSrc = robot.media.hero.src;
  if (heroSrc.startsWith('/images/')) {
    assert.equal(existsSync(resolve(distRoot, heroSrc.replace(/^\//, ''))), true, `${robot.slug}: hero image missing in dist`);
  }

  rendered.push({ slug: robot.slug, route, title, h1: h1[0], jsonLdTypes: types });
}

const distRobotDirs = readdirSync(resolve(distRoot, 'robots'), { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name);
assert.equal(distRobotDirs.length, 24, 'dist/robots should contain exactly 24 directories');

mkdirSync(dirname(reportPath), { recursive: true });
writeFileSync(reportPath, `${JSON.stringify({
  issue: 'KIBER-45',
  generatedAt: new Date().toISOString(),
  sourceRobots: source.robots.length,
  generatedRobots: generated.robots.length,
  renderedRobotPages: rendered.length,
  sourceStatus: source.status,
  generatedStatus: generated.status,
  routePrefix: '/robots/[slug]/',
  result: 'passed',
  sample: rendered.slice(0, 8),
}, null, 2)}\n`);

console.log(`KIBER-45 RobotPage smoke passed: ${rendered.length} robot pages rendered through one /robots/[slug]/ template.`);
