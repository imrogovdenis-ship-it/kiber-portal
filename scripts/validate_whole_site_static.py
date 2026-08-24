#!/usr/bin/env python3
"""Whole-site static validation for built Astro output."""
from __future__ import annotations

import argparse
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse, unquote

SITE_URL = "https://www.kiber-portal.ru"
IGNORE_PREFIXES = ("tel:", "mailto:", "http://", "https://", "javascript:")


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.links: list[dict[str, str]] = []
        self.metas: list[dict[str, str]] = []
        self.anchors: list[str] = []
        self.images: list[str] = []
        self.scripts: list[str] = []
        self.ids: set[str] = set()
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
        elif tag == "img" and data.get("src"):
            self.images.append(data["src"])
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


def route_for_html(dist: Path, html_path: Path) -> str:
    rel = html_path.relative_to(dist)
    if rel.name != "index.html":
        return "/" + str(rel).replace("index.html", "").strip("/")
    parent = str(rel.parent).strip(".")
    return "/" if parent in ("", ".") else "/" + parent.strip("/")


def local_asset_exists(root: Path, dist: Path, url: str) -> bool:
    parsed = urlparse(url)
    path = unquote(parsed.path)
    if not path.startswith("/"):
        return True
    return (dist / path.lstrip("/")).exists() or (root / "app/public" / path.lstrip("/")).exists()


def local_route_exists(dist: Path, href: str) -> bool:
    parsed = urlparse(href)
    path = parsed.path or "/"
    if not path.startswith("/"):
        return True
    if path == "/":
        return (dist / "index.html").exists()
    return (dist / path.lstrip("/") / "index.html").exists() or (dist / path.lstrip("/")).exists()


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", default=".")
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()
    root = Path(args.root).resolve()
    dist = root / "app/dist"
    sitemap_text = (dist / "sitemap-0.xml").read_text(encoding="utf-8") if (dist / "sitemap-0.xml").exists() else ""
    html_files = sorted(dist.rglob("index.html"))
    errors: list[dict[str, str]] = []
    warnings: list[dict[str, str]] = []
    checked = []

    preview_routes = 0
    public_routes = 0
    for html_path in html_files:
        route = route_for_html(dist, html_path)
        html = html_path.read_text(encoding="utf-8")
        hp = PageParser()
        hp.feed(html)
        title_match = re.search(r"<title>(.*?)</title>", html, re.S)
        title = title_match.group(1).strip() if title_match else ""
        description = next((m.get("content") or "" for m in hp.metas if m.get("name") == "description"), "")
        canonical = next((l.get("href") or "" for l in hp.links if l.get("rel") == "canonical"), "")
        expected = f"{SITE_URL}{'' if route == '/' else route}"
        robots = next((m.get("content") or "" for m in hp.metas if m.get("name") == "robots"), "")
        schema_count = len(hp.scripts)
        is_preview = route.startswith("/parity") or route in {"/design-review", "/news-v2"} or robots == "noindex,nofollow"
        if is_preview:
            preview_routes += 1
        else:
            public_routes += 1
        if not title:
            errors.append({"route": route, "code": "missing_title", "message": str(html_path)})
        if not description and not is_preview:
            warnings.append({"route": route, "code": "missing_description", "message": str(html_path)})
        if not is_preview and canonical != expected:
            errors.append({"route": route, "code": "canonical_mismatch", "message": f"{canonical} != {expected}"})
        if robots not in {"index,follow", "noindex,nofollow"}:
            errors.append({"route": route, "code": "robots_meta_mismatch", "message": robots})
        if robots == "index,follow" and expected not in sitemap_text:
            errors.append({"route": route, "code": "missing_from_sitemap", "message": expected})
        if schema_count == 0 and not is_preview:
            warnings.append({"route": route, "code": "missing_jsonld", "message": "no application/ld+json"})
        for img in hp.images:
            if img.startswith("data:") or img.startswith("http"):
                continue
            if not local_asset_exists(root, dist, img):
                errors.append({"route": route, "code": "missing_image_asset", "message": img})
        for href in hp.anchors:
            if is_preview:
                continue
            if href.startswith(IGNORE_PREFIXES) or href == "#":
                continue
            if href.startswith("#"):
                if len(href) > 1 and href[1:] not in hp.ids:
                    errors.append({"route": route, "code": "broken_fragment", "message": href})
                continue
            if href.startswith("/"):
                parsed = urlparse(href)
                if parsed.fragment and parsed.path in {"", route} and parsed.fragment not in hp.ids:
                    errors.append({"route": route, "code": "broken_fragment", "message": href})
                if not local_route_exists(dist, href):
                    errors.append({"route": route, "code": "missing_internal_route", "message": href})
        checked.append({"route": route, "title": bool(title), "description": bool(description), "canonical": canonical, "robots": robots, "schemaCount": schema_count, "images": len(hp.images), "links": len(hp.anchors)})

    result = {"ok": not errors, "summary": {"htmlPages": len(html_files), "publicPages": public_routes, "previewPages": preview_routes, "checkedPages": len(checked), "errors": len(errors), "warnings": len(warnings)}, "errors": errors, "warnings": warnings, "checked": checked}
    print(json.dumps(result, ensure_ascii=False, indent=2) if args.json else result)
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
