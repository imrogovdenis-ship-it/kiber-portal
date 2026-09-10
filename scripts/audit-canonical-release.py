from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import json,difflib,re
import sys
w=Path(__file__).resolve().parents[1];base=Path(sys.argv[1])
class P(HTMLParser):
 def __init__(self):super().__init__();self.main=0;self.skip=0;self.text=[];self.ids=[];self.links=[];self.img=[];self.h1=0;self.noindex=False
 def handle_starttag(self,t,at):
  a=dict(at)
  if t=='main':self.main+=1
  if t=='h1':self.h1+=1
  if t=='meta' and a.get('name')=='robots':self.noindex='noindex' in a.get('content','')
  if t=='a' and a.get('href'):self.links.append(a['href'])
  if self.main:
   if t in ['script','style']:self.skip+=1
   if a.get('id'):self.ids.append(a['id'])
   if t=='img':self.img.append(a.get('src'))
 def handle_endtag(self,t):
  if t in ['script','style'] and self.main:self.skip-=1
  if t=='main':self.main-=1
 def handle_data(self,d):
  if self.main and not self.skip and d.strip():self.text.append(' '.join(d.split()))
def parse(f):p=P();p.feed(f.read_text());return p
pairs=[]
for a in json.loads((w/'data/content/launch-articles.json').read_text()):pairs.append((a['canonicalHref'],a['href']))
for r in json.loads((w/'src/content/robots.generated.json').read_text())['robots']:pairs.append(('/robots/'+r['slug']+'/','/preview/kiber-94/robot-card/'+r['slug']+'/'))
pairs.append(('/roboty-gumanoidy/','/preview/kiber-94/compilation/roboty-gumanoidy/'))
report=[]
for route,preview in pairs:
 a=parse(base/preview.lstrip('/')/'index.html');b=parse(w/'dist'/route.lstrip('/')/'index.html');d=list(difflib.unified_diff(a.text,b.text,n=1));rec={'route':route,'textEqual':a.text==b.text,'imagesEqual':a.img==b.img,'h1':b.h1,'noindex':b.noindex,'duplicateIds':len(b.ids)-len(set(b.ids))};report.append(rec)
 if d:print('DIFF',route,'\n'.join(d)[:1800])
print('PARITY',len(report),'text_pass',sum(r['textEqual'] for r in report),'images_pass',sum(r['imagesEqual'] for r in report),'duplicates',[(r['route'],r['duplicateIds']) for r in report if r['duplicateIds']])
(w/'docs/review/canonical-release/content-parity.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));(w/'docs/review/canonical-release/route-pairs.json').write_text(json.dumps(pairs,indent=2))
missing={};missingImages=set()
for f in (w/'dist').rglob('*.html'):
 p=parse(f)
 for a in p.img:
  if a and a.startswith('/') and not (w/'dist'/a.lstrip('/')).is_file():missingImages.add(a)
 for a in p.links:
  u=urlsplit(a)
  if u.netloc or not u.path.startswith('/') or u.path.startswith('/api/'):continue
  x=w/'dist'/unquote(u.path).lstrip('/')
  if not (x.is_file() or (x/'index.html').is_file() or x.with_suffix('.html').is_file()):missing.setdefault(u.path,[]).append(str(f.relative_to(w/'dist')))
print('MISSING_LINKS',json.dumps(missing)[:3500]);print('MISSING_IMAGES',list(missingImages)[:25]);(w/'docs/review/canonical-release/missing-links.json').write_text(json.dumps(missing,indent=2))
