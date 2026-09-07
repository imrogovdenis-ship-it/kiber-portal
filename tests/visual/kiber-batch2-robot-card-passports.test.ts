import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const slugs = [
  'arenda-unitree-g1',
  'arenda-bellabot',
  'arenda-kettybot',
  'arenda-unitree-go2',
  'arenda-xiaomi-cyberdog-2',
  'arenda-promobot-v4',
];

const forbiddenGenericPrimaries = [
  'аренда робота-гуманоида',
  'аренда робота-собаки',
  'аренда робота-официанта',
  'аренда роботов на мероприятие',
  'аренда робота для праздника',
];

function readJson(path: string) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

test('KIBER Batch 2 robot-card SEO passports are exact-model scoped and review-gated', () => {
  const summary = readJson('data/seo/robot-card-passports/batch2-robot-cards.robot-card-seo-passports-summary.json');
  assert.deepEqual(summary.robots, slugs);
  assert.equal(summary.publicationBoundaries.productionDeployAllowed, false);
  assert.equal(summary.publicationBoundaries.dnsChangeAllowed, false);
  assert.equal(summary.publicationBoundaries.secretsChangeAllowed, false);
  assert.equal(summary.publicationBoundaries.liveLeadRoutingAllowed, false);
  for (const slug of slugs) {
    const passport = readJson(`data/seo/robot-card-passports/${slug}.robot-card-seo-passport.json`);
    assert.equal(passport.pageType, 'robot_card');
    assert.equal(passport.slug, slug);
    assert.match(passport.research.wordstatAnalysis.status, /^(checked_live|needs_live_verification)$/);
    assert.equal(passport.research.serpAnalysis.status, 'needs_live_verification');
    assert.equal(passport.seoIntent.pageIntent, 'commercial_robot_rental');
    assert.equal(passport.seoIntent.isCrawlerOnlyText, false);
    assert.equal(passport.review.ownerReviewRequired, true);
    assert.equal(passport.review.readyForPublication, false);
    assert.equal(passport.review.readyForMassRender, false);
    assert.equal(passport.media.capabilityImagesMustStaySeparate, true);
    assert.equal(passport.media.legacyTildaHeroRuntimeAllowed, false);
    assert.ok(passport.media.sourceGalleryPreviewImagesCount >= 6, `${slug} has converted source-gallery images`);
    assert.ok(passport.media.capabilityRegistryImagesCount >= 6, `${slug} has capability images`);
    assert.ok(!forbiddenGenericPrimaries.includes(passport.seo.primaryKeyword));
  }
});

test('KIBER Batch 2 robot-card galleries use converted source-gallery assets only', () => {
  const manifest = readJson('data/review/batch2-robot-card-gallery-assets.json');
  const dataSource = readFileSync('src/lib/kiber94-robot-template-data.ts', 'utf8');
  for (const slug of slugs) {
    assert.match(dataSource, new RegExp(`'${slug}'`));
    const robot = manifest.robots.find((item: { slug: string }) => item.slug === slug);
    assert.ok(robot, `${slug} gallery manifest exists`);
    assert.ok(robot.count >= 6, `${slug} has enough real gallery/action photos`);
    assert.ok(robot.assets.every((asset: { src: string }) => asset.src.startsWith('/images/kiber-94-preview/batch2-robot-cards/')), `${slug} uses batch2 preview gallery assets`);
    assert.ok(robot.assets.every((asset: { src: string }) => !asset.src.includes('/images/kiber-45/')), `${slug} excludes square catalog hero assets`);
    assert.ok(robot.assets.every((asset: { src: string }) => !asset.src.includes('__photo')), `${slug} excludes legacy horizontal hero assets`);
    assert.ok(robot.assets.every((asset: { sourceRole: string }) => asset.sourceRole === 'gallery' || asset.sourceRole === 'source_gallery_hero_candidate'), `${slug} uses source-gallery roles only`);
  }
});

test('KIBER Batch 2 rendered preview keeps approved robot-card CTA, media and Gosha gates when build exists', () => {
  if (!existsSync('dist/preview/kiber-94/robot-card')) return;
  const firstHtml = readFileSync(`dist/preview/kiber-94/robot-card/${slugs[0]}/index.html`, 'utf8');
  if (!firstHtml.includes('/images/kiber-94-preview/batch2-robot-cards/')) return;
  for (const slug of slugs) {
    const html = readFileSync(`dist/preview/kiber-94/robot-card/${slug}/index.html`, 'utf8');
    const hero = html.match(/<section[^>]+data-block-id="hero"[\s\S]*?<\/section>/)?.[0] ?? '';
    const heroCta = hero.match(/<a[^>]+>\s*Написать нам\s*<\/a>/)?.[0] ?? '';
    assert.match(heroCta, /href="#contact-messengers"/);
    assert.match(heroCta, /data-contact-popup-trigger/);
    assert.doesNotMatch(heroCta, /href="\/contacts\/"/);
    assert.doesNotMatch(html, /пока ждёт отдельной цитаты Гоши/);
    const h1 = html.match(/<h1[^>]*>(.*?)<\/h1>/s)?.[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() ?? '';
    assert.doesNotMatch(h1, /робота\s+робота/i);
    assert.match(html, /data-block-id="seoIntent"/);
    const gallery = html.match(/<section[^>]+data-block-id="gallery"[\s\S]*?<\/section>/)?.[0] ?? '';
    assert.doesNotMatch(gallery, /\/images\/kiber-45\//);
    assert.doesNotMatch(gallery, /__photo/);
    assert.match(html, /\/images\/robot-capabilities\//);
  }
});
