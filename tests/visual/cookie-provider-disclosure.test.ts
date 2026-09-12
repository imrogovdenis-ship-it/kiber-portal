import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('banner keeps provider details in linked policy and removes obsolete disabled claim',()=>{
 const banner=readFileSync('src/components/layout/CookieConsent.astro','utf8');
 assert.ok(!banner.includes('Сейчас счётчики и рекламные пиксели отключены.'));
 assert.ok(!/Вебвизор|Яндекс/.test(banner));
 assert.ok(banner.includes('href="/cookie-policy/"'));
});

test('linked cookie policy discloses providers, consent renewal and limits on recording',()=>{
 const registry=JSON.parse(readFileSync('data/legal/legal-documents.json','utf8'));
 const text=registry.documents.find((d:any)=>d.slug==='cookie-policy').paragraphs.join(' ');
 for(const phrase of ['Яндекс.Метрика','Вебвизор','содержимое полей','повторно','ранее переданных']) assert.ok(text.includes(phrase),phrase);
});
