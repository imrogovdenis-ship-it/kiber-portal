#!/usr/bin/env python3
"""Audit rendered JSON-LD schema coverage for public KIBER PORTAL pages."""
from __future__ import annotations

import argparse
import json
from html.parser import HTMLParser
from pathlib import Path
from typing import Any


class SchemaParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.robots: str | None = None
        self.in_json_ld = False
        self._chunks: list[str] = []
        self.scripts: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        data = dict(attrs)
        if tag == "meta" and data.get("name") == "robots":
            self.robots = data.get("content")
        if tag == "script" and data.get("type") == "application/ld+json":
            self.in_json_ld = True
            self._chunks = []

    def handle_data(self, data: str) -> None:
        if self.in_json_ld:
            self._chunks.append(data)

    def handle_endtag(self, tag: str) -> None:
        if tag == "script" and self.in_json_ld:
            self.scripts.append("".join(self._chunks).strip())
            self.in_json_ld = False
            self._chunks = []


def route_for_html(dist: Path, html_path: Path) -> str:
    rel = html_path.relative_to(dist)
    if rel == Path("index.html"):
        return "/"
    if rel.name == "index.html":
        return "/" + str(rel.parent).replace("\\", "/")
    return "/" + str(rel).removesuffix(".html").replace("\\", "/")


def schema_types(value: Any) -> list[str]:
    found: list[str] = []
    if isinstance(value, list):
        for item in value:
            found.extend(schema_types(item))
    elif isinstance(value, dict):
        graph = value.get("@graph")
        if graph is not None:
            found.extend(schema_types(graph))
        raw_type = value.get("@type")
        if isinstance(raw_type, list):
            found.extend(str(item) for item in raw_type)
        elif raw_type:
            found.append(str(raw_type))
    return found


def classify_route(route: str, types: list[str]) -> str:
    type_set = set(types)
    if route == "/":
        return "home"
    if route == "/contacts":
        return "contacts"
    if "Service" in type_set:
        return "robot detail"
    if "CollectionPage" in type_set or "Blog" in type_set:
        return "collection/content index"
    if "Article" in type_set or "NewsArticle" in type_set or "BlogPosting" in type_set:
        return "article/detail"
    return "public other"


def validate(root: Path) -> dict[str, Any]:
    dist = root / "app" / "dist"
    html_files = sorted(set(dist.rglob("index.html")) | set(dist.glob("*.html")))
    errors: list[dict[str, str]] = []
    warnings: list[dict[str, str]] = []
    checked: list[dict[str, Any]] = []
    type_counts: dict[str, int] = {}
    page_type_counts: dict[str, int] = {}

    for html_path in html_files:
        route = route_for_html(dist, html_path)
        parser = SchemaParser()
        parser.feed(html_path.read_text(encoding="utf-8", errors="replace"))
        is_public = parser.robots != "noindex,nofollow"
        if not is_public:
            continue

        parsed_scripts = []
        types: list[str] = []
        for index, script in enumerate(parser.scripts, start=1):
            try:
                parsed = json.loads(script)
            except json.JSONDecodeError as exc:
                errors.append({"code": "json_ld_invalid", "route": route, "message": f"JSON-LD #{index} is invalid: {exc}"})
                continue
            parsed_scripts.append(parsed)
            types.extend(schema_types(parsed))

        unique_types = sorted(set(types))
        for schema_type in unique_types:
            type_counts[schema_type] = type_counts.get(schema_type, 0) + 1
        if not unique_types:
            errors.append({"code": "schema_missing", "route": route, "message": "Public page has no JSON-LD schema types."})
        page_type = classify_route(route, unique_types)
        page_type_counts[page_type] = page_type_counts.get(page_type, 0) + 1

        if route == "/" and not {"Organization", "WebSite"}.issubset(set(unique_types)):
            errors.append({"code": "home_schema_incomplete", "route": route, "message": f"Expected Organization and WebSite, got {unique_types}"})
        if route == "/contacts" and "ContactPage" not in unique_types:
            errors.append({"code": "contacts_schema_missing", "route": route, "message": f"Expected ContactPage, got {unique_types}"})
        if page_type == "robot detail" and "Service" in unique_types and "BreadcrumbList" not in unique_types:
            errors.append({"code": "robot_breadcrumb_missing", "route": route, "message": "Robot Service page should include BreadcrumbList."})
        if page_type == "article/detail" and "BreadcrumbList" not in unique_types:
            warnings.append({"code": "article_breadcrumb_missing", "route": route, "message": "Article/detail page has article schema but no BreadcrumbList."})

        checked.append({
            "route": route,
            "pageType": page_type,
            "schemaScripts": len(parser.scripts),
            "schemaTypes": unique_types,
        })

    return {
        "ok": not errors,
        "summary": {
            "publicPagesChecked": len(checked),
            "errors": len(errors),
            "warnings": len(warnings),
            "schemaTypes": type_counts,
            "pageTypes": page_type_counts,
        },
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
        print(f"schema audit: ok={report['ok']} publicPagesChecked={report['summary']['publicPagesChecked']} errors={report['summary']['errors']} warnings={report['summary']['warnings']}")
        for issue in report["errors"][:20]:
            print(f"ERROR {issue['code']} {issue['route']}: {issue['message']}")
        for issue in report["warnings"][:20]:
            print(f"WARN {issue['code']} {issue['route']}: {issue['message']}")
    return 0 if report["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
