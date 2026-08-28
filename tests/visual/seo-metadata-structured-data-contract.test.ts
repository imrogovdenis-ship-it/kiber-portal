import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';

const root = process.cwd();

test('KIBER-51 exposes rendered SEO metadata smoke as a CI gate', async () => {
  const scriptPath = resolve(root, 'scripts/seo-metadata-structured-data-smoke.mjs');
  assert.equal(existsSync(scriptPath), true, 'rendered SEO metadata smoke script is required');

  const script = await readFile(scriptPath, 'utf8');
  assert.match(script, /canonical/);
  assert.match(script, /og:title/);
  assert.match(script, /twitter:title/);
  assert.match(script, /application\/ld\+json/);
  assert.match(script, /BreadcrumbList/);
  assert.match(script, /Organization/);
  assert.match(script, /WebSite/);

  const packageJson = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'));
  assert.equal(packageJson.scripts['test:seo-metadata'], 'node scripts/seo-metadata-structured-data-smoke.mjs');
  assert.match(packageJson.scripts.ci, /npm run test:seo-metadata/);
});

test('KIBER-51 BaseLayout supports page-level JSON-LD and absolute social metadata', async () => {
  const layout = await readFile(resolve(root, 'src/layouts/BaseLayout.astro'), 'utf8');
  const seoHead = await readFile(resolve(root, 'src/components/layout/SeoHead.astro'), 'utf8');

  assert.match(layout, /jsonLd\?:/);
  assert.match(layout, /<script type="application\/ld\+json"/);
  assert.match(seoHead, /twitter:title/);
  assert.match(seoHead, /twitter:description/);
  assert.match(seoHead, /twitter:url/);
  assert.match(seoHead, /twitter:image/);
  assert.match(seoHead, /og:site_name/);
  assert.match(seoHead, /absoluteImage/);
});

test('KIBER-51 launch pages declare explicit page schemas', async () => {
  const home = await readFile(resolve(root, 'src/pages/index.astro'), 'utf8');
  const robot = await readFile(resolve(root, 'src/pages/robots/[slug].astro'), 'utf8');
  const contacts = await readFile(resolve(root, 'src/pages/contacts.astro'), 'utf8');

  assert.match(home, /organizationJsonLd/);
  assert.match(home, /websiteJsonLd/);
  assert.match(robot, /serviceJsonLd/);
  assert.match(robot, /breadcrumbs=\{breadcrumbs\}/);
  const breadcrumbs = await readFile(resolve(root, 'src/components/layout/Breadcrumbs.astro'), 'utf8');
  assert.match(breadcrumbs, /breadcrumbJsonLd/);
  assert.match(breadcrumbs, /application\/ld\+json/);
  assert.match(contacts, /contactPageJsonLd/);
});
