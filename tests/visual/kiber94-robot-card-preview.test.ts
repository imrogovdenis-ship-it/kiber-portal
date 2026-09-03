import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const root = process.cwd();
const routePath = resolve(root, 'src/pages/preview/kiber-94/robot-card/[slug].astro');
const mapperPath = resolve(root, 'src/lib/kiber94-robot-template-data.ts');
const componentPath = resolve(root, 'src/components/templates/RobotCardTemplate.astro');
const smokePath = resolve(root, 'scripts/kiber94-robot-card-preview-smoke.mjs');
const robotGalleryScriptPath = resolve(root, 'public/scripts/robot-card-gallery.js');
const packagePath = resolve(root, 'package.json');
const reportPath = resolve(root, 'docs/review/kiber-94-robot-card-preview/report.json');
const structureContractPath = resolve(root, 'docs/review/kiber-94-robot-card-preview/robot-card-structure-contract.md');

function readJson(path: string) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

test('KIBER-94 exposes robot_card through preview-only real-data route', () => {
  for (const path of [routePath, mapperPath, componentPath, smokePath]) {
    assert.equal(existsSync(path), true, `${path.replace(root + '/', '')} must exist`);
  }

  const routeSource = readFileSync(routePath, 'utf8');
  assert.match(routeSource, /getRobotPages\(\)/);
  assert.match(routeSource, /toRobotCardTemplateData\(/);
  assert.match(routeSource, /RobotCardTemplate/);
  assert.match(routeSource, /noindex/);
  assert.match(routeSource, /process\.env\.DEPLOY_ENV !== 'production'/);
  assert.doesNotMatch(routeSource, /sitemap|launch-routes/);
});

test('KIBER-94 maps existing robot source-of-truth into template data without inventing prices or claims', () => {
  const mapperSource = readFileSync(mapperPath, 'utf8');
  assert.match(mapperSource, /RobotPageRecord/);
  assert.match(mapperSource, /RobotCardTemplateData/);
  assert.match(mapperSource, /const priceStatus = robot\.pricing\.mode === 'calculated' \? 'request' : 'needs_review'/);
  assert.match(mapperSource, /sourceStatus: 'page_content'/);
  assert.match(mapperSource, /reviewOnly:[\s\S]*publicRender: false/);
  assert.match(mapperSource, /priceSourceReconciliation/);
  assert.match(mapperSource, /claimSourceStatus/);
});

test('KIBER-94 Unitree G1 aiSummary uses owner supplied bold scenario copy', () => {
  const mapperSource = readFileSync(mapperPath, 'utf8');
  const summaryMatch = mapperSource.match(/'arenda-unitree-g1': '([^']+)'/);
  assert.ok(summaryMatch, 'Unitree G1 owner aiSummary override must exist');
  const summary = summaryMatch[1];
  assert.ok(summary.startsWith('Unitree G1 - '), 'Unitree G1 aiSummary must start with owner requested prefix');
  assert.ok(summary.length >= 300 && summary.length <= 400, `Unitree G1 aiSummary must be 300-400 chars, got ${summary.length}`);
  assert.match(summary, /гуманоидный робот для мероприятий, выставок, презентаций и шоу-программ/);
  assert.match(summary, /Команда КИБЕР ПОРТАЛА помогает подобрать сценарий, доставляет робота на площадку и сопровождает его работу оператором/);

  const componentSource = readFileSync(componentPath, 'utf8');
  assert.match(componentSource, /const aiSummary = template\.aiSummary/);
  assert.match(componentSource, /<p><strong>\{aiSummary\}<\/strong><\/p>/);
  assert.match(componentSource, /background:\s*transparent/);
  assert.match(componentSource, /font-size:\s*clamp\(1\.18rem,\s*1\.65vw,\s*1\.38rem\)/);
  assert.match(componentSource, /font-weight:\s*700/);
  assert.match(componentSource, /\.template-ai-summary strong \{[\s\S]*font:\s*inherit/);
  assert.doesNotMatch(componentSource, /\.template-ai-summary \{[\s\S]{0,160}background:\s*var\(--kp-reference-white\)/);
  assert.doesNotMatch(componentSource, /<strong>Коротко:<\/strong>/);
  assert.doesNotMatch(componentSource, /const aiSummary = `\$\{template\.hero\.text\} \$\{template\.aiSummary\}`/);
});

test('KIBER-94 Unitree G1 capabilities and scenarios use owner requested expanded copy', () => {
  const mapperSource = readFileSync(mapperPath, 'utf8');
  const componentSource = readFileSync(componentPath, 'utf8');

  assert.match(mapperSource, /const ownerRobotCardCopyBySlug/);
  assert.match(mapperSource, /capabilitiesLead:/);
  assert.match(mapperSource, /scenariosLead:/);
  assert.match(mapperSource, /capabilities: ownerCapabilityBlocks \?\? capabilityBlocks/);
  assert.match(mapperSource, /scenarios: ownerScenarioBlocks \?\? scenarioBlocks/);
  assert.match(componentSource, /\{capabilitiesLead\}/);
  assert.match(componentSource, /\{scenariosLead\}/);
  assert.doesNotMatch(componentSource, /template-live-intro/);
  assert.doesNotMatch(componentSource, /data-block-id=\"description\"/);
  assert.match(componentSource, /\.template-scenario-grid article \{[\s\S]*background:\s*var\(--kp-reference-white\)/);
  assert.match(componentSource, /\.template-scenario-grid article \{[\s\S]*border-radius:\s*1\.35rem/);
  assert.match(componentSource, /\.template-scenario-grid article \{[\s\S]*padding:\s*clamp\(1\.15rem,\s*2vw,\s*1\.65rem\)/);

  const requiredTexts = [
    'Ключевые возможности Unitree G1 показывают, за что его берут на мероприятия',
    'Сценарии использования помогают быстро понять, где Unitree G1 даст лучший эффект',
    'Рост и пластика гуманоидного корпуса помогают Unitree G1 выглядеть как живой герой стенда',
    'Интерактивная фотозона превращает Unitree G1 в героя кадров',
  ];
  for (const text of requiredTexts) assert.ok(mapperSource.includes(text), `missing expanded copy: ${text}`);
});


test('KIBER-94 Unitree G1 included service matches owner reference block placement and checklist style', () => {
  const componentSource = readFileSync(componentPath, 'utf8');
  const smoke = readFileSync(smokePath, 'utf8');

  const includedLeadMatch = componentSource.match(/const includedServiceLead = '([^']+)'/);
  assert.ok(includedLeadMatch, 'included service lead must be a named owner-copy constant');
  const includedLeadLength = [...includedLeadMatch[1]].length;
  assert.ok(includedLeadLength >= 300 && includedLeadLength <= 350, `included service lead length must be 300-350 chars, got ${includedLeadLength}`);

  const order = [
    'data-block-id="gallery"',
    'data-block-id="includedService"',
    'data-block-id="capabilities"',
  ];
  let previous = -1;
  for (const needle of order) {
    const current = componentSource.indexOf(needle);
    assert.ok(current > previous, `${needle} must appear after the previous owner-requested block`);
    previous = current;
  }

  assert.match(componentSource, /<span>\{includedServiceLead\}<\/span>/);
  assert.match(componentSource, /class="template-check-list template-check-list--reference"/);
  assert.match(componentSource, /\.template-check-list--reference \{[\s\S]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(componentSource, /\.template-check-list--reference \{[\s\S]*margin-left:\s*var\(--kp-home-large-offset/);
  assert.match(componentSource, /\.template-check-list--reference li \{[\s\S]*background:\s*transparent/);
  assert.match(componentSource, /\.template-check-list--reference li::before \{[\s\S]*border-radius:\s*999rem/);
  assert.match(componentSource, /\.template-check-list--reference li::before \{[\s\S]*background:\s*var\(--kp-reference-blue\)/);
  assert.match(componentSource, /\.template-check-list--reference li::before \{[\s\S]*color:\s*var\(--kp-reference-white\)/);
  assert.match(smoke, /included service owner reference checklist/);
});


test('KIBER-94 Unitree G1 order flow matches owner reference with long lead and numbered circles', () => {
  const componentSource = readFileSync(componentPath, 'utf8');
  const smoke = readFileSync(smokePath, 'utf8');

  const orderFlowLeadMatch = componentSource.match(/const orderFlowLead = '([^']+)'/);
  assert.ok(orderFlowLeadMatch, 'order flow lead must be a named owner-copy constant');
  const orderFlowLeadLength = [...orderFlowLeadMatch[1]].length;
  assert.ok(orderFlowLeadLength >= 300 && orderFlowLeadLength <= 350, `order flow lead length must be 300-350 chars, got ${orderFlowLeadLength}`);

  assert.match(componentSource, /<span>\{orderFlowLead\}<\/span>/);
  assert.match(componentSource, /class="template-order-list template-order-list--reference"/);
  assert.match(componentSource, /\.template-order-list--reference \{[\s\S]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.match(componentSource, /\.template-order-list--reference \{[\s\S]*margin-left:\s*var\(--kp-home-large-offset/);
  assert.match(componentSource, /\.template-order-list--reference li \{[\s\S]*background:\s*transparent/);
  assert.match(componentSource, /\.template-order-list--reference li::before \{[\s\S]*border-radius:\s*999rem/);
  assert.match(componentSource, /\.template-order-list--reference li::before \{[\s\S]*background:\s*var\(--kp-reference-blue\)/);
  assert.match(componentSource, /\.template-order-list--reference li::before \{[\s\S]*color:\s*var\(--kp-reference-white\)/);
  assert.match(componentSource, /\.template-order-list--reference li::before \{[\s\S]*content:\s*counter\(order-flow\)/);
  assert.doesNotMatch(componentSource, /class="template-order-list template-order-list--wide"/);
  assert.match(smoke, /order flow owner reference numbered layout/);
});


test('KIBER-94 robot_card mobile gallery follows supplied mobile reference without arrow controls', () => {
  const componentSource = readFileSync(componentPath, 'utf8');
  const mobileReference = readFileSync(resolve(root, 'docs/source/reference-mobile-v3.html'), 'utf8');

  assert.match(mobileReference, /Слайдеры: свайп, без стрелок/);
  assert.match(mobileReference, /\.gallery-slider__item\{flex:0 0 85%;aspect-ratio:1\/1/);

  const mobileMedia = componentSource.match(/@media \(max-width: 39\.9375rem\) \{[\s\S]*?\n  \}/)?.[0] ?? '';
  assert.match(mobileMedia, /\.template-gallery-nav\s*\{[\s\S]*display:\s*none/);
  assert.match(mobileMedia, /\.template-live-gallery__item,\s*\n\s*\.template-action-gallery figure\s*\{[\s\S]*flex:\s*0 0 85%/);
  assert.match(mobileMedia, /\.template-live-gallery__item,\s*\n\s*\.template-action-gallery figure\s*\{[\s\S]*aspect-ratio:\s*1 \/ 1/);
  assert.match(mobileMedia, /\.template-live-gallery__item,\s*\n\s*\.template-action-gallery figure\s*\{[\s\S]*height:\s*auto/);
  assert.match(mobileMedia, /\.template-live-gallery__item img,\s*\n\s*\.template-action-gallery img\s*\{[\s\S]*width:\s*100%/);
  assert.match(mobileMedia, /\.template-live-gallery__item img,\s*\n\s*\.template-action-gallery img\s*\{[\s\S]*height:\s*100%/);
});


test('KIBER-94 desktop gallery behavior uses a CSP-safe external script based on desktop reference', () => {
  const componentSource = readFileSync(componentPath, 'utf8');
  const scriptSource = readFileSync(robotGalleryScriptPath, 'utf8');
  const desktopReference = readFileSync(resolve(root, 'docs/source/reference-desktop-v9.html'), 'utf8');

  assert.match(desktopReference, /document\.querySelectorAll\('\.drag-slider'\)/);
  assert.match(desktopReference, /slider\.addEventListener\('mousedown'/);
  assert.match(desktopReference, /window\.addEventListener\('mousemove'/);
  assert.match(desktopReference, /window\.addEventListener\('mouseup'/);
  assert.match(desktopReference, /slider\.scrollLeft=startScroll-dx/);
  assert.match(desktopReference, /document\.querySelectorAll\('\[data-slider-next\]'\)/);

  assert.match(componentSource, /<script is:inline src="\/scripts\/robot-card-gallery\.js" defer><\/script>/);
  assert.doesNotMatch(componentSource, /document\.querySelectorAll<HTMLElement>\('\[data-drag-slider\^="robot-"\]'\)/);
  assert.match(scriptSource, /document\.querySelectorAll\('\[data-drag-slider\^="robot-"\]'\)/);
  assert.match(scriptSource, /slider\.addEventListener\('mousedown'/);
  assert.match(scriptSource, /window\.addEventListener\('mousemove'/);
  assert.match(scriptSource, /window\.addEventListener\('mouseup'/);
  assert.match(scriptSource, /slider\.scrollLeft = startScroll - dx/);
  assert.match(scriptSource, /document\.querySelectorAll\('\[data-slider-prev\]'\)/);
  assert.match(scriptSource, /document\.querySelectorAll\('\[data-slider-next\]'\)/);
  assert.doesNotMatch(scriptSource, /<script|type="module"|HTMLElement|PointerEvent|MouseEvent/);
});


test('KIBER-94 Unitree G1 CTA #2 keeps its owner image while CTA #1 can use the latest owner image', () => {
  const componentSource = readFileSync(componentPath, 'utf8');
  const smoke = readFileSync(smokePath, 'utf8');

  assert.match(componentSource, /const robotFinalCtaImage = \{[\s\S]*src: '\/images\/kiber-94-preview\/gosha-ushanka-cta2\.webp'/);
  assert.match(componentSource, /alt: 'Кибер Гоша в красной шапке помогает ответить на вопросы по аренде робота'/);
  assert.match(componentSource, /image: robotFinalCtaImage/);
  assert.match(componentSource, /const robotQuickCta = \{[\s\S]*image: robotQuickCtaImage/);
  assert.match(componentSource, /\.template-reused-block--cta:not\(\.template-reused-block--quick-cta\) :global\(\.home-final-cta\) \{[\s\S]*align-items:\s*stretch/);
  assert.match(componentSource, /\.template-reused-block--cta:not\(\.template-reused-block--quick-cta\) :global\(\.home-final-cta\) \{[\s\S]*height:\s*clamp\(20rem,\s*26\.25vw,\s*21rem\)/);
  assert.match(componentSource, /\.template-reused-block--cta:not\(\.template-reused-block--quick-cta\) :global\(\.home-final-cta__image\) \{[\s\S]*height:\s*100%/);
  assert.match(componentSource, /\.template-reused-block--cta:not\(\.template-reused-block--quick-cta\) :global\(\.home-final-cta__image\) \{[\s\S]*overflow:\s*visible/);
  assert.match(componentSource, /\.template-reused-block--cta:not\(\.template-reused-block--quick-cta\) :global\(\.home-final-cta__image img\) \{[\s\S]*height:\s*clamp\(16rem,\s*23\.6vw,\s*18\.9rem\)/);
  assert.match(componentSource, /\.template-reused-block--cta:not\(\.template-reused-block--quick-cta\) :global\(\.home-final-cta__image img\) \{[\s\S]*transform:\s*translateY\(-1\.9rem\)/);
  assert.match(componentSource, /\.template-reused-block--cta:not\(\.template-reused-block--quick-cta\) :global\(\.home-final-cta__image img\) \{[\s\S]*width:\s*auto/);
  assert.match(smoke, /CTA #2 owner image/);
});


test('KIBER-94 Unitree G1 quote-to-CTA owner feedback uses compact CTA #1 with live price', () => {
  const componentSource = readFileSync(componentPath, 'utf8');
  const smoke = readFileSync(smokePath, 'utf8');

  assert.match(componentSource, /quickCtaTitle = `Арендуйте \$\{robotTypeAccusative\} \$\{template\.robot\.name\} для мероприятия \$\{template\.robot\.priceDisplay\}`/);
  assert.match(componentSource, /const quickCtaNoWrap = template\.robot\.priceDisplay/);
  assert.match(componentSource, /titleNoWrap: quickCtaNoWrap/);
  assert.match(componentSource, /const robotQuickCtaImage = \{[\s\S]*src: '\/images\/kiber-94-preview\/gosha-ushanka-cta1\.webp'/);
  assert.match(componentSource, /alt: 'Кибер Гоша в красной ушанке приглашает арендовать Unitree G1'/);
  assert.match(componentSource, /const robotQuickCta = \{[\s\S]*image: robotQuickCtaImage/);
  assert.match(componentSource, /const robotFinalCta = \{[\s\S]*image: robotFinalCtaImage/);
  assert.match(componentSource, /<section class="template-reused-block template-reused-block--gosha-quote" data-block-id="goshaCta">/);
  assert.match(componentSource, /\.template-reused-block--gosha-quote \{[\s\S]*margin-bottom:\s*calc\(var\(--robot-card-page-gap\) \* -\.3\)/);
  assert.match(componentSource, /--robot-card-page-gap:\s*clamp\(3\.5rem,\s*6vw,\s*6rem\)/);
  assert.match(componentSource, /gap:\s*var\(--robot-card-page-gap\)/);
  assert.match(componentSource, /\.template-reused-block--quick-cta :global\(\.home-final-cta\) \{[\s\S]*padding:\s*clamp\(1\.4rem,\s*3\.5vw,\s*2\.8rem\)/);
  assert.match(componentSource, /\.template-reused-block--quick-cta :global\(\.home-final-cta h2\) \{[\s\S]*line-height:\s*1\.16/);
  assert.match(componentSource, /\.template-reused-block--quick-cta :global\(\.home-final-cta__copy\) \{[\s\S]*transform:\s*translateY\(-\.35rem\)/);
  assert.match(componentSource, /\.template-reused-block--quick-cta :global\(\.home-final-cta__actions\) \{[\s\S]*margin-top:\s*1\.45rem/);
  assert.match(componentSource, /\.template-reused-block--quick-cta :global\(\.home-final-cta__image\) \{[\s\S]*align-self:\s*center/);
  assert.match(componentSource, /\.template-reused-block--quick-cta :global\(\.home-final-cta__image\) \{[\s\S]*height:\s*clamp\(7rem,\s*15\.2vw,\s*12\.1rem\)/);
  assert.match(componentSource, /\.template-reused-block--quick-cta :global\(\.home-final-cta__image\) \{[\s\S]*overflow:\s*visible/);
  assert.match(componentSource, /\.template-reused-block--quick-cta :global\(\.home-final-cta__image img\) \{[\s\S]*height:\s*clamp\(14rem,\s*20vw,\s*15\.95rem\)/);
  assert.match(componentSource, /\.template-reused-block--quick-cta :global\(\.home-final-cta__image img\) \{[\s\S]*transform:\s*translateY\(-1\.15rem\)/);
  assert.match(componentSource, /\.template-reused-block--quick-cta :global\(\.home-final-cta__image img\) \{[\s\S]*width:\s*auto/);
  assert.match(smoke, /compact CTA #1 price must stay unbroken on one line/);
  assert.match(smoke, /home-final-cta__title-nowrap/);
  assert.match(smoke, /CTA #1 owner image/);
});


test('KIBER-94 preview smoke is wired but keeps production and public routes untouched', () => {
  const smoke = readFileSync(smokePath, 'utf8');
  assert.match(smoke, /dist\/preview\/kiber-94\/robot-card/);
  assert.match(smoke, /data-page-type="robot_card"/);
  assert.match(smoke, /data-block-id="gallery"/);
  assert.match(smoke, /text block with heading must be removed/);
  assert.match(smoke, /data-block-id="capabilities"/);
  assert.match(smoke, /noindex, nofollow/);
  assert.match(smoke, /source URL leaked/);
  assert.match(smoke, /massPageGeneration: false/);

  const pkg = readJson(packagePath);
  assert.equal(pkg.scripts['test:kiber94-robot-card-preview'], 'node scripts/kiber94-robot-card-preview-smoke.mjs');
  assert.doesNotMatch(pkg.scripts.ci, /test:kiber94-robot-card-preview/, 'preview-rendered smoke should not run in production CI before build:preview');
});

test('KIBER-94 records owner approval only for robot_card structure and data mapping', () => {
  const report = readJson(reportPath);
  assert.equal(report.ownerApproval.scope, 'structure_and_data_mapping_only');
  assert.equal(report.ownerApproval.status, 'approved');
  assert.equal(report.ownerApproval.quote, 'Вроде бы все верно.');
  assert.equal(report.ownerApproval.designApproval, false);
  assert.equal(report.ownerApproval.publicRouteReplacementApproval, false);
  assert.equal(report.ownerApproval.productionApproval, false);
});

test('KIBER-94 robot_card preview has an owner-review visual layout layer', () => {
  const componentSource = readFileSync(componentPath, 'utf8');
  assert.match(componentSource, /import RobotCard from '\.\.\/blocks\/RobotCard\.astro'/);
  assert.match(componentSource, /import HomeGoshaQuote from '\.\.\/blocks\/HomeGoshaQuote\.astro'/);
  assert.match(componentSource, /import HomeImageCards from '\.\.\/blocks\/HomeImageCards\.astro'/);
  assert.match(componentSource, /import HomeFaqBlock from '\.\.\/blocks\/HomeFaqBlock\.astro'/);
  assert.match(componentSource, /import HomeFinalCta from '\.\.\/blocks\/HomeFinalCta\.astro'/);
  assert.match(componentSource, /homeArticles/);
  assert.match(componentSource, /homeGosha/);
  assert.doesNotMatch(componentSource, /template-gosha-quote/);
  assert.doesNotMatch(componentSource, /template-faq-list/);
  assert.doesNotMatch(componentSource, /template-live-cta/);
  assert.match(componentSource, /template-live-hero/);
  assert.match(componentSource, /template-live-hero__media/);
  assert.doesNotMatch(componentSource, /template-live-intro/);
  assert.doesNotMatch(componentSource, /data-block-id="description"/);
  assert.match(componentSource, /data-block-id="aiSummary"/);
  assert.match(componentSource, /template-ai-summary/);
  assert.match(componentSource, /primaryGallery\.map/);
  assert.match(componentSource, /actionGallery\.map/);
  assert.doesNotMatch(componentSource, /height:\s*\.0625rem/);
  assert.doesNotMatch(componentSource, /data-block-id="structuredFacts"/);
  assert.match(componentSource, /data-block-id="hiddenMachineFacts"/);
  assert.match(componentSource, /data-block-id="includedService"/);
  assert.match(componentSource, /data-block-id="orderFlow"/);
  assert.doesNotMatch(componentSource, /data-block-id="relatedCompilations"/);
  assert.doesNotMatch(componentSource, /homeCompilations/);
  assert.match(componentSource, /01 — что входит/);
  assert.match(componentSource, /02 — ключевые возможности/);
  assert.match(componentSource, /03 — сценарии использования/);
  assert.match(componentSource, /04 — робот в действии/);
  assert.match(componentSource, /05 — как заказать/);
  assert.match(componentSource, /template-feature-grid/);
  assert.match(componentSource, /template-scenario-grid/);
  assert.match(componentSource, /box-shadow: none/);
  assert.match(componentSource, /border-radius: 1\.625rem/);
});

test('KIBER-94 preview route exposes SEO/AI schemas required for visible robot_card content', () => {
  const routeSource = readFileSync(routePath, 'utf8');
  assert.match(routeSource, /faqPageJsonLd/);
  assert.match(routeSource, /breadcrumbJsonLd/);
  assert.match(routeSource, /breadcrumbs=\{breadcrumbs\}/);
  assert.match(routeSource, /template\.faq\.map/);
});

test('KIBER-94 documents the approved-draft robot_card structure before rewriting generation skills', () => {
  assert.equal(existsSync(structureContractPath), true, 'robot-card structure contract must exist');
  const doc = readFileSync(structureContractPath, 'utf8');
  for (const phrase of [
    'Hero',
    'Short visible AI summary',
    'First gallery / robot appearance proof',
    'Text block',
    'Capabilities',
    'Scenarios / use cases',
    'Robot in action / second media surface',
    'Kiber Gosha brand voice',
    'CTA #1',
    'Included service',
    'Machine facts / structured data for choosing',
    'Order flow / what happens after request',
    'FAQ',
    'CTA #2',
    'Related articles / Blog Kiber Gosha',
    'Related catalog',
    'Skill rewrite requirement',
  ]) {
    assert.ok(doc.includes(phrase), `structure contract must include ${phrase}`);
  }
  assert.match(doc, /Kiber Gosha must appear across page types/);
  assert.match(doc, /not decoration/);
  assert.doesNotMatch(doc, /Related Подборки/);
})

test('KIBER-94 owner feedback fixes block order and removes duplicate short summaries', () => {
  const componentSource = readFileSync(componentPath, 'utf8');
  const order = [
    'data-block-id="hero"',
    'data-block-id="aiSummary"',
    'data-block-id="gallery"',
    'data-block-id="includedService"',
    'data-block-id="capabilities"',
    'data-block-id="scenarios"',
    'data-block-id="robotInAction"',
    'data-block-id="goshaCta"',
    'data-block-id="pricing"',
    'data-block-id="hiddenMachineFacts"',
    'data-block-id="orderFlow"',
    'data-block-id="faq"',
    'data-block-id="finalQuestionsCta"',
    'data-block-id="articles"',
    'data-block-id="relatedCatalog"',
  ];
  let previous = -1;
  for (const needle of order) {
    const current = componentSource.indexOf(needle);
    assert.ok(current > previous, `${needle} must appear after the previous approved block`);
    previous = current;
  }
  assert.equal((componentSource.match(/data-block-id="aiSummary"/g) ?? []).length, 1);
  assert.doesNotMatch(componentSource, /data-block-id="modelIntro"/);
  assert.doesNotMatch(componentSource, /data-block-id="relatedCompilations"/);
  assert.match(componentSource, /template-live-hero__media/);
  assert.match(componentSource, /Остались вопросы/);
});


test('KIBER-94 robot_card design-block refinement follows owner visual contract', () => {
  const componentSource = readFileSync(componentPath, 'utf8');
  assert.match(componentSource, /robotTypeAccusative/);
  assert.match(componentSource, /heroTitle = `Аренда \${robotTypeAccusative} \${template\.robot\.name}`/);
  assert.match(componentSource, /template-live-hero--dark/);
  assert.match(componentSource, /template-live-hero__media img/);
  assert.match(componentSource, /--robot-card-hero-title-scale:\s*\.9/);
  assert.match(componentSource, /--robot-card-hero-media-height:\s*95%/);
  assert.match(componentSource, /--robot-card-hero-block-inset:/);
  assert.match(componentSource, /--robot-card-hero-inline-inset:/);
  assert.match(componentSource, /--robot-card-hero-media-edge-inset:\s*calc\(var\(--robot-card-hero-block-inset\) \* \.65\)/);
  assert.match(componentSource, /padding:\s*var\(--robot-card-hero-block-inset\) var\(--robot-card-hero-media-edge-inset\) var\(--robot-card-hero-block-inset\) var\(--robot-card-hero-inline-inset\)/);
  assert.match(componentSource, /gap:\s*var\(--robot-card-hero-inline-inset\)/);
  assert.match(componentSource, /\.template-live-hero__eyebrow[\s\S]*color:\s*var\(--kp-reference-white\)/);
  assert.match(componentSource, /\.template-hero-button--primary[\s\S]*background:\s*var\(--kp-reference-white\)[\s\S]*color:\s*var\(--kp-reference-blue\)/);
  assert.match(componentSource, /\.template-hero-button--light[\s\S]*background:\s*var\(--kp-reference-blue\)[\s\S]*color:\s*var\(--kp-reference-white\)/);
  assert.match(componentSource, /Оставить заявку/);
  assert.doesNotMatch(componentSource, /Робот приезжает с оператором, сценарием и подготовкой под площадку/);
  assert.doesNotMatch(componentSource, /border-left:\s*\.32rem solid var\(--kp-reference-blue\)/);
  assert.match(componentSource, /data-drag-slider=\"robot-gallery\"/);
  assert.match(componentSource, /data-drag-slider=\"robot-action-gallery\"/);
  assert.match(componentSource, /data-slider-prev=\"\[data-drag-slider='robot-gallery'\]\"/);
  assert.match(componentSource, /data-slider-next=\"\[data-drag-slider='robot-gallery'\]\"/);
  assert.match(componentSource, /data-slider-prev=\"\[data-drag-slider='robot-action-gallery'\]\"/);
  assert.match(componentSource, /data-slider-next=\"\[data-drag-slider='robot-action-gallery'\]\"/);
  assert.match(componentSource, /--robot-card-gallery-height:\s*clamp\(29\.12rem,\s*47\.6vw,\s*35\.49rem\)/);
  assert.match(componentSource, /--robot-card-action-gallery-height:\s*clamp\(21rem,\s*33\.6vw,\s*26\.6rem\)/);
  assert.match(componentSource, /height:\s*var\(--robot-card-gallery-height\)/);
  assert.match(componentSource, /width:\s*auto/);
  assert.match(componentSource, /object-fit:\s*contain/);
  assert.match(componentSource, /flex:\s*0 0 auto/);
  const robotGalleryScript = readFileSync(robotGalleryScriptPath, 'utf8');
  assert.match(componentSource, /<script is:inline src="\/scripts\/robot-card-gallery\.js" defer><\/script>/);
  assert.match(robotGalleryScript, /mousedown/);
  assert.match(robotGalleryScript, /window\.addEventListener\('mousemove'/);
  assert.match(robotGalleryScript, /window\.addEventListener\('mouseup'/);
  assert.match(robotGalleryScript, /data-slider-next/);
  assert.match(robotGalleryScript, /scrollBy\(\{ left: slider\.clientWidth \* 0\.8, behavior: 'smooth' \}\)/);
  assert.match(robotGalleryScript, /slider\.scrollLeft = startScroll - dx/);
  assert.match(componentSource, /scroll-snap-type:\s*none/);
  assert.doesNotMatch(componentSource, /scroll-snap-type:\s*x mandatory/);
  assert.doesNotMatch(componentSource, /<figcaption>\{index \+ 1\} из \{primaryGallery\.length\}<\/figcaption>/);
  assert.doesNotMatch(componentSource, /<figcaption>\{index \+ 1\} \/ \{actionGallery\.length\}<\/figcaption>/);
  assert.doesNotMatch(componentSource, /Сначала показываем самого робота крупно/);
  assert.doesNotMatch(componentSource, /Media-зона напоминает/);
  assert.doesNotMatch(componentSource, /data-block-id=\"structuredFacts\"/);
  assert.match(componentSource, /hiddenMachineFacts/);
  assert.match(componentSource, /template-check-list--reference/);
  assert.match(componentSource, /template-order-list--reference/);
  assert.match(componentSource, /HomeFinalCta \{\.\.\.robotQuickCta/);
  assert.match(componentSource, /primaryCta: \{ label: 'Написать нам'/);
  assert.match(componentSource, /secondaryCta: \{ label: 'Оставить заявку'/);
  assert.match(componentSource, /robotArticles/);
  assert.match(componentSource, /robotCatalogTitle = 'Вас также могут заинтересовать'/);
});
