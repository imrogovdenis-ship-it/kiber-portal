import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const route = readFileSync('src/pages/preview/kiber-94/articles/kak-rabotaet-robot-gumanoid-prostymi-slovami/index.astro', 'utf8');
const data = readFileSync('src/lib/kiber94-article-how-humanoid-works-data.ts', 'utf8');
const component = readFileSync('src/components/templates/ArticleBlocksTemplate.astro', 'utf8');
const seoPassport = readFileSync('docs/review/kiber-article-kak-rabotaet-robot-gumanoid-20260909/seo-passport.json', 'utf8');
const mediaMap = readFileSync('docs/review/kiber-article-kak-rabotaet-robot-gumanoid-20260909/media-map.json', 'utf8');

test('how humanoid works article uses approved article template and preview safeguards', () => {
  assert.match(route, /<ArticleBlocksTemplate \{template\} \/>/);
  assert.match(route, /buildHowHumanoidWorksArticle/);
  assert.match(route, /noindex=\{true\}/);
  assert.match(route, /faqPageJsonLd\(\{ items: template\.faq\.items \}\)/);
  assert.match(data, /showInventory: false/);
  assert.match(component, /data-block-id="faq"[\s\S]*data-block-id="cta2"[\s\S]*data-block-id="catalogBlock"[\s\S]*data-block-id="relatedArticles"[\s\S]*data-block-id="relatedCompilations"/);
});

test('how humanoid works article maps Wordstat/SERP package into customer-facing blocks', () => {
  assert.match(seoPassport, /"wordstatStatus": "checked_live"/);
  assert.match(seoPassport, /"primaryKeyword": "как работает робот-гуманоид"/);
  assert.match(data, /Как работает робот-гуманоид простыми словами/);
  assert.match(data, /Что происходит внутри, когда гуманоид идёт к гостям/);
  assert.match(data, /Скелет, суставы и моторы/);
  assert.match(data, /Из каких частей складывается работа гуманоида/);
  assert.match(data, /Что спросить перед арендой робота-гуманоида/);
  assert.match(data, /featuredSlug: 'arenda-unitree-g1'/);
});

test('how humanoid works article uses owner hero image and keeps media descriptions separate', () => {
  assert.match(data, /\/images\/kiber-articles\/kak-rabotaet-robot-gumanoid-hero\.webp/);
  assert.match(mediaMap, /На этом изображении робот-гуманоид Unitree G1 движется по помещению выставки роботов/);
  assert.match(mediaMap, /"seoAlt": "робот-гуманоид Unitree G1 движется по помещению выставки роботов"/);
});

test('how humanoid works article avoids public internal SEO/editorial language', () => {
  assert.doesNotMatch(data, /Wordstat|SERP|каннибал|интент|эта статья не повторяет|Чем статья отличается от карточек роботов/);
  assert.doesNotMatch(data, /как робот роботу/);
  assert.doesNotMatch(data, /— Скажу честно, как робот человеку:/);
});


test('how humanoid works article applies owner copy feedback', () => {
  assert.doesNotMatch(data, /На Hero-кадре/);
  assert.doesNotMatch(data, /— Скажу честно, как робот человеку: если объяснять совсем просто/);
  assert.match(data, /На изображении Unitree G1 движется/);
  assert.match(data, /extraGoshaQuoteAfterNumberedUseCases/);
  assert.match(data, /не просите гуманоида «просто походить где-нибудь рядом»/);
});
