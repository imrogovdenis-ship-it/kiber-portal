import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';

const root = process.cwd();

const checkedFiles = [
  'src/components/blocks/HomeHero.astro',
  'src/components/blocks/CtaStrip.astro',
  'src/components/blocks/LeadForm.astro',
  'src/components/blocks/Faq.astro',
  'src/components/blocks/Pricing.astro',
];

test('KIBER-35 controls do not contain corrupted px-to-rem sizing artifacts', async () => {
  for (const file of checkedFiles) {
    const source = await readFile(resolve(root, file), 'utf8');
    assert.doesNotMatch(source, /40\.25rem/, `${file} must not use corrupted 40.25rem control height`);
    assert.doesNotMatch(source, /20\.25rem/, `${file} must not use corrupted 20.25rem card radius`);
    assert.doesNotMatch(source, /10\.25rem/, `${file} must not use corrupted 10.25rem input radius`);
  }
});

test('KIBER-35 primary CTA controls keep normal pill height', async () => {
  const homeHero = await readFile(resolve(root, 'src/components/blocks/HomeHero.astro'), 'utf8');
  const ctaStrip = await readFile(resolve(root, 'src/components/blocks/CtaStrip.astro'), 'utf8');
  const leadForm = await readFile(resolve(root, 'src/components/blocks/LeadForm.astro'), 'utf8');

  assert.match(homeHero, /\.home-hero__button[\s\S]*min-height: 2\.75rem;/);
  assert.match(ctaStrip, /\.cta-strip__button[\s\S]*min-height: 2\.75rem;/);
  assert.match(leadForm, /\.lead-form button[\s\S]*min-height: 2\.75rem;/);
});
