import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path: string) => readFileSync(path, 'utf8');
const json = (path: string) => JSON.parse(read(path));

test('media rights package includes the lost horizontal live-site robot hero images', () => {
  assert.equal(existsSync('data/review/media-rights-legacy-hero-images.json'), true, 'legacy hero extraction audit is required');

  const audit = json('data/review/media-rights-legacy-hero-images.json');
  const pack = json('data/review/media-rights-review-package.json');

  assert.equal(audit.issue, 'KIBER-media-rights-legacy-hero-images');
  assert.equal(audit.summary.robots, 24);
  assert.equal(audit.summary.legacyHorizontalHeroImages, 24);
  assert.equal(audit.summary.missingFromPreviousReviewPackage, 24);
  assert.match(audit.rootCause, /media-rights-registry\.json/);
  assert.match(audit.rootCause, /robots\.generated\.json/);

  for (const item of audit.robots) {
    assert.match(item.route, /^\/robots\//);
    assert.match(item.sourceHtml, /^site-export\/page/);
    assert.match(item.legacyHero.src, /^\/images\//);
    assert.match(item.legacyHero.projectPath, /^site-export\/images\//);
    assert.ok(item.legacyHero.width > item.legacyHero.height, `${item.slug}: legacy hero must be horizontal`);
    assert.ok(item.legacyHero.aspectRatio >= 1.4, `${item.slug}: legacy hero aspect ratio must be horizontal`);
    assert.equal(item.legacyHero.rightsStatus, 'needs_rights_review');
    assert.equal(item.legacyHero.productionApproved, false);
    assert.notEqual(item.legacyHero.src, item.currentGeneratedHero.src, `${item.slug}: legacy hero must document the missing original hero, not the square generated hero`);
  }

  assert.equal(pack.summary.legacyHorizontalHeroImages, 24);
  for (const robot of pack.robots) {
    assert.equal(robot.legacyHorizontalHero?.rightsStatus, 'needs_rights_review', `${robot.slug}: legacy hero needs rights review`);
    assert.equal(robot.legacyHorizontalHero?.productionApproved, false, `${robot.slug}: legacy hero must remain human-gated`);
  }
});

test('human review document explains why hero images were missing and shows them separately', () => {
  const doc = read('docs/review/media-rights/review-package.md');
  assert.match(doc, /Отдельные горизонтальные hero-изображения/);
  assert.match(doc, /Почему они потерялись/);
  assert.match(doc, /legacy horizontal hero/);
  assert.match(doc, /site-export\/images/);
});
