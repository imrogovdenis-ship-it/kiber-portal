import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path: string) => readFileSync(path, 'utf8');
const json = (path: string) => JSON.parse(read(path));

test('media rights review package covers all 24 robots and records owner media approval', () => {
  assert.equal(existsSync('data/review/media-rights-review-package.json'), true, 'review package JSON is required');
  assert.equal(existsSync('docs/review/media-rights/review-package.md'), true, 'human review package is required');

  const pack = json('data/review/media-rights-review-package.json');
  assert.equal(pack.issue, 'KIBER-media-rights-review-package');
  assert.equal(pack.policy.productionUseRequiresHumanRightsApproval, true);
  assert.equal(pack.policy.productionApprovedAssets, pack.summary.assetRecordsIncludingLegacyHeroes);
  assert.equal(pack.summary.robots, 24);
  assert.equal(pack.robots.length, 24);
  assert.equal(pack.summary.productionApproved, 24);
  assert.equal(pack.summary.needsRightsReview, 0);
  assert.equal(pack.approval.status, 'approved_by_owner_for_production_media_use');
  assert.equal(pack.approval.approvedBy, 'Александр Маркин');

  for (const robot of pack.robots) {
    assert.match(robot.route, /^\/robots\//);
    assert.equal(robot.status, 'approved_by_owner_for_production_media_use');
    assert.equal(robot.productionApproved, true);
    assert.equal(robot.previewUseAllowed, true);
    assert.ok(robot.assets.length >= 1, `${robot.slug}: assets required`);
    for (const asset of robot.assets) {
      assert.ok(asset.src, `${robot.slug}: src required`);
      assert.ok(asset.alt, `${robot.slug}: alt required`);
      assert.ok(['hero', 'gallery'].includes(asset.role), `${robot.slug}: role required`);
      assert.equal(asset.productionApproved, true);
      assert.equal(asset.rightsStatus, 'approved_for_production');
    }
  }
});

test('media rights review package is documented and enforced by CI', () => {
  const doc = read('docs/review/media-rights/review-package.md');
  assert.match(doc, /# Media rights review package/);
  assert.match(doc, /24 robots/);
  assert.match(doc, /productionApproved = `24 robots \/ 191 assets including legacy heroes`/);
  assert.match(doc, /Owner approval recorded 2026-08-29/);
  assert.match(doc, /Что нужно подтвердить человеку/);

  const pkg = json('package.json');
  assert.equal(pkg.scripts['test:media-rights-review-package'], 'node scripts/media-rights-review-package-smoke.mjs');
  assert.match(pkg.scripts.ci, /npm run test:media-rights-review-package/);
  assert.match(read('scripts/media-rights-review-package-smoke.mjs'), /media-rights-review-package\.json/);
});
