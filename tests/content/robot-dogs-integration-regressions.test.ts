// @ts-nocheck
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync,readdirSync} from 'node:fs';
import {getRobotDogsPreviewArticles,getRobotDogsPreviewCompilation} from '../../src/lib/robot-dogs-preview-adapter';
const root=process.cwd();
const packages=readdirSync(root+'/data/content-inbox/dogs-approved').filter(n=>n.endsWith('.json')).map(n=>JSON.parse(readFileSync(root+'/data/content-inbox/dogs-approved/'+n,'utf8')));
test('all original checkpoint sentences survive adapter as visible text',()=>{for(const a of getRobotDogsPreviewArticles()){const p=packages.find(p=>p.slug===a.slug);const b=a.articleContent.orderedPackageBlocks.find(b=>b.id==='checkpointList');for(const original of p.blocks.checkpointList.items)assert(b.items.some(i=>i.title===original||i.text===original),a.slug+': '+original);}});
test('shared CTA retains messenger popup and lead form distinction',()=>{for(const a of [...getRobotDogsPreviewArticles(),getRobotDogsPreviewCompilation()]){assert.equal(a.finalCta.primaryCta.href,'#contact-messengers');assert.equal(a.finalCta.secondaryCta.href,'/lead/request/');}});
test('AI summaries match approved source field',()=>{for(const a of getRobotDogsPreviewArticles()){const p=packages.find(p=>p.slug===a.slug);assert.equal(a.aiSummary,p.aiVisibility.aiSummary);}});
test('old article navigation remains launch registry based',()=>{const t=readFileSync(root+'/src/components/templates/ApprovedArticle5.astro','utf8');assert.match(t,/cards=\{isPackageArticle \? template.relatedArticles.cards : launchArticles.cards\}/);assert.match(t,/cards=\{isPackageArticle \? template.relatedCompilations.cards : launchCompilations.cards\}/);});
