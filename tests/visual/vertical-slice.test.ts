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
  assert.match(robot, /RobotCardTemplate/);
  const robotHero = await readFile(resolve(root, 'src/components/templates/RobotCardTemplate.astro'), 'utf8');
  const generatedRobots = await readFile(resolve(root, 'src/content/robots.generated.json'), 'utf8');
  assert.match(generatedRobots, /arenda-unitree-g1/);
  assert.match(robotHero, /\/lead\/request\/\?robot=\$\{robotSlug\}/);
  assert.match(robotHero, /href=\{leadHref\}/);

  const requestPage = await readFile(resolve(root, 'src/pages/lead/request.astro'), 'utf8');
  assert.match(await readFile(resolve(root, 'src/components/layout/ContactLeadFormPopup.astro'), 'utf8'), /name="robot"/);
  assert.match(requestPage, /data-vertical-step="lead-to-contacts"/);

  const thanksPage = await readFile(resolve(root, 'src/pages/lead/thanks.astro'), 'utf8');
  assert.match(thanksPage, /data-vertical-step="confirmation"/);
  assert.match(thanksPage, /data-lead-thanks-message/);
});

test('KIBER-33/KIBER-38 lead request source stays preview-safe and exposes working contacts while routing is disabled', async () => {
  const requestPage = await readFile(resolve(root, 'src/pages/lead/request.astro'), 'utf8');
  assert.match(await readFile(resolve(root, 'src/components/layout/ContactLeadFormPopup.astro'), 'utf8'), /<form[\s\S]*method="post"[\s\S]*action=\{formAction\}[\s\S]*>/);
  assert.match(await readFile(resolve(root, 'src/components/layout/ContactLeadFormPopup.astro'), 'utf8'), /name="privacy_consent"/);
  assert.match(await readFile(resolve(root, 'src/components/layout/ContactLeadFormPopup.astro'), 'utf8'), /\/privacy-policy\//);
  assert.match(await readFile(resolve(root, 'src/components/layout/ContactLeadFormPopup.astro'), 'utf8'), /\/consent\//);
  assert.match(requestPage, /siteConfig\.telegram/);
  assert.match(requestPage, /siteConfig\.whatsapp/);
  assert.match(requestPage, /siteConfig\.max/);
});

test('audit shared form stays preview-safe at runtime', async () => {
  const page = await readFile(resolve(root, 'src/pages/lead/request.astro'), 'utf8');
  const script = await readFile(resolve(root, 'public/scripts/contact-lead-form-popup.js'), 'utf8');
  assert.match(page, /data-lead-form-popup-trigger/);
  assert.match(script, /form.dataset.leadFormLive !== 'true'/);
  assert.match(script, /window.location.hostname/);
});
