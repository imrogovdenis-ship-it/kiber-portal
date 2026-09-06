import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

type QaRoute = { path: string };
type QaFinding = { id: string; severity: string };
type OwnerDesignApproval = { name: string; key: string; path: string; viewports: string[]; status: string };

type RouteApprovalsRecord = {
  status: string;
  approvedBy: string;
  ownerQuote: string;
  routes: OwnerDesignApproval[];
  notApprovedByThisRecord: string[];
  safety: {
    productionDeployChanged: boolean;
    dnsChanged: boolean;
    secretsChanged: boolean;
    analyticsProviderChanged: boolean;
    liveLeadRoutingChanged: boolean;
  };
};

const routeApprovals = JSON.parse(readFileSync('data/review/pr8-route-visual-approvals.json', 'utf8')) as RouteApprovalsRecord;

const qa = JSON.parse(readFileSync('data/review/full-site-visual-qa.json', 'utf8')) as {
  issue: string;
  scope: { routesChecked: number; viewportsChecked: number; screenshotsCaptured: number; contactSheets: number; routes: QaRoute[] };
  source: { homepageVisualBaseline: string };
  homepagePatternsToReuse: string[];
  approval: { status: string; visualApprovalScope: string; ownerDesignApprovalsRecord: string; productionApprovalGranted: boolean; mergePermissionGranted: boolean };
  ownerDesignApprovals: OwnerDesignApproval[];
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


test('KIBER-91 records owner approval for named PR8 routes across mobile tablet and desktop only', () => {
  assert.equal(qa.approval.status, 'OWNER_DESIGN_APPROVED_FOR_NAMED_ROUTES');
  assert.equal(qa.approval.ownerDesignApprovalsRecord, 'data/review/pr8-route-visual-approvals.json');
  assert.equal(routeApprovals.status, 'owner_design_approved_for_named_routes_and_page_templates');
  assert.equal(routeApprovals.approvedBy, 'Александр Маркин');
  assert.match(routeApprovals.ownerQuote, /главное подборки блок кибергоши и карточка робота/);

  const expected = new Map([
    ['home', '/'],
    ['compilations', '/compilations/'],
    ['articles', '/articles/'],
    ['robot_card', '/preview/kiber-94/robot-card/arenda-unitree-g1/'],
    ['article_template', '/preview/kiber-94/article-blocks/'],
  ]);
  assert.equal(routeApprovals.routes.length, expected.size);
  assert.equal(qa.ownerDesignApprovals.length, 4);

  for (const approval of routeApprovals.routes) {
    assert.ok(['owner_design_approved', 'owner_design_structure_meaning_approved'].includes(approval.status));
    assert.equal(expected.get(approval.key), approval.path);
    assert.deepEqual(approval.viewports, ['mobile', 'tablet', 'desktop']);
  }

  assert.match(readme, /PR8 route-level owner design approvals — 2026-09-04/);
  assert.match(readme, /Блог Кибер Гоши: mobile\/tablet\/desktop approved/);
  assert.equal(routeApprovals.safety.productionDeployChanged, false);
  assert.equal(routeApprovals.safety.dnsChanged, false);
  assert.equal(routeApprovals.safety.secretsChanged, false);
  assert.equal(routeApprovals.safety.analyticsProviderChanged, false);
  assert.equal(routeApprovals.safety.liveLeadRoutingChanged, false);
  assert.ok(routeApprovals.notApprovedByThisRecord.includes('PR merge'));
  assert.equal(qa.approval.productionApprovalGranted, false);
  assert.equal(qa.approval.mergePermissionGranted, false);
});
