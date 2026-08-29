import assert from 'node:assert/strict';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const root = process.cwd();
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const json = (path) => JSON.parse(read(path));

const registry = json('data/review/media-rights-registry.json');
const cards = json('data/review/media-rights-robot-cards.json');
const robots = json('src/content/robots.generated.json').robots;
const reportPath = resolve(root, 'docs/review/media-rights/approved-media-rendering-report.json');

const failures = [];
const warnings = [];

assert.equal(registry.summary.productionApproved, 24, 'media-rights-registry.json must record owner approval before rendered media is considered approved');
assert.equal(cards.approval?.status, 'approved_by_owner_for_production_media_use', 'media-rights-robot-cards.json must carry owner approval evidence');

const approvedBySrc = new Map();
for (const card of cards.robots || []) {
  for (const asset of card.assets || []) {
    if (asset.productionApproved === true && asset.rightsStatus === 'approved_for_production') {
      approvedBySrc.set(asset.src, asset);
    }
  }
}
for (const item of registry.robots || []) {
  if (item.productionApproved !== true || item.rightsStatus !== 'approved_for_production') {
    failures.push(`${item.slug}: media registry item is not approved_for_production`);
  }
}

function imageTags(html) {
  return [...html.matchAll(/<img\b[^>]*>/g)].map((match) => match[0]);
}
function firstImageInside(html, className) {
  const start = html.indexOf(className);
  if (start === -1) return undefined;
  const imgStart = html.indexOf('<img', start);
  if (imgStart === -1) return undefined;
  const imgEnd = html.indexOf('>', imgStart);
  return html.slice(imgStart, imgEnd + 1);
}
function attrs(html, className) {
  const pattern = new RegExp(`<img[^>]*class=["'][^"']*${className}[^"']*["'][^>]*>`, 'g');
  return [...html.matchAll(pattern)].map((match) => match[0]);
}
function attr(tag, name) {
  const match = tag.match(new RegExp(`${name}=["']([^"']*)["']`));
  return match?.[1] || '';
}
function decodeAttr(value) {
  return value.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#39;/g, "'");
}

for (const robot of robots) {
  const htmlPath = `dist/robots/${robot.slug}/index.html`;
  if (!existsSync(resolve(root, htmlPath))) {
    failures.push(`${robot.slug}: missing rendered page ${htmlPath}; run npm run build:production before this smoke`);
    continue;
  }
  const html = read(htmlPath);
  if (!html.includes('robot-page__media')) failures.push(`${robot.slug}: rendered page missing robot-page__media`);
  const tag = firstImageInside(html, 'robot-page__media');
  const tags = tag ? [tag] : [];
  if (tags.length !== 1) failures.push(`${robot.slug}: expected exactly one robot-page hero image, got ${tags.length}`);
  for (const tag of tags) {
    const src = decodeAttr(attr(tag, 'src'));
    const alt = decodeAttr(attr(tag, 'alt'));
    if (src !== robot.media.hero.src) failures.push(`${robot.slug}: rendered hero src ${src} does not match generated hero ${robot.media.hero.src}`);
    if (alt !== robot.media.hero.alt) failures.push(`${robot.slug}: rendered hero alt drifted from generated media alt`);
    if (!approvedBySrc.has(src)) failures.push(`${robot.slug}: rendered hero src ${src} is not present in approved media-rights-robot-cards.json`);
    if (!alt || alt.length < 20) failures.push(`${robot.slug}: rendered hero alt is missing or too short`);
  }
}

const homePath = 'dist/index.html';
if (existsSync(resolve(root, homePath))) {
  const home = read(homePath);
  const cardImgs = attrs(home, 'robot-card__image');
  const publicImageTags = imageTags(home).filter((tag) => decodeAttr(attr(tag, 'src')).startsWith('/images/'));
  if (publicImageTags.length < 1) failures.push(`home: expected at least one rendered public image, got ${publicImageTags.length}`);
  if (cardImgs.length === 0) warnings.push('home: robot-card__image elements are absent because the current catalog pilot card still uses a placeholder');
  for (const tag of publicImageTags) {
    const src = decodeAttr(attr(tag, 'src'));
    const alt = decodeAttr(attr(tag, 'alt'));
    if (!approvedBySrc.has(src)) failures.push(`home: rendered image ${src} is not in approved media cards`);
    if (!alt || alt.length < 20) failures.push(`home: rendered image ${src} alt missing or too short`);
  }
} else {
  failures.push('home: dist/index.html missing; run npm run build:production before this smoke');
}

const report = {
  issue: 'KIBER-approved-media-rendering',
  status: failures.length ? 'failed' : 'passed',
  generatedAt: new Date().toISOString(),
  robotPagesChecked: robots.length,
  approvedMediaSources: approvedBySrc.size,
  failures,
  warnings,
};
mkdirSync(dirname(reportPath), { recursive: true });
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

if (failures.length) {
  console.error(`KIBER approved media rendering smoke failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log(`KIBER approved media rendering smoke passed: ${robots.length} robot pages and homepage card media checked against approved media registry.`);
