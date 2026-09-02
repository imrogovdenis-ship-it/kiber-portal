#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const root = process.cwd();
const previewDistPath = 'dist/preview/kiber-94/robot-card';
const robots = JSON.parse(readFileSync(resolve(root, 'src/content/robots.generated.json'), 'utf8')).robots;
const reportPath = resolve(root, 'docs/review/kiber-94-robot-card-preview/report.json');
const checked = [];
const failures = [];
const warnings = [];

for (const robot of robots) {
  const htmlPath = join(root, previewDistPath, robot.slug, 'index.html');
  if (!existsSync(htmlPath)) {
    failures.push(`${robot.slug}: preview HTML missing at ${htmlPath.replace(root + '/', '')}`);
    continue;
  }
  const html = readFileSync(htmlPath, 'utf8');
  const required = [
    'data-preview-route="robot_card"',
    'data-page-type="robot_card"',
    'data-kiber-task="KIBER-94"',
    'data-block-id="hero"',
    'data-block-id="gallery"',
    'data-block-id="description"',
    'data-block-id="aiSummary"',
    'data-block-id="hiddenMachineFacts"',
    'data-block-id="includedService"',
    'data-block-id="capabilities"',
    'data-block-id="scenarios"',
    'data-block-id="orderFlow"',
    'data-block-id="robotInAction"',
    'data-block-id="goshaCta"',
    'data-block-id="pricing"',
    'data-block-id="finalQuestionsCta"',
    'data-block-id="articles"',
    'data-block-id="relatedCatalog"',
    'data-block-id="faq"',
    'data-home-block="kiber-gosha"',
    'data-home-block="final-cta"',
    'FAQPage',
    'BreadcrumbList',
    'noindex, nofollow',
    robot.identity.name,
    robot.pricing.display,
  ];
  for (const needle of required) {
    if (!html.includes(needle)) failures.push(`${robot.slug}: missing ${needle}`);
  }
  const sourceUrlLeakPatterns = [
    `href="${robot.sourceUrl}"`,
    `href="${robot.sourceUrl}/"`,
    `content="https://www.kiber-portal.ru${robot.sourceUrl}"`,
    `content="https://www.kiber-portal.ru${robot.sourceUrl}/"`,
  ];
  if (sourceUrlLeakPatterns.some((needle) => html.includes(needle))) failures.push(`${robot.slug}: source URL leaked`);
  const h1Count = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1Count !== 1) failures.push(`${robot.slug}: expected exactly one H1, found ${h1Count}`);
  const imageSources = [...html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)].map((match) => match[1]);
  const galleryBlock = html.match(/<section[^>]*data-block-id="gallery"[\s\S]*?<\/section>/)?.[0] ?? '';
  const galleryImageCount = (galleryBlock.match(/<img\b/g) ?? []).length;
  if (galleryImageCount < 1) failures.push(`${robot.slug}: first gallery must render at least one visible real image, found ${galleryImageCount}`);
  if (galleryImageCount < 2) warnings.push(`${robot.slug}: media debt — only ${galleryImageCount} local gallery image available; import approved gallery assets before public rollout`);
  if (/height:\s*\.0625rem/.test(html)) failures.push(`${robot.slug}: gallery image CSS is visually hidden`);
  if (!/template-ai-summary/.test(html)) failures.push(`${robot.slug}: visible AI summary block missing`);
  if (/data-block-id="structuredFacts"/.test(html)) failures.push(`${robot.slug}: visible structured facts block must be removed`);
  if (!/data-block-id="hiddenMachineFacts"/.test(html)) failures.push(`${robot.slug}: machine-readable facts marker missing`);
  if (!/template-live-hero--dark/.test(html)) failures.push(`${robot.slug}: dark hero visual class missing`);
  if (!/data-drag-slider="robot-gallery"/.test(html)) failures.push(`${robot.slug}: first gallery drag slider missing`);
  if (!/data-drag-slider="robot-action-gallery"/.test(html)) failures.push(`${robot.slug}: action gallery drag slider missing`);
  if (!/data-slider-prev="\[data-drag-slider='robot-gallery'\]"/.test(html)) failures.push(`${robot.slug}: first gallery reference-style prev button missing`);
  if (!/data-slider-next="\[data-drag-slider='robot-gallery'\]"/.test(html)) failures.push(`${robot.slug}: first gallery reference-style next button missing`);
  if (!/data-slider-prev="\[data-drag-slider='robot-action-gallery'\]"/.test(html)) failures.push(`${robot.slug}: action gallery reference-style prev button missing`);
  if (!/data-slider-next="\[data-drag-slider='robot-action-gallery'\]"/.test(html)) failures.push(`${robot.slug}: action gallery reference-style next button missing`);
  if (!/mousedown/.test(html) || !/mousemove/.test(html) || !/mouseup/.test(html)) failures.push(`${robot.slug}: reference-style mouse drag script missing`);
  if (!/scrollBy/.test(html)) failures.push(`${robot.slug}: reference-style gallery navigation script missing`);
  if (/\d+\s*(?:из|\/)\s*\d+/.test(galleryBlock)) failures.push(`${robot.slug}: first gallery visible image numbering must be removed`);
  if (!/template-live-gallery__item/.test(galleryBlock)) failures.push(`${robot.slug}: first gallery item class missing`);
  if (!/Аренда робота|Аренда робо-кофейню/.test(html)) failures.push(`${robot.slug}: typed rental H1 missing`);
  if (!/Кибер Гоша|КИБЕР Гоша|КИБЕР ГОША/.test(html)) failures.push(`${robot.slug}: Kiber Gosha brand voice block missing`);
  if (/Wordstat|SERP|keywordDensity|checklistReport|crmConfig|leadRoutingImplementationNotes/.test(html)) {
    failures.push(`${robot.slug}: review-only/service-only wording leaked into preview HTML`);
  }
  for (const src of imageSources) {
    if (src.startsWith('/images/') && !existsSync(resolve(root, 'public', src.slice(1)))) {
      failures.push(`${robot.slug}: rendered missing public image asset ${src}`);
    }
  }
  checked.push(robot.slug);
}

const report = {
  issue: 'KIBER-94',
  status: failures.length ? 'failed' : 'passed',
  routePattern: '/preview/kiber-94/robot-card/[slug]/',
  checkedCount: checked.length,
  failures,
  warnings,
  safety: {
    productionDeployChanged: false,
    dnsChanged: false,
    secretsChanged: false,
    analyticsProviderChanged: false,
    liveLeadRoutingChanged: false,
    massPageGeneration: false,
    publicRobotRoutesChanged: false,
  },
  ownerApproval: {
    status: 'approved',
    scope: 'structure_and_data_mapping_only',
    quote: 'Вроде бы все верно.',
    designApproval: false,
    publicRouteReplacementApproval: false,
    productionApproval: false,
  },
  designPass: {
    status: failures.length ? 'failed' : 'ready_for_owner_visual_review',
    scope: 'preview-only robot_card design-block refinement: dark typed hero, two CTAs, transparent bold aiSummary, reference-style mouse draggable gallery/action gallery with nav controls, +40% height-first gallery media, included service checks, hidden machine facts data, order flow, FAQ, Gosha CTAs, robot-specific blog and related catalog',
    publicRouteReplacementApproval: false,
    productionApproval: false,
  },
};
mkdirSync(dirname(reportPath), { recursive: true });
writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');

if (failures.length) {
  console.error(`KIBER-94 robot_card preview smoke failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log(`KIBER-94 robot_card preview smoke passed: ${checked.length} preview robot pages checked.`);
