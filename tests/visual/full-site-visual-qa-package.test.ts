import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

type QaRoute = { path: string };
type QaFinding = { id: string; severity: string };

const qa = JSON.parse(readFileSync('data/review/full-site-visual-qa.json', 'utf8')) as {
  issue: string;
  scope: { routesChecked: number; viewportsChecked: number; screenshotsCaptured: number; contactSheets: number; routes: QaRoute[] };
  source: { homepageVisualBaseline: string };
  homepagePatternsToReuse: string[];
  approval: { productionApprovalGranted: boolean };
  technicalChecks: {
    productionDeployChanged: boolean;
    dnsChanged: boolean;
    productionSecretsChanged: boolean;
    liveLeadRoutingChanged: boolean;
    analyticsProviderChanged: boolean;
  };
  visualFindings: QaFinding[];
};
const readme = readFileSync('docs/review/kiber-91-full-site-visual-qa/README.md', 'utf8');

test('KIBER-91 full-site visual QA covers launch routes and viewports', () => {
  assert.equal(qa.issue, 'KIBER-91');
  assert.equal(qa.scope.routesChecked, 15);
  assert.equal(qa.scope.viewportsChecked, 3);
  assert.equal(qa.scope.screenshotsCaptured, 45);
  assert.equal(qa.scope.contactSheets, 3);
  assert.ok(qa.scope.routes.some((route) => route.path === '/compilations/'));
  assert.ok(qa.scope.routes.some((route) => route.path === '/articles/'));
  assert.ok(qa.scope.routes.some((route) => route.path === '/news/'));
  assert.ok(qa.scope.routes.some((route) => route.path === '/404.html'));
});

test('KIBER-91 uses approved homepage design patterns as QA baseline', () => {
  assert.ok(qa.source.homepageVisualBaseline.includes('Главная утверждена'));
  assert.ok(qa.homepagePatternsToReuse.some((item) => item.includes('карточ')));
  assert.ok(qa.homepagePatternsToReuse.some((item) => item.includes('CTA')));
  assert.ok(qa.homepagePatternsToReuse.some((item) => item.includes('mobile/tablet')));
  assert.match(readme, /Baseline from approved homepage/);
  assert.match(readme, /RobotPage hero mobile\/tablet remains 1:1/);
});

test('KIBER-91 records design findings without granting production approval', () => {
  assert.equal(qa.approval.productionApprovalGranted, false);
  assert.equal(qa.technicalChecks.productionDeployChanged, false);
  assert.equal(qa.technicalChecks.dnsChanged, false);
  assert.equal(qa.technicalChecks.productionSecretsChanged, false);
  assert.equal(qa.technicalChecks.liveLeadRoutingChanged, false);
  assert.equal(qa.technicalChecks.analyticsProviderChanged, false);
  assert.ok(qa.visualFindings.some((finding) => finding.id === 'FSVQA-01' && finding.severity === 'high'));
  assert.match(readme, /NO-GO for production/);
});
