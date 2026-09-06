import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const contract = JSON.parse(readFileSync('data/content-contracts/kiber-claude-page-block-contracts.json', 'utf8'));

test('Claude content contracts validate with project validator', () => {
  const output = execFileSync('python3', ['scripts/validate_claude_content_contracts.py'], { encoding: 'utf8' });
  assert.match(output, /validation passed/);
});

test('Claude cannot change design or production boundaries', () => {
  assert.equal(contract.policy.productionDeploy, false);
  assert.equal(contract.policy.dnsChange, false);
  assert.equal(contract.policy.secretsChanged, false);
  assert.equal(contract.policy.analyticsActivation, false);
  assert.equal(contract.policy.liveLeadRouting, false);
  assert.equal(contract.policy.massPageGeneration, false);
  assert.equal(contract.policy.claudeMayChangeDesign, false);
  assert.equal(contract.policy.hermesMapsFieldsWithoutReinterpretingDesign, true);
});

test('Article contract has fixed opening/flexible middle/fixed closing', () => {
  const article = contract.pageTypes.article_detail;
  assert.deepEqual(article.requiredOpening, ['Header', 'Breadcrumbs', 'hero', 'seoIntro']);
  assert.deepEqual(article.mandatoryFlexibleMiddle.sort(), ['goshaQuote', 'plainText']);
  assert.deepEqual(article.requiredClosing, ['faq', 'cta2', 'catalogBlock', 'relatedArticles', 'relatedCompilations']);
  assert.ok(article.optionalBlocks.includes('comparisonBlock'));
  assert.ok(article.optionalBlocks.includes('productCard'));
});

test('Robot card and compilation contracts have approved fixed block structures', () => {
  assert.equal(contract.pageTypes.robot_card.fixedBlockOrder, true);
  assert.equal(contract.pageTypes.compilation.fixedBlockOrder, true);
  assert.deepEqual(contract.pageTypes.robot_card.requiredClosing, ['faq', 'finalQuestionsCta', 'articles', 'relatedCatalog']);
  assert.deepEqual(contract.pageTypes.compilation.requiredClosing, ['faq', 'cta2', 'catalogBlock', 'relatedArticles', 'otherCompilations']);
});
