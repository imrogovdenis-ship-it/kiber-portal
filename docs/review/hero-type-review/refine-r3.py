from pathlib import Path
import sys,html
sys.path.insert(0,'/home/alex/.hermes/state/kiber-scenario-mobile-preview/vendor')
from bs4 import BeautifulSoup
P=Path(__file__).parent;O=P/'site';B='/preview/hero-type-review/'
for n in ['article','compilation']:
 d=BeautifulSoup((O/(n+'-a.html')).read_text(),'html.parser');d.body.attrs.pop('data-rv-type',None);d.main.attrs.pop('data-rv-content',None);d.body['data-rv-headings']='a'
 for x in d.select('[data-rv-role]'):del x['data-rv-role']
 for x in d.select('link[rel=stylesheet]'):
  if 'typography.css' in x.get('href',''):x.decompose()
 hero=d.select_one('[data-block-id=hero]');h=hero.h1.extract();lead=hero.select_one('[class$=__lead]').extract();image=hero.img.extract();image['src']=B+n+'.webp';image['class']=['rv-overlay-image'];image['loading']='eager'
 sec=d.new_tag('section',attrs={'class':'rv-overlay-hero','id':'hero','data-block-id':'hero','aria-labelledby':'page-title'});sec.append(image);inner=d.new_tag('div',attrs={'class':'rv-overlay-inner'});copy=d.new_tag('div',attrs={'class':'rv-overlay-copy'});copy.append(h);copy.append(lead)
 anchor='#featured-dogs' if n=='compilation' else '#catalogBlock'
 copy.append(BeautifulSoup('<div class="rv-overlay-actions"><a class="rv-overlay-button" href="/lead/request/">Оставить заявку</a><a class="rv-overlay-button" href="'+anchor+'">Смотреть модели</a></div>','html.parser'));inner.append(copy);sec.append(inner);hero.replace_with(sec)
 d.head.append(BeautifulSoup('<link rel="stylesheet" href="'+B+'overlay-r3.css"><link rel="stylesheet" href="'+B+'headings-a-only-r3.css">','html.parser'));d.title.string=('Статья' if n=='article' else 'Подборка')+' — Hero поверх фото + заголовки A · R3'
 d.select_one('.rv-bar').replace_with(BeautifulSoup('<aside class="rv-bar"><b>R3 · HERO ПОВЕРХ ФОТО · ТОЛЬКО ЗАГОЛОВКИ A</b><nav><a href="'+B+'compilation-overlay.html">Подборка</a><a href="'+B+'article-overlay.html">Статья</a><a href="'+B+n+'-photo-first.html">Предыдущий Hero</a></nav></aside>','html.parser'));(O/(n+'-overlay.html')).write_text(str(d))
