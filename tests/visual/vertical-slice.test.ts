import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';

const root = process.cwd();

test('KIBER-33 source exposes Main → Unitree G1 card → lead request → confirmation route', async () => {
  const index = await readFile(resolve(root, 'src/pages/index.astro'), 'utf8');
  assert.match(index, /data-kiber-task="KIBER-33"/);
  assert.match(index, /\/robots\/arenda-unitree-g1\//);
  assert.match(index, /data-vertical-step="home-to-robot"/);

  const robotPage = resolve(root, 'src/pages/robots/[slug].astro');
  assert.equal(existsSync(robotPage), true, 'robot detail route exists');
  const robot = await readFile(robotPage, 'utf8');
  assert.match(robot, /getRobotPages/);
  assert.match(robot, /RobotPageHero/);
  const robotHero = await readFile(resolve(root, 'src/components/blocks/RobotPageHero.astro'), 'utf8');
  const generatedRobots = await readFile(resolve(root, 'src/content/robots.generated.json'), 'utf8');
  assert.match(generatedRobots, /arenda-unitree-g1/);
  assert.match(robotHero, /\/lead\/request\/\?robot=\$\{robot\.slug\}/);
  assert.match(robotHero, /data-vertical-step="robot-to-lead"/);

  const requestPage = await readFile(resolve(root, 'src/pages/lead/request.astro'), 'utf8');
  assert.match(requestPage, /method="post"/);
  assert.match(requestPage, /action="\/api\/leads"/);
  assert.match(requestPage, /name="robot"/);
  assert.match(requestPage, /data-vertical-step="lead-to-confirmation"/);

  const thanksPage = await readFile(resolve(root, 'src/pages/lead/thanks.astro'), 'utf8');
  assert.match(thanksPage, /data-vertical-step="confirmation"/);
  assert.match(thanksPage, /заявка принята/i);
});

test('KIBER-33 lead request source posts to preview-safe /api/leads without enabling live destinations', async () => {
  const requestPage = await readFile(resolve(root, 'src/pages/lead/request.astro'), 'utf8');
  assert.match(requestPage, /method="post"/);
  assert.match(requestPage, /action="\/api\/leads"/);
  assert.match(requestPage, /data-state="preview-dry-run"/);
});
