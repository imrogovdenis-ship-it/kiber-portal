import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path: string) => readFileSync(path, 'utf8');
const json = (path: string) => JSON.parse(read(path));

const cardsPath = 'data/review/media-rights-robot-cards.json';
const indexPath = 'docs/review/media-rights/robot-cards/README.md';

test('media rights robot cards record Alexander approval for all full robot cards', () => {
  assert.equal(existsSync(cardsPath), true, `${cardsPath} must exist`);
  const data = json(cardsPath);

  assert.equal(data.summary.robots, 24);
  assert.equal(data.summary.legacyHorizontalHeroImages, 24);
  assert.equal(data.policy.productionApprovedAssets, data.summary.assetRecordsIncludingLegacyAndGeneratedHeroes);
  assert.equal(data.policy.productionUseRequiresHumanRightsApproval, true);
  assert.equal(data.approval?.status, 'approved_by_owner_for_production_media_use');
  assert.equal(data.approval?.approvedRobots, 24);
  assert.match(data.approval?.evidence || '', /первые пять карточек/);

  for (const card of data.robots) {
    assert.match(card.slug, /^arenda-/);
    assert.match(card.route, /^\/robots\//);
    assert.equal(card.productionApproved, true);
    assert.equal(card.status, 'approved_by_owner_for_production_media_use');
    assert.equal(card.approval?.status, 'approved_by_owner_for_production_media_use');

    assert.equal(card.assets[0].role, 'legacy_horizontal_hero');
    assert.match(card.assets[0].src, /^\/images\//);
    assert.match(card.assets[0].projectPath, /^site-export\/images\//);

    assert(card.assets.some((asset: any) => asset.role === 'current_generated_hero'));
    assert(card.assets.some((asset: any) => asset.role === 'catalog_card'));
    assert(card.assets.some((asset: any) => asset.sourceGalleryBlock === 'upper_near_hero'));
    assert(card.assets.some((asset: any) => asset.sourceGalleryBlock === 'lower_near_photo_section'));
    assert.equal(card.assets.filter((asset: any) => asset.sourceGalleryBlock === 'upper_near_hero').length, card.sourceGalleryBlocks.upperNearHero.meaningfulCount);
    assert.equal(card.assets.filter((asset: any) => asset.sourceGalleryBlock === 'lower_near_photo_section').length, card.sourceGalleryBlocks.lowerNearPhotoSection.meaningfulCount);
    assert.equal(card.assets.filter((asset: any) => asset.sourceLayer === 'robots.source-of-truth.meaningfulImage').length, card.sourceOfTruthMeaningfulImageCount);

    for (const asset of card.assets) {
      assert.equal(asset.rightsStatus, 'approved_for_production');
      assert.equal(asset.productionApproved, true);
      assert.equal(typeof asset.actualDescription, 'string');
      assert(asset.actualDescription.length > 20, `${card.slug} ${asset.src} must have actualDescription`);
      assert.equal(typeof asset.seoAlt, 'string');
      assert(asset.seoAlt.length > 20, `${card.slug} ${asset.src} must have seoAlt`);
      assert.equal(typeof asset.caption, 'string');
      assert(asset.caption.length > 10, `${card.slug} ${asset.src} must have caption`);
      assert.match(asset.textSource, /robots\.source-of-truth|legacy-hero-generated/);
    }
  }
});

test('human review documents provide one approved card per robot with image links and approval evidence', () => {
  assert.equal(existsSync(indexPath), true, `${indexPath} must exist`);
  const index = read(indexPath);
  assert.match(index, /24 robot media review cards/);
  assert.match(index, /legacy horizontal hero/);
  assert.match(index, /actualDescription/);
  assert.match(index, /seoAlt/);

  const data = json(cardsPath);
  for (const card of data.robots) {
    const path = `docs/review/media-rights/robot-cards/${card.slug}.md`;
    assert.equal(existsSync(path), true, `${path} must exist`);
    const doc = read(path);
    assert.match(doc, new RegExp(`# ${card.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
    assert.match(doc, /## Legacy horizontal hero/);
    assert.match(doc, /## Current generated hero/);
    assert.match(doc, /## Catalog card/);
    assert.match(doc, /## Upper gallery block/);
    assert.match(doc, /## Lower gallery block/);
    assert.match(doc, /## Why earlier visual cards showed too few gallery images/);
    assert.match(doc, /\[x\] approve for production/);
    assert.match(doc, /Approved by: Александр Маркин/);
    assert.match(doc, /2026-08-29T00:55:09Z/);
  }
});
