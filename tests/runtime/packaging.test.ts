import {test} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
test('runtime packaging generates an API proxy while retaining canonical web policies',()=>{
 assert(existsSync('scripts/build-api-runtime.mjs'),'API runtime build must be reproducible');
 execFileSync('node',['scripts/build-api-runtime.mjs']);
 const config=readFileSync('build/api-runtime/nginx.conf','utf8');
 assert.match(config,/proxy_pass http:\/\/api:8081/);
 assert.match(config,/location = \/api\/leads \{/);
 assert.match(config,/location = \/api\/leads\/status \{/);
 assert.doesNotMatch(config,/status\":\"available/);
 assert.match(config,/frame-src https:\/\/kinescope.io/);
 assert(existsSync('build/api-runtime/server.mjs'));
});

test('build context excludes environment secrets and local API output',()=>{
 const ignore=readFileSync('.dockerignore','utf8');assert(ignore.includes('**/.env*'));assert(ignore.split('\n').includes('build'));
});
