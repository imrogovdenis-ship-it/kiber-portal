import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';

const root = resolve(import.meta.dirname, '../..');
const read = (path: string) => readFile(resolve(root, path), 'utf8');

test('homepage header keeps logo future-proof and compact desktop controls', async () => {
  const header = await read('src/components/layout/Header.astro');
  const layout = await read('src/styles/layout.css');
  const reference = await read('src/styles/reference-layer.css');

  assert.match(header, /logo\?:\s*\{[^}]*src\?:\s*string[^}]*alt\?:\s*string/s);
  assert.match(header, /site-header__logo-mark/);
  assert.match(header, /site-header__logo-text/);
  assert.match(layout, /\.site-header__nav\s*\{[^}]*margin-left:\s*1\.25rem;/s);
  assert.match(reference, /\.site-header__nav\s*\{[^}]*gap:\s*1\.25rem;[^}]*margin-left:\s*0\.5rem;/s);
  assert.match(reference, /\.site-header__cta\s*\{[^}]*min-height:\s*2\.125rem;[^}]*padding:\s*0\.5rem 1\.125rem;/s);
});

test('homepage hero is tighter, less oversized, and does not show hidden-condition stat chips', async () => {
  const page = await read('src/pages/index.astro');
  const hero = await read('src/components/blocks/HomeHero.astro');

  assert.doesNotMatch(page, /скрытых условий/i);
  assert.doesNotMatch(page, /value:\s*'0'/);
  assert.match(hero, /padding:\s*clamp\(1rem,\s*2vw,\s*1\.75rem\)/);
  assert.match(hero, /min-height:\s*34rem;/);
  assert.match(hero, /font-size:\s*clamp\(2\.5rem,\s*5vw,\s*5\.25rem\)/);
  assert.match(hero, /max-width:\s*14ch;/);
  assert.match(hero, /padding:\s*3\.5rem 0 3\.5rem 3\.75rem;/);
});

test('homepage catalog renders a four-card desktop grid with larger real robot images and card-wide links', async () => {
  const page = await read('src/pages/index.astro');
  const card = await read('src/components/blocks/RobotCard.astro');
  const reference = await read('src/styles/reference-layer.css');

  assert.match(page, /homeRobots\s*=\s*getFeaturedHomeRobots\(4\)/);
  assert.match(page, /grid-template-columns:\s*repeat\(4,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(reference, /--kp-reference-container:\s*90rem;/);
  assert.match(reference, /\.container\s*\{[^}]*width:\s*min\(100% - 1rem,\s*var\(--kp-reference-container\)\)/s);
  assert.match(reference, /\.vertical-slice__section\s*\{\s*padding:\s*0;\s*\}/s);
  assert.match(page, /<RobotCard[^>]*hideDisclaimer=\{true\}[^>]*hideLink=\{true\}[^>]*imageLoading="eager"/s);
  assert.doesNotMatch(page, /Не является публичной офертой/);
  assert.match(card, /<a\s+class:list=\{\['robot-card'/s);
  assert.match(card, /aria-label=\{`Открыть карточку робота/);
  assert.match(reference, /robot-card__badge[\s\S]*width:\s*clamp\(2\.625rem,\s*3\.4vw,\s*3\.125rem\)/);
  assert.match(card, /align-items:\s*center;[\s\S]*justify-items:\s*center;/);
});

test('homepage final CTA follows original blue strip, left-aligned white buttons, and reserves right-side mascot space', async () => {
  const cta = await read('src/components/blocks/CtaStrip.astro');

  assert.match(cta, /background:\s*var\(--kp-blue\)/);
  assert.match(cta, /grid-template-columns:\s*minmax\(0,\s*0\.62fr\) minmax\(16rem,\s*0\.38fr\)/);
  assert.match(cta, /cta-strip__art/);
  assert.match(cta, /justify-content:\s*flex-start/);
  assert.match(cta, /background:\s*var\(--kp-white\);\s*color:\s*var\(--kp-ink\)/);
});
