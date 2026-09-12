import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
function boot(initial='unset',storage=new Map<string,string>(),host='www.kiber-portal.ru',path='/'){
 const file='public/scripts/analytics-provider-v3.js';assert.ok(existsSync(file),'split provider exists');const listeners:any={};const scripts:any[]=[];let reloads=0;const cookieWrites:string[]=[];
 const doc:any={currentScript:{dataset:{production:'true'}},documentElement:{dataset:{cookieConsent:initial}},referrer:'https://example.org/?email=private',querySelectorAll:()=>[],get cookie(){return '_ym_uid=keep; _ym_visorc=optional'},set cookie(v:string){cookieWrites.push(v)},createElement:()=>({remove(){}}),head:{appendChild:(s:any)=>scripts.push(s)}};
 const win:any={addEventListener:(n:string,f:any)=>listeners[n]=f,location:{hostname:host,pathname:path,origin:'https://'+host,reload:()=>reloads++}};
 const sessionStorage={getItem:(k:string)=>storage.get(k)||null,setItem:(k:string,v:string)=>storage.set(k,v),removeItem:(k:string)=>storage.delete(k)};
 runInNewContext(readFileSync(file,'utf8'),{window:win,document:doc,location:win.location,sessionStorage,URL,Date,MutationObserver:class{observe(){}}});
 const choice=(value:string,version=3)=>{doc.documentElement.dataset.cookieConsent=value;listeners['kp:cookie-consent']?.({detail:{choice:value,version}})};choice(initial);
 return {win,scripts,choice,reloads:()=>reloads,storage,doc,cookieWrites};
}
test('basic collection starts without consent; accept enables replay only on subsequent navigation',()=>{
 const h=boot();assert.equal(h.scripts.length,1);const init=h.win.ym.a[0];assert.equal(init[2].webvisor,false);assert.equal(init[2].clickmap,false);assert.equal(init[2].trackLinks,false);assert.equal(init[2].url,'https://www.kiber-portal.ru/');h.choice('rejected');assert.equal(h.reloads(),0);h.choice('accepted');assert.equal(h.win.ym.a.length,1);assert.equal(boot('accepted').win.ym.a[0][2].webvisor,true);
});
test('revoke destroys recorder, preserves basic identity and suppresses only automatic reload hit',()=>{
 const h=boot('accepted');h.scripts[0].onload();h.choice('rejected');assert.equal(h.reloads(),1);assert(h.win.ym.a.some((a:any)=>a[1]==='destruct'));assert(h.cookieWrites.length>0);assert(h.cookieWrites.every((v:string)=>v.startsWith('_ym_visorc=')));
 const next=boot('rejected',h.storage);assert.equal(next.win.ym.a[0][2].webvisor,false);assert.equal(next.win.ym.a[0][2].defer,true);assert.equal(boot('rejected',h.storage).win.ym.a[0][2].defer,false);
});
test('old consent events never enable replay; nonproduction hosts and lead routes stay excluded',()=>{
 const h=boot();h.choice('accepted',2);assert.equal(h.win.ym.a[0][2].webvisor,false);
 for(const [host,path] of [['localhost','/'],['www.kiber-portal.ru','/lead/request/']])assert.equal(boot('accepted',new Map(),host,path).scripts.length,0);
});
