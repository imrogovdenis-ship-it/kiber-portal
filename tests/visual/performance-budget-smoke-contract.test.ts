import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';

const root = process.cwd();

test('KIBER-39 defines Core Web Vitals targets and static performance budgets', async () => {
  const budgetPath = resolve(root, 'docs/review/kiber-39/performance-budget.json');
  assert.equal(existsSync(budgetPath), true, 'performance budget config is required');

  const budget = JSON.parse(await readFile(budgetPath, 'utf8'));
  assert.deepEqual(budget.coreWebVitalsTargets, {
    lcpMs: 2500,
    inpMs: 200,
    cls: 0.1,
  });
  assert.ok(Array.isArray(budget.routes));
  assert.ok(budget.routes.includes('/'));
  assert.ok(budget.routes.includes('/robots/unitree-g1/'));
  assert.ok(budget.routes.includes('/lead/request/'));
  assert.ok(budget.routes.includes('/lead/thanks/'));
  assert.ok(budget.staticBudgets.htmlBytes <= 100_000);
  assert.ok(budget.staticBudgets.cssBytes <= 140_000);
  assert.ok(budget.staticBudgets.jsBytes <= 25_000);
  assert.ok(budget.staticBudgets.totalPageBytes <= 250_000);
});

test('KIBER-39 exposes performance smoke as an npm CI gate', async () => {
  const scriptPath = resolve(root, 'scripts/performance-budget-smoke.mjs');
  assert.equal(existsSync(scriptPath), true, 'performance smoke script is required');

  const script = await readFile(scriptPath, 'utf8');
  assert.match(script, /LCP/i);
  assert.match(script, /INP/i);
  assert.match(script, /CLS/i);
  assert.match(script, /totalPageBytes/);
  assert.match(script, /layout-shift/i);

  const packageJson = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
  assert.equal(packageJson.scripts['test:performance'], 'node scripts/performance-budget-smoke.mjs');
  assert.match(packageJson.scripts.ci, /test:performance/);
});
