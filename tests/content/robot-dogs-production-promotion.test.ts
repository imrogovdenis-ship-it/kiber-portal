import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import launchRoutes from '../../data/seo/launch-routes.json' with { type: 'json' };
import launchArticles from '../../data/content/launch-articles.json' with { type: 'json' };
import { getRobotDogsPreviewArticles } from '../../src/lib/robot-dogs-preview-adapter';

const approvedArticleRoutes = [
  '/articles/robot-dlya-nauchnogo-shou-i-shkoly/',
  '/articles/robot-stendist-dlya-vystavki/',
  '/articles/roboty-unitree-obzor-kompanii/',
  '/articles/sravnenie-robosobak-dlya-meropriyatiy/',
  '/articles/unitree-go2-na-meropriyatii/',
  '/articles/xiaomi-cyberdog-2-v-promo-akciyah/',
] as const;

const promotedRoutes = ['/roboty-sobaki/', ...approvedArticleRoutes] as const;

test('seven approved robot-dogs pages are production launch routes with sitemap indexing', () => {
  for (const path of promotedRoutes) {
    const route = launchRoutes.routes.find((item) => item.path === path);
    assert.ok(route, `${path} missing from launch route registry`);
    assert.equal(route.status, 'launch', `${path} must be launch status`);
    assert.equal(route.sitemap, true, `${path} must be included in sitemap`);
    assert.equal('noindex' in route ? route.noindex : false, false, `${path} must not carry noindex flag`);
    assert.equal(route.sourceStatus, 'owner_approved', `${path} must record owner approval`);
  }
});

test('six approved robot-dogs articles are in public blog inventory with canonical hrefs', () => {
  const byCanonical = new Map(launchArticles.map((item) => [item.canonicalHref, item]));
  for (const path of approvedArticleRoutes) {
    const item = byCanonical.get(path);
    assert.ok(item, `${path} missing from launch-articles`);
    assert.equal(item.href, path, `${path} public inventory href must be canonical in production`);
    assert.ok(item.image.src.startsWith('/images/robot-dogs-preview/'), `${path} must use approved robot-dogs image`);
  }
});

test('production source guards no longer exclude approved robot-dogs pages', () => {
  const articleRouteSource = readFileSync('src/pages/articles/[slug].astro', 'utf8');
  const dogsPageSource = readFileSync('src/pages/roboty-sobaki.astro', 'utf8');
  const baseLayoutSource = readFileSync('src/layouts/BaseLayout.astro', 'utf8');

  assert.doesNotMatch(articleRouteSource, /DEPLOY_ENV\s*!==\s*['"]preview['"]\)\s*return \[\]/, 'article static paths must exist in production');
  assert.doesNotMatch(articleRouteSource, /noindex=\{true\}/, 'approved article render must not be hardcoded noindex');
  assert.match(dogsPageSource, /const previewTemplate = getRobotDogsPreviewCompilation\(\);/, 'approved compilation template must always provide production content');
  assert.doesNotMatch(baseLayoutSource, /roboty-sobaki[^\n]+noindex|noindex[^\n]+roboty-sobaki/, 'BaseLayout must not force roboty-sobaki noindex');
});

test('homepage/index compilation inventory exposes dog compilation without replacing approved card identity', () => {
  const source = readFileSync('src/lib/launch-navigation.ts', 'utf8');
  assert.match(source, /Роботы-собаки/, 'launch navigation must explicitly enable dog card');
  assert.match(source, /dog \? '\/roboty-sobaki\/'/, 'dog compilation card must link canonical route');
  const homeSource = readFileSync('data/design/home-live-blocks.json', 'utf8');
  assert.match(homeSource, /Роботы-собаки вместо цветов/);
  assert.match(homeSource, /tild3865-6231-4930-b331-613466613565__03\.jpg/);
});

test('approved package adapter still exposes the same six article canonical paths', () => {
  assert.deepEqual(getRobotDogsPreviewArticles().map((article) => article.seo.canonical).sort(), [...approvedArticleRoutes].sort());
});

test('homepage preserves approved six article cards while blog keeps full published inventory', () => {
 const home = readFileSync('src/pages/index.astro', 'utf8');
 assert.match(home, /cards=\{launchArticles\.cards\.slice\(0, 6\)\}/);
 assert.equal(launchArticles.length, 12);
});
