import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';
import YAML from 'yaml';
import { blockSchema } from '../../design-system/schemas/block.schema';

const root = resolve(import.meta.dirname, '../..');

async function readText(path: string) {
  return readFile(resolve(root, path), 'utf8');
}

test('pricing block contract requires the legal disclaimer to stay attached to every commercial price', async () => {
  const block = blockSchema.parse(YAML.parse(await readText('design-system/blocks/pricing.yaml')));

  assert.ok(
    block.content_contract.rules.some((rule) =>
      rule.includes('legal disclaimer remains programmatically attached to every tariff card'),
    ),
  );
});

test('Pricing component exposes the non-offer disclaimer as a shared description for each tariff card', async () => {
  const component = await readText('src/components/blocks/Pricing.astro');

  assert.match(component, /id="robot-pricing-disclaimer"/);
  assert.match(component, /aria-describedby="robot-pricing-disclaimer"/);
  assert.match(component, /<p class="robot-pricing__disclaimer" id="robot-pricing-disclaimer">\{disclaimer\}<\/p>/);
});
