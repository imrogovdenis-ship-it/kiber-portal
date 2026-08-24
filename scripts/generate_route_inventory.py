#!/usr/bin/env python3
"""Generate route inventory from whole-site static validation artifact."""
from __future__ import annotations

import argparse
import json
from pathlib import Path


def classify(route: str, robots: str) -> str:
    if robots == "noindex,nofollow" or route.startswith("/parity"):
        return "preview/noindex"
    if route == "/":
        return "home"
    if route.startswith("/arenda-"):
        return "robot detail" if route not in {"/arenda-robotov-na-meropriyatie"} else "collection"
    if route == "/roboty-gumanoidy":
        return "collection"
    if route in {"/articles", "/compilations", "/news"}:
        return "content index"
    if route == "/contacts":
        return "contacts"
    return "article/detail"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", default=".")
    args = ap.parse_args()
    root = Path(args.root).resolve()
    source = root / "data/seo/whole-site-static-check.json"
    data = json.loads(source.read_text(encoding="utf-8"))
    routes = []
    for item in data["checked"]:
        routes.append({
            "route": item["route"],
            "pageType": classify(item["route"], item["robots"]),
            "public": item["robots"] == "index,follow" and not item["route"].startswith("/parity"),
            "robots": item["robots"],
            "schemaCount": item["schemaCount"],
            "imageCount": item["images"],
            "linkCount": item["links"],
            "canonical": item["canonical"],
        })
    public_routes = [r for r in routes if r["public"]]
    by_type = {}
    for route in routes:
        by_type[route["pageType"]] = by_type.get(route["pageType"], 0) + 1
    artifact = {
        "date": "2026-08-24",
        "source": "data/seo/whole-site-static-check.json",
        "summary": {
            "routes": len(routes),
            "publicRoutes": len(public_routes),
            "previewNoindexRoutes": len(routes) - len(public_routes),
            "pageTypes": by_type,
        },
        "routes": routes,
    }
    (root / "data/seo/route-inventory.json").write_text(json.dumps(artifact, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    lines = [
        "# KIBER PORTAL — route inventory",
        "",
        "Дата: 2026-08-24  ",
        "Источник: `data/seo/whole-site-static-check.json`",
        "",
        "## Summary",
        "",
        f"- Total generated routes: {len(routes)}",
        f"- Public indexable routes: {len(public_routes)}",
        f"- Preview/noindex routes: {len(routes) - len(public_routes)}",
        "",
        "## Page types",
        "",
    ]
    for name, count in sorted(by_type.items()):
        lines.append(f"- {name}: {count}")
    lines += ["", "## Routes", "", "| Route | Type | Robots | Schema | Images | Links |", "|---|---:|---:|---:|---:|---:|"]
    for route in sorted(routes, key=lambda r: (not r["public"], r["pageType"], r["route"])):
        lines.append(f"| `{route['route']}` | {route['pageType']} | `{route['robots']}` | {route['schemaCount']} | {route['imageCount']} | {route['linkCount']} |")
    lines += [
        "",
        "## Notes",
        "",
        "- Preview/noindex routes are retained for QA and parity evidence; they are not production launch blockers.",
        "- Public route validation is gated by `scripts/validate_whole_site_static.py`.",
        "- Canonical URLs currently target `https://www.kiber-portal.ru` for public routes.",
    ]
    (root / "docs/route-inventory.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(json.dumps(artifact["summary"], ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
