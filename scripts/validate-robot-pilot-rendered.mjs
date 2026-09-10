import {chromium} from 'playwright';
import {readFileSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true});
try {
 const page=await browser.newPage({javaScriptEnabled:false});
 await page.route('**/*',r=>r.abort());
 const frozen={};
 for(const slug of ['arenda-roboshashki','arenda-senserobot']) {
  await page.setContent(readFileSync(`dist/robots/${slug}/index.html`,'utf8'),{waitUntil:'domcontentloaded'});
  frozen[slug]=await page.locator('[data-block-id]').evaluateAll(es=>Object.fromEntries(es.filter(e=>['hero','gallery','robotInAction'].includes(e.dataset.blockId)).map(e=>[e.dataset.blockId,e.outerHTML])));
  if(process.argv.includes('--baseline'))continue;
  const copy=JSON.parse(readFileSync(`data/content/robot-card-pilot/${slug}.json`));
  const text=await page.locator('body').evaluate(e=>{e.querySelectorAll('script,style').forEach(n=>n.remove());return e.textContent});
  assert(text.includes(copy.blocks.aiSummary),`New intro not rendered: ${slug}`);
  for(const item of copy.blocks.faq)assert(text.includes(item.question)&&text.includes(item.answer),item.question);
  assert.equal(await page.locator('h1').count(),1);
  console.log(slug,'rendered copy PASS');
 }
 const file='docs/review/robot-card-remediation/pilot-research/frozen-blocks-before.json';
 if(process.argv.includes('--baseline'))writeFileSync(file,JSON.stringify(frozen));
 else {assert.deepEqual(JSON.stringify(frozen).replace(/ data-astro-cid-[a-z0-9]+(?:=\"\")?/g,''),JSON.stringify(JSON.parse(readFileSync(file))).replace(/ data-astro-cid-[a-z0-9]+(?:=\"\")?/g,''));console.log('Frozen Hero/gallery blocks identical');}
}finally{await browser.close()}
