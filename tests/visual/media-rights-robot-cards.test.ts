import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path: string) => readFileSync(path, 'utf8');
const json = (path: string) => JSON.parse(read(path));

const cardsPath = 'data/review/media-rights-robot-cards.json';
const indexPath = 'docs/review/media-rights/robot-cards/README.md';

test('media rights robot cards merge legacy hero, generated hero, gallery and rich media text layers', () => {
  assert.equal(existsSync(cardsPath), true, `${cardsPath} must exist`);
  const data = json(cardsPath);

  assert.equal(data.summary.robots, 24);
  assert.equal(data.summary.legacyHorizontalHeroImages, 24);
  assert.equal(data.policy.productionApprovedAssets, 0);
  assert.equal(data.policy.productionUseRequiresHumanRightsApproval, true);

  for (const card of data.robots) {
    assert.match(card.slug, /^arenda-/);
    assert.match(card.route, /^\/robots\//);
    assert.equal(card.productionApproved, false);
    assert.equal(card.status, 'needs_rights_review');

    assert.equal(card.assets[0].role, 'legacy_horizontal_hero');
    assert.match(card.assets[0].src, /^\/images\//);
    assert.match(card.assets[0].projectPath, /^site-export\/images\//);

    assert(card.assets.some((asset: any) => asset.role === 'current_generated_hero'));
    assert(card.assets.some((asset: any) => asset.role === 'gallery'));

    for (const asset of card.assets) {
      assert.equal(asset.rightsStatus, 'needs_rights_review');
      assert.equal(asset.productionApproved, false);
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

test('human review documents provide one card per robot with image links and approval slots', () => {
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
    assert.match(doc, /## Gallery/);
    assert.match(doc, /\[ \] approve for production/);
    assert.match(doc, /\[ \] replace before production/);
    assert.match(doc, /\[ \] block for production/);
  }
});
