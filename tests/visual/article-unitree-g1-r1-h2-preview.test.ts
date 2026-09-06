import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const route = readFileSync('src/pages/preview/kiber-94/articles/sravnenie-unitree-g1-r1-h2/index.astro', 'utf8');
const data = readFileSync('src/lib/kiber94-article-unitree-g1-r1-h2-data.ts', 'utf8');
const component = readFileSync('src/components/templates/ArticleBlocksTemplate.astro', 'utf8');

test('Unitree G1/R1/H2 article preview uses approved article template and preview safeguards', () => {
  assert.match(route, /<ArticleBlocksTemplate \{template\} \/>/);
  assert.match(route, /buildUnitreeG1R1H2Article/);
  assert.match(route, /noindex=\{true\}/);
  assert.match(route, /faqPageJsonLd\(\{ items: template\.faq\.items \}\)/);
  assert.match(data, /showInventory: false/);
  assert.match(component, /\{\(content\?\.showInventory \?\? true\) && \(/);
});

test('Unitree G1/R1/H2 article content maps owner doc into approved block families', () => {
  assert.match(data, /Unitree G1, R1 и H2: сравнение роботов-гуманоидов для мероприятий/);
  assert.match(data, /Короткий вывод перед сравнением/);
  assert.match(data, /Unitree G1, R1 и H2 в трёх цифрах/);
  assert.match(data, /Полное сравнение характеристик Unitree G1, R1 и H2/);
  assert.match(data, /headers: \['Характеристика', 'Unitree G1', 'Unitree R1', 'Unitree H2'\]/);
  assert.match(data, /Какую модель Unitree выбрать под ваш формат/);
  assert.match(data, /Что учесть при выборе гуманоида Unitree/);
  assert.match(data, /Фирменный момент каждой модели/);
  assert.match(data, /featuredSlug: 'arenda-unitree-g1'/);
});

test('Unitree G1/R1/H2 article keeps mandatory approved closing sequence', () => {
  assert.match(component, /data-block-id="faq"[\s\S]*data-block-id="cta2"[\s\S]*data-block-id="catalogBlock"[\s\S]*data-block-id="relatedArticles"[\s\S]*data-block-id="relatedCompilations"/);
  assert.match(data, /title: 'Модели Unitree в каталоге КИБЕР ПОРТАЛ'/);
  assert.match(data, /title: 'Читайте также'/);
  assert.match(data, /title: 'Подборки для выбора робота на мероприятие'/);
});
