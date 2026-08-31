import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const root = process.cwd();
const registryPath = resolve(root, 'data/review/media-rights-registry.json');
const generatedRobotsPath = resolve(root, 'src/content/robots.generated.json');
const smokePath = resolve(root, 'scripts/media-rights-registry-smoke.mjs');

function readJson(path: string) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

test('KIBER media rights registry exists and gates every generated robot asset', () => {
  assert.equal(existsSync(registryPath), true, 'media rights registry is required');
  const registry = readJson(registryPath);
  const generated = readJson(generatedRobotsPath);

  assert.equal(registry.schemaVersion, 1);
  assert.equal(registry.issue, 'KIBER-47');
  assert.equal(registry.policy.productionUseRequiresHumanRightsApproval, true);
  assert.equal(registry.policy.noUnverifiedMediaInProduction, true);
  assert.ok(registry.allowedRightsStatuses.includes('needs_rights_review'));
  assert.ok(registry.allowedRightsStatuses.includes('approved_for_preview'));
  assert.ok(registry.allowedRightsStatuses.includes('approved_for_production'));
  assert.ok(registry.allowedRightsStatuses.includes('blocked_for_production'));
  assert.equal(registry.summary.productionApproved, 24);
  assert.equal(registry.approval.status, 'approved_by_owner_for_production_media_use');
  assert.equal(registry.policy.productionDeployAllowed, false);
  assert.equal(registry.policy.dnsSecretsAnalyticsLeadRoutingChanged, false);
  assert.match(registry.approval.scope, /production deploy\/DNS\/secrets\/analytics\/live routing remain separately blocked/);

  assert.deepEqual(
    new Set(registry.robots.map((item: { slug: string }) => item.slug)),
    new Set(generated.robots.map((robot: { slug: string }) => robot.slug)),
    'registry must cover exactly the generated robot catalog',
  );

  for (const item of registry.robots) {
    assert.equal(item.productionApproved, true, `${item.slug}: owner media approval should be recorded`);
    assert.equal(item.rightsStatus, 'approved_for_production', `${item.slug}: robot media should record owner approval`);
    assert.ok(item.assets.hero.src.startsWith('/images/'), `${item.slug}: hero asset path must be tracked`);
    assert.ok(item.assets.hero.alt.length > 0, `${item.slug}: hero alt must be tracked for review`);
    assert.ok(item.reviewFlags.includes('owner_approved_media_rights'), `${item.slug}: media rights approval flag required`);
  }
});

test('KIBER media rights registry is exposed as a CI smoke gate', () => {
  assert.equal(existsSync(smokePath), true, 'media rights smoke script is required');
  const smoke = readFileSync(smokePath, 'utf8');
  assert.match(smoke, /productionUseRequiresHumanRightsApproval/);
  assert.match(smoke, /approved_for_production/);
  assert.match(smoke, /blocked_for_production/);

  const pkg = readJson(resolve(root, 'package.json'));
  assert.equal(pkg.scripts['test:media-rights'], 'node scripts/media-rights-registry-smoke.mjs');
  assert.match(pkg.scripts.ci, /npm run test:media-rights/);
});
