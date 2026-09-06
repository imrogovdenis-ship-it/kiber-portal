import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path: string) => readFileSync(path, 'utf8');
const json = (path: string) => JSON.parse(read(path));

const registryPath = 'data/models/robot-capability-images.source.json';
const docsPath = 'docs/review/kiber-94-robot-card-preview/original-capability-images.md';
const robotsPath = 'data/models/robots.source-of-truth.json';

test('original robot capability image registry records the separate six-image Что умеет block for all 24 robots', () => {
  assert.equal(existsSync(registryPath), true, `${registryPath} must exist`);
  assert.equal(existsSync(docsPath), true, `${docsPath} must exist`);

  const registry = json(registryPath);
  const robots = json(robotsPath).robots;
  const robotSlugs = new Set(robots.map((robot: { slug: string }) => robot.slug));

  assert.equal(registry.schemaVersion, 1);
  assert.equal(registry.source, 'original published kiber-portal.ru site-export');
  assert.equal(registry.purpose, 'special capability illustrations for the robot card Что умеет / ключевые возможности block');
  assert.equal(registry.summary.robots, 24);
  assert.equal(registry.summary.imagesPerRobot, 6);
  assert.equal(registry.summary.totalCapabilityImages, 144);
  assert.equal(registry.rules.keepSeparateFromHeroCatalogAndPhotoGalleries, true);
  assert.equal(registry.rules.targetBlockId, 'capabilities');
  assert.match(registry.rules.doNotUseInBlocks.join(' '), /gallery/);
  assert.match(registry.rules.doNotUseInBlocks.join(' '), /robotInAction/);

  assert.equal(registry.robots.length, 24);
  for (const robot of registry.robots) {
    assert(robotSlugs.has(robot.slug), `${robot.slug} must match robots source-of-truth`);
    assert.match(robot.sourceHtml, /^site-export\/page\d+\.html$/);
    assert.match(robot.sourceBodyHtml, /^site-export\/files\/page\d+body\.html$/);
    assert.equal(robot.blockSource.headingIncludes, 'Что умеет');
    assert.equal(robot.images.length, 6, `${robot.slug} must keep exactly six capability images`);

    for (const [index, image] of robot.images.entries()) {
      assert.equal(image.index, index + 1);
      assert.equal(image.role, 'capability_illustration');
      assert.equal(image.targetBlockId, 'capabilities');
      assert.match(image.mediaId, new RegExp(`^${robot.slug}__capability_0${index + 1}$`));
      assert.match(image.originalSrc, /^images\/tild.+\.(png|jpg|jpeg|webp|svg)$/i);
      assert.match(image.originalProjectPath, /^site-export\/images\//);
      assert.match(image.publicSrc, new RegExp(`^/images/robot-capabilities/${robot.slug}/0${index + 1}-.+\\.(png|jpg|jpeg|webp|svg)$`, 'i'));
      assert.match(image.projectPath, new RegExp(`^public/images/robot-capabilities/${robot.slug}/0${index + 1}-.+\\.(png|jpg|jpeg|webp|svg)$`, 'i'));
      assert.equal(existsSync(image.projectPath), true, `${image.projectPath} must be copied into the repo`);
      assert.equal(typeof image.sourceAlt, 'string');
      assert(image.sourceAlt.length > 5, `${image.mediaId} must preserve original aria/source alt`);
      assert.equal(typeof image.actualDescription, 'string');
      assert(image.actualDescription.length > 5, `${image.mediaId} must have factual description seed`);
      assert.equal(typeof image.seoAlt, 'string');
      assert(image.seoAlt.length > image.actualDescription.length, `${image.mediaId} must have SEO-aware alt layer`);
      assert.equal(typeof image.caption, 'string');
      assert(image.caption.length > 5, `${image.mediaId} must have caption`);
      assert.equal(image.reviewStatus, 'owner_confirmed_as_capability_block_source');
      assert.equal(image.productionApproved, false, 'registry records source mapping only; production approval remains separately gated');
    }
  }

  const docs = read(docsPath);
  assert.match(docs, /144 special capability images/);
  assert.match(docs, /do not mix them into `gallery` or `robotInAction`/);
  assert.match(docs, /Unitree G1/);
});
