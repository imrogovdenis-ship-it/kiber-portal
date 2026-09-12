import {createServer} from 'node:http';
import {readFileSync,existsSync,statSync} from 'node:fs';
import {resolve,extname,sep} from 'node:path';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const root=resolve('dist');const server=createServer((req,res)=>{let path=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://local').pathname));if(!path.startsWith(root+sep)&&path!==root){res.writeHead(403).end();return;}if(existsSync(path)&&statSync(path).isDirectory())path+='/index.html';if(!existsSync(path)){res.writeHead(404).end();return;}res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.html':'text/html','.svg':'image/svg+xml','.json':'application/json'})[extname(path)]||'application/octet-stream');res.end(readFileSync(path));});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin=`http://127.0.0.1:${server.address().port}`;const browser=await chromium.launch();
const evidence=[];
try {
 for(const width of [320,360,390,430,768,1440]){
  const context=await browser.newContext({viewport:{width,height:width===320?568:900}});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));const trackers=[];page.on('request',r=>{if(/mc\.yandex|metrika|google-analytics|umami|top\.mail\.ru|vk\.com\/rtrg/.test(r.url()))trackers.push(r.url());});
  await page.goto(origin,{waitUntil:'networkidle'});assert(await page.locator('#cookie-consent').isVisible());
  const geometry=await page.evaluate(()=>{const box=document.getElementById('cookie-consent').getBoundingClientRect();const buttons=[...document.querySelectorAll('[data-cookie-choice]')].map(e=>{const b=e.getBoundingClientRect();return {width:b.width,height:b.height,right:b.right,bottom:b.bottom};});return {right:box.right,bottom:box.bottom,width:innerWidth,height:innerHeight,overflow:document.documentElement.scrollWidth>innerWidth,buttons};});
  assert(!geometry.overflow);assert(geometry.right<=width+1);assert(Math.abs(geometry.bottom-geometry.height)<2);assert(Math.abs(geometry.buttons[0].width-geometry.buttons[1].width)<1);assert(geometry.buttons.every(b=>b.height>=44&&b.right<=width+1&&b.bottom<=geometry.height+1));
  assert.equal(await page.getAttribute('html','data-cookie-consent'),'unset');
  await page.locator('[data-cookie-choice=rejected]').click();assert(!(await page.locator('#cookie-consent').isVisible()));assert.equal(await page.getAttribute('html','data-cookie-consent'),'rejected');
  await page.reload({waitUntil:'networkidle'});assert(!(await page.locator('#cookie-consent').isVisible()));
  await page.goto(origin+'/robots/arenda-uv-box/',{waitUntil:'networkidle'});assert.equal(await page.getAttribute('html','data-cookie-consent'),'rejected');
  await page.locator('[data-cookie-settings]').click();assert(await page.locator('#cookie-consent').isVisible());
  await page.locator('[data-cookie-choice=accepted]').click();await page.reload({waitUntil:'networkidle'});assert.equal(await page.getAttribute('html','data-cookie-consent'),'accepted');assert(!(await page.locator('#cookie-consent').isVisible()));
  await page.locator('[data-cookie-settings]').click();await page.locator('[data-cookie-choice=rejected]').click();assert.equal(await page.getAttribute('html','data-cookie-consent'),'rejected');
  await page.evaluate(()=>localStorage.setItem('kp-cookie-consent','{broken'));await page.reload({waitUntil:'networkidle'});assert(await page.locator('#cookie-consent').isVisible());assert.equal(await page.getAttribute('html','data-cookie-consent'),'unset');
  await page.evaluate(()=>localStorage.setItem('kp-cookie-consent',JSON.stringify({version:1,choice:'accepted',updatedAt:0,expiresAt:1})));await page.reload({waitUntil:'networkidle'});assert.equal(await page.getAttribute('html','data-cookie-consent'),'unset');
  await page.goto(origin+'/cookie-policy/',{waitUntil:'networkidle'});assert(await page.locator('#cookie-consent a').isVisible());assert.equal(errors.length,0,JSON.stringify(errors));assert.equal(trackers.length,0,JSON.stringify(trackers));
  evidence.push({width,geometry,passed:'first visit, reject, persist, route, accept, revoke, corrupt, expired, policy, no trackers/JS errors'});await context.close();
 }
 const context=await browser.newContext();await context.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new DOMException('blocked','SecurityError')}}));const p=await context.newPage();await p.goto(origin,{waitUntil:'networkidle'});assert(await p.locator('#cookie-consent').isVisible());await p.locator('[data-cookie-choice=rejected]').click();assert.equal(await p.getAttribute('html','data-cookie-consent'),'rejected');await p.reload({waitUntil:'networkidle'});assert(await p.locator('#cookie-consent').isVisible());await context.close();
 console.log(JSON.stringify({status:'PASS',cases:evidence,blockedStorage:'PASS'}));
}finally{await browser.close();await new Promise(r=>server.close(r));}
