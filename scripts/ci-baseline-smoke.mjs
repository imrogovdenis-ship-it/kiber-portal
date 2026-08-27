import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { posix, resolve } from 'node:path';

const root = process.cwd();
const distRoot = resolve(root, 'dist');
const notFoundPath = 'dist/404.html';
const ignoredTrackedPaths = new Set([
  'package-lock.json',
  'scripts/ci-baseline-smoke.mjs',
]);
const ignoredExtensions = new Set([
  '.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.otf', '.pdf', '.xlsx', '.zip'
]);

function fail(message, details = []) {
  const detailText = details.length ? `\n${details.map((item) => `- ${item}`).join('\n')}` : '';
  throw new Error(`${message}${detailText}`);
}

function listFiles(dir, suffix) {
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const current = stack.pop();
    for (const name of execFileSync('bash', ['-lc', `printf '%s\n' ${JSON.stringify(current)}/*`], { encoding: 'utf8' }).split('\n').filter(Boolean)) {
      if (!existsSync(name)) continue;
      const stat = statSync(name);
      if (stat.isDirectory()) stack.push(name);
      else if (!suffix || name.endsWith(suffix)) out.push(name);
    }
  }
  return out.sort();
}

function routeToHtmlFile(route) {
  const withoutQuery = route.split('?')[0].split('#')[0];
  const decoded = decodeURIComponent(withoutQuery);
  if (decoded === '/') return resolve(distRoot, 'index.html');
  if (decoded.endsWith('.html')) return resolve(distRoot, decoded.replace(/^\//, ''));
  return resolve(distRoot, decoded.replace(/^\//, ''), 'index.html');
}

function scanInternalLinks() {
  assert.equal(existsSync(distRoot), true, 'production dist must exist before CI baseline smoke');
  const htmlFiles = listFiles(distRoot, '.html');
  assert.equal(htmlFiles.length > 0, true, 'production build must contain HTML pages');

  const failures = [];
  const attrPattern = /\s(?:href|src)=(['"])(.*?)\1/g;
  const idPattern = /\sid=(['"])(.*?)\1/g;
  const htmlByRoute = new Map();
  for (const file of htmlFiles) {
    const rel = posix.normalize(file.slice(distRoot.length).replaceAll('\\', '/'));
    const route = rel === '/index.html' ? '/' : rel.replace(/\/index\.html$/, '/');
    htmlByRoute.set(route, file);
  }

  for (const file of htmlFiles) {
    const html = readFileSync(file, 'utf8');
    const ids = new Set([...html.matchAll(idPattern)].map((match) => match[2]));
    for (const match of html.matchAll(attrPattern)) {
      const raw = match[2].trim();
      if (!raw || raw.startsWith('#') || raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('mailto:') || raw.startsWith('tel:') || raw.startsWith('data:')) continue;
      if (raw.startsWith('/_astro/') || raw.startsWith('/favicon') || raw.startsWith('/robots.txt') || raw.startsWith('/sitemap')) continue;
      if (!raw.startsWith('/')) continue;

      const targetPath = raw.split('?')[0].split('#')[0];
      const extension = posix.extname(targetPath);
      if (extension && extension !== '.html') {
        const assetFile = resolve(distRoot, targetPath.replace(/^\//, ''));
        if (!existsSync(assetFile)) failures.push(`${file.slice(root.length + 1)} has broken internal asset: ${raw}`);
        continue;
      }

      const targetFile = routeToHtmlFile(raw);
      if (!existsSync(targetFile)) {
        failures.push(`${file.slice(root.length + 1)} has broken internal link: ${raw}`);
        continue;
      }

      const fragment = raw.includes('#') ? raw.split('#')[1] : '';
      if (fragment) {
        const targetHtml = readFileSync(targetFile, 'utf8');
        const targetIds = targetFile === file ? ids : new Set([...targetHtml.matchAll(idPattern)].map((m) => m[2]));
        if (!targetIds.has(fragment)) failures.push(`${file.slice(root.length + 1)} links to missing fragment: ${raw}`);
      }
    }
  }

  if (failures.length) fail('Internal link smoke failed', failures);
  return htmlFiles.length;
}

function scan404() {
  const file = resolve(root, notFoundPath);
  assert.equal(existsSync(file), true, `${notFoundPath} must exist`);
  const html = readFileSync(file, 'utf8');
  assert.match(html, /noindex/i, '404 page must include noindex');
  assert.match(html, /href="\/"|href='\/'/, '404 page must link back to a working route');
}

function scanSecrets() {
  const tracked = execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' }).split('\n').filter(Boolean);
  const findings = [];
  const assignmentPattern = /(?:api[_-]?key|access[_-]?token|auth[_-]?token|private[_-]?key|password|passwd|secret)\s*[:=]\s*(['"])([^'"\s]{16,})\1/ig;
  const privateKeyPattern = /-----BEGIN (?:RSA |DSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/i;
  // This CI secret scan is intentionally deterministic: private-key blocks and explicit
  // credential assignments fail the build. Generic high-entropy scanning is avoided here
  // because this repository intentionally stores hashes, minified legacy exports, and
  // visual baseline SHA-256 values that otherwise create noisy false positives.

  for (const rel of tracked) {
    if (ignoredTrackedPaths.has(rel)) continue;
    const ext = rel.includes('.') ? rel.slice(rel.lastIndexOf('.')).toLowerCase() : '';
    if (ignoredExtensions.has(ext)) continue;
    const file = resolve(root, rel);
    let text;
    try { text = readFileSync(file, 'utf8'); } catch { continue; }
    const lines = text.split(/\r?\n/);
    lines.forEach((line, index) => {
      if (privateKeyPattern.test(line) || assignmentPattern.test(line)) findings.push(`${rel}:${index + 1}`);
    });
  }

  if (findings.length) fail('Potential secret scan findings (values redacted)', [...new Set(findings)]);
  return tracked.length;
}

const pageCount = scanInternalLinks();
scan404();
const scannedFiles = scanSecrets();
console.log(`KIBER-20 CI baseline smoke passed: ${pageCount} HTML pages link-checked, ${notFoundPath} verified, ${scannedFiles} tracked files secret-scanned.`);
