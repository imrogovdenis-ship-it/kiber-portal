#!/usr/bin/env python3
"""Dry-run mapper from KIBER Claude content package to preview file plan.

This script intentionally does not write preview files unless a future explicit
--write-preview mode is implemented. Current output is a proposed file map only.
"""
from __future__ import annotations
import argparse, json, re, sys, datetime
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
SLUG_RE = re.compile(r"^[a-z0-9][a-z0-9-]{1,120}$")
PAGE_PREFIX = {
    "article_detail": "src/pages/preview/kiber-94/articles",
    "compilation": "src/pages/preview/kiber-94/compilation",
    "robot_card": "src/pages/preview/kiber-94/robots",
}
LIB_PREFIX = {
    "article_detail": "src/lib/kiber94-article",
    "compilation": "src/lib/kiber94-compilation",
    "robot_card": "src/lib/kiber94-robot",
}
def main() -> int:
    ap=argparse.ArgumentParser()
    ap.add_argument("package")
    args=ap.parse_args()
    p=Path(args.package)
    if not p.is_absolute(): p=ROOT/p
    pkg=json.loads(p.read_text(encoding='utf-8'))
    page_type=pkg.get('pageType'); slug=pkg.get('slug')
    errors=[]
    if page_type not in PAGE_PREFIX: errors.append(f'unsupported pageType {page_type}')
    if not isinstance(slug,str) or not SLUG_RE.match(slug): errors.append(f'invalid slug {slug!r}')
    if errors:
        print(json.dumps({'valid':False,'errors':errors},ensure_ascii=False,indent=2)); return 1
    data_file=f"{LIB_PREFIX[page_type]}-{slug}-data.ts"
    route_file=f"{PAGE_PREFIX[page_type]}/{slug}/index.astro"
    report={
      'schemaVersion':1,
      'timestamp':datetime.datetime.now(datetime.timezone.utc).isoformat(),
      'mode':'dry-run',
      'package':str(p.relative_to(ROOT)),
      'pageType':page_type,
      'slug':slug,
      'proposedFiles':[data_file, route_file, f"docs/review/claude-content-intake/{slug}/README.md"],
      'requiredRouteProperties':{'previewOnly':True,'xRobotsTag':'noindex, nofollow','ownerReviewRequired':True},
      'willWrite':False,
      'publicationAllowed':False
    }
    print(json.dumps(report,ensure_ascii=False,indent=2))
    return 0
if __name__=='__main__': raise SystemExit(main())
