import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path: string) => readFileSync(path, 'utf8');
const json = (path: string) => JSON.parse(read(path));

test('approved media rendering smoke is wired into CI', () => {
  assert.equal(existsSync('scripts/approved-media-rendering-smoke.mjs'), true, 'approved media rendering smoke is required');
  const pkg = json('package.json');
  assert.equal(pkg.scripts['test:approved-media-rendering'], 'node scripts/approved-media-rendering-smoke.mjs');
  assert.match(pkg.scripts.ci, /npm run test:approved-media-rendering/);
});

test('approved media rendering smoke checks rendered robot pages against owner-approved media registries', () => {
  const script = read('scripts/approved-media-rendering-smoke.mjs');
  assert.match(script, /media-rights-registry\.json/);
  assert.match(script, /media-rights-robot-cards\.json/);
  assert.match(script, /dist\/robots/);
  assert.match(script, /approved_for_production/);
  assert.match(script, /robot-page__media/);
  assert.match(script, /robot-card__image/);
});
