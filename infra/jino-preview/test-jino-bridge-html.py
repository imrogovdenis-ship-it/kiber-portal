import json,urllib.request,urllib.error,urllib.parse
from pathlib import Path
import os
c={'url':os.environ['KIBER_JINO_PREVIEW_URL'].rstrip('/')+'/','slug':''}
assert c['url']=='https://jino-preview.kiber-portal.ru/', 'Preview-only test guard'
class NoRedirect(urllib.request.HTTPRedirectHandler):
 def redirect_request(self,*args,**kwargs):return None
request=urllib.request.Request(c['url']+'api/leads',data=urllib.parse.urlencode({'name':'Jino dry-run','contact':'diagnostic@example.invalid','privacy_consent':'true'}).encode(),headers={'Content-Type':'application/x-www-form-urlencoded','Accept':'text/html'},method='POST')
try:r=urllib.request.build_opener(NoRedirect).open(request,timeout=20);status=r.status;headers=r.headers
except urllib.error.HTTPError as e:status=e.code;headers=e.headers
assert status==303,f'expected HTML form redirect 303, got {status}'
assert headers.get('Location')=='/lead/thanks/'
print('PASS HTML form redirect remains in Jino preview')
