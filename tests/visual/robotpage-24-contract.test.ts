import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';

const root = process.cwd();
const robotsSourcePath = resolve(root, 'data/models/robots.source-of-truth.json');
const robotPagePath = resolve(root, 'src/pages/robots/[slug].astro');
const generatedContentPath = resolve(root, 'src/content/robots.generated.json');
const smokePath = resolve(root, 'scripts/robotpage-24-smoke.mjs');

function readJson(path: string) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

test('KIBER-45 imports the 24-robot source of truth into the controlled rebuild', () => {
  assert.equal(existsSync(robotsSourcePath), true, 'robots source-of-truth dataset is required');
  assert.equal(existsSync(generatedContentPath), true, 'generated Astro robot content registry is required');

  const source = readJson(robotsSourcePath);
  const generated = readJson(generatedContentPath);

  assert.equal(source.count, 24, 'source-of-truth should contain 24 robots');
  assert.equal(source.robots.length, 24, 'source-of-truth robot count mismatch');
  assert.equal(generated.robots.length, 24, 'generated content should contain 24 robots');

  const sourceSlugs = new Set(source.robots.map((robot: { slug: string }) => robot.slug));
  assert.equal(sourceSlugs.size, 24, 'robot slugs must be unique');
  assert.deepEqual(new Set(generated.robots.map((robot: { slug: string }) => robot.slug)), sourceSlugs);

  for (const robot of generated.robots) {
    assert.match(robot.slug, /^arenda-[a-z0-9-]+$/, `${robot.slug}: must use canonical production slug`);
    assert.equal(robot.route, `/robots/${robot.slug}/`, `${robot.slug}: controlled rebuild route must use unified /robots/[slug]/ route`);
    assert.equal(robot.status, 'review', `${robot.slug}: imported content remains review status until acceptance`);
    assert.ok(robot.identity.name.length > 0, `${robot.slug}: identity required`);
    assert.ok(robot.seo.title.includes('КИБЕР ПОРТАЛ'), `${robot.slug}: SEO title must keep brand`);
    assert.ok(robot.pricing.disclaimer === 'Не является публичной офертой', `${robot.slug}: pricing disclaimer required`);
  }
});

test('KIBER-45 keeps one unified RobotPage template and exposes rendered validation as CI gate', () => {
  assert.equal(existsSync(robotPagePath), true, 'unified robot page route is required');
  assert.equal(existsSync(smokePath), true, 'rendered 24 robot page smoke is required');

  const robotPage = readFileSync(robotPagePath, 'utf8');
  assert.match(robotPage, /getRobotPages\(/, 'RobotPage should consume normalized generated robot records');
  assert.doesNotMatch(robotPage, /isUnitree/, 'template must not special-case Unitree G1');
  assert.match(robotPage, /data-kiber-task="KIBER-45"/);
  assert.match(robotPage, /data-robot-slug=\{robot\.slug\}/);

  const pkg = readJson(resolve(root, 'package.json'));
  assert.equal(pkg.scripts['test:robotpage-24'], 'node scripts/robotpage-24-smoke.mjs');
  assert.match(pkg.scripts.ci, /npm run test:robotpage-24/);
});

test('KIBER-45 rendered validation stays in the post-build smoke, not pre-build source tests', async () => {
  const smoke = await readFile(smokePath, 'utf8');
  assert.match(smoke, /dist\/robots/);
  assert.match(smoke, /renderedRobotPages/);
  assert.match(smoke, /Service JSON-LD missing/);
  assert.match(smoke, /BreadcrumbList JSON-LD missing/);
  assert.match(smoke, /review note leaked/);
  assert.match(smoke, /KIBER-50-REVIEW-ONLY-SENTINEL/);
});
