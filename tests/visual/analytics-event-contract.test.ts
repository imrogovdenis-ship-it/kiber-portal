import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';

const root = process.cwd();
const requiredEvents = ['phone_click', 'messenger_click', 'form_submit_intent', 'pdf_download', 'scroll_depth', 'robot_card_click'];

test('KIBER-71 defines a provider-neutral analytics event registry', async () => {
  const registryPath = resolve(root, 'data/analytics/provider-neutral-events.json');
  assert.equal(existsSync(registryPath), true, 'provider-neutral event registry is required');

  const registry = JSON.parse(await readFile(registryPath, 'utf8'));
  assert.equal(registry.schemaVersion, 1);
  assert.equal(registry.provider, 'neutral');
  const events = registry.events as Array<{ name: string; required: string[] }>;
  for (const name of requiredEvents) {
    const event = events.find((candidate) => candidate.name === name);
    assert.ok(event, `${name} must be registered`);
    assert.ok(event.required.includes('source'), `${name} requires source`);
    assert.ok(event.required.includes('placement'), `${name} requires placement`);
    assert.ok(event.required.includes('slug'), `${name} requires slug`);
  }
});

test('KIBER-71 exposes event contract smoke as a CI gate', async () => {
  const scriptPath = resolve(root, 'scripts/analytics-event-contract-smoke.mjs');
  assert.equal(existsSync(scriptPath), true, 'analytics event contract smoke is required');

  const script = await readFile(scriptPath, 'utf8');
  assert.match(script, /data-analytics-event/);
  assert.match(script, /data-analytics-source/);
  assert.match(script, /data-analytics-placement/);
  assert.match(script, /data-analytics-slug/);

  const packageJson = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
  assert.equal(packageJson.scripts['test:analytics-events'], 'node scripts/analytics-event-contract-smoke.mjs');
  assert.match(packageJson.scripts.ci, /test:analytics-events/);
});
