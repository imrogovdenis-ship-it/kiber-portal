import {chromium} from 'playwright';
import {readFileSync,existsSync,statSync} from 'node:fs';
import {resolve,extname,sep} from 'node:path';
import assert from 'node:assert/strict';
const origin='https://www.kiber-portal.ru';
const csp=readFileSync('infra/jino-production/production.htaccess','utf8').match(/Content-Security-Policy \"([^\"]+)\"/)[1];
const real=process.env.REAL_METRICA==='1';
const browser=process.env.CDP_URL ? await chromium.connectOverCDP(process.env.CDP_URL) : await chromium.launch({headless:true});
const ctx=await browser.newContext({viewport:{width:1280,height:900}});
const root=resolve('dist');const requests=[];const responses=[];const errors=[];const providerSettings=[];const sockets=[];
await ctx.route('https://www.kiber-portal.ru/**',async route=>{
 const u=new URL(route.request().url());let p=resolve(root,'.'+decodeURIComponent(u.pathname));
 if(!p.startsWith(root+sep)&&p!==root)return route.abort();
 if(existsSync(p)&&statSync(p).isDirectory())p+='/index.html';
 if(!existsSync(p))return route.fulfill({status:404,body:''});
 return route.fulfill({status:200,headers:{'Content-Security-Policy':csp},contentType:({'.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.json':'application/json','.webp':'image/webp','.woff2':'font/woff2'})[extname(p)]||'application/octet-stream',body:readFileSync(p)});
});
if(!real)await ctx.route(/https:\/\/(?:[^/]+\.)?yandex\.(?:ru|com)\//,r=>r.fulfill({contentType:'application/javascript',body:''}));
const page=await ctx.newPage();page.on('websocket',ws=>{const u=new URL(ws.url());const item={origin:u.origin,path:u.pathname,sent:0,received:0,closed:false};sockets.push(item);ws.on('framesent',()=>item.sent++);ws.on('framereceived',()=>item.received++);ws.on('close',()=>item.closed=true);});page.on('pageerror',e=>errors.push(e.message));
page.on('request',r=>{if(/https:\/\/(?:mc\.|mc\.webvisor\.|metrika\.)/.test(r.url()))requests.push({url:r.url(),method:r.method()});});
page.on('response',async r=>{if(/https:\/\/(?:mc\.|mc\.webvisor\.|metrika\.)/.test(r.url()))responses.push({url:r.url(),status:r.status()});if(r.url().includes('/watch/') && r.status()===200){try{const data=await r.json();providerSettings.push(data.settings||{});}catch{}}});
try{
 await page.goto(origin,{waitUntil:'networkidle'});assert.equal(requests.length,0);
 await page.evaluate(()=>localStorage.setItem('kp-cookie-consent',JSON.stringify({version:1,choice:'accepted',updatedAt:Date.now(),expiresAt:Date.now()+180*86400000})));
 await page.reload({waitUntil:'networkidle'});assert.equal(requests.length,0);assert(await page.locator('#cookie-consent').isVisible());
 await page.locator('[data-cookie-choice=rejected]').click();await page.waitForTimeout(500);assert.equal(requests.length,0);
 await page.locator('[data-cookie-settings]').click();await page.locator('[data-cookie-choice=accepted]').click();
 await page.waitForTimeout(real?10000:1000);assert.equal(requests.filter(r=>r.url.includes('/metrika/tag.js')).length,1);
 await page.evaluate(()=>{const popup=document.querySelector('[data-lead-form-popup]');popup.hidden=false;document.body.classList.add('contact-lead-popup-open');});
 const input=page.locator('[data-lead-form-popup] input[name=name]');await input.fill('PRIVATE_TEST_NAME_7284');
 await page.locator('[data-lead-form-popup] input[name=contact]').fill('+7 (000) 000-00-00');
 assert.equal(await page.locator('form:not(.ym-hide-content)').count(),0);
 assert.equal(await page.locator('input:not(.ym-disable-keys),textarea:not(.ym-disable-keys)').count(),0);
 assert(await page.locator('[data-lead-form-popup]').evaluate(e=>e.classList.contains('ym-hide-content')));
 await page.waitForTimeout(real?12000:300);
 await page.evaluate(()=>{document.querySelector('[data-lead-form-popup]').hidden=true;document.body.classList.remove('contact-lead-popup-open');window.scrollTo(0,800)});
 await page.waitForTimeout(real?8000:300);
 await page.locator('[data-cookie-settings]').click();
 await Promise.all([page.waitForNavigation(),page.locator('[data-cookie-choice=rejected]').click()]);
 const after=requests.length;const framesAfter=sockets.reduce((n,s)=>n+s.sent,0);await page.waitForTimeout(2000);assert.equal(requests.length,after);assert.equal(sockets.reduce((n,s)=>n+s.sent,0),framesAfter,'no further websocket sends after revoked navigation');assert.equal(await page.getAttribute('html','data-cookie-consent'),'rejected');
 assert.equal((await ctx.cookies()).filter(c=>c.name.startsWith('_ym_')).length,0);
 await page.goto(origin+'/lead/request/',{waitUntil:'networkidle'});const before=requests.length;
 await page.locator('[data-cookie-settings]').click();await page.locator('[data-cookie-choice=accepted]').click();await page.waitForTimeout(500);assert.equal(requests.length,before);
 assert.equal(errors.length,0,JSON.stringify(errors));
 if(real){assert(responses.some(r=>r.url.includes('/watch/112523930')&&r.status===200),'provider must acknowledge a hit, not merely attempt a blocked request');assert(providerSettings.some(s=>s.webvisor?.forms===0),'provider must confirm disabled field recording');assert(sockets.some(s=>s.sent>0&&s.received>0)||responses.some(r=>r.url.includes('/webvisor/')&&r.status===200),'Webvisor transport must be acknowledged');}
 console.log(JSON.stringify({status:'PASS',real,checks:['new consent','old consent invalidated','reject','single init','masked form DOM','revocation reload','ym cookies removed','lead route excluded'],requests,responses,providerSettings,sockets,errors}));
}finally{await ctx.close();await browser.close();}
