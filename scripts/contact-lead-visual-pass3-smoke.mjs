import assert from 'node:assert/strict';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const root = process.cwd();
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const json = (path) => JSON.parse(read(path));
const registry = json('data/review/contact-lead-visual-pass3.json');
const manifest = json('docs/review/contact-lead-visual-pass3/screenshots/manifest.json');
const lead = json('data/lead/capability-contract.json');
const reportPath = 'docs/review/contact-lead-visual-pass3/report.json';
const failures = [];

assert.equal(registry.issue, 'KIBER-contact-lead-visual-pass3');
assert.equal(registry.status, 'ready_for_owner_visual_review');
assert.equal(registry.safety.productionDeployChanged, false);
assert.equal(registry.safety.dnsChanged, false);
assert.equal(registry.safety.secretsChanged, false);
assert.equal(registry.safety.analyticsProviderChanged, false);
assert.equal(registry.safety.liveLeadRoutingChanged, false);
assert.equal(lead.routing.enabled, false, 'lead routing must remain disabled');
assert.equal(lead.routing.destinations.length, 0, 'lead destinations must remain empty');

if (registry.routes.length !== 4) failures.push(`expected 4 pass-3 routes, got ${registry.routes.length}`);
if (registry.viewports.length !== 3) failures.push(`expected 3 pass-3 viewports, got ${registry.viewports.length}`);
if (manifest.screenshots.length !== registry.routes.length * registry.viewports.length) failures.push('screenshot matrix does not match route x viewport count');
if (manifest.contactSheets.length < 3) failures.push('expected at least 3 contact sheets');

for (const route of registry.routes) {
  const path = route.path === '/' ? 'dist/index.html' : `dist${route.path}index.html`;
  if (!existsSync(resolve(root, path))) { failures.push(`${route.path}: rendered HTML missing`); continue; }
  const html = read(path);
  if (!html.includes('site-footer')) failures.push(`${route.path}: footer missing`);
  if (route.path === '/lead/thanks/' && !html.includes('Live lead routing remains disabled')) failures.push('/lead/thanks/: disabled routing notice missing');
  if (route.path.startsWith('/roboty-') && !html.includes('robot-card')) failures.push(`${route.path}: robot cards missing`);
  if (html.match(/sk-[a-zA-Z0-9]{20,}|xox[baprs]-|Bearer\s+[A-Za-z0-9._-]+/)) failures.push(`${route.path}: secret-like value rendered`);
}

for (const shot of manifest.screenshots) {
  const file = resolve(root, shot.file);
  if (!existsSync(file)) { failures.push(`${shot.file}: screenshot missing`); continue; }
  const stat = statSync(file);
  if (stat.size < 20_000) failures.push(`${shot.file}: screenshot too small (${stat.size} bytes)`);
  if (!/^[a-f0-9]{64}$/.test(shot.sha256 || '')) failures.push(`${shot.file}: invalid sha256`);
}
for (const sheet of manifest.contactSheets) {
  const file = resolve(root, sheet.file);
  if (!existsSync(file)) { failures.push(`${sheet.file}: contact sheet missing`); continue; }
  if (statSync(file).size < 20_000) failures.push(`${sheet.file}: contact sheet too small`);
}

const report = {
  issue: registry.issue,
  status: failures.length ? 'failed' : 'passed',
  routesChecked: registry.routes.length,
  viewportsChecked: registry.viewports.length,
  screenshotsChecked: manifest.screenshots.length,
  contactSheetsChecked: manifest.contactSheets.length,
  safety: registry.safety,
  failures,
  generatedAt: new Date().toISOString(),
};
mkdirSync(dirname(resolve(root, reportPath)), { recursive: true });
writeFileSync(resolve(root, reportPath), `${JSON.stringify(report, null, 2)}\n`);

if (failures.length) {
  console.error(`KIBER contact/lead visual pass 3 smoke failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log(`KIBER contact/lead visual pass 3 smoke passed: ${manifest.screenshots.length} screenshots, ${manifest.contactSheets.length} contact sheets, live routing disabled.`);
