import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { test } from 'node:test';

const route = readFileSync('src/pages/preview/kiber-94/articles/sravnenie-unitree-g1-r1-h2/index.astro', 'utf8');
const data = readFileSync('src/lib/kiber94-article-unitree-g1-r1-h2-data.ts', 'utf8');
const component = readFileSync('src/components/templates/ArticleBlocksTemplate.astro', 'utf8');
const types = readFileSync('src/lib/kiber94-article-template-data.ts', 'utf8');
const seo = readFileSync('src/lib/seo.ts', 'utf8');
const contentPackage = JSON.parse(readFileSync('docs/review/kiber-article-unitree-g1-r1-h2-20260909/content-package.json', 'utf8'));
const passport = JSON.parse(readFileSync('docs/review/kiber-article-unitree-g1-r1-h2-20260909/seo-passport.json', 'utf8'));
const hero = 'public/images/kiber-articles/unitree-g1-r1-h2-comparison-hero.webp';

test('article #6 has the owner title, Hero and article SEO contract', () => {
  assert.match(data, /Unitree G1, R1 и H2 — сравнение роботов-гуманоидов для мероприятий/);
  assert.match(data, /\/images\/kiber-articles\/unitree-g1-r1-h2-comparison-hero\.webp/);
  assert.match(types, /fit\?: 'cover' \| 'contain'/);
  assert.match(data, /fit: \"contain\"/);
  assert.match(component, /article-blocks__hero-image--contain/);
  assert.ok(existsSync(hero));
  assert.ok(statSync(hero).size > 30_000);
  assert.equal(passport.canonicalPath, '/articles/sravnenie-unitree-g1-r1-h2/');
  assert.equal(passport.primaryKeywordVolume, 0);
  assert.match(route, /title=\{template\.seo\.title\}/);
  assert.doesNotMatch(route, /Preview:/);
  assert.match(route, /blogPostingJsonLd/);
  assert.match(seo, /export function blogPostingJsonLd/);
});

test('article #6 uses exactly three model cards and approved per-model gallery media', () => {
  assert.match(types, /galleryImage\?: \{ src: string; alt: string \}/);
  assert.match(component, /robot\.galleryImage \?\? robot\.image/);
  assert.match(route, /const slugs = \['arenda-unitree-r1', 'arenda-unitree-g1', 'arenda-unitree-h2'\]/);
  assert.doesNotMatch(route, /arenda-unitree-go2/);
  assert.match(route, /arenda-unitree-r1__tild6432-3865-4237-b665-626633613332__07\.webp/);
  assert.match(route, /arenda-unitree-g1__tild6333-3137-4465-b265-323436646539__06\.webp/);
  assert.match(route, /arenda-unitree-h2__tild3338-3033-4761-b961-663635646131__06\.webp/);
  assert.match(component, /humanoid-template__gallery-item \{[^}]*width: fit-content;[^}]*background: transparent/);
  assert.match(component, /humanoid-template__gallery-item img \{[^}]*width: auto; height: 100%; max-width: none;[^}]*object-fit: contain/);
  assert.doesNotMatch(component, /humanoid-template__gallery-item img \{[^}]*object-fit: cover/);
});

test('article #6 renders researched customer-first blocks without stale DOCX claims', () => {
  assert.match(data, /R1 — для динамики, G1 — для универсального сценария, H2 — для масштаба/);
  assert.match(data, /до 123 см/);
  assert.match(data, /около 29 кг/);
  assert.match(data, /20–26/);
  assert.match(data, /23–43/);
  assert.match(data, /около 1,8 м/);
  assert.match(data, /Шесть форматов, где разница особенно заметна/);
  assert.match(data, /Что сообщить менеджеру до выбора модели/);
  assert.doesNotMatch(data, /SEO \/ AI intro|в течение часа|абсолютно безопас|\$16 000|\$5 900|121 см|25 кг|27 степен/);
  assert.doesNotMatch(data, /featuredSlug: 'arenda-unitree-g1'/);
  assert.equal((component.match(/data-block-id="goshaQuote"/g) ?? []).length, 1);
});

test('article #6 preserves the approved close and avoids duplicate FAQ ids', () => {
  assert.match(component, /id="articleFaq"[^>]*data-block-id="faq"/);
  assert.doesNotMatch(component, /<section id="faq"[^>]*data-block-id="faq"/);
  assert.match(component, /data-block-id="faq"[\s\S]*data-block-id="cta2"[\s\S]*data-block-id="catalogBlock"[\s\S]*data-block-id="relatedArticles"[\s\S]*data-block-id="relatedCompilations"/);
  assert.match(data, /Сравните карточки трёх моделей/);
  assert.equal(contentPackage.blocks.numberedUseCases.items.length, 6);
  assert.equal(contentPackage.blocks.checklist.items.length, 6);
  assert.equal(contentPackage.blocks.faq.items.length, 6);
  assert.equal(contentPackage.blocks.hero.image.src, '/images/kiber-articles/unitree-g1-r1-h2-comparison-hero.webp');
});
