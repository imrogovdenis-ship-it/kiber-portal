from pathlib import Path
from urllib.parse import urljoin,urlparse
import sys,re,json,hashlib,urllib.request,shutil,html
sys.path.insert(0,'/home/alex/.hermes/state/kiber-scenario-mobile-preview/vendor')
from bs4 import BeautifulSoup
STATE=Path(__file__).parent/'baseline'
OUT=Path(__file__).parent/'site';OUT.mkdir(exist_ok=True);(OUT/'assets').mkdir(exist_ok=True)
ORIGIN='https://www.kiber-portal.ru';BASE='/preview/hero-type-review/'
cache={}
def asset(url):
 url=urljoin(ORIGIN,url)
 if url in cache:return cache[url]
 ext=Path(urlparse(url).path).suffix
 name=hashlib.sha256(url.encode()).hexdigest()[:14]+ext
 dest=OUT/'assets'/name;cache[url]=BASE+'assets/'+name
 if not dest.exists():
  data=urllib.request.urlopen(url,timeout=25).read()
  if ext=='.css':
   text=data.decode();text=re.sub(r'url\(([\'\"]?)([^)\'\"]+)\1\)',lambda m:'url('+ (asset(urljoin(url,m[2])) if '.woff' in m[2] else urljoin(url,m[2])) +')' if not m[2].startswith('data:') else m[0],text);data=text.encode()
  dest.write_bytes(data)
 return cache[url]
def soup(n):return BeautifulSoup((STATE/(n+'.html')).read_text(),'html.parser')
fonts='\n'.join('@font-face{font-family:Montserrat;src:url('+asset('/fonts/montserrat/Montserrat-'+name+'.woff2')+');font-weight:'+str(weight)+';font-display:swap}' for name,weight in [('Regular',400),('Medium',500),('SemiBold',600),('Bold',700)])
(OUT/'fonts.css').write_text(fonts)
for n in ['article','compilation']:shutil.copyfile(STATE/(n+'.webp'),OUT/(n+'.webp'))
labels={'article':'Статья','compilation':'Подборка','blog':'Блог Кибер Гоши','collections':'Все подборки'}
paths={'article':'/articles/sravnenie-robosobak-dlya-meropriyatiy/','compilation':'/roboty-sobaki/','blog':'/articles/','collections':'/compilations/'}
nav=f'<a href="{BASE}hero.html">01 · Hero</a><a href="{BASE}typography.html">02 · Типографика</a>'
def shell(title,content):return f'<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>{title} — КИБЕР ПОРТАЛ · сравнение</title><link rel="stylesheet" href="{BASE}fonts.css"><link rel="stylesheet" href="{BASE}review.css"><script src="{BASE}review.js" defer></script></head><body class="rv-hub"><header class="rv-header"><a class="rv-brand" href="{BASE}hero.html">КИБЕР ПОРТАЛ <small>Дизайн-превью · R1</small></a><nav>{nav}</nav></header>{content}<footer class="rv-foot">Только сравнение дизайна. Основной сайт и главная не изменены. Выбор Hero и типографики независимы.</footer></body></html>'
hero_data={}
for n in ['article','compilation']:
 d=soup(n);sec=d.select_one('[data-block-id="hero"]');hero_data[n]={'title':sec.h1.get_text(' ',strip=True),'description':sec.select_one('[class$="__lead"]').get_text(' ',strip=True),'alt':sec.img['alt']}
