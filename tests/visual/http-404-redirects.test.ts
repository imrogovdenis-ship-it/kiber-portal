import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';

const root = process.cwd();

test('KIBER-29 defines a redirect registry with safe legacy URL decisions', async () => {
  const registryPath = resolve(root, 'data/seo/redirects.json');
  assert.equal(existsSync(registryPath), true, 'redirect registry exists');
  const registry = JSON.parse(await readFile(registryPath, 'utf8'));
  assert.equal(registry.schemaVersion, 1);
  assert.ok(Array.isArray(registry.redirects));
  assert.ok(registry.redirects.length >= 2);
  const froms = new Set();
  for (const redirect of registry.redirects) {
    assert.match(redirect.from, /^\//);
    assert.match(redirect.to, /^\//);
    assert.equal(redirect.status, 301);
    assert.equal(froms.has(redirect.from), false, `${redirect.from} duplicated`);
    froms.add(redirect.from);
  }
  assert.ok(registry.redirects.some((redirect: { from: string }) => redirect.from === '/test-blok/'));
});

test('KIBER-29 nginx serves real 404 and includes registry redirects', async () => {
  const nginx = await readFile(resolve(root, 'nginx.conf'), 'utf8');
  const dockerfile = await readFile(resolve(root, 'Dockerfile'), 'utf8');
  const redirectsConf = await readFile(resolve(root, 'nginx.redirects.conf'), 'utf8');
  assert.match(nginx, /try_files \$uri \$uri\/ \$uri\.html =404;/);
  assert.match(nginx, /error_page 404 \/404\.html;/);
  assert.match(nginx, /absolute_redirect off;/);
  assert.match(nginx, /include \/etc\/nginx\/includes\/redirects\.conf;/);
  assert.match(dockerfile, /COPY nginx\.redirects\.conf \/etc\/nginx\/includes\/redirects\.conf/);
  assert.match(redirectsConf, /location = \/test-blok\//);
  assert.match(redirectsConf, /return 301 \/;/);
});

test('KIBER-29 404 page is noindex and points users back to working routes', async () => {
  const page = await readFile(resolve(root, 'src/pages/404.astro'), 'utf8');
  assert.match(page, /noindex/);
  assert.match(page, /href="\/"/);
  assert.match(page, /Страница не найдена/);
});
