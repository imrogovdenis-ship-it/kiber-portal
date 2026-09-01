#!/usr/bin/env python3
"""KIBER-93 aggregate rendered/source SEO component audit.

Reads SEO passports plus rendered dist/ HTML and writes:
- data/seo/page-seo-audit.json
- docs/page-seo-audit.md

Policy: technical SEO regressions are blockers; content/intent gaps in draft
passports are warnings until owner approval ratchets them to fail.
"""
from __future__ import annotations
import argparse, json, re, sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
SITE = 'https://www.kiber-portal.ru'

class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title_chunks=[]; self.in_title=False
        self.text_chunks=[]
        self.h=[]; self.current_h=None; self.current_h_chunks=[]
        self.meta=[]; self.links=[]; self.images=[]; self.anchors=[]; self.scripts=[]
        self.in_json_ld=False; self.script_chunks=[]
    def handle_starttag(self, tag, attrs):
        d=dict(attrs); tag=tag.lower()
        if tag=='title': self.in_title=True; self.title_chunks=[]
        if tag in ['h1','h2','h3','h4','h5','h6']:
            self.current_h=tag; self.current_h_chunks=[]
        if tag=='meta': self.meta.append(d)
        if tag=='link': self.links.append(d)
        if tag=='img': self.images.append(d)
        if tag=='a': self.anchors.append(d)
        if tag=='script' and d.get('type')=='application/ld+json': self.in_json_ld=True; self.script_chunks=[]
    def handle_data(self, data):
        if self.in_title: self.title_chunks.append(data)
        if self.current_h: self.current_h_chunks.append(data)
        if self.in_json_ld: self.script_chunks.append(data)
        if data.strip(): self.text_chunks.append(data)
    def handle_endtag(self, tag):
        tag=tag.lower()
        if tag=='title': self.in_title=False
        if self.current_h and tag==self.current_h:
            self.h.append({'level': int(self.current_h[1]), 'text': norm(''.join(self.current_h_chunks))})
            self.current_h=None; self.current_h_chunks=[]
        if tag=='script' and self.in_json_ld:
            self.scripts.append(''.join(self.script_chunks).strip())
            self.in_json_ld=False; self.script_chunks=[]

def norm(s): return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', s or '')).strip()
def lc(s): return norm(s).casefold()
def contains(text, needle): return lc(needle) in lc(text)

def html_path_for(route):
    if route=='/': return ROOT/'dist/index.html'
    return ROOT/'dist'/route.strip('/')/'index.html'

def meta_content(parser, key):
    for m in parser.meta:
        if m.get('name')==key or m.get('property')==key: return m.get('content','')
    return ''
def canonical(parser):
    for l in parser.links:
        if l.get('rel')=='canonical': return l.get('href','')
    return ''
def schema_types(values):
    out=[]
    def walk(v):
        if isinstance(v,list):
            for x in v: walk(x)
        elif isinstance(v,dict):
            if '@graph' in v: walk(v['@graph'])
            t=v.get('@type')
            if isinstance(t,list): out.extend(map(str,t))
            elif t: out.append(str(t))
    walk(values)
    return sorted(set(out))

def add(checks, key, status, message):
    checks[key]={'status':status,'message':message}

