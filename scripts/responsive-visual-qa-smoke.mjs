import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const registryPath = resolve(root, 'data/review/responsive-visual-qa.json');
const manifestPath = resolve(root, 'docs/review/kiber-63/screenshots/manifest.json');
const reportPath = resolve(root, 'docs/review/kiber-63/responsive-visual-qa-report.json');

function readJson(path) { return JSON.parse(readFileSync(path, 'utf8')); }

assert.equal(existsSync(registryPath), true, 'responsive visual QA registry missing');
assert.equal(existsSync(manifestPath), true, 'KIBER-63 screenshot manifest missing');

const registry = readJson(registryPath);
const manifest = readJson(manifestPath);
const failures = [];

if (registry.issue !== 'KIBER-63') failures.push('registry.issue must be KIBER-63');
if (manifest.issue !== 'KIBER-63') failures.push('manifest.issue must be KIBER-63');
if (registry.scope.productionDeployChanged !== false) failures.push('productionDeployChanged must remain false');
if (registry.approval.production.status !== 'not_requested') failures.push('production approval must not be claimed');
if (registry.approval.visualDirection.status !== 'approved') failures.push('visualDirection approval must be recorded');
if (!/Telegram/i.test(registry.approval.visualDirection.source || '')) failures.push('visual approval source must reference Telegram');
if (registry.summary.blockingDefects !== 0) failures.push(`blockingDefects must be 0, got ${registry.summary.blockingDefects}`);
if (registry.summary.criticalDefects !== 0 || registry.summary.highDefects !== 0) failures.push('critical/high defects must be 0');
if (registry.summary.routesChecked !== 6) failures.push(`expected 6 routes checked, got ${registry.summary.routesChecked}`);
if (registry.summary.viewportsChecked !== 4) failures.push(`expected 4 viewports checked, got ${registry.summary.viewportsChecked}`);
if (manifest.screenshots.length !== 24) failures.push(`expected 24 screenshot records, got ${manifest.screenshots.length}`);
if (manifest.contactSheets.length < 7) failures.push(`expected at least 7 contact sheets, got ${manifest.contactSheets.length}`);

const routeKeys = new Set(manifest.screenshots.map((shot) => `${shot.routeName}:${shot.viewport}`));
if (routeKeys.size !== 24) failures.push('screenshot route x viewport matrix has duplicates/missing entries');
for (const route of manifest.routes) {
  for (const viewport of manifest.viewports) {
    if (!routeKeys.has(`${route.name}:${viewport.name}`)) failures.push(`missing screenshot record for ${route.name} @ ${viewport.name}`);
  }
}

for (const sheet of manifest.contactSheets) {
  const file = resolve(root, sheet.file);
  if (!existsSync(file)) { failures.push(`${sheet.file}: contact sheet missing`); continue; }
  const stat = statSync(file);
  if (stat.size < 10_000) failures.push(`${sheet.file}: contact sheet too small (${stat.size} bytes)`);
  if (sheet.sha256 && sheet.sha256.length !== 64) failures.push(`${sheet.file}: invalid sha256`);
}

for (const check of registry.checks || []) {
  if (registry.severityPolicy.blockingSeverities.includes(check.severity) && check.status !== 'passed') {
    failures.push(`${check.id}: blocking check status must be passed`);
  }
}

const report = {
  issue: 'KIBER-63',
  generatedAt: new Date().toISOString(),
  routesChecked: registry.summary.routesChecked,
  viewportsChecked: registry.summary.viewportsChecked,
  screenshotsCaptured: registry.summary.screenshotsCaptured,
  contactSheetsCommitted: registry.summary.contactSheetsCommitted,
  blockingDefects: registry.summary.blockingDefects,
  visualDirectionApproved: registry.summary.visualDirectionApproved,
  productionApproved: registry.summary.productionApproved,
  status: failures.length ? 'failed' : 'passed',
  failures,
};
await import('node:fs').then(({ mkdirSync, writeFileSync }) => {
  mkdirSync(resolve(root, 'docs/review/kiber-63'), { recursive: true });
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
});

if (failures.length) {
  console.error(`KIBER-63 responsive visual QA smoke failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log(`KIBER-63 responsive visual QA smoke passed: ${manifest.screenshots.length} screenshots, ${manifest.contactSheets.length} contact sheets, 0 blocking defects.`);
