import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';

const root = process.cwd();

async function read(path: string) {
  return readFile(resolve(root, path), 'utf8');
}

test('KIBER-52 defines approved internal links separately from generated proposals', async () => {
  assert.equal(existsSync(resolve(root, 'data/seo/internal-links.json')), true, 'approved internal link registry required');
  const registry = JSON.parse(await read('data/seo/internal-links.json'));

  assert.equal(registry.schemaVersion, 1);
  assert.equal(registry.issue, 'KIBER-52');
  assert.equal(registry.autoPublishGenerated, false);
  assert.deepEqual(registry.allowedStatuses, ['approved', 'generated_needs_review', 'rejected', 'disabled']);
  assert.ok(registry.policy.maxLinksPerPage <= 3, 'internal linking must stay non-aggressive');
  assert.ok(registry.links.length >= 6, 'approved launch links should cover the current MVP routes');

  for (const link of registry.links) {
    assert.equal(link.status, 'approved', `${link.id}: rendered registry only contains approved links`);
    assert.equal(link.publicRender, true, `${link.id}: approved links render publicly`);
    assert.match(link.id, /^[a-z0-9-]+-to-[a-z0-9-]+$/);
    assert.match(link.sourceRoute, /^\//);
    assert.match(link.targetRoute, /^\//);
    assert.ok(link.anchor.trim().length > 0, `${link.id}: anchor required`);
    assert.ok(link.reason.trim().length > 0, `${link.id}: reason required`);
  }

  const proposals = JSON.parse(await read('data/seo/internal-link-proposals.json'));
  assert.equal(proposals.autoPublish, false, 'KIBER-79 generated proposals remain review-only');
  assert.ok(proposals.proposals.every((proposal: { status: string; publicRender: boolean }) => proposal.status === 'generated_needs_review' && proposal.publicRender === false));
});

test('KIBER-52 exposes curated internal links through a reusable renderer and CI gate', async () => {
  assert.equal(existsSync(resolve(root, 'src/lib/internal-links.ts')), true, 'internal link loader required');
  assert.equal(existsSync(resolve(root, 'src/components/content/InternalLinks.astro')), true, 'InternalLinks component required');
  assert.equal(existsSync(resolve(root, 'scripts/internal-links-rendering-smoke.mjs')), true, 'rendered internal-link smoke required');

  const pkg = JSON.parse(await read('package.json'));
  assert.equal(pkg.scripts['test:internal-link-rendering'], 'node scripts/internal-links-rendering-smoke.mjs');
  assert.match(pkg.scripts.ci, /npm run test:internal-link-rendering/);

  const loader = await read('src/lib/internal-links.ts');
  assert.match(loader, /getApprovedInternalLinksForRoute/);
  assert.match(loader, /autoPublishGenerated/);
  assert.match(loader, /generated_needs_review/);

  const component = await read('src/components/content/InternalLinks.astro');
  assert.match(component, /data-internal-link-id/);
  assert.match(component, /aria-label/);

  for (const page of ['src/pages/articles.astro', 'src/pages/news.astro', 'src/pages/compilations.astro', 'src/pages/roboty-gumanoidy.astro', 'src/pages/roboty-sobaki.astro', 'src/pages/contacts.astro', 'src/pages/robots/[slug].astro']) {
    const source = await read(page);
    assert.match(source, /InternalLinks/, `${page}: should render curated internal links`);
  }
});
