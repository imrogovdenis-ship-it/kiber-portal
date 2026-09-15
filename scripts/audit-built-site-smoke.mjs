import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';
const root = process.env.AUDIT_DIST || 'dist';
const files = (dir) => readdirSync(dir,{withFileTypes:true}).flatMap(e => e.isDirectory() ? files(join(dir,e.name)) : e.name.endsWith('.html') ? [join(dir,e.name)] : []);
let count=0;
for (const file of files(root)) {
 const html=readFileSync(file,'utf8');
 let crumbs=0;
 const walk=(value)=>{if(!value || typeof value!=='object')return;if(value['@type']==='BreadcrumbList')crumbs++;for(const v of Object.values(value))walk(v);};
 for(const match of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g))walk(JSON.parse(match[1]));
 assert.ok(crumbs<=1, `${file}: ${crumbs} BreadcrumbList objects`);
 for(const match of html.matchAll(/<(h[123])\b[^>]*>([\s\S]*?)<\/\1>/g))assert.ok(match[2].replace(/<[^>]*>/g,'').trim(), `${file}: empty ${match[1]}`);
 count++;
}
console.log(`PASS ${count} built pages: unique BreadcrumbList and nonempty H1–H3`);
