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
    'production_blockers',
    'media_rights_owner_approved',
  ]);
  assert.equal(registry.productionPermission, false);
  assert.equal(registry.goNoGoStatus, 'blocked_until_owner_decisions');

  assert.deepEqual(registry.criticalRoutes, [
    { path: '/', purpose: 'commercial entry', sitemap: true },
    { path: '/contacts/', purpose: 'approved public contact trust page', sitemap: true },
    { path: '/lead/request/', purpose: 'capability-only lead entry', sitemap: false },
    { path: '/lead/thanks/', purpose: 'non-indexed lead confirmation', sitemap: false },
    { path: '/privacy-policy/', purpose: 'live-site sourced legal document', sitemap: false },
    { path: '/consent/', purpose: 'live-site sourced consent document', sitemap: false },
    { path: '/cookie-policy/', purpose: 'live-site sourced cookie document', sitemap: false },
    { path: '/terms/', purpose: 'live-site sourced user agreement', sitemap: false },
  ]);
});

test('KIBER launch readiness crawl is enforced by CI', () => {
  const pkg = JSON.parse(text('package.json'));
  assert.equal(pkg.scripts['test:readiness-crawl'], 'node scripts/launch-readiness-crawl-smoke.mjs');
  assert.match(pkg.scripts.ci, /npm run test:readiness-crawl/);
  const script = text('scripts/launch-readiness-crawl-smoke.mjs');
  assert.match(script, /productionBlockers/);
  assert.match(script, /criticalRoutes/);
  assert.match(script, /Critical route .* sitemap mismatch/);
});
