import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
test('production CSP permits Metrica without broad script grants or changing API routing',()=>{
 const file='infra/jino-production/production.htaccess';assert.ok(existsSync(file),'production CSP must be versioned');const text=readFileSync(file,'utf8');
 assert.ok(text.includes("script-src 'self' https://mc.yandex.ru"));assert.ok(text.includes('wss://mc.yandex.ru'));assert.ok(text.includes("frame-ancestors 'none'"));assert.ok(text.includes("form-action 'self'"));assert.ok(text.includes('bridge.php [END]'));assert.ok(!text.includes("'unsafe-eval'"));assert.ok(!/script-src[^;]*unsafe-inline/.test(text));assert.ok(!/script-src[^;]*\*/.test(text));
});
