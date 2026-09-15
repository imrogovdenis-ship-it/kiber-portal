import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const file='public/scripts/analytics-provider-v4.js';
function boot(mode='off', session=new Map<string,string>(), adapter=file, savedOff=false, options:{path?:string,host?:string,production?:boolean}={}) {
 assert.ok(existsSync(file),'v4 adapter exists');
 const listeners:Record<string,Function>={};const scripts:any[]=[];const cookies:string[]=[];let reloads=0;
 const doc:any={currentScript:{dataset:{production:options.production===false?'false':'true'}},documentElement:{dataset:{}},referrer:'https://example.org/?private=yes',querySelectorAll:()=>[],get cookie(){return '_ym_uid=a; _ym_visorc=b; other=keep'},set cookie(v:string){cookies.push(v)},createElement:()=>({remove(){}}),head:{appendChild:(e:any)=>scripts.push(e)}};
 const location={hostname:options.host||'www.kiber-portal.ru',origin:'https://'+(options.host||'www.kiber-portal.ru'),pathname:options.path||'/',reload:()=>reloads++};
 const win:any={addEventListener:(n:string,f:Function)=>listeners[n]=f};
 const storage={getItem:(k:string)=>session.get(k)||null,setItem:(k:string,v:string)=>session.set(k,v),removeItem:(k:string)=>session.delete(k)};
 runInNewContext(readFileSync(adapter,'utf8'),{window:win,document:doc,location,localStorage:{getItem:()=>savedOff?JSON.stringify({version:4,mode:'off'}):null},sessionStorage:storage,URL,Date,MutationObserver:class{observe(){}}});
 const change=(m:string,source='load',persisted=true)=>listeners['kp:cookie-consent']?.({detail:{version:4,mode:m,source,persisted}});
 change(mode); return {win,doc,scripts,cookies,session,change,setSavedOff:()=>{savedOff=true},reloads:()=>reloads};
}
test('saved off does not insert SDK or queue init',()=>{const h=boot();assert.equal(h.scripts.length,0);assert.equal(h.win.ym,undefined)});

test('basic starts one safe init; banner permission waits until navigation',()=>{const h=boot('basic');assert.equal(h.scripts.length,1);const o=h.win.ym.a[0][2];assert.equal(o.webvisor,false);assert.equal(o.clickmap,false);assert.equal(o.trackLinks,false);assert.equal(o.url,'https://www.kiber-portal.ru/');assert.equal(o.referrer,'https://example.org/');h.change('extended','banner');assert.equal(h.reloads(),0);assert.equal(h.win.ym.a.length,1)});
test('extended starts replay, off cancels pending SDK queue and reloads without counting another view',()=>{const h=boot('extended');assert.equal(h.win.ym.a[0][2].webvisor,true);h.change('off','settings');assert.equal(h.reloads(),1);assert.equal(h.win.ym.a.length,0);assert(h.cookies.some(v=>v.startsWith('_ym_uid=')));assert(!h.cookies.some(v=>v.startsWith('other=')));h.scripts[0].onload();assert(h.win.ym.a.every((a:any)=>a[1]==='destruct'))});
test('loaded SDK is destroyed; settings downgrade reload suppresses only automatic hit',()=>{const h=boot('extended');h.scripts[0].onload();h.change('basic','settings');assert.equal(h.reloads(),1);assert(h.win.ym.a.some((a:any)=>a[1]==='destruct'));const next=boot('basic',h.session);assert.equal(next.win.ym.a[0][2].defer,true);assert.equal(boot('basic',h.session).win.ym.a[0][2].defer,false)});
test('failed preference persistence stops analytics without reloading into stale permission',()=>{const h=boot('extended');h.scripts[0].onload();h.change('off','settings',false);assert.equal(h.reloads(),0);assert(h.win.ym.a.some((a:any)=>a[1]==='destruct'))});

