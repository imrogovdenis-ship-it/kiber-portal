import assert from 'node:assert/strict';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const root = process.cwd();
const distRoot = resolve(root, 'dist');
const robotSource = resolve(root, 'src/content/robots/unitree-g1.yaml');
const reportPath = resolve(root, 'docs/review/kiber-50/review-notes-isolation-report.json');
const forbiddenPublicMarkers = [
  'KIBER-50-REVIEW-ONLY-SENTINEL',
  'internalNotes',
  'publicRender',
  'review-only fields',
];

function walk(dir, extension, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, extension, files);
    else if (entry.isFile() && full.endsWith(extension)) files.push(full);
  }
  return files;
}

assert.equal(existsSync(distRoot), true, 'dist/ missing; run npm run build:production before npm run test:review-notes');
assert.equal(existsSync(robotSource), true, 'review-note fixture source is required');

const sourceText = readFileSync(robotSource, 'utf8');
assert.match(sourceText, /review:/, 'source must include explicit review-only block');
assert.match(sourceText, /publicRender:\s*false/, 'review-only source must be explicitly non-public');
assert.match(sourceText, /internalNotes:/, 'source must include internalNotes for the isolation guard');
assert.match(sourceText, /KIBER-50-REVIEW-ONLY-SENTINEL/, 'sentinel must exist in source to prove it is filtered from render');

const htmlFiles = walk(distRoot, '.html');
assert.ok(htmlFiles.length > 0, 'production build must produce HTML files');

const violations = [];
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  for (const marker of forbiddenPublicMarkers) {
    if (html.includes(marker)) violations.push(`${relative(root, file)} contains ${marker}`);
  }
}

assert.deepEqual(violations, [], 'review-only notes or field names leaked into production HTML');

mkdirSync(dirname(reportPath), { recursive: true });
writeFileSync(reportPath, `${JSON.stringify({
  issue: 'KIBER-50',
  generatedAt: new Date().toISOString(),
  htmlFilesChecked: htmlFiles.length,
  forbiddenPublicMarkers,
  sourceFixture: relative(root, robotSource),
  result: 'passed',
}, null, 2)}\n`);

console.log(`KIBER-50 review-notes isolation smoke passed: ${htmlFiles.length} HTML files checked; review-only sentinel stayed out of production render.`);
