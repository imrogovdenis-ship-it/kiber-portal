import assert from 'node:assert/strict';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const registryPath = resolve(root, 'data/review/reference-visual-layer-pass1.json');
const distRoot = resolve(root, 'dist');
const reportPath = resolve(root, 'docs/review/kiber-88/reference-visual-layer-report.json');

function read(path) {
  return readFileSync(path, 'utf8');
}

function assertIncludes(haystack, needle, label) {
  assert.ok(haystack.includes(needle), `${label} missing ${needle}`);
}

function builtCssBundle() {
  const astroDir = resolve(distRoot, '_astro');
  assert.equal(existsSync(astroDir), true, 'dist/_astro missing');
  return readdirSync(astroDir)
    .filter((name) => name.endsWith('.css'))
    .map((name) => read(resolve(astroDir, name)))
    .join('\n');
}

assert.equal(existsSync(registryPath), true, 'KIBER-88 registry missing');
const registry = JSON.parse(read(registryPath));
assert.equal(registry.issue, 'KIBER-88');
assert.equal(registry.strategy.rawHtmlCopiedIntoRuntime, false);
assert.equal(registry.strategy.referenceHtmlUsedAsVisualSource, true);
assert.equal(registry.strategy.priorSeoContentRuntimeFoundationPreserved, true);
assert.equal(registry.safety.productionDeployChanged, false);

const css = read(resolve(root, 'src/styles/reference-layer.css'));
for (const token of [
  '--kp-reference-blue: var(--kp-blue)',
  '--kp-reference-blue-deep: var(--kp-blue-deep)',
  '--kp-reference-sky: var(--kp-sky)',
  '--kp-reference-ink-dark: var(--kp-ink)',
  '--kp-reference-container: 72.5rem',
  '--kp-reference-small-gap-xl: 2.25rem',
  '--kp-reference-small-gap-lg: 1.5rem',
  '--kp-reference-small-gap-md: 1rem',
  '--kp-reference-small-gap-sm: 0.625rem',
]) {
  assertIncludes(css, token, 'reference-layer');
}

assertIncludes(read(resolve(root, 'src/layouts/BaseLayout.astro')), '../styles/reference-layer.css', 'BaseLayout');

const home = read(resolve(distRoot, 'index.html'));
assertIncludes(home, 'home-hero__card', 'home page');
assertIncludes(home, 'home-hero__image', 'home page');
assertIncludes(home, 'data-rv="02"', 'home page');
assertIncludes(home, '/images/kiber-45/arenda-unitree-g1.webp', 'home page');
assertIncludes(home, 'vertical-slice__card-grid', 'home page');
const cssBundle = builtCssBundle();
assertIncludes(cssBundle, '--kp-reference-blue:', 'built CSS');

const robot = read(resolve(distRoot, 'robots/arenda-unitree-g1/index.html'));
assertIncludes(robot, 'robot-page__hero', 'robot page');
assertIncludes(robot, 'data-rv="11"', 'robot page');
assertIncludes(robot, 'robot-page__price', 'robot page');
assertIncludes(robot, 'robot-page__media', 'robot page');
assertIncludes(robot, 'Не является публичной офертой', 'robot page prior pricing guard');

for (const route of ['contacts/index.html', 'lead/request/index.html']) {
  const html = read(resolve(distRoot, route));
  assertIncludes(html, '<meta name="robots"', route);
  assertIncludes(html, 'data-analytics-', route);
}

const report = {
  issue: registry.issue,
  status: 'passed',
  sources: registry.sources,
  pass1Blocks: registry.pass1Blocks,
  routesChecked: ['/', '/robots/arenda-unitree-g1/', '/contacts/', '/lead/request/'],
  safety: registry.safety,
  rawHtmlCopiedIntoRuntime: registry.strategy.rawHtmlCopiedIntoRuntime,
  generatedAt: new Date().toISOString(),
};
mkdirSync(resolve(root, 'docs/review/kiber-88'), { recursive: true });
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
