import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');
const deployEnv = process.env.DEPLOY_ENV ?? 'preview';
const isProduction = deployEnv === 'production';
const site = 'https://www.kiber-portal.ru';

const packages = [
  'robot-dlya-nauchnogo-shou-i-shkoly',
  'robot-stendist-dlya-vystavki',
  'roboty-unitree-obzor-kompanii',
  'sravnenie-robosobak-dlya-meropriyatiy',
  'unitree-go2-na-meropriyatii',
  'xiaomi-cyberdog-2-v-promo-akciyah',
];

function htmlFor(route) {
  const file = route === '/roboty-sobaki/' ? join(dist, 'roboty-sobaki/index.html') : join(dist, route.replace(/^\//, ''), 'index.html');
  assert.ok(existsSync(file), `missing built html: ${route}`);
  return readFileSync(file, 'utf8');
}

function textOf(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function routeExists(href) {
  if (href.startsWith('/#')) return true;
  const [path] = href.split('#');
  if (path === '/' || path === '') return true;
  if (path.startsWith('/lead/request/')) return existsSync(join(dist, 'lead/request/index.html'));
  if (path.startsWith('/api/')) return true;
  return existsSync(join(dist, path.replace(/^\//, ''), 'index.html')) || existsSync(join(dist, path.replace(/^\//, '')));
}

if (!isProduction) {
  const hub = htmlFor('/preview/robot-dogs/');
  assert.match(hub, /data-preview-only="true"/);
}

for (const slug of packages) {
  const pkg = JSON.parse(readFileSync(join(root, `data/content-inbox/dogs-approved/${slug}.content-package.json`), 'utf8'));
  const html = htmlFor(`/articles/${slug}/`);
  const text = textOf(html);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${slug} must have one H1`);
  if (isProduction) {
    assert.doesNotMatch(html, /<meta name="robots" content="noindex, nofollow">/, `${slug} must be indexable in production`);
    assert.doesNotMatch(html, /data-preview-only="true"/, `${slug} must not expose preview-only marker in production`);
    assert.match(html, new RegExp(`<link rel=\"canonical\" href=\"${site}${pkg.seo.canonicalPath}\"`), `${slug} must use production canonical`);
  } else {
    assert.match(html, /<meta name="robots" content="noindex, nofollow">/, `${slug} must be noindex in preview`);
  }
  assert.ok(text.includes(pkg.seo.h1), `${slug} H1 text missing`);
  for (const block of Object.values(pkg.blocks)) {
    if (block?.paragraphs) for (const paragraph of block.paragraphs) assert.ok(text.includes(paragraph), `${slug} paragraph missing: ${paragraph.slice(0, 80)}`);
    if (block?.items) for (const item of block.items) {
      if (typeof item === 'string') assert.ok(text.includes(item), `${slug} checklist item missing: ${item}`);
      else {
        if (item.question) assert.ok(text.includes(item.question), `${slug} FAQ question missing: ${item.question}`);
        if (item.answer) assert.ok(text.includes(item.answer), `${slug} FAQ answer missing: ${item.answer.slice(0, 80)}`);
        if (item.title) assert.ok(text.includes(item.title), `${slug} item title missing: ${item.title}`);
        if (item.text) assert.ok(text.includes(item.text), `${slug} item text missing: ${item.text.slice(0, 80)}`);
      }
    }
    if (block?.quote) assert.equal((text.match(new RegExp(block.quote.replace(/^\*\*/, '').replace(/\*\*$/, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length, 1, `${slug} quote must render once`);
  }
  assert.doesNotMatch(html, /\.hermes|data\/content-inbox|sourceStatus|rightsStatus|actualDescription|seoAlt|undefined|null/g, `${slug} leaks internal fields`);
  for (const href of [...html.matchAll(/href="(\/[^"#?]*(?:\/?)(?:#[^"]*)?)"/g)].map((m) => m[1])) {
    assert.ok(routeExists(href), `${slug} local href does not resolve: ${href}`);
  }
  for (const src of [...html.matchAll(/src="(\/images\/robot-dogs-preview\/[^"]+\.webp)"/g)].map((m) => m[1])) {
    const file = join(root, 'public', src.replace(/^\//, ''));
    assert.ok(existsSync(file), `${slug} media missing: ${src}`);
    assert.ok(statSync(file).size < 1800000, `${slug} media too large: ${src}`);
  }
}

const compilation = htmlFor('/roboty-sobaki/');
assert.equal((compilation.match(/<h1\b/g) || []).length, 1, 'roboty-sobaki must have one H1');
if (isProduction) {
  assert.doesNotMatch(compilation, /<meta name="robots" content="noindex, nofollow">/);
  assert.doesNotMatch(compilation, /data-preview-only="true"/);
  assert.match(compilation, new RegExp(`<link rel=\"canonical\" href=\"${site}/roboty-sobaki/\"`));
} else {
  assert.match(compilation, /<meta name="robots" content="noindex, nofollow">/);
}
for (const slug of ['arenda-unitree-go2', 'arenda-xiaomi-cyberdog-2', 'arenda-inchbot-l1-w-edu']) assert.match(compilation, new RegExp(`/robots/${slug}/`));

const exhibition = htmlFor('/articles/robot-stendist-dlya-vystavki/');
assert.doesNotMatch(exhibition, /Xiaomi|CyberDog|Inchbot/i, 'exhibition page contains excluded model text');
for (const slug of ['arenda-unitree-g1', 'arenda-promobot-v4', 'arenda-unitree-go2']) assert.match(exhibition, new RegExp(`/robots/${slug}/`));
assert.doesNotMatch(exhibition, /\/robots\/arenda-(xiaomi-cyberdog-2|inchbot-l1-w-edu)\//);

const go2 = textOf(htmlFor('/articles/unitree-go2-na-meropriyatii/'));
assert.ok(go2.includes('На выставке Unitree Go2 лучше работает не как бесконечно движущийся объект, а как магнит у стенда. Робот появляется по расписанию, делает небольшой проход, останавливает поток посетителей и даёт менеджеру повод начать разговор. Если стенд тесный, сценарий делают спокойнее: меньше маршрута, больше пауз и пояснений.'), 'Go2 approved magnet paragraph missing');

console.log(JSON.stringify({ deployEnv, routesChecked: 7, articlesChecked: packages.length, status: 'ok' }));
