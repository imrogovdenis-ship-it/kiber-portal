from pathlib import Path
import sys,copy
sys.path.insert(0,'/home/alex/.hermes/state/kiber-scenario-mobile-preview/vendor')
from bs4 import BeautifulSoup
P=Path(__file__).parent;O=P/'site';B='/preview/hero-type-review/'
source=BeautifulSoup((O/'compilation-a.html').read_text(),'html.parser').select_one('.humanoid-template__actions')
for n in ['article','compilation']:
 d=BeautifulSoup((O/(n+'-overlay.html')).read_text(),'html.parser');actions=copy.deepcopy(source);actions.select('a')[1]['href']='#catalogBlock' if n=='article' else '#featured-dogs';old=d.select_one('.rv-overlay-actions') or d.select_one('.rv-overlay-copy .humanoid-template__actions');old.replace_with(actions)
 if n=='article' and not d.select_one('link[href$="c953e03277c278.css"]'):
  d.head.append(BeautifulSoup('<link rel="stylesheet" href="'+B+'assets/c953e03277c278.css">','html.parser'))
 for x in d.select('link[href$="overlay-r3.css"]'):x['href']=B+'overlay-r4.css'
 d.title.string=d.title.get_text().replace('R3','R4');d.select_one('.rv-bar b').string='R4 · ИСХОДНЫЕ ОПИСАНИЕ И КНОПКИ · ЗАГОЛОВКИ A';(O/(n+'-overlay.html')).write_text(str(d))
