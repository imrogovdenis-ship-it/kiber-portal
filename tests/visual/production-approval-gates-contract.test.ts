import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const root = process.cwd();
const gatesPath = resolve(root, 'data/review/production-approval-gates.json');
const smokePath = resolve(root, 'scripts/production-approval-gates-smoke.mjs');

function readJson(path: string) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

test('KIBER production approval gates registry exists and preserves owner-approved boundaries', () => {
  assert.equal(existsSync(gatesPath), true, 'production approval gates registry is required');

  const gates = readJson(gatesPath);
  assert.equal(gates.schemaVersion, 1);
  assert.equal(gates.issue, 'KIBER-production-approval-gates');
  assert.equal(gates.policy.productionPermissionIncluded, false);
  assert.equal(gates.policy.productionContacts, 'placeholder-only');
  assert.equal(gates.policy.liveLeadDestinations, 'disabled');
  assert.equal(gates.policy.analyticsProviderIds, 'disabled');
  assert.equal(gates.policy.noDeployDnsSecretsCookiesOrRouting, true);

  const gateIds = new Set(gates.gates.map((gate: { id: string }) => gate.id));
  assert.deepEqual(gateIds, new Set([
    'visual_direction',
    'business_legal_content',
    'media_rights',
    'public_contacts',
    'lead_routing',
    'analytics_provider',
    'production_deploy',
  ]));

  for (const gate of gates.gates) {
    assert.equal(gate.requiresExplicitHumanApproval, true, `${gate.id}: human approval must be explicit`);
    if (gate.id === 'media_rights') {
      assert.equal(gate.productionApproved, true, `${gate.id}: owner media approval should be recorded`);
      assert.match(gate.status, /approved_by_owner/);
      assert.equal(gate.approvedBy, 'Александр Маркин');
    } else {
      assert.equal(gate.productionApproved, false, `${gate.id}: registry must not claim unrelated production approval`);
      assert.match(gate.status, /blocked|pending|in_review|capability_only|placeholder_only|disabled/);
    }
    assert.ok(Array.isArray(gate.evidence) && gate.evidence.length > 0, `${gate.id}: evidence paths required`);
    if (gate.id !== 'media_rights') {
      assert.ok(Array.isArray(gate.forbiddenActionsUntilApproved) && gate.forbiddenActionsUntilApproved.length > 0, `${gate.id}: forbidden actions required`);
    }
  }

  assert.ok(gates.gates.find((gate: { id: string; allowedAutonomousWork: string[] }) => gate.id === 'lead_routing')?.allowedAutonomousWork.includes('Maintain destination-free capability contracts'));
  assert.ok(gates.gates.find((gate: { id: string; forbiddenActionsUntilApproved: string[] }) => gate.id === 'production_deploy')?.forbiddenActionsUntilApproved.includes('Deploy production'));
});

test('KIBER production approval gates are enforced by a CI smoke gate', () => {
  assert.equal(existsSync(smokePath), true, 'production approval gates smoke is required');
  const smoke = readFileSync(smokePath, 'utf8');
  assert.match(smoke, /production-approval-gates\.json/);
  assert.match(smoke, /noDeployDnsSecretsCookiesOrRouting/);
  assert.match(smoke, /requiresExplicitHumanApproval/);

  const pkg = readJson(resolve(root, 'package.json'));
  assert.equal(pkg.scripts['test:production-approval-gates'], 'node scripts/production-approval-gates-smoke.mjs');
  assert.match(pkg.scripts.ci, /npm run test:production-approval-gates/);
});