function controller(saved:string|null=null, blocked=false) {
 const path='public/scripts/cookie-consent-v4.js';assert.ok(existsSync(path),'v4 preference controller exists');
 const values=new Map<string,string>();if(saved!==null)values.set('kp-cookie-consent',saved);
 const events:any[]=[];const timers:any[]=[];const handlers:any={};const buttons=['accepted','rejected'].map(choice=>({dataset:{cookieChoice:choice},addEventListener:(n:string,f:Function)=>handlers[choice]=f}));
 const banner:any={dataset:{},hidden:true,querySelector:()=>null,querySelectorAll:()=>buttons,getBoundingClientRect:()=>({height:100})};
 const doc:any={documentElement:{dataset:{},style:{setProperty(){}}},getElementById:(id:string)=>id==='cookie-consent'?banner:null,querySelector:()=>null,addEventListener:(n:string,f:Function)=>handlers[n]=f};
 const win:any={addEventListener:(n:string,f:Function)=>handlers[n]=f,dispatchEvent:(e:any)=>events.push(e.detail)};
 const localStorage={getItem:(k:string)=>{if(blocked)throw Error('blocked');return values.get(k)||null},setItem:(k:string,v:string)=>{if(blocked)throw Error('blocked');values.set(k,v)},removeItem:(k:string)=>values.delete(k)};
 const sessionStorage={getItem:()=>null,setItem(){},removeItem(){}};
 runInNewContext(readFileSync(path,'utf8'),{window:win,document:doc,localStorage,sessionStorage,setTimeout:(fn:Function,delay:number)=>{timers.push({fn,delay});return timers.length},clearTimeout:()=>{},Date,Number,location:{hash:''},CustomEvent:class{detail:any;constructor(type:string,o:any){this.detail=o.detail}}});
 return {events,timers,banner,doc,handlers,values};
}
const record=(mode:string,offset=0)=>{const now=Date.now()+offset;return JSON.stringify({version:4,mode,updatedAt:now,expiresAt:mode==='off'?null:now+180*86400000});};
test('controller defaults basic only for a missing record; corruption and blocked storage fail closed',()=>{const h=controller();assert.equal(h.events[0].mode,'basic');assert.equal(h.banner.hidden,false);assert.equal(controller('{broken').events[0].mode,'off');assert.equal(controller(null,true).events[0].mode,'off')});
test('off never expires; expired permission is basic with renewal; v3 cannot enable extended',()=>{assert.equal(controller(record('off',-400*86400000)).events[0].mode,'off');const expired=controller(record('extended',-181*86400000));assert.equal(expired.events[0].mode,'basic');assert.equal(expired.banner.hidden,false);assert.equal(controller(JSON.stringify({version:3,choice:'accepted'})).events[0].mode,'basic')});
test('banner stores separate extended/basic choices and sends source for deferred permission',()=>{const h=controller();h.handlers.accepted();assert.equal(JSON.parse(h.values.get('kp-cookie-consent')!).mode,'extended');assert.equal(h.events.at(-1).source,'banner');assert.equal(h.banner.hidden,true);h.handlers.rejected();assert.equal(JSON.parse(h.values.get('kp-cookie-consent')!).mode,'basic')});
test('storage event and restored pages re-read persistent off',()=>{const h=controller(record('extended'));h.values.set('kp-cookie-consent',record('off'));h.handlers.storage({key:'kp-cookie-consent'});assert.equal(h.events.at(-1).mode,'off');h.handlers.pageshow({persisted:true});assert.equal(h.events.at(-1).source,'restore')});

test('approved UI uses exact banner, no footer settings shortcut, and policy-only bottom panel',()=>{
 const banner=readFileSync('src/components/layout/CookieConsent.astro','utf8');
 assert(banner.includes('Мы собираем базовую статистику посещений чтобы понимать, какие страницы востребованы, и улучшать сайт.'));
 assert(!banner.includes('независимо от выбора ниже'));assert(banner.includes('>Разрешить</button>'));
 const footer=readFileSync('src/components/layout/Footer.astro','utf8');assert(!footer.includes('data-cookie-settings'));assert(footer.includes("href: '/cookie-policy'"));
 const legal=readFileSync('src/components/legal/LegalDocumentPage.astro','utf8');assert(legal.includes("slug === 'cookie-policy'"));assert(legal.indexOf('<AnalyticsSettings')>legal.indexOf('</article>'));assert(legal.indexOf('<AnalyticsSettings')<legal.indexOf('<nav class="legal-page__links"'));
 const settings=readFileSync('src/components/legal/AnalyticsSettings.astro','utf8');for(const value of ['off','basic','extended'])assert(settings.includes('value="'+value+'"'));
 const layout=readFileSync('src/layouts/BaseLayout.astro','utf8');assert(layout.includes('/scripts/analytics-provider-v4.js'));assert(banner.includes('/scripts/cookie-consent-v4.js'));
});

