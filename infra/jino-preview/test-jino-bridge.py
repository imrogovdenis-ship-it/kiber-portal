import json,urllib.request,urllib.error
from pathlib import Path
import os
c={'url':os.environ['KIBER_JINO_PREVIEW_URL'].rstrip('/')+'/','slug':''}
assert c['url']=='https://jino-preview.kiber-portal.ru/', 'Preview-only test guard'
try:
 r=urllib.request.urlopen(c['url']+'api/leads/status',timeout=15);status=r.status;body=r.read()
except urllib.error.HTTPError as e:status=e.code;body=e.read()
assert status==200,f'expected real API status 200, got {status}'
assert json.loads(body)=={'ok':True,'mode':'dry-run'},body
print('PASS real Jino -> HTTPS -> source API dry-run status')
