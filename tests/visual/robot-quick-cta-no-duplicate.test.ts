import {test} from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {runInNewContext} from 'node:vm';
const source=readFileSync('src/components/templates/RobotCardTemplate.astro','utf8');
function title(name:string){const statements=source.split('\n').filter(l=>/^const quickCta(Name|Title) =/.test(l)).join('\n');return runInNewContext(statements+';quickCtaTitle',{robotSlug:'arenda-bellabot',robotTypeAccusative:'робота-официанта',template:{robot:{name,priceDisplay:'от 9 500 ₽ / час'}}});}
test('pricing CTA adds robot type exactly once for prefixed and plain names',()=>{for(const name of ['робота-официанта BellaBot','BellaBot'])assert.equal(title(name),'Арендуйте робота-официанта BellaBot для мероприятия от 9 500 ₽ / час');});
