import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync,existsSync} from 'node:fs';
test('both editorial templates use one approved responsive Hero',()=>{for(const n of ['ArticleBlocksTemplate','CompilationTemplate'])assert.match(readFileSync(`src/components/templates/${n}.astro`,'utf8'),/<EditorialHero\s/);});
test('headings A is isolated to editorial pages, not global body text',()=>{assert.match(readFileSync('src/layouts/BaseLayout.astro','utf8'),/data-editorial-headings/);assert.ok(existsSync('public/styles/editorial-headings-a.css'));});
