
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const root = process.cwd();
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');
const json = (path: string) => JSON.parse(read(path));

const launchArticleSlugs = [
  'robot-gumanoid-dlya-vystavki',
  'kak-vybrat-robota-gumanoida-dlya-meropriyatiya',
  'unitree-g1-r1-h2-sravnenie-dlya-arendy',
  'promobot-ili-gumanoid-dlya-prezentatsii',
  'robot-gumanoid-na-korporativ',
  'skolko-stoit-arenda-robota-gumanoida',
];

test('fast launch exposes one live humanoid compilation through the approved template', () => {
  const page = read('src/pages/roboty-gumanoidy.astro');
  assert.match(page, /CompilationTemplate/);
  assert.match(page, /buildHumanoidCompilationTemplate/);
  assert.doesNotMatch(page, /category-page__/);
});

test('fast launch defines exactly six launch-ready humanoid article packages', () => {
  assert.equal(existsSync(resolve(root, 'src/lib/kiber94-launch-articles-data.ts')), true);
  const source = read('src/lib/kiber94-launch-articles-data.ts');
  for (const slug of launchArticleSlugs) assert.match(source, new RegExp(`slug: '${slug}'`));
  assert.doesNotMatch(source, /TODO|черновик|заглушк|Wordstat|SERP|review-only|draft_for_owner_review/i);
});

test('fast launch has public article routes, sitemap entries, and no news placeholder in sitemap', () => {
  assert.equal(existsSync(resolve(root, 'src/pages/articles/[slug].astro')), true);
  const routes = json('data/seo/launch-routes.json').routes;
  for (const slug of launchArticleSlugs) {
    const route = routes.find((entry: { path: string; status?: string; sitemap?: boolean; template?: string }) => entry.path === `/articles/${slug}/`);
    assert.ok(route, `${slug}: missing from launch routes`);
    assert.equal(route.status, 'launch');
    assert.equal(route.sitemap, true);
    assert.equal(route.template, 'article-detail');
  }
  const news = routes.find((entry: { path: string; status?: string; sitemap?: boolean; template?: string }) => entry.path === '/news/');
  assert.ok(!news || news.sitemap === false, 'news placeholder must not be in sitemap for fast launch');
});

test('fast launch manifest records included scope and explicit production boundaries', () => {
  const manifest = json('data/review/launch-scope-manifest.json');
  assert.equal(manifest.launchScope, 'fast_humanoids_plus_articles');
  assert.equal(manifest.productionPermissionIncluded, false);
  assert.equal(manifest.dnsPermissionIncluded, false);
  assert.equal(manifest.analyticsDeferredPostLaunch, true);
  for (const slug of launchArticleSlugs) assert.ok(manifest.includedRoutes.includes(`/articles/${slug}/`));
  assert.ok(manifest.excludedOrNoindex.includes('/news/'));
});
