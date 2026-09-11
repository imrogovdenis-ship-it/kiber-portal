import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {test} from 'node:test';
const strings=(v:unknown):string[]=>typeof v==='string'?[v]:v&&typeof v==='object'?Object.values(v).flatMap(strings):[];
for(const [slug,brand,short] of [['arenda-unitree-g1','Unitree','G1'],['arenda-agibot-x2','Agibot','X2']]){
 test(`${brand} ${short}: full model names predominate in the editable visible copy`,()=>{
  const d=JSON.parse(readFileSync(`data/content/robot-card-pilot/${slug}.json`,'utf8'));const text=strings(d.blocks).join(' ');
  const full=(text.match(new RegExp(`\\b${brand}\\s+${short}\\b`,'g'))||[]).length;
  const total=(text.match(new RegExp(`\\b${short}\\b`,'g'))||[]).length;
  assert(full>2*(total-full),`full=${full}, bare=${total-full}; editorial guard, not a keyword-density target`);
  assert.equal(d.blocks.capabilities.length,6);assert.equal(d.blocks.scenarios.length,6);assert.equal(d.blocks.faq.length,8);
  assert(d.blocks.aiSummary.includes(`${brand} ${short}`));assert(d.blocks.goshaQuote.includes(`${brand} ${short}`));
  assert(!text.includes(`${brand} ${brand}`));assert(d.seo.secondaryKeywords.every((x:string)=>x.includes(`${brand} ${short}`)));
 });
}
