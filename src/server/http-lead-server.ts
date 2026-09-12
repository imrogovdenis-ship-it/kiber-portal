import {isIP} from 'node:net';
import {createServer} from 'node:http';
import {handleLeadRequest,type EnvLike,type LeadRequestOptions} from './lead-routing/api-leads';
export function createLeadServer(env:EnvLike,options:LeadRequestOptions={}){
 return createServer(async(req,res)=>{
  try{
   const path=new URL(req.url||'/', 'http://api.internal').pathname;
   const liveConfigured=['AMOCRM_BASE_URL','AMOCRM_ACCESS_TOKEN','TELEGRAM_BOT_TOKEN','TELEGRAM_LEADS_CHAT_ID','LEAD_ALLOWED_ORIGINS'].every(key=>Boolean(env[key]?.trim()));
   const productionAllowed=env.DEPLOY_ENV!=='production'||(env.LEAD_ROUTING_MODE==='live'&&env.LEAD_PRODUCTION_APPROVED==='true');
   const available=productionAllowed&&env.LEAD_ROUTING_ENABLED==='true'&&(env.LEAD_ROUTING_MODE==='dry-run'||(env.LEAD_ROUTING_MODE==='live'&&liveConfigured));
   if(path==='/healthz/'){res.writeHead(200,{'content-type':'application/json'});res.end('{"ok":true}');return;}
   if(path==='/api/leads/status'){res.writeHead(available?200:503,{'content-type':'application/json','cache-control':'no-store'});res.end(JSON.stringify({ok:available,mode:available?env.LEAD_ROUTING_MODE:'disabled'}));return;}
   if(path!=='/api/leads'&&path!=='/api/leads/'){res.writeHead(404);res.end();return;}
   if(req.method!=='POST'){res.writeHead(405,{allow:'POST'});res.end();return;}
   if(!available){
    res.writeHead(503,{'content-type':'application/json','cache-control':'no-store'});res.end('{"ok":false,"error":"lead service unavailable"}');return;
   }
   const parts:Buffer[]=[];let bytes=0;
   for await(const chunk of req){bytes+=chunk.length;if(bytes>65536){res.writeHead(413,{'content-type':'application/json','connection':'close'});res.end('{"ok":false,"error":"payload too large"}');return;}parts.push(Buffer.from(chunk));}
   const headers=new Headers();for(const [key,value] of Object.entries(req.headers))if(value)headers.set(key,Array.isArray(value)?value.join(','):value);
   const trustedHeader=env.LEAD_TRUSTED_CLIENT_IP_HEADER?.toLowerCase();
   const clientIp=trustedHeader?req.headers[trustedHeader]:undefined;
   if(typeof clientIp==='string'&&isIP(clientIp))headers.set('x-forwarded-for',clientIp);
   const request=new Request('http://api.internal'+req.url,{method:req.method,headers,...(req.method==='POST'?{body:Buffer.concat(parts)}:{})});
   const response=await handleLeadRequest(request,env,fetch,options);res.writeHead(response.status,Object.fromEntries(response.headers));res.end(await response.text());
  }catch{res.writeHead(500,{'content-type':'application/json'});res.end('{"ok":false,"error":"internal error"}');}
 });
}