def audit_page(page, sitemap_locs, robots_txt):
    route=page['slug']; file=html_path_for(route); checks={}; warnings=[]; failures=[]
    def check(key, status, message):
        add(checks,key,status,message)
        if status=='fail': failures.append(f'{key}: {message}')
        if status=='warning': warnings.append(f'{key}: {message}')
    if not file.exists():
        check('renderedHtml','fail',f'missing {file.relative_to(ROOT)}')
        return {'slug':route,'pageType':page['pageType'],'status':'fail','checks':checks,'missing':failures,'warnings':warnings}
    html=file.read_text(encoding='utf-8', errors='replace')
    p=PageParser(); p.feed(html)
    title=norm(''.join(p.title_chunks)); desc=meta_content(p,'description'); rob=meta_content(p,'robots'); can=canonical(p)
    text=norm(' '.join(p.text_chunks)); h1s=[h['text'] for h in p.h if h['level']==1 and h['text']]; h2s=[h['text'] for h in p.h if h['level']==2 and h['text']]
    check('httpStatusStatic','pass','rendered HTML exists')
    check('urlHumanReadable','pass' if re.match(r'^/[a-z0-9\-/]*$', route) and 'page' not in route else 'warning','latin lowercase slug without random ids' if re.match(r'^/[a-z0-9\-/]*$', route) else 'slug should be lowercase latin URL')
    expected_robots='index, follow' if page['indexable'] else 'noindex, nofollow'
    check('robotsMeta','pass' if rob==expected_robots else 'fail',f'expected {expected_robots}, got {rob or "missing"}')
    check('canonical','pass' if can==page['canonical'] else 'fail',f'expected {page["canonical"]}, got {can or "missing"}')
    in_sitemap=page['canonical'] in sitemap_locs
    check('sitemapInclusion','pass' if in_sitemap==page['indexable'] else 'fail',f'in sitemap={in_sitemap}, indexable={page["indexable"]}')
    check('title','pass' if title else 'fail',title or 'missing')
    check('titleMatchesPassport','pass' if title==page['title'] else 'warning',f'rendered={title!r}; passport={page["title"]!r}')
    check('description','pass' if len(desc)>=40 else 'fail',f'{len(desc)} chars')
    check('h1Count','pass' if len(h1s)==1 else 'fail',f'{len(h1s)} H1: {h1s}')
    check('h1MatchesPassport','pass' if h1s and h1s[0]==page['h1'] else 'warning',f'rendered={h1s[0] if h1s else "missing"!r}; passport={page["h1"]!r}')
    check('h2Present','pass' if h2s else ('warning' if page['pageType'] in ['legal','conversion'] else 'fail'),f'{len(h2s)} H2')
    bad_jump=False; prev=0
    for h in p.h:
        if prev and h['level']>prev+1: bad_jump=True
        prev=h['level']
    check('headingHierarchy','warning' if bad_jump else 'pass','no heading level jumps' if not bad_jump else 'heading level jump found')
    useful=len(text)
    min_chars=int(page.get('minUsefulTextChars',0))
    check('usefulText','pass' if useful>=min_chars else 'warning',f'{useful} visible chars; target {min_chars}')
    pk=page['primaryKeyword']
    check('primaryKeywordInTitle','pass' if contains(title,pk) else 'warning',f'primary={pk!r}')
    check('primaryKeywordInH1','pass' if h1s and contains(h1s[0],pk) else 'warning',f'primary={pk!r}')
    first_text=' '.join(text.split()[:80])
    check('primaryKeywordInFirstBlock','pass' if contains(first_text,pk) else 'warning',f'primary={pk!r}')
    missing_secondary=[k for k in page.get('secondaryKeywords',[]) if not contains(text,k)]
    check('secondaryKeywords','pass' if not missing_secondary else 'warning',('all found' if not missing_secondary else 'missing: '+', '.join(missing_secondary[:5])))
    meaningful=[img for img in p.images if (img.get('alt') or img.get('src','').lower().endswith(('.jpg','.jpeg','.png','.webp','.avif')))]
    missing_alt=[img.get('src','') for img in meaningful if 'alt' not in img or img.get('alt','')=='']
    check('meaningfulImageAlts','pass' if not missing_alt else 'warning',f'missing alt count {len(missing_alt)}')
    check('ogTitle','pass' if meta_content(p,'og:title') else 'fail','present' if meta_content(p,'og:title') else 'missing')
    check('ogDescription','pass' if meta_content(p,'og:description') else 'fail','present' if meta_content(p,'og:description') else 'missing')
    check('ogImage','pass' if meta_content(p,'og:image') else 'fail','present' if meta_content(p,'og:image') else 'missing')
    check('twitterCard','pass' if meta_content(p,'twitter:card') else 'fail','present' if meta_content(p,'twitter:card') else 'missing')
    schemas=[]; invalid=0
    for s in p.scripts:
        try: schemas.append(json.loads(s))
        except Exception: invalid+=1
    types=schema_types(schemas)
    check('jsonLdValid','pass' if invalid==0 else 'fail',f'invalid scripts={invalid}')
    missing_types=[t for t in page['schemaTypesRequired'] if t not in types]
    # BlogPosting/NewsArticle are warnings for index pages while detail templates are deferred.
    schema_status='pass' if not missing_types else ('warning' if page['pageType'] in ['article','news','collection','legal','conversion'] else 'fail')
    check('requiredSchemaTypes',schema_status,('present: '+', '.join(types)) if not missing_types else 'missing: '+', '.join(missing_types)+'; present: '+', '.join(types))
    wants_breadcrumbs=bool(page.get('breadcrumbsRequired')) and page['indexable'] and page['pageType'] not in ['article','news']
    has_breadcrumb_nav='aria-label="Хлебные крошки"' in html or "aria-label='Хлебные крошки'" in html
    check('breadcrumbs','pass' if (not wants_breadcrumbs or has_breadcrumb_nav) else 'warning','present or not required' if (not wants_breadcrumbs or has_breadcrumb_nav) else 'visible breadcrumbs missing')
    internal=[a.get('href','') for a in p.anchors if a.get('href','').startswith('/')]
    check('internalLinks','pass' if internal or not page.get('internalLinksRequired') else 'warning',f'{len(internal)} internal hrefs')
    cta_ok=('/contacts/' in internal or '/lead/request/' in internal or page['pageType']=='legal')
    check('cta','pass' if cta_ok or not page.get('ctaRequired') else 'warning','conversion/contact path present' if cta_ok else 'required CTA target missing')
    check('viewport','pass' if meta_content(p,'viewport')=='width=device-width, initial-scale=1' else 'fail',meta_content(p,'viewport') or 'missing')
    check('robotsTxt','pass' if 'Disallow: /' not in robots_txt and 'Sitemap:' in robots_txt else 'fail','robots.txt allows crawl and declares sitemap')
    status='fail' if failures else ('warning' if warnings else 'pass')
    return {'slug':route,'pageType':page['pageType'],'status':status,'checks':checks,'missing':failures,'warnings':warnings,'rendered':{'title':title,'description':desc,'h1':h1s[0] if h1s else None,'h2Count':len(h2s),'schemaTypes':types,'visibleTextChars':useful}}

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--fail-on-warning', action='store_true'); args=ap.parse_args()
    passports=json.loads((ROOT/'data/seo/page-seo-passports.json').read_text())
    sitemap=(ROOT/'dist/sitemap.xml').read_text(encoding='utf-8', errors='replace') if (ROOT/'dist/sitemap.xml').exists() else ''
    sitemap_locs=set(re.findall(r'<loc>([^<]+)</loc>', sitemap))
    robots_txt=(ROOT/'public/robots.txt').read_text(encoding='utf-8', errors='replace') if (ROOT/'public/robots.txt').exists() else ''
    routes=[audit_page(p, sitemap_locs, robots_txt) for p in passports['pages']]
    summary={'routesChecked':len(routes),'passed':sum(r['status']=='pass' for r in routes),'warnings':sum(r['status']=='warning' for r in routes),'failed':sum(r['status']=='fail' for r in routes)}
    report={'schemaVersion':1,'issue':'KIBER-93','status':'failed' if summary['failed'] else ('warning' if summary['warnings'] else 'passed'),'summary':summary,'routes':routes}
    (ROOT/'data/seo').mkdir(parents=True, exist_ok=True); (ROOT/'docs').mkdir(parents=True, exist_ok=True)
    (ROOT/'data/seo/page-seo-audit.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    lines=['# KIBER-93 — Page SEO components audit','','Status: **'+report['status']+'**','',f"Checked: {summary['routesChecked']} routes; pass: {summary['passed']}; warnings: {summary['warnings']}; failed: {summary['failed']}",'','## Per-route summary','']
    icon={'pass':'✅','warning':'⚠️','fail':'❌'}
    for r in routes:
        lines.append(f"### {r['slug']} — {icon[r['status']]} {r['status']}")
        for key,val in r['checks'].items():
            lines.append(f"- {icon[val['status']]} `{key}` — {val['message']}")
        lines.append('')
    (ROOT/'docs/page-seo-audit.md').write_text('\n'.join(lines)+'\n',encoding='utf-8')
    print(f"KIBER-93 page SEO component audit: {summary['routesChecked']} routes, {summary['failed']} failed, {summary['warnings']} warnings. Reports written to data/seo/page-seo-audit.json and docs/page-seo-audit.md")
    if summary['failed'] or (args.fail_on_warning and summary['warnings']): sys.exit(1)
if __name__=='__main__': main()
