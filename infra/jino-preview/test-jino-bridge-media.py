import json,urllib.request,urllib.error
from pathlib import Path
import os
c={'url':os.environ['KIBER_JINO_PREVIEW_URL'].rstrip('/')+'/','slug':''}
assert c['url']=='https://jino-preview.kiber-portal.ru/', 'Preview-only test guard'
r=urllib.request.Request(c['url']+'api/leads',data=b'not-a-form',headers={'Content-Type':'application/octet-stream'},method='POST')
try:response=urllib.request.urlopen(r,timeout=20);status=response.status
except urllib.error.HTTPError as e:status=e.code
assert status==415,f'expected unsupported media 415, got {status}'
print('PASS unsupported media rejected')
