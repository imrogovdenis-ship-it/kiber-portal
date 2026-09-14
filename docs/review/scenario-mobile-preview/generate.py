from pathlib import Path
from bs4 import BeautifulSoup
ROOT=Path(__file__).parent
BASE='/preview/scenario-mobile/'
for variant in ['a','b','c']:
 soup=BeautifulSoup((ROOT/'baseline.html').read_text(),'html.parser')
 main=soup.find('main');article=main.select_one('article.humanoid-template')
 for node in list(article.find_all(recursive=False)):
  if node.name=='section' and any(c in node.get('class',[]) for c in ['humanoid-template__hero','humanoid-template__scenarios']):continue
  node.decompose()
 soup.body['data-scenario-proposal']=variant
 soup.title.string='Мобильные сценарии — вариант '+variant.upper()
 for node in soup.select('link[rel=canonical],script[type="application/ld+json"]'):node.decompose()
 for node in soup.select('meta[name=robots]'):node['content']='noindex, nofollow'
 for node in soup.select('script[src*="analytics-provider"]'):node['data-production']='false'
 css=soup.new_tag('link',rel='stylesheet',href=BASE+'variants.css?v=2');soup.head.append(css)
 section=soup.select_one('.humanoid-template__scenarios');section['id']='scenario-preview'
 nav=BeautifulSoup('<nav class="proposal-tabs container" aria-label="Варианты мобильного слайдера">'+''.join('<a href="'+BASE+x+'/#scenario-preview"'+(' aria-current="page"' if x==variant else '')+'>'+x.upper()+'</a>' for x in ['a','b','c'])+'<span>Только тест · вариант '+variant.upper()+'</span></nav>','html.parser');section.insert(0,nav)
 strip=section.select_one('.humanoid-template__scenario-strip')
 for img in strip.select('img'):img['loading']='eager'
 if variant=='b':
  hint=BeautifulSoup('<p class="proposal-hint container">Листайте сценарии →</p>','html.parser');strip.insert_before(hint)
  dots=BeautifulSoup('<div class="proposal-progress container" aria-label="Выбор сценария">'+''.join('<button type="button" data-proposal-slide="'+str(i)+'" aria-label="Сценарий '+str(i+1)+'"'+(' aria-current="true"' if i==0 else '')+'><span></span></button>' for i in range(4))+'</div>','html.parser');strip.insert_after(dots)
 if variant=='c':
  hint=BeautifulSoup('<p class="proposal-hint container">Можно листать пальцем или стрелками</p>','html.parser');strip.insert_before(hint)
 script=soup.new_tag('script',src=BASE+'variants.js?v=1',defer=True);soup.body.append(script)
 dest=ROOT/'site'/variant/'index.html';dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(str(soup))
(ROOT/'site/index.html').write_text((ROOT/'site/a/index.html').read_text())
