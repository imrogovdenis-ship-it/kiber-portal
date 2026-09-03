import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';

const root = resolve(import.meta.dirname, '../..');
const read = (path: string) => readFile(resolve(root, path), 'utf8');

test('homepage renders the original full-page block order through Astro components and data', async () => {
  const page = await read('src/pages/index.astro');
  const data = await read('src/data/home-live.ts');
  const live = JSON.parse(await read('data/design/home-live-blocks.json'));

  assert.deepEqual(live.homeOrder, ['hero', 'kiber_gosha', 'compilations', 'catalog', 'articles', 'faq', 'cta', 'news']);
  assert.match(page, /import HomeGoshaQuote/);
  assert.match(page, /import HomeImageCards/);
  assert.match(page, /import HomeFaqBlock/);
  assert.match(page, /import HomeFinalCta/);
  assert.match(page, /<HomeHero[\s\S]*<HomeGoshaQuote[\s\S]*<HomeImageCards id="compilations"[\s\S]*id="catalog"[\s\S]*<HomeImageCards id="articles"[\s\S]*<HomeFaqBlock[\s\S]*<HomeFinalCta/s);
  assert.match(page, /data-home-parity-pass="full-homepage-lower-blocks"/);
  assert.match(data, /routeFallbacks/);
  assert.doesNotMatch(page, /site-export\/images/);
});

test('home lower blocks use original homepage copy and avoid missing public routes', async () => {
  const [gosha, imageCards, faq, cta, data] = await Promise.all([
    read('src/components/blocks/HomeGoshaQuote.astro'),
    read('src/components/blocks/HomeImageCards.astro'),
    read('src/components/blocks/HomeFaqBlock.astro'),
    read('src/components/blocks/HomeFinalCta.astro'),
    read('src/data/home-live.ts'),
  ]);

  assert.match(gosha, /data-home-block="kiber-gosha"/);
  assert.match(imageCards, /data-home-block=\{id\}/);
  assert.match(faq, /data-home-block="faq"/);
  assert.match(cta, /data-home-block="final-cta"/);
  for (const originalRoute of [
    '/arenda-robotov-na-meropriyatie',
    '/sravnenie-unitree-g1-r1-h2',
    '/neobychnyi-podarok-direktoru-robot',
    '/unitree-g1-ili-agibot-x2',
    '/pozdravlenie-robotom-na-svadbe',
    '/robot-ofitsiant-na-meropriyatii',
    '/velkom-zona-na-svadbe-robot',
  ]) {
    assert.match(data, new RegExp(`'${originalRoute}':`));
  }
  assert.match(data, /export const homeFaq/);
  assert.match(data, /export const homeFinalCta/);
});

