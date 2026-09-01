import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const root = process.cwd();
const passportsPath = resolve(root, 'data/seo/page-seo-passports.json');
const keywordMapPath = resolve(root, 'data/seo/keyword-map.json');
const auditorPath = resolve(root, 'scripts/audit_page_seo_components.py');
const packagePath = resolve(root, 'package.json');

function readJson(path: string) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

test('KIBER-93 wires SEO page passports, keyword map, auditor, and npm gate', () => {
  assert.equal(existsSync(passportsPath), true, 'data/seo/page-seo-passports.json must exist');
  assert.equal(existsSync(keywordMapPath), true, 'data/seo/keyword-map.json must exist');
  assert.equal(existsSync(auditorPath), true, 'scripts/audit_page_seo_components.py must exist');

  const packageJson = readJson(packagePath);
  assert.equal(
    packageJson.scripts['test:page-seo-components'],
    'python3 scripts/audit_page_seo_components.py',
    'package.json must expose the page SEO component audit gate',
  );
});

test('SEO passports cover controlled routes with required machine-checkable fields', () => {
  const launchRoutes = readJson(resolve(root, 'data/seo/launch-routes.json')).routes;
  const controlledRoutes = launchRoutes.filter((route: { status: string }) => ['launch', 'available-not-sitemap'].includes(route.status));
  const passports = readJson(passportsPath);

  assert.equal(passports.schemaVersion, 1);
  assert.equal(passports.issue, 'KIBER-93');
  assert.equal(passports.status, 'draft_for_owner_review');
  assert.ok(Array.isArray(passports.pages), 'passports.pages must be an array');

  const bySlug = new Map(passports.pages.map((page: { slug: string }) => [page.slug, page]));
  for (const route of controlledRoutes) {
    assert.ok(bySlug.has(route.path), `${route.path}: SEO passport missing`);
  }

  for (const page of passports.pages) {
    assert.ok(page.slug.startsWith('/'), `${page.slug}: slug must start with /`);
    assert.match(page.pageType, /^(home|robot_card|collection|article|news|contacts|legal|landing|conversion)$/);
    assert.match(page.robotsStatus, /^(index|noindex|draft|redirect|canonical_duplicate|excluded)$/);
    assert.equal(typeof page.indexable, 'boolean', `${page.slug}: indexable boolean required`);
    assert.ok(page.canonical.startsWith('https://www.kiber-portal.ru'), `${page.slug}: production canonical required`);
    assert.ok(page.primaryKeyword.length >= 3, `${page.slug}: primaryKeyword required`);
    assert.ok(Array.isArray(page.secondaryKeywords), `${page.slug}: secondaryKeywords array required`);
    assert.match(page.searchIntent, /^(commercial|informational|navigational|transactional|local)$/);
    assert.ok(page.title.length >= 12, `${page.slug}: title required`);
    assert.ok(page.description.length >= 40, `${page.slug}: description required`);
    assert.ok(page.h1.length >= 3, `${page.slug}: h1 required`);
    assert.ok(Array.isArray(page.h2Required), `${page.slug}: h2Required required`);
    assert.ok(Number.isInteger(page.minUsefulTextChars), `${page.slug}: minUsefulTextChars integer required`);
    assert.ok(Array.isArray(page.schemaTypesRequired), `${page.slug}: schemaTypesRequired required`);
    assert.ok(Array.isArray(page.breadcrumbsRequired), `${page.slug}: breadcrumbsRequired required`);
    assert.ok(Array.isArray(page.internalLinksRequired), `${page.slug}: internalLinksRequired required`);
    assert.ok(Array.isArray(page.imagesRequired), `${page.slug}: imagesRequired required`);
    assert.ok(Array.isArray(page.ctaRequired), `${page.slug}: ctaRequired required`);
    assert.match(page.reviewStatus, /^(approved|needs_review|missing_required_fields)$/);
  }
});

test('keyword map is aligned with SEO passports and keeps query intent separate from meta keywords', () => {
  const passports = readJson(passportsPath);
  const keywordMap = readJson(keywordMapPath);
  assert.equal(keywordMap.schemaVersion, 1);
  assert.equal(keywordMap.issue, 'KIBER-93');

  for (const page of passports.pages) {
    const entry = keywordMap.pages[page.slug];
    assert.ok(entry, `${page.slug}: keyword-map entry missing`);
    assert.equal(entry.pageType, page.pageType, `${page.slug}: pageType mismatch`);
    assert.equal(entry.primaryKeyword, page.primaryKeyword, `${page.slug}: primaryKeyword mismatch`);
    assert.deepEqual(entry.secondaryKeywords, page.secondaryKeywords, `${page.slug}: secondaryKeywords mismatch`);
    assert.equal(entry.intent, page.searchIntent, `${page.slug}: intent mismatch`);
    assert.ok(!('metaKeywords' in entry), `${page.slug}: do not use legacy meta keywords as the SEO source of truth`);
  }
});
