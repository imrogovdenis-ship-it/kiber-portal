import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';

const root = process.cwd();

test('KIBER-22 runtime exposes health and readiness endpoints for Coolify', async () => {
  const dockerfile = await readFile(resolve(root, 'Dockerfile'), 'utf8');
  const nginx = await readFile(resolve(root, 'nginx.conf'), 'utf8');

  assert.match(dockerfile, /HEALTHCHECK[\s\S]+\/healthz\//);
  assert.match(dockerfile, /--interval=30s/);
  assert.match(dockerfile, /--timeout=3s/);
  assert.match(dockerfile, /--retries=3/);

  assert.match(nginx, /location = \/healthz\//);
  assert.match(nginx, /location = \/readyz\//);
  assert.match(nginx, /return 200 "ready\\n"/);
});

test('KIBER-22 documents resource limits and shared-service blast-radius controls', async () => {
  const coolify = await readFile(resolve(root, 'COOLIFY.md'), 'utf8');

  assert.match(coolify, /CPU limit/i);
  assert.match(coolify, /Memory limit/i);
  assert.match(coolify, /0\.50/);
  assert.match(coolify, /512Mi|512M/i);
  assert.match(coolify, /alex-/);
  assert.match(coolify, /shared services|не валит shared services|coolify.*shared/i);
  assert.match(coolify, /\/readyz\//);
});
