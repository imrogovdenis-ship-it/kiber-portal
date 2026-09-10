import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import p from '../../data/content/compilation-humanoids.json';
import source from '../../data/models/robots.source-of-truth.json';
const html=readFileSync('dist/roboty-gumanoidy/index.html','utf8');
test('seven explicit models, approved local gallery and truthful prices',()=>{
 assert.equal(p.blocks.catalog.robots.length,7);assert.equal(new Set(p.blocks.catalog.robots.map(r=>r.slug)).size,7);
 assert.equal(p.media.filter(m=>m.role!=="hero").length,7);assert.ok(p.media.filter(m=>m.role!=="hero").every(m=>m.actualDescription && m.seoAlt && m.src.startsWith('/images/kiber-94-preview/')));

 for(const r of p.blocks.catalog.robots)assert.equal(r.price,source.robots.find(s=>s.slug===r.slug)!.pricing.display);
});
test('preview contains researched content, two quotes and no placeholders',()=>{
 assert.equal((html.match(/<h1 /g)||[]).length,1);assert.equal((html.match(/class="home-gosha__quote"/g)||[]).length,2);
 assert.doesNotMatch(html,/static\.tildacdn\.com|визуальной системе PR8|Блок усиливает/);
 assert.ok(html.includes('https://www.kiber-portal.ru/roboty-gumanoidy/'));
 assert.equal((html.match(/data-kinescope-load=/g)||[]).length,0); assert.ok(html.includes('ItemList')); assert.doesNotMatch(html, /name="robots" content="noindex/);
 const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);
 assert.equal(p.blocks.scenarioVideoIds.length,7); assert.equal(p.blocks.relatedArticles.cards.length,6); assert.equal(p.blocks.showOtherCompilations,true); assert.equal((html.match(/src="https:\/\/kinescope.io\/embed\//g)||[]).length,8); assert.ok(html.includes('data-block-id="explanation"')); assert.ok(html.includes('humanoids-hero.webp')); assert.equal(p.blocks.faq.items.length,6);
});

test("no outbound Kinescope links or intermediate controls",()=>{assert.doesNotMatch(html, /class="kp-kinescope-video__fallback"|data-kinescope-load=/);});
