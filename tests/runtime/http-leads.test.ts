import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {test} from 'node:test';
import type {Server} from 'node:http';
const env={DEPLOY_ENV:'preview',LEAD_ROUTING_ENABLED:'true',LEAD_ROUTING_MODE:'dry-run'};
async function withServer(config:Record<string,string>,run:(base:string)=>Promise<void>){
 assert(existsSync('src/server/http-lead-server.ts'),'shipped HTTP API runtime must exist');
 const {createLeadServer}=await import('../../src/server/http-lead-server');
 const server:Server=createLeadServer(config);
 await new Promise<void>(r=>server.listen(0,'127.0.0.1',r));
 const addr=server.address();assert(addr&&typeof addr!=='string');
 try{await run(`http://127.0.0.1:${addr.port}`);}finally{server.closeAllConnections();await new Promise<void>(r=>server.close(()=>r()));}
}
const payload={name:'QA no delivery',contact:'+70000000000',privacy_consent:'on',robot:'arenda-unitree-g1'};
test('real HTTP POST executes the source handler in credential-free dry-run',()=>withServer(env,async base=>{
 const response=await fetch(base+'/api/leads',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});
 assert.equal(response.status,202);const body=await response.json();assert.equal(body.mode,'dry-run');assert.equal(body.channels.amoCRM.skipped,'dry-run');assert.equal(body.channels.telegram.skipped,'dry-run');
}));

test('disabled runtime fails closed rather than accepting a lost lead',()=>withServer({},async base=>{
 const response=await fetch(base+'/api/leads',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});assert.equal(response.status,503);assert.equal((await response.json()).ok,false);
}));

test('API distinguishes liveness, readiness, missing paths and method errors',()=>withServer({},async base=>{
 assert.equal((await fetch(base+'/healthz/')).status,200);
 assert.equal((await fetch(base+'/api/leads/status')).status,503);
 assert.equal((await fetch(base+'/not-an-api')).status,404);
 assert.equal((await fetch(base+'/api/leads')).status,405);
}));

test('oversized bodies are rejected before reaching the handler',()=>withServer(env,async base=>{
 const response=await fetch(base+'/api/leads',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({...payload,event:'x'.repeat(70000)})});assert.equal(response.status,413);
}));

test('live without credentials is unready and never accepts a lead',()=>withServer({...env,LEAD_ROUTING_MODE:'live'},async base=>{
 assert.equal((await fetch(base+'/api/leads/status')).status,503);
 assert.equal((await fetch(base+'/api/leads',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)})).status,503);
}));

test('production cannot report dry-run as successful delivery',()=>withServer({...env,DEPLOY_ENV:'production'},async base=>{
 assert.equal((await fetch(base+'/api/leads/status')).status,503);
}));
