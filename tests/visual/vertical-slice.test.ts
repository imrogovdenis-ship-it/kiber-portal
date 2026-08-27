import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';

const root = process.cwd();

test('KIBER-33 source exposes Main → Unitree G1 card → lead request → confirmation route', async () => {
  const index = await readFile(resolve(root, 'src/pages/index.astro'), 'utf8');
  assert.match(index, /data-kiber-task="KIBER-33"/);
  assert.match(index, /\/robots\/unitree-g1\//);
  assert.match(index, /data-vertical-step="home-to-robot"/);

  const robotPage = resolve(root, 'src/pages/robots/[slug].astro');
  assert.equal(existsSync(robotPage), true, 'robot detail route exists');
  const robot = await readFile(robotPage, 'utf8');
  assert.match(robot, /getStaticPaths/);
  assert.match(robot, /unitree-g1/);
  assert.match(robot, /\/lead\/request\/\?robot=\$\{robot\.slug\}/);
  assert.match(robot, /data-vertical-step="robot-to-lead"/);

  const requestPage = await readFile(resolve(root, 'src/pages/lead/request.astro'), 'utf8');
  assert.match(requestPage, /method="post"/);
  assert.match(requestPage, /data-routing="telegram-and-amocrm"/);
  assert.match(requestPage, /name="robot"/);
  assert.match(requestPage, /data-vertical-step="lead-to-callback"/);

  const thanksPage = await readFile(resolve(root, 'src/pages/lead/thanks.astro'), 'utf8');
  assert.match(thanksPage, /data-vertical-step="confirmation"/);
  assert.match(thanksPage, /заявка принята/i);
});

test('KIBER-33 lead request source stays safe-gated until real routing is configured', async () => {
  const requestPage = await readFile(resolve(root, 'src/pages/lead/request.astro'), 'utf8');
  assert.match(requestPage, /method="post"/);
  assert.match(requestPage, /leadFormEnabled/);
  assert.match(requestPage, /disabled={!leadFormEnabled}/);
  assert.match(requestPage, /leadFormEndpoint/);
});
