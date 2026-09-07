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
