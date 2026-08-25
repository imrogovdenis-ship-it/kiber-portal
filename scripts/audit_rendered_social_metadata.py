#!/usr/bin/env python3
"""Audit rendered Open Graph and Twitter metadata for public KIBER PORTAL pages."""
from __future__ import annotations

import argparse
import json
from html.parser import HTMLParser
from pathlib import Path
from typing import Any

CANONICAL_DOMAIN = "https://www.kiber-portal.ru"


class SocialParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.robots: str | None = None
        self.meta_name: dict[str, str] = {}
        self.meta_property: dict[str, str] = {}
        self.canonical: str | None = None

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        data = dict(attrs)
        if tag == "meta" and data.get("name") and data.get("content") is not None:
            self.meta_name[str(data["name"])] = str(data.get("content") or "")
        if tag == "meta" and data.get("property") and data.get("content") is not None:
            self.meta_property[str(data["property"])] = str(data.get("content") or "")
        if tag == "link" and data.get("rel") == "canonical" and data.get("href"):
            self.canonical = str(data["href"])
        if tag == "meta" and data.get("name") == "robots":
            self.robots = data.get("content")


def route_for_html(dist: Path, html_path: Path) -> str:
    rel = html_path.relative_to(dist)
    if rel == Path("index.html"):
        return "/"
    if rel.name == "index.html":
        return "/" + str(rel.parent).replace("\\", "/")
    return "/" + str(rel).removesuffix(".html").replace("\\", "/")


def validate(root: Path) -> dict[str, Any]:
    dist = root / "app" / "dist"
    html_files = sorted(set(dist.rglob("index.html")) | set(dist.glob("*.html")))
    errors: list[dict[str, str]] = []
    warnings: list[dict[str, str]] = []
    checked: list[dict[str, Any]] = []

    required_property = ["og:type", "og:site_name", "og:title", "og:description", "og:url", "og:image"]
    required_name = ["twitter:card", "twitter:title", "twitter:description", "twitter:image"]

    for html_path in html_files:
        route = route_for_html(dist, html_path)
        parser = SocialParser()
        parser.feed(html_path.read_text(encoding="utf-8", errors="replace"))
        if parser.robots == "noindex,nofollow":
            continue

        for key in required_property:
            if not parser.meta_property.get(key):
                errors.append({"code": "og_missing", "route": route, "message": f"{key} missing or empty"})
        for key in required_name:
            if not parser.meta_name.get(key):
                errors.append({"code": "twitter_missing", "route": route, "message": f"{key} missing or empty"})

        og_url = parser.meta_property.get("og:url")
        if og_url and parser.canonical and og_url != parser.canonical:
            errors.append({"code": "og_url_canonical_mismatch", "route": route, "message": f"og:url {og_url!r} != canonical {parser.canonical!r}"})
        for key in ["og:url", "og:image"]:
            value = parser.meta_property.get(key, "")
            if value and not value.startswith(CANONICAL_DOMAIN):
                errors.append({"code": "og_not_absolute_live_domain", "route": route, "message": f"{key} should start with {CANONICAL_DOMAIN}: {value}"})
        twitter_image = parser.meta_name.get("twitter:image", "")
        og_image = parser.meta_property.get("og:image", "")
        if twitter_image and og_image and twitter_image != og_image:
            warnings.append({"code": "twitter_image_differs", "route": route, "message": "twitter:image differs from og:image"})
        twitter_card = parser.meta_name.get("twitter:card")
        if twitter_card not in {"summary", "summary_large_image"}:
            errors.append({"code": "twitter_card_invalid", "route": route, "message": f"Unexpected twitter:card {twitter_card!r}"})

        checked.append({
            "route": route,
            "canonical": parser.canonical,
            "ogTitle": parser.meta_property.get("og:title"),
            "ogImage": parser.meta_property.get("og:image"),
            "twitterCard": parser.meta_name.get("twitter:card"),
        })

    return {
        "ok": not errors,
        "summary": {"publicPagesChecked": len(checked), "errors": len(errors), "warnings": len(warnings)},
        "errors": errors,
        "warnings": warnings,
        "checked": checked,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", default=".")
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()
    report = validate(Path(args.root).resolve())
    if args.json:
        print(json.dumps(report, ensure_ascii=False, indent=2))
    else:
        print(f"social metadata audit: ok={report['ok']} publicPagesChecked={report['summary']['publicPagesChecked']} errors={report['summary']['errors']} warnings={report['summary']['warnings']}")
        for issue in report["errors"][:20]:
            print(f"ERROR {issue['code']} {issue['route']}: {issue['message']}")
        for issue in report["warnings"][:20]:
            print(f"WARN {issue['code']} {issue['route']}: {issue['message']}")
    return 0 if report["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
