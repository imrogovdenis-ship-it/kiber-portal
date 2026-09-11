"""Validate the offline research library; no browser/network requests."""
import argparse,hashlib,json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
LIB=ROOT/'docs/research/robot-catalog-library'
def load(p):return json.loads(p.read_text())
def normalized(text):return ' '.join(text.split()).casefold()
def main():
 ap=argparse.ArgumentParser();ap.add_argument('--private-cache',type=Path);args=ap.parse_args()
 m=load(LIB/'manifest.json');status=load(LIB/'collection-status.json');catalog=load(ROOT/'data/content/home-catalog-titles.json');models=m['models'];assert {x['slug'] for x in models}==set(catalog)
 ledger={x['id']:x for x in load(LIB/'source-ledger.json')['sources']};captures={x['sourceId']:x for x in (load(p) for p in (LIB/'source-captures').glob('*.json'))};assert set(captures)==set(ledger)
 assert len(models)==status['models']==status['dossiers'];assert len(captures)==status['capturedSources'];queries=0;ready=0;blocked=[]
 for x in models:
  assert re.fullmatch('[a-z0-9-]+',x['slug']);assert (ROOT/x['wordstatFile']).exists();d=load(LIB/x['dossier']);assert d['slug']==x['slug'];assert d['readyForWriting']==x['readyForWriting'];assert d['publicationAllowed'] is False;assert (LIB/x['dossierMarkdown']).exists();assert len(d['existingCapabilityMediaTopics'])==6
  if d['readyForWriting']:ready+=1
  else:blocked.append(x['slug'])
  if x.get('reuseResearch'):assert (ROOT/x['reuseResearch']).exists()
  else:
   srcids={r['sourceId'] for r in d['sourceRecords']};assert srcids<=set(ledger);assert d['findings'] and d['guardrails'] and d['ownerQuestions']
   for finding in d['findings']:assert finding['sourceIds'] and set(finding['sourceIds'])<=srcids
   for source in d['sourceRecords']:assert (LIB/source['captureFile']).exists()
  for q in x.get('queries',{}).values():
   if q.get('status')=='captured':assert (LIB/q['file']).exists();assert load(LIB/q['file'])['results'];queries+=1
 assert queries==status['capturedSearchQueries'];assert ready==status['readyForGuardedDrafts'];assert sorted(blocked)==sorted(status['blockedOnOwnerIdentity']);assert load(LIB/'missing-sources.json')==[];assert status['siteChanged'] is False
 for source in ledger.values():assert source.get('quotes');assert sum(len(q['text'].split()) for q in source['quotes'])<=80
 if args.private_cache:
  index=load(args.private_cache/'source-index.json');assert len(index)==len(captures)
  source_map=load(LIB/'source-map.json')
  for url,r in index.items():
   assert r['status']=='captured_unreviewed';text=Path(r['privateText']).read_text();sid=source_map[url];assert hashlib.sha256(text.encode()).hexdigest()==captures[sid]['sourceTextSha256']
   for quote in ledger[sid]['quotes']:assert normalized(quote['text']) in normalized(text),(sid,'quote mismatch')
 print(json.dumps({'valid':True,'models':len(models),'queries':queries,'sources':len(captures),'readyForGuardedDrafts':ready,'blocked':blocked,'privateHashesAndQuotesChecked':bool(args.private_cache)},ensure_ascii=False))
if __name__=='__main__':main()