test('homepage full parity media is optimized runtime WebP rather than review-only originals', async () => {
  const data = await read('src/data/home-live.ts');
  const matches = [...data.matchAll(/'\/images\/[^']+': '(\/images\/home-live\/[^']+\.webp)'/g)].map((match) => match[1]);
  assert.ok(matches.length >= 10, 'expected migrated home-live images');
  for (const src of matches) {
    const file = resolve(root, 'public', src.slice(1));
    const info = await stat(file);
    assert.ok(info.size <= 200 * 1024, `${src} exceeds runtime image budget`);
  }
  assert.doesNotMatch(data, /site-export\/images/);
});

test('homepage exposes FAQPage JSON-LD from the same home FAQ data source', async () => {
  const page = await read('src/pages/index.astro');
  const seo = await read('src/lib/seo.ts');

  assert.match(page, /faqPageJsonLd\(homeFaq\)/);
  assert.match(seo, /export function faqPageJsonLd/);
  assert.match(seo, /'@type': 'FAQPage'/);
  assert.match(seo, /'@type': 'Question'/);
});

test('homepage owner feedback pass keeps heading style consistent and removes extra popular directions block', async () => {
  const [page, gosha, imageCards, faq, cta, data] = await Promise.all([
    read('src/pages/index.astro'),
    read('src/components/blocks/HomeGoshaQuote.astro'),
    read('src/components/blocks/HomeImageCards.astro'),
    read('src/components/blocks/HomeFaqBlock.astro'),
    read('src/components/blocks/HomeFinalCta.astro'),
    read('src/data/home-live.ts'),
  ]);

  assert.doesNotMatch(page, /InternalLinks/);
  assert.doesNotMatch(page, /Популярные направления/);
  for (const component of [imageCards, faq, cta]) {
    assert.match(component, /font-size:\s*var\(--kp-heading-size\)/);
  }
  assert.doesNotMatch(gosha, /home-gosha__eyebrow/);
  assert.doesNotMatch(gosha, /<h2/);
  for (const component of [imageCards, faq]) {
    assert.match(component, /margin-left:\s*var\(--kp-home-large-offset/);
    assert.match(component, /font-size:\s*var\(--kp-label-size\)/);
  }
  assert.match(data, /Менеджер КИБЕР ПОРТАЛА ответит и подберет роботов по вашему бюджету и дате/);
});

test('homepage owner feedback pass matches requested cards FAQ and CTA behavior', async () => {
  const [imageCards, imageCardsScript, faq, cta] = await Promise.all([
    read('src/components/blocks/HomeImageCards.astro'),
    read('public/scripts/home-image-cards-slider.js'),
    read('src/components/blocks/HomeFaqBlock.astro'),
    read('src/components/blocks/HomeFinalCta.astro'),
  ]);

  assert.match(imageCards, /data-drag-slider=\{variant === 'overlay' \? 'true' : undefined\}/);
  assert.match(imageCards, /flex:\s*0 0 23rem; width:\s*23rem; height:\s*23rem; min-height:\s*23rem/);
  assert.match(imageCards, /<script is:inline src="\/scripts\/home-image-cards-slider\.js" defer><\/script>/);
  assert.match(imageCardsScript, /const dx = pageX\(event, startX\) - startX/);
  assert.match(imageCardsScript, /slider\.scrollLeft = startScroll - dx/);
  assert.match(imageCardsScript, /addEventListener\('mousedown', start\)/);
  assert.match(imageCardsScript, /window\.addEventListener\('mousemove', move, \{ passive: false \}\)/);
  assert.match(imageCardsScript, /addEventListener\('touchstart', start, \{ passive: false \}\)/);
  assert.match(imageCardsScript, /window\.addEventListener\('touchmove', move, \{ passive: false \}\)/);
  assert.match(imageCardsScript, /event\.preventDefault\(\);\n\s*\};\n\n\s*const move/s);
  assert.match(imageCards, /scrollbar-width:\s*none/);
  assert.match(imageCards, /::-webkit-scrollbar\s*\{\s*display:\s*none/);
  assert.match(imageCards, /variant === 'overlay' && <em>/);
  assert.doesNotMatch(imageCards, /'Читать'/);
  assert.match(imageCards, /color-mix\(in srgb, var\(--kp-ink\) 30%, transparent\) 0%/);
  assert.match(imageCards, /transparent 52%, transparent 100%/);
  assert.match(imageCards, /\.home-image-cards--overlay \.home-image-cards__body\s*\{[^}]*padding:\s*1\.96rem 1\.4rem 1\.4rem 1\.96rem/s);
  assert.match(imageCards, /\.home-image-cards--overlay \.home-image-cards__body\s*\{[^}]*grid-template-rows:\s*auto auto minmax\(0, 1fr\) auto;[^}]*align-content:\s*stretch/s);
  assert.match(imageCards, /\.home-image-cards--overlay \.home-image-cards__body em\s*\{[^}]*margin-top:\s*auto/s);
  assert.match(imageCards, /\.home-image-cards--article \.home-image-cards__card\s*\{[^}]*display:\s*flex;[^}]*flex-direction:\s*column;/s);
  assert.match(imageCards, /aspect-ratio:\s*16 \/ 9/);
  assert.match(imageCards, /overflow-wrap:\s*anywhere/);
  assert.doesNotMatch(faq, /open=\{index === 0\}/);
  assert.doesNotMatch(faq, /grid-template-columns:\s*repeat\(2/);
  assert.match(faq, /margin-left:\s*var\(--kp-home-large-offset/);
  assert.match(faq, /margin-right:\s*var\(--kp-home-large-offset/);
  assert.match(faq, /\.home-faq\s*\{[^}]*margin-top:\s*clamp\(2rem, 4vw, 3\.5rem\)/s);
  assert.match(faq, /background:\s*transparent/);
  assert.match(faq, /summary::-webkit-details-marker\s*\{\s*display:\s*none/);
  assert.match(faq, /summary::before, \.home-faq__item summary::after/);
  assert.match(cta, /\.home-final-cta\s*\{[^}]*margin-top:\s*clamp\(2rem, 4vw, 3\.5rem\)/s);
  assert.match(cta, /margin-top:\s*1rem/);
  assert.match(cta, /background:\s*transparent/);
});
