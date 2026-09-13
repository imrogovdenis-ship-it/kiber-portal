import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true});let issues=[];
try {for(const width of [390,768,1440]) {
const page=await browser.newPage({viewport:{width,height:900}});await page.goto(process.argv[2]+'/roboty-sobaki/',{waitUntil:'networkidle'});
const reject=page.getByRole('button',{name:'Отклонить',exact:true});if(await reject.isVisible())await reject.click();
const images=page.locator('.humanoid-template__gallery-item img');
for(let i=0;i<await images.count();i++){await images.nth(i).scrollIntoViewIfNeeded();await images.nth(i).evaluate(i=>i.decode());}
const data=await images.evaluateAll(imgs=>imgs.map(i=>{const r=i.getBoundingClientRect(),f=i.parentElement.getBoundingClientRect();return {src:i.src,width:r.width,height:r.height,frameWidth:f.width,frameHeight:f.height,ratio:i.naturalWidth/i.naturalHeight,pad:Math.abs(r.width-r.height*i.naturalWidth/i.naturalHeight)};}));
console.log(width,JSON.stringify(data));for(const d of data)if(d.pad>1||Math.abs(d.frameWidth-d.width)>1||Math.abs(d.frameHeight-d.height)>1)issues.push({width,...d});
await images.nth(4).scrollIntoViewIfNeeded();await page.screenshot({path:process.argv[3]+'/'+width+'.png'});await page.close();
}}finally{await browser.close();}assert.equal(issues.length,0,JSON.stringify(issues));
