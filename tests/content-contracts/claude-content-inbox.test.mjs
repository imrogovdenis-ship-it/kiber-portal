import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const requiredPaths = [
  'data/content-inbox/claude/tasks/.gitkeep',
  'data/content-inbox/claude/packages/.gitkeep',
  'data/content-inbox/claude/rejected/.gitkeep',
  'data/content-inbox/claude/processed/.gitkeep',
  'data/content-inbox/claude/reports/.gitkeep',
  'data/content-inbox/claude/task.schema.json',
  'data/content-inbox/claude/safety-policy.json',
  'data/content-inbox/claude/examples/article-task.example.json',
  'scripts/intake_claude_content_packages.py',
  'scripts/map_claude_package_to_preview.py',
  'docs/content-inbox/claude-github-hermes-workflow.md',
  'docs/content-inbox/CLAUDE_GITHUB_CONTENT_PACKAGE_PROMPT.md',
];

test('Claude content inbox files exist', () => {
  for (const path of requiredPaths) assert.ok(existsSync(path), `${path} should exist`);
});

test('safety policy forbids production and design mutations', () => {
  const policy = JSON.parse(readFileSync('data/content-inbox/claude/safety-policy.json', 'utf8'));
  for (const action of ['production_deploy', 'dns_change', 'secret_change', 'analytics_enable', 'live_lead_routing_enable', 'approved_design_change']) {
    assert.ok(policy.forbiddenActions.includes(action), `missing forbidden action ${action}`);
  }
  assert.ok(policy.publicationBoundary.includes('Publication requires separate human approval'));
});

test('task schema requires owner review and production forbiddenChanges', () => {
  const schema = JSON.parse(readFileSync('data/content-inbox/claude/task.schema.json', 'utf8'));
  assert.equal(schema.properties.ownerReviewRequired.const, true);
  assert.equal(schema.properties.forbiddenChanges.contains.const, 'production');
});

test('intake validator dry-run succeeds on empty inbox and writes no publication state', () => {
  const result = spawnSync('python3', ['scripts/intake_claude_content_packages.py', '--dry-run'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const report = JSON.parse(result.stdout);
  assert.equal(report.publicationAllowed, false);
  assert.equal(report.requiresOwnerReview, true);
  assert.equal(report.invalid, 0);
});
