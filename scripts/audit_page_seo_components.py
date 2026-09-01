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

def load_ai_support():
    contract_path = ROOT/'data/seo/ai-search-visibility-contract.draft.json'
    entity_map_path = ROOT/'data/seo/ai-entity-map.json'
    llms_path = ROOT/'public/llms.txt'
    contract = json.loads(contract_path.read_text(encoding='utf-8')) if contract_path.exists() else {}
    entity_map = json.loads(entity_map_path.read_text(encoding='utf-8')) if entity_map_path.exists() else {}
    llms_txt = llms_path.read_text(encoding='utf-8', errors='replace') if llms_path.exists() else ''
    return contract, entity_map, llms_txt

def audit_page(page, sitemap_locs, robots_txt, ai_contract=None, ai_entity_map=None, llms_txt=''):
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
    normalized_internal=[href.split('#',1)[0].split('?',1)[0] for href in internal]
    check('internalLinks','pass' if internal or not page.get('internalLinksRequired') else 'warning',f'{len(internal)} internal hrefs')
    cta_ok=('/contacts/' in normalized_internal or '/lead/request/' in normalized_internal or page['pageType']=='legal')
    check('cta','pass' if cta_ok or not page.get('ctaRequired') else 'warning','conversion/contact path present' if cta_ok else 'required CTA target missing')
    check('viewport','pass' if meta_content(p,'viewport')=='width=device-width, initial-scale=1' else 'fail',meta_content(p,'viewport') or 'missing')
    check('robotsTxt','pass' if 'Disallow: /' not in robots_txt and 'Sitemap:' in robots_txt else 'fail','robots.txt allows crawl and declares sitemap')

    ai = page.get('aiVisibility') or {}
    ai_required = bool(ai_contract) and page.get('indexable', False)
    ai_summary = ai.get('aiSummary', '')
    check('aiSummary','pass' if (not ai_required or len(ai_summary) >= 80) else 'warning',f'{len(ai_summary)} chars')
    entities = ai.get('entities') or []
    entity_names = [e.get('name','') for e in entities if isinstance(e, dict)]
    brand_present = 'КИБЕР ПОРТАЛ' in entity_names
    primary_present = any(lc(page['primaryKeyword']) == lc(name) or contains(name, page['primaryKeyword']) or contains(page['primaryKeyword'], name) for name in entity_names)
    check('entityClarity','pass' if (not ai_required or (brand_present and primary_present)) else 'warning',f'entities: {", ".join(entity_names[:6])}')
    questions = ai.get('userQuestionsAnswered') or []
    min_questions = 3 if page['pageType'] != 'robot_card' else 5
    check('questionAnswerBlocks','pass' if (not ai_required or len(questions) >= min_questions) else 'warning',f'{len(questions)} questions; target {min_questions}')
    factual_claims = ai.get('factualClaims') or []
    allowed_sources = {'owner_approved','page_content','manufacturer','needs_review'}
    bad_sources = [c.get('source') for c in factual_claims if isinstance(c, dict) and c.get('source') not in allowed_sources]
    check('reviewSourceForClaims','pass' if (not ai_required or (factual_claims and not bad_sources)) else 'warning',f'{len(factual_claims)} claims; bad sources: {bad_sources[:3]}')
    has_structured_facts = bool(re.search(r'(Формат|Сценарии|Факты|Стоимость|Условия|Реквизиты|Контакты)', text, re.I))
    check('structuredFacts','pass' if (not ai_required or has_structured_facts or page['pageType'] in ['home','article','legal']) else 'warning','structured fact labels present' if has_structured_facts else 'facts should be exposed as table/list/QA block')
    faq = ai.get('faqQuestions') or []
    faq_required = page['pageType'] in ['robot_card','collection']
    check('faqQuestions','pass' if (not ai_required or not faq_required or faq) else 'warning',f'{len(faq)} FAQ questions')
    llms_has_route = (page['canonical'] in llms_txt) or (route == '/' and 'https://www.kiber-portal.ru/' in llms_txt)
    llms_status = 'pass' if (not ai_required or llms_has_route or page['pageType'] in ['legal','conversion']) else 'warning'
    check('llmsTxtCoverage', llms_status, 'canonical listed in public/llms.txt' if llms_has_route else 'route not listed in public/llms.txt')
    markdown_path = ai.get('llmMarkdownPath')
    check('markdownAlternateOrLlmsEntry','pass' if (not ai_required or markdown_path or llms_has_route or page['pageType'] in ['legal','conversion']) else 'warning','markdown alternate present or covered by llms.txt' if (markdown_path or llms_has_route) else 'no markdown alternate and no llms.txt entry')
    robots_has_oai = 'OAI-SearchBot' in robots_txt
    robots_has_chatgpt_user = 'ChatGPT-User' in robots_txt
    robots_has_gptbot = 'GPTBot' in robots_txt
    if ai_contract and ai_contract.get('robotsPolicyDecisionRequired'):
        check('aiCrawlerRobotsPolicy','warning' if not (robots_has_oai and robots_has_chatgpt_user and robots_has_gptbot) else 'pass','owner decision required for OAI-SearchBot / ChatGPT-User / GPTBot policy')
    else:
        check('aiCrawlerRobotsPolicy','pass','no separate AI crawler decision required')
    img_alt_text = ' '.join(img.get('alt','') for img in p.images)
    critical_terms=[page['primaryKeyword'], 'КИБЕР ПОРТАЛ']
    only_in_images=[term for term in critical_terms if contains(img_alt_text, term) and not contains(text, term)]
    check('contentNotHiddenInImagesOrClientJs','pass' if not only_in_images else 'warning','critical facts visible in HTML text' if not only_in_images else 'critical terms appear only in image alt: '+', '.join(only_in_images))
    related_pages = ai.get('relatedPages') or []
    check('internalEntityLinks','pass' if (not ai_required or related_pages or internal) else 'warning',f'{len(related_pages)} AI related pages; {len(internal)} rendered internal links')

    status='fail' if failures else ('warning' if warnings else 'pass')
    return {'slug':route,'pageType':page['pageType'],'status':status,'checks':checks,'missing':failures,'warnings':warnings,'rendered':{'title':title,'description':desc,'h1':h1s[0] if h1s else None,'h2Count':len(h2s),'schemaTypes':types,'visibleTextChars':useful}}

