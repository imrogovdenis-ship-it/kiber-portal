import { existsSync, readFileSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const json = (path) => JSON.parse(read(path));
const fail = (message) => {
  console.error(`Kinescope video contract smoke failed: ${message}`);
  process.exit(1);
};

const contractPath = 'data/media/kinescope-video-contract.json';
const registryPath = 'data/media/kinescope-video-library.json';
const componentPath = 'src/components/blocks/KinescopeVideo.astro';
const docPath = 'docs/review/video/kinescope-video-workflow.md';

for (const path of [contractPath, registryPath, componentPath, docPath]) {
  if (!existsSync(path)) fail(`${path} is missing`);
}

const contract = json(contractPath);
const registry = json(registryPath);
const component = read(componentPath);
const docs = read(docPath);

if (contract.provider !== 'kinescope') fail('provider must be kinescope');
if (contract.ownerDecision?.accessMode !== 'api_token_via_1password_or_op_reference') fail('access mode must require 1Password/op API token');
if (contract.ownerDecision?.allowDirectAgentUploads !== true) fail('direct agent uploads must be explicitly recorded');
if (contract.security?.secretsInChatAllowed !== false || contract.security?.secretsInGitAllowed !== false) fail('secret boundaries must forbid chat/Git');
if (!contract.security?.requiredSecretEnv?.includes('KINESCOPE_API_TOKEN')) fail('KINESCOPE_API_TOKEN env contract is required');
if (contract.rendering?.component !== componentPath) fail('component path mismatch');
if (contract.rendering?.lazyIframe !== true) fail('lazy iframe rendering is required');
if (contract.seo?.requiresVideoObjectJsonLd !== true) fail('VideoObject SEO contract is required');
if (contract.publicationGates?.requiresSeparateProductionApproval !== true) fail('production approval gate must remain separate');
if (contract.publicationGates?.leadRoutingChangedByThisContract !== false) fail('lead routing must not change');

if (registry.provider !== 'kinescope') fail('registry provider must be kinescope');
if (registry.contract !== contractPath) fail('registry must point back to contract');
if (!Array.isArray(registry.videos) || registry.videos.length !== 0) fail('registry must start empty until concrete owner videos are uploaded');
if (!Array.isArray(registry.folderPlan) || registry.folderPlan.length < 4) fail('folder plan is required');

if (!/loading="lazy"/.test(component)) fail('KinescopeVideo.astro must lazy-load iframe');
if (!/allowfullscreen/.test(component)) fail('KinescopeVideo.astro must allow fullscreen');
if (!/aspect-ratio/.test(component)) fail('KinescopeVideo.astro must reserve aspect ratio');
if (/KINESCOPE_API_TOKEN|ACCESS_TOKEN|Authorization/i.test(component)) fail('component must not contain secrets or auth headers');

for (const marker of ['1Password', 'API token', 'play_link', 'embed_link', 'VideoObject', 'Linear']) {
  if (!docs.includes(marker)) fail(`documentation missing ${marker}`);
}

console.log('Kinescope video contract smoke passed: API/1Password workflow, source registry, lazy embed component, SEO and approval gates recorded.');
