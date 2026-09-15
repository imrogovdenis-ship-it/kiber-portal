from html.parser import HTMLParser
from pathlib import Path
import json
class Text(HTMLParser):
 def __init__(self):super().__init__();self.skip=0;self.text=''
 def handle_starttag(self,tag,attrs):
  if tag in ('script','style'):self.skip+=1
 def handle_endtag(self,tag):
  if tag in ('script','style'):self.skip=max(0,self.skip-1)
 def handle_data(self,data):
  if not self.skip:self.text+=data
rows=json.loads(Path('data/design/font-subsets.json').read_text());rare=set(rows[0]['fallbackCodepoints']);fail=[]
files=list(Path('dist').rglob('*.html'));assert files, 'Build dist before font coverage validation'
scanned=0
for f in files:
 if f==Path('dist/index.html'):continue # Home deliberately uses the complete originals.
 scanned+=1
 p=Text();p.feed(f.read_text());missing=set(map(ord,p.text))&rare
 if missing:fail.append((str(f),sorted(missing)))
assert scanned>0, 'No internal HTML scanned'
assert not fail, f'Expand common font repertoire or use full faces for new rare static text: {fail}'
print('PASS all public static text covered; arbitrary input uses original complete fonts')
