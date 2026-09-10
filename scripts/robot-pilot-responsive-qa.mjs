import {chromium} from '/home/alex/projects/kiber-api-runtime/node_modules/playwright/index.mjs';
import {writeFileSync} from 'node:fs';import assert from 'node:assert/strict';
const b=await chromium.launch();const out=[];
try{for(const slug of ['arenda-roboshashki','arenda-senserobot'])for(const width of [390,768,1440]){
 const page=await b.newPage({viewport:{width,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`${process.env.BASE}/robots/${slug}/`,{waitUntil:'networkidle'});
 for(const img of await page.locator('img[loading="lazy"]').all()){if(await img.isVisible())await img.scrollIntoViewIfNeeded();}
 await page.waitForTimeout(300);
 const data=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.images].filter(i=>i.getClientRects().length&&(!i.complete||!i.naturalWidth)).map(i=>i.getAttribute('src')),caps:[...document.querySelectorAll('[data-block-id="capabilities"] img')].map(i=>({ratio:i.getBoundingClientRect().width/i.getBoundingClientRect().height,fit:getComputedStyle(i).objectFit,alt:i.alt,src:i.getAttribute('src')})),related:[...document.querySelectorAll('[data-block-id="relatedCatalog"] a')].map(a=>a.getAttribute('href'))}));
 assert(!data.overflow);assert.equal(data.broken.length,0);assert.equal(data.caps.length,6);for(const x of data.caps){assert(Math.abs(x.ratio-16/9)<.02);assert.equal(x.fit,'contain');assert(!x.alt.includes('для блока'));}assert(data.caps.some(x=>x.src.includes('power-connection.webp')));assert(!data.related.some(x=>x.includes(slug)));assert.equal(errors.length,0);
 const faq=page.locator('[data-block-id="faq"] summary').first();if(await faq.count()){await faq.click();assert(await faq.evaluate(e=>e.parentElement.open));}
 await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`/home/alex/.hermes/state/kiber-pilot-competitor-followup/${slug}-${width}.png`,fullPage:true});out.push({slug,width,...data,errors});await page.close();
}writeFileSync('/home/alex/.hermes/state/kiber-pilot-competitor-followup/pilot-qa.json',JSON.stringify(out,null,2));console.log('PASS',out.length,'responsive page checks');}finally{await b.close()}
