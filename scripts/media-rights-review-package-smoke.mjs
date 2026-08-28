import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const pack = readJson('data/review/media-rights-review-package.json');
const registry = readJson('data/review/media-rights-registry.json');
const doc = readFileSync('docs/review/media-rights/review-package.md', 'utf8');
const legacy = readJson('data/review/media-rights-legacy-hero-images.json');

assert.equal(pack.issue, 'KIBER-media-rights-review-package');
assert.equal(pack.policy.productionUseRequiresHumanRightsApproval, true);
assert.equal(pack.policy.productionApprovedAssets, 0);
assert.equal(pack.policy.productionDeployAllowed, false);
assert.equal(pack.summary.robots, 24);
assert.equal(pack.robots.length, registry.robots.length);
assert.equal(pack.summary.productionApproved, 0);
assert.equal(pack.summary.needsRightsReview, 24);
assert.equal(legacy.summary.legacyHorizontalHeroImages, 24);
assert.equal(pack.summary.legacyHorizontalHeroImages, 24);
assert.equal(pack.summary.assetRecordsIncludingLegacyHeroes, pack.summary.assetRecords + 24);
assert.match(doc, /# Media rights review package/);
assert.match(doc, /Что нужно подтвердить человеку/);
assert.match(doc, /Отдельные горизонтальные hero-изображения/);
assert.match(doc, /Почему они потерялись/);

let assetRecords = 0;
for (const robot of pack.robots) {
  assert.equal(robot.status, 'needs_rights_review');
  assert.equal(robot.productionApproved, false);
  assert.equal(robot.previewUseAllowed, true);
  assert(robot.assets.length >= 1, `${robot.slug}: assets required`);
  assert.equal(robot.legacyHorizontalHero?.rightsStatus, 'needs_rights_review', `${robot.slug}: legacy hero rights status required`);
  assert.equal(robot.legacyHorizontalHero?.productionApproved, false, `${robot.slug}: legacy hero must remain human-gated`);
  assetRecords += robot.assets.length;
  for (const asset of robot.assets) {
    assert(asset.src, `${robot.slug}: src required`);
    assert(asset.alt, `${robot.slug}: alt required`);
    assert.equal(asset.rightsStatus, 'needs_rights_review');
    assert.equal(asset.productionApproved, false);
  }
}
assert.equal(pack.summary.assetRecords, assetRecords);

const report = {
  issue: pack.issue,
  status: 'passed_human_review_required',
  robots: pack.summary.robots,
  assetRecords,
  legacyHorizontalHeroImages: legacy.summary.legacyHorizontalHeroImages,
  assetRecordsIncludingLegacyHeroes: pack.summary.assetRecordsIncludingLegacyHeroes,
  productionApproved: pack.summary.productionApproved,
  needsRightsReview: pack.summary.needsRightsReview,
  productionDeployAllowed: pack.policy.productionDeployAllowed,
  generatedAt: new Date().toISOString(),
};
mkdirSync('docs/review/media-rights', { recursive: true });
writeFileSync('docs/review/media-rights/review-package-report.json', `${JSON.stringify(report, null, 2)}
`);
console.log(`KIBER media rights review package smoke passed: ${report.robots} robots, ${report.assetRecordsIncludingLegacyHeroes} assets including legacy heroes, productionApproved=${report.productionApproved}.`);
