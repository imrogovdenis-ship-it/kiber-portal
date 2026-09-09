#!/usr/bin/env node
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, relative } from 'node:path';

const root = process.cwd();
const args = process.argv.slice(2);
const distIndex = args.indexOf('--dist');
const distRoot = resolve(root, distIndex >= 0 ? args[distIndex + 1] : 'dist');
const contractPath = resolve(root, 'data/contracts/kiber-approved-page-contracts.json');
const contract = JSON.parse(readFileSync(contractPath, 'utf8'));
const compact = (value) => value.replace(/\s+/g, ' ');

assert.equal(contract.status, 'active_owner_approved_guardrail');
assert.equal(contract.feedbackWorkflow.scopeLockRequired, true);
assert.equal(contract.feedbackWorkflow.unexpectedDiffMustFail, true);
assert.equal(contract.approvalBoundaries.production, false);

for (const [pageType, spec] of Object.entries(contract.pageTypes)) {
  for (const key of ['canonicalComponent', 'canonicalData', 'approvalRecord']) {
    assert.equal(existsSync(resolve(root, spec[key])), true, `${pageType}: missing ${key} ${spec[key]}`);
  }
  const approval = JSON.parse(readFileSync(resolve(root, spec.approvalRecord), 'utf8'));
  const status = String(approval.status ?? approval.approvalStatus ?? '');
  assert.match(status, /approved/i, `${pageType}: approval record is not approved`);
}

const gallerySources = [
  ['robot_card', 'src/components/templates/RobotCardTemplate.astro'],
  ['article_detail', 'src/components/templates/ArticleBlocksTemplate.astro'],
  ['compilation', 'src/components/templates/CompilationTemplate.astro'],
];
for (const [pageType, path] of gallerySources) {
  const source = compact(readFileSync(resolve(root, path), 'utf8'));
  assert.match(source, /width:\s*fit-content/, `${pageType}: gallery figure must shrink-wrap intrinsic width`);
  assert.match(source, /background:\s*transparent/, `${pageType}: gallery figure must not create white gutters`);
  assert.match(source, /width:\s*auto;\s*height:\s*100%;\s*max-width:\s*none/, `${pageType}: image width must follow its format`);
  assert.match(source, /object-fit:\s*contain/, `${pageType}: gallery image must preserve format`);
}

const robotTemplate = readFileSync(resolve(root, 'src/components/templates/RobotCardTemplate.astro'), 'utf8');
assert.doesNotMatch(robotTemplate, /goshaQuote\s*\?\?|generic[^\n]{0,40}gosha|fallback[^\n]{0,40}gosha/i, 'robot_card: generic Gosha fallback is forbidden');
const robotData = readFileSync(resolve(root, 'src/lib/kiber94-robot-template-data.ts'), 'utf8');
assert.match(robotData, /Missing explicit per-robot Gosha quote/, 'robot_card: curated cards must fail without explicit Gosha quote');

for (const archived of contract.deprecatedSources) {
  assert.ok(archived.blockedFor.length > 0, `${archived.path}: deprecated source must name blocked uses`);
}

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const path = resolve(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

let htmlFiles = [];
if (distIndex >= 0) {
  assert.equal(existsSync(distRoot), true, `dist path missing: ${distRoot}`);
  htmlFiles = walk(distRoot).filter((path) => path.endsWith('.html'));
  for (const path of htmlFiles) {
    const html = readFileSync(path, 'utf8');
    const isConcretePage = /data-page-type="(?:robot_card|article_detail|compilation)"/.test(html) && !/\/preview\/design-review\//.test(path);
    if (isConcretePage) {
      const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
      const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
      assert.deepEqual(duplicates, [], `${relative(root, path)}: duplicate HTML ids: ${duplicates.join(', ')}`);
      for (const singleton of ['hero', 'faq', 'seoIntent']) {
        const count = (html.match(new RegExp(`data-block-id="${singleton}"`, 'g')) ?? []).length;
        assert.ok(count <= 1, `${relative(root, path)}: duplicate singleton block ${singleton}`);
      }
    }
  }
}
console.log(`KIBER approved contract guard passed: ${gallerySources.length} page types${distIndex >= 0 ? `, ${htmlFiles.length} rendered HTML files` : ''}.`);
