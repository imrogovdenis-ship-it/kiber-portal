import assert from 'node:assert/strict';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const root = process.cwd();
const distRoot = resolve(root, 'dist');
const proposalsPath = resolve(root, 'data/seo/internal-link-proposals.json');
const routesPath = resolve(root, 'data/seo/launch-routes.json');
const semanticCorePath = resolve(root, 'data/seo/semantic-core.json');
const reportPath = resolve(root, 'docs/review/kiber-79/internal-link-proposals-report.json');

const allowedStatuses = ['generated_needs_review', 'approved', 'rejected', 'disabled'];
const allowedSources = ['semantic-core', 'launch-route-registry', 'cta-proof-path'];
const blockedTargetStatuses = new Set(['available-not-sitemap']);
const forbiddenRoutes = [/^\/preview\//, /^\/404\.html$/, /^\/lead\/thanks\/$/];

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function walkHtml(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walkHtml(full, files);
    else if (entry.isFile() && full.endsWith('.html')) files.push(full);
  }
  return files;
}

assert.equal(existsSync(proposalsPath), true, 'data/seo/internal-link-proposals.json is required');
assert.equal(existsSync(routesPath), true, 'data/seo/launch-routes.json is required');
assert.equal(existsSync(semanticCorePath), true, 'data/seo/semantic-core.json is required');
assert.equal(existsSync(distRoot), true, 'dist/ missing; run npm run build:production before npm run test:internal-links');

const registry = readJson(proposalsPath);
const launchRoutes = readJson(routesPath);
const semanticCore = readJson(semanticCorePath);

assert.equal(registry.schemaVersion, 1, 'schemaVersion must be 1');
assert.equal(registry.issue, 'KIBER-79', 'issue must be KIBER-79');
assert.equal(registry.autoPublish, false, 'internal-link proposals must never auto-publish');
assert.deepEqual(registry.allowedStatuses, allowedStatuses, 'allowedStatuses must be canonical');
assert.ok(Array.isArray(registry.inputSources), 'inputSources required');
assert.ok(registry.inputSources.includes('data/seo/launch-routes.json'));
assert.ok(registry.inputSources.includes('data/seo/semantic-core.json'));
assert.ok(Array.isArray(registry.proposals) && registry.proposals.length >= 6, 'proposal list too small');
assert.ok(Array.isArray(semanticCore.entries) && semanticCore.entries.length > 0, 'semantic-core registry must have entries');

const routeByPath = new Map(launchRoutes.routes.map((route) => [route.path, route]));
const launchRoutePaths = new Set([...routeByPath.keys()]);
const html = walkHtml(distRoot).map((file) => ({ file, content: readFileSync(file, 'utf8') }));
const ids = new Set();
const statusCounts = Object.fromEntries(allowedStatuses.map((status) => [status, 0]));
const violations = [];

for (const proposal of registry.proposals) {
  assert.match(proposal.id, /^[a-z0-9-]+-to-[a-z0-9-]+$/, `${proposal.id}: invalid id`);
  assert.equal(ids.has(proposal.id), false, `${proposal.id}: duplicate proposal id`);
  ids.add(proposal.id);
  assert.ok(allowedSources.includes(proposal.source), `${proposal.id}: invalid source`);
  assert.ok(allowedStatuses.includes(proposal.status), `${proposal.id}: invalid status`);
  assert.equal(typeof proposal.anchor, 'string', `${proposal.id}: anchor required`);
  assert.ok(proposal.anchor.trim().length > 0, `${proposal.id}: empty anchor`);
  assert.equal(typeof proposal.reason, 'string', `${proposal.id}: reason required`);
  assert.ok(proposal.reason.trim().length > 0, `${proposal.id}: empty reason`);
  assert.ok(launchRoutePaths.has(proposal.sourceRoute), `${proposal.id}: sourceRoute not in launch registry`);
  assert.ok(launchRoutePaths.has(proposal.targetRoute), `${proposal.id}: targetRoute not in launch registry`);
  assert.notEqual(proposal.sourceRoute, proposal.targetRoute, `${proposal.id}: source and target must differ`);
  assert.equal(forbiddenRoutes.some((pattern) => pattern.test(proposal.targetRoute)), false, `${proposal.id}: forbidden target route`);

  const target = routeByPath.get(proposal.targetRoute);
  if (proposal.status !== 'approved') {
    assert.equal(proposal.publicRender, false, `${proposal.id}: unapproved proposals must not render publicly`);
  }
  if (target && blockedTargetStatuses.has(target.status)) {
    assert.equal(proposal.status, 'generated_needs_review', `${proposal.id}: non-sitemap target must remain review-only`);
    assert.equal(proposal.publicRender, false, `${proposal.id}: non-sitemap target must not be public`);
  }
  statusCounts[proposal.status] += 1;

  if (proposal.status === 'generated_needs_review') {
    const forbiddenProposalMarkers = [
      proposal.id,
      `data-internal-link-proposal=\"${proposal.id}\"`,
      `data-link-proposal-id=\"${proposal.id}\"`,
    ];
    const leaked = html.filter(({ content }) => forbiddenProposalMarkers.some((marker) => content.includes(marker)));
    if (leaked.length > 0) {
      violations.push(`${proposal.id}: generated_needs_review proposal marker rendered in ${leaked.map(({ file }) => relative(root, file)).join(', ')}`);
    }
  }
}

assert.ok(statusCounts.generated_needs_review > 0, 'must include generated_needs_review proposals');
assert.deepEqual(violations, [], 'generated_needs_review internal links leaked into production HTML');

mkdirSync(dirname(reportPath), { recursive: true });
writeFileSync(reportPath, `${JSON.stringify({
  issue: 'KIBER-79',
  generatedAt: new Date().toISOString(),
  proposalCount: registry.proposals.length,
  statusCounts,
  htmlFilesChecked: html.length,
  autoPublish: registry.autoPublish,
  result: 'passed',
}, null, 2)}\n`);

console.log(`KIBER-79 internal-link proposal smoke passed: ${registry.proposals.length} proposals checked; generated links stayed review-only across ${html.length} HTML files.`);
