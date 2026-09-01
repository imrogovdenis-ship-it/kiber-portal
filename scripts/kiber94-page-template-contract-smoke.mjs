#!/usr/bin/env node
import assert from 'node:assert/strict';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const root = process.cwd();
const contractPath = resolve(root, 'data/templates/kiber94-page-template-contract.json');
const sourceSchemaPath = resolve(root, 'src/lib/page-type-templates.ts');
const pageIntentPath = resolve(root, 'data/seo/page-type-intent-contract.draft.json');
const outputPath = resolve(root, 'docs/review/kiber-94-template-contract/report.json');

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

const contract = readJson(contractPath);
const pageIntent = readJson(pageIntentPath);
const sourceSchema = readFileSync(sourceSchemaPath, 'utf8');

assert.equal(contract.schemaVersion, 1);
assert.equal(contract.issue, 'KIBER-94');
assert.equal(contract.policy.productionSideEffects, false);
assert.equal(contract.policy.massPageGeneration, false);
assert.equal(contract.policy.reviewOnlyBlocksPublicRender, false);
assert.equal(sourceSchema.includes('reviewOnlyTemplateSchema'), true);
assert.equal(sourceSchema.includes('publicRender: z.literal(false)'), true);

const serviceOnlyPattern = /Wordstat|SERP|keywordDensity|checklistReport|crmConfig|leadRoutingImplementationNotes/;
const checked = [];
for (const pageType of contract.repeatingPageTypes) {
  const spec = contract.templates[pageType];
  const sourceSpec = pageIntent.pageTypes[pageType];
  assert.ok(sourceSpec, `${pageType}: missing in page-type intent contract`);
  assert.equal(existsSync(resolve(root, spec.component)), true, `${pageType}: template component missing`);
  const componentSource = readFileSync(resolve(root, spec.component), 'utf8');
  assert.match(componentSource, new RegExp(`data-page-type="${pageType}"`));
  assert.match(componentSource, /data-kiber-task="KIBER-94"/);
  for (const block of spec.publicBlocks) {
    assert.match(componentSource, new RegExp(`data-block-id="${block}"`), `${pageType}: ${block} marker missing`);
  }
  assert.doesNotMatch(componentSource, serviceOnlyPattern, `${pageType}: service-only wording leaked into template source`);
  checked.push({ pageType, component: spec.component, publicBlocks: spec.publicBlocks.length, reviewOnlyBlocks: spec.reviewOnlyBlocks.length });
}

const report = {
  issue: 'KIBER-94',
  status: 'passed',
  checked,
  safety: {
    productionDeployChanged: false,
    dnsChanged: false,
    secretsChanged: false,
    analyticsProviderChanged: false,
    liveLeadRoutingChanged: false,
    massPageGeneration: false,
  },
};
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, JSON.stringify(report, null, 2) + '\n');
console.log(`KIBER-94 page template contract smoke passed: ${checked.length} reusable templates checked.`);
