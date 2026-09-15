import {readdirSync,readFileSync} from 'node:fs';
import {join,relative} from 'node:path';
import assert from 'node:assert/strict';
function walk(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(dir,e.name)):[join(dir,e.name)]);}
const files=walk('dist').filter(f=>f.endsWith('.html'));assert.ok(files.length>=50,'full build required');
const forbidden=[];
for(const file of files){
 const page='/'+relative('dist',file).replace(/index\.html$/,'');
 const html=readFileSync(file,'utf8');
 for(const match of html.matchAll(/<(?:a|area|form)\b[^>]*\b(?:href|action)\s*=\s*["']([^"']*)["']/gi)){
  const value=match[1];if(!value||value.startsWith('#'))continue;
  const url=new URL(value,'https://www.kiber-portal.ru'+page);
  if(['www.kiber-portal.ru','kiber-portal.ru','jino-preview.kiber-portal.ru'].includes(url.hostname)&&/^\/lead\/thanks\/?$/.test(decodeURIComponent(url.pathname)))forbidden.push({file,value});
 }
}
assert.deepEqual(forbidden,[],'thanks may only be opened by success flow, not navigation');
assert.ok(!readFileSync('dist/sitemap.xml','utf8').includes('/lead/thanks'));
assert.match(readFileSync('dist/lead/thanks/index.html','utf8'),/<meta[^>]*name=["']robots["'][^>]*noindex/);
console.log(`PASS: ${files.length} pages, zero thanks navigation links, noindex, absent from sitemap`);
