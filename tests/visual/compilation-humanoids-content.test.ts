import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
const p=JSON.parse(readFileSync('data/content/compilation-humanoids.json','utf8'));
const html=readFileSync('dist/preview/kiber-94/compilation/roboty-gumanoidy/index.html','utf8');
test('seven explicit models, approved local gallery and truthful prices',()=>{
 assert.equal(p.blocks.catalog.robots.length,7);assert.equal(new Set(p.blocks.catalog.robots.map(r=>r.slug)).size,7);
 assert.equal(p.media.filter(m=>m.role!=="hero").length,7);assert.ok(p.media.filter(m=>m.role!=="hero").every(m=>m.actualDescription && m.seoAlt && m.src.startsWith('/images/kiber-94-preview/')));
 const source=JSON.parse(readFileSync('data/models/robots.source-of-truth.json','utf8'));
 for(const r of p.blocks.catalog.robots)assert.equal(r.price,source.robots.find(s=>s.slug===r.slug).pricing.display);
});
test('preview contains researched content, two quotes and no placeholders',()=>{
 assert.equal((html.match(/<h1 /g)||[]).length,1);assert.equal((html.match(/class="home-gosha__quote"/g)||[]).length,2);
 assert.doesNotMatch(html,/static\.tildacdn\.com|визуальной системе PR8|Блок усиливает/);
 assert.ok(html.includes('https://www.kiber-portal.ru/roboty-gumanoidy/'));
 assert.equal((html.match(/data-kinescope-load=/g)||[]).length,8); assert.ok(html.includes('ItemList')); assert.ok(html.includes('noindex'));
 const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);
 assert.equal(p.blocks.scenarioVideoIds.length,7); assert.equal(p.blocks.relatedArticles.cards.length,6); assert.equal(p.blocks.showOtherCompilations,true); assert.equal((html.match(/data-kinescope-src=/g)||[]).length,8); assert.ok(html.includes('data-block-id="explanation"')); assert.ok(html.includes('humanoids-hero.webp')); assert.equal(p.blocks.faq.items.length,6);
});
