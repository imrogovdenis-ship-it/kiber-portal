import fs from'node:fs';import path from'node:path';import assert from'node:assert/strict';
const read=p=>fs.readFileSync(p,'utf8'),json=p=>JSON.parse(read(p));
const config=json('data/content/humanoids-owner-composition.json'),order=json('data/content/home-catalog-order.json');
assert.equal(new Set(order).size,order.length);assert.deepEqual([...order].sort(),json('src/content/robots.generated.json').robots.map(x=>x.slug).sort());
const home=read('dist/index.html');const actual=[...home.matchAll(/<a\b[^>]*class="robot-card[^\"]*"[^>]*>/g)].map(x=>x[0].match(/href="\/robots\/([^/]+)\//)?.[1]);assert.deepEqual(actual,order);
const humanoids=read('dist/roboty-gumanoidy/index.html'),expected=['hero',...config.blockOrder];assert.deepEqual([...humanoids.matchAll(/\bdata-block-id="([^\"]+)"/g)].map(x=>x[1]).filter(x=>expected.includes(x)),expected);assert(humanoids.includes(config.featuredCatalog.title));assert(humanoids.includes(config.featuredCatalog.lead));
const covers={'Роботы-собаки вместо цветов':'tild3135-3762-4632-b339-363666636639-02.webp','Впечатляющие роботы для выставок':'tild3865-6231-4930-b331-613466613565-03.webp'};let counts=Object.fromEntries(Object.keys(covers).map(x=>[x,0]));
function walk(dir){for(const n of fs.readdirSync(dir)){let p=path.join(dir,n);if(fs.statSync(p).isDirectory())walk(p);else if(p.endsWith('.html'))for(const m of read(p).matchAll(/<(?:a|div)\b[^>]*class="(?:home-image-cards__card|compilations-page__card)"[^>]*>[\s\S]*?<\/(?:a|div)>/g))for(const[title,asset]of Object.entries(covers))if(m[0].includes(title)){assert(m[0].includes(asset),p+': '+title);counts[title]++}}}
walk('dist');assert(Object.values(counts).every(n=>n>=16));console.log('PASS: all cover appearances',counts,'24 catalog cards, humanoid block order and owner copy');
