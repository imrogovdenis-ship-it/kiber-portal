import {chromium} from 'playwright';
import {readFileSync,readdirSync,existsSync,statSync} from 'node:fs';
import {resolve,extname,sep,relative} from 'node:path';
import assert from 'node:assert/strict';
const root=resolve('dist'),origin='https://jino-preview.kiber-portal.ru',css='/styles/internal-muted-contrast-v1.css';
function walk(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(resolve(dir,e.name)):[resolve(dir,e.name)]);}
const html=walk(root).filter(f=>f.endsWith('.html'));assert.ok(html.length>=50);
for(const f of html){const body=readFileSync(f,'utf8');const count=body.split(css).length-1;assert.equal(count,relative(root,f)==='index.html'?0:1,relative(root,f));}
const browser=await chromium.launch({headless:true});const results=[];
try{for(const width of [390,1280])for(const path of ['/','/robots/arenda-unitree-g1/','/articles/unitree-g1-agibot-x2-kakogo-robota-vybrat/','/roboty-gumanoidy/','/privacy-policy/']){
 const page=await browser.newPage({viewport:{width,height:900}});let enabled=false;
 await page.route('**/*',route=>{const u=new URL(route.request().url());if(u.origin!==origin||route.request().method()!=='GET')return route.abort();
 let f=resolve(root,'.'+decodeURIComponent(u.pathname));if(!f.startsWith(root+sep)&&f!==root)return route.abort();if(existsSync(f)&&statSync(f).isDirectory())f+='/index.html';if(!existsSync(f))return route.fulfill({status:404,body:''});
 const body=u.pathname===css&&!enabled?'':readFileSync(f);return route.fulfill({status:200,contentType:({'.html':'text/html','.css':'text/css','.js':'application/javascript','.svg':'image/svg+xml','.webp':'image/webp','.woff2':'font/woff2'})[extname(f)]||'application/octet-stream',body});});
 async function snapshot(){await page.goto(origin+path,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);return page.evaluate(()=>[...document.querySelectorAll('body *')].filter(e=>[...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim())&&e.getBoundingClientRect().width&&e.getBoundingClientRect().height&&getComputedStyle(e).visibility==='visible').map(e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return {tag:e.tagName,text:e.textContent,grayMix:!!e.closest('.home-gosha__signature'),color:s.color,bg:s.backgroundColor,metrics:[r.x,r.y,r.width,r.height].map(n=>Math.round(n*100)/100),font:[s.fontFamily,s.fontSize,s.fontWeight,s.lineHeight,s.letterSpacing]};}));}
 const before=await snapshot();enabled=true;const after=await snapshot();assert.equal(before.length,after.length);let changed=0;
 for(let i=0;i<before.length;i++){const a=before[i],b=after[i];assert.equal(a.text,b.text);assert.deepEqual(a.metrics,b.metrics,`${path} geometry ${a.tag}`);assert.deepEqual(a.font,b.font);assert.equal(a.bg,b.bg);if(a.color!==b.color){changed++;assert.notEqual(path,'/');if(a.color==='rgb(121, 122, 145)')assert.equal(b.color,'rgb(110, 111, 132)');else assert.ok(a.grayMix,`unapproved color ${a.color} -> ${b.color}`);}}
 if(path!=='/')assert.ok(changed>0,`${path} ${width}: missing gray change`);else assert.equal(changed,0);
 assert.equal(await page.evaluate(()=>!!window.kpMetricaInstalled),false);results.push({path,width,changed,geometry:'unchanged',otherColors:'unchanged'});await page.close();
}}finally{await browser.close();}
console.log(JSON.stringify({status:'PASS',builtPages:html.length,results}));
