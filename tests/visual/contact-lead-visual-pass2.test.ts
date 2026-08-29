import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const text = (path: string) => readFileSync(path, 'utf8');

test('KIBER contact/lead visual pass 2 records review scope and keeps routing safe', () => {
  const registry = JSON.parse(text('data/review/contact-lead-visual-pass2.json'));

  assert.equal(registry.issue, 'KIBER-contact-lead-visual-pass2');
  assert.equal(registry.status, 'in_review_after_pr');
  assert.deepEqual(registry.sources, [
    'docs/source/reference-desktop-v9.html',
    'docs/source/reference-mobile-v3.html',
    'data/lead/capability-contract.json',
  ]);
  assert.deepEqual(registry.routes, ['/contacts/', '/lead/request/']);
  assert.equal(registry.safety.liveLeadRoutingChanged, false);
  assert.equal(registry.safety.productionContactsChanged, false);
  assert.equal(registry.safety.rawHtmlCopiedIntoRuntime, false);
});

test('contacts page renders reference-style conversion cards without live destinations', () => {
  const contacts = text('src/pages/contacts.astro');

  assert.match(contacts, /data-rv="30"/);
  assert.match(contacts, /class="contact-conversion/);
  assert.match(contacts, /class="contact-conversion__card/);
  assert.match(contacts, /Каналы связи/);
  assert.match(text('data/lead/capability-contract.json'), /\"enabled\": false/);
  assert.doesNotMatch(contacts, /tel:\+7|wa\.me\/7\d|t\.me\/[a-z0-9_]+/i);
});

test('lead request page uses the pass-2 panel layout and capability contract marker', () => {
  const lead = text('src/pages/lead/request.astro');

  assert.match(lead, /data-rv="31"/);
  assert.match(lead, /data-lead-capability="disabled"/);
  assert.match(lead, /class="lead-request__panel"/);
  assert.match(lead, /class="lead-request__sidebar"/);
  assert.match(lead, /routing remains disabled/i);
});

test('pass 2 is wired into the rendered smoke and CI', () => {
  const pkg = JSON.parse(text('package.json'));
  assert.equal(pkg.scripts['test:contact-lead-visual'], 'node scripts/contact-lead-visual-smoke.mjs');
  assert.match(pkg.scripts.ci, /npm run test:contact-lead-visual/);
  assert.match(text('scripts/contact-lead-visual-smoke.mjs'), /contact-lead-visual-pass2/);
});
