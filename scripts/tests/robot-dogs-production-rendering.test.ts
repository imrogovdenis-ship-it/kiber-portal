import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

const routes = [
  '/roboty-sobaki/',
  '/articles/robot-dlya-nauchnogo-shou-i-shkoly/',
  '/articles/robot-stendist-dlya-vystavki/',
  '/articles/roboty-unitree-obzor-kompanii/',
  '/articles/sravnenie-robosobak-dlya-meropriyatiy/',
  '/articles/unitree-go2-na-meropriyatii/',
  '/articles/xiaomi-cyberdog-2-v-promo-akciyah/',
] as const;

function htmlFile(route: string): string {
  return join(process.cwd(), 'dist', route.replace(/^\//, '').replace(/\/$/, ''), 'index.html');
}

test('production build renders seven approved robot-dogs pages as canonical indexable public pages', () => {
  const sitemap = readFileSync('dist/sitemap.xml', 'utf8');
  const llms = readFileSync('public/llms.txt', 'utf8');
  for (const route of routes) {
    const file = htmlFile(route);
    assert.ok(existsSync(file), `${route} missing from dist`);
    const html = readFileSync(file, 'utf8');
    assert.match(html, new RegExp(`<link rel="canonical" href="https://www\\.kiber-portal\\.ru${route}"`));
    assert.doesNotMatch(html, /noindex, nofollow/);
    assert.doesNotMatch(html, /data-preview-only="true"/);
    assert.match(sitemap, new RegExp(`<loc>https://www\\.kiber-portal\\.ru${route}</loc>`));
    if (route.startsWith('/articles/')) assert.match(llms, new RegExp(`https://www\\.kiber-portal\\.ru${route}`));
  }
});


test('owner-approved dogs composition replaces the old gallery without preview infrastructure', () => {
 const html=readFileSync(htmlFile('/roboty-sobaki/'),'utf8');
 const order=['hero','intro','productCard','introGosha','choiceGuide','scenarioExplanation','goshaConclusion','catalogBlock','faq','cta2','relatedArticles','otherCompilations'];
 let previous=-1;
 for(const block of order){const pos=html.indexOf(`data-block-id="${block}"`);assert.ok(pos>previous,block);previous=pos;}
 assert.doesNotMatch(html,/class="humanoid-template__gallery"/);
 assert.equal((html.match(/class="article-blocks__featured-model"/g)||[]).length,3);
 assert.equal((html.match(/id="catalog"/g)||[]).length,1);
 assert.equal((html.match(/id="featured-dogs"/g)||[]).length,1);
 assert.match(html,/href="#featured-dogs"/);
 const copy=JSON.parse(readFileSync('data/content/dogs-featured-descriptions.json','utf8'));
 for(const text of Object.values(copy))assert.ok(html.includes(text as string));
 assert.doesNotMatch(html,/preview-inquiry|jino-preview\.kiber-portal|dogs-owner-composition\/preview/);
 assert.match(html,/analytics-provider-v4/);
});
