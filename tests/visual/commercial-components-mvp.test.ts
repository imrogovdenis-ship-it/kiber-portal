import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';
import YAML from 'yaml';
import { blockSchema } from '../../design-system/schemas/block.schema';

const root = resolve(import.meta.dirname, '../..');

const requiredBlocks = [
  { id: 'home-hero', reviewId: '02', component: 'src/components/blocks/HomeHero.astro', className: 'home-hero' },
  { id: 'faq', reviewId: '07', component: 'src/components/blocks/Faq.astro', className: 'faq' },
  { id: 'cta-strip', reviewId: '09', component: 'src/components/blocks/CtaStrip.astro', className: 'cta-strip' },
  { id: 'pricing', reviewId: '15', component: 'src/components/blocks/Pricing.astro', className: 'robot-pricing' },
  { id: 'lead-form', reviewId: '31', component: 'src/components/blocks/LeadForm.astro', className: 'lead-form' },
];

async function readBlock(id: string) {
  return blockSchema.parse(YAML.parse(await readFile(resolve(root, `design-system/blocks/${id}.yaml`), 'utf8')));
}

test('KIBER-32 registers Hero, Pricing, FAQ, CTA and Form MVP blocks from the approved legend', async () => {
  for (const expected of requiredBlocks) {
    const spec = await readBlock(expected.id);
    assert.equal(spec.id, expected.id);
    assert.equal(spec.review_id, expected.reviewId);
    assert.equal(spec.status, 'pilot');
    assert.equal(spec.component, expected.component);
    assert.deepEqual(spec.fixtures, ['default', 'long-content', 'minimal', 'missing-optional', 'mobile']);
    assert.deepEqual(Object.keys(spec.responsive), ['sm', 'md', 'lg', 'xl']);
    assert.equal(spec.accessibility.focus_visible, true);
    assert.ok(spec.content_contract.required.length > 0);
    assert.ok(spec.traceability.some((entry) => entry.source === 'docs/source/reference-desktop-v9.html' && entry.locator.includes(expected.className)));
    assert.ok(spec.traceability.some((entry) => entry.source === 'docs/source/reference-mobile-v3.html' && entry.locator.includes(expected.className)));
  }
});

test('KIBER-32 preview renders all commercial MVP review components and the RobotCard grid', async () => {
  const preview = await readFile(resolve(root, 'src/pages/preview/[...path].astro'), 'utf8');
  assert.match(preview, /data-kiber-task="KIBER-32"/);
  assert.match(preview, /id: 'robot-card'/);
  assert.match(preview, /fixture\.block_id === id/);
  assert.match(preview, /review__grid/);
  for (const expected of requiredBlocks) {
    const componentName = expected.component.split('/').pop()!.replace('.astro', '');
    assert.match(preview, new RegExp(`components/blocks/${componentName}\\.astro`));
    assert.match(preview, new RegExp(`id: '${expected.id}'`));
  }
});
