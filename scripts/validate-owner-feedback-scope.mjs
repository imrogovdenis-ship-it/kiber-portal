#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const args = process.argv.slice(2);
const manifestIndex = args.indexOf('--manifest');
assert.ok(manifestIndex >= 0 && args[manifestIndex + 1], 'usage: --manifest <scope.json> [--changed-files a,b]');
const manifest = JSON.parse(readFileSync(resolve(process.cwd(), args[manifestIndex + 1]), 'utf8'));
assert.equal(manifest.schemaVersion, 1);
assert.ok(manifest.scopeStatement);
assert.match(manifest.approvedReference, /^\/preview\//, 'scope lock: approvedReference must be a preview route');
assert.ok(Array.isArray(manifest.protectedElements) && manifest.protectedElements.length > 0, 'scope lock: protectedElements required');
assert.ok(Array.isArray(manifest.allowedFiles) && manifest.allowedFiles.length > 0);
assert.ok(Array.isArray(manifest.requiredChecks) && manifest.requiredChecks.length > 0);
assert.match(manifest.reviewUrl, /^https:\/\//);

const changedIndex = args.indexOf('--changed-files');
let changed;
if (changedIndex >= 0) {
  changed = args[changedIndex + 1].split(',').filter(Boolean);
} else {
  const committed = execFileSync('git', ['diff', '--name-only', `${manifest.baseRef}...HEAD`], { encoding: 'utf8' });
  const working = execFileSync('git', ['diff', '--name-only'], { encoding: 'utf8' });
  const staged = execFileSync('git', ['diff', '--cached', '--name-only'], { encoding: 'utf8' });
  const untracked = manifest.allowUntracked ? '' : execFileSync('git', ['ls-files', '--others', '--exclude-standard'], { encoding: 'utf8' });
  changed = [...new Set(`${committed}\n${working}\n${staged}\n${untracked}`.split(/\s+/).filter(Boolean))];
}
const allowed = new Set(manifest.allowedFiles);
const forbidden = new Set(manifest.forbiddenFiles ?? []);
const unexpected = changed.filter((path) => !allowed.has(path));
const forbiddenChanged = changed.filter((path) => forbidden.has(path));
assert.deepEqual(forbiddenChanged, [], `scope lock: forbidden files changed: ${forbiddenChanged.join(', ')}`);
assert.deepEqual(unexpected, [], `scope lock: unexpected files changed: ${unexpected.join(', ')}`);
console.log(`Owner-feedback scope lock passed: ${changed.length} changed file(s), ${manifest.requiredChecks.length} required check(s).`);
