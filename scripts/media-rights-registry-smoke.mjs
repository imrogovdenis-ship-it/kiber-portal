import assert from 'node:assert/strict';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const root = process.cwd();
const registryPath = resolve(root, 'data/review/media-rights-registry.json');
const robotsPath = resolve(root, 'src/content/robots.generated.json');
const reportPath = resolve(root, 'docs/review/media-rights/media-rights-registry-report.json');

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

assert.equal(existsSync(registryPath), true, 'media rights registry missing');
assert.equal(existsSync(robotsPath), true, 'generated robot catalog missing');

const registry = readJson(registryPath);
const robots = readJson(robotsPath).robots;
const failures = [];
const warnings = [];

if (registry.schemaVersion !== 1) failures.push('schemaVersion must be 1');
if (registry.policy?.productionUseRequiresHumanRightsApproval !== true) failures.push('productionUseRequiresHumanRightsApproval must be true');
if (registry.policy?.noUnverifiedMediaInProduction !== true) failures.push('noUnverifiedMediaInProduction must be true');
for (const status of ['needs_rights_review', 'approved_for_preview', 'approved_for_production', 'blocked_for_production']) {
  if (!registry.allowedRightsStatuses?.includes(status)) failures.push(`allowedRightsStatuses missing ${status}`);
}

const registrySlugs = new Set(registry.robots?.map((item) => item.slug));
const generatedSlugs = new Set(robots.map((robot) => robot.slug));
if (registrySlugs.size !== generatedSlugs.size) failures.push(`expected ${generatedSlugs.size} robot records, got ${registrySlugs.size}`);
for (const slug of generatedSlugs) {
  if (!registrySlugs.has(slug)) failures.push(`${slug}: missing media rights registry record`);
}

for (const item of registry.robots || []) {
  const label = item.slug || item.id;
  if (!generatedSlugs.has(item.slug)) failures.push(`${label}: not present in generated catalog`);
  if (item.productionApproved !== true) failures.push(`${label}: production media approval should be recorded after owner review`);
  if (item.rightsStatus !== 'approved_for_production') failures.push(`${label}: rightsStatus must be approved_for_production after owner approval`);
  if (!item.reviewFlags?.includes('owner_approved_media_rights')) failures.push(`${label}: owner_approved_media_rights flag required`);
  if (!item.approval?.approvedAt) failures.push(`${label}: approval evidence timestamp required`);
  if (!item.assets?.hero?.src?.startsWith('/images/')) failures.push(`${label}: hero asset path missing or not public image path`);
  if (!item.assets?.hero?.alt) failures.push(`${label}: hero alt missing`);
  for (const asset of item.assets?.gallery || []) {
    if (!asset.src?.startsWith('/images/')) failures.push(`${label}: gallery asset ${asset.index} path missing or not public image path`);
    if (!asset.alt) warnings.push(`${label}: gallery asset ${asset.index} lacks alt text for rights review context`);
  }
}

const report = {
  issue: registry.issue,
  generatedAt: new Date().toISOString(),
  robotsChecked: registry.robots?.length || 0,
  productionApproved: (registry.robots || []).filter((item) => item.productionApproved === true).length,
  needsRightsReview: (registry.robots || []).filter((item) => item.rightsStatus === 'needs_rights_review').length,
  status: failures.length ? 'failed' : 'passed',
  failures,
  warnings: warnings.slice(0, 60),
};
mkdirSync(dirname(reportPath), { recursive: true });
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

if (failures.length) {
  console.error(`KIBER media rights registry smoke failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log(`KIBER media rights registry smoke passed: ${report.robotsChecked} robot media records have owner media approval; production deploy remains separately blocked.`);
