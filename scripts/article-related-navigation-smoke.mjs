import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=process.env.BASE_URL;
assert(base,'BASE_URL is required; this test never submits forms');
const routes=JSON.parse(fs.readFileSync(new URL('../data/content/launch-articles.json',import.meta.url))).map(a=>a.canonicalHref);
const b=await chromium.launch();const failures=[];
const cards=async(p,selector)=>p.locator(selector+' .home-image-cards__card').evaluateAll(es=>es.map(e=>({tag:e.tagName,href:e.getAttribute('href'),image:e.style.getPropertyValue('--home-card-image'),title:e.querySelector('strong')?.textContent,cta:e.querySelector('em')?.textContent||null,disabled:e.getAttribute('aria-disabled')})));
try{
 const p=await b.newPage();await p.goto(base+'/',{waitUntil:'networkidle'});
 const expectedBlog=await cards(p,'[data-home-block="articles"]');const expectedCompilations=await cards(p,'[data-home-block="compilations"]');assert.equal(expectedBlog.length,6);
 for(const route of routes){
  if(process.env.SNAPSHOT_DIR){fs.mkdirSync(process.env.SNAPSHOT_DIR,{recursive:true});fs.writeFileSync(path.join(process.env.SNAPSHOT_DIR,route.split('/').filter(Boolean).pop()+'.html'),await(await fetch(base+route)).text());}
  await p.goto(base+route,{waitUntil:'networkidle'});
  const blog=await cards(p,'[data-block-id="relatedArticles"]');const compilations=await cards(p,'[data-block-id="relatedCompilations"]');
  if(JSON.stringify(blog)!==JSON.stringify(expectedBlog))failures.push({route,block:'relatedArticles'});
  if(JSON.stringify(compilations)!==JSON.stringify(expectedCompilations))failures.push({route,block:'relatedCompilations'});
 }
 assert.equal(failures.length,0,JSON.stringify(failures));console.log('PASS: six articles use the exact current homepage blog/compilation cards');
}finally{await b.close()}
