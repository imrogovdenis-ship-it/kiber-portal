import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
function boot(host='www.kiber-portal.ru',path='/',enabled='true'){
 const file='public/scripts/analytics-provider.js';assert.ok(existsSync(file),'consent-gated provider must exist');
 const listeners:Record<string,Function>={};const scripts:any[]=[];let reloads=0;
 const doc:any={currentScript:{dataset:{production:enabled}},documentElement:{dataset:{cookieConsent:'unset'}},referrer:'https://example.org/?email=private',querySelectorAll:()=>[],cookie:'',createElement:()=>({remove(){}}),head:{appendChild:(s:any)=>scripts.push(s)}};
 const win:any={addEventListener:(n:string,f:Function)=>listeners[n]=f,location:{hostname:host,pathname:path,origin:'https://'+host,search:'?email=private',hash:'',reload:()=>reloads++}};
 runInNewContext(readFileSync(file,'utf8'),{window:win,document:doc,location:win.location,URL,Date,MutationObserver:class{observe(){}}});
 return {win,doc,scripts,listeners,reloads:()=>reloads,choice:(choice:string)=>{doc.documentElement.dataset.cookieConsent=choice;listeners['kp:cookie-consent']?.({detail:{choice,version:2}})}};
}
test('provider is fail-closed, initializes once after consent, sanitizes URLs, stops on revoke',()=>{
 const h=boot();assert.equal(h.scripts.length,0);h.choice('rejected');assert.equal(h.scripts.length,0);
 h.choice('accepted');assert.equal(h.scripts.length,1);const init=h.win.ym.a[0];assert.equal(init[0],112523930);assert.equal(init[1],'init');assert.equal(init[2].webvisor,true);assert.equal(init[2].url,'https://www.kiber-portal.ru/');assert.equal(init[2].referrer,'https://example.org/');assert.equal(init[2].trackLinks,false);assert.equal(init[2].ecommerce,undefined);
 h.choice('accepted');assert.equal(h.scripts.length,1);h.choice('rejected');assert.equal(h.reloads(),1);
});
test('preview, other hosts and lead routes do not initialize provider',()=>{
 for(const [host,path,enabled] of [['localhost','/','true'],['www.kiber-portal.ru','/','false'],['www.kiber-portal.ru','/lead/request/','true'],['www.kiber-portal.ru','/lead/success/','true']]){const h=boot(host,path,enabled);h.choice('accepted');assert.equal(h.scripts.length,0);}
});

test('stale consent script v1 cannot activate new provider',()=>{
 const h=boot();h.doc.documentElement.dataset.cookieConsent='accepted';h.listeners['kp:cookie-consent']({detail:{choice:'accepted',version:1}});assert.equal(h.scripts.length,0);
});
