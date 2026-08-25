#!/usr/bin/env python3
"""Validate rendered robots.txt for the Astro production build."""
from __future__ import annotations

import argparse
import json
from pathlib import Path

SITE = "https://www.kiber-portal.ru"
REQUIRED_LINES = [
    "User-agent: *",
    "Disallow: /parity/",
    "Disallow: /design-review",
    "Disallow: /news-v2",
    f"Sitemap: {SITE}/sitemap-index.xml",
]
PUBLIC_ROUTES_NOT_TO_DISALLOW = [
    "/",
    "/articles",
    "/compilations",
    "/news",
    "/contacts",
    "/privacy-policy",
    "/consent",
    "/cookie-policy",
    "/terms",
]


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", default=".")
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()
    root = Path(args.root).resolve()
    robots_path = root / "app/dist/robots.txt"
    sitemap_path = root / "app/dist/sitemap-index.xml"
    errors: list[dict[str, str]] = []
    warnings: list[dict[str, str]] = []
    text = robots_path.read_text(encoding="utf-8") if robots_path.exists() else ""
    lines = [line.strip() for line in text.splitlines() if line.strip()]

    if not robots_path.exists():
        errors.append({"code": "missing_robots_txt", "message": str(robots_path)})
    for required in REQUIRED_LINES:
        if required not in lines:
            errors.append({"code": "missing_required_robots_line", "message": required})
    for route in PUBLIC_ROUTES_NOT_TO_DISALLOW:
        if f"Disallow: {route}" in lines or f"Disallow: {route}/" in lines:
            errors.append({"code": "public_route_disallowed", "message": route})
    if sitemap_path.exists():
        sitemap_text = sitemap_path.read_text(encoding="utf-8")
        if f"{SITE}/sitemap-0.xml" not in sitemap_text:
            errors.append({"code": "sitemap_index_missing_sitemap_0", "message": f"{SITE}/sitemap-0.xml"})
    else:
        errors.append({"code": "missing_sitemap_index", "message": str(sitemap_path)})

    result = {
        "ok": not errors,
        "summary": {
            "robotsLines": len(lines),
            "publicRoutesProtected": len(PUBLIC_ROUTES_NOT_TO_DISALLOW),
            "errors": len(errors),
            "warnings": len(warnings),
        },
        "errors": errors,
        "warnings": warnings,
        "checked": {
            "robots": "app/dist/robots.txt",
            "sitemapIndex": "app/dist/sitemap-index.xml",
        },
    }
    print(json.dumps(result, ensure_ascii=False, indent=2) if args.json else result)
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
