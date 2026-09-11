import assert from 'node:assert/strict';
import {test} from 'node:test';
import {createLeadServer} from '../../src/server/http-lead-server';
test('authenticated Jino transport keeps rate limits per actual client, not proxy IP',async()=>{
 const server=createLeadServer({DEPLOY_ENV:'jino-ip-test',LEAD_ROUTING_ENABLED:'true',LEAD_ROUTING_MODE:'dry-run',LEAD_RATE_LIMIT_MAX:'1',LEAD_TRUSTED_CLIENT_IP_HEADER:'x-kiber-client-ip'});
 await new Promise<void>(r=>server.listen(0,'127.0.0.1',r));const addr=server.address();assert(addr&&typeof addr!=='string');
 const send=(ip:string)=>fetch(`http://127.0.0.1:${addr.port}/api/leads`,{method:'POST',headers:{'content-type':'application/json','x-forwarded-for':'192.0.2.1','x-kiber-client-ip':ip},body:JSON.stringify({name:'dry-run',contact:'diagnostic@example.invalid',privacy_consent:'true'})});
 try{assert.equal((await send('198.51.100.10')).status,202);assert.equal((await send('198.51.100.20')).status,202);assert.equal((await send('198.51.100.10')).status,429);}finally{server.closeAllConnections();await new Promise<void>(r=>server.close(()=>r()));}
});
