import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';

const root = process.cwd();

test('KIBER-53 defines semantic-core lifecycle statuses with region and verification date', async () => {
  const registryPath = resolve(root, 'data/seo/semantic-core.json');
  assert.equal(existsSync(registryPath), true, 'semantic-core registry is required');

  const registry = JSON.parse(await readFile(registryPath, 'utf8'));
  assert.equal(registry.schemaVersion, 1);
  assert.equal(registry.issue, 'KIBER-53');
  assert.match(registry.verifiedAt, /^2026-08-27$/);
  assert.equal(registry.verificationRegion, 'RU');
  assert.deepEqual(registry.allowedLifecycle, ['active', 'deprecated', 'experimental']);
  assert.ok(Array.isArray(registry.entries));
  assert.ok(registry.entries.length >= 6, 'registry should include launch query clusters');

  const statuses = new Set(registry.entries.map((entry: { lifecycle: string }) => entry.lifecycle));
  assert.ok(statuses.has('active'));
  assert.ok(statuses.has('deprecated'));
  assert.ok(statuses.has('experimental'));

  for (const entry of registry.entries) {
    assert.match(entry.id, /^[a-z0-9-]+$/);
    assert.match(entry.intent, /^(commercial|category|scenario|informational|brand)$/);
    assert.ok(registry.allowedLifecycle.includes(entry.lifecycle));
    assert.equal(entry.region, registry.verificationRegion);
    assert.equal(entry.verifiedAt, registry.verifiedAt);
    assert.ok(Array.isArray(entry.queries) && entry.queries.length > 0);
    assert.ok(typeof entry.primaryRoute === 'string' && entry.primaryRoute.startsWith('/'));
  }
});

test('KIBER-53 exposes semantic-core lifecycle smoke as a CI gate', async () => {
  const scriptPath = resolve(root, 'scripts/semantic-core-lifecycle-smoke.mjs');
  assert.equal(existsSync(scriptPath), true, 'semantic-core smoke script is required');
  const script = await readFile(scriptPath, 'utf8');
  assert.match(script, /semantic-core\.json/);
  assert.match(script, /active/);
  assert.match(script, /deprecated/);
  assert.match(script, /experimental/);

  const packageJson = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
  assert.equal(packageJson.scripts['test:semantic-core'], 'node scripts/semantic-core-lifecycle-smoke.mjs');
  assert.match(packageJson.scripts.ci, /npm run test:semantic-core/);
});
