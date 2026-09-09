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
  assert.match(data, /imageAlign: 'right'/);
});

test('robot gift director research package is checked and does not leak internal wording into public data', () => {
  assert.match(packageJson, /"wordstatStatus": "checked"/);
  assert.match(packageJson, /"serpStatus": "checked"/);
  assert.doesNotMatch(data, /Wordstat|SERP|Tilda|content package|page ownership|каннибализац/i);
  assert.doesNotMatch(data, /как робот роботу/i);
});


test('robot gift director article applies owner feedback', () => {
  assert.doesNotMatch(route, /arenda-promobot-v4/);
  assert.doesNotMatch(data, /Promobot V4|Promobot/);
  assert.match(route, /arenda-unitree-r1/);
  assert.match(route, /const galleryImageBySlug/);
  assert.match(route, /kiber-94-preview\/batch/);
  assert.match(component, /template\.hero\.imageAlign === 'right'/);
  assert.match(component, /robot\.galleryImage \?\? robot\.image/);
  assert.match(data, /extraGoshaQuoteAfterNumberedUseCases/);
  assert.match(data, /кабинетный квест с гуманоидами/);
});


test('article #5 owner gallery and second Gosha quote feedback is locked', () => {
  const r1 = '/images/kiber-94-preview/batch1-humanoids/arenda-unitree-r1__tild6432-3865-4237-b665-626633613332__07.webp';
  const x2 = '/images/kiber-94-preview/batch1-humanoids/arenda-agibot-x2__tild3730-3866-4365-b461-336133633866__01.webp';
  assert.match(route, new RegExp(r1));
  assert.match(route, new RegExp(x2));
  assert.doesNotMatch(route, /arenda-unitree-r1__tild6664-3730-4138-a238-373063623031__01\.webp/);
  assert.doesNotMatch(route, /arenda-agibot-x2__tild6265-3335-4233-a339-333166366661__08\.webp/);
  assert.match(component, /humanoid-template__gallery-item \{[^}]*width: fit-content;[^}]*background: transparent/);
  assert.match(component, /humanoid-template__gallery-item img \{[^}]*width: auto; height: 100%; max-width: none; object-fit: contain/);
  assert.doesNotMatch(component, /humanoid-template__gallery-item img \{[^}]*object-fit: cover/);
  assert.match(data, /где стоять и когда хлопать\.\\n\\nНапишите менеджеру/);
  assert.equal((component.match(/data-block-id="goshaQuoteAfterNumberedUseCases"/g) ?? []).length, 1);
});
