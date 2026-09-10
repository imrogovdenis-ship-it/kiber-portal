import json
from pathlib import Path
w=Path(__file__).resolve().parents[1]
for slug in ['arenda-unitree-g1','arenda-agibot-x2']:
 p=w/f'data/content/robot-card-pilot/{slug}.json'
 assert p.exists(), f'Missing researched copy: {slug}'
 d=json.loads(p.read_text());b=d['blocks']
 assert len(b['capabilities'])==6 and len(b['scenarios'])==6
 assert len(b['faq'])>=8 and len({x['question'] for x in b['faq']})==len(b['faq'])
 assert all(len(x['answer'])>100 for x in b['faq'])
 assert 'hero' not in b and 'gallery' not in b
 assert not d['review']['publicationApproved']
 assert d['review']['status']=='draft_for_owner_review'
 assert '\n\n' in b['goshaQuote']
 assert all(x['title']!=x['text'] for k in ['capabilities','scenarios'] for x in b[k])
 print(slug,'PASS')
