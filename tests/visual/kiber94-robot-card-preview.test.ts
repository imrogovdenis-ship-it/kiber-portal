import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const root = process.cwd();
const routePath = resolve(root, 'src/pages/preview/kiber-94/robot-card/[slug].astro');
const mapperPath = resolve(root, 'src/lib/kiber94-robot-template-data.ts');
const componentPath = resolve(root, 'src/components/templates/RobotCardTemplate.astro');
const smokePath = resolve(root, 'scripts/kiber94-robot-card-preview-smoke.mjs');
const packagePath = resolve(root, 'package.json');
const reportPath = resolve(root, 'docs/review/kiber-94-robot-card-preview/report.json');

function readJson(path: string) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

test('KIBER-94 exposes robot_card through preview-only real-data route', () => {
  for (const path of [routePath, mapperPath, componentPath, smokePath]) {
    assert.equal(existsSync(path), true, `${path.replace(root + '/', '')} must exist`);
  }

  const routeSource = readFileSync(routePath, 'utf8');
  assert.match(routeSource, /getRobotPages\(\)/);
  assert.match(routeSource, /toRobotCardTemplateData\(/);
  assert.match(routeSource, /RobotCardTemplate/);
  assert.match(routeSource, /noindex/);
  assert.match(routeSource, /process\.env\.DEPLOY_ENV !== 'production'/);
  assert.doesNotMatch(routeSource, /sitemap|launch-routes/);
});

test('KIBER-94 maps existing robot source-of-truth into template data without inventing prices or claims', () => {
  const mapperSource = readFileSync(mapperPath, 'utf8');
  assert.match(mapperSource, /RobotPageRecord/);
  assert.match(mapperSource, /RobotCardTemplateData/);
  assert.match(mapperSource, /const priceStatus = robot\.pricing\.mode === 'calculated' \? 'request' : 'needs_review'/);
  assert.match(mapperSource, /sourceStatus: 'page_content'/);
  assert.match(mapperSource, /reviewOnly:[\s\S]*publicRender: false/);
  assert.match(mapperSource, /priceSourceReconciliation/);
  assert.match(mapperSource, /claimSourceStatus/);
});

test('KIBER-94 preview smoke is wired but keeps production and public routes untouched', () => {
  const smoke = readFileSync(smokePath, 'utf8');
  assert.match(smoke, /dist\/preview\/kiber-94\/robot-card/);
  assert.match(smoke, /data-page-type="robot_card"/);
  assert.match(smoke, /noindex, nofollow/);
  assert.match(smoke, /source URL leaked/);
  assert.match(smoke, /massPageGeneration: false/);

  const pkg = readJson(packagePath);
  assert.equal(pkg.scripts['test:kiber94-robot-card-preview'], 'node scripts/kiber94-robot-card-preview-smoke.mjs');
  assert.doesNotMatch(pkg.scripts.ci, /test:kiber94-robot-card-preview/, 'preview-rendered smoke should not run in production CI before build:preview');
});

test('KIBER-94 records owner approval only for robot_card structure and data mapping', () => {
  const report = readJson(reportPath);
  assert.equal(report.ownerApproval.scope, 'structure_and_data_mapping_only');
  assert.equal(report.ownerApproval.status, 'approved');
  assert.equal(report.ownerApproval.quote, 'Вроде бы все верно.');
  assert.equal(report.ownerApproval.designApproval, false);
  assert.equal(report.ownerApproval.publicRouteReplacementApproval, false);
  assert.equal(report.ownerApproval.productionApproval, false);
});

test('KIBER-94 robot_card preview has an owner-review visual layout layer', () => {
  const componentSource = readFileSync(componentPath, 'utf8');
  assert.match(componentSource, /template-hero__copy/);
  assert.match(componentSource, /template-hero__media/);
  assert.match(componentSource, /template-facts-grid/);
  assert.match(componentSource, /template-checklist/);
  assert.match(componentSource, /template-section--pricing/);
  assert.match(componentSource, /template-gosha__inner/);
  assert.match(componentSource, /var\(--kp-reference-sky\)/);
  assert.match(componentSource, /var\(--kp-reference-blue\)/);
  assert.match(componentSource, /border-radius: 1\.5rem/);
});