def build_remediation_backlog(report):
    routes = report['routes']
    warning_routes = {}
    for route in routes:
        for key, value in route.get('checks', {}).items():
            if value.get('status') == 'warning':
                warning_routes.setdefault(key, []).append(route['slug'])
    def routes_for(keys):
        out=[]
        for key in keys:
            out.extend(warning_routes.get(key, []))
        return sorted(set(out))
    safety={'productionDeploy':False,'dnsChange':False,'secretsChanged':False,'analyticsActivation':False,'liveLeadRouting':False,'massPageGeneration':False}
    tasks=[
        {
            'id':'seo-robot-template-keyword-intent-and-cta',
            'title':'Strengthen robot detail template keyword intent and safe CTA coverage',
            'status':'ready_for_next_issue',
            'owner':'agent_can_prepare_pr_then_owner_reviews_copy_and_visuals',
            'warningKeys':['primaryKeywordInTitle','primaryKeywordInH1','primaryKeywordInFirstBlock','secondaryKeywords','h1MatchesPassport','cta'],
            'routes':routes_for(['primaryKeywordInTitle','primaryKeywordInH1','primaryKeywordInFirstBlock','secondaryKeywords','h1MatchesPassport','cta']),
            'recommendedNextWork':['Align SEO passports with approved visible H1/title where visual copy is intentionally different.','Add visible short-answer/AI summary blocks only after design review.','Improve robot detail copy from source-of-truth without inventing prices or capabilities.','Keep price claims tied to approved tariff/source-of-truth data.'],
            'safety':safety,
        },
        {
            'id':'seo-index-pages-faq-breadcrumbs-schema',
            'title':'Add FAQ/breadcrumb/schema coverage for category and index pages',
            'status':'requires_design_review',
            'owner':'agent_can_prepare_patterns_owner_approves_visible_blocks',
            'warningKeys':['faqQuestions','breadcrumbs','requiredSchemaTypes'],
            'routes':routes_for(['faqQuestions','breadcrumbs','requiredSchemaTypes']),
            'recommendedNextWork':['Prepare approved visual pattern for visible breadcrumbs on category/contact/index pages.','Add FAQ questions to collection/category AI passports and decide which are visible.','Use WebPage/CollectionPage/BreadcrumbList schema according to page type without pretending article index is an article detail.'],
            'safety':safety,
        },
        {
            'id':'seo-markdown-alternates-for-llm',
            'title':'Generate Markdown alternates for LLM-friendly retrieval',
            'status':'requires_owner_content_review',
            'owner':'agent_can_generate_review_only_first_owner_approves_public_policy',
            'warningKeys':['markdownAlternateOrLlmsEntry','aiSummary','structuredFacts','questionAnswerBlocks'],
            'routes':[route['slug'] for route in routes if route.get('pageType') in ['home','robot_card','collection','article','news','contacts']],
            'recommendedNextWork':['Generate review-only Markdown from canonical source-of-truth, not from scraped rendered HTML.','Add rel=alternate type=text/markdown only after public policy review.','Keep /llms.txt as the current baseline until markdown alternates are approved.'],
            'safety':safety,
        },
    ]
    tasks=[task for task in tasks if task['routes']]
    completed=[
        {
            'id':'seo-audit-cta-query-string-detection',
            'title':'CTA auditor recognizes lead-request links with query strings',
            'status':'completed_in_kiber93',
            'warningKeys':['cta'],
            'routes':['/robots/*'],
            'evidence':'Robot pages link to /lead/request/?scenario=... and are now counted as CTA-covered.',
            'safety':safety,
        },
        {
            'id':'seo-legal-conversion-webpage-schema',
            'title':'Legal and conversion pages expose WebPage JSON-LD',
            'status':'completed_in_kiber93',
            'warningKeys':['requiredSchemaTypes'],
            'routes':['/privacy-policy/','/consent/','/cookie-policy/','/terms/','/lead/request/','/lead/thanks/'],
            'evidence':'WebPage JSON-LD wired via LegalDocumentPage and lead utility pages without changing legal copy or lead routing.',
            'safety':safety,
        },
    ]
    backlog={
        'schemaVersion':1,
        'issue':'KIBER-93',
        'status':'ready_for_owner_review',
        'sourceAudit':'data/seo/page-seo-audit.json',
        'summary':{
            'routesChecked':report['summary']['routesChecked'],
            'technicalFailures':report['summary']['failed'],
            'warningCount':sum(len([v for v in route.get('checks', {}).values() if v.get('status') == 'warning']) for route in routes),
            'routesWithWarnings':report['summary']['warnings'],
            'closedPolicyWarnings':['aiCrawlerRobotsPolicy'],
        },
        'decision':'KIBER-93 infrastructure is complete when audits, passports, AI visibility, llms.txt, robots policy and remediation backlog are in CI. Remaining warnings become follow-up implementation/review tasks, not hidden debt.',
        'completedRemediations':completed,
        'remediationTasks':tasks,
    }
    return backlog

