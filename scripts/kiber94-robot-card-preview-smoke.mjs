#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const root = process.cwd();
const previewDistPath = 'dist/preview/kiber-94/robot-card';
const robots = JSON.parse(readFileSync(resolve(root, 'src/content/robots.generated.json'), 'utf8')).robots;
const reportPath = resolve(root, 'docs/review/kiber-94-robot-card-preview/report.json');
const checked = [];
const failures = [];

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
    'data-block-id="modelIntro"',
    'data-block-id="gallery"',
    'data-block-id="description"',
    'data-block-id="capabilities"',
    'data-block-id="scenarios"',
    'data-block-id="robotInAction"',
    'data-block-id="pricing"',
    'data-block-id="goshaCta"',
    'data-block-id="faq"',
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
  if (/Wordstat|SERP|keywordDensity|checklistReport|crmConfig|leadRoutingImplementationNotes/.test(html)) {
    failures.push(`${robot.slug}: review-only/service-only wording leaked into preview HTML`);
  }
  const imageSources = [...html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)].map((match) => match[1]);
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
    scope: 'preview-only robot_card visual layout pass using existing HomeFinalCta, HomeGoshaQuote, RobotCard catalog, HomeFaqBlock, and HomeImageCards article blocks',
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
