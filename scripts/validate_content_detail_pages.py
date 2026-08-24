#!/usr/bin/env python3
"""Validate blog/news detail page SEO and live-style template markers."""
from __future__ import annotations

import argparse
import json
import re
from html.parser import HTMLParser
from pathlib import Path

SITE_URL = "https://www.kiber-portal.ru"
REQUIRED_MARKERS = ["article-live-hero", "article-live__body", "article-live__aside", "site-footer--live"]


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.links: list[dict[str, str]] = []
        self.metas: list[dict[str, str]] = []
        self.anchors: list[str] = []
        self.ids: set[str] = set()
        self.scripts: list[str] = []
        self._script_type: str | None = None
        self._script_chunks: list[str] = []

    def handle_starttag(self, tag: str, attrs) -> None:
        data = {k: v or "" for k, v in attrs}
        if data.get("id"):
            self.ids.add(data["id"])
        if tag == "link":
            self.links.append(data)
        elif tag == "meta":
            self.metas.append(data)
        elif tag == "a" and data.get("href"):
            self.anchors.append(data["href"])
        elif tag == "script":
            self._script_type = data.get("type")
            self._script_chunks = []

    def handle_data(self, data: str) -> None:
        if self._script_type == "application/ld+json":
            self._script_chunks.append(data)

    def handle_endtag(self, tag: str) -> None:
        if tag == "script" and self._script_type == "application/ld+json":
            self.scripts.append("".join(self._script_chunks).strip())
        if tag == "script":
            self._script_type = None
            self._script_chunks = []


def parse_frontmatter(path: Path) -> dict[str, str]:
    text = path.read_text(encoding="utf-8")
    if not text.startswith('---'):
        return {}
    fm = text.split('---', 2)[1]
    data: dict[str, str] = {}
    for line in fm.splitlines():
        if ':' not in line or line.startswith(' '):
            continue
        key, value = line.split(':', 1)
        data[key.strip()] = value.strip().strip('"')
    return data


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", default=".")
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()
    root = Path(args.root).resolve()
    sitemap_text = (root / "app/dist/sitemap-0.xml").read_text(encoding="utf-8")

    entries = []
    static_overrides = {'/arenda-robotov-na-meropriyatie', '/roboty-gumanoidy'}
    for path in sorted((root / "app/src/content/blog").glob("*.md")):
        fm = parse_frontmatter(path)
        if fm.get("sourceUrl") and fm["sourceUrl"] not in static_overrides:
            entries.append({"kind": "blog", "sourceUrl": fm["sourceUrl"], "title": fm.get("title", ""), "requiredType": "BlogPosting"})
    for path in sorted((root / "app/src/content/news").glob("*.md")):
        fm = parse_frontmatter(path)
        if fm.get("draft", "true").lower() == "false" and fm.get("sourceUrl"):
            entries.append({"kind": "news", "sourceUrl": fm["sourceUrl"], "title": fm.get("title", ""), "requiredType": "NewsArticle"})

    errors: list[dict[str, str]] = []
    warnings: list[dict[str, str]] = []
    checked: list[dict[str, object]] = []
    for entry in entries:
        url_path = entry["sourceUrl"]
        html_path = root / "app/dist" / url_path.strip("/") / "index.html"
        if not html_path.exists():
            errors.append({"url": url_path, "code": "missing_html", "message": str(html_path)})
            continue
        html = html_path.read_text(encoding="utf-8")
        hp = PageParser()
        hp.feed(html)
        canonical = next((link.get("href") or "" for link in hp.links if link.get("rel") == "canonical"), "")
        expected = f"{SITE_URL}{url_path}"
        og_url = next((m.get("content") or "" for m in hp.metas if m.get("property") == "og:url"), "")
        robots_meta = next((m.get("content") or "" for m in hp.metas if m.get("name") == "robots"), "")
        json_ld = []
        for script in hp.scripts:
            try:
                parsed = json.loads(script)
                json_ld.extend(parsed if isinstance(parsed, list) else [parsed])
            except json.JSONDecodeError as exc:
                errors.append({"url": url_path, "code": "invalid_json_ld", "message": str(exc)})
        types = {str(item.get("@type")) for item in json_ld if isinstance(item, dict) and item.get("@type")}
        if canonical != expected:
            errors.append({"url": url_path, "code": "canonical_mismatch", "message": f"{canonical} != {expected}"})
        if og_url != expected:
            errors.append({"url": url_path, "code": "og_url_mismatch", "message": f"{og_url} != {expected}"})
        if robots_meta != "index,follow":
            errors.append({"url": url_path, "code": "robots_meta_mismatch", "message": robots_meta})
        if entry["requiredType"] not in types or "BreadcrumbList" not in types:
            errors.append({"url": url_path, "code": "missing_jsonld_types", "message": ",".join(sorted(types))})
        if expected not in sitemap_text:
            errors.append({"url": url_path, "code": "missing_from_sitemap", "message": expected})
        for marker in REQUIRED_MARKERS:
            if marker not in html:
                errors.append({"url": url_path, "code": "missing_template_marker", "message": marker})
        for href in hp.anchors:
            if href.startswith("#") and len(href) > 1 and href[1:] not in hp.ids:
                errors.append({"url": url_path, "code": "broken_fragment_link", "message": href})
        checked.append({"url": url_path, "kind": entry["kind"], "jsonLdTypes": sorted(types), "canonical": canonical})

    result = {"ok": not errors, "summary": {"detailPages": len(entries), "checkedPages": len(checked), "errors": len(errors), "warnings": len(warnings)}, "errors": errors, "warnings": warnings, "checked": checked}
    print(json.dumps(result, ensure_ascii=False, indent=2) if args.json else result)
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
