import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const route = readFileSync('src/pages/preview/kiber-94/articles/neobychnyi-podarok-direktoru-robot-v-kabinete/index.astro', 'utf8');
const data = readFileSync('src/lib/kiber94-article-robot-gift-director-data.ts', 'utf8');
const component = readFileSync('src/components/templates/ArticleBlocksTemplate.astro', 'utf8');
const packageJson = readFileSync('docs/review/kiber-article-neobychnyi-podarok-direktoru-20260909/content-package.json', 'utf8');

test('robot gift director article preview uses approved article template and noindex safeguards', () => {
  assert.match(route, /<ArticleBlocksTemplate \{template\} \/>/);
  assert.match(route, /buildRobotGiftDirectorArticle/);
  assert.match(route, /noindex=\{true\}/);
  assert.match(route, /faqPageJsonLd\(\{ items: template\.faq\.items \}\)/);
  assert.match(data, /showInventory: false/);
  assert.match(component, /data-block-id="faq"[\s\S]*data-block-id="cta2"[\s\S]*data-block-id="catalogBlock"[\s\S]*data-block-id="relatedArticles"[\s\S]*data-block-id="relatedCompilations"/);
});

test('robot gift director article maps owner brief into customer-first blocks', () => {
  assert.match(data, /Необычный подарок директору — робот в кабинете вместо галстука/);
  assert.match(data, /Когда робот лучше галстука/);
  assert.match(data, /Три случая, когда робот — удачный подарок директору/);
  assert.match(data, /Что сказать менеджеру КИБЕР ПОРТАЛ/);
  assert.match(data, /Unitree G1 для камерного поздравления в офисе/);
  assert.match(data, /featuredSlug: 'arenda-unitree-g1'/);
  assert.match(data, /робот-гуманоид Unitree G1 поздравляет директора/);
});

test('robot gift director research package is checked and does not leak internal wording into public data', () => {
  assert.match(packageJson, /"wordstatStatus": "checked"/);
  assert.match(packageJson, /"serpStatus": "checked"/);
  assert.doesNotMatch(data, /Wordstat|SERP|Tilda|content package|page ownership|каннибализац/i);
  assert.doesNotMatch(data, /как робот роботу/i);
});
