import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const root = process.cwd();
const passportsPath = resolve(root, 'data/seo/page-seo-passports.json');
const keywordMapPath = resolve(root, 'data/seo/keyword-map.json');
const auditorPath = resolve(root, 'scripts/audit_page_seo_components.py');
const aiChecklistPath = resolve(root, 'docs/ai-search-visibility-checklist.md');
const aiContractPath = resolve(root, 'data/seo/ai-search-visibility-contract.draft.json');
const aiEntityMapPath = resolve(root, 'data/seo/ai-entity-map.json');
const llmsTxtPath = resolve(root, 'public/llms.txt');
const remediationBacklogPath = resolve(root, 'data/seo/page-seo-remediation-backlog.json');
const remediationBacklogDocPath = resolve(root, 'docs/page-seo-remediation-backlog.md');
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

test('KIBER-93 includes AI search / LLM visibility conditions before mass generation', () => {
  assert.equal(existsSync(aiChecklistPath), true, 'docs/ai-search-visibility-checklist.md must exist');
  assert.equal(existsSync(aiContractPath), true, 'data/seo/ai-search-visibility-contract.draft.json must exist');
  assert.equal(existsSync(aiEntityMapPath), true, 'data/seo/ai-entity-map.json must exist');
  assert.equal(existsSync(llmsTxtPath), true, 'public/llms.txt must exist');

  const aiContract = readJson(aiContractPath);
  assert.equal(aiContract.schemaVersion, 1);
  assert.equal(aiContract.issue, 'KIBER-93');
  assert.equal(aiContract.status, 'owner_policy_approved_draft_for_content_review');
  assert.ok(aiContract.sources.includes('https://platform.openai.com/docs/bots'));
  assert.ok(aiContract.sources.includes('https://developers.google.com/search/docs/appearance/ai-features'));
  assert.ok(aiContract.sources.includes('https://llmstxt.org'));
  assert.ok(aiContract.requiredChecks.includes('aiSummary'));
  assert.ok(aiContract.requiredChecks.includes('entityClarity'));
  assert.ok(aiContract.requiredChecks.includes('questionAnswerBlocks'));
  assert.ok(aiContract.requiredChecks.includes('structuredFacts'));
  assert.ok(aiContract.requiredChecks.includes('llmsTxtCoverage'));
  assert.ok(aiContract.requiredChecks.includes('markdownAlternateOrLlmsEntry'));
  assert.equal(aiContract.robotsPolicyDecisionRequired, false);
  assert.equal(aiContract.robotsPolicy.status, 'owner_approved');
  assert.deepEqual(aiContract.robotsPolicy.allowedUserAgents, ['*', 'OAI-SearchBot', 'ChatGPT-User', 'GPTBot']);

  const llmsTxt = readFileSync(llmsTxtPath, 'utf8');
  assert.match(llmsTxt, /^# КИБЕР ПОРТАЛ/m);
  assert.match(llmsTxt, /Блог Кибер Гоши/);
  assert.match(llmsTxt, /Подборки/);
  assert.match(llmsTxt, /Гуманоидные роботы/);

  const robotsTxt = readFileSync(resolve(root, 'public/robots.txt'), 'utf8');
  assert.match(robotsTxt, /User-agent: OAI-SearchBot\nAllow: \//);
  assert.match(robotsTxt, /User-agent: ChatGPT-User\nAllow: \//);
  assert.match(robotsTxt, /User-agent: GPTBot\nAllow: \//);
});

test('SEO passports expose AI visibility fields aligned to entity map', () => {
  const passports = readJson(passportsPath);
  const entityMap = readJson(aiEntityMapPath);
  assert.equal(entityMap.schemaVersion, 1);
  assert.equal(entityMap.issue, 'KIBER-93');
  assert.ok(entityMap.entities['КИБЕР ПОРТАЛ'], 'brand entity required');

  for (const page of passports.pages.filter((item: { indexable: boolean }) => item.indexable)) {
    assert.ok(page.aiVisibility, `${page.slug}: aiVisibility block required`);
    assert.ok(page.aiVisibility.aiSummary.length >= 80, `${page.slug}: aiSummary must be extractable`);
    assert.match(page.aiVisibility.entityType, /^(service|product|article|collection|organization|legal|conversion)$/);
    assert.ok(Array.isArray(page.aiVisibility.entities) && page.aiVisibility.entities.length > 0, `${page.slug}: entities required`);
    assert.ok(page.aiVisibility.entities.some((entity: { name: string }) => entity.name === 'КИБЕР ПОРТАЛ'), `${page.slug}: brand entity required`);
    assert.ok(Array.isArray(page.aiVisibility.userQuestionsAnswered), `${page.slug}: userQuestionsAnswered required`);
    assert.ok(Array.isArray(page.aiVisibility.factualClaims), `${page.slug}: factualClaims required`);
    assert.ok(Array.isArray(page.aiVisibility.relatedPages), `${page.slug}: relatedPages required`);
  }
});

test('KIBER-93 audit closes safe CTA and WebPage schema false-positive warnings', () => {
  const auditPath = resolve(root, 'data/seo/page-seo-audit.json');
  assert.equal(existsSync(auditPath), true, 'data/seo/page-seo-audit.json must exist');
  const audit = readJson(auditPath);

  const robotRoutes = audit.routes.filter((route: { pageType: string }) => route.pageType === 'robot_card');
  assert.ok(robotRoutes.length >= 20, 'robot route audit coverage required');
  for (const route of robotRoutes) {
    assert.equal(route.checks.cta.status, 'pass', `${route.slug}: robot pages have lead/request CTAs with query strings`);
  }

  for (const slug of ['/privacy-policy/', '/consent/', '/cookie-policy/', '/terms/', '/lead/request/', '/lead/thanks/']) {
    const route = audit.routes.find((item: { slug: string }) => item.slug === slug);
    assert.ok(route, `${slug}: route audit missing`);
    assert.equal(route.checks.requiredSchemaTypes.status, 'pass', `${slug}: WebPage schema required`);
  }
});

test('KIBER-93 closes with a machine-readable remediation backlog for non-blocking warnings', () => {
  assert.equal(existsSync(remediationBacklogPath), true, 'data/seo/page-seo-remediation-backlog.json must exist');
  assert.equal(existsSync(remediationBacklogDocPath), true, 'docs/page-seo-remediation-backlog.md must exist');

  const backlog = readJson(remediationBacklogPath);
  assert.equal(backlog.schemaVersion, 1);
  assert.equal(backlog.issue, 'KIBER-93');
  assert.equal(backlog.status, 'owner_approved_complete');
  assert.equal(backlog.ownerApproval.approvalQuote, 'Закрываем KIBER-93 по варианту А.');
  assert.ok(backlog.ownerApproval.doesNotApprove.includes('productionDeploy'));
  assert.ok(backlog.ownerApproval.doesNotApprove.includes('prMerge'));
  assert.equal(backlog.summary.technicalFailures, 0);
  assert.ok(backlog.summary.warningCount > 0, 'baseline warnings must be preserved instead of hidden');
  assert.ok(Array.isArray(backlog.remediationTasks) && backlog.remediationTasks.length >= 3);
  assert.ok(Array.isArray(backlog.completedRemediations) && backlog.completedRemediations.length >= 2);

  const taskIds = backlog.remediationTasks.map((task: { id: string }) => task.id);
  const completedIds = backlog.completedRemediations.map((task: { id: string }) => task.id);
  assert.ok(taskIds.includes('seo-robot-template-keyword-intent-and-cta'));
  assert.ok(taskIds.includes('seo-index-pages-faq-breadcrumbs-schema'));
  assert.ok(taskIds.includes('seo-markdown-alternates-for-llm'));
  assert.ok(completedIds.includes('seo-audit-cta-query-string-detection'));
  assert.ok(completedIds.includes('seo-legal-conversion-webpage-schema'));

  for (const task of backlog.remediationTasks) {
    assert.match(task.status, /^(ready_for_next_issue|requires_owner_content_review|requires_design_review)$/);
    assert.ok(Array.isArray(task.warningKeys) && task.warningKeys.length > 0, `${task.id}: warning keys required`);
    assert.ok(Array.isArray(task.routes) && task.routes.length > 0, `${task.id}: routes required`);
    assert.equal(task.safety.productionDeploy, false, `${task.id}: must not imply production deploy`);
    assert.equal(task.safety.liveLeadRouting, false, `${task.id}: must not imply live lead routing`);
  }
});
