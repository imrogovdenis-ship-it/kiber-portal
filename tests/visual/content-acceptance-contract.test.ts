import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const root = process.cwd();
const registryPath = resolve(root, 'data/review/content-acceptance.json');
const smokePath = resolve(root, 'scripts/content-acceptance-smoke.mjs');
const generatedRobotsPath = resolve(root, 'src/content/robots.generated.json');
const launchRoutesPath = resolve(root, 'data/seo/launch-routes.json');

function readJson(path: string) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

test('KIBER-55 defines a content acceptance registry for robots and launch pages', () => {
  assert.equal(existsSync(registryPath), true, 'content acceptance registry is required');
  const registry = readJson(registryPath);
  const generated = readJson(generatedRobotsPath);
  const launch = readJson(launchRoutesPath);

  assert.equal(registry.schemaVersion, 1);
  assert.equal(registry.issue, 'KIBER-55');
  assert.equal(registry.policy.finalApprovalRequiresHumanOwner, true);
  assert.match(registry.policy.placeholderPattern, /placeholder/i);
  assert.ok(Array.isArray(registry.allowedStatuses));
  assert.ok(registry.allowedStatuses.includes('accepted_structurally'));
  assert.ok(registry.allowedStatuses.includes('needs_copy_review'));
  assert.ok(registry.allowedStatuses.includes('needs_media_rights_review'));
  assert.ok(registry.allowedStatuses.includes('needs_price_review'));
  assert.ok(registry.allowedStatuses.includes('blocked_by_business_approval'));

  assert.equal(registry.robots.length, 24, 'must cover 24 robot records');
  assert.deepEqual(new Set(registry.robots.map((item: { slug: string }) => item.slug)), new Set(generated.robots.map((robot: { slug: string }) => robot.slug)));

  const publicRoutes = launch.routes.filter((route: { sitemap: boolean; template: string }) => route.sitemap === true && route.template !== 'robot-detail');
  assert.deepEqual(new Set(registry.launchPages.map((item: { route: string }) => item.route)), new Set(publicRoutes.map((route: { path: string }) => route.path)));
});

test('KIBER-55 does not claim final content approval without human evidence', () => {
  const registry = readJson(registryPath);
  for (const item of [...registry.robots, ...registry.launchPages]) {
    assert.notEqual(item.finalApprovalStatus, 'approved', `${item.id || item.slug || item.route}: must not be final-approved without human review evidence`);
    assert.ok(Array.isArray(item.reviewFlags), `${item.id || item.slug || item.route}: reviewFlags required`);
    assert.ok(item.reviewFlags.length >= 1, `${item.id || item.slug || item.route}: at least one explicit review flag required`);
  }
});

test('KIBER-55 exposes rendered content acceptance as a CI gate', () => {
  assert.equal(existsSync(smokePath), true, 'content acceptance smoke script is required');
  const smoke = readFileSync(smokePath, 'utf8');
  assert.match(smoke, /placeholderPattern/);
  assert.match(smoke, /internalPhrasePattern/);
  assert.match(smoke, /accepted_structurally/);
  assert.match(smoke, /blocked_by_business_approval/);
  assert.match(smoke, /dist/);

  const pkg = readJson(resolve(root, 'package.json'));
  assert.equal(pkg.scripts['test:content-acceptance'], 'node scripts/content-acceptance-smoke.mjs');
  assert.match(pkg.scripts.ci, /npm run test:content-acceptance/);
});
