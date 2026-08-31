import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';
import YAML from 'yaml';
import { blockSchema } from '../../design-system/schemas/block.schema';

const root = resolve(import.meta.dirname, '../..');

test('Robot Card covers the four review viewports and latest mobile grid', async () => {
  const spec = blockSchema.parse(YAML.parse(await readFile(resolve(root, 'design-system/blocks/05-robot-card.yaml'), 'utf8')));
  assert.deepEqual(Object.keys(spec.responsive), ['sm', 'md', 'lg', 'xl']);
  assert.deepEqual([
    spec.responsive.sm.columns,
    spec.responsive.md.columns,
    spec.responsive.lg.columns,
    spec.responsive.xl.columns,
  ], [2, 2, 3, 4]);
  assert.deepEqual(spec.fixtures, ['default', 'long-content', 'minimal', 'missing-optional', 'mobile']);

  const preview = await readFile(resolve(root, 'src/pages/preview/[...path].astro'), 'utf8');
  assert.match(preview, /grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(preview, /min-width: 60em[\s\S]*grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(preview, /min-width: 75em[\s\S]*grid-template-columns: repeat\(4, minmax\(0, 1fr\)\)/);
});

test('design-review is noindex and excluded from production', async () => {
  const preview = await readFile(resolve(root, 'src/pages/preview/[...path].astro'), 'utf8');
  const nginx = await readFile(resolve(root, 'nginx.conf'), 'utf8');
  assert.match(preview, /noindex/);
  assert.match(preview, /DEPLOY_ENV !== 'production'/);
  assert.match(nginx, /X-Robots-Tag "noindex, nofollow"/);
});
