import assert from 'node:assert/strict';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const root = process.cwd();
const gatesPath = resolve(root, 'data/review/production-approval-gates.json');
const ownerDecisionsPath = resolve(root, 'data/review/owner-decisions-2026-08-28.json');
const launchReadinessPath = resolve(root, 'data/review/launch-readiness-crawl.json');
const contentPackagePath = resolve(root, 'data/review/content-package-workflow.json');
const readinessMatrixPath = resolve(root, 'data/seo/production-readiness-matrix.json');
const reportPath = resolve(root, 'docs/review/production-approval-gates/report.json');

function readJson(path) { return JSON.parse(readFileSync(path, 'utf8')); }

for (const path of [gatesPath, ownerDecisionsPath, launchReadinessPath, contentPackagePath, readinessMatrixPath]) {
  assert.equal(existsSync(path), true, `${path.replace(`${root}/`, '')} missing`);
}

const gates = readJson(gatesPath);
const ownerDecisions = readJson(ownerDecisionsPath);
const launchReadiness = readJson(launchReadinessPath);
const contentPackage = readJson(contentPackagePath);
const readinessMatrix = readJson(readinessMatrixPath);
const failures = [];
const warnings = [];

if (gates.schemaVersion !== 1) failures.push('schemaVersion must be 1');
if (gates.policy?.productionPermissionIncluded !== false) failures.push('production permission must not be included');
if (gates.policy?.productionContacts !== 'placeholder-only') failures.push('contacts must stay placeholder-only');
if (gates.policy?.liveLeadDestinations !== 'disabled') failures.push('live lead destinations must stay disabled');
if (gates.policy?.analyticsProviderIds !== 'disabled') failures.push('analytics provider IDs must stay disabled');
if (gates.policy?.noDeployDnsSecretsCookiesOrRouting !== true) failures.push('deploy/DNS/secrets/cookies/routing guard must stay true');

if (ownerDecisions.productionPermissionIncluded !== false) failures.push('owner decisions must not include production permission');
if (ownerDecisions.decisions?.contacts?.publicRealContactsApproved !== false) failures.push('owner decisions must keep real contacts unapproved');
if (ownerDecisions.decisions?.leadChannels?.publicChannelsApproved !== false) failures.push('owner decisions must keep public lead channels unapproved');
if (contentPackage.policy?.productionPublishRequiresHumanApproval !== true) failures.push('content package must require human production approval');
if (launchReadiness.productionPermission !== false) failures.push('launch readiness must not grant production permission');
if (readinessMatrix.productionActionAllowed !== false) failures.push('production readiness matrix must not allow production actions');

const requiredGateIds = [
  'visual_direction',
  'business_legal_content',
  'media_rights',
  'public_contacts',
  'lead_routing',
  'analytics_provider',
  'production_deploy',
];
const actualGateIds = new Set((gates.gates || []).map((gate) => gate.id));
for (const gateId of requiredGateIds) {
  if (!actualGateIds.has(gateId)) failures.push(`missing gate ${gateId}`);
}

for (const gate of gates.gates || []) {
  const label = gate.id || gate.title || 'unknown-gate';
  if (gate.requiresExplicitHumanApproval !== true) failures.push(`${label}: requiresExplicitHumanApproval must be true`);
  if (gate.id === 'media_rights') {
    if (gate.productionApproved !== true) failures.push(`${label}: media rights should be approved after owner review`);
    if (!gate.approvedAt) failures.push(`${label}: media approval timestamp required`);
  } else if (gate.productionApproved !== false) failures.push(`${label}: productionApproved must remain false unless explicitly approved`);
  if (!Array.isArray(gate.evidence) || gate.evidence.length === 0) failures.push(`${label}: evidence is required`);
  if (gate.id !== 'media_rights' && (!Array.isArray(gate.forbiddenActionsUntilApproved) || gate.forbiddenActionsUntilApproved.length === 0)) failures.push(`${label}: forbidden actions are required`);
  if (!Array.isArray(gate.allowedAutonomousWork) || gate.allowedAutonomousWork.length === 0) warnings.push(`${label}: allowed autonomous work is empty`);
}

const deployGate = (gates.gates || []).find((gate) => gate.id === 'production_deploy');
for (const forbidden of ['Deploy production', 'Change DNS', 'Touch production secrets']) {
  if (!deployGate?.forbiddenActionsUntilApproved?.includes(forbidden)) failures.push(`production_deploy must forbid: ${forbidden}`);
}

const leadGate = (gates.gates || []).find((gate) => gate.id === 'lead_routing');
if (!leadGate?.allowedAutonomousWork?.includes('Maintain destination-free capability contracts')) failures.push('lead_routing must allow only destination-free contract work');
if (!leadGate?.forbiddenActionsUntilApproved?.some((action) => action.includes('CRM'))) failures.push('lead_routing must forbid CRM/live routing activation');

const report = {
  issue: gates.issue,
  generatedAt: new Date().toISOString(),
  gateCount: gates.gates?.length || 0,
  productionPermissionIncluded: gates.policy?.productionPermissionIncluded === true,
  productionActionAllowed: readinessMatrix.productionActionAllowed === true,
  ownerRealContactsApproved: ownerDecisions.decisions?.contacts?.publicRealContactsApproved === true,
  liveLeadDestinations: gates.policy?.liveLeadDestinations,
  analyticsProviderIds: gates.policy?.analyticsProviderIds,
  status: failures.length ? 'failed' : 'passed',
  failures,
  warnings: warnings.slice(0, 40),
};
mkdirSync(dirname(reportPath), { recursive: true });
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

if (failures.length) {
  console.error(`KIBER production approval gates smoke failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log(`KIBER production approval gates smoke passed: media rights approved; remaining production gates stay explicitly human-gated.`);
