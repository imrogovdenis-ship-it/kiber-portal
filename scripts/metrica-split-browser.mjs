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
const page=await ctx.newPage();const inits=[];const hits=[];const hitFlags=[];const failures=[];
await ctx.route('https://mc.yandex.ru/metrika/tag.js?**',async route=>{
 inits.push(await page.evaluate(()=>Array.from(window.ym?.a||[]).filter(a=>a[1]==='init').map(a=>a[2])));
 if(real)await route.continue();else await route.fulfill({contentType:'application/javascript',body:''});
});
page.on('pageerror',e=>failures.push(e.message));
page.on('response',r=>{if(r.status()===200&&r.url().includes('/watch/112523930')){const q=new URL(r.url()).searchParams;hits.push(q.get('browser-info')||'');hitFlags.push({nohit:q.get('nohit'),url:q.get('page-url'),browser:q.get('browser-info')?.split(':').filter((s,i,a)=>['pv','ar'].includes(s)||['pv','ar'].includes(a[i-1])).join(':')});}});
try{
 await page.goto(origin,{waitUntil:'networkidle'});await page.waitForTimeout(real?4000:200);
 assert.equal(inits[0][0].webvisor,false);assert.equal(inits[0][0].clickmap,false);assert(await page.locator('#cookie-consent').isVisible());
 await page.locator('[data-cookie-choice=rejected]').click();assert.equal(inits.length,1);
 await page.locator('[data-cookie-settings]').click();await page.locator('[data-cookie-choice=accepted]').click();assert.equal(inits.length,1,'accept must not add duplicate pageview');
 await page.goto(origin+'/robots/arenda-unitree-g1/',{waitUntil:'networkidle'});await page.waitForTimeout(real?6000:200);assert.equal(inits[1][0].webvisor,true);assert.equal(inits[1][0].clickmap,true);
 assert.equal(await page.locator('form:not(.ym-hide-content)').count(),0);assert.equal(await page.locator('input:not(.ym-disable-keys)').count(),0);
 const uid=await page.evaluate(()=>document.cookie.split(';').find(c=>c.trim().startsWith('_ym_uid='))?.trim());
 const pvBefore=hitFlags.filter(x=>x.nohit!=='1'&&/(^|:)pv:1(:|$)/.test(x.browser||'')).length;
 await page.locator('[data-cookie-settings]').click();await Promise.all([page.waitForNavigation(),page.locator('[data-cookie-choice=rejected]').click()]);await page.waitForTimeout(real?5000:200);
 assert.equal(inits[2][0].webvisor,false);assert.equal(inits[2][0].defer,true,'automatic revoke reload must suppress another pageview');assert.equal(await page.getAttribute('html','data-cookie-consent'),'rejected');
 if(real){assert(uid,'basic uid exists');assert.equal(await page.evaluate(()=>document.cookie.split(';').find(c=>c.trim().startsWith('_ym_uid='))?.trim()),uid);assert.equal(hitFlags.filter(x=>x.nohit!=='1'&&/(^|:)pv:1(:|$)/.test(x.browser||'')).length,pvBefore);assert(pvBefore>=2,'real initial and next-page hits acknowledged');}
 await page.evaluate(()=>localStorage.setItem('kp-cookie-consent',JSON.stringify({version:2,choice:'accepted',updatedAt:Date.now(),expiresAt:Date.now()+180*86400000})));
 await page.reload({waitUntil:'networkidle'});assert.equal(inits[3][0].webvisor,false);assert(await page.locator('#cookie-consent').isVisible());
 await page.goto(origin+'/lead/request/',{waitUntil:'networkidle'});const count=inits.length;await page.locator('[data-cookie-choice=accepted]').click();assert.equal(inits.length,count);
 assert.equal(failures.length,0,JSON.stringify(failures));
 console.log(JSON.stringify({status:'PASS',real,inits,acknowledgedPageviews:hitFlags.filter(x=>x.nohit!=='1'&&/(^|:)pv:1(:|$)/.test(x.browser||'')).length,nonPageviewInitializations:hitFlags.filter(x=>x.nohit==='1').length,checks:['basic before choice','reject preserves basic','accept no duplicate','next-page optional recording','masked forms','revoke reloads basic','no duplicate revoke hit','old v2 not accepted for optional','lead routes excluded'],failures}));
}finally{await ctx.close();await browser.close();}
