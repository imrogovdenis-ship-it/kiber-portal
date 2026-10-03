from pathlib import Path
from bs4 import BeautifulSoup
from copy import deepcopy
import html,json
ROOT=Path(__file__).parent;OUT=ROOT/'site';BASE='/preview/compilation-ux/'
ROLES={
'Unitree Go2':('Промо, встреча гостей и фото','promo'),
'Xiaomi Cyberdog 2':('Живоподобный образ, съёмки и короткие программы','show'),
'Inchbot L1-W EDU':('Технические демонстрации и знакомство с робототехникой','edu'),
'Unitree G1':('Встреча гостей, фото и подготовленные выступления','show'),
'Unitree R1':('Короткие динамичные показы','show'),
'Unitree H2':('Крупная сцена и выразительный масштаб','show'),
'Agibot X2':('Выступления под музыку и съёмки','show'),
'Noetix Bumi':('Компактный робот для знакомства и фото','show'),
'Арди':('Подготовленные диалоги и интервью','talk'),
'София':('Интервью и разговоры о технологиях по сценарию','talk')}
def frag(s):return BeautifulSoup(s,'html.parser')
def add_after(node,s):node.insert_after(frag(s))
def action(text,href='#catalog'):return '<a class="ux-button" href="'+href+'">'+text+'</a>'
def shortcuts(models,title,mode='b'):
 cards=''
 for i,m in enumerate(models):
  role,tag=ROLES[m['name']];cards+='<a class="ux-choice" data-task="'+tag+'" href="'+m['href']+'"><img src="'+m['image']+'" alt="'+html.escape(m['name'])+'" width="320" height="320" loading="lazy"><div><h3>'+m['name']+'</h3><p>'+role+'</p><strong>'+m['price']+'</strong><span>О модели →</span></div></a>'
 return '<section class="container ux-overview" id="quick-models"><p class="ux-eyebrow">ВЫБОР МОДЕЛИ</p><h2>'+title+'</h2><p>Узнайте робота по фото или начните с его роли. Стоимость — ориентир; программу, длительность и итоговую смету уточняет менеджер.</p>'+('<div class="ux-filters" role="group" aria-label="Фильтр моделей">'+''.join('<button type="button" data-filter="'+v+'" aria-pressed="'+('true' if v=='all' else 'false')+'">'+t+'</button>' for v,t in ([('all','Все модели'),('promo','Промо и гости'),('show','Образ и съёмки'),('edu','Наука и обучение')] if len(models)==3 else [('all','Все модели'),('show','Движение, шоу и фото'),('talk','Подготовленное общение')]))+'</div><p class="ux-filter-status" aria-live="polite">Показаны все модели</p>' if mode=='c' else '')+'<div class="ux-choice-grid">'+cards+'</div></section>'
