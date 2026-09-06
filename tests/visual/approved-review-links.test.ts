import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path: string) => readFileSync(path, 'utf8');

test('preview review links route approved surfaces instead of old public detail designs', () => {
  const helper = read('src/lib/review-links.ts');
  assert.match(helper, /\/preview\/kiber-94\/robot-card\/\$\{robotMatch\[1\]\}\//);
  assert.match(helper, /\/preview\/kiber-94\/compilation\/roboty-gumanoidy\//);
  assert.match(helper, /\/preview\/kiber-94\/article-blocks\/#mediaMoment/);

  const home = read('src/pages/index.astro');
  assert.match(home, /reviewRobotPreviewHref\(robot\.slug, robot\.route\)/);
  assert.doesNotMatch(home, /data-primary-route="\/robots\/arenda-unitree-g1\/"/);

  const cards = read('src/components/blocks/HomeImageCards.astro');
  assert.match(cards, /reviewLinksAreEnabled \? reviewHref\(card\.originalHref \?\? card\.href\) : card\.href/);

  const compilations = read('src/pages/compilations.astro');
  const articles = read('src/pages/articles.astro');
  assert.match(compilations, /reviewLinksAreEnabled \? reviewHref\(card\.originalHref \?\? card\.href\) : card\.href/);
  assert.match(articles, /reviewLinksAreEnabled \? reviewHref\(card\.originalHref \?\? card\.href\) : card\.href/);

  const internalLinks = read('src/components/content/InternalLinks.astro');
  assert.match(internalLinks, /href=\{reviewHref\(link\.href\)\}/);

  const articleTemplate = read('src/components/templates/ArticleBlocksTemplate.astro');
  assert.match(articleTemplate, /const \[g1\] = reviewRobotCards/);

  const robotTemplate = read('src/components/templates/RobotCardTemplate.astro');
  assert.match(robotTemplate, /href: reviewRobotPreviewHref\(robot\.slug, robot\.route\)/);
});

test('approved review map exposes all owner-approved page surfaces', () => {
  const hub = read('src/pages/preview/review-approved/index.astro');
  for (const label of ['Главная', 'Карточка робота Unitree G1', 'Подборка: Роботы-гуманоиды', 'Блог Кибер Гоши', 'Шаблон статьи']) {
    assert.match(hub, new RegExp(label));
  }
  assert.match(hub, /data-review-map="approved-pr8-links"/);
});


test('home-live data preserves original article hrefs for preview review mapping', () => {
  const data = read('src/data/home-live.ts');
  assert.match(data, /originalHref: input.href/);
  assert.match(data, /'\/sravnenie-unitree-g1-r1-h2': '\/compilations\/'/);
  const cards = read('src/components/blocks/HomeImageCards.astro');
  assert.match(cards, /reviewLinksAreEnabled \? reviewHref\(card\.originalHref \?\? card\.href\) : card\.href/);
});
