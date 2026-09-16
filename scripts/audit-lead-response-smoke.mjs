// Isolated response fixtures, never a live delivery test. All requests are intercepted.
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
let component=readFileSync('src/components/layout/ContactLeadFormPopup.astro','utf8').split('---')[2].split('<script')[0].replace('action={formAction}','action="/api/leads"').replace(`data-lead-form-live={liveEnabled ? 'true' : 'false'}`,'data-lead-form-live="true"');
const script=readFileSync('public/scripts/contact-lead-form-popup.js','utf8');
const browser=await chromium.launch({headless:true});
try {
 for (const scenario of ['bad-json','ok-false','preview','success','preview-host']) {
  const context=await browser.newContext(); const page=await context.newPage(); let posts=0;
  await page.route('**/*', async route=>{
   const req=route.request();
   if(req.method()==='POST'){
    posts++;await new Promise(r=>setTimeout(r,100));
    const payload=scenario==='bad-json'?'not json':JSON.stringify({ok:scenario!=='ok-false',mode:scenario==='preview'?'preview':'live',requestId:'fixture-only'});
    await route.fulfill({status:200,contentType:'application/json',body:payload});return;
   }
   await route.fulfill({contentType:'text/html',body:`<html><body><a id="open" href="/lead/request/">Open</a>${component}</body></html>`});
  });
  const host=scenario==='preview-host'?'jino-preview.kiber-portal.ru':'www.kiber-portal.ru';
  await page.goto(`https://${host}/`);await page.addScriptTag({content:script});await page.click('#open');
  await page.fill('input[name=name]','Изолированный тест');await page.fill('input[name=contact]','TEST-NO-DELIVERY');await page.check('input[name=privacy_consent]');
  await page.locator('form').evaluate(f=>{f.requestSubmit();f.requestSubmit();});await page.waitForTimeout(600);
  if(scenario==='success'){
   assert.ok(page.url().endsWith('/lead/thanks/'), 'success goes to clean thanks URL');
   const receipt=await page.evaluate(()=>JSON.parse(sessionStorage.getItem('kiber-lead-receipt')));
   assert.equal(receipt.accepted,true);assert.deepEqual(Object.keys(receipt).sort(),['accepted','at']);
  }else{
   assert.ok(page.url().endsWith('/'),'non-live or invalid response must not claim success: '+scenario);
   assert.equal(await page.locator('input[name=name]').inputValue(),'Изолированный тест');
  }
  assert.equal(posts,scenario==='preview-host'?0:1,'one POST at most; zero from preview');
  console.log('PASS response fixture',scenario);await context.close();
 }
} finally{await browser.close();}
