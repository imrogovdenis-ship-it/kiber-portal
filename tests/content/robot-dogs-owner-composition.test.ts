import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
test('approved dog composition is explicit and does not change default collections',()=>{
 const page=readFileSync('src/pages/roboty-sobaki.astro','utf8');
 assert.match(page,/dogsOwnerComposition/);
 assert.match(page,/FeaturedRobotProducts/);
 const template=readFileSync('src/components/templates/CompilationTemplate.astro','utf8');
 assert.match(template,/dogsOwnerComposition = false/);
 assert.match(template,/!dogsOwnerComposition &&/);
 assert.ok(existsSync('src/components/blocks/FeaturedRobotProducts.astro'));
 assert.match(page,/faqPageJsonLd/); assert.match(page,/collectionPageJsonLd/);
 assert.doesNotMatch(page,/preview-inquiry|dogs-owner-composition\/preview/);
});
