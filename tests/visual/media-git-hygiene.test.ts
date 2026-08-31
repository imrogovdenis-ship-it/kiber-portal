import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path: string) => readFileSync(path, 'utf8');
const json = (path: string) => JSON.parse(read(path));

const scriptPath = 'scripts/media-git-hygiene-smoke.mjs';
const reportPath = 'docs/review/kiber-49/media-git-hygiene-report.json';

test('KIBER-49 exposes media Git hygiene as a CI gate', () => {
  assert.equal(existsSync(scriptPath), true, 'media Git hygiene smoke is required');
  const script = read(scriptPath);
  assert.match(script, /runtimePublicImageMaxBytes/);
  assert.match(script, /site-export\/images/);
  assert.match(script, /gitLfsAvailable/);
  assert.match(script, /Git LFS/);

  const pkg = json('package.json');
  assert.equal(pkg.scripts['test:media-git-hygiene'], 'node scripts/media-git-hygiene-smoke.mjs');
  assert.match(pkg.scripts.ci, /npm run test:media-git-hygiene/);
});

test('KIBER-49 prevents new ordinary-Git originals and keeps runtime media optimized', () => {
  assert.equal(existsSync(reportPath), true, 'run npm run test:media-git-hygiene before this source contract');
  const report = json(reportPath);
  assert.equal(report.issue, 'KIBER-49');
  assert.equal(report.status, 'passed_lfs_migrated');
  assert.equal(report.policy.productionDeployChanged, false);
  assert.equal(report.policy.dnsChanged, false);
  assert.equal(report.policy.secretsChanged, false);
  assert.equal(report.policy.liveRoutingChanged, false);
  assert.equal(report.failures.length, 0);
  assert.ok(report.summary.publicRuntimeImages >= 25, 'runtime public images should be counted');
  assert.ok(report.summary.publicRuntimeLargestImageBytes <= report.policy.runtimePublicImageMaxBytes, 'runtime public images must stay below size budget');
  assert.ok(report.summary.trackedReviewOriginals > 0, 'legacy review originals should be explicitly inventoried');
  assert.equal(report.summary.reviewOriginalsNotInLfs, 0, 'review originals must be LFS-tracked for variant A');
  assert.equal(report.summary.lfsTrackedReviewOriginals, report.summary.trackedReviewOriginals);
  assert.deepEqual(report.blockers, []);

  const gitattributes = read('.gitattributes');
  assert.match(gitattributes, /site-export\/images\/\*\* filter=lfs diff=lfs merge=lfs -text/);

  const gitignore = read('.gitignore');
  for (const expected of ['site-export/images/', 'incoming/', 'upload/', '*.zip']) {
    assert.match(gitignore, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});
