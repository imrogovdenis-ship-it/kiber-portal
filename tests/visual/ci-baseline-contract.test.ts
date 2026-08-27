import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';

const root = process.cwd();

test('KIBER-20 exposes links, 404, and secret scan as a CI baseline gate', async () => {
  const scriptPath = resolve(root, 'scripts/ci-baseline-smoke.mjs');
  assert.equal(existsSync(scriptPath), true, 'CI baseline smoke script exists');

  const packageJson = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
  assert.equal(packageJson.scripts['ci:baseline'], 'node scripts/ci-baseline-smoke.mjs');
  assert.match(packageJson.scripts.ci, /build:production[\s\S]*ci:baseline/);
});

test('KIBER-20 baseline script documents required build outputs and safety scans', async () => {
  const script = await readFile(resolve(root, 'scripts/ci-baseline-smoke.mjs'), 'utf8');

  assert.match(script, /dist\/404\.html/);
  assert.match(script, /internal link/i);
  assert.match(script, /sha256|api[_-]?key|private[_-]?key|password|secret/i);
  assert.match(script, /noindex/i);
  assert.doesNotMatch(script, /production deploy|dns change|real lead destination/i);
});
