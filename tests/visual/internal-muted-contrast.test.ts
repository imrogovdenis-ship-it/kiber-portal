import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
test('approved muted contrast is an internal-only two-token override',()=>{
 const file='public/styles/internal-muted-contrast-v1.css';
 assert.ok(existsSync(file),'approved internal gray stylesheet is missing');
 const css=readFileSync(file,'utf8').replace(/\/\*[\s\S]*?\*\//g,'').replace(/\s+/g,'');
 assert.equal(css,'html:root{--kp-muted:#6e6f84;--kp-robot-card-description-color:#6e6f84;}');
 const layout=readFileSync('src/layouts/BaseLayout.astro','utf8');
 assert.ok(layout.includes("{Astro.url.pathname !== '/' && <link rel=\"stylesheet\" href=\"/styles/internal-muted-contrast-v1.css\" />}"));
 assert.match(readFileSync('src/styles/tokens.css','utf8'),/--kp-muted: #797a91;/);
});
