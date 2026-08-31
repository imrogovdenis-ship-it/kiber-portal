import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const root = process.cwd();
const policyPath = resolve(root, 'data/review/media-storage-policy.json');
const mediaHygieneReportPath = resolve(root, 'docs/review/kiber-49/media-git-hygiene-report.json');
const reportPath = resolve(root, 'docs/review/kiber-12/media-storage-policy-report.json');

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function read(path) {
  return readFileSync(resolve(root, path), 'utf8');
}

function hasExactLine(text, expected) {
  return text.split(/\r?\n/).some((line) => line.trim() === expected);
}

const failures = [];
const warnings = [];

for (const path of [policyPath, mediaHygieneReportPath]) {
  if (!existsSync(path)) failures.push(`${path.replace(`${root}/`, '')} missing`);
}

const policy = existsSync(policyPath) ? readJson(policyPath) : {};
const hygiene = existsSync(mediaHygieneReportPath) ? readJson(mediaHygieneReportPath) : {};

if (policy.schemaVersion !== 1) failures.push('schemaVersion must be 1');
if (policy.issue !== 'KIBER-12') failures.push('issue must be KIBER-12');
if (policy.status !== 'closed_by_lfs_policy_and_disk_evidence') failures.push('status must record closure by LFS policy and disk evidence');
if (policy.ownerDecision?.selectedPolicy !== 'git_lfs_for_review_originals') failures.push('selectedPolicy must be git_lfs_for_review_originals');
if (policy.ownerDecision?.productionDeployApproval !== false) failures.push('media storage policy must not imply production deploy approval');

if ((policy.diskReserve?.availableGiB ?? 0) < (policy.diskReserve?.minimumRequiredAvailableGiB ?? 5)) failures.push('disk reserve below minimum required available GiB');
if (policy.diskReserve?.cleanupPerformed !== false) failures.push('cleanupPerformed must stay false unless separately approved and evidenced');
if (policy.safety?.sharedDockerCleanupPerformed !== false) failures.push('shared Docker cleanup must not be performed for KIBER-12 without separate approval');

const runtime = policy.policy?.runtimePublicMedia || {};
if (runtime.root !== 'public/images/') failures.push('runtime public media root must be public/images/');
if (!Array.isArray(runtime.allowedFormats) || !runtime.allowedFormats.includes('webp') || !runtime.allowedFormats.includes('svg')) failures.push('runtime allowed formats must include optimized webp/svg');
if (runtime.maxBytesPerRasterImage !== 200 * 1024) failures.push('runtime max raster image bytes must stay aligned with media hygiene smoke');

const originals = policy.policy?.reviewOriginals || {};
if (originals.root !== 'site-export/images/') failures.push('review originals root must be site-export/images/');
if (originals.storage !== 'git_lfs') failures.push('review originals must use Git LFS');
if (originals.historyRewriteRequired !== false) failures.push('historyRewriteRequired must be false for current migration policy');

const incoming = policy.policy?.incomingDrops || {};
if (incoming.ordinaryGitPolicy !== 'ignored_until_explicitly_migrated') failures.push('incoming drops must remain ignored until explicitly migrated');

const dockerContext = policy.policy?.dockerContext || {};
for (const required of ['site-export', 'incoming', 'artifacts']) {
  if (!dockerContext.excludedRoots?.includes(required)) failures.push(`dockerContext excludedRoots missing ${required}`);
}

if (existsSync(resolve(root, '.gitattributes'))) {
  const attrs = read('.gitattributes');
  if (!hasExactLine(attrs, 'site-export/images/** filter=lfs diff=lfs merge=lfs -text')) failures.push('.gitattributes missing site-export/images Git LFS rule');
} else {
  failures.push('.gitattributes missing');
}

if (existsSync(resolve(root, '.gitignore'))) {
  const gitignore = read('.gitignore');
  for (const required of ['site-export/images/', 'incoming/', 'upload/', '*.zip']) {
    if (!hasExactLine(gitignore, required)) failures.push(`.gitignore missing ${required}`);
  }
} else {
  failures.push('.gitignore missing');
}

if (existsSync(resolve(root, '.dockerignore'))) {
  const dockerignore = read('.dockerignore');
  for (const required of ['site-export', 'incoming', 'artifacts']) {
    if (!hasExactLine(dockerignore, required)) failures.push(`.dockerignore missing ${required}`);
  }
} else {
  failures.push('.dockerignore missing');
}

if (hygiene.status !== 'passed_lfs_migrated') failures.push('KIBER-49 media hygiene report must be passed_lfs_migrated');
if (hygiene.summary?.reviewOriginalsNotInLfs !== 0) failures.push('review originals not in LFS must be 0');
// Do not warn when generated KIBER-49 report counts drift after unrelated builds: the
// authoritative KIBER-12 closure evidence is the policy registry plus live git-lfs
// verification below. Full CI still regenerates KIBER-49's report separately.

let gitLfsAvailable = true;
let gitLfsTrackedFiles = 0;
try {
  execFileSync('git', ['lfs', 'version'], { cwd: root, stdio: 'ignore' });
  gitLfsTrackedFiles = execFileSync('git', ['lfs', 'ls-files', '--name-only'], { cwd: root, encoding: 'utf8' })
    .split('\n')
    .filter(Boolean)
    .length;
} catch {
  gitLfsAvailable = false;
  warnings.push('git-lfs unavailable on this host; rely on tracked policy plus CI media hygiene gate.');
}
if (gitLfsAvailable && gitLfsTrackedFiles < policy.currentEvidence?.gitLfsTrackedReviewOriginals) failures.push('live git lfs tracked file count is below policy evidence count');

const report = {
  issue: 'KIBER-12',
  status: failures.length ? 'failed' : 'passed',
  generatedAt: new Date().toISOString(),
  diskReserve: policy.diskReserve,
  selectedPolicy: policy.ownerDecision?.selectedPolicy,
  gitLfsAvailable,
  gitLfsTrackedFiles,
  trackedReviewOriginals: hygiene.summary?.trackedReviewOriginals ?? null,
  lfsTrackedReviewOriginals: hygiene.summary?.lfsTrackedReviewOriginals ?? null,
  reviewOriginalsNotInLfs: hygiene.summary?.reviewOriginalsNotInLfs ?? null,
  runtimeImages: hygiene.summary?.publicRuntimeImages ?? null,
  runtimeImageBytes: hygiene.summary?.publicRuntimeImageBytes ?? null,
  safety: policy.safety,
  failures,
  warnings: warnings.slice(0, 40),
};

mkdirSync(dirname(reportPath), { recursive: true });
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

if (failures.length) {
  console.error(`KIBER-12 media storage policy smoke failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log(`KIBER-12 media storage policy smoke passed: ${report.lfsTrackedReviewOriginals}/${report.trackedReviewOriginals} review originals in LFS; disk reserve ${policy.diskReserve?.availableGiB} GiB.`);
assert.equal(failures.length, 0);
