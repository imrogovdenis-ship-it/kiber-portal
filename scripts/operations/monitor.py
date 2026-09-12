def transition(previous, failures):
 state={}; events=[]
 for key in sorted(set(previous)|set(failures)):
  old=previous.get(key,0);new=old+1 if key in failures else 0
  if new==2:events.append('ALERT: '+key)
  if old>=2 and new==0:events.append('RECOVERY: '+key)
  if new:state[key]=new
 return state,events

import json,hashlib
def summarize_logs(text):
 counts={'delivered':0,'failed':0};seen=set()
 for line in text.splitlines():
  try:e=json.loads(line[line.index('{'):])
  except (ValueError,TypeError):continue
  if e.get('event')!='lead.delivery.completed' or e.get('mode')!='live':continue
  key=hashlib.sha256(json.dumps(e,sort_keys=True).encode()).hexdigest()
  if key in seen:continue
  seen.add(key)
  if e.get('status') in counts:counts[e['status']]+=1
 return counts

def valid_response(kind,body):
 if kind=='api':
  try:d=json.loads(body);return d.get('ok') is True and d.get('mode')=='live'
  except (ValueError,AttributeError):return False
 if kind=='web':return 'кибер' in body.lower() and 'noindex' not in body.lower()
 if kind=='robots':return 'Sitemap:' in body and 'Disallow: /\n' not in body
 if kind=='sitemap':return '<urlset' in body or '<sitemapindex' in body
 return False

from pathlib import Path
import urllib.request,ssl,socket,time,datetime,subprocess,os,fcntl,sys
ROOT=Path(__file__).resolve().parent

def notify(text):
 values={}
 for line in Path('/home/alex/.hermes/.env').read_text().splitlines():
  if '=' in line:
   k,v=line.split('=',1);values[k]=v.strip().strip(chr(34)+chr(39))
 token=values['TELEGRAM_BOT_TOKEN']
 req=urllib.request.Request('https://api.telegram.org/bot'+token+'/sendMessage',data=json.dumps({'chat_id':'653372814','text':text,'disable_web_page_preview':True}).encode(),headers={'Content-Type':'application/json'})
 try:
  with urllib.request.urlopen(req,timeout=15) as r:out=json.load(r)
 except Exception:raise RuntimeError('Telegram notification failed (details suppressed)') from None
 if not out.get('ok'):raise RuntimeError('Telegram notification rejected')
 return out['result']['message_id']

def main():
 os.umask(0o077)
 lock=(ROOT/'monitor.lock').open('w')
 try:fcntl.flock(lock,fcntl.LOCK_EX|fcntl.LOCK_NB)
 except BlockingIOError:return
 now=time.time();path=ROOT/'state.json'
 state=json.loads(path.read_text()) if path.exists() else {'started':now,'last':now-300,'failures':{},'milestones':[],'totals':{'delivered':0,'failed':0},'pending':[]}
 if '--test-notification' in sys.argv:
  mid=notify('КИБЕР ПОРТАЛ — проверка уведомлений мониторинга. Это технический тест, не заявка. Наблюдение за сайтом/API/SSL и ошибками доставки настроено; 24–72 часа наблюдения ещё не завершены.')
  print(json.dumps({'telegramTestAccepted':True,'messageId':mid}));return
 failures=[];checks={}
 targets=[('web','https://www.kiber-portal.ru/'),('api','https://www.kiber-portal.ru/api/leads/status'),('robots','https://www.kiber-portal.ru/robots.txt'),('sitemap','https://www.kiber-portal.ru/sitemap.xml')]
 for kind,url in targets:
  started=time.monotonic()
  try:
   req=urllib.request.Request(url,headers={'User-Agent':'KiberPortal-Monitor/1.0'})
   with urllib.request.urlopen(req,timeout=12) as r:body=r.read(2000000).decode();ok=r.status==200 and valid_response(kind,body)
   checks[kind]={'ok':ok,'seconds':round(time.monotonic()-started,3)}
   if not ok:failures.append(kind)
  except Exception as e:checks[kind]={'ok':False,'errorType':type(e).__name__};failures.append(kind)
 try:
  with socket.create_connection(('www.kiber-portal.ru',443),timeout=12) as conn:
   with ssl.create_default_context().wrap_socket(conn,server_hostname='www.kiber-portal.ru') as tls:
    expiry=ssl.cert_time_to_seconds(tls.getpeercert()['notAfter'])
  checks['tls']={'ok':expiry-now>14*86400,'daysRemaining':int((expiry-now)/86400)}
  if not checks['tls']['ok']:failures.append('tls')
 except Exception as e:checks['tls']={'ok':False,'errorType':type(e).__name__};failures.append('tls')
 try:
  p=subprocess.run(['docker','logs','--since',str(int(state['last'])),'--until',str(int(now)),'alex-kiber-jino-live-api'],capture_output=True,text=True,timeout=15,check=True)
  counts=summarize_logs(p.stdout+'\n'+p.stderr)
  checks['deliveryLog']={'ok':True,**counts}
  for k in counts:state['totals'][k]+=counts[k]
  if counts['failed']:state['pending'].append('КИБЕР ПОРТАЛ: API сообщил об ошибках доставки заявок: '+str(counts['failed'])+'. Проверьте оба канала и журнал; контакты клиентов в уведомление не включены.')
 except Exception as e:checks['deliveryLog']={'ok':False,'errorType':type(e).__name__};failures.append('deliveryLog')
 state['failures'],events=transition(state['failures'],failures)
 for event in events:state['pending'].append('КИБЕР ПОРТАЛ: '+event+'. Проверки каждые 5 минут; ALERT после двух последовательных неудач.')
 # Continuity gaps must not be described as successful monitoring.
 if now-state['last']>900:state['pending'].append('КИБЕР ПОРТАЛ: перерыв в мониторинге более 15 минут. Непрерывность наблюдения не подтверждена.');state['gaps']=state.get('gaps',0)+1
 for hours in [24,72]:
  if now-state['started']>=hours*3600 and hours not in state['milestones']:
   state['pending'].append('КИБЕР ПОРТАЛ: прошло '+str(hours)+' ч наблюдения. Текущие проблемы: '+(', '.join(failures) or 'нет')+'. Перерывы: '+str(state.get('gaps',0))+'. Наблюдавшиеся доставки/ошибки: '+str(state['totals'])+'. Это отчёт, не автоматическое закрытие эксплуатационного этапа.')
   state['milestones'].append(hours)
 state['last']=now;state['checks']=checks
 # Durable outbox before sending; retry unsent messages on next invocation.
 def save():
  tmp=ROOT/'state.tmp';tmp.write_text(json.dumps(state,ensure_ascii=False,indent=2));tmp.replace(path)
 save()
 while state['pending']:
  try:notify(state['pending'][0])
  except RuntimeError:break
  state['pending'].pop(0);save()
 day=datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%d')
 with (ROOT/('checks-'+day+'.jsonl')).open('a') as f:f.write(json.dumps({'at':now,'checks':checks},ensure_ascii=False)+'\n')
 for old in ROOT.glob('checks-????-??-??.jsonl'):
  if now-old.stat().st_mtime>30*86400:old.unlink()
 print(json.dumps({'at':now,'checks':checks,'pendingNotifications':len(state['pending'])},ensure_ascii=False))
if __name__=='__main__':main()
