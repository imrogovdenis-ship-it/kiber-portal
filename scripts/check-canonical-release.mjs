import assert from 'node:assert/strict';
import {readFileSync,existsSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
const json=p=>JSON.parse(readFileSync(p,'utf8'));
const routes=json('docs/review/canonical-release/route-pairs.json').map(p=>p[0]);
const sitemap=readFileSync('dist/sitemap.xml','utf8');
assert.equal(routes.length,31);
for(const route of routes){
 const h=readFileSync(join('dist',route,'index.html'),'utf8');
 assert.equal((h.match(/<h1(?: |>|\n)/g)||[]).length,1,route);
 assert.ok(h.includes('https://www.kiber-portal.ru'+route),route+' canonical');
 assert.doesNotMatch(h, /href="\/preview\//,route+' preview link');
 assert.doesNotMatch(h, /name="robots" content="noindex/,route+' noindex');
 assert.ok(sitemap.includes('https://www.kiber-portal.ru'+route+'<'),route+' sitemap');
 const ids=[...h.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size,route+' IDs');
 for(const [,src] of h.matchAll(/<img[^>]+src="(\/[^"]+)"/g))assert.ok(existsSync(join('dist',src)),route+' image '+src);
}
assert.ok(!existsSync('dist/preview'));
for(const p of ['/roboty-sobaki/','/news/']){assert.ok(!sitemap.includes('https://www.kiber-portal.ru'+p+'<'));assert.match(readFileSync(join('dist',p,'index.html'),'utf8'),/name="robots" content="noindex/);}
console.log('PASS: 31 approved canonical pages, H1/canonical/IDs/media/sitemap; no preview outputs; deferred pages noindex/out of sitemap');
