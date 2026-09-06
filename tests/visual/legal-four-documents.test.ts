import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';

const read = (path: string) => readFileSync(path, 'utf8');
const json = (path: string) => JSON.parse(read(path));
const legalSlugs = ['privacy-policy', 'consent', 'cookie-policy', 'terms'];

test('legal registry contains all four live-site legal documents', () => {
  const legal = json('data/legal/legal-documents.json');
  const slugs = legal.documents.map((entry: { slug: string }) => entry.slug);

  assert.deepEqual(slugs.sort(), legalSlugs.toSorted());
  for (const slug of legalSlugs) {
    const doc = legal.documents.find((entry: { slug: string }) => entry.slug === slug);
    assert.ok(doc, `${slug} missing`);
    assert.equal(doc.sourceUrl, `https://www.kiber-portal.ru/${slug}`);
    assert.equal(doc.status, 'source_from_live_site_per_user_decision');
    assert.ok(doc.paragraphs.length >= (slug === 'terms' ? 10 : 5), `${slug} must preserve live legal text`);
  }
});

test('legal pages and navigation expose the four-document cross-link set', () => {
  for (const slug of legalSlugs) {
    const file = `src/pages/${slug}.astro`;
    assert.equal(existsSync(file), true, `${file} missing`);
    const source = read(file);
    assert.match(source, new RegExp(`slug=[\\"']${slug}[\\"']`));
  }

  const shared = read('src/components/legal/LegalDocumentPage.astro');
  for (const slug of legalSlugs) {
    for (const other of legalSlugs.filter((item) => item !== slug)) {
      assert.match(shared, new RegExp(other), `${slug} must link ${other}`);
    }
  }

  const footer = read('src/components/layout/Footer.astro');
  for (const slug of legalSlugs) assert.match(footer, new RegExp(`/${slug}`));
});

test('route, readiness and content package gates account for four legal documents', () => {
  const routes = json('data/seo/launch-routes.json').routes.map((route: { path: string }) => route.path);
  for (const slug of legalSlugs) assert.ok(routes.includes(`/${slug}/`), `${slug} route missing`);

  const workflow = json('data/review/content-package-workflow.json');
  assert.equal(workflow.summary.legalDocuments, 4);

  const readiness = json('data/review/launch-readiness-crawl.json');
  assert.ok(readiness.requiredChecks.includes('legal_pages'));
  assert.match(read('scripts/launch-readiness-crawl-smoke.mjs'), /\/terms\//);
});


test('legal pages do not expose internal transfer notices or duplicate isolated numbering', () => {
  const legal = json('data/legal/legal-documents.json');
  for (const doc of legal.documents as Array<{ slug: string; paragraphs: string[] }>) {
    const page = read(`src/pages/${doc.slug}.astro`);
    assert.doesNotMatch(page, /Документ перенес[её]н с действующего сайта kiber-portal\.ru/);
    assert.doesNotMatch(page, /Production-контакты|placeholder|analytics providers|consent\/analytics approval|Связан с политикой персональных данных/);
  }

  for (const slug of ['privacy-policy', 'cookie-policy']) {
    const doc = legal.documents.find((entry: { slug: string }) => entry.slug === slug);
    assert.ok(doc, `${slug} missing`);
    const isolated = doc.paragraphs.filter((paragraph: string) => /^\d+\.$/.test(paragraph.trim()));
    assert.deepEqual(isolated, [], `${slug} must not contain duplicate isolated section-number paragraphs`);
  }

  const shared = read('src/components/legal/LegalDocumentPage.astro');
  assert.match(shared, /notice\?: string/);
  assert.match(shared, /\{notice && <p>\{notice\}<\/p>\}/);
});
