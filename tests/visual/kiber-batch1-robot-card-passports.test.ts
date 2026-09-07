import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import test from 'node:test';

const slugs = [
  'arenda-agibot-x2',
  'arenda-noetix-bumi',
  'arenda-unitree-r1',
  'arenda-unitree-h2',
  'arenda-robota-sofiya',
  'arenda-robota-ardi',
  'arenda-robota-tron',
];

const forbiddenGenericPrimaries = [
  'аренда робота-гуманоида',
  'аренда роботов гуманоидов',
  'аренда робота для выставки',
  'аренда роботов на мероприятие',
  'аренда робота для праздника',
];

function readJson(path: string) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

test('KIBER Batch 1 robot-card SEO passports are review-gated and exact-model scoped', () => {
  const summaryPath = 'data/seo/robot-card-passports/batch1-humanoids.robot-card-seo-passports-summary.json';
  assert.equal(existsSync(summaryPath), true);
  const summary = readJson(summaryPath);
  assert.deepEqual(summary.robots, slugs);
  assert.equal(summary.status, 'research_passports_draft_for_owner_review');
  assert.equal(summary.publicationBoundaries.productionDeployAllowed, false);
  assert.equal(summary.publicationBoundaries.dnsChangeAllowed, false);
  assert.equal(summary.publicationBoundaries.secretsChangeAllowed, false);
  assert.equal(summary.publicationBoundaries.liveLeadRoutingAllowed, false);
  assert.equal(summary.publicationBoundaries.publicRouteReplacementAllowed, false);

  for (const slug of slugs) {
    const passportPath = `data/seo/robot-card-passports/${slug}.robot-card-seo-passport.json`;
    assert.equal(existsSync(passportPath), true, `${slug} passport exists`);
    const passport = readJson(passportPath);
    assert.equal(passport.pageType, 'robot_card');
    assert.equal(passport.slug, slug);
    assert.equal(passport.research.wordstatAnalysis.status, 'checked_live');
    assert.match(passport.research.serpAnalysis.status, /^(checked_partial|needs_live_verification)$/);
    assert.equal(passport.seoIntent.pageIntent, 'commercial_robot_rental');
    assert.equal(passport.seoIntent.isCrawlerOnlyText, false);
    assert.equal(passport.review.ownerReviewRequired, true);
    assert.equal(passport.review.readyForPublication, false);
    assert.equal(passport.review.readyForMassRender, false);
    assert.equal(passport.media.capabilityImagesMustStaySeparate, true);
    assert.equal(passport.media.legacyTildaHeroRuntimeAllowed, false);
    assert.ok(passport.media.capabilityRegistryImagesCount >= 6, `${slug} has capability registry images`);
    assert.ok(passport.research.contentGaps.length >= 2, `${slug} content gaps exist`);
    assert.ok(passport.blockMap.hero);
    assert.ok(passport.blockMap.capabilities);
    assert.ok(passport.blockMap.seoIntent);
    assert.ok(!forbiddenGenericPrimaries.includes(passport.seo.primaryKeyword));
    assert.match(passport.seo.primaryKeyword, /(Agibot X2|Noetix Bumi|Unitree R1|Unitree H2|София|Арди|Tron)/);
  }
});

test('KIBER Batch 1 robot-card galleries use real source-gallery photos, not hero/catalog-only fallback', () => {
  const galleryManifestPath = 'data/review/batch1-humanoids-gallery-assets.json';
  assert.equal(existsSync(galleryManifestPath), true);
  const galleryManifest = readJson(galleryManifestPath);
  const dataSource = readFileSync('src/lib/kiber94-robot-template-data.ts', 'utf8');
  const templateSource = readFileSync('src/components/templates/RobotCardTemplate.astro', 'utf8');
  assert.match(dataSource, /const batch1ReviewGalleryBySlug/);
  assert.ok(templateSource.includes('curatedGallerySplitIndex = 1 + Math.ceil(curatedGalleryPhotoCount / 2)'), 'gallery split is computed as roughly half of available real photos');
  assert.ok(templateSource.includes('gallery.slice(1, curatedGallerySplitIndex)'), 'primary gallery uses first roughly half of real photos');
  assert.ok(templateSource.includes('gallery.slice(curatedGallerySplitIndex)'), 'action gallery uses second roughly half without overlap');

  for (const slug of slugs) {
    const robot = galleryManifest.robots.find((item: { slug: string }) => item.slug === slug);
    assert.ok(robot, `${slug} gallery manifest exists`);
    assert.ok(robot.count >= 6, `${slug} has at least 6 real gallery/action photos`);
    const sources = robot.assets.map((asset: { src: string }) => asset.src);
    assert.ok(sources.every((src: string) => src.startsWith('/images/kiber-94-preview/batch1-humanoids/')), `${slug} uses converted preview gallery assets`);
    assert.ok(sources.every((src: string) => !src.includes('/images/kiber-45/')), `${slug} gallery photos exclude square catalog hero assets`);
    assert.ok(sources.every((src: string) => !src.includes('__photo')), `${slug} gallery photos exclude legacy horizontal hero assets`);
    assert.ok(robot.assets.every((asset: { sourceRole: string }) => asset.sourceRole === 'gallery'), `${slug} uses source-gallery role only`);

    const expectedPrimaryCount = Math.ceil(robot.count / 2);
    const expectedActionCount = robot.count - expectedPrimaryCount;
    assert.ok(expectedPrimaryCount >= 3, `${slug} primary gallery keeps at least 3 photos`);
    assert.ok(expectedActionCount >= 3 || robot.count === 6, `${slug} action gallery keeps a meaningful second half`);
    assert.ok(robot.assets.some((asset: { aspectRatio: number }) => Math.abs(asset.aspectRatio - 1) > 0.15), `${slug} has non-square photo ratios for height-driven layout`);
    assert.ok(robot.assets.every((asset: { webpWidth: number; webpHeight: number }) => !(asset.webpWidth === 720 && asset.webpHeight === 720)), `${slug} gallery assets are not square catalog derivatives`);
  }
});

