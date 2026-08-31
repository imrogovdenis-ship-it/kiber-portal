import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';

const root = process.cwd();

test('KIBER-21 nginx enables gzip compression for text assets', async () => {
  const nginx = await readFile(resolve(root, 'nginx.conf'), 'utf8');
  assert.match(nginx, /gzip on;/);
  assert.match(nginx, /gzip_vary on;/);
  assert.match(nginx, /gzip_types[\s\S]*text\/css[\s\S]*application\/javascript[\s\S]*application\/json/);
});

test('KIBER-21 nginx sets security headers on every response', async () => {
  const nginx = await readFile(resolve(root, 'nginx.conf'), 'utf8');
  for (const header of [
    'Strict-Transport-Security',
    'Content-Security-Policy',
    'X-Content-Type-Options',
    'Referrer-Policy',
    'Permissions-Policy',
  ]) {
    assert.match(nginx, new RegExp(`add_header ${header}`));
    assert.match(nginx, new RegExp(`add_header ${header}[\\s\\S]*always;`));
  }
});

test('KIBER-21 nginx separates HTML no-cache from immutable asset cache', async () => {
  const nginx = await readFile(resolve(root, 'nginx.conf'), 'utf8');
  assert.match(nginx, /location ~\* \\\.\(\?:html\)\$/);
  assert.match(nginx, /Cache-Control "no-cache" always/);
  assert.match(nginx, /location ~\* \\.\(\?:css\|js\|svg\|webp\|avif\|woff2\)\$/);
  assert.match(nginx, /Cache-Control "public, max-age=604800, immutable" always/);
});
