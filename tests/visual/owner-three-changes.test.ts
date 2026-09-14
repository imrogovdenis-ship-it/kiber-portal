import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
test('owner swaps both collection cover assets at canonical source',()=>{const c=JSON.parse(fs.readFileSync('data/design/home-live-blocks.json','utf8')).compilations.cards;assert.match(c.find((x: { title: string })=>x.title==='Роботы-собаки вместо цветов').image.src,/tild3135/);assert.match(c.find((x: { title: string })=>x.title==='Впечатляющие роботы для выставок').image.src,/tild3865/)});

test('home catalog consumes explicit owner group order',()=>{const src=fs.readFileSync('src/pages/index.astro','utf8');assert.match(src,/homeCatalogOrder/);assert.match(src,/homeCatalogOrder\.map/);assert.doesNotMatch(src,/featuredSlugs/)});

test('humanoid route opts into its owner composition, not dogs/global order',()=>{const r=fs.readFileSync('src/pages/roboty-gumanoidy.astro','utf8');assert.match(r,/<CompilationTemplate[^>]*humanoidsOwnerComposition/);assert.doesNotMatch(fs.readFileSync('src/pages/roboty-sobaki.astro','utf8'),/humanoidsOwnerComposition/)});
