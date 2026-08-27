import assert from 'node:assert/strict';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = process.cwd();
const distRoot = resolve(root, 'dist');
const registryPath = resolve(root, 'data/analytics/provider-neutral-events.json');
const reportPath = resolve(root, 'docs/review/kiber-71/analytics-event-contract-report.json');

const requiredReservedEvents = ['phone_click', 'messenger_click', 'form_submit_intent', 'pdf_download', 'scroll_depth', 'robot_card_click'];
const requiredAttributes = ['data-analytics-source', 'data-analytics-placement', 'data-analytics-slug'];

function walkHtml(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walkHtml(full, files);
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

function attrMap(tag) {
  const attrs = {};
  for (const match of tag.matchAll(/([a-zA-Z0-9:-]+)=("[^"]*"|'[^']*')/g)) {
    attrs[match[1]] = match[2].slice(1, -1);
  }
  return attrs;
}

assert.equal(existsSync(distRoot), true, 'dist/ missing; run npm run build:production before npm run test:analytics-events');
assert.equal(existsSync(registryPath), true, 'provider-neutral event registry missing');

const registry = JSON.parse(readFileSync(registryPath, 'utf8'));
const events = new Map(registry.events.map((event) => [event.name, event]));
const failures = [];

if (registry.schemaVersion !== 1) failures.push('schemaVersion must be 1');
if (registry.provider !== 'neutral') failures.push('provider must be neutral');
for (const name of requiredReservedEvents) {
  const event = events.get(name);
  if (!event) {
    failures.push(`missing required event ${name}`);
    continue;
  }
  for (const field of ['source', 'placement', 'slug']) {
    if (!event.required.includes(field)) failures.push(`${name}: missing required field ${field}`);
  }
}

const htmlFiles = walkHtml(distRoot);
const domEvents = [];
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const tags = html.match(/<[^>]+data-analytics-event=[^>]+>/g) || [];
  for (const tag of tags) {
    const attrs = attrMap(tag);
    const name = attrs['data-analytics-event'];
    const route = file.replace(`${distRoot}/`, 'dist/');
    domEvents.push({ route, name, attrs });
    if (!events.has(name)) failures.push(`${route}: unregistered analytics event ${name}`);
    for (const attr of requiredAttributes) {
      if (!attrs[attr]) failures.push(`${route}: ${name} missing ${attr}`);
    }
  }
}

for (const name of ['phone_click', 'messenger_click', 'form_submit_intent', 'robot_card_click']) {
  if (!domEvents.some((event) => event.name === name)) failures.push(`no DOM usage found for ${name}`);
}

const report = {
  issue: 'KIBER-71',
  generatedAt: new Date().toISOString(),
  registeredEvents: [...events.keys()].sort(),
  domEventsChecked: domEvents.length,
  domEventNames: [...new Set(domEvents.map((event) => event.name))].sort(),
  status: failures.length ? 'failed' : 'passed',
  failures,
};
mkdirSync(resolve(root, 'docs/review/kiber-71'), { recursive: true });
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

if (failures.length) {
  console.error(`KIBER-71 analytics event contract smoke failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log(`KIBER-71 analytics event contract smoke passed: ${domEvents.length} DOM events checked against ${events.size} provider-neutral events.`);
