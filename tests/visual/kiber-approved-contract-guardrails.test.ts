import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const root = process.cwd();
const paths = {
  contract: resolve(root, 'data/contracts/kiber-approved-page-contracts.json'),
  validator: resolve(root, 'scripts/validate-kiber-approved-contracts.mjs'),
  scopeValidator: resolve(root, 'scripts/validate-owner-feedback-scope.mjs'),
  stagingBuilder: resolve(root, 'scripts/build-combined-review.mjs'),
  stagingManifest: resolve(root, 'data/contracts/combined-review-manifest.example.json'),
  package: resolve(root, 'package.json'),
  robotTemplate: resolve(root, 'src/components/templates/RobotCardTemplate.astro'),
  articleTemplate: resolve(root, 'src/components/templates/ArticleBlocksTemplate.astro'),
  compilationTemplate: resolve(root, 'src/components/templates/CompilationTemplate.astro'),
};

function readJson(path: string) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

test('canonical approved page contract is executable and names one source of truth per page type', () => {
  for (const [name, path] of Object.entries(paths)) assert.equal(existsSync(path), true, `${name} must exist`);
  const contract = readJson(paths.contract);
  assert.equal(contract.schemaVersion, 1);
  assert.equal(contract.status, 'active_owner_approved_guardrail');
  assert.deepEqual(Object.keys(contract.pageTypes).sort(), ['article_detail', 'compilation', 'robot_card']);
  for (const spec of Object.values<any>(contract.pageTypes)) {
    assert.equal(typeof spec.canonicalComponent, 'string');
    assert.equal(typeof spec.approvedReferenceRoute, 'string');
    assert.ok(spec.protectedRules.length > 0);
  }
  assert.equal(contract.feedbackWorkflow.scopeLockRequired, true);
  assert.equal(contract.feedbackWorkflow.realReviewUrlRequired, true);
  assert.equal(contract.feedbackWorkflow.unexpectedDiffMustFail, true);
});

test('canonical media roles block archived sources and preserve proportional galleries', () => {
  const contract = readJson(paths.contract);
  assert.deepEqual(contract.mediaRoles.robot_card.hero.allowedPathPrefixes, ['/images/kiber-45/']);
  assert.ok(contract.mediaRoles.robot_card.hero.blockedRoles.includes('legacy_horizontal_hero'));
  assert.ok(contract.mediaRoles.robot_card.gallery.blockedPathPrefixes.includes('/images/kiber-45/'));
  assert.equal(contract.galleryContract.figure.width, 'fit-content');
  assert.equal(contract.galleryContract.figure.background, 'transparent');
  assert.equal(contract.galleryContract.image.width, 'auto');
  assert.equal(contract.galleryContract.image.height, '100%');
  assert.equal(contract.galleryContract.image.objectFit, 'contain');
  assert.equal(contract.galleryContract.forbidden.objectFit, 'cover');
  assert.equal(contract.galleryContract.forbidden.fixedEqualWidth, true);
});

test('active templates implement the proportional gallery contract and forbid generic Gosha fallback', () => {
  for (const path of [paths.robotTemplate, paths.articleTemplate, paths.compilationTemplate]) {
    const source = readFileSync(path, 'utf8');
    assert.match(source, /width:\s*fit-content/);
    assert.match(source, /background:\s*transparent/);
    assert.match(source, /width:\s*auto;\s*height:\s*100%;\s*max-width:\s*none/);
    assert.match(source, /object-fit:\s*contain/);
  }
  const robot = readFileSync(paths.robotTemplate, 'utf8');
  assert.doesNotMatch(robot, /goshaQuote\s*\?\?|fallback.*Gosha|generic.*Gosha/i);
});

test('guardrail scripts are wired to narrow and full validation profiles', () => {
  const pkg = readJson(paths.package);
  assert.equal(pkg.scripts['test:approved-contracts'], 'node scripts/validate-kiber-approved-contracts.mjs');
  assert.equal(pkg.scripts['validate:owner-feedback-scope'], 'node scripts/validate-owner-feedback-scope.mjs');
  assert.match(pkg.scripts['verify:narrow'], /test:approved-contracts/);
  assert.match(pkg.scripts.ci, /test:approved-contracts/);
});

