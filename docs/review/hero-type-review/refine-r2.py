from pathlib import Path
import sys,html,json
sys.path.insert(0,'/home/alex/.hermes/state/kiber-scenario-mobile-preview/vendor')
from bs4 import BeautifulSoup
P=Path(__file__).parent;O=P/'site';B='/preview/hero-type-review/'
def load(f):return BeautifulSoup((O/f).read_text(),'html.parser')
def bar(text,links):return BeautifulSoup('<aside class="rv-bar"><b>'+text+'</b><nav>'+''.join('<a href="'+B+url+'">'+label+'</a>' for label,url in links)+'</nav></aside>','html.parser')
for n in ['article','compilation']:
 d=load(n+'-a.html');d.body.attrs.pop('data-rv-type',None);d.main.attrs.pop('data-rv-content',None)
 for l in d.select('link[rel=stylesheet]'):
  if 'typography.css' in l.get('href',''):l.decompose()
 old=d.select_one('[data-block-id=hero]');title=old.h1.get_text(' ',strip=True);desc=old.select_one('[class$=__lead]').get_text(' ',strip=True);im=old.img;actions=old.select_one('.humanoid-template__actions')
 new=BeautifulSoup('<section class="rv-photo-hero" id="hero" data-block-id="hero" aria-labelledby="page-title"><div class="rv-photo-hero__inner"><img src="'+B+n+'.webp" alt="'+html.escape(im['alt'])+'" width="1600" height="900"><h1 id="page-title">'+html.escape(title)+'</h1><p class="rv-photo-hero__description">'+html.escape(desc)+'</p>'+(str(actions) if actions else '')+'</div></section>','html.parser')
 old.replace_with(new);d.head.append(BeautifulSoup('<link rel="stylesheet" href="'+B+'photo-first-r2.css">','html.parser'));d.title.string=('Статья' if n=='article' else 'Подборка')+' — Hero: сначала изображение · R2'
 links=[('Статья','article-photo-first.html'),('Подборка','compilation-photo-first.html'),('Прежние Hero','hero.html'),('Типографика','typography.html')];d.select_one('.rv-bar').replace_with(bar('HERO R2 · КАРТИНКА → H1 → ОПИСАНИЕ',links));(O/(n+'-photo-first.html')).write_text(str(d))
for n in ['article','blog']:
 for v in ['a','b']:
  d=load(n+'-'+v+'.html');other='blog' if n=='article' else 'article';links=[('A · привычная',n+'-a.html'),('B · для чтения',n+'-b.html'),('Блог' if other=='blog' else 'Статья',other+'-'+v+'.html'),('К сравнению','typography.html')]
  d.select_one('.rv-bar').replace_with(bar(('СТАТЬЯ' if n=='article' else 'БЛОГ КИБЕР ГОШИ')+' · ТИПОГРАФИКА '+v.upper(),links));(O/(n+'-'+v+'.html')).write_text(str(d))
d=load('typography.html');d.main.clear();d.main.append(BeautifulSoup('<div class="rv-intro"><span class="rv-kicker">ПОЛНЫЕ СТРАНИЦЫ · R2</span><h1>Смотрим типографику<br>на настоящих страницах</h1><p>Не образцы шрифтов, а целая статья и весь «Блог Кибер Гоши». Внутри каждой страницы сверху можно переключить A/B. Тексты, изображения и порядок блоков сохранены. Новый Hero смотрим отдельно.</p></div><div class="rv-type-grid">'+''.join('<section class="rv-type-card"><h2>'+label+'</h2><p>'+desc+'</p><nav class="rv-page-links"><a href="'+B+n+'-a.html">Открыть целую страницу · A</a><a href="'+B+n+'-b.html">Открыть целую страницу · B</a></nav></section>' for n,label,desc in [('article','Статья о робособаках','H1, текст статьи, H2/H3, таблица, цитата Гоши, FAQ и нижние блоки.'),('blog','Блог Кибер Гоши','Общий заголовок, вводный текст, все карточки статей и финальный блок.')])+'</div><aside class="rv-note"><b>A:</b> привычнее и ближе к главной. <b>B:</b> чуть спокойнее заголовки, крупнее основной текст и свободнее межстрочный интервал. Меняется только типографика, не содержание страниц.</aside>','html.parser'));(O/'typography.html').write_text(str(d))
d=load('hero.html');intro=d.select_one('.rv-intro');intro.insert(0,BeautifulSoup('<aside class="rv-note"><b>Новый вариант R2: сначала большая картинка, затем заголовок и описание.</b><nav class="rv-page-links"><a href="'+B+'compilation-photo-first.html">Посмотреть на полной подборке</a><a href="'+B+'article-photo-first.html">Посмотреть на полной статье</a></nav></aside>','html.parser'));(O/'hero.html').write_text(str(d))
