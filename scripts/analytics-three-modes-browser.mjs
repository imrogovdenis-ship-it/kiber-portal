// Deterministic local browser fixture. No real provider traffic or provider receipt claims.
import {chromium} from 'playwright';
import {readFileSync,existsSync,statSync} from 'node:fs';
import {resolve,extname,sep} from 'node:path';
import assert from 'node:assert/strict';
const origin='https://www.kiber-portal.ru';
const root=resolve('dist');
const csp=readFileSync('infra/jino-production/production.htaccess','utf8').match(/Content-Security-Policy "([^"]+)"/)[1];
const browser=await chromium.launch({headless:true});
const calls=[];const external=[];const errors=[];
const sdk=`(()=>{const queue=Array.from(window.ym?.a||[]);window.ym=function(...a){window.__recordYm(a);if(a[1]==='init')document.cookie='_ym_uid=fixture; path=/';};for(const a of queue)window.ym(...a);})();`;
async function context(blocked=false){
 const ctx=await browser.newContext({viewport:{width:1280,height:900}});
 await ctx.exposeBinding('__recordYm',(source,args)=>calls.push({page:source.page.url().replace(origin,''),method:args[1],options:args[2]}));
 if(blocked)await ctx.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new DOMException('blocked','SecurityError')}}));
 await ctx.route('**/*',async route=>{
  const u=new URL(route.request().url());
  if(u.origin===origin){
   let p=resolve(root,'.'+decodeURIComponent(u.pathname));if(!p.startsWith(root+sep)&&p!==root)return route.abort();
   if(existsSync(p)&&statSync(p).isDirectory())p+='/index.html';if(!existsSync(p))return route.fulfill({status:404,body:''});
   let body=readFileSync(p);if(extname(p)==='.html')body=Buffer.from(body.toString().replaceAll('data-production="false"','data-production="true"'));
   return route.fulfill({status:200,headers:{'Content-Security-Policy':csp},contentType:({'.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.webp':'image/webp','.woff2':'font/woff2'})[extname(p)]||'application/octet-stream',body});
  }
  if(u.hostname==='mc.yandex.ru'&&u.pathname==='/metrika/tag.js')return route.fulfill({contentType:'application/javascript',body:sdk});
  external.push(u.hostname+u.pathname);return route.abort();
 });
 ctx.on('page',p=>p.on('pageerror',e=>errors.push(e.message)));
 return ctx;
}
const inits=()=>calls.filter(c=>c.method==='init');
async function mode(page,value){await page.locator('[data-analytics-toggle]').click();await page.locator('input[value='+value+']').check();await page.locator('#analytics-settings button[type=submit]').click();await page.waitForTimeout(250);await page.waitForLoadState('networkidle');assert.equal(await page.getAttribute('html','data-analytics-mode'),value);}
try{
 const ctx=await context();const page=await ctx.newPage();
 await page.goto(origin,{waitUntil:'networkidle'});assert.equal(inits().length,1);assert.equal(inits()[0].options.webvisor,false);
 await page.locator('[data-cookie-choice=accepted]').click();await page.waitForTimeout(100);assert.equal(inits().length,1,'banner permission waits for navigation');
 await page.goto(origin+'/cookie-policy/',{waitUntil:'networkidle'});assert.equal(inits().at(-1).options.webvisor,true);
 assert.equal(await page.locator('form:not(.ym-hide-content)').count(),0);assert.equal(await page.locator('input:not(.ym-disable-keys)').count(),0);
 await page.evaluate(()=>{const f=document.createElement('input');f.name='private-test';document.body.append(f)});await page.waitForTimeout(30);assert(await page.locator('input[name=private-test]').evaluate(e=>e.classList.contains('ym-disable-keys')));
 await page.locator('[data-analytics-toggle]').click();
 await page.locator('input[value=off]').check();
 await page.evaluate(()=>document.dispatchEvent(new Event('visibilitychange')));
 assert(await page.locator('input[value=off]').isChecked(),'visibility sync must preserve unsaved full refusal');
 let n=inits().length;
 await page.locator('#analytics-settings button[type=submit]').click();
 await page.waitForTimeout(250);await page.waitForLoadState('networkidle');
 assert.equal(await page.getAttribute('html','data-analytics-mode'),'off');assert.equal(inits().length,n);assert(calls.some(c=>c.method==='destruct'));assert.equal(await page.locator('script[src*="mc.yandex"]').count(),0);assert(!await page.evaluate(()=>document.cookie.includes('_ym_')));
 await page.goto(origin+'/robots/arenda-unitree-g1/',{waitUntil:'networkidle'});assert.equal(inits().length,n);assert.equal(await page.getAttribute('html','data-analytics-mode'),'off');
 await page.goto(origin+'/cookie-policy/',{waitUntil:'networkidle'});await mode(page,'basic');assert.equal(inits().length,n+1);assert.equal(inits().at(-1).options.webvisor,false);
 await mode(page,'extended');assert.equal(inits().at(-1).options.webvisor,true);assert.equal(inits().at(-1).options.defer,true);
 await mode(page,'basic');assert.equal(inits().at(-1).options.webvisor,false);assert.equal(inits().at(-1).options.defer,true);
 await mode(page,'extended');const other=await ctx.newPage();await other.goto(origin+'/cookie-policy/',{waitUntil:'networkidle'});n=inits().length;
 await mode(page,'off');await other.waitForTimeout(300);await other.waitForLoadState('networkidle');assert.equal(await other.getAttribute('html','data-analytics-mode'),'off');assert.equal(inits().length,n);await other.close();
 await page.evaluate(()=>localStorage.setItem('kp-cookie-consent','{broken'));await page.reload({waitUntil:'networkidle'});assert.equal(await page.getAttribute('html','data-analytics-mode'),'off');assert.equal(inits().length,n);
 await page.evaluate(()=>{const at=Date.now()-181*86400000;localStorage.setItem('kp-cookie-consent',JSON.stringify({version:4,mode:'extended',updatedAt:at,expiresAt:at+180*86400000}))});await page.reload({waitUntil:'networkidle'});assert.equal(inits().at(-1).options.webvisor,false);assert(await page.locator('#cookie-consent').isVisible());
 await page.evaluate(()=>localStorage.setItem('kp-cookie-consent',JSON.stringify({version:3,choice:'accepted',updatedAt:Date.now(),expiresAt:Date.now()+180*86400000})));await page.reload({waitUntil:'networkidle'});assert.equal(inits().at(-1).options.webvisor,false);assert(await page.locator('#cookie-consent').isVisible());
 await page.goto(origin+'/lead/request/',{waitUntil:'networkidle'});n=inits().length;await page.locator('[data-cookie-choice=accepted]').click();assert.equal(inits().length,n);await ctx.close();
 const denied=await context(true);const p=await denied.newPage();await p.goto(origin+'/cookie-policy/',{waitUntil:'networkidle'});n=inits().length;await p.locator('[data-cookie-choice=accepted]').click();assert.equal(inits().length,n);assert.equal(await p.getAttribute('html','data-analytics-mode'),'off');assert(await p.locator('[data-cookie-storage-warning]').isVisible());await denied.close();
 const quota=await context();await quota.addInitScript(()=>{if(location.hostname!=='www.kiber-portal.ru')return;const now=Date.now();localStorage.setItem('kp-cookie-consent',JSON.stringify({version:4,mode:'extended',updatedAt:now,expiresAt:now+180*86400000}))});
 const qp=await quota.newPage();await qp.goto(origin+'/cookie-policy/',{waitUntil:'networkidle'});n=inits().length;
 await qp.evaluate(()=>{const set=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(this===localStorage&&k==='kp-cookie-consent')throw new DOMException('blocked write','QuotaExceededError');return set.call(this,k,v)}});
 await qp.evaluate(()=>{window.__activityTimer=setInterval(()=>window.__recordYm([112523930,'activity']),20);const old=window.ym;window.ym=function(...args){if(args[1]==='destruct')throw Error('fixture destruct failure');return old(...args)}});
 await mode(qp,'off');assert.equal(inits().length,n);assert.equal(await qp.locator('script[src*="mc.yandex"]').count(),0);
 assert.equal(await qp.evaluate(()=>JSON.parse(localStorage.getItem('kp-cookie-consent')).mode),'extended','test retains stale permission to exercise session veto');
 await qp.evaluate(()=>document.dispatchEvent(new Event('visibilitychange')));assert.equal(inits().length,n);
 await qp.reload({waitUntil:'networkidle'});assert.equal(await qp.getAttribute('html','data-analytics-mode'),'off');assert.equal(inits().length,n);const activityCount=calls.filter(c=>c.method==='activity').length;await qp.waitForTimeout(150);assert.equal(calls.filter(c=>c.method==='activity').length,activityCount,'safe reload terminates old SDK activity after combined failures');await quota.close();
 const delayed=await context();let release;const seen=new Promise(resolve=>{release=resolve});let delayedRoute;
 await delayed.route('https://mc.yandex.ru/metrika/tag.js*',route=>{delayedRoute=route;release()});
 await delayed.addInitScript(()=>{if(location.hostname!=='www.kiber-portal.ru')return;const now=Date.now();if(!localStorage.getItem('kp-cookie-consent'))localStorage.setItem('kp-cookie-consent',JSON.stringify({version:4,mode:'extended',updatedAt:now,expiresAt:now+180*86400000}))});
 const dp=await delayed.newPage();await dp.goto(origin+'/cookie-policy/',{waitUntil:'domcontentloaded'});await seen;n=inits().length;
 await mode(dp,'off');
 try{await delayedRoute.fulfill({contentType:'application/javascript',body:sdk})}catch(e){assert(/interception|closed|handled|aborted/i.test(String(e)),String(e))}
 await dp.waitForTimeout(100);assert.equal(inits().length,n,'refusal during SDK loading must not initialize a counter');await delayed.close();
 assert.equal(errors.length,0,JSON.stringify(errors));assert(!external.some(u=>/yandex|metrika|google-analytics/.test(u)),JSON.stringify(external));
 console.log(JSON.stringify({status:'PASS',evidence:'real Chromium, local site bytes, SDK stub, all external requests intercepted; not real provider receipt',checks:['fresh basic','banner next-page permission','masked existing/dynamic fields','full off before SDK','full off persists across navigation','all mode transitions','automatic reload nohit option','two-tab revoke','corrupt storage fail closed','expired extended renewal','v3 not upgraded','lead exclusion','blocked storage','unsaved refusal survives visibility sync','combined storage/destruct failure stops SDK activity via safe reload','refusal during SDK loading'],inits:inits().length,destruct:calls.filter(c=>c.method==='destruct').length,errors}));
}finally{await browser.close()}
