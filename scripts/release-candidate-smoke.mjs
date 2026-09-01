import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const pack = JSON.parse(readFileSync('data/review/release-candidate.json', 'utf8'));
const report = readFileSync('docs/review/kiber-70-release-candidate/README.md', 'utf8');
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));

assert.equal(pack.issue, 'KIBER-70');
assert.equal(pack.releaseCandidate.sourceBranch, 'main');
assert.match(pack.releaseCandidate.sourceCommit, /^[0-9a-f]{40}$/);
assert.equal(pack.releaseCandidate.sourceCommitShort, pack.releaseCandidate.sourceCommit.slice(0, 7));
assert.equal(pack.releaseCandidate.image, `alex-kiber-release:sha-${pack.releaseCandidate.sourceCommitShort}`);
assert.equal(pack.releaseCandidate.imageVersion, `sha-${pack.releaseCandidate.sourceCommitShort}`);
assert.equal(pack.releaseCandidate.deployEnv, 'production');
assert.equal(pack.releaseCandidate.designReviewEnabled, false);
assert.equal(pack.releaseCandidate.analyticsProvider, 'disabled');

assert.equal(pack.immutability.labels['deployed.commit'], pack.releaseCandidate.sourceCommit);
assert.equal(pack.immutability.labels['org.opencontainers.image.revision'], pack.releaseCandidate.sourceCommit);
assert.equal(pack.immutability.labels['deployed.version'], pack.releaseCandidate.imageVersion);
assert.equal(pack.immutability.labels['org.opencontainers.image.version'], pack.releaseCandidate.imageVersion);
assert.match(pack.immutability.dirtyTreeGuard, /refused dirty trees/i);

assert.equal(pack.releaseApproval.status, 'AWAITING_OWNER_GO_NO_GO');
assert.equal(pack.releaseApproval.productionDeployAllowed, false);
assert.equal(pack.releaseApproval.dnsChangeAllowed, false);
assert.equal(pack.releaseApproval.productionSecretsChangeAllowed, false);
assert.equal(pack.releaseApproval.liveLeadRoutingAllowed, false);
assert.equal(pack.releaseApproval.analyticsProviderCookiesAllowed, false);
assert(pack.remainingBeforeProduction.some((item) => item.id === 'full-site-visual-qa'));
assert(pack.remainingBeforeProduction.some((item) => item.id === 'KIBER-72'));

assert.match(report, /## Решение: AWAITING OWNER GO\/NO-GO/);
assert.match(report, /production deploy allowed = `false`/);
assert.match(report, /Full-site visual QA/);
assert.equal(pkg.scripts['test:release-candidate'], 'node scripts/release-candidate-smoke.mjs');
assert.match(pkg.scripts.ci, /npm run test:release-candidate/);

mkdirSync('docs/review/kiber-70-release-candidate', { recursive: true });
writeFileSync('docs/review/kiber-70-release-candidate/report.json', JSON.stringify({
  issue: pack.issue,
  status: 'passed_awaiting_owner_go_no_go',
  sourceCommit: pack.releaseCandidate.sourceCommit,
  image: pack.releaseCandidate.image,
  productionDeployAllowed: pack.releaseApproval.productionDeployAllowed,
  dnsChangeAllowed: pack.releaseApproval.dnsChangeAllowed,
  generatedAt: new Date().toISOString(),
}, null, 2) + '\n');
console.log(`KIBER-70 release candidate smoke passed for ${pack.releaseCandidate.image}; awaiting owner GO/NO-GO.`);