for slug in ['roboty-sobaki','roboty-gumanoidy']:
 baseline=BeautifulSoup((ROOT/(slug+'.html')).read_text(),'html.parser');models=[]
 for a in baseline.select('#catalog a.robot-card'):
  models.append(dict(name=a.select_one('h3').get_text(strip=True),price=a.select_one('.robot-card__price').get_text(' ',strip=True),href=a['href'],image=a.select_one('img')['src']))
 for v in ['a','b','c']:
  soup=deepcopy(baseline);soup.body['data-ux-variant']=v;article=soup.select_one('main > article');hero=article.select_one('.humanoid-template__hero');catalog=article.select_one('#catalog');gallery=article.select_one('.humanoid-template__gallery');guide=article.select_one('.humanoid-template__guide');cta=article.select_one('.humanoid-template__cta');faq=next(n for n in article.find_all('section',recursive=False) if n.select_one('details'))
  for n in soup.select('link[rel="canonical"],script[type="application/ld+json"]'):n.decompose()
  for n in soup.select('script[src]'):
   if not any(x in n['src'] for x in ['/scripts/site-header.js','/scripts/home-image-cards-slider.js','/scripts/robot-card-gallery.js']):n.decompose()
  for n in soup.select('form,noscript'):n.decompose()
  for a in soup.select('a[href]'):
   h=a['href']
   if h.startswith(('tel:','mailto:','#contact','/contacts/','/lead/')) or (h.startswith('http') and not any(host in h for host in ['www.kiber-portal.ru','jino-preview.kiber-portal.ru'])):a['href']='#ux-inquiry'
   elif h.startswith('https://www.kiber-portal.ru'):a['href']=h.replace('https://www.kiber-portal.ru','https://jino-preview.kiber-portal.ru')
  for n in soup.select('meta[name="robots"]'):n.decompose()
  soup.head.append(soup.new_tag('meta',attrs={'name':'robots','content':'noindex, nofollow'}));soup.head.append(soup.new_tag('link',rel='stylesheet',href=BASE+'variants.css'))
  soup.title.string=('Роботы-собаки' if len(models)==3 else 'Роботы-гуманоиды')+' · вариант '+v.upper()+' · превью'
  for a in soup.select('a[href="#catalog"]'):a.string='Модели и цены'
  # Visible model identity and direct detail links, not SEO alt masquerading as a caption.
  for f in gallery.select('figure'):
   alt=f.select_one('img').get('alt','').lower();match=next((m for m in models if m['name'].lower() in alt),None)
   if match:
    f['class']=f.get('class',[])+['ux-has-caption'];cap=soup.new_tag('figcaption',attrs={'class':'ux-caption'});a=soup.new_tag('a',href=match['href']);a.string=match['name']+' · О модели →';cap.append(a);f.append(cap)
  if v=='a':
   add_after(gallery,'<div class="container ux-actions">'+action('Сравнить модели и цены')+'</div>');add_after(guide,'<div class="container ux-actions">'+action('Посмотреть модели')+action('Помочь с выбором','#ux-inquiry')+'</div>');catalog.insert_after(cta.extract())
  if v=='b':
   overview=frag(shortcuts(models,'Три робособаки — три разные роли' if len(models)==3 else 'Семь моделей: найдите своего гуманоида'));hero.insert_after(overview)
   for a in hero.select('a[href="#catalog"]'):a['href']='#quick-models'
   # Preserve the detailed material, but follow early choice with evidence and guide.
   gallery.extract();article.select_one('#quick-models').insert_after(gallery);guide.extract();gallery.insert_after(guide)
   add_after(guide,'<div class="container ux-actions">'+action('Подробный каталог')+action('Помочь с выбором','#ux-inquiry')+'</div>');catalog.insert_after(cta.extract())
  if v=='c':
   # New chooser-first journey: no generic gallery, no long pre-catalog lesson.
   quote=article.select_one('.humanoid-template__gosha-intro');keep=[hero,quote,faq,cta]
   for node in list(article.children):
    if getattr(node,'name',None) and node not in keep:node.decompose()
   hero.select_one('.humanoid-template__hero-image').decompose()
   hero.select_one('h1').string='Какой робот-собака нужен вашему событию?' if len(models)==3 else 'Найдите своего робота-гуманоида'
   ps=hero.find_all('p');ps[-1].string='Выбирайте по внешности, задаче и бюджету. Здесь — реальные модели КИБЕР ПОРТАЛ: откройте понравившуюся или попросите помочь с выбором.'
   for a in hero.select('a[href="#catalog"]'):a['href']='#quick-models';a.string='Выбрать робота'
   hero.insert_after(frag(shortcuts(models,'Сначала робот. Затем — ваша программа.',mode='c')))
   article.select_one('#quick-models').insert_after(frag('<section class="container ux-next"><p class="ux-eyebrow">ОТ ИДЕИ К МЕРОПРИЯТИЮ</p><h2>Робот понравился. Что дальше?</h2><div class="ux-steps"><div><b>01</b><h3>Расскажите о событии</h3><p>Дата, город, аудитория и впечатление, которое хотите создать.</p></div><div><b>02</b><h3>Обсудим роль и площадку</h3><p>Согласуем действия выбранной модели, пространство и формат участия.</p></div><div><b>03</b><h3>Получите расчёт</h3><p>Проверим доступность и подготовим смету с учётом программы и логистики.</p></div></div>'+action('Обсудить моё мероприятие','#ux-inquiry')+'</section>'))
  # Preview switcher is outside the customer-facing page concept.
  bar='<nav class="ux-review container" aria-label="Сравнение вариантов"><strong>Тест · '+('Робособаки' if len(models)==3 else 'Гуманоиды')+'</strong>'+''.join('<a '+('aria-current="page" ' if x==v else '')+'href="'+BASE+slug+'/'+x+'/">'+x.upper()+' · '+t+'</a>' for x,t in [('a','минимум'),('b','середина'),('c','заново')])+'<a href="'+BASE+'">Все 6 вариантов</a></nav>'
  article.insert_before(frag(bar));soup.body.append(frag('<dialog id="ux-inquiry"><h2>Техническое превью</h2><p>Здесь проверяем удобство страницы. Заявки не отправляются, бронирование не создаётся.</p><button type="button" class="ux-button" data-close-demo>Вернуться к просмотру</button></dialog>'))
  soup.body.append(soup.new_tag('script',src=BASE+'variants.js',defer=True))
  dest=OUT/slug/v/'index.html';dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(str(soup))
# Comparison hub uses the same frozen layout/CSS/header/footer.
hub=BeautifulSoup((OUT/'roboty-sobaki/a/index.html').read_text(),'html.parser');main=hub.find('main');main.clear();main.append(frag('<section class="container ux-hub"><p class="ux-eyebrow">ТОЛЬКО ТЕХНИЧЕСКОЕ ПРЕВЬЮ</p><h1>Два типа роботов. Три пути к выбору.</h1><p>A — точечное улучшение текущей страницы. B — ранний обзор моделей и новая последовательность. C — визуальный выбор по задаче вместо длинного гида.</p>'+''.join('<h2>'+name+'</h2><div class="ux-actions">'+''.join(action(v.upper()+' · '+t,BASE+slug+'/'+v+'/') for v,t in [('a','Минимальные изменения'),('b','Средняя переработка'),('c','Новая концепция')])+'</div>' for slug,name in [('roboty-sobaki','Роботы-собаки'),('roboty-gumanoidy','Роботы-гуманоиды')])+'</section>'));(OUT/'index.html').write_text(str(hub))
