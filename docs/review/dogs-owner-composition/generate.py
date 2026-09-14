from pathlib import Path
from bs4 import BeautifulSoup
from copy import deepcopy
import json,hashlib
R=Path(__file__).parent;OUT=R/'site';BASE='/preview/dogs-owner-composition/'
soup=BeautifulSoup((R/'baseline.html').read_text(),'html.parser');reference=BeautifulSoup((R/'product-reference.html').read_text(),'html.parser')
article=soup.select_one('main > article');sections=article.find_all('section',recursive=False)
hero=article.select_one('.humanoid-template__hero');intro=article.select_one('.humanoid-template__text');quotes=article.select('.humanoid-template__gosha-intro');guide=article.select_one('.humanoid-template__guide');scenarios=article.select_one('.humanoid-template__scenarios');catalog=article.select_one('#catalog');faq=next(x for x in sections if x.select_one('details'));cta=article.select_one('.humanoid-template__cta');blog=next(x for x in sections if x.select_one('h2') and x.select_one('h2').get_text(strip=True)=='Блог Кибер Гоши');compilations=article.select_one('.humanoid-template__bottom-compilations')
featured=deepcopy(reference.select_one('#productCard'));featured['id']='catalog';featured['class']=list(dict.fromkeys(featured['class']+['article-blocks']));featured.attrs.pop('aria-labelledby',None);featured['aria-label']='Три модели роботов-собак';featured.select_one('.article-blocks__section-head').decompose()
model_template=deepcopy(featured.select_one('.article-blocks__featured-model'));featured.select_one('.article-blocks__featured-model').decompose();models=[]
for index,card in enumerate(catalog.select('a.robot-card')):
 name=card.select_one('h3').get_text(strip=True);m=deepcopy(model_template);title=m.select_one('h3');title.string=name;title['id']='featured-dog-'+str(index);m['aria-labelledby']=title['id']
 for a in m.select('a'):
  a['href']=card['href']
  if a.has_attr('aria-label'):a['aria-label']='Перейти на страницу '+name
 img=m.select_one('img');source=card.select_one('img');img['src']=source['src'];img['alt']=source['alt']
 for dest,src in [('.article-blocks__featured-category','.robot-card__category'),('.article-blocks__featured-price','.robot-card__price'),('.article-blocks__featured-description','.robot-card__description')]:m.select_one(dest).string=card.select_one(src).get_text(' ',strip=True)
 featured.append(m);models.append({'name':name,'href':card['href'],'price':card.select_one('.robot-card__price').get_text(' ',strip=True)})
catalog['id']='catalog-repeat'
order=[hero,intro,featured,quotes[0],guide,scenarios,quotes[1],catalog,faq,cta,blog,compilations]
# Refuse a changed baseline instead of silently dropping an unknown section.
assert {id(x) for x in sections} == {id(x) for x in order if x is not featured} | {id(article.select_one('.humanoid-template__gallery'))}
for n in order:
 if n.parent:n.extract()
article.clear()
for n in order:article.append(n)
# Reuse the exact emitted styles of the existing approved one-product renderer.
for css in reference.select('link[rel=stylesheet]'):
 if 'ArticleBlocksTemplate.' in css['href']:soup.head.append(deepcopy(css))
for n in soup.select('link[rel=canonical],script[type="application/ld+json"],form,noscript'):n.decompose()
allowed=['/scripts/site-header.js','/scripts/home-image-cards-slider.js','/scripts/robot-card-gallery.js']
for n in soup.select('script[src]'):
 if not any(x in n['src'] for x in allowed):n.decompose()
if not soup.select('script[src*="robot-card-gallery"]'):soup.body.append(soup.new_tag('script',src='/scripts/robot-card-gallery.js?v=mobile-shared-1',defer=True))
for a in soup.select('a[href]'):
 h=a['href']
 if h.startswith(('tel:','mailto:','#contact','/contacts/','/lead/')) or (h.startswith('http') and not any(host in h for host in ['www.kiber-portal.ru','jino-preview.kiber-portal.ru'])):a['href']='#preview-inquiry'
 elif h.startswith('https://www.kiber-portal.ru'):a['href']=h.replace('https://www.kiber-portal.ru','https://jino-preview.kiber-portal.ru')
for n in soup.select('meta[name=robots]'):n.decompose()
soup.head.append(soup.new_tag('meta',attrs={'name':'robots','content':'noindex, nofollow'}))
soup.head.append(soup.new_tag('link',rel='stylesheet',href=BASE+'preview.css'))
soup.body.append(BeautifulSoup('<dialog id="preview-inquiry"><h2>Техническое превью</h2><p>Здесь проверяем страницу. Заявки не отправляются.</p><button type="button" data-preview-close>Вернуться к просмотру</button></dialog>','html.parser'))
soup.body.append(soup.new_tag('script',src=BASE+'preview.js',defer=True))
OUT.mkdir(exist_ok=True);(OUT/'index.html').write_text(str(soup));(R/'models.json').write_text(json.dumps(models,ensure_ascii=False,indent=2))
