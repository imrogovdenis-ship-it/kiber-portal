import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';

const root = process.cwd();

test('KIBER-79 defines review-only deterministic internal link proposals', async () => {
  const registryPath = resolve(root, 'data/seo/internal-link-proposals.json');
  assert.equal(existsSync(registryPath), true, 'internal link proposals registry is required');

  const registry = JSON.parse(await readFile(registryPath, 'utf8'));
  assert.equal(registry.schemaVersion, 1);
  assert.equal(registry.issue, 'KIBER-79');
  assert.equal(registry.autoPublish, false);
  assert.deepEqual(registry.allowedStatuses, ['generated_needs_review', 'approved', 'rejected', 'disabled']);
  assert.ok(Array.isArray(registry.proposals));
  assert.ok(registry.proposals.length >= 6, 'expected deterministic launch-route proposals');

  const statuses = new Set(registry.proposals.map((proposal: { status: string }) => proposal.status));
  assert.deepEqual([...statuses], ['generated_needs_review']);

  for (const proposal of registry.proposals) {
    assert.match(proposal.id, /^[a-z0-9-]+-to-[a-z0-9-]+$/);
    assert.match(proposal.sourceRoute, /^\//);
    assert.match(proposal.targetRoute, /^\//);
    assert.notEqual(proposal.sourceRoute, proposal.targetRoute);
    assert.equal(proposal.status, 'generated_needs_review');
    assert.equal(proposal.publicRender, false);
    assert.ok(['semantic-core', 'launch-route-registry', 'cta-proof-path'].includes(proposal.source));
    assert.ok(typeof proposal.anchor === 'string' && proposal.anchor.length > 0);
  }
});

test('KIBER-79 exposes internal-link proposal smoke as a CI gate', async () => {
  const scriptPath = resolve(root, 'scripts/internal-link-proposals-smoke.mjs');
  assert.equal(existsSync(scriptPath), true, 'internal link proposal smoke script is required');
  const script = await readFile(scriptPath, 'utf8');
  assert.match(script, /internal-link-proposals\.json/);
  assert.match(script, /generated_needs_review/);
  assert.match(script, /publicRender/);
  assert.match(script, /dist/);

  const packageJson = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
  assert.equal(packageJson.scripts['test:internal-links'], 'node scripts/internal-link-proposals-smoke.mjs');
  assert.match(packageJson.scripts.ci, /npm run test:internal-links/);
});