test('combined review manifest refuses conflict reconciliation and requires post-merge rendered checks', () => {
  const manifest = readJson(paths.stagingManifest);
  assert.equal(manifest.conflictPolicy, 'fail_do_not_reconcile');
  assert.equal(manifest.requireCleanWorktree, true);
  assert.equal(manifest.requireUniqueBlockIds, true);
  assert.ok(manifest.postMergeCommands.includes('npm run test:approved-contracts'));
  assert.ok(manifest.postMergeCommands.includes('npm run build:preview'));
  const builder = readFileSync(paths.stagingBuilder, 'utf8');
  assert.match(builder, /merge --no-edit/);
  assert.match(builder, /fail_do_not_reconcile/);
  assert.doesNotMatch(builder, /<<<<<<<|regex.*reconcile|replace.*conflict/i);
});


test('scope lock requires an approved reference and blocks unexpected files', () => {
  const scope = readJson(resolve(root, 'data/contracts/owner-feedback-scope.example.json'));
  assert.match(scope.approvedReference, /^\/preview\//);
  assert.ok(Array.isArray(scope.protectedElements) && scope.protectedElements.length > 0);
  const valid = spawnSync(process.execPath, [paths.scopeValidator, '--manifest', 'data/contracts/owner-feedback-scope.example.json', '--changed-files', scope.allowedFiles[0]], { cwd: root, encoding: 'utf8' });
  assert.equal(valid.status, 0, valid.stderr);
  const invalid = spawnSync(process.execPath, [paths.scopeValidator, '--manifest', 'data/contracts/owner-feedback-scope.example.json', '--changed-files', 'src/components/BaseLayout.astro'], { cwd: root, encoding: 'utf8' });
  assert.notEqual(invalid.status, 0);
  assert.match(`${invalid.stdout}${invalid.stderr}`, /scope lock: forbidden files changed|scope lock: unexpected files changed/);
});

test('combined review builder validates a no-deploy conflict-refusing plan', () => {
  const result = spawnSync(process.execPath, [paths.stagingBuilder, '--manifest', 'data/contracts/combined-review-manifest.example.json', '--plan'], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  const plan = JSON.parse(result.stdout);
  assert.equal(plan.status, 'valid_plan');
  assert.equal(plan.deploy, false);
  assert.equal(plan.mergeCommandLabel, 'git merge --no-edit');
});


test('article template does not duplicate the shared FAQ id', () => {
  const source = readFileSync(paths.articleTemplate, 'utf8');
  assert.doesNotMatch(source, /<section id="faq"[^>]*>[\s\S]*?<HomeFaqBlock/);
  assert.match(source, /<section id="articleFaq"[^>]*data-block-id="faq"/);
});


test('repeated shared Gosha blocks receive unique ids', () => {
  const shared = readFileSync(resolve(root, 'src/components/blocks/HomeGoshaQuote.astro'), 'utf8');
  const compilation = readFileSync(paths.compilationTemplate, 'utf8');
  assert.match(shared, /sectionId\?: string/);
  assert.match(shared, /id=\{sectionId\}/);
  assert.match(compilation, /sectionId="compilation-gosha-intro"/);
  assert.match(compilation, /sectionId="compilation-gosha-conclusion"/);
});


test('repeated shared final CTA blocks receive unique section and title ids', () => {
  const shared = readFileSync(resolve(root, 'src/components/blocks/HomeFinalCta.astro'), 'utf8');
  const robot = readFileSync(paths.robotTemplate, 'utf8');
  assert.match(shared, /sectionId\?: string/);
  assert.match(shared, /titleId\?: string/);
  assert.match(shared, /id=\{sectionId\}/);
  assert.match(shared, /sectionId = 'social'/);
  assert.match(shared, /titleId = 'home-final-cta-title'/);
  assert.match(shared, /aria-labelledby=\{titleId\}/);
  assert.match(robot, /sectionId="robot-card-quick-cta" titleId="robot-card-quick-cta-title"/);
  assert.match(robot, /sectionId="robot-card-final-cta" titleId="robot-card-final-cta-title"/);
});
