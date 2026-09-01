import assert from 'node:assert/strict';
import { readFileSync, statSync, existsSync } from 'node:fs';

const json = (path) => JSON.parse(readFileSync(path, 'utf8'));
const qa = json('data/review/full-site-visual-qa.json');
const manifest = json('docs/review/kiber-91-full-site-visual-qa/screenshots/manifest.json');
const dom = json('docs/review/kiber-91-full-site-visual-qa/dom-audit.json');

assert.equal(qa.issue, 'KIBER-91');
assert.equal(qa.approval.productionApprovalGranted, false);
assert.equal(qa.approval.mergePermissionGranted, false);
assert.equal(qa.technicalChecks.productionDeployChanged, false);
assert.equal(qa.technicalChecks.dnsChanged, false);
assert.equal(qa.technicalChecks.productionSecretsChanged, false);
assert.equal(qa.technicalChecks.liveLeadRoutingChanged, false);
assert.equal(qa.technicalChecks.analyticsProviderChanged, false);
assert.equal(qa.scope.routesChecked, 15);
assert.equal(qa.scope.viewportsChecked, 3);
assert.equal(qa.scope.screenshotsCaptured, 45);
assert.equal(qa.scope.contactSheets, 3);
assert.equal(manifest.screenshots.length, 45);
assert.equal(manifest.contactSheets.length, 3);
assert.equal(dom.results.length, 45);
assert.equal(dom.failures.length, 0);
assert.ok(qa.homepagePatternsToReuse.some((item) => item.includes('header/footer')));
assert.ok(qa.homepagePatternsToReuse.some((item) => item.includes('mobile/tablet')));
assert.ok(qa.visualFindings.some((finding) => finding.id === 'FSVQA-01' && finding.severity === 'high'));
assert.ok(qa.visualFindings.some((finding) => finding.routes.includes('/articles/')));
for (const sheet of manifest.contactSheets) {
  assert.ok(existsSync(sheet.file), `${sheet.file} missing`);
  assert.ok(statSync(sheet.file).size > 50_000, `${sheet.file} unexpectedly small`);
}
console.log(`KIBER-91 full-site visual QA smoke passed: ${manifest.screenshots.length} screenshots, ${manifest.contactSheets.length} contact sheets, ${qa.visualFindings.length} findings, production remains gated.`);
