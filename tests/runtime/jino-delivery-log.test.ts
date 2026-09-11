import assert from 'node:assert/strict';
import {test} from 'node:test';
import {createLeadServer} from '../../src/server/http-lead-server';
test('HTTP runtime emits source-handler receipt without name or contact data',async()=>{
 const events:unknown[]=[];const server=createLeadServer({DEPLOY_ENV:'jino-log-test',LEAD_ROUTING_ENABLED:'true',LEAD_ROUTING_MODE:'dry-run'},{logSink:event=>events.push(event)});
 await new Promise<void>(r=>server.listen(0,'127.0.0.1',r));const addr=server.address();assert(addr&&typeof addr!=='string');
 try{const r=await fetch(`http://127.0.0.1:${addr.port}/api/leads`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name:'Sensitive Name Fixture',contact:'private-fixture@example.invalid',privacy_consent:'true'})});assert.equal(r.status,202);assert.equal(events.length,1);const text=JSON.stringify(events);assert.match(text,/lead.delivery.completed/);assert(!text.includes('Sensitive Name Fixture'));assert(!text.includes('private-fixture@example.invalid'));}finally{server.closeAllConnections();await new Promise<void>(r=>server.close(()=>r()));}
});
