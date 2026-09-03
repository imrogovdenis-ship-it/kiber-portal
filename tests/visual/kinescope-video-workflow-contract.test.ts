import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path: string) => readFileSync(path, 'utf8');
const json = (path: string) => JSON.parse(read(path));

const contractPath = 'data/media/kinescope-video-contract.json';
const registryPath = 'data/media/kinescope-video-library.json';
const docPath = 'docs/review/video/kinescope-video-workflow.md';
const smokePath = 'scripts/kinescope-video-contract-smoke.mjs';
const componentPath = 'src/components/blocks/KinescopeVideo.astro';

test('Kinescope video workflow is fixed as a safe source-of-truth contract', () => {
  assert.equal(existsSync(contractPath), true, `${contractPath} must exist`);
  assert.equal(existsSync(registryPath), true, `${registryPath} must exist`);
  assert.equal(existsSync(docPath), true, `${docPath} must exist`);
  assert.equal(existsSync(smokePath), true, `${smokePath} must exist`);
  assert.equal(existsSync(componentPath), true, `${componentPath} must exist`);

  const contract = json(contractPath);
  assert.equal(contract.schemaVersion, 1);
  assert.equal(contract.provider, 'kinescope');
  assert.equal(contract.ownerDecision.accessMode, 'api_token_via_1password_or_op_reference');
  assert.equal(contract.ownerDecision.allowDirectAgentUploads, true);
  assert.equal(contract.security.secretsInChatAllowed, false);
  assert.equal(contract.security.secretsInGitAllowed, false);
  assert.match(contract.security.requiredSecretEnv.join(' '), /KINESCOPE_API_TOKEN/);
  assert.match(contract.workflow.uploadSteps.join(' '), /status.*done|done.*status/i);
  assert.match(contract.workflow.uploadSteps.join(' '), /embed_link/);
  assert.match(contract.workflow.uploadSteps.join(' '), /play_link/);
  assert.match(contract.workflow.uploadSteps.join(' '), /hls_link/);
  assert.equal(contract.rendering.component, 'src/components/blocks/KinescopeVideo.astro');
  assert.equal(contract.rendering.lazyIframe, true);
  assert.equal(contract.rendering.requiresPoster, true);
  assert.equal(contract.seo.requiresVideoObjectJsonLd, true);
  assert(contract.allowedPageTypes.includes('compilation'));
  assert(contract.allowedPageTypes.includes('article'));
  assert(contract.allowedPageTypes.includes('case'));
  assert(contract.allowedPageTypes.includes('robot_card'));
  assert.equal(contract.publicationGates.productionDeployChangedByThisContract, false);
  assert.equal(contract.publicationGates.analyticsChangedByThisContract, false);
  assert.equal(contract.publicationGates.leadRoutingChangedByThisContract, false);

  const registry = json(registryPath);
  assert.equal(registry.schemaVersion, 1);
  assert.equal(registry.provider, 'kinescope');
  assert.equal(registry.videos.length, 0, 'registry starts empty until owner uploads concrete videos');
  assert.equal(registry.pendingInbox.policy, 'owner_attaches_video_then_agent_uploads_to_kinescope_with_api_token');
  assert.equal(registry.folderPlan.length >= 4, true);

  const component = read(componentPath);
  assert.match(component, /interface Props/);
  assert.match(component, /embedLink/);
  assert.match(component, /loading="lazy"/);
  assert.match(component, /allowfullscreen/);
  assert.match(component, /aspect-ratio/);
  assert.doesNotMatch(component, /KINESCOPE_API_TOKEN|ACCESS_TOKEN|Authorization/i, 'render component must not contain secrets');

  const smoke = read(smokePath);
  assert.match(smoke, /kinescope-video-contract\.json/);
  assert.match(smoke, /kinescope-video-library\.json/);
  assert.match(smoke, /KinescopeVideo\.astro/);

  const docs = read(docPath);
  assert.match(docs, /1Password/);
  assert.match(docs, /API token/);
  assert.match(docs, /play_link/);
  assert.match(docs, /embed_link/);
  assert.match(docs, /VideoObject/);
  assert.match(docs, /Linear/);
});

test('package exposes Kinescope video contract smoke as a CI gate', () => {
  const pkg = json('package.json');
  assert.equal(pkg.scripts['test:kinescope-video-contract'], 'node scripts/kinescope-video-contract-smoke.mjs');
  assert.match(pkg.scripts.ci, /npm run test:kinescope-video-contract/);
});
