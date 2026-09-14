import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { createHash } from 'node:crypto';
const source=readFileSync('src/pages/roboty-sobaki.astro','utf8');
test('approved dog scenarios use full-width stacked cards only on mobile',()=>{
 assert.match(source,/@media\s*\(max-width:\s*39\.9375rem\)/);
 const mobile=source.slice(source.indexOf('@media'));
 assert.match(mobile,/flex-direction:\s*column/);
 assert.match(mobile,/scroll-snap-type:\s*none/);
 assert.match(mobile,/touch-action:\s*pan-y pinch-zoom/);
 assert.match(mobile,/scenario-photo img\s*\{[^}]*width:\s*100%;[^}]*height:\s*auto/s);
 assert.match(mobile,/scenario-head-row\s*\{[^}]*display:\s*none/s);
 for(const rule of mobile.matchAll(/([^{}]+)\{/g)) {
  if(rule[1].includes('@media'))continue;
  assert.ok(rule[1].includes('#main-content[data-kiber-task="robot-dogs-preview"]'),rule[1]);
 }
});
test('dog route content outside styles is unchanged',()=>{
 assert.equal(createHash('sha256').update(source.split('<style is:global>')[0]).digest('hex'),'2ce50de3f9a5b97a0e77207fa4061297d5de3231d165a878a4303b848a38728f');
});
