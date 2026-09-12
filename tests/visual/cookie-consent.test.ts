import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';

test('shared layout renders a non-modal cookie choice with equal accept/reject actions',()=>{
 const path='src/components/layout/CookieConsent.astro';
 assert.ok(existsSync(path),'shared consent component must exist');
 const c=readFileSync(path,'utf8');
 assert.match(c,/data-cookie-choice="accepted"/);assert.match(c,/data-cookie-choice="rejected"/);
 assert.match(c,/role="region"/);assert.match(c,/href="\/cookie-policy\/"/);
 const layout=readFileSync('src/layouts/BaseLayout.astro','utf8');assert.match(layout,/<CookieConsent\s*\/>/);
});

test('neutral analytics is fail-closed until optional consent',()=>{
 const source=readFileSync('src/lib/analytics.ts','utf8');
 assert.match(source,/dataset.cookieConsent !== 'accepted'/);
});

test('analytics dispatch actually stops on absent/rejected/revoked consent',async()=>{
 const {transform}=await import('esbuild');const {runInNewContext}=await import('node:vm');
 const source=readFileSync('src/lib/analytics.ts','utf8');const built=await transform(source,{loader:'ts',format:'iife',globalName:'analytics',define:{'import.meta.env.DEPLOY_ENV':'"production"'}});
 const sent: unknown[]=[];const document={documentElement:{dataset:{cookieConsent:'unset'}}};
 const context:Record<string,any>={document,window:{dispatchEvent:(e:unknown)=>sent.push(e)},CustomEvent:class{constructor(public type:string,public options:unknown){}}};
 runInNewContext(built.code,context);const event={name:'robot_card_click',payload:{robot_slug:'sample',block_id:'robot-card',placement:'catalog'}};
 context.analytics.track(event);assert.equal(sent.length,0);
 document.documentElement.dataset.cookieConsent='rejected';context.analytics.track(event);assert.equal(sent.length,0);
 document.documentElement.dataset.cookieConsent='accepted';context.analytics.track(event);assert.equal(sent.length,1);
 document.documentElement.dataset.cookieConsent='rejected';context.analytics.track(event);assert.equal(sent.length,1);
});
