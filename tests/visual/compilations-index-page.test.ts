import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const page = readFileSync('src/pages/compilations.astro', 'utf8');
const qa = JSON.parse(readFileSync('data/review/full-site-visual-qa.json', 'utf8')) as {
  visualFindings: Array<{ id: string; severity: string; routes: string[]; status?: string }>;
};

test('KIBER-91 compilations index is not a placeholder page', () => {
  assert.doesNotMatch(page, /Здесь будут сценарные подборки/);
  assert.match(page, /homeCompilations/);
  assert.match(page, /compilationCards = homeCompilations\.cards\.slice\(0, 4\)/);
  assert.match(page, /cardAnchors = \['roboty-gumanoidy', 'roboty-dlya-vystavok', 'roboty-sobaki', 'unitree'\]/);
  assert.match(page, /id=\{card\.id\}/);
  assert.match(page, /<section class="compilations-page__hero container"[\s\S]*<h1 id="page-title">Подборки роботов для аренды<\/h1>[\s\S]*<\/section>/);
  assert.doesNotMatch(page, /<p class="compilations-page__eyebrow">Подборки<\/p>/);
  assert.doesNotMatch(page, /Готовые сценарии выбора роботов под мероприятие/);
  assert.match(page, /class="compilations-page__grid"/);
  assert.match(page, /class="compilations-page__card"/);
  assert.doesNotMatch(page, /compilations-page__card-index/);
  assert.doesNotMatch(page, />0\{index \+ 1\}</);
  assert.match(page, /Подборка — это не список роботов, а готовый сценарий/);
  assert.match(page, /<HomeFinalCta \{\.\.\.homeFinalCta\} \/>/);
  assert.match(page, /class="compilations-page__links-hidden"/);
  assert.match(page, /<InternalLinks route="\/compilations\/" label="Внутренняя навигация" \/>/);
  assert.doesNotMatch(page, /Следующие шаги/);
  assert.match(page, /compilations-page__hero[\s\S]*compilations-page__text[\s\S]*compilations-page__cards[\s\S]*compilations-page__cta/);
});

test('KIBER-91 compilations scenario keeps requested inset while guide aligns to hero', () => {
  assert.match(page, /compilations-page__section-copy compilations-page__section-copy--inset/);
  assert.match(page, /\.compilations-page__text > \.compilations-page__eyebrow \{[\s\S]*color:\s*var\(--kp-reference-blue\)[\s\S]*font-size:\s*var\(--kp-reference-label-size\)[\s\S]*letter-spacing:\s*\.1em[\s\S]*text-transform:\s*uppercase/);
  assert.match(page, /@media \(min-width: 40rem\)[\s\S]*compilations-page__section-copy--inset[\s\S]*margin-inline-start:\s*clamp\(1\.75rem, 5vw, 4rem\)/);
  assert.doesNotMatch(page, /compilations-page__text > h2,[\s\S]*margin-inline-start:\s*clamp\(1\.75rem, 5vw, 4rem\)/);
});

test('KIBER-91 compilations index uses two-column card layout on desktop', () => {
  assert.match(page, /grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(page, /@media \(max-width: 56rem\)[\s\S]*grid-template-columns:\s*1fr/);
  assert.match(page, /min-height:\s*clamp\(18\.75rem, 28\.75vw, 25rem\)/);
  assert.match(page, /@media \(max-width: 56rem\)[\s\S]*min-height:\s*22\.5rem/);
  assert.match(page, /@media \(max-width: 39\.9375rem\)[\s\S]*min-height:\s*23\.75rem/);
  assert.match(page, /\.compilations-page__card \{[\s\S]*display:\s*flex[\s\S]*flex-direction:\s*column[\s\S]*align-items:\s*flex-start/);
  assert.match(page, /\.compilations-page__card-cta \{[\s\S]*align-self:\s*flex-start[\s\S]*margin-top:\s*auto/);
});

test('KIBER-91 QA finding no longer lists compilations as unresolved placeholder', () => {
  const high = qa.visualFindings.find((finding) => finding.id === 'FSVQA-01');
  assert.ok(high);
  assert.equal(high?.severity, 'high');
  assert.deepEqual(high?.routes, ['/articles/', '/news/']);
});
