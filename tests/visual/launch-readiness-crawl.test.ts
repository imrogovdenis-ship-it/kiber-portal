import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const text = (path: string) => readFileSync(path, 'utf8');

test('KIBER launch readiness crawl defines go/no-go gates', () => {
  const registry = JSON.parse(text('data/review/launch-readiness-crawl.json'));

  assert.equal(registry.issue, 'KIBER-launch-readiness-crawl');
  assert.deepEqual(registry.requiredChecks, [
    'route_inventory',
    'sitemap_alignment',
    '404_page',
    'robots_pages',
    'legal_pages',
    'lead_routing_disabled',
    'analytics_provider_disabled',
    'media_rights_gated',
    'production_blockers',
  ]);
  assert.equal(registry.productionPermission, false);
  assert.equal(registry.goNoGoStatus, 'blocked_until_owner_decisions');
});

test('KIBER launch readiness crawl is enforced by CI', () => {
  const pkg = JSON.parse(text('package.json'));
  assert.equal(pkg.scripts['test:readiness-crawl'], 'node scripts/launch-readiness-crawl-smoke.mjs');
  assert.match(pkg.scripts.ci, /npm run test:readiness-crawl/);
  assert.match(text('scripts/launch-readiness-crawl-smoke.mjs'), /productionBlockers/);
});
