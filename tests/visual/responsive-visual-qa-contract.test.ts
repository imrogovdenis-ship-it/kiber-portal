import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const root = process.cwd();
const registryPath = resolve(root, 'data/review/responsive-visual-qa.json');
const manifestPath = resolve(root, 'docs/review/kiber-63/screenshots/manifest.json');
const smokePath = resolve(root, 'scripts/responsive-visual-qa-smoke.mjs');

function readJson(path: string) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

test('KIBER-63 defines responsive visual QA registry with human approval boundary', () => {
  assert.equal(existsSync(registryPath), true, 'responsive visual QA registry is required');
  const registry = readJson(registryPath);

  assert.equal(registry.schemaVersion, 1);
  assert.equal(registry.issue, 'KIBER-63');
  assert.equal(registry.scope.productionDeployChanged, false);
  assert.equal(registry.approval.visualDirection.status, 'approved');
  assert.match(registry.approval.visualDirection.source, /Telegram/i);
  assert.equal(registry.approval.production.status, 'not_requested');
  assert.deepEqual(registry.severityPolicy.blockingSeverities, ['critical', 'high']);
  assert.equal(registry.summary.blockingDefects, 0);
  assert.equal(registry.summary.routesChecked, 6);
  assert.equal(registry.summary.viewportsChecked, 4);
});

test('KIBER-63 screenshots manifest covers responsive route x viewport variants', () => {
  assert.equal(existsSync(manifestPath), true, 'screenshot manifest is required');
  const manifest = readJson(manifestPath);

  assert.equal(manifest.issue, 'KIBER-63');
  assert.equal(manifest.commit, '8f0e4a58ee81b183446dd058d57ed1978ad5f6e8');
  assert.equal(manifest.routes.length, 6);
  assert.equal(manifest.viewports.length, 4);
  assert.equal(manifest.screenshots.length, 24);
  assert.ok(manifest.contactSheets.length >= 7);
  assert.ok(manifest.routes.some((route: { path: string }) => route.path === '/robots/arenda-unitree-g1/'));
  assert.ok(manifest.viewports.some((viewport: { name: string; width: number }) => viewport.name === 'mobile-375' && viewport.width === 375));
  assert.ok(manifest.viewports.some((viewport: { name: string; width: number }) => viewport.name === 'desktop-1440' && viewport.width === 1440));

  for (const sheet of manifest.contactSheets) {
    assert.equal(existsSync(resolve(root, sheet.file)), true, `${sheet.file} must exist`);
  }
});

test('KIBER-63 exposes responsive visual QA smoke as CI gate', () => {
  assert.equal(existsSync(smokePath), true, 'responsive visual QA smoke is required');
  const smoke = readFileSync(smokePath, 'utf8');
  assert.match(smoke, /blockingDefects/);
  assert.match(smoke, /contactSheets/);
  assert.match(smoke, /visualDirection/);
  assert.match(smoke, /productionDeployChanged/);

  const pkg = readJson(resolve(root, 'package.json'));
  assert.equal(pkg.scripts['test:responsive-visual-qa'], 'node scripts/responsive-visual-qa-smoke.mjs');
  assert.match(pkg.scripts.ci, /npm run test:responsive-visual-qa/);
});
