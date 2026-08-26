import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';

const root = resolve(import.meta.dirname, '../..');

test('Docker image preserves the selected production or preview build mode', async () => {
  const dockerfile = await readFile(resolve(root, 'Dockerfile'), 'utf8');
  const packageJson = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8')) as {
    scripts: Record<string, string>;
  };

  assert.match(dockerfile, /ARG DEPLOY_ENV=production/);
  assert.match(dockerfile, /ARG DESIGN_REVIEW_ENABLED=false/);
  assert.match(dockerfile, /RUN npm run verify && npm run build/);
  assert.doesNotMatch(dockerfile, /RUN npm run ci/);
  assert.equal(packageJson.scripts['build:production'], 'DEPLOY_ENV=production DESIGN_REVIEW_ENABLED=false npm run build');
  assert.equal(packageJson.scripts['build:preview'], 'DEPLOY_ENV=preview DESIGN_REVIEW_ENABLED=true npm run build');
});

test('Coolify contract pins the proxy port and preview build variables', async () => {
  const contract = await readFile(resolve(root, 'COOLIFY.md'), 'utf8');

  assert.match(contract, /Ports Exposes \| `8080`/);
  assert.match(contract, /DEPLOY_ENV.*Build Variable/s);
  assert.match(contract, /DESIGN_REVIEW_ENABLED.*Build Variable/s);
  assert.match(contract, /Load Pull Requests/);
  assert.match(contract, /pr-\{\{pr_id\}\}\.preview\.kiber-portal\.ru/);
});
