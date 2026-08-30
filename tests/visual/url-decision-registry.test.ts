import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';

const root = process.cwd();

test('KIBER-41 records keep merge delete or redirect decision for every production URL', async () => {
  const productionRegistry = JSON.parse(await readFile(resolve(root, 'data/seo/production-url-registry.json'), 'utf8'));
  const decisionPath = resolve(root, 'data/seo/url-decision-registry.json');
  assert.equal(existsSync(decisionPath), true, 'URL decision registry is required');

  const decisions = JSON.parse(await readFile(decisionPath, 'utf8')) as {
    schemaVersion: number;
    issue: string;
    sourceRegistry: string;
    expectedUrlCount: number;
    summary: Record<string, number>;
    decisions: Array<{
      path: string;
      decision: 'keep' | 'merge' | 'delete' | 'redirect' | 'hold';
      status: 'decided' | 'human-gated';
      reason: string;
      target?: string | null;
      titleH1Status: 'aligned' | 'not-applicable' | 'human-review-required';
      productionActionAllowed: boolean;
    }>;
  };

  assert.equal(decisions.schemaVersion, 1);
  assert.equal(decisions.issue, 'KIBER-41');
  assert.equal(decisions.sourceRegistry, 'data/seo/production-url-registry.json');
  assert.equal(decisions.expectedUrlCount, 44);
  assert.equal(decisions.decisions.length, 44);

  const productionPaths = productionRegistry.urls.map((item: { path: string }) => item.path).sort();
  const decisionPaths = decisions.decisions.map((item) => item.path).sort();
  assert.deepEqual(decisionPaths, productionPaths);
  assert.equal(new Set(decisionPaths).size, 44);

  for (const item of decisions.decisions) {
    assert.notEqual(item.decision, undefined, `${item.path}: decision is required`);
    assert.notEqual(item.reason, '', `${item.path}: reason is required`);
    assert.equal(item.productionActionAllowed, false, `${item.path}: production action must remain blocked here`);
    assert.notEqual(item.status, 'unresolved' as never, `${item.path}: no unresolved URLs allowed`);
    if (item.decision === 'redirect') assert.match(item.target ?? '', /^\//);
    if (item.status === 'human-gated') assert.match(item.reason, /owner|content|SEO|approval|production/i);
  }

  assert.equal(decisions.summary.total, 44);
  assert.equal(decisions.summary.unresolved, 0);
  assert.equal(decisions.summary.humanGated, decisions.decisions.filter((item) => item.status === 'human-gated').length);
});

test('KIBER-41 decision registry is referenced by route CI contract', async () => {
  const routeTest = await readFile(resolve(root, 'tests/visual/route-sitemap-contract.test.ts'), 'utf8');
  assert.match(routeTest, /url-decision-registry\.json/);
  assert.match(routeTest, /unresolved/);
});
