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
  assert.match(page, /data-lead-form-state=\{leadFormEnabled \? 'enabled' : 'disabled'\}/);
  assert.match(page, /data-analytics-form-state="disabled"/);
  assert.match(page, /href=\{channel\.href\}/);
  assert.match(page, /Написать в Telegram/);
  assert.match(page, /Написать в WhatsApp/);
  assert.match(page, /Написать в MAX/);
});

test('KIBER-36 robot page documents empty and ready states without hiding them from assistive tech', async () => {
  const page = await readFile(resolve(root, 'src/pages/robots/[slug].astro'), 'utf8');
  assert.match(page, /data-state="ready"/);
  assert.match(page, /data-state="empty"/);
  assert.match(page, /aria-live="polite"/);
  assert.match(page, /Факты и ограничения/i);
});

test('KIBER-36 keeps a global keyboard focus-visible style', async () => {
  const layout = await readFile(resolve(root, 'src/styles/layout.css'), 'utf8');
  assert.match(layout, /:where\(a, button/);
  assert.match(layout, /:focus-visible/);
});
