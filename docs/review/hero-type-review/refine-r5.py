from pathlib import Path
import sys
sys.path.insert(0,'/home/alex/.hermes/state/kiber-scenario-mobile-preview/vendor')
from bs4 import BeautifulSoup
O=Path(__file__).parent/'site';B='/preview/hero-type-review/'
for n in ['article','compilation']:
 d=BeautifulSoup((O/(n+'-overlay.html')).read_text(),'html.parser')
 if n=='article':
  lead=d.select_one('.rv-overlay-copy>p');lead['class']=['humanoid-template__lead'];lead['data-astro-cid-5vvfyfe5']='';lead.attrs.pop('data-astro-cid-crhutsu3',None)
 if not d.select_one('link[href$="hero-final-r5.css"]'):d.head.append(BeautifulSoup('<link rel="stylesheet" href="'+B+'hero-final-r5.css">','html.parser'))
 d.title.string=d.title.get_text().replace('R4','R5');(O/(n+'-overlay.html')).write_text(str(d))
