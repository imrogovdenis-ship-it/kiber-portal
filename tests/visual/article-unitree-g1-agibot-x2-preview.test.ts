import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const data = readFileSync('src/lib/kiber94-article-unitree-g1-agibot-x2-data.ts', 'utf8');
const component = readFileSync('src/components/templates/ArticleBlocksTemplate.astro', 'utf8');
const sliderScript = readFileSync('public/scripts/robot-card-gallery.js', 'utf8');


test('article #1 latest owner visual feedback is encoded in source contracts', () => {
  assert.match(sliderScript, /querySelectorAll\('\[data-drag-slider\]'\)\.forEach\(setupSlider\)/);
  assert.doesNotMatch(sliderScript, /data-drag-slider\^=/);
  assert.match(component, /article-blocks h1 \{ max-width: 15ch; font-size: clamp\(2\.25rem, 4\.4vw, 4\.65rem\); line-height: 1; \}/);
  assert.match(component, /article-blocks__featured-grid \{ display: grid; grid-template-columns: 1fr; gap: clamp\(1\.25rem, 2\.4vw, 2rem\); \}/);
  assert.match(data, /title: 'Подборки роботов для аренды'/);
  assert.doesNotMatch(data, /Посмотреть классы роботов/);
});
