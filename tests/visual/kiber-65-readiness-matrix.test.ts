import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const root = process.cwd();
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');
const json = (path: string) => JSON.parse(read(path));

test('KIBER-65 matrix covers forms analytics robots sitemap and redirects without production side effects', () => {
  assert.equal(existsSync(resolve(root, 'data/review/kiber-65-readiness-matrix.json')), true);
  const matrix = json('data/review/kiber-65-readiness-matrix.json');

  assert.equal(matrix.schemaVersion, 1);
  assert.equal(matrix.issue, 'KIBER-65');
  assert.equal(matrix.status, 'passed_with_production_blockers');
  assert.equal(matrix.productionPermission, false);

  const areas = new Map(matrix.areas.map((area: { id: string; status: string }) => [area.id, area.status]));
  assert.deepEqual([...areas.keys()].sort(), ['analytics', 'forms', 'redirects', 'robots', 'sitemap']);
  for (const [id, status] of areas) {
    assert.match(String(status), /^green/, `${id}: expected green status`);
  }

  assert.equal(matrix.safety.productionDeployChanged, false);
  assert.equal(matrix.safety.dnsChanged, false);
  assert.equal(matrix.safety.productionSecretsChanged, false);
  assert.equal(matrix.safety.analyticsProviderEnabled, false);
  assert.equal(matrix.safety.analyticsCookiesEnabled, false);
  assert.equal(matrix.safety.liveLeadRoutingEnabled, false);
  assert.equal(matrix.safety.realTestLeadsSubmitted, false);

  assert.deepEqual(
    matrix.blockingProductionDependencies.map((item: { id: string }) => item.id).sort(),
    ['KIBER-64', 'KIBER-67', 'KIBER-69'],
  );
});

test('KIBER-65 smoke is wired to existing route lead analytics and redirect gates', () => {
  const script = read('scripts/kiber-65-readiness-matrix-smoke.mjs');
  assert.match(script, /data\/lead\/capability-contract\.json/);
  assert.match(script, /data\/analytics\/provider-neutral-events\.json/);
  assert.match(script, /public\/robots\.txt/);
  assert.match(script, /data\/seo\/launch-routes\.json/);
  assert.match(script, /data\/seo\/redirects\.json/);
  assert.match(script, /live lead routing destinations and backend/);

  const pkg = json('package.json');
  assert.equal(pkg.scripts['test:kiber-65-readiness'], 'node scripts/kiber-65-readiness-matrix-smoke.mjs');
  assert.match(pkg.scripts.ci, /npm run test:kiber-65-readiness/);
});
