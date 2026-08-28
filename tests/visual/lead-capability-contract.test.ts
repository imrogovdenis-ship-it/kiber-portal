import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';

const root = resolve(import.meta.dirname, '../..');

test('KIBER lead capability contract keeps routing disabled and destination-free', async () => {
  const contractPath = resolve(root, 'data/lead/capability-contract.json');
  assert.equal(existsSync(contractPath), true, 'lead capability contract is required');

  const contract = JSON.parse(await readFile(contractPath, 'utf8'));
  assert.equal(contract.schemaVersion, 1);
  assert.equal(contract.routing.mode, 'capability-only');
  assert.equal(contract.routing.enabled, false);
  assert.deepEqual(contract.routing.destinations, []);
  assert.equal(contract.constraints.productionContacts, 'placeholder-only');
  assert.equal(contract.constraints.liveLeadRouting, 'disabled-until-owner-approval');
  assert.equal(contract.constraints.analyticsProviderIds, 'disabled');
  assert.ok(contract.approvalGates.includes('owner approves live lead destinations'));
});

test('KIBER lead capability contract is enforced by a CI smoke gate', async () => {
  const scriptPath = resolve(root, 'scripts/lead-capability-contract-smoke.mjs');
  assert.equal(existsSync(scriptPath), true, 'lead capability contract smoke is required');

  const script = await readFile(scriptPath, 'utf8');
  assert.match(script, /capability-contract\.json/);
  assert.match(script, /liveLeadRouting/);
  assert.match(script, /destinations/);

  const packageJson = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
  assert.equal(packageJson.scripts['test:lead-capability'], 'node scripts/lead-capability-contract-smoke.mjs');
  assert.match(packageJson.scripts.ci, /test:lead-capability/);
});
