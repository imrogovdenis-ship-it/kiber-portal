import test from 'node:test';
import assert from 'node:assert/strict';
import {getRobotDogsPreviewArticles} from '../../src/lib/robot-dogs-preview-adapter';
import {homeCompilations} from '../../src/data/home-live';
test('article compilation cards preserve homepage identity and four plus index contract',()=>{
 for(const a of getRobotDogsPreviewArticles()) {
  const cards=a.relatedCompilations.cards;
  assert.equal(cards.length,5,a.slug);
  assert.equal(cards[4].href,'/compilations/');
  for(const c of cards) {
   const ref=homeCompilations.cards.find(x=>x.title===c.title);
   assert.ok(ref,c.title); assert.deepEqual(c.image,ref.image);
  }
 }
});

import {getRobotDogsPreviewCompilation} from '../../src/lib/robot-dogs-preview-adapter';
test('compilation uses real varied gallery and four illustrated scenarios',()=>{
 const c=getRobotDogsPreviewCompilation();
 assert.ok(c.gallery.images.length>=6);
 assert.equal(new Set(c.gallery.images.map(x=>x.src)).size,c.gallery.images.length);
 assert.equal(c.scenarios.items.length,4);
 assert.equal(new Set(c.scenarios.items.map(x=>x.image.src)).size,4);
 for(const x of [...c.gallery.images,...c.scenarios.items.map(x=>x.image)]) assert.ok(x.src.startsWith('/images/kiber-94-preview/'));
});

test('recommendations use four robots except the three-dog comparison and six other articles',()=>{
 for(const a of getRobotDogsPreviewArticles()) {
  assert.equal(a.robots.length,a.slug==='sravnenie-robosobak-dlya-meropriyatiy'?3:4,a.slug);
  assert.equal(a.relatedArticles.cards.length,6,a.slug);
  assert.equal(new Set(a.relatedArticles.cards.map(x=>x.href)).size,6);
  assert.ok(a.relatedArticles.cards.every(x=>x.href!==a.seo.canonical));
 }
 assert.equal(getRobotDogsPreviewCompilation().relatedArticles.cards.length,6);
});

test('exhibition article adds two gallery photos per featured robot',()=>{
 const a=getRobotDogsPreviewArticles().find(x=>x.slug==='robot-stendist-dlya-vystavki')!;
 const images=a.articleContent?.gallery?.images ?? [];
 assert.equal(images.length,6);
 for(const slug of ['arenda-unitree-g1','arenda-promobot-v4','arenda-unitree-go2']) assert.equal(images.filter(x=>x.src.includes(slug+'__')).length,2);
});

test('school headings identify the educational question and Go2 catalog includes humanoid context',()=>{
 const school=getRobotDogsPreviewArticles().find(x=>x.slug==='robot-dlya-nauchnogo-shou-i-shkoly')!;
 assert.match(school.articleContent!.seoIntro!.title!,/робот/);
 const go2=getRobotDogsPreviewArticles().find(x=>x.slug==='unitree-go2-na-meropriyatii')!;
 assert.doesNotMatch(go2.articleContent!.catalog!.title!,/другие роботы-собаки/);
});

test('dog scenarios opt into photo-gallery presentation without changing video collections',()=>{
 assert.equal(getRobotDogsPreviewCompilation().scenarios.presentation,'photo-gallery');
});

test('scenario photos reserve real intrinsic dimensions before lazy loading', () => {
 const c = getRobotDogsPreviewCompilation();
 for (const s of c.scenarios.items) { assert.ok(s.image.width > 0); assert.ok(s.image.height > 0); }
});
