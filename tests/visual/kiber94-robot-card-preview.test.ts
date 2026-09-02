import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const root = process.cwd();
const routePath = resolve(root, 'src/pages/preview/kiber-94/robot-card/[slug].astro');
const mapperPath = resolve(root, 'src/lib/kiber94-robot-template-data.ts');
const componentPath = resolve(root, 'src/components/templates/RobotCardTemplate.astro');
const smokePath = resolve(root, 'scripts/kiber94-robot-card-preview-smoke.mjs');
const packagePath = resolve(root, 'package.json');
const reportPath = resolve(root, 'docs/review/kiber-94-robot-card-preview/report.json');
const structureContractPath = resolve(root, 'docs/review/kiber-94-robot-card-preview/robot-card-structure-contract.md');

function readJson(path: string) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

test('KIBER-94 exposes robot_card through preview-only real-data route', () => {
  for (const path of [routePath, mapperPath, componentPath, smokePath]) {
    assert.equal(existsSync(path), true, `${path.replace(root + '/', '')} must exist`);
  }

  const routeSource = readFileSync(routePath, 'utf8');
  assert.match(routeSource, /getRobotPages\(\)/);
  assert.match(routeSource, /toRobotCardTemplateData\(/);
  assert.match(routeSource, /RobotCardTemplate/);
  assert.match(routeSource, /noindex/);
  assert.match(routeSource, /process\.env\.DEPLOY_ENV !== 'production'/);
  assert.doesNotMatch(routeSource, /sitemap|launch-routes/);
});

test('KIBER-94 maps existing robot source-of-truth into template data without inventing prices or claims', () => {
  const mapperSource = readFileSync(mapperPath, 'utf8');
  assert.match(mapperSource, /RobotPageRecord/);
  assert.match(mapperSource, /RobotCardTemplateData/);
  assert.match(mapperSource, /const priceStatus = robot\.pricing\.mode === 'calculated' \? 'request' : 'needs_review'/);
  assert.match(mapperSource, /sourceStatus: 'page_content'/);
  assert.match(mapperSource, /reviewOnly:[\s\S]*publicRender: false/);
  assert.match(mapperSource, /priceSourceReconciliation/);
  assert.match(mapperSource, /claimSourceStatus/);
});

test('KIBER-94 preview smoke is wired but keeps production and public routes untouched', () => {
  const smoke = readFileSync(smokePath, 'utf8');
  assert.match(smoke, /dist\/preview\/kiber-94\/robot-card/);
  assert.match(smoke, /data-page-type="robot_card"/);
  assert.match(smoke, /noindex, nofollow/);
  assert.match(smoke, /source URL leaked/);
  assert.match(smoke, /massPageGeneration: false/);

  const pkg = readJson(packagePath);
  assert.equal(pkg.scripts['test:kiber94-robot-card-preview'], 'node scripts/kiber94-robot-card-preview-smoke.mjs');
  assert.doesNotMatch(pkg.scripts.ci, /test:kiber94-robot-card-preview/, 'preview-rendered smoke should not run in production CI before build:preview');
});

test('KIBER-94 records owner approval only for robot_card structure and data mapping', () => {
  const report = readJson(reportPath);
  assert.equal(report.ownerApproval.scope, 'structure_and_data_mapping_only');
  assert.equal(report.ownerApproval.status, 'approved');
  assert.equal(report.ownerApproval.quote, 'Вроде бы все верно.');
  assert.equal(report.ownerApproval.designApproval, false);
  assert.equal(report.ownerApproval.publicRouteReplacementApproval, false);
  assert.equal(report.ownerApproval.productionApproval, false);
});

test('KIBER-94 robot_card preview has an owner-review visual layout layer', () => {
  const componentSource = readFileSync(componentPath, 'utf8');
  assert.match(componentSource, /import RobotCard from '\.\.\/blocks\/RobotCard\.astro'/);
  assert.match(componentSource, /import HomeGoshaQuote from '\.\.\/blocks\/HomeGoshaQuote\.astro'/);
  assert.match(componentSource, /import HomeImageCards from '\.\.\/blocks\/HomeImageCards\.astro'/);
  assert.match(componentSource, /import HomeFaqBlock from '\.\.\/blocks\/HomeFaqBlock\.astro'/);
  assert.match(componentSource, /import HomeFinalCta from '\.\.\/blocks\/HomeFinalCta\.astro'/);
  assert.match(componentSource, /homeArticles/);
  assert.match(componentSource, /homeGosha/);
  assert.doesNotMatch(componentSource, /template-gosha-quote/);
  assert.doesNotMatch(componentSource, /template-faq-list/);
  assert.doesNotMatch(componentSource, /template-live-cta/);
  assert.match(componentSource, /template-live-hero/);
  assert.match(componentSource, /template-live-hero__media/);
  assert.match(componentSource, /template-live-intro/);
  assert.match(componentSource, /data-block-id="aiSummary"/);
  assert.match(componentSource, /template-ai-summary/);
  assert.match(componentSource, /primaryGallery\.map/);
  assert.match(componentSource, /actionGallery\.map/);
  assert.doesNotMatch(componentSource, /height:\s*\.0625rem/);
  assert.match(componentSource, /data-block-id="structuredFacts"/);
  assert.match(componentSource, /data-block-id="includedService"/);
  assert.match(componentSource, /data-block-id="orderFlow"/);
  assert.doesNotMatch(componentSource, /data-block-id="relatedCompilations"/);
  assert.doesNotMatch(componentSource, /homeCompilations/);
  assert.match(componentSource, /01 — ключевые возможности/);
  assert.match(componentSource, /02 — сценарии использования/);
  assert.match(componentSource, /03 — робот в действии/);
  assert.match(componentSource, /04 — что входит/);
  assert.match(componentSource, /05 — факты для выбора/);
  assert.match(componentSource, /06 — как заказать/);
  assert.match(componentSource, /template-feature-grid/);
  assert.match(componentSource, /template-scenario-grid/);
  assert.match(componentSource, /box-shadow: none/);
  assert.match(componentSource, /border-radius: 1\.625rem/);
});

test('KIBER-94 preview route exposes SEO/AI schemas required for visible robot_card content', () => {
  const routeSource = readFileSync(routePath, 'utf8');
  assert.match(routeSource, /faqPageJsonLd/);
  assert.match(routeSource, /breadcrumbJsonLd/);
  assert.match(routeSource, /breadcrumbs=\{breadcrumbs\}/);
  assert.match(routeSource, /template\.faq\.map/);
});

test('KIBER-94 documents the approved-draft robot_card structure before rewriting generation skills', () => {
  assert.equal(existsSync(structureContractPath), true, 'robot-card structure contract must exist');
  const doc = readFileSync(structureContractPath, 'utf8');
  for (const phrase of [
    'Hero',
    'Short visible AI summary',
    'First gallery / robot appearance proof',
    'Text block',
    'Capabilities',
    'Scenarios / use cases',
    'Robot in action / second media surface',
    'Kiber Gosha brand voice',
    'CTA #1',
    'Included service',
    'Structured facts / facts for choosing',
    'Order flow / what happens after request',
    'FAQ',
    'CTA #2',
    'Related articles / Blog Kiber Gosha',
    'Related catalog',
    'Skill rewrite requirement',
  ]) {
    assert.ok(doc.includes(phrase), `structure contract must include ${phrase}`);
  }
  assert.match(doc, /Kiber Gosha must appear across page types/);
  assert.match(doc, /not decoration/);
  assert.doesNotMatch(doc, /Related Подборки/);
})

test('KIBER-94 owner feedback fixes block order and removes duplicate short summaries', () => {
  const componentSource = readFileSync(componentPath, 'utf8');
  const order = [
    'data-block-id="hero"',
    'data-block-id="aiSummary"',
    'data-block-id="gallery"',
    'data-block-id="description"',
    'data-block-id="capabilities"',
    'data-block-id="scenarios"',
    'data-block-id="robotInAction"',
    'data-block-id="goshaCta"',
    'data-block-id="pricing"',
    'data-block-id="includedService"',
    'data-block-id="structuredFacts"',
    'data-block-id="orderFlow"',
    'data-block-id="faq"',
    'data-block-id="finalQuestionsCta"',
    'data-block-id="articles"',
    'data-block-id="relatedCatalog"',
  ];
  let previous = -1;
  for (const needle of order) {
    const current = componentSource.indexOf(needle);
    assert.ok(current > previous, `${needle} must appear after the previous approved block`);
    previous = current;
  }
  assert.equal((componentSource.match(/data-block-id="aiSummary"/g) ?? []).length, 1);
  assert.doesNotMatch(componentSource, /data-block-id="modelIntro"/);
  assert.doesNotMatch(componentSource, /data-block-id="relatedCompilations"/);
  assert.match(componentSource, /template-live-hero__media/);
  assert.match(componentSource, /Остались вопросы/);
});
