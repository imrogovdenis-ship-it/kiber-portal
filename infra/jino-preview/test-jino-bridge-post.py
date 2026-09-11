import json,urllib.request,urllib.error,uuid
from pathlib import Path
import os
c={'url':os.environ['KIBER_JINO_PREVIEW_URL'].rstrip('/')+'/','slug':''}
assert c['url']=='https://jino-preview.kiber-portal.ru/', 'Preview-only test guard'
payload={'name':'Jino preparation dry-run','contact':'diagnostic@example.invalid','privacy_consent':'true','request_id':'jino-'+uuid.uuid4().hex,'source_page':c['url']}
req=urllib.request.Request(c['url']+'api/leads',data=json.dumps(payload).encode(),headers={'Content-Type':'application/json','Accept':'application/json','Origin':c['url'].rstrip('/')},method='POST')
try:r=urllib.request.urlopen(req,timeout=25);status=r.status;body=r.read()
except urllib.error.HTTPError as e:status=e.code;body=e.read()
assert status==202,f'expected real dry-run POST 202, got {status}'
d=json.loads(body);assert d.get('mode')=='dry-run',d
assert all(x.get('skipped')=='dry-run' for x in d['channels'].values()),d
print('PASS real POST dry-run; both delivery channels skipped')
