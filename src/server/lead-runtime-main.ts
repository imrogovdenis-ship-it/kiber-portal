import {createLeadServer} from './http-lead-server';
const server=createLeadServer(process.env,process.env.LEAD_STRUCTURED_LOGGING==='true'?{logSink:event=>console.log(JSON.stringify(event))}:{});
server.requestTimeout=15000;
server.headersTimeout=10000;
server.keepAliveTimeout=5000;
server.listen(Number(process.env.PORT||8081),process.env.HOST||'127.0.0.1',()=>{
 const address=server.address();console.log(JSON.stringify({event:'lead.runtime.listening',port:address&&typeof address!=='string'?address.port:null}));
});
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>{server.close(()=>process.exit(0));setTimeout(()=>process.exit(1),5000).unref();});
