import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path: string) => readFileSync(path, 'utf8');
const pkg = JSON.parse(read('package.json'));

test('visual pass 3B removes public-facing technical review labels from pass 3 pages', () => {
  const files = [
    'src/pages/lead/thanks.astro',
    'src/pages/roboty-gumanoidy.astro',
    'src/pages/roboty-sobaki.astro',
    'src/pages/contacts.astro',
  ];
  for (const file of files) {
    const source = read(file);
    assert.doesNotMatch(source, /STATIC-SAFE|LEAD CAPABILITY|Live lead routing remains disabled|preview-режим|data-routing-state/i, file);
    assert.match(source, /data-kiber-task="KIBER-contact-lead-visual-pass3b"/, file);
  }
});

test('category pages expose reference-style hero shell, stats and CTA strip', () => {
  for (const file of ['src/pages/roboty-gumanoidy.astro', 'src/pages/roboty-sobaki.astro']) {
    const source = read(file);
    assert.match(source, /category-page__hero-card/, file);
    assert.match(source, /category-page__hero-copy/, file);
    assert.match(source, /category-page__media-card/, file);
    assert.match(source, /category-page__stats/, file);
    assert.match(source, /category-page__cta-strip/, file);
    assert.match(source, /background:\s*var\(--kp-reference-blue-deep\)/, file);
    assert.match(source, /border-radius:\s*var\(--kp-reference-button-radius\)/, file);
  }
});

test('thanks page uses branded confirmation language while keeping routing safety in CI/docs', () => {
  const source = read('src/pages/lead/thanks.astro');
  assert.match(source, /Спасибо, бриф принят/);
  assert.match(source, /lead-thanks__hero-card/);
  assert.match(source, /lead-thanks__signal/);
  assert.match(source, /Менеджер свяжется после подключения утверждённых каналов связи/);
  assert.match(source, /background:\s*var\(--kp-reference-blue-deep\)/);
  assert.doesNotMatch(source, /approval|webhook|CRM|Telegram bot|disabled/i);
});

test('visual pass 3B screenshot capture command is documented for owner review', () => {
  assert.equal(pkg.scripts['capture:contact-lead-visual-pass3b'], 'node scripts/capture-contact-lead-visual-pass3b.mjs');
  const doc = read('docs/review/contact-lead-visual-pass3b/README.md');
  assert.match(doc, /reference\/live-style corrective pass/i);
  assert.match(doc, /visual approval only/i);
  assert.match(doc, /does not change production deploy, DNS, secrets, analytics provider\/IDs, real public contacts, payment, or live lead destinations/i);
});
