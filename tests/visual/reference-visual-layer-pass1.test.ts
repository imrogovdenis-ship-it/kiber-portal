import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const root = process.cwd();
const refLayerPath = resolve(root, 'src/styles/reference-layer.css');
const baseLayoutPath = resolve(root, 'src/layouts/BaseLayout.astro');
const homeHeroPath = resolve(root, 'src/components/blocks/HomeHero.astro');
const robotHeroPath = resolve(root, 'src/components/blocks/RobotPageHero.astro');
const robotPagePath = resolve(root, 'src/pages/robots/[slug].astro');
const indexPath = resolve(root, 'src/pages/index.astro');
const registryPath = resolve(root, 'data/review/reference-visual-layer-pass1.json');
const smokePath = resolve(root, 'scripts/reference-visual-layer-smoke.mjs');

function text(path: string) {
  return readFileSync(path, 'utf8');
}
function json(path: string) {
  return JSON.parse(text(path));
}

test('KIBER-88 records reference visual layer scope and protects prior foundation', () => {
  assert.equal(existsSync(registryPath), true, 'KIBER-88 registry is required');
  const registry = json(registryPath);
  assert.equal(registry.issue, 'KIBER-88');
  assert.deepEqual(registry.sources, ['docs/source/reference-desktop-v9.html', 'docs/source/reference-mobile-v3.html']);
  assert.equal(registry.strategy.rawHtmlCopiedIntoRuntime, false);
  assert.equal(registry.strategy.priorSeoContentRuntimeFoundationPreserved, true);
  assert.equal(registry.safety.productionDeployChanged, false);
  assert.ok(registry.pass1Blocks.includes('02-home-hero'));
  assert.ok(registry.pass1Blocks.includes('05-robot-card'));
  assert.ok(registry.pass1Blocks.includes('11-robot-hero'));
});

test('KIBER-88 imports a reference-layer CSS file with core reference primitives', () => {
  assert.equal(existsSync(refLayerPath), true, 'src/styles/reference-layer.css is required');
  const css = text(refLayerPath);
  assert.match(css, /--kp-reference-blue:\s*var\(--kp-blue\)/);
  assert.match(css, /--kp-reference-blue-deep:\s*var\(--kp-blue-deep\)/);
  assert.match(css, /--kp-reference-sky:\s*var\(--kp-sky\)/);
  assert.match(css, /--kp-reference-ink-dark:\s*var\(--kp-ink\)/);
  assert.match(css, /--kp-reference-container:\s*90rem/i);
  assert.match(css, /--kp-reference-small-gap-xl:\s*2\.25rem/i);
  assert.match(css, /--kp-reference-small-gap-lg:\s*1\.5rem/i);
  assert.match(css, /--kp-reference-small-gap-md:\s*1rem/i);
  assert.match(css, /--kp-reference-small-gap-sm:\s*0\.625rem/i);
  assert.match(css, /\.home-hero__card/);
  assert.match(css, /\.robot-page__hero/);
  assert.match(css, /\.robot-card__badge/);
  assert.match(css, /min-width:\s*20rem/);
  assert.doesNotMatch(css, /min-width:\s*31\.25rem/);
  assert.match(css, /object-fit:\s*contain/);
  assert.doesNotMatch(css, /\.robot-page__media\s*\{[^}]*aspect-ratio:\s*16\s*\/\s*9/s);
  assert.match(css, /\.robot-page__media\s*\{[^}]*aspect-ratio:\s*1/s);

  const baseLayout = text(baseLayoutPath);
  assert.match(baseLayout, /\.\.\/styles\/reference-layer\.css/);
});

test('KIBER-88 home hero and robot page expose reference-compatible structure', () => {
  const hero = text(homeHeroPath);
  assert.match(hero, /home-hero__card/);
  assert.match(hero, /home-hero__image/);
  assert.match(hero, /home-hero__content/);
  assert.match(hero, /aspect-ratio:\s*16\s*\/\s*9/);
  assert.match(hero, /object-fit:\s*contain/);
  assert.match(hero, /data-rv="02"/);

  const index = text(indexPath);
  assert.match(index, /image:\s*\{/);
  assert.match(index, /\/images\/home\/home-header-robot-owner-20260830\.webp/);
  assert.match(index, /vertical-slice__card-grid/);

  const robotPage = text(robotPagePath);
  assert.match(robotPage, /RobotPageHero/);

  const robotHero = text(robotHeroPath);
  assert.match(robotHero, /robot-page__price/);
  assert.match(robotHero, /robot-page__media/);
  assert.match(robotHero, /data-rv="11"/);
  assert.match(robotHero, /aspect-ratio:\s*1/);
  assert.match(robotHero, /object-fit:\s*contain/);
});

test('KIBER-88 exposes rendered reference visual layer smoke as CI gate', () => {
  assert.equal(existsSync(smokePath), true, 'reference visual layer smoke is required');
  const smoke = text(smokePath);
  assert.match(smoke, /reference-layer/);
  assert.match(smoke, /home-hero__card/);
  assert.match(smoke, /robot-page__hero/);
  assert.match(smoke, /productionDeployChanged/);

  const pkg = json(resolve(root, 'package.json'));
  assert.equal(pkg.scripts['test:reference-visual-layer'], 'node scripts/reference-visual-layer-smoke.mjs');
  assert.match(pkg.scripts.ci, /npm run test:reference-visual-layer/);
});
