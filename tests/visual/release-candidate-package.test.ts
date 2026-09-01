import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path: string) => readFileSync(path, 'utf8');
const json = (path: string) => JSON.parse(read(path));

test('KIBER-70 release candidate is immutable and SHA-tagged from main', () => {
  const pack = json('data/review/release-candidate.json');

  assert.equal(pack.issue, 'KIBER-70');
  assert.equal(pack.releaseCandidate.sourceBranch, 'main');
  assert.match(pack.releaseCandidate.sourceCommit, /^[0-9a-f]{40}$/);
  assert.equal(pack.releaseCandidate.sourceCommitShort, pack.releaseCandidate.sourceCommit.slice(0, 7));
  assert.equal(pack.releaseCandidate.image, `alex-kiber-release:sha-${pack.releaseCandidate.sourceCommitShort}`);
  assert.equal(pack.immutability.labels['deployed.commit'], pack.releaseCandidate.sourceCommit);
  assert.equal(pack.immutability.labels['org.opencontainers.image.revision'], pack.releaseCandidate.sourceCommit);
});

test('KIBER-70 approval package preserves production boundaries', () => {
  const pack = json('data/review/release-candidate.json');
  const report = read('docs/review/kiber-70-release-candidate/README.md');

  assert.equal(pack.releaseApproval.status, 'AWAITING_OWNER_GO_NO_GO');
  assert.equal(pack.releaseApproval.productionDeployAllowed, false);
  assert.equal(pack.releaseApproval.dnsChangeAllowed, false);
  assert.equal(pack.releaseApproval.productionSecretsChangeAllowed, false);
  assert.equal(pack.releaseApproval.liveLeadRoutingAllowed, false);
  assert.equal(pack.releaseApproval.analyticsProviderCookiesAllowed, false);
  assert.match(report, /production deploy allowed = `false`/);
  assert(pack.remainingBeforeProduction.some((item: { id: string }) => item.id === 'full-site-visual-qa'));
});

test('KIBER-70 release candidate smoke gate is wired into CI', () => {
  const pkg = json('package.json');

  assert.equal(pkg.scripts['test:release-candidate'], 'node scripts/release-candidate-smoke.mjs');
  assert.match(pkg.scripts.ci, /npm run test:release-candidate/);
  assert.match(read('scripts/release-candidate-smoke.mjs'), /AWAITING_OWNER_GO_NO_GO/);
});
