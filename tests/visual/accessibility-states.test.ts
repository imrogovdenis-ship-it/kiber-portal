import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';

const root = process.cwd();

test('KIBER-36 lead request exposes accessible required, error, status and loading states', async () => {
  const page = await readFile(resolve(root, 'src/pages/lead/request.astro'), 'utf8');
  assert.match(page, /aria-describedby="name-help name-error"/);
  assert.match(page, /aria-describedby="phone-help phone-error"/);
  assert.match(page, /aria-describedby="email-help"/);
  assert.match(page, /privacy-agreement-help/);
  assert.match(page, /required/);
  assert.match(page, /role="alert"/);
  assert.match(page, /aria-live="polite"/);
  assert.match(page, /aria-busy="false"/);
  assert.match(page, /data-loading-label/);
  assert.match(page, /data-state="ready"/);
});

test('KIBER-36 robot page documents empty and ready states without hiding them from assistive tech', async () => {
  const page = await readFile(resolve(root, 'src/pages/robots/[slug].astro'), 'utf8');
  assert.match(page, /data-state="ready"/);
  assert.match(page, /data-state="empty"/);
  assert.match(page, /aria-live="polite"/);
  assert.match(page, /Нет дополнительных материалов/i);
});

test('KIBER-36 keeps a global keyboard focus-visible style', async () => {
  const layout = await readFile(resolve(root, 'src/styles/layout.css'), 'utf8');
  assert.match(layout, /:where\(a, button/);
  assert.match(layout, /:focus-visible/);
});
