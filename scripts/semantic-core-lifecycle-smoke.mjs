import assert from 'node:assert/strict';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const root = process.cwd();
const registryPath = resolve(root, 'data/seo/semantic-core.json');
const routeRegistryPath = resolve(root, 'data/seo/launch-routes.json');
const reportPath = resolve(root, 'docs/review/kiber-53/semantic-core-lifecycle-report.json');

const allowedLifecycle = ['active', 'deprecated', 'experimental'];
const allowedIntent = ['commercial', 'category', 'scenario', 'informational', 'brand'];
const isoDate = /^\d{4}-\d{2}-\d{2}$/;

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

assert.equal(existsSync(registryPath), true, 'data/seo/semantic-core.json is required');
assert.equal(existsSync(routeRegistryPath), true, 'data/seo/launch-routes.json is required for route alignment');

const registry = readJson(registryPath);
const launchRoutes = readJson(routeRegistryPath);
const launchRoutePaths = new Set(launchRoutes.routes.map((route) => route.path));

assert.equal(registry.schemaVersion, 1, 'schemaVersion must be 1');
assert.equal(registry.issue, 'KIBER-53', 'issue must be KIBER-53');
assert.match(registry.verifiedAt, isoDate, 'verifiedAt must be YYYY-MM-DD');
assert.equal(registry.verificationRegion, 'RU', 'verificationRegion must be RU for launch core');
assert.deepEqual(registry.allowedLifecycle, allowedLifecycle, 'allowedLifecycle must be canonical');
assert.ok(Array.isArray(registry.entries) && registry.entries.length >= 6, 'entries must include launch clusters');

const ids = new Set();
const lifecycleCounts = Object.fromEntries(allowedLifecycle.map((status) => [status, 0]));
const intentCounts = Object.fromEntries(allowedIntent.map((intent) => [intent, 0]));

for (const entry of registry.entries) {
  assert.match(entry.id, /^[a-z0-9-]+$/, `invalid id: ${entry.id}`);
  assert.equal(ids.has(entry.id), false, `duplicate id: ${entry.id}`);
  ids.add(entry.id);

  assert.ok(allowedIntent.includes(entry.intent), `${entry.id}: invalid intent`);
  assert.ok(allowedLifecycle.includes(entry.lifecycle), `${entry.id}: invalid lifecycle`);
  assert.equal(entry.region, registry.verificationRegion, `${entry.id}: region must match registry`);
  assert.equal(entry.verifiedAt, registry.verifiedAt, `${entry.id}: verifiedAt must match registry`);
  assert.ok(Array.isArray(entry.queries) && entry.queries.length > 0, `${entry.id}: queries required`);
  assert.ok(entry.queries.every((query) => typeof query === 'string' && query.trim().length > 0), `${entry.id}: empty query`);
  assert.equal(typeof entry.primaryRoute, 'string', `${entry.id}: primaryRoute required`);
  assert.equal(entry.primaryRoute.startsWith('/'), true, `${entry.id}: primaryRoute must be absolute path`);

  if (entry.lifecycle !== 'deprecated') {
    assert.equal(launchRoutePaths.has(entry.primaryRoute), true, `${entry.id}: active/experimental route must exist in launch-routes`);
  }

  lifecycleCounts[entry.lifecycle] += 1;
  intentCounts[entry.intent] += 1;
}

for (const lifecycle of allowedLifecycle) {
  assert.ok(lifecycleCounts[lifecycle] > 0, `missing lifecycle coverage: ${lifecycle}`);
}

mkdirSync(dirname(reportPath), { recursive: true });
writeFileSync(reportPath, `${JSON.stringify({
  issue: 'KIBER-53',
  generatedAt: new Date().toISOString(),
  verifiedAt: registry.verifiedAt,
  verificationRegion: registry.verificationRegion,
  entries: registry.entries.length,
  lifecycleCounts,
  intentCounts,
}, null, 2)}\n`);

console.log(`KIBER-53 semantic-core lifecycle smoke passed: ${registry.entries.length} clusters, ${Object.keys(lifecycleCounts).length} lifecycle states, region ${registry.verificationRegion}.`);
