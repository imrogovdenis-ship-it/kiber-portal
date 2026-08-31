import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';

const root = process.cwd();

test('KIBER-34 defines an approved visual baseline for key templates', async () => {
  const baselinePath = resolve(root, 'docs/review/kiber-35/approved-visual-baseline.json');
  assert.equal(existsSync(baselinePath), true, 'approved visual baseline manifest exists');

  const baseline = JSON.parse(await readFile(baselinePath, 'utf8'));
  assert.equal(baseline.task, 'KIBER-35');
  assert.equal(baseline.approvalStatus, 'approved');
  assert.equal(baseline.viewports.length, 2);
  assert.equal(baseline.routes.length, 5);
  assert.equal(baseline.references.length, 10);

  for (const reference of baseline.references) {
    assert.match(reference.file, /^docs\/review\/kiber-35\/screenshots\/kiber-35-reference-/);
    assert.match(reference.sha256, /^[a-f0-9]{64}$/);
    assert.equal(existsSync(resolve(root, reference.file)), true, `${reference.file} exists`);
  }
});

test('KIBER-34 exposes visual smoke as npm ci gate', async () => {
  const scriptPath = resolve(root, 'scripts/visual-regression-smoke.mjs');
  assert.equal(existsSync(scriptPath), true, 'visual smoke script exists');

  const packageJson = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
  assert.equal(packageJson.scripts['test:visual-regression'], 'node scripts/visual-regression-smoke.mjs');
  assert.match(packageJson.scripts.ci, /test:visual-regression/);
  assert.match(packageJson.scripts.ci, /build:production/);
});
