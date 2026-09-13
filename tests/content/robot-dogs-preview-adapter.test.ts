import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getRobotDogsPreviewArticles, getRobotDogsPreviewCompilation } from '../../src/lib/robot-dogs-preview-adapter';

test('robot dogs preview adapter maps approved packages to reusable templates', () => {
  const articles = getRobotDogsPreviewArticles();
  const compilation = getRobotDogsPreviewCompilation();

  assert.equal(articles.length, 6);
  assert.equal(compilation.seo.canonical, '/roboty-sobaki/');
  assert.equal(compilation.seo.h1, 'Аренда робота-собаки для мероприятий');
  assert.equal(compilation.catalog.robots.length, 3);
  assert.deepEqual(compilation.catalog.robots.map((robot) => robot.slug), [
    'arenda-unitree-go2',
    'arenda-xiaomi-cyberdog-2',
    'arenda-inchbot-l1-w-edu',
  ]);

  for (const article of articles) {
    assert.match(article.seo.canonical, /^\/articles\/[a-z0-9-]+\/$/);
    assert.equal(article.hero.imageAlign, 'right');
    assert.ok(article.hero.image.src.startsWith('/images/robot-dogs-preview/'));
    assert.ok(article.hero.image.src.endsWith('.webp'));
    assert.ok(article.articleContent?.orderedPackageBlocks?.length, `ordered blocks missing for ${article.slug}`);
    assert.equal(article.articleContent?.showInventory, false);
    assert.ok(article.faq.items.length >= 4);
    assert.ok(article.robots.length >= 3);
  }
});

test('exhibition stand package keeps approved model set and excludes unrelated dog copy', () => {
  const article = getRobotDogsPreviewArticles().find((item) => item.slug === 'robot-stendist-dlya-vystavki');
  assert.ok(article);
  assert.deepEqual(article.robots.map((robot) => robot.slug), [
    'arenda-unitree-g1',
    'arenda-promobot-v4',
    'arenda-unitree-go2',
    'arenda-agibot-x2', // Owner: fourth related model; the three narrative roles stay unchanged.
  ]);
  const renderedText = JSON.stringify(article);
  assert.doesNotMatch(renderedText, /Xiaomi|CyberDog|Inchbot/i);
});
