import assert from 'node:assert/strict';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const root = process.cwd();
const distRoot = resolve(root, 'dist');
const registryPath = resolve(root, 'data/review/content-acceptance.json');
const reportPath = resolve(root, 'docs/review/kiber-55/content-acceptance-report.json');
const robotsPath = resolve(root, 'src/content/robots.generated.json');

function readJson(path) { return JSON.parse(readFileSync(path, 'utf8')); }
function routeToHtml(route) { return route === '/' ? resolve(distRoot, 'index.html') : resolve(distRoot, route.replace(/^\//, ''), 'index.html'); }
function textOnly(html) { return html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }
function matches(text, pattern) { return [...text.matchAll(new RegExp(pattern, 'gi'))].map((m) => m[0]); }

assert.equal(existsSync(distRoot), true, 'dist/ missing; run npm run build:production before content acceptance smoke');
assert.equal(existsSync(registryPath), true, 'content acceptance registry missing');

const registry = readJson(registryPath);
const robots = readJson(robotsPath).robots;
const failures = [];
const warnings = [];
const publicRoutes = [...registry.launchPages.map((p) => p.route), ...registry.robots.map((r) => r.route)];
const routeSet = new Set(publicRoutes);

if (registry.policy.finalApprovalRequiresHumanOwner !== true) failures.push('policy.finalApprovalRequiresHumanOwner must be true');
if (registry.summary.finalApproved !== 0) failures.push('structural task must not claim final human approvals');
if (!registry.allowedStatuses.includes('accepted_structurally')) failures.push('accepted_structurally status missing');
if (!registry.allowedStatuses.includes('blocked_by_business_approval')) failures.push('blocked_by_business_approval status missing');
if (registry.robots.length !== 24) failures.push(`expected 24 robot acceptance records, got ${registry.robots.length}`);
if (registry.launchPages.length < 7) failures.push(`expected public launch page acceptance records, got ${registry.launchPages.length}`);

for (const item of [...registry.robots, ...registry.launchPages]) {
  const label = item.slug || item.route || item.id;
  if (item.finalApprovalStatus === 'approved') failures.push(`${label}: finalApprovalStatus approved without human evidence`);
  if (!Array.isArray(item.reviewFlags) || item.reviewFlags.length === 0) failures.push(`${label}: reviewFlags required`);
  if (!routeSet.has(item.route)) failures.push(`${label}: duplicate or missing route mapping`);
}

for (const route of publicRoutes) {
  const file = routeToHtml(route);
  if (!existsSync(file)) { failures.push(`${route}: missing rendered HTML`); continue; }
  const html = readFileSync(file, 'utf8');
  const text = textOnly(html);
  const placeholderHits = matches(text, registry.policy.placeholderPattern);
  const internalHits = matches(text, registry.policy.internalPhrasePattern);
  if (placeholderHits.length) failures.push(`${route}: placeholder/internal draft wording in visible text: ${[...new Set(placeholderHits)].join(', ')}`);
  if (internalHits.length) failures.push(`${route}: internal project wording in visible text: ${[...new Set(internalHits)].join(', ')}`);
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => m[1].replace(/<[^>]+>/g, '').trim());
  if (h1s.length !== 1) failures.push(`${route}: expected one H1, got ${h1s.length}`);
  if (!html.includes('name="description"')) failures.push(`${route}: missing meta description`);
  if (!html.includes('rel="canonical"')) failures.push(`${route}: missing canonical`);
  if (!html.includes('application/ld+json')) failures.push(`${route}: missing JSON-LD`);
}

for (const robot of robots) {
  if (robot.status !== 'review') warnings.push(`${robot.slug}: generated content remains review status for KIBER-55 human pass`);
  if (!robot.pricing?.disclaimer?.includes('Не является публичной офертой')) failures.push(`${robot.slug}: pricing disclaimer missing`);
  if (!robot.media?.hero?.alt) failures.push(`${robot.slug}: hero alt missing`);
}

const report = {
  issue: 'KIBER-55',
  generatedAt: new Date().toISOString(),
  routesChecked: publicRoutes.length,
  robotsChecked: registry.robots.length,
  launchPagesChecked: registry.launchPages.length,
  structuralAccepted: registry.robots.filter((r) => r.structuralStatus === 'accepted_structurally').length + registry.launchPages.filter((p) => p.structuralStatus === 'accepted_structurally').length,
  finalApproved: registry.summary.finalApproved,
  humanReviewRequired: registry.summary.humanReviewRequired,
  status: failures.length ? 'failed' : 'passed',
  failures,
  warnings: warnings.slice(0, 60),
};
mkdirSync(dirname(reportPath), { recursive: true });
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

if (failures.length) {
  console.error(`KIBER-55 content acceptance smoke failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log(`KIBER-55 content acceptance smoke passed: ${publicRoutes.length} public routes checked; ${registry.summary.humanReviewRequired} items remain human-review gated.`);
