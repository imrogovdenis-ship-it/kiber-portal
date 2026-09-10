import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { readFileSync,writeFileSync,mkdirSync } from 'node:fs';
import { join,extname,resolve } from 'node:path';
import { createServer } from 'node:http';
const root=resolve('dist');
const budget=JSON.parse(readFileSync('docs/review/kiber-39/performance-budget.json','utf8'));
const limits=budget.browserBudgets;
const server=createServer((req,res)=>{
 let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 let file=join(root,pathname);if(pathname.endsWith('/'))file=join(file,'index.html');
 if(!file.startsWith(root+'/')){res.statusCode=403;return res.end();}
 try{const data=readFileSync(file);res.setHeader('Content-Type',({'.html':'text/html','.css':'text/css','.js':'application/javascript','.svg':'image/svg+xml','.webp':'image/webp','.woff2':'font/woff2'})[extname(file)]||'application/octet-stream');res.setHeader('Content-Length',data.length);res.setHeader('Cache-Control','no-store');res.end(data);}catch{res.statusCode=404;res.end();}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
let browser;const results=[];const failures=[];
try{
 browser=await chromium.launch();
 for(const width of limits.viewports)for(const route of budget.routes){
  const context=await browser.newContext({viewport:{width,height:1000}});
  const page=await context.newPage();const errors=[];
  await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
  await page.addInitScript(()=>{window.__measuredCLS=0;new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.__measuredCLS+=e.value;}).observe({type:'layout-shift',buffered:true});});
  page.on('response',r=>{if(r.status()>=400)errors.push({url:r.url(),status:r.status()});});
  const response=await page.goto(`http://127.0.0.1:${server.address().port}${route}`,{waitUntil:'networkidle'});assert.equal(response.status(),200);
  const measure=()=>page.evaluate(()=>{const entries=[performance.getEntriesByType('navigation')[0],...performance.getEntriesByType('resource')];return {bytes:entries.reduce((sum,e)=>sum+e.encodedBodySize,0),requests:entries.length,cls:window.__measuredCLS};});
  const initial=await measure();
  await page.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=500){scrollTo(0,y);await new Promise(r=>setTimeout(r,50));}for(const s of document.querySelectorAll('[data-drag-slider]'))for(let x=0;x<s.scrollWidth;x+=500){s.scrollLeft=x;await new Promise(r=>setTimeout(r,50));}});
  await page.waitForTimeout(1000);await page.waitForLoadState('networkidle');const full=await measure();
  if(initial.bytes>limits.initialBytes)failures.push(`${route}@${width}: initial ${initial.bytes}>${limits.initialBytes}`);
  if(full.bytes>limits.fullBytes)failures.push(`${route}@${width}: full ${full.bytes}>${limits.fullBytes}`);
  if(full.cls>limits.cls)failures.push(`${route}@${width}: CLS ${full.cls}>${limits.cls}`);
  if(errors.length)failures.push(`${route}@${width}: resource errors ${JSON.stringify(errors)}`);
  results.push({route,width,initial,full,errors});await context.close();
 }
}finally{if(browser)await browser.close();server.close();}
mkdirSync('docs/review/kiber-39',{recursive:true});writeFileSync('docs/review/kiber-39/browser-performance-report.json',JSON.stringify({profile:limits,results,failures,status:failures.length?'failed':'passed'},null,2)+'\n');
assert.deepEqual(failures,[]);
console.log(`PASS ${results.length} cold Chromium checks: initial/full bytes, CLS and resource availability; not field CWV`);
