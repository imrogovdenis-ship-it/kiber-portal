import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const page = readFileSync('src/pages/articles.astro', 'utf8');
const data = JSON.parse(readFileSync('data/design/home-live-blocks.json', 'utf8')) as {
  articles: { title: string; description: string; cards: Array<{ title: string }> };
};
const cssBlock = (selector: string) => {
  const marker = `${selector} {`;
  const start = page.indexOf(marker);
  if (start === -1) return '';
  const bodyStart = start + marker.length;
  const end = page.indexOf('\n  }', bodyStart);
  return end === -1 ? page.slice(bodyStart) : page.slice(bodyStart, end);
};
const qa = JSON.parse(readFileSync('data/review/full-site-visual-qa.json', 'utf8')) as {
  visualFindings: Array<{ id: string; severity: string; routes: string[] }>;
  resolvedFindings?: Array<{
    id: string;
    route: string;
    status: string;
    ownerDesignApproval?: { approved: boolean; quote: string };
  }>;
  futureTasks?: Array<{ id: string; route: string; summary: string; status: string }>;
};

test('KIBER-91 articles index is filled from approved homepage article data', () => {
  assert.doesNotMatch(page, /Здесь будут практические статьи/);
  assert.match(page, /import \{ homeArticles, homeFinalCta \}/);
  assert.match(page, /const articleCards = homeArticles\.cards/);
  assert.match(page, /<h1 id="page-title">Блог Кибер Гоши<\/h1>/);
  assert.doesNotMatch(page, /<h1 id="page-title">\{homeArticles\.title\}<\/h1>/);
  assert.doesNotMatch(page, /<section class="articles-page__hero container"[\s\S]*\{articlesPageDescription\}[\s\S]*<\/section>/);
  assert.doesNotMatch(page, /Тематические статьи по аренде роботов на мероприятия/);
  assert.doesNotMatch(page, /Разбираем, каких роботов выбрать под конкретный повод/);
  assert.match(page, /data-article-card-count=\{articleCards\.length\}/);
  assert.equal(data.articles.cards.length, 6);
  assert.match(page, /\{articleCards\.map\(\(card\) => \(/);
});

test('KIBER-91 articles index has intro block, article feed and bottom CTA in order', () => {
  assert.match(page, /class="articles-page__intro container"/);
  assert.match(page, /Все практические статьи о роботах в одном месте/);
  assert.match(page, /который позже нужно будет адаптировать по SEO|позже адаптируем под SEO/);
  const introCss = cssBlock('.articles-page__intro-copy');
  assert.doesNotMatch(introCss, /background:\s*var\(--kp-white\)/);
  assert.doesNotMatch(introCss, /box-shadow:/);
  assert.match(cssBlock('.articles-page__hero h1'), /color:\s*var\(--kp-reference-ink\)/);
  assert.match(cssBlock('.articles-page__hero h1'), /font-size:\s*clamp\(3\.1rem, 7vw, var\(--kp-reference-display-xl\)\)/);
  assert.match(page, /\.articles-page__hero,[\s\S]*\.articles-page__cta \{[\s\S]*?width:\s*min\(100% - \(2 \* var\(--kp-reference-page-gutter\)\), var\(--kp-reference-container\)\)/);
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
  assert.ok(qa.resolvedFindings?.some((finding) => finding.id === 'FSVQA-01B' && finding.route === '/articles/' && finding.status === 'owner_design_approved'));
  assert.ok(qa.resolvedFindings?.some((finding) => finding.id === 'FSVQA-01B' && finding.ownerDesignApproval?.approved === true && finding.ownerDesignApproval?.quote === 'Я Утверждаю дизайн Блога'));
  assert.ok(qa.futureTasks?.some((task) => task.id === 'KIBER-91-FILTER-ARTICLES' && task.route === '/articles/' && task.status === 'deferred'));
});
