import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
const route = readFileSync('src/pages/articles/sravnenie-unitree-g1-r1-h2/index.astro','utf8');
const data = readFileSync('src/lib/kiber94-article-unitree-g1-r1-h2-data.ts','utf8');
const component = readFileSync('src/components/templates/ApprovedArticle6.astro','utf8');
test('approved article6 canonical route retains source renderer and SEO',()=>{
 assert.match(route,/ApprovedArticle6\.astro/);assert.match(route,/buildUnitreeG1R1H2Article/);assert.match(route,/noindex=\{false\}/);assert.match(route,/blogPostingJsonLd/);assert.match(route,/faqPageJsonLd/);
 assert.match(data,/"showInventory": false/);assert.match(data,/Unitree G1, R1 и H2 — сравнение роботов-гуманоидов для мероприятий/);
});
test('approved article6 preserves owner Hero, first quote and closing handoff, model choices',()=>{
 assert.match(data,/unitree-g1-r1-h2-comparison-hero\.webp/);assert.match(data,/gosha: \{/);assert.match(data,/closingGoshaText:/);assert.match(data,/hidePairedEnumeration: true/);
 assert.match(data,/featuredSlugs: \['arenda-unitree-g1', 'arenda-unitree-r1', 'arenda-unitree-h2'\]/);
 assert.match(data,/Другие роботы-гуманоиды в каталоге КИБЕР ПОРТАЛ/);
});
test('approved article6 keeps mandatory close and paragraph rendering',()=>{
 assert.match(component,/data-block-id="faq"[\s\S]*data-block-id="cta2"[\s\S]*data-block-id="catalogBlock"[\s\S]*data-block-id="relatedArticles"[\s\S]*data-block-id="relatedCompilations"/);
 assert.match(component,/id="kiber-gosha-closing"/);assert.match(component,/featuredRobots.map/);
});