test('KIBER Batch 1 rendered galleries are balanced and start each gallery with a narrow photo', () => {
  const audit = readJson('docs/review/kiber-batch1-humanoids-research-20260907/gallery-fix-rendered-audit.json');
  assert.equal(audit.allPass, true);
  for (const item of audit.results) {
    assert.ok(Math.abs(item.primaryGalleryCount - item.actionGalleryCount) <= 1, `${item.slug} gallery counts are roughly half/half`);
    assert.equal(item.noOverlap, true, `${item.slug} galleries do not overlap`);
    assert.equal(item.noCatalogHeroInGalleries, true, `${item.slug} has no catalog/Hero image in galleries`);
    assert.equal(item.noLegacyHeroInGalleries, true, `${item.slug} has no legacy hero in galleries`);
    assert.ok(item.primaryFirstAspectRatio <= 1.05 || item.primaryFirstIsNarrowestAvailable, `${item.slug} primary gallery starts with a narrow/vertical photo when available`);
    assert.ok(item.actionFirstAspectRatio <= 1.05 || item.actionFirstIsNarrowestAvailable, `${item.slug} action gallery starts with a narrow/vertical photo when available`);
  }
});

test('KIBER Batch 1 Gosha quotes are unique per robot and not generic fallback', () => {
  const rendered = readJson('docs/review/kiber-batch1-humanoids-research-20260907/gosha-quotes-rendered-audit.json');
  assert.equal(rendered.allPass, true);
  const quotes = rendered.results.map((item: { quote: string }) => item.quote);
  assert.equal(new Set(quotes).size, slugs.length);
  for (const item of rendered.results) {
    assert.equal(item.hasGenericCostumeFutureFallback, false, `${item.slug} does not reuse the generic costume-future fallback`);
    assert.equal(item.hasRobotSpecificName, true, `${item.slug} quote mentions its robot/model`);
  }
});

test('KIBER robot-card generation blocks wrong active data sources', () => {
  const archive = readJson('data/review/kiber-robot-card-wrong-data-sources-archive.json');
  assert.equal(archive.status, 'active_guardrail_do_not_use_as_generation_source');
  const component = readFileSync('src/components/templates/RobotCardTemplate.astro', 'utf8');
  const dataSource = readFileSync('src/lib/kiber94-robot-template-data.ts', 'utf8');
  const schema = readFileSync('src/lib/page-type-templates.ts', 'utf8');

  assert.doesNotMatch(component, /не «человек в костюме», а костюм будущего[\s\S]*robotDisplayName/);
  assert.doesNotMatch(component, /fallbackRobotGoshaQuote/);
  assert.match(component, /text: template\.goshaQuote/);
  assert.match(schema, /robotCardTemplateSchema[\s\S]*goshaQuote: z\.string\(\)\.min\(80\)/);
  assert.match(dataSource, /assertCuratedRobotCardData/);
  assert.match(dataSource, /Missing explicit per-robot Gosha quote/);
  assert.match(dataSource, /Missing explicit source-gallery runtime assets/);
  assert.match(dataSource, /Catalog\/Hero image leaked into curated gallery/);
  assert.match(dataSource, /Legacy Tilda hero\/background leaked into curated gallery/);
});

test('KIBER Batch 1 rendered H1 does not duplicate robot noun wording when preview build is present', () => {
  if (!existsSync('dist/preview/kiber-94/robot-card')) {
    return;
  }
  for (const slug of slugs) {
    const html = readFileSync(`dist/preview/kiber-94/robot-card/${slug}/index.html`, 'utf8');
    const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/s);
    assert.ok(h1Match, `${slug} has rendered H1`);
    const h1 = h1Match[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    assert.doesNotMatch(h1, /робота\s+робота/i, `${slug} H1 must not say “робота робота”`);
  }
});