test('four legal documents match three modes and policy-only management',()=>{
 const docs=JSON.parse(readFileSync('data/legal/legal-documents.json','utf8')).documents;const text=(slug:string)=>docs.find((d:any)=>d.slug===slug).paragraphs.join(' ');
 const cookie=text('cookie-policy');for(const phrase of ['Без аналитики','Только базовая аналитика','Базовая аналитика и запись действий','внизу этой страницы','до изменения Пользователем','ранее переданных'])assert(cookie.includes(phrase),phrase);
 assert(!cookie.includes('не отключают базовую Метрику'));assert(!cookie.includes('внизу любой страницы'));assert(!cookie.includes('«Принять»'));
 assert(text('privacy-policy').includes('Без аналитики'));assert(text('consent').includes('не является разрешением на дополнительную аналитику'));assert(text('terms').includes('не ограничивает доступ к каталогу'));
});

test('delivered legacy v3 honors saved v4 off before inserting SDK',()=>{assert.equal(boot('off',new Map(),'public/scripts/analytics-provider-v3.js',true).scripts.length,0)});
test('delivered legacy v3 stops existing basic SDK on a v4 full refusal',()=>{const h=boot('basic',new Map(),'public/scripts/analytics-provider-v3.js');h.scripts[0].onload();h.setSavedOff();h.change('off','storage');assert.equal(h.reloads(),1);assert(h.win.ym.a.some((a:any)=>a[1]==='destruct'))});

test('permission from fail-closed off still defers recording until navigation',()=>{const h=boot('off');h.change('extended','banner');assert.equal(h.reloads(),0);assert.equal(h.win.ym.a[0][2].webvisor,false);h.change('extended','sync');assert.equal(h.reloads(),0)});
test('SDK destruct exception cannot prevent a saved full refusal reload',()=>{const h=boot('extended');h.scripts[0].onload();h.win.ym=()=>{throw Error('provider failure')};assert.doesNotThrow(()=>h.change('off','settings'));assert.equal(h.reloads(),1)});
test('active tab schedules bounded expiry and rechecks stored permission',()=>{const h=controller(record('extended'));assert(h.timers.length>0);assert(h.timers[0].delay>0&&h.timers[0].delay<=2147483647);h.values.set('kp-cookie-consent',record('extended',-181*86400000));h.timers[0].fn();assert.equal(h.events.at(-1).mode,'basic');assert.equal(h.events.at(-1).source,'expiry')});

test('combined write/destruct failure reloads only with verified session refusal',()=>{const h=boot('extended');h.scripts[0].onload();h.win.ym=()=>{throw Error('teardown failed')};h.session.set('kp-analytics-session-denied','1');h.change('off','settings',false);assert.equal(h.reloads(),1)});
test('without safe persistence, failed teardown is explicitly unconfirmed',()=>{const h=boot('extended');h.scripts[0].onload();h.win.ym=()=>{throw Error('teardown failed')};h.change('off','settings',false);assert.equal(h.reloads(),0);assert.equal(h.doc.documentElement.dataset.analyticsStopFailed,'true')});

test('owner-approved thanks URL has a clean pageview without replay',()=>{
 for(const path of ['/lead/thanks/','/lead/thanks'])for(const mode of ['basic','extended']){
  const h=boot(mode,new Map(),file,false,{path});assert.equal(h.scripts.length,1);
  const o=h.win.ym.a[0][2];assert.equal(o.url,'https://www.kiber-portal.ru'+path);
  assert.equal(o.webvisor,false);assert.equal(o.clickmap,false);assert.equal(o.defer,false);
 }
});
test('thanks exception preserves off, preview and other protected routes',()=>{
 assert.equal(boot('off',new Map(),file,false,{path:'/lead/thanks/'}).scripts.length,0);
 for(const path of ['/lead/request/','/lead/thanks/extra','/api/leads/','/success/','/thank-you/'])assert.equal(boot('basic',new Map(),file,false,{path}).scripts.length,0,path);
 assert.equal(boot('basic',new Map(),file,false,{path:'/lead/thanks/',host:'jino-preview.kiber-portal.ru'}).scripts.length,0);
 assert.equal(boot('basic',new Map(),file,false,{path:'/lead/thanks/',production:false}).scripts.length,0);
});
