import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const data = readFileSync('src/lib/kiber94-article-humanoid-choice-data.ts', 'utf8');
const page = readFileSync('src/pages/preview/kiber-94/articles/kakoy-gumanoid-vybrat-dlya-meropriyatiya/index.astro', 'utf8');
const passport = JSON.parse(readFileSync('docs/review/kiber-article-kakoy-gumanoid-vybrat-20260908/seo-passport.json', 'utf8'));
const wordstat = readFileSync('docs/review/kiber-article-kakoy-gumanoid-vybrat-20260908/wordstat-summary.md', 'utf8');

test('humanoid choice article #2 records Wordstat-backed SEO ownership and preview-only boundary', () => {
  assert.equal(passport.pageType, 'article_detail');
  assert.equal(passport.primaryKeyword, 'какого робота-гуманоида выбрать для мероприятия');
  assert.match(passport.primaryKeywordDecision, /0 Wordstat impressions/);
  assert.ok(passport.bridgeKeywordsForCompilation.includes('аренда робота гуманоида'));
  assert.equal(passport.indexing, 'preview_noindex_until_public_launch_approval');
  assert.equal(passport.productionApproved, false);
  assert.match(wordstat, /live Wordstat/i);
  assert.match(wordstat, /аренда робота гуманоида \| 80/);
  assert.match(wordstat, /Unitree G1 \| 2743/);
});

test('humanoid choice article #2 renders through approved article template with seven humanoid cards', () => {
  assert.match(page, /ArticleBlocksTemplate/);
  assert.match(page, /noindex=\{true\}/);
  assert.match(data, /Какого робота-гуманоида выбрать для мероприятия: сравнение моделей/);
  assert.doesNotMatch(data, /Какого робота-гуманоида выбрать для мероприятия: сравнение всех моделей/);
  for (const slug of ['arenda-noetix-bumi','arenda-unitree-r1','arenda-unitree-g1','arenda-agibot-x2','arenda-unitree-h2','arenda-robota-ardi','arenda-robota-sofiya']) {
    assert.match(data, new RegExp(slug));
  }
  assert.doesNotMatch(data, /arenda-promobot-v4/);
  assert.match(data, /\/images\/articles\/kakoy-gumanoid-vybrat\/hero\.webp/);
  assert.match(data, /imageAlign: 'right'/);
  assert.doesNotMatch(data, /product:\s*\{/);
  assert.doesNotMatch(data, /цена по запросу/);
  assert.match(data, /рассчитывается индивидуально/);
  assert.match(page, /рассчитывается индивидуально/);
  assert.match(data, /number: '06'/);
});

test('humanoid choice article #2 keeps generic rental keys as compilation bridge, not visible research leakage', () => {
  assert.doesNotMatch(data, /Wordstat/);
  assert.doesNotMatch(data, /эта статья не повторяет подборку/);
  assert.doesNotMatch(data, /после первого интереса/);
  assert.doesNotMatch(data, /SERP/);
  assert.doesNotMatch(data, /draft_for_owner_review/);
  assert.doesNotMatch(data, /checked_live/);
});


test('article #2 latest owner feedback is encoded', () => {
  assert.match(data, /Я, Кибер Гоша, сейчас разложу по полочкам/);
  assert.doesNotMatch(data, /Чем статья отличается от карточек роботов/);
  assert.match(data, /Что должно получиться/);
  assert.match(data, /hideBadges: true/);
});
