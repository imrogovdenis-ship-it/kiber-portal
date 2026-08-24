#!/usr/bin/env python3
"""Validate robot detail SEO/schema/internal-linking contracts in built Astro output."""
from __future__ import annotations

import argparse
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse

SITE_URL = "https://www.kiber-portal.ru"
REQUIRED_MARKERS = [
    "robot-hero--live",
    "robot-live-intro",
    "robot-live-gallery",
    "robot-live-cta-strip",
    "robot-live-faq",
    "robot-live-gosha",
    "robot-live-related",
    "site-footer--live",
]


class HeadAndLinkParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.links: list[dict[str, str]] = []
        self.metas: list[dict[str, str]] = []
        self.anchors: list[str] = []
        self.ids: set[str] = set()
        self.scripts: list[str] = []
        self._script_type: str | None = None
        self._script_chunks: list[str] = []

    def handle_starttag(self, tag: str, attrs):
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


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def normalize_url(path: str) -> str:
    return path if path.startswith("/") else f"/{path}"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", default=".")
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    robots = load_json(root / "data/models/robots.source-of-truth.json")["robots"]
    robot_by_slug = {robot["slug"]: robot for robot in robots}
    robot_urls = {normalize_url(robot["page"]["url"]) for robot in robots}
    sitemap_path = root / "app/dist/sitemap-0.xml"
    sitemap_text = sitemap_path.read_text(encoding="utf-8") if sitemap_path.exists() else ""

    errors: list[dict[str, str]] = []
    warnings: list[dict[str, str]] = []
    checked: list[dict[str, object]] = []

    for robot in robots:
        slug = robot["slug"]
        url_path = normalize_url(robot["page"]["url"])
        html_path = root / "app/dist" / url_path.strip("/") / "index.html"
        if not html_path.exists():
            errors.append({"slug": slug, "code": "missing_html", "message": str(html_path)})
            continue

        html = html_path.read_text(encoding="utf-8")
        hp = HeadAndLinkParser()
        hp.feed(html)
        json_ld = []
        for script in hp.scripts:
            try:
                json_ld.append(json.loads(script))
            except json.JSONDecodeError as exc:
                errors.append({"slug": slug, "code": "invalid_json_ld", "message": str(exc)})

        flattened = []
        for item in json_ld:
            flattened.extend(item if isinstance(item, list) else [item])
        types = [item.get("@type") for item in flattened if isinstance(item, dict)]
        faq = next((item for item in flattened if isinstance(item, dict) and item.get("@type") == "FAQPage"), None)
        service = next((item for item in flattened if isinstance(item, dict) and item.get("@type") == "Service"), None)
        breadcrumb = next((item for item in flattened if isinstance(item, dict) and item.get("@type") == "BreadcrumbList"), None)

        canonical = next((link.get("href") or "" for link in hp.links if link.get("rel") == "canonical"), "")
        expected_canonical = f"{SITE_URL}{'' if url_path == '/' else url_path}"
        og_url = next((m.get("content") or "" for m in hp.metas if m.get("property") == "og:url"), "")
        og_image = next((m.get("content") or "" for m in hp.metas if m.get("property") == "og:image"), "")
        robots_meta = next((m.get("content") or "" for m in hp.metas if m.get("name") == "robots"), "")
        title_match = re.search(r"<title>(.*?)</title>", html, re.S)
        title = title_match.group(1).strip() if title_match else ""

        if canonical != expected_canonical:
            errors.append({"slug": slug, "code": "canonical_mismatch", "message": f"{canonical} != {expected_canonical}"})
        if og_url != expected_canonical:
            errors.append({"slug": slug, "code": "og_url_mismatch", "message": f"{og_url} != {expected_canonical}"})
        if robots_meta != "index,follow":
            errors.append({"slug": slug, "code": "robots_meta_mismatch", "message": robots_meta})
        if not title or title != robot["seo"]["seoTitle"]:
            errors.append({"slug": slug, "code": "title_mismatch", "message": title})
        if not og_image.startswith(SITE_URL + "/"):
            warnings.append({"slug": slug, "code": "missing_or_relative_og_image", "message": og_image})
        if expected_canonical not in sitemap_text:
            errors.append({"slug": slug, "code": "missing_from_sitemap", "message": expected_canonical})

        for marker in REQUIRED_MARKERS:
            if marker not in html:
                errors.append({"slug": slug, "code": "missing_template_marker", "message": marker})

        if not service:
            errors.append({"slug": slug, "code": "missing_service_jsonld", "message": "Service"})
        if not breadcrumb:
            errors.append({"slug": slug, "code": "missing_breadcrumb_jsonld", "message": "BreadcrumbList"})
        if robot.get("faq"):
            if not faq:
                errors.append({"slug": slug, "code": "missing_faq_jsonld", "message": "FAQPage"})
            elif len(faq.get("mainEntity", [])) != len(robot.get("faq", [])):
                errors.append({"slug": slug, "code": "faq_count_mismatch", "message": f"{len(faq.get('mainEntity', []))} != {len(robot.get('faq', []))}"})

        related_slugs = robot.get("related", {}).get("robots", [])
        rendered_related_slugs = related_slugs[:4]
        for related_slug in rendered_related_slugs:
            related = robot_by_slug.get(related_slug)
            if not related:
                errors.append({"slug": slug, "code": "related_slug_missing", "message": related_slug})
                continue
            related_url = normalize_url(related["page"]["url"])
            if related_url not in hp.anchors:
                errors.append({"slug": slug, "code": "related_link_missing", "message": related_url})

        for href in hp.anchors:
            if href.startswith("#") and len(href) > 1 and href[1:] not in hp.ids:
                errors.append({"slug": slug, "code": "broken_fragment_link", "message": href})
            if href.startswith("/") and "#" in href:
                target_id = href.split("#", 1)[1]
                path_part = href.split("#", 1)[0]
                if path_part in {"", url_path} and target_id and target_id not in hp.ids:
                    errors.append({"slug": slug, "code": "broken_fragment_link", "message": href})

        checked.append({
            "slug": slug,
            "url": url_path,
            "jsonLdTypes": types,
            "faqItems": len(robot.get("faq", [])),
            "relatedRobots": len(related_slugs),
            "canonical": canonical,
            "ogImage": og_image,
        })

    result = {
        "ok": not errors,
        "summary": {
            "robotPages": len(robots),
            "checkedPages": len(checked),
            "errors": len(errors),
            "warnings": len(warnings),
        },
        "errors": errors,
        "warnings": warnings,
        "checked": checked,
    }
    if args.json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print(f"ok={result['ok']} robotPages={len(robots)} errors={len(errors)} warnings={len(warnings)}")
        for err in errors:
            print(f"ERROR {err['slug']} {err['code']}: {err['message']}")
        for warn in warnings:
            print(f"WARN {warn['slug']} {warn['code']}: {warn['message']}")
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
