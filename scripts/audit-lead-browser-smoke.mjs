import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const component = readFileSync('src/components/layout/ContactLeadFormPopup.astro','utf8').split('---')[2].split('<script')[0].replace('action={formAction}', 'action="/api/leads"');
const script = readFileSync('public/scripts/contact-lead-form-popup.js','utf8');
const browser = await chromium.launch({headless:true});
try {
 const page = await browser.newPage();
 await page.route('**/*', route => route.fulfill({contentType:'text/html',body:`<html><body><a id="open" href="/lead/request/">Open</a>${component}<a id="outside" href="/contacts/">Outside</a></body></html>`}));
 await page.goto('http://audit.test/');
 await page.addScriptTag({content:script});
 await page.click('#open');
 for(let i=0;i<20;i++) {
  await page.keyboard.press('Tab');
  assert.ok(await page.evaluate(()=>document.querySelector('[role=dialog]').contains(document.activeElement)), 'F07 focus left dialog at Tab '+(i+1));
 }
 for(let i=0;i<20;i++) {
  await page.keyboard.press('Shift+Tab');
  assert.ok(await page.evaluate(()=>document.querySelector('[role=dialog]').contains(document.activeElement)), 'F07 reverse focus left dialog');
 }
 await page.keyboard.press('Escape');
 assert.equal(await page.evaluate(()=>document.activeElement.id),'open');
 assert.equal(await page.locator('#outside').evaluate(e=>e.inert),false);
 console.log('PASS F07 40 forward/reverse focus checks, Escape, focus restoration');
} finally { await browser.close(); }
