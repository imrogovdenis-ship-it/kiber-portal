import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const data = readFileSync('src/lib/kiber94-article-unitree-g1-corporate-data.ts', 'utf8');
const page = readFileSync('src/pages/preview/kiber-94/articles/unitree-g1-na-korporative/index.astro', 'utf8');
const passport = JSON.parse(readFileSync('docs/review/kiber-article-unitree-g1-korporativ-20260908/seo-passport.json', 'utf8'));
const wordstat = readFileSync('docs/review/kiber-article-unitree-g1-korporativ-20260908/wordstat-summary.md', 'utf8');
const mediaMap = readFileSync('docs/review/kiber-article-unitree-g1-korporativ-20260908/media-map.json', 'utf8');

test('Unitree G1 corporate article records Wordstat-backed exact model scenario intent', () => {
  assert.equal(passport.pageType, 'article_detail');
  assert.equal(passport.primaryKeyword, 'Unitree G1 на корпоративе');
  assert.match(passport.primaryKeywordDecision, /near zero in Wordstat/);
  assert.ok(passport.bridgeKeywords.includes('Unitree G1 аренда'));
  assert.equal(passport.indexing, 'preview_noindex_until_public_launch_approval');
  assert.equal(passport.productionApproved, false);
  assert.match(wordstat, /Unitree G1 \| 2743/);
  assert.match(wordstat, /робот Unitree G1 \| 1087/);
});

test('Unitree G1 corporate article renders through approved article template and uses robot-card media safely', () => {
  assert.match(page, /ArticleBlocksTemplate/);
  assert.match(page, /noindex=\{true\}/);
  assert.match(data, /Unitree G1 на корпоративе — разбор сценария/);
  assert.match(data, /\/images\/articles\/unitree-g1-korporativ\/hero\.webp/);
  assert.match(data, /robot-unitree-g1-corporate-gallery/);
  assert.match(data, /imageAlign: 'right'/);
  assert.match(data, /как робот человеку/);
  assert.doesNotMatch(data, /как робот роботу/);
  assert.doesNotMatch(data, /Логистически/);
  assert.match(data, /actualDescription: 'На этом изображении робот-гуманоид Unitree G1/);
  assert.match(mediaMap, /На этом изображении робот-гуманоид Unitree G1 приветствует гостей корпоратива/);
  assert.match(data, /unitree-g1-corporate-01\.webp/);
  assert.match(data, /unitree-g1-corporate-04\.webp/);
  assert.doesNotMatch(data, /unitree-g1-corporate-05\.webp/);
  assert.doesNotMatch(data, /unitree-g1-corporate-06\.webp/);
  assert.match(data, /от 12 500 ₽ \/ час/);
  assert.doesNotMatch(data, /1 час;25 000 ₽/);
});

test('Unitree G1 corporate article keeps research notes out of visible data', () => {
  assert.doesNotMatch(data, /Wordstat/);
  assert.doesNotMatch(data, /SERP/);
  assert.doesNotMatch(data, /draft_for_owner_review/);
  assert.doesNotMatch(data, /checked_live/);
  assert.doesNotMatch(data, /comparison:/);
  assert.doesNotMatch(data, /obviousChoice:/);
  assert.match(data, /План Б для пауз/);
  assert.equal((data.match(/title: '/g) ?? []).filter(Boolean).length > 0, true);
});
