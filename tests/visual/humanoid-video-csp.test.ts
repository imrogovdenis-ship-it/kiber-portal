import {test} from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
test('humanoid CSP survives index.html internal redirect without allowing frames globally',()=>{
 const config=readFileSync('nginx.conf','utf8');assert.match(config,/location \^~ \/roboty-gumanoidy\/ \{/);
 const block=config.match(/location \^~ \/roboty-gumanoidy\/ \{[\s\S]*?\n  \}/)?.[0]||'';
 assert.match(block,/frame-src https:\/\/kinescope.io;/);
 const generic=config.match(/location \/ \{[\s\S]*?\n  \}/)?.[0]||'';assert(!generic.includes('frame-src'));assert(!config.includes("script-src 'self' 'unsafe-inline'"));
});
