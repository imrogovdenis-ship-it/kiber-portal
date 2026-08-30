import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';

const root = resolve(import.meta.dirname, '../..');

async function readJson(path: string) {
  return JSON.parse(await readFile(path, 'utf8'));
}

test('KIBER content package workflow exists and keeps launch content human-gated', async () => {
  const workflowPath = resolve(root, 'data/review/content-package-workflow.json');
  assert.equal(existsSync(workflowPath), true, 'content package workflow contract is required');

  const workflow = await readJson(workflowPath);
  assert.equal(workflow.schemaVersion, 1);
  assert.equal(workflow.issue, 'KIBER-content-package-workflow');
  assert.equal(workflow.policy.productionContacts, 'approved-public-defaults');
  assert.equal(workflow.policy.liveLeadDestinations, 'disabled');
  assert.equal(workflow.policy.productionPublishRequiresHumanApproval, true);
  assert.equal(workflow.policy.analyticsProviderIds, 'disabled');
  assert.ok(workflow.approvalGates.includes('human approves final business/legal/media content package'));

  assert.deepEqual(
    workflow.sources.map((source: { path: string }) => source.path),
    [
      'data/review/content-acceptance.json',
      'data/review/media-rights-registry.json',
      'data/lead/capability-contract.json',
      'data/legal/legal-documents.json',
    ],
  );

  const contentAcceptance = await readJson(resolve(root, 'data/review/content-acceptance.json'));
  assert.equal(workflow.summary.robotPages, contentAcceptance.robots.length);
  assert.equal(workflow.summary.launchPages, contentAcceptance.launchPages.length);
  assert.equal(workflow.summary.finalApproved, 2);
  assert.deepEqual(workflow.summary.approvedSections, ['media-rights', 'public-contacts']);
  assert.equal(workflow.summary.productionBlockedUntilHumanApproval, true);

  for (const item of workflow.packageSections) {
    if (item.id === 'media-rights') {
      assert.equal(item.status, 'approved_by_owner_for_production_media_use', `${item.id}: media section should record owner approval`);
      assert.equal(item.productionApproved, true, `${item.id}: media section should be production-approved after owner approval`);
      assert.equal(item.approvedBy, 'Александр Маркин');
    } else if (item.id === 'public-contacts') {
      assert.equal(item.status, 'approved_by_owner_for_preview_pr', `${item.id}: public contacts should record owner approval`);
      assert.equal(item.productionApproved, true, `${item.id}: public contacts can be published after owner approval`);
      assert.equal(item.approvedBy, 'Александр Маркин');
    } else {
      assert.equal(item.status, 'ready_for_human_review', `${item.id}: section must wait for human review`);
      assert.equal(item.productionApproved, false, `${item.id}: must not claim production approval`);
    }
    assert.ok(item.requiredEvidence.length > 0, `${item.id}: required evidence must be explicit`);
  }
});

test('KIBER content package workflow is enforced by a CI smoke gate', async () => {
  const scriptPath = resolve(root, 'scripts/content-package-workflow-smoke.mjs');
  assert.equal(existsSync(scriptPath), true, 'content package workflow smoke is required');

  const script = await readFile(scriptPath, 'utf8');
  assert.match(script, /content-package-workflow\.json/);
  assert.match(script, /productionPublishRequiresHumanApproval/);
  assert.match(script, /liveLeadDestinations/);

  const packageJson = await readJson(resolve(root, 'package.json'));
  assert.equal(packageJson.scripts['test:content-package-workflow'], 'node scripts/content-package-workflow-smoke.mjs');
  assert.match(packageJson.scripts.ci, /test:content-package-workflow/);
});
