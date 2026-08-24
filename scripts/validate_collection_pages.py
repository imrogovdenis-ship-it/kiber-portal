#!/usr/bin/env python3
"""Validate collection page SEO/schema/internal-link contracts in built Astro output."""
from __future__ import annotations

import argparse
import json
import re
from html.parser import HTMLParser
from pathlib import Path

SITE_URL = "https://www.kiber-portal.ru"
COLLECTIONS = [
    {
        "slug": "arenda-robotov-na-meropriyatie",
        "sourceUrl": "/arenda-robotov-na-meropriyatie",
        "title": "Аренда роботов на мероприятие | КИБЕР ПОРТАЛ",
        "minItems": 20,
    },
    {
        "slug": "roboty-gumanoidy",
        "sourceUrl": "/roboty-gumanoidy",
        "title": "Аренда роботов-гуманоидов для мероприятий | КИБЕР ПОРТАЛ",
        "minItems": 4,
    },
]
REQUIRED_MARKERS = [
    "collection-live-hero",
    "collection-live-intro",
    "collection-live-catalog",
    "collection-live-cta",
    "robot-card-grid",
    "site-footer--live",
]


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
    robots = json.loads((root / "data/models/robots.source-of-truth.json").read_text(encoding="utf-8"))["robots"]
    robot_urls = {robot["page"]["url"] for robot in robots}
    sitemap_text = (root / "app/dist/sitemap-0.xml").read_text(encoding="utf-8")

    errors: list[dict[str, str]] = []
    warnings: list[dict[str, str]] = []
    checked: list[dict[str, object]] = []

    for spec in COLLECTIONS:
        slug = spec["slug"]
        path = spec["sourceUrl"]
        html_path = root / "app/dist" / slug / "index.html"
        if not html_path.exists():
            errors.append({"slug": slug, "code": "missing_html", "message": str(html_path)})
            continue
        html = html_path.read_text(encoding="utf-8")
        hp = PageParser()
        hp.feed(html)

        canonical = next((link.get("href") or "" for link in hp.links if link.get("rel") == "canonical"), "")
        expected_canonical = f"{SITE_URL}{path}"
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
        types = [item.get("@type") for item in json_ld if isinstance(item, dict)]
        collection_ld = next((item for item in json_ld if isinstance(item, dict) and item.get("@type") == "CollectionPage"), None)
        breadcrumb_ld = next((item for item in json_ld if isinstance(item, dict) and item.get("@type") == "BreadcrumbList"), None)

        if canonical != expected_canonical:
            errors.append({"slug": slug, "code": "canonical_mismatch", "message": f"{canonical} != {expected_canonical}"})
        if og_url != expected_canonical:
            errors.append({"slug": slug, "code": "og_url_mismatch", "message": f"{og_url} != {expected_canonical}"})
        if robots_meta != "index,follow":
            errors.append({"slug": slug, "code": "robots_meta_mismatch", "message": robots_meta})
        if title != spec["title"]:
            errors.append({"slug": slug, "code": "title_mismatch", "message": title})
        if not og_image.startswith(SITE_URL + "/"):
            warnings.append({"slug": slug, "code": "missing_or_relative_og_image", "message": og_image})
        if expected_canonical not in sitemap_text:
            errors.append({"slug": slug, "code": "missing_from_sitemap", "message": expected_canonical})
        for marker in REQUIRED_MARKERS:
            if marker not in html:
                errors.append({"slug": slug, "code": "missing_template_marker", "message": marker})
        if not collection_ld:
            errors.append({"slug": slug, "code": "missing_collection_jsonld", "message": "CollectionPage"})
        else:
            item_list = collection_ld.get("mainEntity", {}) if isinstance(collection_ld.get("mainEntity"), dict) else {}
            count = len(item_list.get("itemListElement", []))
            if count < spec["minItems"]:
                errors.append({"slug": slug, "code": "collection_item_count_low", "message": str(count)})
        if not breadcrumb_ld:
            errors.append({"slug": slug, "code": "missing_breadcrumb_jsonld", "message": "BreadcrumbList"})

        linked_robot_urls = sorted(robot_urls.intersection(set(hp.anchors)))
        if len(linked_robot_urls) < spec["minItems"]:
            errors.append({"slug": slug, "code": "robot_links_low", "message": str(len(linked_robot_urls))})
        for href in hp.anchors:
            if href.startswith("#") and len(href) > 1 and href[1:] not in hp.ids:
                errors.append({"slug": slug, "code": "broken_fragment_link", "message": href})
            if href.startswith(path + "#"):
                target_id = href.split("#", 1)[1]
                if target_id and target_id not in hp.ids:
                    errors.append({"slug": slug, "code": "broken_fragment_link", "message": href})
        checked.append({
            "slug": slug,
            "canonical": canonical,
            "jsonLdTypes": types,
            "robotLinks": len(linked_robot_urls),
            "ogImage": og_image,
        })

    result = {
        "ok": not errors,
        "summary": {
            "collectionPages": len(COLLECTIONS),
            "checkedPages": len(checked),
            "errors": len(errors),
            "warnings": len(warnings),
        },
        "errors": errors,
        "warnings": warnings,
        "checked": checked,
    }
    print(json.dumps(result, ensure_ascii=False, indent=2) if args.json else result)
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
