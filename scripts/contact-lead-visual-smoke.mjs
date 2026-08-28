import assert from 'node:assert/strict';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const registry = JSON.parse(read('data/review/contact-lead-visual-pass2.json'));
const capability = JSON.parse(read('data/lead/capability-contract.json'));

assert.equal(registry.issue, 'KIBER-contact-lead-visual-pass2');
assert.equal(registry.safety.liveLeadRoutingChanged, false);
assert.equal(registry.safety.productionContactsChanged, false);
assert.equal(registry.safety.rawHtmlCopiedIntoRuntime, false);
assert.equal(capability.routing.enabled, false);
assert.deepEqual(capability.routing.destinations, []);

for (const route of ['contacts', 'lead/request']) {
  const built = resolve(root, 'dist', route, 'index.html');
  assert.equal(existsSync(built), true, `${route} must be built`);
}

const contactsHtml = read('dist/contacts/index.html');
const leadHtml = read('dist/lead/request/index.html');
const contactsMain = contactsHtml.match(/<main class="contact-conversion[\s\S]*?<\/main>/)?.[0] ?? '';
const leadMain = leadHtml.match(/<main class="lead-request[\s\S]*?<\/main>/)?.[0] ?? '';

assert.match(contactsMain, /data-rv="30"/);
assert.match(contactsMain, /contact-conversion__card/);
assert.match(contactsMain, /Lead capability:/);
assert.doesNotMatch(contactsMain, /href="tel:\+7|wa\.me\/7\d|t\.me\/[a-z0-9_]+/i);

assert.match(leadMain, /data-rv="31"/);
assert.match(leadMain, /data-lead-capability="disabled"/);
assert.match(leadMain, /lead-request__panel/);
assert.match(leadMain, /Routing remains disabled/);
assert.doesNotMatch(leadMain, /PUBLIC_LEAD_FORM_ENDPOINT|amoCRM|Telegram bot token/i);

const report = {
  issue: registry.issue,
  status: 'passed',
  routesChecked: registry.routes,
  liveLeadRoutingChanged: false,
  productionContactsChanged: false,
  generatedAt: new Date().toISOString(),
};

mkdirSync(resolve(root, 'docs/review/contact-lead-visual-pass2'), { recursive: true });
writeFileSync(
  resolve(root, 'docs/review/contact-lead-visual-pass2/contact-lead-visual-report.json'),
  `${JSON.stringify(report, null, 2)}\n`,
);

console.log('KIBER contact/lead visual pass 2 smoke passed: /contacts/ and /lead/request/ checked with lead routing disabled.');
