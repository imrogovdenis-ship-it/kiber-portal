#!/usr/bin/env python3
"""Audit rendered CTA/link flow for public KIBER PORTAL pages."""
from __future__ import annotations

import argparse
import json
from html.parser import HTMLParser
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

CANONICAL_DOMAIN = "https://www.kiber-portal.ru"
ALLOWED_EXTERNAL_PREFIXES = ("tel:", "mailto:", "https://t.me/", "https://telegram.me/", "https://wa.me/", "https://api.whatsapp.com/", "https://max.ru/")
PLACEHOLDER_HREFS = {"", "#", "javascript:void(0)", "javascript:;"}


class CtaParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.robots: str | None = None
        self.ids: set[str] = set()
        self.links: list[dict[str, Any]] = []
        self._current_link: dict[str, Any] | None = None
        self._text_chunks: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        data = {k: (v or "") for k, v in attrs}
        if data.get("id"):
            self.ids.add(data["id"])
        if tag == "meta" and data.get("name") == "robots":
            self.robots = data.get("content")
        if tag == "a":
            self._current_link = {
                "href": data.get("href", ""),
                "class": data.get("class", ""),
                "dataAnalyticsEvent": data.get("data-analytics-event", ""),
                "dataAnalyticsSource": data.get("data-analytics-source", ""),
                "dataPageType": data.get("data-page-type", ""),
                "dataPlacement": data.get("data-placement", ""),
                "dataRobotSlug": data.get("data-robot-slug", ""),
                "target": data.get("target", ""),
                "rel": data.get("rel", ""),
            }
            self._text_chunks = []

    def handle_data(self, data: str) -> None:
        if self._current_link is not None:
            self._text_chunks.append(data)

    def handle_endtag(self, tag: str) -> None:
        if tag == "a" and self._current_link is not None:
            label = " ".join("".join(self._text_chunks).split())
            self._current_link["label"] = label
            self.links.append(self._current_link)
            self._current_link = None
            self._text_chunks = []


def route_for_html(dist: Path, html_path: Path) -> str:
    rel = html_path.relative_to(dist)
    if rel == Path("index.html"):
        return "/"
    if rel.name == "index.html":
        return "/" + str(rel.parent).replace("\\", "/")
    return "/" + str(rel).removesuffix(".html").replace("\\", "/")


def route_to_html(dist: Path, route: str) -> Path:
    route = route.split("#", 1)[0].split("?", 1)[0]
    if route in {"", "/"}:
        return dist / "index.html"
    return dist / route.strip("/") / "index.html"


def classify_href(href: str) -> str:
    if href in PLACEHOLDER_HREFS:
        return "placeholder"
    if href.startswith("#"):
        return "same-page-anchor"
    if href.startswith("/"):
        return "internal"
    if href.startswith(CANONICAL_DOMAIN):
        return "absolute-internal"
    if href.startswith(ALLOWED_EXTERNAL_PREFIXES):
        return "approved-external"
    if href.startswith("http://") or href.startswith("https://"):
        return "external"
    return "other"


