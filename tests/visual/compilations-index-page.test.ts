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
  assert.match(page, /class="compilations-page__grid"/);
  assert.match(page, /class="compilations-page__card"/);
  assert.match(page, /Подборка — это не список роботов, а готовый сценарий/);
  assert.match(page, /<HomeFinalCta \{\.\.\.homeFinalCta\} \/>/);
  assert.match(page, /compilations-page__hero[\s\S]*compilations-page__text[\s\S]*compilations-page__cards[\s\S]*compilations-page__cta/);
});

test('KIBER-91 compilations scenario and guide blocks use owner-requested left inset', () => {
  assert.match(page, /compilations-page__section-copy compilations-page__section-copy--inset/);
  assert.match(page, /@media \(min-width: 40rem\)[\s\S]*compilations-page__section-copy--inset,[\s\S]*compilations-page__text > \.compilations-page__eyebrow,[\s\S]*compilations-page__text > h2,[\s\S]*compilations-page__text-grid[\s\S]*margin-inline-start:\s*clamp\(1\.75rem, 5vw, 4rem\)/);
  assert.doesNotMatch(page, /@media \(max-width: 39\.9375rem\)[\s\S]*\.compilations-page__text \{\s*padding-inline-start:\s*0/);
});

test('KIBER-91 compilations index uses two-column card layout on desktop', () => {
  assert.match(page, /grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(page, /@media \(max-width: 56rem\)[\s\S]*grid-template-columns:\s*1fr/);
  assert.match(page, /min-height:\s*clamp\(15rem, 23vw, 20rem\)/);
});

test('KIBER-91 QA finding no longer lists compilations as unresolved placeholder', () => {
  const high = qa.visualFindings.find((finding) => finding.id === 'FSVQA-01');
  assert.ok(high);
  assert.equal(high?.severity, 'high');
  assert.deepEqual(high?.routes, ['/articles/', '/news/']);
});