(OUT.parent/'hero-data.json').write_text(json.dumps(hero_data,ensure_ascii=False,indent=2))
concepts=[('a','Большая обложка','Заголовок сверху, затем широкий кадр и описание. Изображение — главный визуальный элемент. Самый выразительный, но самый высокий Hero.'),('b','Крупный кадр рядом','Текст слева, изображению отдана большая доля ширины. Ближе к существующему виду, но без обрезки и с более спокойным заголовком.'),('c','Редакционный разворот','Общий заголовок на всю ширину, ниже — крупная картинка слева и описание справа. Баланс выразительности и высоты блока.')]
content='<main class="rv-wrap"><div class="rv-intro"><span class="rv-kicker">01 / КОМПОЗИЦИЯ</span><h1>Один Hero.<br>Два типа страниц.</h1><p>Три решения на одинаковых текстах и исходных фотографиях. В каждом контейнере только H1, изображение и описание. Кнопки действующих страниц здесь не сравниваются и на сайте не удаляются.</p><nav class="rv-tabs">'+''.join(f'<a href="#hero-{v}">{v.upper()} · {title}</a>' for v,title,_ in concepts)+'</nav></div>'
for v,title,desc in concepts:
 content+=f'<section id="hero-{v}" class="rv-concept"><div class="rv-concept-head"><span class="rv-badge">{v.upper()}</span><div><h2>{title}</h2><p>{desc}</p></div></div>'
 for n in ['compilation','article']:
  d=hero_data[n];content+=f'<p class="rv-example-label">{labels[n]} · вариант {v.upper()}</p><section class="rv-hero rv-hero--{v}" data-example="{n}-{v}"><h1>{html.escape(d["title"])}</h1><img src="{BASE}{n}.webp" alt="{html.escape(d["alt"])}" width="1600" height="900"><p>{html.escape(d["description"])}</p></section>'
 content+='</section>'
content+='<aside class="rv-note"><b>Мой выбор — C.</b> Заголовку не приходится тесниться рядом с изображением, весь кадр виден, а обложка занимает меньше высоты, чем A. Для максимального акцента на фото — A. На телефоне все варианты переходят к порядку «заголовок → картинка → описание».</aside></main>'
(OUT/'hero.html').write_text(shell('Варианты Hero',content))
# Full frozen pages: existing markup/colors/media stay intact; only isolated type roles change.
for variant in ['a','b']:
 for n in labels:
  d=soup(n)
  for x in d.select('script, noscript, link[rel="canonical"],meta[property^="og:"],meta[name="robots"]'):x.decompose()
  for x in d.select('link[rel="stylesheet"]'):x['href']=asset(x['href'])
  for x in d.find_all(True):
   for attr in list(x.attrs):
    if attr.startswith('data-analytics') or attr.startswith('on'):del x[attr]
   for attr in ['src','poster']:
    if x.get(attr) and x[attr].startswith('/'):x[attr]=urljoin(ORIGIN,x[attr])
   if x.get('style'):x['style']=re.sub(r'url\(([\'\"]?)(/[^)\'\"]+)\1\)',lambda m:'url('+ORIGIN+m[2]+')',x['style'])
   if x.get('srcset'):x['srcset']=', '.join(urljoin(ORIGIN,part.strip().split()[0])+' '+' '.join(part.strip().split()[1:]) for part in x['srcset'].split(','))
  for x in d.select('[role="dialog"],dialog,form,[id*="cookie-consent"],[class*="cookie-consent"], [data-cookie-consent]'):
   if x.parent:x.decompose()
  for x in d.select('a[href]'):
   h=x['href'];full=urljoin(ORIGIN,h);p=urlparse(full)
   if p.path in paths.values() and p.netloc==urlparse(ORIGIN).netloc:
    key=next(k for k,v in paths.items() if v==p.path);x['href']=BASE+key+'-'+variant+'.html'+('#'+p.fragment if p.fragment else '')
   elif h.startswith('/') and not h.startswith('/lead/'):x['href']=full
  d.body['data-rv-type']=variant
  main=d.main;main['data-rv-content']=''
  for x in main.select('p,li,td,th'):
   cl=' '.join(x.get('class',[]))
   if not re.search('price|eyebrow|category|badge',cl):x['data-rv-role']='lead' if '__lead' in cl else 'body'
  for x in main.select('.home-image-cards__card strong,.home-image-cards__title,.articles-page__card strong'):x['data-rv-role']='card-title'
  # Inspect all card-copy strong headings by their owning link classes, without touching quote emphasis.
  for x in main.select('a strong'):
   if not x.find_parent('blockquote'):x['data-rv-role']='card-title'
  d.head.append(BeautifulSoup(f'<meta name="robots" content="noindex,nofollow"><link rel="stylesheet" href="{BASE}review.css"><link rel="stylesheet" href="{BASE}typography.css"><script src="{BASE}review.js" defer></script>','html.parser'))
  d.title.string=labels[n]+' — типографика '+variant.upper()+' · дизайн-превью'
  bar=f'<aside class="rv-bar"><div><b>ТИПОГРАФИКА {variant.upper()}</b> · {labels[n]} · только дизайн</div><nav>{nav}<a href="{BASE}{n}-a.html" aria-current="{str(variant=="a").lower()}">A · привычная</a><a href="{BASE}{n}-b.html" aria-current="{str(variant=="b").lower()}">B · для чтения</a></nav><nav>'+''.join(f'<a href="{BASE}{k}-{variant}.html">{lab}</a>' for k,lab in labels.items())+'</nav></aside>'
  main.insert_before(BeautifulSoup(bar,'html.parser'))
  (OUT/(n+'-'+variant+'.html')).write_text(str(d).replace('</body>', ''.join('<script src="'+BASE+x+'.js" defer></script>' for x in ['site-header','home-image-cards-slider','robot-card-gallery'])+'</body>'))
