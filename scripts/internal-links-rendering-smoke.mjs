import assert from 'node:assert/strict';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const root = process.cwd();
const distRoot = resolve(root, 'dist');
const registryPath = resolve(root, 'data/seo/internal-links.json');
const proposalPath = resolve(root, 'data/seo/internal-link-proposals.json');
const routesPath = resolve(root, 'data/seo/launch-routes.json');
const reportPath = resolve(root, 'docs/review/kiber-52/internal-links-rendering-report.json');

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function normalizeRoute(path) {
  const pathname = path.split('?')[0].split('#')[0] || '/';
  if (pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

function routeToHtml(route) {
  const normalized = normalizeRoute(route);
  return normalized === '/'
    ? resolve(distRoot, 'index.html')
    : resolve(distRoot, normalized.replace(/^\//, ''), 'index.html');
}

function walkHtml(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walkHtml(full, files);
    else if (entry.isFile() && full.endsWith('.html')) files.push(full);
  }
  return files;
}

function getRenderedLinkIds(html) {
  return [...html.matchAll(/data-internal-link-id="([^"]+)"/g)].map((match) => match[1]);
}

assert.equal(existsSync(registryPath), true, 'data/seo/internal-links.json missing');
assert.equal(existsSync(proposalPath), true, 'data/seo/internal-link-proposals.json missing');
assert.equal(existsSync(routesPath), true, 'data/seo/launch-routes.json missing');
assert.equal(existsSync(distRoot), true, 'dist/ missing; run npm run build:production first');

const registry = readJson(registryPath);
const proposals = readJson(proposalPath);
const launchRoutes = readJson(routesPath);

assert.equal(registry.schemaVersion, 1, 'schemaVersion must be 1');
assert.equal(registry.issue, 'KIBER-52', 'issue must be KIBER-52');
assert.equal(registry.autoPublishGenerated, false, 'generated links must not auto-publish');
assert.equal(registry.policy.renderOnlyStatus, 'approved', 'only approved links render');
assert.ok(registry.policy.maxLinksPerPage > 0 && registry.policy.maxLinksPerPage <= 3, 'maxLinksPerPage must be 1..3');
assert.equal(proposals.autoPublish, false, 'KIBER-79 proposals must remain review-only');
assert.ok(proposals.proposals.every((proposal) => proposal.status === 'generated_needs_review' && proposal.publicRender === false), 'generated proposals must remain non-public');

const routeByPath = new Map(launchRoutes.routes.map((route) => [route.path, route]));
const htmlFiles = walkHtml(distRoot).map((file) => ({ file, content: readFileSync(file, 'utf8') }));
const approvedIds = new Set(registry.links.filter((link) => link.status === 'approved' && link.publicRender === true).map((link) => link.id));
const approvedBySource = new Map();
const violations = [];

for (const link of registry.links) {
  const sourceRoute = normalizeRoute(link.sourceRoute);
  const targetRoute = normalizeRoute(link.targetRoute);
  const target = routeByPath.get(targetRoute);
  const isConversionTarget = registry.policy.conversionTargets.includes(targetRoute);

  assert.ok(routeByPath.has(sourceRoute), `${link.id}: sourceRoute must exist in launch route registry`);
  assert.ok(target?.status === 'launch' || isConversionTarget, `${link.id}: targetRoute must be a launch route or approved conversion target`);
  assert.notEqual(sourceRoute, targetRoute, `${link.id}: source and target must differ`);

  if (link.status === 'approved') {
    assert.equal(link.publicRender, true, `${link.id}: approved links should render`);
    if (!approvedBySource.has(sourceRoute)) approvedBySource.set(sourceRoute, []);
    approvedBySource.get(sourceRoute).push(link);
  } else {
    assert.equal(link.publicRender, false, `${link.id}: non-approved links must not render`);
  }
}

for (const [sourceRoute, links] of approvedBySource) {
  assert.ok(links.length <= registry.policy.maxLinksPerPage, `${sourceRoute}: too many curated links`);
  const htmlPath = routeToHtml(sourceRoute);
  assert.equal(existsSync(htmlPath), true, `${sourceRoute}: rendered source HTML missing`);
  const html = readFileSync(htmlPath, 'utf8');
  const renderedIds = getRenderedLinkIds(html);
  for (const link of links) {
    assert.ok(renderedIds.includes(link.id), `${link.id}: approved internal link did not render on ${sourceRoute}`);
    assert.ok(html.includes(`href="${link.href}"`), `${link.id}: approved href did not render`);
  }
  for (const id of renderedIds) {
    assert.ok(approvedIds.has(id), `${sourceRoute}: rendered unknown/non-approved internal-link id ${id}`);
  }
}

for (const proposal of proposals.proposals) {
  for (const { file, content } of htmlFiles) {
    if (content.includes(proposal.id) || content.includes(`data-internal-link-proposal="${proposal.id}"`) || content.includes(`data-link-proposal-id="${proposal.id}"`)) {
      violations.push(`${proposal.id} leaked in ${relative(root, file)}`);
    }
  }
}

assert.deepEqual(violations, [], 'generated KIBER-79 proposal markers leaked into public HTML');

mkdirSync(dirname(reportPath), { recursive: true });
writeFileSync(reportPath, `${JSON.stringify({
  issue: 'KIBER-52',
  generatedAt: new Date().toISOString(),
  approvedLinks: approvedIds.size,
  linkedSourceRoutes: approvedBySource.size,
  maxLinksPerPage: registry.policy.maxLinksPerPage,
  htmlFilesChecked: htmlFiles.length,
  autoPublishGenerated: registry.autoPublishGenerated,
  proposalMarkersLeaked: 0,
  result: 'passed',
}, null, 2)}\n`);

console.log(`KIBER-52 internal-link rendering smoke passed: ${approvedIds.size} curated links across ${approvedBySource.size} source routes; generated proposals stayed review-only.`);
