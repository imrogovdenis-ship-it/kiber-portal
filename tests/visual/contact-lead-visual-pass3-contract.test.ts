import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path: string) => readFileSync(path, 'utf8');
const json = (path: string) => JSON.parse(read(path));

test('KIBER visual pass 3 covers thanks, category and footer routes without live routing', () => {
  assert.equal(existsSync('data/review/contact-lead-visual-pass3.json'), true, 'pass 3 registry missing');
  const registry = json('data/review/contact-lead-visual-pass3.json');
  assert.equal(registry.issue, 'KIBER-contact-lead-visual-pass3');
  assert.equal(registry.safety.productionDeployChanged, false);
  assert.equal(registry.safety.dnsChanged, false);
  assert.equal(registry.safety.secretsChanged, false);
  assert.equal(registry.safety.analyticsProviderChanged, false);
  assert.equal(registry.safety.liveLeadRoutingChanged, false);
  assert.deepEqual(registry.routes.map((route: { path: string }) => route.path), [
    '/lead/thanks/',
    '/roboty-gumanoidy/',
    '/roboty-sobaki/',
    '/contacts/',
  ]);
  assert.equal(registry.summary.routesChecked, 4);
  assert.equal(registry.summary.viewportsChecked, 3);
  assert.equal(registry.summary.blockingDefects, 0);
});

test('visual pass 3 is documented, screenshot-backed and wired into CI', () => {
  assert.equal(existsSync('docs/review/contact-lead-visual-pass3/README.md'), true);
  assert.equal(existsSync('docs/review/contact-lead-visual-pass3/screenshots/manifest.json'), true);
  const doc = read('docs/review/contact-lead-visual-pass3/README.md');
  assert.match(doc, /\/lead\/thanks\//);
  assert.match(doc, /\/roboty-gumanoidy\//);
  assert.match(doc, /\/roboty-sobaki\//);
  assert.match(doc, /Footer/);
  assert.match(doc, /live lead routing remains disabled/i);
  const manifest = json('docs/review/contact-lead-visual-pass3/screenshots/manifest.json');
  assert.equal(manifest.screenshots.length, 12);
  assert.ok(manifest.contactSheets.length >= 3);
  for (const shot of manifest.screenshots) {
    assert.equal(existsSync(shot.file), true, `${shot.file} missing`);
    assert.match(shot.sha256, /^[a-f0-9]{64}$/);
  }
  const pkg = json('package.json');
  assert.equal(pkg.scripts['test:contact-lead-visual-pass3'], 'node scripts/contact-lead-visual-pass3-smoke.mjs');
  assert.match(pkg.scripts.ci, /npm run test:contact-lead-visual-pass3/);
});
