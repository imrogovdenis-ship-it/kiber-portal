import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';

const root = process.cwd();

test('KIBER-36 lead request exposes accessible working contact links while the form is disabled', async () => {
  const page = await readFile(resolve(root, 'src/pages/lead/request.astro'), 'utf8');
  assert.match(page, /aria-labelledby="lead-request-title"/);
  assert.match(page, /aria-labelledby="lead-working-contacts-title"/);
  assert.match(page, /aria-live="polite"/);
  assert.match(page, /href=\{channel\.href\}/);
  assert.match(page, /Написать в Telegram/);
  assert.match(page, /Написать в WhatsApp/);
  assert.match(page, /Написать в MAX/);
});

test('KIBER-36 robot page documents empty and ready states without hiding them from assistive tech', async () => {
  const page = await readFile(resolve(root, 'src/pages/robots/[slug].astro'), 'utf8');
  assert.match(page, /id="main-content" tabindex="-1"/);
  assert.match(page, /<RobotCardTemplate \{template\} \/>/);
  const template = await readFile(resolve(root, 'src/components/templates/RobotCardTemplate.astro'), 'utf8');
  assert.match(template, /aria-labelledby="robot-card-hero-title"/);
  assert.match(template, /data-block-id="includedService"/);
  assert.match(template, /data-block-id="faq"/);
});

test('KIBER-36 keeps a global keyboard focus-visible style', async () => {
  const layout = await readFile(resolve(root, 'src/styles/layout.css'), 'utf8');
  assert.match(layout, /:where\(a, button/);
  assert.match(layout, /:focus-visible/);
});

test('audit shared form stays preview-safe at runtime', async () => {
  const page = await readFile(resolve(root, 'src/pages/lead/request.astro'), 'utf8');
  const script = await readFile(resolve(root, 'public/scripts/contact-lead-form-popup.js'), 'utf8');
  assert.match(page, /data-lead-form-popup-trigger/);
  assert.match(script, /form.dataset.leadFormLive !== 'true'/);
  assert.match(script, /window.location.hostname/);
});