def validate(root: Path) -> dict[str, Any]:
    dist = root / "app" / "dist"
    html_files = sorted(set(dist.rglob("index.html")) | set(dist.glob("*.html")))
    errors: list[dict[str, str]] = []
    warnings: list[dict[str, str]] = []
    checked_pages: list[dict[str, Any]] = []
    cta_inventory: list[dict[str, Any]] = []
    route_ids: dict[str, set[str]] = {}

    parsed_pages: dict[str, CtaParser] = {}
    for html_path in html_files:
        route = route_for_html(dist, html_path)
        parser = CtaParser()
        parser.feed(html_path.read_text(encoding="utf-8", errors="replace"))
        parsed_pages[route] = parser
        route_ids[route] = parser.ids

    for route, parser in parsed_pages.items():
        if parser.robots == "noindex,nofollow":
            continue
        page_links = []
        analytics_links = 0
        for link in parser.links:
            href = link["href"].strip()
            label = link.get("label", "")
            href_type = classify_href(href)
            is_cta = bool(link.get("dataAnalyticsEvent")) or "btn" in link.get("class", "") or any(word in label.lower() for word in ["заяв", "напис", "вопрос", "консультац", "каталог", "смотреть", "обсуд", "подбор"])
            if link.get("dataAnalyticsEvent"):
                analytics_links += 1
            if is_cta and not label:
                errors.append({"code": "cta_label_missing", "route": route, "message": f"CTA href {href!r} has empty visible label"})
            if is_cta and href_type == "placeholder":
                # Modal close/backdrop links use # and are not CTAs when no label or only close label.
                if label and "закрыть" not in label.lower():
                    errors.append({"code": "cta_placeholder_href", "route": route, "message": f"CTA {label!r} uses placeholder href {href!r}"})
            if "*" in href:
                errors.append({"code": "masked_or_broken_href", "route": route, "message": f"Link {label!r} contains masked/broken href {href!r}"})
            if href_type == "same-page-anchor":
                anchor = href[1:]
                if anchor and anchor not in parser.ids:
                    errors.append({"code": "anchor_target_missing", "route": route, "message": f"{href!r} target id is missing on same page"})
            if href_type in {"internal", "absolute-internal"}:
                parsed = urlparse(href)
                path = parsed.path if href_type == "absolute-internal" else href.split("#", 1)[0].split("?", 1)[0]
                target_html = route_to_html(dist, path)
                if not target_html.exists():
                    errors.append({"code": "internal_target_missing", "route": route, "message": f"Internal link {href!r} target HTML missing"})
                if parsed.fragment:
                    target_route = "/" if path in {"", "/"} else "/" + path.strip("/")
                    if target_route in route_ids and parsed.fragment not in route_ids[target_route]:
                        errors.append({"code": "internal_fragment_missing", "route": route, "message": f"Internal link {href!r} target fragment missing"})
            if href_type == "external":
                warnings.append({"code": "unapproved_external_link", "route": route, "message": f"External link should be reviewed: {href}"})
            if is_cta and link.get("target") == "_blank" and "noopener" not in link.get("rel", ""):
                errors.append({"code": "blank_without_noopener", "route": route, "message": f"CTA {label!r} opens blank without noopener"})

            if is_cta:
                item = {"route": route, "label": label, "href": href, "hrefType": href_type, **{k: v for k, v in link.items() if k.startswith("data") and v}}
                cta_inventory.append(item)
                page_links.append(item)

        if analytics_links == 0:
            warnings.append({"code": "page_without_analytics_cta", "route": route, "message": "Public page has no data-analytics-event CTA links."})
        checked_pages.append({"route": route, "ids": sorted(parser.ids), "ctaCount": len(page_links), "analyticsCtaCount": analytics_links})

    href_type_counts: dict[str, int] = {}
    for item in cta_inventory:
        href_type_counts[item["hrefType"]] = href_type_counts.get(item["hrefType"], 0) + 1

    return {
        "ok": not errors,
        "summary": {
            "publicPagesChecked": len(checked_pages),
            "ctaLinks": len(cta_inventory),
            "hrefTypes": href_type_counts,
            "errors": len(errors),
            "warnings": len(warnings),
        },
        "errors": errors,
        "warnings": warnings,
        "checkedPages": checked_pages,
        "ctaInventory": cta_inventory,
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
        print(f"cta flow audit: ok={report['ok']} publicPagesChecked={report['summary']['publicPagesChecked']} ctaLinks={report['summary']['ctaLinks']} errors={report['summary']['errors']} warnings={report['summary']['warnings']}")
        for issue in report["errors"][:30]:
            print(f"ERROR {issue['code']} {issue['route']}: {issue['message']}")
        for issue in report["warnings"][:30]:
            print(f"WARN {issue['code']} {issue['route']}: {issue['message']}")
    return 0 if report["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
