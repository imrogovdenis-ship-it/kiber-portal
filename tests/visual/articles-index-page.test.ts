import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const page = readFileSync('src/pages/articles.astro', 'utf8');
const data = JSON.parse(readFileSync('data/design/home-live-blocks.json', 'utf8')) as {
  articles: { title: string; description: string; cards: Array<{ title: string }> };
};
const qa = JSON.parse(readFileSync('data/review/full-site-visual-qa.json', 'utf8')) as {
  visualFindings: Array<{ id: string; severity: string; routes: string[] }>;
  resolvedFindings?: Array<{ id: string; route: string; status: string }>;
  futureTasks?: Array<{ id: string; route: string; summary: string; status: string }>;
};

test('KIBER-91 articles index is filled from approved homepage article data', () => {
  assert.doesNotMatch(page, /Здесь будут практические статьи/);
  assert.match(page, /import \{ homeArticles, homeFinalCta \}/);
  assert.match(page, /const articleCards = homeArticles\.cards/);
  assert.match(page, /<h1 id="page-title">\{homeArticles\.title\}<\/h1>/);
  assert.match(page, /\{articlesPageDescription\}/);
  assert.match(page, /data-article-card-count=\{articleCards\.length\}/);
  assert.equal(data.articles.cards.length, 6);
  assert.match(page, /\{articleCards\.map\(\(card\) => \(/);
});

test('KIBER-91 articles index has intro block, article feed and bottom CTA in order', () => {
  assert.match(page, /class="articles-page__intro container"/);
  assert.match(page, /Все практические статьи о роботах в одном месте/);
  assert.match(page, /который позже нужно будет адаптировать по SEO|позже адаптируем под SEO/);
  assert.match(page, /<section class="articles-page__feed container" id="article-feed"/);
  assert.match(page, /<h2 id="article-feed-title">Все статьи сайта<\/h2>/);
  assert.match(page, /<section class="articles-page__cta container"[\s\S]*<HomeFinalCta \{\.\.\.homeFinalCta\} \/>[\s\S]*<\/section>/);
  assert.match(page, /articles-page__hero[\s\S]*articles-page__intro[\s\S]*articles-page__feed[\s\S]*articles-page__cta/);
});

test('KIBER-91 articles cards reuse homepage article visual contract without visible read buttons', () => {
  assert.match(page, /aria-label=\{`Открыть: \$\{card\.title\}`\}/);
  assert.match(page, /role="img" aria-label=\{card\.image\.alt\}/);
  assert.match(page, /aspect-ratio:\s*16 \/ 9/);
  assert.match(page, /grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(page, /@media \(max-width: 64rem\)[\s\S]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(page, /@media \(max-width: 39\.9375rem\)[\s\S]*grid-template-columns:\s*1fr/);
  assert.doesNotMatch(page, />Читать<|class="articles-page__button"/);
});

test('KIBER-91 articles keeps internal-link contract hidden and records filter as future task', () => {
  assert.match(page, /class="articles-page__links-hidden"/);
  assert.match(page, /<InternalLinks route="\/articles\/" label="Внутренняя навигация" \/>/);
  const high = qa.visualFindings.find((finding) => finding.id === 'FSVQA-01');
  assert.ok(high);
  assert.deepEqual(high?.routes, ['/news/']);
  assert.ok(qa.resolvedFindings?.some((finding) => finding.id === 'FSVQA-01B' && finding.route === '/articles/' && finding.status === 'ready_for_owner_review'));
  assert.ok(qa.futureTasks?.some((task) => task.id === 'KIBER-91-FILTER-ARTICLES' && task.route === '/articles/' && task.status === 'deferred'));
});
