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
  assert.match(contacts, /Написать в Telegram|Написать в WhatsApp/);
  assert.match(text('data/lead/capability-contract.json'), /\"enabled\": false/);
  assert.match(contacts, /siteConfig\.telegram|siteConfig\.whatsapp/);
});

test('lead request page uses the pass-2 panel layout and capability contract marker', () => {
  const lead = text('src/pages/lead/request.astro');

  assert.match(lead, /data-rv="31"/);
  assert.match(lead, /class="lead-request__panel"/);
  assert.match(lead, /class="lead-request__sidebar"/);
});

test('KIBER-38 lead request gates the preview form behind feature flag and keeps approved contact channels visible', () => {
  const lead = text('src/pages/lead/request.astro');

  assert.match(text('src/components/layout/ContactLeadFormPopup.astro'), /<form[\s\S]*method="post"[\s\S]*action=\{formAction\}[\s\S]*>/);
  assert.match(text('src/components/layout/ContactLeadFormPopup.astro'), /name="privacy_consent"/);
  assert.match(text('src/components/layout/ContactLeadFormPopup.astro'), /\/privacy-policy\//);
  assert.match(text('src/components/layout/ContactLeadFormPopup.astro'), /\/consent\//);
  assert.match(lead, /siteConfig\.telegram/);
  assert.match(lead, /siteConfig\.whatsapp/);
  assert.match(lead, /siteConfig\.max/);
  assert.match(lead, /Написать в Telegram/);
  assert.match(lead, /Написать в WhatsApp/);
  assert.match(lead, /Написать в MAX/);
});

test('pass 2 is wired into the rendered smoke and CI', () => {
  const pkg = JSON.parse(text('package.json'));
  assert.equal(pkg.scripts['test:contact-lead-visual'], 'node scripts/contact-lead-visual-smoke.mjs');
  assert.match(pkg.scripts.ci, /npm run test:contact-lead-visual/);
  assert.match(text('scripts/contact-lead-visual-smoke.mjs'), /contact-lead-visual-pass2/);
});

test('audit shared form stays preview-safe at runtime', () => {
  const read = text;
  assert.match(read('src/pages/lead/request.astro'), /data-lead-form-popup-trigger/);
  assert.match(read('public/scripts/contact-lead-form-popup.js'), /form.dataset.leadFormLive !== 'true'/);
  assert.match(read('public/scripts/contact-lead-form-popup.js'), /window.location.hostname/);
});
