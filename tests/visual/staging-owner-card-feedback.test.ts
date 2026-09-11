import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {test} from 'node:test';
import {getRobotPages} from '../../src/lib/robot-pages';
test('homepage titles are explicit nominative labels for all launch robots',()=>{
 const path='data/content/home-catalog-titles.json';assert(existsSync(path),'separate customer-facing catalog names are required');
 const names=JSON.parse(readFileSync(path,'utf8'));
 assert.deepEqual(Object.keys(names).sort(),getRobotPages().map(r=>r.slug).sort());
 assert.equal(names['arenda-robota-sofiya'],'Робот София');assert.equal(names['arenda-robota-tron'],'Модульный робот Tron');assert.equal(names['arenda-robota-hudozhnika-a4'],'Робот-художник');
 for(const name of Object.values(names))assert.doesNotMatch(String(name),/^(робота|модульного|интерактивной|большого|мини робо-кофейни)/);
 assert.match(readFileSync('src/pages/index.astro','utf8'),/title: homeCatalogTitles\[robot.slug/);
});
test('humanoid related compilations reuse ready-only launch navigation',()=>{
 const source=readFileSync('src/components/templates/CompilationTemplate.astro','utf8');assert.match(source,/\.\.\.launchCompilations/);assert.doesNotMatch(source,/\.\.\.homeCompilations/);
});
