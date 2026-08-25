#!/usr/bin/env python3
"""Validate rendered public Astro HTML pages for SEO migration guardrails."""
from __future__ import annotations

import argparse
import json
from html.parser import HTMLParser
from pathlib import Path
from typing import Any

class HtmlSeoParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.h1 = 0
        self.title = False
        self.description = False
        self.canonical = False
        self.robots_meta: str | None = None
        self.og_title = False
        self.og_description = False
        self.og_image = False
        self.json_ld = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        data = dict(attrs)
        if tag == 'h1':
            self.h1 += 1
        if tag == 'title':
            self.title = True
        if tag == 'meta' and data.get('name') == 'description' and data.get('content'):
            self.description = True
        if tag == 'meta' and data.get('name') == 'robots' and data.get('content'):
            self.robots_meta = data.get('content')
        if tag == 'link' and data.get('rel') == 'canonical' and data.get('href'):
            self.canonical = True
        if tag == 'meta' and data.get('property') == 'og:title' and data.get('content'):
            self.og_title = True
        if tag == 'meta' and data.get('property') == 'og:description' and data.get('content'):
            self.og_description = True
        if tag == 'meta' and data.get('property') == 'og:image' and data.get('content'):
            self.og_image = True
        if tag == 'script' and data.get('type') == 'application/ld+json':
            self.json_ld += 1


def page_route(dist: Path, file: Path) -> str:
    rel = file.relative_to(dist)
    if rel == Path('index.html'):
        return '/'
    if rel.name == 'index.html':
        return '/' + str(rel.parent).replace('\\', '/')
    return '/' + str(rel).replace('\\', '/')


def validate(root: Path) -> dict[str, Any]:
    dist = root / 'app' / 'dist'
    errors: list[dict[str, str]] = []
    warnings: list[dict[str, str]] = []
    html_files = sorted(
        p for p in dist.glob('**/*.html')
        if not p.relative_to(dist).parts[0] in {'files', 'assets'}
    )

    sitemap_text = '\n'.join(p.read_text(encoding='utf-8', errors='replace') for p in dist.glob('sitemap*.xml'))
    if '/parity/' in sitemap_text:
        errors.append({'code': 'parity_in_sitemap', 'route': 'sitemap', 'message': 'Parity routes must be excluded from sitemap.'})

    for file in html_files:
        route = page_route(dist, file)
        html = file.read_text(encoding='utf-8', errors='replace')
        parser = HtmlSeoParser()
        parser.feed(html)
        is_parity = route.startswith('/parity/')
        is_review_preview = route in {'/design-review', '/news-v2', '/404.html'}
        if is_parity or is_review_preview:
            if parser.robots_meta != 'noindex,nofollow':
                errors.append({'code': 'preview_not_noindex', 'route': route, 'message': f'Preview robots meta is {parser.robots_meta!r}'})
            if route != '/parity/articles' and parser.h1 != 1:
                errors.append({'code': 'preview_invalid_h1_count', 'route': route, 'message': f'Expected 1 h1, got {parser.h1}'})
            continue

        if parser.h1 != 1:
            errors.append({'code': 'invalid_h1_count', 'route': route, 'message': f'Expected 1 h1, got {parser.h1}'})
        for attr, code in [('description','meta_description_missing'), ('canonical','canonical_missing'), ('og_title','og_title_missing'), ('og_description','og_description_missing')]:
            if not getattr(parser, attr):
                errors.append({'code': code, 'route': route, 'message': f'{attr} missing'})
        if parser.robots_meta == 'noindex,nofollow':
            errors.append({'code': 'public_noindex', 'route': route, 'message': 'Public route is noindex.'})

    return {'ok': not errors, 'summary': {'htmlPages': len(html_files), 'errors': len(errors), 'warnings': len(warnings)}, 'errors': errors, 'warnings': warnings}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--root', default='.')
    ap.add_argument('--json', action='store_true')
    args = ap.parse_args()
    report = validate(Path(args.root))
    if args.json:
        print(json.dumps(report, ensure_ascii=False, indent=2))
    else:
        print(f"public page validation: ok={report['ok']} htmlPages={report['summary']['htmlPages']} errors={report['summary']['errors']} warnings={report['summary']['warnings']}")
        for issue in report['errors'][:20]:
            print(f"ERROR {issue['code']} {issue['route']}: {issue['message']}")
        for issue in report['warnings'][:20]:
            print(f"WARN {issue['code']} {issue['route']}: {issue['message']}")
    return 0 if report['ok'] else 1

if __name__ == '__main__':
    raise SystemExit(main())
