import assert from 'node:assert/strict';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const readText = (path) => readFileSync(path, 'utf8');

const pack = readJson('data/review/production-go-no-go.json');
const readiness = readJson('docs/review/launch-readiness-crawl/report.json');
const lead = readJson('data/lead/capability-contract.json');
const media = readJson('data/review/media-rights-registry.json');
const workflow = readJson('data/review/content-package-workflow.json');
const report = readText('docs/review/production-go-no-go/README.md');

assert.equal(pack.productionDecision.status, 'NO_GO');
assert.equal(pack.productionDecision.productionDeployAllowed, false);
assert.equal(pack.productionDecision.dnsChangeAllowed, false);
assert.equal(pack.productionDecision.secretsChangeAllowed, false);
assert.equal(pack.productionDecision.liveLeadRoutingAllowed, false);
assert.equal(pack.productionDecision.analyticsProviderCookiesAllowed, false);

assert.equal(pack.readiness.routesChecked, readiness.routesChecked);
assert.equal(pack.readiness.robotRoutesChecked, readiness.robotRoutesChecked);
assert.equal(pack.readiness.leadRoutingEnabled, readiness.leadRoutingEnabled);
assert.equal(pack.readiness.leadDestinations, readiness.leadDestinations);
assert.equal(pack.readiness.mediaProductionApproved, readiness.mediaProductionApproved);
assert.deepEqual(pack.readiness.legalRoutesPresent, readiness.legalRoutesPresent);

assert.equal(lead.routing.enabled, false);
assert.equal(lead.routing.destinations.length, 0);
assert.equal(media.summary.robots, 24);
assert.equal(media.summary.productionApproved, 24);
assert.equal(workflow.policy.productionPublishRequiresHumanApproval, true);
assert.equal(workflow.policy.noProductionDeployDnsSecretsOrCookies, true);

for (const required of [
  'real-public-contacts',
  'live-lead-routing',
  'analytics-provider-ids',
  'business-legal-launch-confirmation',
  'explicit-production-permission',
]) {
  assert(pack.blockers.some((blocker) => blocker.id === required), `missing blocker: ${required}`);
}
assert(!pack.blockers.some((blocker) => blocker.id === 'media-rights-production-approval'), 'media rights blocker should be resolved after owner approval');

assert.match(report, /## Решение: NO-GO/);
assert.match(report, /production deploy permission = `false`/);
assert.match(report, /Media approval resolved 2026-08-29/);

mkdirSync('docs/review/production-go-no-go', { recursive: true });
const smoke = {
  issue: pack.issue,
  status: 'passed_with_no_go_blockers',
  decision: pack.productionDecision.status,
  branch: pack.currentBase.branch,
  head: pack.currentBase.head,
  blockers: pack.blockers.length,
  routesChecked: pack.readiness.routesChecked,
  robotRoutesChecked: pack.readiness.robotRoutesChecked,
  openPullRequests: pack.openPullRequests.map((pr) => pr.number),
  generatedAt: new Date().toISOString(),
};
writeFileSync('docs/review/production-go-no-go/report.json', JSON.stringify(smoke, null, 2) + '\n');
assert(existsSync('docs/review/production-go-no-go/report.json'));
console.log(`KIBER production go/no-go smoke passed: ${smoke.decision}; ${smoke.routesChecked} routes, ${smoke.robotRoutesChecked} robots, ${smoke.blockers} blockers.`);
