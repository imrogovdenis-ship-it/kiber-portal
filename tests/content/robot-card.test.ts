import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';
import YAML from 'yaml';
import { fixtureSchema } from '../../design-system/schemas/fixture.schema';
import { robotSchema } from '../../src/content/schemas';

const root = resolve(import.meta.dirname, '../..');

test('pilot robot enforces the commercial service rules', async () => {
  const robot = robotSchema.parse(YAML.parse(await readFile(resolve(root, 'src/content/robots/unitree-g1.yaml'), 'utf8')));
  assert.equal(robot.service.specialist_included, true);
  assert.equal(robot.service.standalone_rental, false);
  assert.equal(robot.pricing.public_offer, false);
  assert.equal(robot.pricing.disclaimer, 'Не является публичной офертой');
});

test('every robot-card fixture includes the legal price disclaimer', async () => {
  const names = ['default', 'long-content', 'minimal', 'missing-optional', 'mobile'];
  for (const name of names) {
    const path = resolve(root, `design-system/fixtures/robot-card/${name}.yaml`);
    const fixture = fixtureSchema.parse(YAML.parse(await readFile(path, 'utf8')));
    assert.equal(fixture.data.price_disclaimer, 'Не является публичной офертой');
    if (fixture.data.image) assert.ok(fixture.data.image.alt.length > 0);
  }
});
