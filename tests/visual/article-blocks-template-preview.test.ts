import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const route = readFileSync('src/pages/preview/kiber-94/article-blocks/index.astro', 'utf8');
const component = readFileSync('src/components/templates/ArticleBlocksTemplate.astro', 'utf8');
const data = readFileSync('src/lib/kiber94-article-template-data.ts', 'utf8');
const approval = readFileSync('data/review/kiber-94-article-template-design-structure-approval.json', 'utf8');

test('KIBER-94 article blocks preview is preview-only and renders reusable article template', () => {
  assert.match(route, /noindex=\{true\}/);
  assert.match(route, /<ArticleBlocksTemplate \{template\} \/>/);
  assert.match(route, /buildArticleBlocksTemplate/);
  assert.match(route, /webPageJsonLd/);
  assert.match(route, /faqPageJsonLd/);
});

test('KIBER-94 article template includes full live-derived block library', () => {
  assert.match(component, /data-page-type="article_detail"/);
  assert.match(component, /data-template-status="owner_design_structure_meaning_approved"/);
  assert.match(component, /data-block-id="hero"[\s\S]*data-block-id="blockInventory"[\s\S]*data-block-id="seoIntro"[\s\S]*data-block-id="plainText"[\s\S]*data-block-id="goshaQuote"[\s\S]*data-block-id="mediaMoment"[\s\S]*data-block-id="robotCardGallery"[\s\S]*data-block-id="comparisonBlock"[\s\S]*data-block-id="obviousChoice"[\s\S]*data-block-id="numberedUseCases"[\s\S]*data-block-id="checkpointList"[\s\S]*data-block-id="pairedEnumeration"[\s\S]*data-block-id="productCard"[\s\S]*data-block-id="faq"[\s\S]*data-block-id="cta2"[\s\S]*data-block-id="catalogBlock"[\s\S]*data-block-id="relatedArticles"[\s\S]*data-block-id="relatedCompilations"/);
  assert.doesNotMatch(component, /<\/article>\s*\}\)/);
  assert.match(component, /HomeGoshaQuote/);
  assert.match(component, /HomeFaqBlock/);
  assert.match(component, /HomeFinalCta/);
  assert.match(component, /HomeImageCards/);
  assert.match(component, /RobotCard/);

  assert.doesNotMatch(component, /Что это за страница/);
  assert.doesNotMatch(component, /Вводные данные/);
  assert.doesNotMatch(component, /data-block-id="reviewNotice"/);
  assert.doesNotMatch(component, /data-block-id="sourceMap"/);
  assert.match(data, /required: 'mandatory'/);
  assert.match(data, /required: 'optional'/);
  assert.match(component, /Обязательный блок/);
  assert.match(component, /Опциональный блок/);
  assert.match(component, /block\.comment && <small>/);
  assert.match(component, /article-blocks__featured-model/);
  assert.match(component, /article-blocks__featured-media/);
  assert.doesNotMatch(component, /article-blocks__featured-media > span/);
  assert.match(component, /article-blocks__featured-media img \{ display: block; width: 100%; height: 100%;/);
  assert.doesNotMatch(component, /width: min\(82%, 25rem\)/);
  assert.doesNotMatch(component, /article-blocks__featured-media img \{[^}]*object-fit: contain/);
  assert.match(component, /article-blocks__featured-copy/);
  assert.match(component, /Перейти на страницу/);
  assert.doesNotMatch(component, /<RobotCard \{\.\.\.g1\} variant="compact" \/>/);
  assert.match(data, /title: 'Простой текстовый блок с заголовком'/);
  assert.match(component, /id="plainText" class="article-blocks__plain-text container"/);
  assert.match(component, /Как это выглядит на практике\?/);
  assert.match(component, /article-blocks__plain-copy/);
  assert.match(data, /h1:\s*'Шаблон статьи: все блоки для Блога Кибер Гоши'/);
  assert.match(component, /article-blocks h1 \{ max-width: 14ch; font-size: clamp\(2\.5rem, 5vw, 5\.25rem\); line-height: 1; \}/);
  assert.match(component, /article-blocks__hero-inner \{[\s\S]*align-items: start/);
  assert.match(component, /article-blocks__hero-image \{[\s\S]*margin-top: 2\.25rem/);
  assert.match(component, /article-blocks__lead \{ grid-column: 1 \/ -1; max-width: none/);
  assert.doesNotMatch(component, /article-blocks h1 \{ font-size: clamp\(2\.7rem/);
  assert.match(component, /article-blocks h2 \{ max-width: 58rem; color: var\(--kp-ink\); font-size: var\(--kp-heading-size\); font-weight: var\(--kp-heading-weight\); line-height: var\(--kp-heading-line-height\); letter-spacing: 0; \}/);
  assert.doesNotMatch(component, /article-blocks h2 \{[^{]*font-size: clamp\(2\.35rem/);
  assert.match(component, /const gallerySliderId = content\?\.gallery\?\.sliderId \?\? 'robot-article-compilation-gallery'/);
  assert.match(component, /data-drag-slider=\{gallerySliderId\}/);
  assert.match(component, /script is:inline src="\/scripts\/robot-card-gallery\.js\?v=mobile-shared-1" defer/);
  assert.match(component, /humanoid-template__drag-gallery humanoid-template__gallery-strip/);
  assert.match(component, /humanoid-template__gallery-item/);
  assert.match(component, /humanoid-template__gallery-strip \{ padding: 0 max\(var\(--kp-reference-page-gutter\), calc\(\(100vw - var\(--kp-reference-container\)\) \/ 2\)\) \.4rem; \}/);
  assert.doesNotMatch(component, /article-blocks__drag-gallery/);
  assert.match(component, /article-blocks__media-frame \{ aspect-ratio: 16 \/ 9/);
  assert.match(component, /Три сценария, где выбор очевиден/);
  assert.match(component, /content\?\.obviousChoice\?\.eyebrow \?\? 'Выбор'/);
  assert.match(component, /content\?\.checklist\?\.title \?\? 'Чтобы не гадать между двумя классными коллегами/);
  assert.match(component, /content\?\.comparison\?\.title \?\? 'Кому подходит Unitree G1, а кому — Agibot X2/);
  assert.match(component, /content\?\.numberedUseCases\?\.title \?\? 'Где робот раскрывается лучше всего/);
  assert.match(component, /content\?\.pairedEnumeration\?\.title \?\? 'Что обычно делают в велком-зоне/);
  assert.match(data, /title: 'Галерея'/);
  assert.match(data, /title: 'Три сценария, где выбор очевиден'/);
  assert.match(data, /title: 'Перечисление вариантов'/);
  assert.match(component, /article-blocks__prose-copy/);
  assert.doesNotMatch(component, /article-blocks__prose-grid/);
  assert.match(component, /content\?\.seoIntro\?\.paragraphs \?\? \[template\.aiSummary\]/);
  assert.doesNotMatch(component, /<aside class="article-blocks__ai-summary"/);
  assert.match(component, /article-blocks__section-head > span, \.article-blocks p, \.article-blocks li, \.article-blocks td \{ color: var\(--kp-reference-muted\); font-size: clamp\(\.98rem, 1\.1vw, 1\.08rem\); line-height: 1\.58; \}/);
  assert.match(component, /article-blocks__obvious article \{[\s\S]*min-height: clamp\(13rem, 18vw, 16rem\)[\s\S]*background: var\(--kp-reference-white\)/);
  assert.match(component, /article-blocks__obvious article > span \{[\s\S]*inset: 50% auto auto 50%[\s\S]*var\(--kp-reference-blue\) 9%[\s\S]*font-size: clamp\(8rem, 15vw, 13\.5rem\)/);
  assert.match(component, /article-blocks__obvious h3 \{ color: var\(--kp-reference-ink\); font-size: clamp\(1\.25rem, 2vw, 1\.75rem\); line-height: 1\.05; \}/);
  assert.match(component, /<HomeFaqBlock title=\{template\.faq\.title\} items=\{template\.faq\.items\} \/>[\s\S]*<HomeFinalCta \{\.\.\.template\.finalCta\} variant="robot-card-final" \/>[\s\S]*data-block-id="catalogBlock"[\s\S]*<HomeImageCards id="article-template-related"[\s\S]*<HomeImageCards id="article-template-compilations"/);
  assert.match(component, /<HomeImageCards id="article-template-related" eyebrow=\{content\?\.relatedArticles\?\.eyebrow \?\? "Блог Кибер Гоши"\}/);
  assert.match(component, /<HomeImageCards id="article-template-compilations" eyebrow=\{content\?\.relatedCompilations\?\.eyebrow \?\? "Подборки"\}/);
  assert.match(component, /class="vertical-slice__section vertical-slice__section--catalog container"/);
  assert.match(component, /<h2 id="catalog-title">\{content\?\.catalog\?\.title \?\? 'Роботы, которые подходят к теме статьи'\}<\/h2>/);
  assert.match(component, /vertical-slice__section \{ display: grid; gap: clamp\(1\.25rem, 2\.5vw, 2rem\); \}/);
  assert.match(component, /vertical-slice__section-copy/);
  assert.doesNotMatch(component, /article-blocks__catalog \.vertical-slice__section-copy/);
  assert.match(component, /article-blocks__faq \{ padding-bottom: clamp\(1\.625rem, 2\.75vw, 2\.5rem\); \}/);
  assert.match(component, /article-blocks__cta \{ padding-top: clamp\(1\.625rem, 2\.75vw, 2\.5rem\); \}/);
  assert.match(component, /article-blocks__compilations \{ padding-top: clamp\(4\.5rem, 8vw, 7rem\); padding-bottom: clamp\(5rem, 9vw, 8rem\); \}/);
  assert.match(component, /@media \(min-width: 60rem\) \{ \.vertical-slice__card-grid \{ grid-template-columns: repeat\(4, minmax\(0, 1fr\)\); \} \}/);
  assert.match(component, /article-blocks__paired-rows h3 \{ font-size: clamp\(1\.05rem, 1\.35vw, 1\.22rem\); line-height: 1\.16; \}/);
  assert.match(component, /id="cta2" class="article-blocks__cta container"/);
  assert.match(component, /id="hero" class="article-blocks__hero"/);
  assert.match(component, /id="productCard" class="article-blocks__product container"/);
  assert.match(data, /id: 'cta2'[\s\S]*title: 'CTA 2'/);
  assert.match(data, /id: 'catalogBlock'[\s\S]*title: 'Каталог роботов'/);
  assert.match(data, /id: 'relatedCompilations'[\s\S]*title: 'Подборки'/);
  assert.match(component, /template\.relatedCompilations\.cards/);
  assert.match(data, /relatedCompilations: homeCompilations/);
});

test('KIBER-94 article data records SEO-AI intent and mandatory/optional block rules', () => {
  assert.match(data, /primaryKeyword:\s*'аренда роботов на мероприятие'/);
  assert.match(data, /secondaryKeywords:[\s\S]*робот в подарок директору[\s\S]*Unitree G1 или Agibot X2[\s\S]*сравнение роботов-гуманоидов/s);
  assert.match(data, /id: 'hero'[\s\S]*required: 'mandatory'/);
  assert.match(data, /id: 'plainText'[\s\S]*required: 'mandatory'/);
  assert.match(data, /id: 'mediaMoment'[\s\S]*required: 'optional'/);
  assert.match(data, /id: 'productCard'[\s\S]*required: 'optional'/);
  assert.match(data, /Финальный хвост фиксирован: FAQ → CTA2 → Каталог роботов → Блог Кибер Гоши → Подборки/);
  assert.doesNotMatch(data, /reviewNotice/);
  assert.doesNotMatch(data, /sources:\s*\[/);
  assert.doesNotMatch(data, /4 live-статьи → библиотека article-блоков/);
});


test('article mobile catalog/blog grids collapse to one column', () => {
  assert.match(component, /@media \(max-width: 39\.9375rem\) \{[\s\S]*#catalogBlock\.container \{ width: auto; max-width: none; margin-inline: 0; padding-inline: var\(--kp-reference-page-gutter\); overflow-x: clip; \}/);
  assert.match(component, /#catalogBlock \.vertical-slice__section-copy, #catalogBlock \.vertical-slice__card-grid \{ width: 100%; max-width: 100%; min-width: 0; margin-left: 0; margin-right: 0; \}/);
  assert.match(component, /@media \(max-width: 39\.9375rem\) \{[\s\S]*\.vertical-slice__card-grid, \.article-blocks__related :global\(\.home-image-cards__grid\) \{ grid-template-columns: 1fr; \}/);
  assert.match(component, /@media \(min-width: 60rem\) \{ \.article-blocks__related :global\(\.home-image-cards__grid\) \{ grid-template-columns: repeat\(3, minmax\(0, 1fr\)\); \} \}/);
  assert.match(component, /article-blocks__related :global\(\.home-image-cards__card\) \{ min-height: 16rem; \}/);
  assert.match(component, /article-blocks__related :global\(\.home-image-cards__image\) \{ min-height: 10rem; \}/);
});


test('KIBER-94 article template owner approval is recorded with boundaries', () => {
  assert.match(component, /data-template-status="owner_design_structure_meaning_approved"/);
  assert.match(approval, /"status": "owner_design_structure_meaning_approved"/);
  assert.match(approval, /"approvedPreviewRoute": "\/preview\/kiber-94\/article-blocks\/"/);
  assert.match(approval, /Всё утверждаю эту страницу шаблон для статей в том виде в ко/);
  assert.match(approval, /"approvedViewports": \[/);
  assert.match(approval, /desktop\/ПК/);
  assert.match(approval, /tablet\/планшет/);
  assert.match(approval, /mobile\/телефон/);
  assert.match(approval, /FAQ[\s\S]*CTA2[\s\S]*Каталог роботов[\s\S]*Блог Кибер Гоши[\s\S]*Подборки/);
  assert.match(approval, /notApprovedByThisRecord[\s\S]*production deploy[\s\S]*DNS changes[\s\S]*live lead routing/);
});


test('article template obviousChoice section has valid id and class attributes', () => {
  assert.match(component, /<section id="obviousChoice" class="article-blocks__obvious container"/);
  assert.doesNotMatch(component, /id="obviousChoice class=/);
});
