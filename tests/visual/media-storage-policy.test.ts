import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';

const root = resolve(import.meta.dirname, '../..');

async function readJson(path: string) {
  return JSON.parse(await readFile(path, 'utf8'));
}

test('KIBER-12 defines media storage policy and disk reserve evidence', async () => {
  const policyPath = resolve(root, 'data/review/media-storage-policy.json');
  assert.equal(existsSync(policyPath), true, 'KIBER-12 media storage policy registry is required');

  const policy = await readJson(policyPath);
  assert.equal(policy.schemaVersion, 1);
  assert.equal(policy.issue, 'KIBER-12');
  assert.equal(policy.status, 'closed_by_lfs_policy_and_disk_evidence');
  assert.equal(policy.ownerDecision.selectedPolicy, 'git_lfs_for_review_originals');
  assert.equal(policy.ownerDecision.productionDeployApproval, false);

  assert.ok(policy.diskReserve.availableGiB >= policy.diskReserve.minimumRequiredAvailableGiB);
  assert.equal(policy.diskReserve.cleanupPerformed, false);
  assert.match(policy.diskReserve.cleanupBoundary, /shared server cleanup/i);

  assert.equal(policy.policy.runtimePublicMedia.root, 'public/images/');
  assert.deepEqual(policy.policy.runtimePublicMedia.allowedFormats, ['webp', 'avif', 'svg']);
  assert.equal(policy.policy.runtimePublicMedia.maxBytesPerRasterImage, 200 * 1024);
  assert.equal(policy.policy.reviewOriginals.root, 'site-export/images/');
  assert.equal(policy.policy.reviewOriginals.storage, 'git_lfs');
  assert.match(policy.policy.reviewOriginals.trackingRule, /filter=lfs/);
  assert.equal(policy.policy.incomingDrops.ordinaryGitPolicy, 'ignored_until_explicitly_migrated');
  assert.deepEqual(policy.policy.dockerContext.excludedRoots, ['site-export', 'incoming', 'artifacts']);

  assert.equal(policy.currentEvidence.trackedReviewOriginals, 510);
  assert.equal(policy.currentEvidence.gitLfsTrackedReviewOriginals, 510);
  assert.equal(policy.currentEvidence.reviewOriginalsNotInLfs, 0);
  assert.equal(policy.safety.productionDeployChanged, false);
  assert.equal(policy.safety.sharedDockerCleanupPerformed, false);
});

test('KIBER-12 media storage policy smoke is wired into CI', async () => {
  const scriptPath = resolve(root, 'scripts/media-storage-policy-smoke.mjs');
  assert.equal(existsSync(scriptPath), true, 'KIBER-12 media storage smoke is required');

  const script = await readFile(scriptPath, 'utf8');
  assert.match(script, /media-storage-policy\.json/);
  assert.match(script, /site-export\/images\/\*\*/);
  assert.match(script, /reviewOriginalsNotInLfs/);
  assert.match(script, /shared Docker cleanup/i);

  const packageJson = await readJson(resolve(root, 'package.json'));
  assert.equal(packageJson.scripts['test:media-storage-policy'], 'node scripts/media-storage-policy-smoke.mjs');
  assert.match(packageJson.scripts.ci, /test:media-storage-policy/);
});
