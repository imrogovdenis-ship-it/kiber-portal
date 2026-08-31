import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, extname, resolve } from 'node:path';

const root = process.cwd();
const reportPath = resolve(root, 'docs/review/kiber-49/media-git-hygiene-report.json');
const imageExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.avif']);
const runtimePublicImageMaxBytes = 200 * 1024;
const trackedOriginalThresholdBytes = 500 * 1024;
const runtimeSourceRoots = ['src', 'public', 'design-system'];
const allowedReviewOriginalRoots = ['site-export/images'];
const requiredDockerIgnore = ['site-export', 'incoming', 'artifacts'];
const requiredGitIgnore = ['site-export/images/', 'incoming/', 'upload/', '*.zip'];

function read(path) {
  return readFileSync(resolve(root, path), 'utf8');
}

function trackedFiles() {
  return execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' })
    .split('\n')
    .filter(Boolean);
}

function isImage(path) {
  return imageExtensions.has(extname(path).toLowerCase());
}

function bytes(path) {
  return statSync(resolve(root, path)).size;
}

function hasToken(text, token) {
  return text.split(/\r?\n/).some((line) => line.trim() === token);
}

const files = trackedFiles();
const failures = [];
const warnings = [];
const trackedMedia = files
  .filter(isImage)
  .map((path) => ({ path, bytes: bytes(path) }))
  .sort((a, b) => b.bytes - a.bytes);

const publicImages = trackedMedia.filter((item) => item.path.startsWith('public/images/'));
for (const item of publicImages) {
  if (item.bytes > runtimePublicImageMaxBytes) {
    failures.push(`${item.path}: public runtime image is ${(item.bytes / 1024).toFixed(1)} KiB, exceeds ${(runtimePublicImageMaxBytes / 1024).toFixed(0)} KiB`);
  }
  if (!['.webp', '.svg', '.avif'].includes(extname(item.path).toLowerCase())) {
    failures.push(`${item.path}: runtime image must be WebP/AVIF/SVG, not ${extname(item.path)}`);
  }
}

const runtimeSourceRefs = [];
for (const path of files) {
  if (!runtimeSourceRoots.some((rootPath) => path === rootPath || path.startsWith(`${rootPath}/`))) continue;
  if (!['.ts', '.tsx', '.astro', '.mjs', '.js', '.json', '.yaml', '.yml', '.css', '.md'].includes(extname(path).toLowerCase())) continue;
  const text = read(path);
  if (/site-export\/images|\.\.?\/site-export\/images/.test(text)) runtimeSourceRefs.push(path);
}
if (runtimeSourceRefs.length) {
  failures.push(`runtime source references review-only originals: ${runtimeSourceRefs.join(', ')}`);
}

const dockerignore = existsSync(resolve(root, '.dockerignore')) ? read('.dockerignore') : '';
for (const token of requiredDockerIgnore) {
  if (!hasToken(dockerignore, token)) failures.push(`.dockerignore must exclude ${token}`);
}
const gitignore = existsSync(resolve(root, '.gitignore')) ? read('.gitignore') : '';
for (const token of requiredGitIgnore) {
  if (!hasToken(gitignore, token)) failures.push(`.gitignore must include ${token} to prevent new ordinary-Git originals`);
}

const distOriginalRefs = [];
if (existsSync(resolve(root, 'dist'))) {
  const distHtml = execFileSync('python3', ['-c', `from pathlib import Path\nroot=Path('dist')\nfor p in root.rglob('*'):\n    if p.is_file() and p.suffix.lower() in {'.html','.xml','.txt','.js','.css'}:\n        t=p.read_text('utf-8', errors='ignore')\n        if 'site-export/images' in t:\n            print(p)`], { cwd: root, encoding: 'utf8' }).split('\n').filter(Boolean);
  distOriginalRefs.push(...distHtml);
}
if (distOriginalRefs.length) failures.push(`rendered dist references review-only originals: ${distOriginalRefs.join(', ')}`);

const trackedOriginals = trackedMedia.filter((item) => allowedReviewOriginalRoots.some((prefix) => item.path.startsWith(`${prefix}/`)));
const oversizedTrackedOriginals = trackedOriginals.filter((item) => item.bytes > trackedOriginalThresholdBytes);
if (trackedOriginals.length) {
  warnings.push(`${trackedOriginals.length} legacy original/provenance images remain tracked under site-export/images until object storage or Git LFS migration is approved.`);
}

let gitLfsAvailable = true;
try {
  execFileSync('git', ['lfs', 'version'], { cwd: root, stdio: 'ignore' });
} catch {
  gitLfsAvailable = false;
  warnings.push('git-lfs is not installed on this host; KIBER-49 storage migration remains a separate blocker and was not guessed.');
}

const publicTotalBytes = publicImages.reduce((sum, item) => sum + item.bytes, 0);
const trackedOriginalBytes = trackedOriginals.reduce((sum, item) => sum + item.bytes, 0);
const report = {
  issue: 'KIBER-49',
  status: failures.length ? 'failed' : 'passed_with_storage_migration_blocker',
  generatedAt: new Date().toISOString(),
  policy: {
    runtimePublicImageMaxBytes,
    runtimeFormatsAllowed: ['webp', 'avif', 'svg'],
    reviewOriginalsAllowedOnlyUnder: allowedReviewOriginalRoots,
    ordinaryGitOriginalPolicy: 'no new originals in ordinary Git; move legacy originals to approved object storage or Git LFS when storage is selected',
    productionDeployChanged: false,
    dnsChanged: false,
    secretsChanged: false,
    liveRoutingChanged: false,
  },
  gitLfsAvailable,
  summary: {
    trackedMediaFiles: trackedMedia.length,
    trackedMediaBytes: trackedMedia.reduce((sum, item) => sum + item.bytes, 0),
    publicRuntimeImages: publicImages.length,
    publicRuntimeImageBytes: publicTotalBytes,
    publicRuntimeLargestImageBytes: Math.max(0, ...publicImages.map((item) => item.bytes)),
    trackedReviewOriginals: trackedOriginals.length,
    trackedReviewOriginalBytes: trackedOriginalBytes,
    oversizedTrackedReviewOriginals: oversizedTrackedOriginals.length,
    renderedDistScanned: existsSync(resolve(root, 'dist')),
  },
  topTrackedMedia: trackedMedia.slice(0, 25),
  topReviewOriginals: trackedOriginals.slice(0, 25),
  failures,
  warnings,
  blockers: [
    'Choose approved storage for legacy original/provenance images: Git LFS or object storage.',
    'After storage is selected, migrate site-export/images out of ordinary Git without breaking review provenance links.',
  ],
};

mkdirSync(dirname(reportPath), { recursive: true });
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

if (failures.length) {
  console.error(`KIBER-49 media Git hygiene smoke failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log(`KIBER-49 media Git hygiene smoke passed: ${publicImages.length} runtime images / ${(publicTotalBytes / 1024).toFixed(1)} KiB; ${trackedOriginals.length} review originals remain storage-migration blocked.`);
assert.equal(failures.length, 0);
