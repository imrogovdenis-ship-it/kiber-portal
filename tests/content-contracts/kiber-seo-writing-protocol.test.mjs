import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

test('KIBER SEO research writing protocol exists and validates', () => {
  assert.ok(existsSync('data/content-contracts/kiber-seo-research-writing-protocol.json'));
  assert.ok(existsSync('docs/content-contracts/kiber-seo-research-writing-protocol.md'));
  const result = spawnSync('python3', ['scripts/validate_kiber_seo_research_writing_protocol.py'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
});

test('protocol requires research before copy and keeps production gated', () => {
  const protocol = JSON.parse(readFileSync('data/content-contracts/kiber-seo-research-writing-protocol.json', 'utf8'));
  for (const stage of ['wordstatAnalysis', 'serpAnalysis', 'competitorGapAnalysis', 'seoPassport', 'blockMap']) {
    assert.ok(protocol.researchStages.some((item) => item.id === stage && item.required === true), `missing ${stage}`);
  }
  for (const action of ['production_deploy', 'dns_change', 'secret_change', 'analytics_enable', 'live_lead_routing_enable']) {
    assert.ok(protocol.forbiddenActions.includes(action), `missing forbidden ${action}`);
  }
});

test('protocol supports all KIBER page content types and structured packages', () => {
  const protocol = JSON.parse(readFileSync('data/content-contracts/kiber-seo-research-writing-protocol.json', 'utf8'));
  assert.deepEqual(protocol.pageTypes.sort(), ['article_detail', 'compilation', 'robot_card']);
  for (const field of ['research', 'seo', 'aiVisibility', 'blocks', 'media', 'internalLinks', 'schema', 'review']) {
    assert.ok(protocol.outputPackageRequiredFields.includes(field), `missing package field ${field}`);
  }
});
