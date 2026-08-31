import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';

const root = process.cwd();

test('KIBER-50 content schema separates review notes from public fields', async () => {
  const schema = await readFile(resolve(root, 'src/content/schemas.ts'), 'utf8');
  assert.match(schema, /reviewOnlySchema/);
  assert.match(schema, /internalNotes/);
  assert.match(schema, /publicRender:\s*z\.literal\(false\)/);
  assert.match(schema, /review:\s*reviewOnlySchema\.optional\(\)/);
});

test('KIBER-50 fixture keeps a review-only sentinel that must never render publicly', async () => {
  const robot = await readFile(resolve(root, 'src/content/robots/unitree-g1.yaml'), 'utf8');
  assert.match(robot, /review:/);
  assert.match(robot, /publicRender:\s*false/);
  assert.match(robot, /KIBER-50-REVIEW-ONLY-SENTINEL/);
});

test('KIBER-50 exposes production review-note isolation as a CI gate', async () => {
  const scriptPath = resolve(root, 'scripts/review-notes-isolation-smoke.mjs');
  assert.equal(existsSync(scriptPath), true, 'review notes isolation smoke script is required');
  const script = await readFile(scriptPath, 'utf8');
  assert.match(script, /KIBER-50/);
  assert.match(script, /dist/);
  assert.match(script, /internalNotes/);
  assert.match(script, /KIBER-50-REVIEW-ONLY-SENTINEL/);

  const packageJson = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
  assert.equal(packageJson.scripts['test:review-notes'], 'node scripts/review-notes-isolation-smoke.mjs');
  assert.match(packageJson.scripts.ci, /npm run test:review-notes/);
});
