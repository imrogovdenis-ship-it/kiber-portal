import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, posix, resolve } from 'node:path';

const root = process.cwd();
const distRoot = resolve(root, 'dist');
const budgetPath = resolve(root, 'docs/review/kiber-39/performance-budget.json');
const reportPath = resolve(root, 'docs/review/kiber-39/performance-budget-report.json');

const budget = JSON.parse(readFileSync(budgetPath, 'utf8'));

function routeToHtmlFile(route) {
  if (route === '/') return join(distRoot, 'index.html');
  const clean = route.split('?')[0].replace(/^\//, '').replace(/\/$/, '');
  return join(distRoot, clean, 'index.html');
}

function attrValues(html, attr) {
  const pattern = new RegExp(`${attr}=["']([^"']+)["']`, 'gi');
  return [...html.matchAll(pattern)].map((match) => match[1]);
}

function tagAttrs(tag) {
  const attrs = {};
  for (const match of tag.matchAll(/([a-zA-Z:-]+)=("[^"]*"|'[^']*')/g)) {
    attrs[match[1].toLowerCase()] = match[2].slice(1, -1);
  }
  return attrs;
}

function distFileForAsset(raw) {
  if (!raw || raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('mailto:') || raw.startsWith('tel:') || raw.startsWith('data:')) return null;
  const clean = raw.split('?')[0].split('#')[0];
  if (!clean || !posix.extname(clean)) return null;
  return resolve(distRoot, clean.replace(/^\//, ''));
}

function sumFiles(paths) {
  const unique = [...new Set(paths.filter(Boolean))];
  let bytes = 0;
  const missing = [];
  for (const file of unique) {
    if (!existsSync(file)) {
      missing.push(file.replace(`${distRoot}/`, 'dist/'));
      continue;
    }
    bytes += statSync(file).size;
  }
  return { bytes, missing, files: unique.length };
}

assert.equal(existsSync(distRoot), true, 'dist/ missing; run npm run build:production before npm run test:performance');
assert.equal(existsSync(budgetPath), true, 'performance budget config missing');

const results = [];
const failures = [];

for (const route of budget.routes) {
  const htmlFile = routeToHtmlFile(route);
  if (!existsSync(htmlFile)) {
    failures.push(`${route}: missing ${htmlFile.replace(`${distRoot}/`, 'dist/')}`);
    continue;
  }

  const html = readFileSync(htmlFile, 'utf8');
  const stylesheetFiles = attrValues(html, 'href')
    .filter((href) => href.endsWith('.css') || href.includes('.css?'))
    .map(distFileForAsset);
  const scriptFiles = attrValues(html, 'src')
    .filter((src) => src.endsWith('.js') || src.includes('.js?'))
    .map(distFileForAsset);
  const imageFiles = attrValues(html, 'src')
    .filter((src) => /\.(?:svg|png|jpe?g|webp|avif)(?:$|[?#])/i.test(src))
    .map(distFileForAsset);

  const htmlBytes = statSync(htmlFile).size;
  const css = sumFiles(stylesheetFiles);
  const js = sumFiles(scriptFiles);
  const images = sumFiles(imageFiles);
  const totalPageBytes = htmlBytes + css.bytes + js.bytes + images.bytes;

  const imageTags = [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
  const layoutShiftRiskImages = [];
  for (const img of imageTags) {
    const attrs = tagAttrs(img);
    const hasDimensions = Boolean(attrs.width && attrs.height);
    const isLazy = attrs.loading === 'lazy';
    if (budget.layoutShiftGuards.imagesRequireDimensions && !hasDimensions) {
      layoutShiftRiskImages.push(`${attrs.src || '[unknown]'} missing width/height`);
    }
    if (budget.layoutShiftGuards.forbidLazyFirstContentImage && img === imageTags[0] && isLazy) {
      layoutShiftRiskImages.push(`${attrs.src || '[unknown]'} first content image is lazy-loaded`);
    }
  }

  const inlineLayoutMutationHandlers = html.match(/\bon(?:load|resize|scroll|click)=/gi) || [];

  const routeResult = {
    route,
    htmlBytes,
    cssBytes: css.bytes,
    jsBytes: js.bytes,
    imageBytes: images.bytes,
    totalPageBytes,
    cssFiles: css.files,
    jsFiles: js.files,
    imageFiles: images.files,
    proxies: {
      lcp: 'HTML+CSS+image byte budget and no lazy first content image',
      inp: 'JS byte budget and no inline layout mutation handlers',
      cls: 'image dimension guard and stable static markup',
    },
  };
  results.push(routeResult);

  if (css.missing.length) failures.push(`${route}: missing CSS assets ${css.missing.join(', ')}`);
  if (js.missing.length) failures.push(`${route}: missing JS assets ${js.missing.join(', ')}`);
  if (images.missing.length) failures.push(`${route}: missing image assets ${images.missing.join(', ')}`);
  if (htmlBytes > budget.staticBudgets.htmlBytes) failures.push(`${route}: HTML ${htmlBytes} > ${budget.staticBudgets.htmlBytes}`);
  if (css.bytes > budget.staticBudgets.cssBytes) failures.push(`${route}: CSS ${css.bytes} > ${budget.staticBudgets.cssBytes}`);
  if (js.bytes > budget.staticBudgets.jsBytes) failures.push(`${route}: JS ${js.bytes} > ${budget.staticBudgets.jsBytes}`);
  if (images.bytes > budget.staticBudgets.imageBytes) failures.push(`${route}: images ${images.bytes} > ${budget.staticBudgets.imageBytes}`);
  if (totalPageBytes > budget.staticBudgets.totalPageBytes) failures.push(`${route}: total page bytes ${totalPageBytes} > ${budget.staticBudgets.totalPageBytes}`);
  if (layoutShiftRiskImages.length) failures.push(`${route}: layout-shift image risks: ${layoutShiftRiskImages.join('; ')}`);
  if (inlineLayoutMutationHandlers.length) failures.push(`${route}: inline handlers can hurt INP/CLS: ${inlineLayoutMutationHandlers.join(', ')}`);
}

const report = {
  issue: 'KIBER-39',
  generatedAt: new Date().toISOString(),
  coreWebVitalsTargets: budget.coreWebVitalsTargets,
  staticBudgets: budget.staticBudgets,
  routes: results,
  status: failures.length ? 'failed' : 'passed',
  failures,
};
writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

if (failures.length) {
  console.error(`KIBER-39 performance budget smoke failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log(`KIBER-39 performance budget smoke passed: ${results.length} routes checked against LCP/INP/CLS static proxies.`);
