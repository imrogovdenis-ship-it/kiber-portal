import { chromium } from 'playwright';
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const outDir = resolve(root, 'docs/review/contact-lead-visual-pass3b/screenshots');
const port = Number(process.env.KIBER_CAPTURE_PORT || 4179);
const origin = `http://127.0.0.1:${port}`;
mkdirSync(outDir, { recursive: true });

const routes = [
  { name: 'lead-thanks', path: '/lead/thanks/' },
  { name: 'roboty-gumanoidy', path: '/roboty-gumanoidy/' },
  { name: 'roboty-sobaki', path: '/roboty-sobaki/' },
  { name: 'contacts-footer', path: '/contacts/' },
];
const viewports = [
  { name: 'mobile', width: 375, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 1200 },
];
const sha = (file) => createHash('sha256').update(readFileSync(file)).digest('hex');
const server = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1', '--directory', 'dist'], { cwd: root, stdio: 'ignore' });

const waitForServer = async () => {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(`${origin}/healthz.txt`);
      if (response.ok) return;
    } catch {}
    await new Promise((resolveWait) => setTimeout(resolveWait, 250));
  }
  throw new Error(`static capture server did not start on ${origin}`);
};

try {
  await waitForServer();
  const browser = await chromium.launch({ headless: true });
  const screenshots = [];
  for (const route of routes) {
    for (const viewport of viewports) {
      const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height }, deviceScaleFactor: 1 });
      await page.goto(`${origin}${route.path}`, { waitUntil: 'networkidle' });
      await page.locator('img').evaluateAll(async (imgs) => Promise.all(imgs.map((img) => img.decode?.().catch(() => undefined))));
      const file = resolve(outDir, `${route.name}-${viewport.name}.png`);
      await page.screenshot({ path: file, fullPage: true });
      await page.close();
      screenshots.push({ route: route.name, path: route.path, viewport: viewport.name, width: viewport.width, height: viewport.height, file: file.replace(`${root}/`, ''), sha256: sha(file) });
    }
  }
  await browser.close();

  const manifest = { issue: 'KIBER-contact-lead-visual-pass3b', generatedAt: new Date().toISOString(), routes, viewports, screenshots, contactSheets: [] };
  writeFileSync(resolve(outDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`captured ${screenshots.length} screenshots for pass 3B from ${origin}`);
} finally {
  server.kill('SIGTERM');
}
