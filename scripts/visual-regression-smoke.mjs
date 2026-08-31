import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const baselinePath = resolve(root, 'docs/review/kiber-35/approved-visual-baseline.json');
const requiredRoutes = ['/', '/robots/unitree-g1/', '/lead/request/?robot=unitree-g1', '/lead/thanks/?robot=unitree-g1', '/404.html'];
const requiredViewports = ['desktop-1440', 'mobile-375'];

function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

assert.equal(existsSync(baselinePath), true, `Missing visual baseline: ${baselinePath}`);
const baseline = JSON.parse(readFileSync(baselinePath, 'utf8'));

assert.equal(baseline.schemaVersion, 1);
assert.equal(baseline.task, 'KIBER-35');
assert.equal(baseline.approvalStatus, 'approved');
assert.match(baseline.approvedPr, /^https:\/\/github\.com\/imrogovdenis-ship-it\/kiber-portal\/pull\/21$/);
assert.match(baseline.approvedMergeCommit, /^[a-f0-9]{40}$/);
assert.deepEqual(baseline.routes, requiredRoutes);
assert.deepEqual(baseline.viewports, requiredViewports);

const expectedKeys = new Set();
for (const route of requiredRoutes) {
  for (const viewport of requiredViewports) expectedKeys.add(`${route}@@${viewport}`);
}

const seenKeys = new Set();
for (const reference of baseline.references) {
  const key = `${reference.route}@@${reference.viewport}`;
  assert.equal(expectedKeys.has(key), true, `Unexpected visual reference ${key}`);
  assert.equal(seenKeys.has(key), false, `Duplicate visual reference ${key}`);
  seenKeys.add(key);

  assert.match(reference.file, /^docs\/review\/kiber-35\/screenshots\/kiber-35-reference-.+\.png$/);
  assert.match(reference.sha256, /^[a-f0-9]{64}$/);
  const filePath = resolve(root, reference.file);
  assert.equal(existsSync(filePath), true, `Missing visual reference file: ${reference.file}`);
  assert.equal(sha256(filePath), reference.sha256, `Visual reference changed without updated approval baseline: ${reference.file}`);
}

assert.deepEqual([...seenKeys].sort(), [...expectedKeys].sort());

console.log(`KIBER-34 visual regression smoke passed: ${baseline.references.length} approved references verified.`);
