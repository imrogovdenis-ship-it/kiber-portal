import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { relative, resolve } from 'node:path';
import test from 'node:test';

const root = process.cwd();
const publicPageFiles = [
  'src/pages/index.astro',
  'src/pages/robots/[slug].astro',
  'src/pages/lead/request.astro',
  'src/pages/lead/thanks.astro',
  'src/pages/404.astro',
];

const forbidden = [
  /github/i,
  /миграц/i,
  /будущ/i,
  /future/i,
  /preview-safe/i,
  /production/i,
  /\bapi\b/i,
  /legal/i,
  /consent/i,
  /runtime/i,
  /техническ/i,
  /интеграц/i,
];

test('KIBER-37 public pages avoid internal technical project wording', async () => {
  const violations = [];
  for (const file of publicPageFiles) {
    const raw = await readFile(resolve(root, file), 'utf8');
    const text = raw.replace(/action="\/api\/leads"/g, 'action="/lead-endpoint"');
    for (const pattern of forbidden) {
      if (pattern.test(text)) violations.push(`${relative(root, file)} matches ${pattern}`);
    }
  }
  assert.deepEqual(violations, []);
});
