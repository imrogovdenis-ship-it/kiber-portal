import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const root = process.cwd();
const templateContractPath = resolve(root, 'data/templates/kiber94-page-template-contract.json');
const sourcePath = resolve(root, 'src/lib/page-type-templates.ts');
const robotTemplatePath = resolve(root, 'src/components/templates/RobotCardTemplate.astro');
const articleTemplatePath = resolve(root, 'src/components/templates/ArticleDetailTemplate.astro');
const compilationTemplatePath = resolve(root, 'src/components/templates/CompilationTemplate.astro');
const smokePath = resolve(root, 'scripts/kiber94-page-template-contract-smoke.mjs');
const packagePath = resolve(root, 'package.json');

function readJson(path: string) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

test('KIBER-94 creates reusable source templates for the three repeating page types', () => {
  for (const path of [templateContractPath, sourcePath, robotTemplatePath, articleTemplatePath, compilationTemplatePath, smokePath]) {
    assert.equal(existsSync(path), true, `${path.replace(root + '/', '')} must exist`);
  }

  const contract = readJson(templateContractPath);
  assert.equal(contract.schemaVersion, 1);
  assert.equal(contract.issue, 'KIBER-94');
  assert.equal(contract.status, 'draft_for_owner_review');
  assert.deepEqual(contract.repeatingPageTypes, ['robot_card', 'article_detail', 'compilation']);
  assert.equal(contract.policy.productionSideEffects, false);
  assert.equal(contract.policy.massPageGeneration, false);
  assert.equal(contract.policy.reviewOnlyBlocksPublicRender, false);

  const pkg = readJson(packagePath);
  assert.equal(pkg.scripts['test:kiber94-page-templates'], 'node scripts/kiber94-page-template-contract-smoke.mjs');
  assert.match(pkg.scripts.ci, /npm run test:kiber94-page-templates/);
});

test('KIBER-94 template schemas preserve typed public blocks and review-only boundaries', () => {
  const source = readFileSync(sourcePath, 'utf8');
  assert.match(source, /pageTemplateBlockSchema/);
  assert.match(source, /reviewOnlyTemplateSchema/);
  assert.match(source, /publicRender:\s*z\.literal\(false\)/);
  assert.match(source, /pageType:\s*z\.enum\(\['robot_card', 'article_detail', 'compilation'\]\)/);
  assert.match(source, /templateSourceStatusSchema = z\.enum\(\[/);
  assert.match(source, /'owner_approved'/);
  assert.match(source, /'generated_needs_review'/);
  assert.match(source, /templatePriceStatusSchema = z\.enum\(\[/);
  assert.match(source, /'not_applicable'/);

  const contract = readJson(templateContractPath);
  for (const pageType of contract.repeatingPageTypes) {
    const spec = contract.templates[pageType];
    assert.ok(spec.publicBlocks.length >= 5, `${pageType}: public blocks required`);
    assert.ok(spec.reviewOnlyBlocks.includes('wordstatAnalysis') || spec.reviewOnlyBlocks.includes('claimSourceStatus'), `${pageType}: review-only evidence blocks required`);
    assert.ok(spec.requiredDataFields.includes('seo'), `${pageType}: seo field required`);
    assert.ok(spec.requiredDataFields.includes('aiSummary'), `${pageType}: aiSummary field required`);
    assert.ok(spec.requiredDataFields.includes('cta'), `${pageType}: cta field required`);
  }
});

test('KIBER-94 Astro templates expose stable block markers and do not render service-only sections', () => {
  const expectations = [
    { path: robotTemplatePath, pageType: 'robot_card', blocks: ['hero', 'modelIntro', 'gallery', 'description', 'capabilities', 'scenarios', 'robotInAction', 'pricing', 'goshaCta', 'faq'] },
    { path: articleTemplatePath, pageType: 'article_detail', blocks: ['hero', 'intro', 'bodySections', 'goshaCta', 'faq', 'relatedLinks'] },
    { path: compilationTemplatePath, pageType: 'compilation', blocks: ['hero', 'intro', 'gallery', 'scenarioExplanation', 'catalogBlock', 'relatedArticles', 'faq', 'goshaCta', 'otherCompilations'] },
  ];

  for (const item of expectations) {
    const source = readFileSync(item.path, 'utf8');
    assert.match(source, new RegExp(`data-page-type=\\"${item.pageType}\\"`), `${item.pageType}: page marker required`);
    assert.match(source, /data-kiber-task="KIBER-94"/, `${item.pageType}: task marker required`);
    for (const block of item.blocks) {
      assert.match(source, new RegExp(`data-block-id=\\"${block}\\"`), `${item.pageType}: ${block} block marker required`);
    }
    assert.doesNotMatch(source, /Wordstat|SERP|keywordDensity|checklistReport|crmConfig|leadRoutingImplementationNotes/, `${item.pageType}: service-only labels must not render`);
  }
});