def write_remediation_backlog(report):
    backlog=build_remediation_backlog(report)
    (ROOT/'data/seo/page-seo-remediation-backlog.json').write_text(json.dumps(backlog,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    icon={'ready_for_next_issue':'✅','requires_owner_content_review':'⚠️','requires_design_review':'⚠️'}
    lines=['# KIBER-93 — SEO/AI remediation backlog','','Status: **ready_for_owner_review**','',backlog['decision'],'',f"Routes checked: **{backlog['summary']['routesChecked']}**  ",f"Technical failures: **{backlog['summary']['technicalFailures']}**  ",f"Warning checks preserved: **{backlog['summary']['warningCount']}**  ",f"Routes with warnings: **{backlog['summary']['routesWithWarnings']}**  ",'','## Completed in KIBER-93','']
    for task in backlog['completedRemediations']:
        lines.append(f"### ✅ `{task['id']}` — {task['title']}")
        lines.append(f"- Status: `{task['status']}`")
        lines.append(f"- Warning keys: {', '.join('`'+k+'`' for k in task['warningKeys'])}")
        lines.append(f"- Routes: {', '.join('`'+r+'`' for r in task['routes'])}")
        lines.append(f"- Evidence: {task['evidence']}")
        lines.append('')
    lines.append('## Remaining remediation tasks')
    lines.append('')
    for task in backlog['remediationTasks']:
        lines.append(f"### {icon[task['status']]} `{task['id']}` — {task['title']}")
        lines.append(f"- Status: `{task['status']}`")
        lines.append(f"- Owner/workflow: {task['owner']}")
        lines.append(f"- Warning keys: {', '.join('`'+k+'`' for k in task['warningKeys'])}")
        lines.append(f"- Routes: {len(task['routes'])}")
        if task['routes']:
            lines.append('- Route preview: '+', '.join(f"`{r}`" for r in task['routes'][:12])+(' …' if len(task['routes'])>12 else ''))
        lines.append('- Next work:')
        for item in task['recommendedNextWork']:
            lines.append(f"  - {item}")
        lines.append('')
    lines.append('## Safety boundaries')
    lines.append('')
    lines.append('This backlog does not grant production deploy, DNS, secrets, analytics, live lead routing, PR merge or mass page generation approval.')
    lines.append('')
    (ROOT/'docs/page-seo-remediation-backlog.md').write_text('\n'.join(lines),encoding='utf-8')
    return backlog

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--fail-on-warning', action='store_true'); args=ap.parse_args()
    passports=json.loads((ROOT/'data/seo/page-seo-passports.json').read_text())
    sitemap=(ROOT/'dist/sitemap.xml').read_text(encoding='utf-8', errors='replace') if (ROOT/'dist/sitemap.xml').exists() else ''
    sitemap_locs=set(re.findall(r'<loc>([^<]+)</loc>', sitemap))
    robots_txt=(ROOT/'public/robots.txt').read_text(encoding='utf-8', errors='replace') if (ROOT/'public/robots.txt').exists() else ''
    ai_contract, ai_entity_map, llms_txt = load_ai_support()
    routes=[audit_page(p, sitemap_locs, robots_txt, ai_contract, ai_entity_map, llms_txt) for p in passports['pages']]
    summary={'routesChecked':len(routes),'passed':sum(r['status']=='pass' for r in routes),'warnings':sum(r['status']=='warning' for r in routes),'failed':sum(r['status']=='fail' for r in routes)}
    report={'schemaVersion':1,'issue':'KIBER-93','status':'failed' if summary['failed'] else ('warning' if summary['warnings'] else 'passed'),'summary':summary,'routes':routes}
    (ROOT/'data/seo').mkdir(parents=True, exist_ok=True); (ROOT/'docs').mkdir(parents=True, exist_ok=True)
    (ROOT/'data/seo/page-seo-audit.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    backlog = write_remediation_backlog(report)
    lines=['# KIBER-93 — Page SEO components audit','','Status: **'+report['status']+'**','',f"Checked: {summary['routesChecked']} routes; pass: {summary['passed']}; warnings: {summary['warnings']}; failed: {summary['failed']}",'',f"Remediation backlog: **{len(backlog['remediationTasks'])} tasks** in `data/seo/page-seo-remediation-backlog.json` and `docs/page-seo-remediation-backlog.md`",'','## Per-route summary','']
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
