#!/usr/bin/env python3
"""Validate content index pages: articles, compilations, news."""
from __future__ import annotations

import argparse
import json
import re
from html.parser import HTMLParser
from pathlib import Path

SITE_URL = "https://www.kiber-portal.ru"
PAGES = [
    {"slug": "articles", "title": "Блог Кибер Гоши | КИБЕР ПОРТАЛ", "types": {"Blog", "BreadcrumbList"}, "minLinks": 5},
    {"slug": "compilations", "title": "Подборки роботов для мероприятий | КИБЕР ПОРТАЛ", "types": {"CollectionPage", "BreadcrumbList"}, "minLinks": 4},
    {"slug": "news", "title": "Новости про роботов | КИБЕР ПОРТАЛ", "types": {"CollectionPage", "BreadcrumbList"}, "minLinks": 0},
]
REQUIRED_MARKERS = ["content-live-hero", "content-live-feed", "site-footer--live"]


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


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", default=".")
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()
    root = Path(args.root).resolve()
    sitemap_text = (root / "app/dist/sitemap-0.xml").read_text(encoding="utf-8")
    errors: list[dict[str, str]] = []
    warnings: list[dict[str, str]] = []
    checked: list[dict[str, object]] = []

    for spec in PAGES:
        slug = spec["slug"]
        path = f"/{slug}"
        html_path = root / "app/dist" / slug / "index.html"
        if not html_path.exists():
            errors.append({"slug": slug, "code": "missing_html", "message": str(html_path)})
            continue
        html = html_path.read_text(encoding="utf-8")
        hp = PageParser()
        hp.feed(html)
        canonical = next((link.get("href") or "" for link in hp.links if link.get("rel") == "canonical"), "")
        expected = f"{SITE_URL}{path}"
        og_url = next((m.get("content") or "" for m in hp.metas if m.get("property") == "og:url"), "")
        og_image = next((m.get("content") or "" for m in hp.metas if m.get("property") == "og:image"), "")
        robots_meta = next((m.get("content") or "" for m in hp.metas if m.get("name") == "robots"), "")
        title_match = re.search(r"<title>(.*?)</title>", html, re.S)
        title = title_match.group(1).strip() if title_match else ""
        json_ld = []
        for script in hp.scripts:
            try:
                parsed = json.loads(script)
                json_ld.extend(parsed if isinstance(parsed, list) else [parsed])
            except json.JSONDecodeError as exc:
                errors.append({"slug": slug, "code": "invalid_json_ld", "message": str(exc)})
        types = {str(item.get("@type")) for item in json_ld if isinstance(item, dict) and item.get("@type")}
        if canonical != expected:
            errors.append({"slug": slug, "code": "canonical_mismatch", "message": f"{canonical} != {expected}"})
        if og_url != expected:
            errors.append({"slug": slug, "code": "og_url_mismatch", "message": f"{og_url} != {expected}"})
        if robots_meta != "index,follow":
            errors.append({"slug": slug, "code": "robots_meta_mismatch", "message": robots_meta})
        if title != spec["title"]:
            errors.append({"slug": slug, "code": "title_mismatch", "message": title})
        if not og_image.startswith(SITE_URL + "/"):
            warnings.append({"slug": slug, "code": "missing_or_relative_og_image", "message": og_image})
        if expected not in sitemap_text:
            errors.append({"slug": slug, "code": "missing_from_sitemap", "message": expected})
        for marker in REQUIRED_MARKERS:
            if marker not in html:
                errors.append({"slug": slug, "code": "missing_template_marker", "message": marker})
        missing_types = sorted(spec["types"] - types)
        if missing_types:
            errors.append({"slug": slug, "code": "missing_jsonld_types", "message": ",".join(missing_types)})
        internal_links = [href for href in hp.anchors if href.startswith("/") and href != path]
        if len(internal_links) < spec["minLinks"]:
            errors.append({"slug": slug, "code": "internal_links_low", "message": str(len(internal_links))})
        for href in hp.anchors:
            if href.startswith("#") and len(href) > 1 and href[1:] not in hp.ids:
                errors.append({"slug": slug, "code": "broken_fragment_link", "message": href})
            if href.startswith(path + "#"):
                target = href.split("#", 1)[1]
                if target and target not in hp.ids:
                    errors.append({"slug": slug, "code": "broken_fragment_link", "message": href})
        checked.append({"slug": slug, "canonical": canonical, "jsonLdTypes": sorted(types), "internalLinks": len(internal_links), "ogImage": og_image})

    result = {"ok": not errors, "summary": {"contentIndexPages": len(PAGES), "checkedPages": len(checked), "errors": len(errors), "warnings": len(warnings)}, "errors": errors, "warnings": warnings, "checked": checked}
    print(json.dumps(result, ensure_ascii=False, indent=2) if args.json else result)
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
