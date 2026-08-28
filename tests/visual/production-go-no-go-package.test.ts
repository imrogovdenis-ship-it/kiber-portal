import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const read = (path: string) => readFileSync(path, 'utf8');
const json = (path: string) => JSON.parse(read(path));

test('production go/no-go package records exact launch map and stays NO-GO', () => {
  const pack = json('data/review/production-go-no-go.json');

  assert.equal(pack.issue, 'KIBER-production-go-no-go');
  assert.equal(pack.productionDecision.status, 'NO_GO');
  assert.equal(pack.productionDecision.productionDeployAllowed, false);
  assert.equal(pack.productionDecision.dnsChangeAllowed, false);
  assert.equal(pack.productionDecision.secretsChangeAllowed, false);
  assert.equal(pack.currentBase.branch, 'codex/kiber-15-controlled-rebuild');
  assert.equal(pack.currentBase.head, '2169024');
  assert.equal(pack.readiness.routesChecked, 36);
  assert.equal(pack.readiness.robotRoutesChecked, 24);
  assert.deepEqual(pack.readiness.legalRoutesPresent, ['/privacy-policy/', '/consent/', '/cookie-policy/']);
});

test('production go/no-go package lists concrete blockers and required owner decisions', () => {
  const pack = json('data/review/production-go-no-go.json');

  assert(pack.blockers.some((b: { id: string }) => b.id === 'real-public-contacts'));
  assert(pack.blockers.some((b: { id: string }) => b.id === 'live-lead-routing'));
  assert(pack.blockers.some((b: { id: string }) => b.id === 'media-rights-production-approval'));
  assert(pack.blockers.some((b: { id: string }) => b.id === 'analytics-provider-ids'));
  assert(pack.blockers.some((b: { id: string }) => b.id === 'explicit-production-permission'));
  assert(pack.ownerDecisionChecklist.length >= 6);
  assert(pack.openPullRequests.some((pr: { number: number }) => pr.number === 43));
  assert(pack.openPullRequests.some((pr: { number: number }) => pr.number === 44));
  assert(pack.openPullRequests.some((pr: { number: number }) => pr.number === 45));
});

test('production go/no-go report and smoke gate are wired into CI', () => {
  const pkg = json('package.json');
  const report = read('docs/review/production-go-no-go/README.md');

  assert.equal(pkg.scripts['test:production-go-no-go'], 'node scripts/production-go-no-go-smoke.mjs');
  assert.match(pkg.scripts.ci, /npm run test:production-go-no-go/);
  assert.match(read('scripts/production-go-no-go-smoke.mjs'), /NO_GO/);
  assert.match(report, /## Решение: NO-GO/);
  assert.match(report, /2169024/);
});
