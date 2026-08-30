import assert from 'node:assert/strict';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const root = process.cwd();
const workflowPath = resolve(root, 'data/review/content-package-workflow.json');
const contentAcceptancePath = resolve(root, 'data/review/content-acceptance.json');
const mediaRightsPath = resolve(root, 'data/review/media-rights-registry.json');
const leadContractPath = resolve(root, 'data/lead/capability-contract.json');
const legalDocumentsPath = resolve(root, 'data/legal/legal-documents.json');
const reportPath = resolve(root, 'docs/review/content-package-workflow/report.json');

function readJson(path) { return JSON.parse(readFileSync(path, 'utf8')); }

for (const path of [workflowPath, contentAcceptancePath, mediaRightsPath, leadContractPath, legalDocumentsPath]) {
  assert.equal(existsSync(path), true, `${path.replace(`${root}/`, '')} missing`);
}

const workflow = readJson(workflowPath);
const contentAcceptance = readJson(contentAcceptancePath);
const mediaRights = readJson(mediaRightsPath);
const leadContract = readJson(leadContractPath);
const legalDocuments = readJson(legalDocumentsPath);
const failures = [];
const warnings = [];

if (workflow.schemaVersion !== 1) failures.push('schemaVersion must be 1');
if (workflow.policy?.productionPublishRequiresHumanApproval !== true) failures.push('productionPublishRequiresHumanApproval must remain true');
if (workflow.policy?.productionContacts !== 'approved-public-defaults') failures.push('productionContacts must remain approved public defaults');
if (workflow.policy?.liveLeadDestinations !== 'disabled') failures.push('liveLeadDestinations must remain disabled');
if (workflow.policy?.analyticsProviderIds !== 'disabled') failures.push('analyticsProviderIds must remain disabled');
if (workflow.summary?.finalApproved !== 2) failures.push('workflow should record approved media-rights and public-contacts sections');
if (workflow.summary?.productionBlockedUntilHumanApproval !== true) failures.push('productionBlockedUntilHumanApproval must be true');

const sourcePaths = new Set((workflow.sources || []).map((source) => source.path));
for (const requiredPath of [
  'data/review/content-acceptance.json',
  'data/review/media-rights-registry.json',
  'data/lead/capability-contract.json',
  'data/legal/legal-documents.json',
]) {
  if (!sourcePaths.has(requiredPath)) failures.push(`sources missing ${requiredPath}`);
}

if (workflow.summary?.robotPages !== contentAcceptance.robots?.length) failures.push('robotPages summary must match content acceptance registry');
if (workflow.summary?.launchPages !== contentAcceptance.launchPages?.length) failures.push('launchPages summary must match content acceptance registry');
if (workflow.summary?.legalDocuments !== legalDocuments.documents?.length) failures.push('legalDocuments summary must match legal document registry');
if (contentAcceptance.summary?.finalApproved !== 0) failures.push('content acceptance still must not claim final approval');
if (mediaRights.summary?.productionApproved !== 24) failures.push('media rights registry should record owner production media approval');
if (leadContract.routing?.enabled !== false) failures.push('lead routing must stay disabled');
if ((leadContract.routing?.destinations || []).length !== 0) failures.push('lead routing destinations must stay empty');

for (const section of workflow.packageSections || []) {
  const label = section.id || section.title;
  if (section.id === 'media-rights') {
    if (section.status !== 'approved_by_owner_for_production_media_use') failures.push(`${label}: media rights section should be owner-approved`);
    if (section.productionApproved !== true) failures.push(`${label}: media rights productionApproved should be true`);
    if (!section.approvedAt) failures.push(`${label}: approval timestamp required`);
  } else if (section.id === 'public-contacts') {
    if (section.status !== 'approved_by_owner_for_preview_pr') failures.push(`${label}: public contacts section should be owner-approved`);
    if (section.productionApproved !== true) failures.push(`${label}: public contacts productionApproved should be true`);
    if (!section.approvedAt) failures.push(`${label}: public contacts approval timestamp required`);
  } else {
    if (section.status !== 'ready_for_human_review') failures.push(`${label}: status must be ready_for_human_review`);
    if (section.productionApproved !== false) failures.push(`${label}: productionApproved must be false`);
  }
  if (!Array.isArray(section.requiredEvidence) || section.requiredEvidence.length === 0) failures.push(`${label}: requiredEvidence must be non-empty`);
  if (section.sourcePath && !sourcePaths.has(section.sourcePath)) warnings.push(`${label}: sourcePath is not listed in sources`);
}

const report = {
  issue: workflow.issue,
  generatedAt: new Date().toISOString(),
  packageSections: workflow.packageSections?.length || 0,
  robotPages: workflow.summary?.robotPages || 0,
  launchPages: workflow.summary?.launchPages || 0,
  legalDocuments: workflow.summary?.legalDocuments || 0,
  finalApproved: workflow.summary?.finalApproved || 0,
  leadRoutingEnabled: leadContract.routing?.enabled === true,
  productionApprovedMedia: mediaRights.summary?.productionApproved || 0,
  status: failures.length ? 'failed' : 'passed',
  failures,
  warnings: warnings.slice(0, 40),
};
mkdirSync(dirname(reportPath), { recursive: true });
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

if (failures.length) {
  console.error(`KIBER content package workflow smoke failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log(`KIBER content package workflow smoke passed: media rights section approved; remaining content/legal/lead sections keep production publish gated.`);