intro='<main class="rv-wrap"><div class="rv-intro"><span class="rv-kicker">02 / ОБЩИЙ РИТМ</span><h1>Заголовки и тексты.<br>Одна система.</h1><p>Два варианта на четырёх полных страницах. Тексты, изображения, цвета и композиция блоков сохранены. Hero здесь остаётся прежним: его компоновку выбираем отдельно на первой странице.</p></div><div class="rv-type-grid">'
for v,title,desc,scale in [('a','Привычная','Ближе к главной: выразительные заголовки, привычная плотность. Мой основной вариант для всего сайта.','H1 52 / 32 · H2 34 / 26 · H3 22 / 20 · текст 18 / 16'),('b','Для чтения','Спокойнее заголовки, чуть крупнее основной текст и свободнее межстрочный интервал. Особенно удобна для длинных статей.','H1 48 / 30 · H2 32 / 25 · H3 22 / 20 · текст 19 / 17')]:
 intro+=f'<section class="rv-type-card"><span class="rv-badge">{v.upper()}</span><h2>{title}</h2><p>{desc}</p><p class="rv-scale">{scale}<br><small>px: компьютер / телефон; Montserrat, заголовки 700.</small></p><div class="rv-specimen" data-specimen="{v}"><div class="rv-spec-h1">Роботы для вашего события</div><div class="rv-spec-h2">Как выбрать подходящий формат</div><div class="rv-spec-h3">Общение с гостями</div><p>Робот-собака быстро собирает вокруг себя людей: кто-то присаживается рядом, кто-то протягивает руку для «дай лапу», гладит робопса или снимает видео.</p></div><nav class="rv-page-links">'+''.join(f'<a href="{BASE}{k}-{v}.html">{lab} ↗</a>' for k,lab in labels.items())+'</nav></section>'
intro+='</div><aside class="rv-note">Размер текста зависит от роли: лид крупнее основного текста, подписи и тексты маленьких карточек — компактнее. Но одинаковые роли на всех четырёх страницах получают одинаковые правила. Цвета не унифицируются насильно. На странице примера можно переключить A/B и перейти к другому типу страницы.</aside><div class="rv-note"><b>Что дальше:</b> выберите Hero A/B/C и типографику A/B. После этого — единый лист правил и исправлений, затем сборка согласованных страниц. Главная остаётся эталоном, а не объектом переделки.</div></main>'
(OUT/'typography.html').write_text(shell('Сравнение типографики',intro))
(OUT/'index.html').write_text(shell('Дизайн-сравнение','<main class="rv-wrap rv-intro"><h1>Hero и типографика</h1><p>Два независимых выбора для статей и подборок.</p><nav class="rv-page-links">'+nav+'</nav></main>'))
(OUT.parent/'assets.json').write_text(json.dumps(cache,ensure_ascii=False,indent=2))
print('Generated',len(list(OUT.glob('*.html'))),'HTML; assets',len(cache))

media_map=json.loads((Path(__file__).parent/"media-map.json").read_text())
for f in OUT.rglob("*"):
 if f.suffix in [".html",".css"]:
  text=f.read_text()
  for u,replacement,sha,mode in media_map:text=text.replace(u,replacement)
  f.write_text(text)
