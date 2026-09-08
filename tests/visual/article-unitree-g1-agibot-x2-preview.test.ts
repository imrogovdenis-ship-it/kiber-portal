import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const data = readFileSync('src/lib/kiber94-article-unitree-g1-agibot-x2-data.ts', 'utf8');
const component = readFileSync('src/components/templates/ArticleBlocksTemplate.astro', 'utf8');
const sliderScript = readFileSync('public/scripts/robot-card-gallery.js', 'utf8');


test('article #1 latest owner visual feedback is encoded in source contracts', () => {
  assert.match(sliderScript, /querySelectorAll\('\[data-drag-slider\]'\)\.forEach\(setupSlider\)/);
  assert.doesNotMatch(sliderScript, /data-drag-slider\^=/);
  assert.match(component, /article-blocks h1 \{ max-width: 15ch; font-size: clamp\(2\.25rem, 4\.4vw, 4\.65rem\); line-height: 1; \}/);
  assert.match(component, /article-blocks__featured-grid \{ display: grid; grid-template-columns: 1fr; gap: clamp\(1\.25rem, 2\.4vw, 2rem\); \}/);
  assert.match(data, /title: 'Подборки роботов для аренды'/);
  assert.doesNotMatch(data, /Посмотреть классы роботов/);
});


test('article #1 gallery keeps robot-prefixed slider id for cached/reference drag script compatibility', () => {
  assert.match(data, /sliderId: 'robot-unitree-g1-agibot-x2-gallery'/);
  assert.doesNotMatch(data, /sliderId: 'unitree-g1-agibot-x2-gallery'/);
  assert.match(component, /data-drag-slider=\{gallerySliderId\}/);
  assert.match(component, /data-slider-prev=\{`\[data-drag-slider='\$\{gallerySliderId\}'\]`\}/);
  assert.match(sliderScript, /mousedown/);
  assert.match(sliderScript, /scrollLeft = startScroll - dx/);
});


test('owner approval record for article #1 is scoped and keeps launch gates closed', () => {
  const approval = JSON.parse(readFileSync('docs/review/kiber-article-unitree-g1-agibot-x2-20260908/owner-approval.json', 'utf8'));
  assert.equal(approval.status, 'approved');
  assert.equal(approval.approvalType, 'visual_content_owner_review');
  assert.equal(approval.scope.pullRequest, 'https://github.com/imrogovdenis-ship-it/kiber-portal/pull/81');
  assert.equal(approval.scope.previewRoute, '/preview/kiber-94/articles/unitree-g1-agibot-x2-kakogo-robota-vybrat/');
  assert.equal(approval.verificationBeforeApproval.ownerConfirmedGalleryDragWorks, true);
  for (const boundary of ['PR merge', 'production deploy', 'DNS/cutover', 'public route replacement/canonical launch', 'mass generation of other articles']) {
    assert.ok(approval.notApprovedByThisRecord.includes(boundary), `${boundary} must remain excluded`);
  }
  assert.equal(approval.safety.productionDeployChanged, false);
  assert.equal(approval.safety.dnsChanged, false);
  assert.equal(approval.safety.secretsChanged, false);
  assert.equal(approval.safety.liveLeadRoutingChanged, false);
});
