import {test} from 'node:test';import assert from 'node:assert/strict';import {existsSync,readFileSync}from'node:fs';
test('internal fonts have an explicit full-Unicode fallback and common subset, home retains originals',()=>{
 assert.ok(existsSync('src/styles/fonts-split.css'),'split face stylesheet missing');
 const css=readFileSync('src/styles/fonts-split.css','utf8');assert.equal((css.match(/@font-face/g)||[]).length,13);assert.equal((css.match(/unicode-range:/g)||[]).length,8);
 for(const weight of ['Regular','Medium','SemiBold','Bold']){assert.ok(css.includes(`Montserrat-${weight}.common.woff2`));assert.ok(css.includes(`Montserrat-${weight}.woff2`));}
 const layout=readFileSync('src/layouts/BaseLayout.astro','utf8');assert.ok(layout.includes('fonts-split.css?inline'));assert.ok(layout.includes("Astro.url.pathname === '/'"));
 const head=readFileSync('src/components/layout/SeoHead.astro','utf8');assert.ok(head.includes('common.woff2'));assert.ok(head.includes("Astro.url.pathname === '/'"));
});

import {createHash}from'node:crypto';
test('Unicode partition is complete and fallback originals are unchanged',()=>{const rows=JSON.parse(readFileSync('data/design/font-subsets.json','utf8'));for(const r of rows){const all=[...r.commonCodepoints,...r.fallbackCodepoints].sort((a,b)=>a-b);assert.deepEqual(all,r.allCodepoints);assert.equal(new Set(all).size,all.length);assert.ok(r.commonBytes<r.sourceBytes);for(const [file,hash]of [[r.source,r.sourceSha256],[r.common,r.commonSha256]])assert.equal(createHash('sha256').update(readFileSync('public/fonts/montserrat/'+file)).digest('hex'),hash);}});

test('charset and viewport metadata precede inline font CSS',()=>{const x=readFileSync('src/layouts/BaseLayout.astro','utf8');assert.ok(x.indexOf('<SeoHead')<x.indexOf('<style is:inline'),'Keep charset/viewport ahead of large inline CSS');});

test('full original input face includes implicit text inputs without a type attribute',()=>{assert.ok(readFileSync('src/styles/fonts-split.css','utf8').includes('input,textarea{font-family:'));});
