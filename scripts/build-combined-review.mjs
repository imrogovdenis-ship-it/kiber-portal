#!/usr/bin/env node
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const mergeCommandLabel = 'git merge --no-edit';
const args = process.argv.slice(2);
const manifestIndex = args.indexOf('--manifest');
assert.ok(manifestIndex >= 0 && args[manifestIndex + 1], 'usage: --manifest <combined-review.json> [--plan]');
const manifestPath = resolve(process.cwd(), args[manifestIndex + 1]);
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
assert.equal(manifest.conflictPolicy, 'fail_do_not_reconcile');
assert.equal(manifest.requireCleanWorktree, true);
assert.equal(manifest.requireUniqueBlockIds, true);
assert.equal(manifest.deploy, false, 'combined builder must never deploy automatically');
assert.ok(manifest.postMergeCommands.includes('npm run test:approved-contracts'));
assert.ok(manifest.postMergeCommands.includes('npm run build:preview'));
if (args.includes('--plan')) {
  console.log(JSON.stringify({ status: 'valid_plan', mergeCommandLabel, branches: manifest.branches, deploy: false }, null, 2));
  process.exit(0);
}
const status = execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8' }).trim();
assert.equal(status, '', 'combined review requires a clean source worktree');
const worktree = mkdtempSync(join(tmpdir(), 'kiber-combined-review-'));
try {
  execFileSync('git', ['worktree', 'add', '--detach', worktree, manifest.baseRef], { stdio: 'inherit' });
  for (const branch of manifest.branches) {
    try {
      execFileSync('git', ['-C', worktree, 'merge', '--no-edit', branch], { stdio: 'inherit' });
    } catch (error) {
      try { execFileSync('git', ['-C', worktree, 'merge', '--abort']); } catch {}
      throw new Error(`Combined review conflict in ${branch}; policy fail_do_not_reconcile. Rebase branches or extract shared changes into a base PR.`, { cause: error });
    }
  }
  for (const command of manifest.postMergeCommands) execFileSync('bash', ['-lc', command], { cwd: worktree, stdio: 'inherit' });
  console.log(`Combined review verified conflict-free in ${worktree}. Deployment is intentionally disabled.`);
} finally {
  try { execFileSync('git', ['worktree', 'remove', '--force', worktree]); } catch { rmSync(worktree, { recursive: true, force: true }); }
}
