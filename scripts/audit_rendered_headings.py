#!/usr/bin/env python3
"""Audit rendered heading hierarchy for public KIBER PORTAL pages."""
from __future__ import annotations

import argparse
import json
import re
from html.parser import HTMLParser
from pathlib import Path


class HeadingParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.metas: list[dict[str, str]] = []
        self.headings: list[dict[str, str | int]] = []
        self._heading_level: int | None = None
        self._chunks: list[str] = []

    def handle_starttag(self, tag: str, attrs) -> None:
        data = {k: v or "" for k, v in attrs}
        if tag == "meta":
            self.metas.append(data)
        match = re.fullmatch(r"h([1-6])", tag)
        if match:
            self._heading_level = int(match.group(1))
            self._chunks = []

    def handle_data(self, data: str) -> None:
        if self._heading_level is not None:
            self._chunks.append(data)

    def handle_endtag(self, tag: str) -> None:
        if self._heading_level is not None and tag == f"h{self._heading_level}":
            text = " ".join("".join(self._chunks).split())
            self.headings.append({"level": self._heading_level, "text": text})
            self._heading_level = None
            self._chunks = []


def route_for_html(dist: Path, html_path: Path) -> str:
    rel = html_path.relative_to(dist)
    parent = str(rel.parent).strip(".")
    return "/" if parent in ("", ".") else "/" + parent.strip("/")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", default=".")
    ap.add_argument("--json", action="store_true")
    args = ap.parse_args()
    root = Path(args.root).resolve()
    dist = root / "app/dist"
    errors: list[dict[str, object]] = []
    warnings: list[dict[str, object]] = []
    checked = []

    for html_path in sorted(dist.rglob("index.html")):
        route = route_for_html(dist, html_path)
        html = html_path.read_text(encoding="utf-8")
        parser = HeadingParser()
        parser.feed(html)
        robots = next((m.get("content") or "" for m in parser.metas if m.get("name") == "robots"), "")
        if robots != "index,follow" or route.startswith("/parity"):
            continue
        h1s = [h for h in parser.headings if h["level"] == 1 and str(h["text"]).strip()]
        if len(h1s) != 1:
            errors.append({"route": route, "code": "h1_count", "message": f"expected 1 non-empty H1, got {len(h1s)}"})
        previous = 0
        for heading in parser.headings:
            level = int(heading["level"])
            text = str(heading["text"]).strip()
            if not text:
                warnings.append({"route": route, "code": "empty_heading", "level": level})
                continue
            if previous and level > previous + 1:
                warnings.append({"route": route, "code": "heading_level_jump", "from": previous, "to": level, "text": text})
            previous = level
        checked.append({"route": route, "h1": [h["text"] for h in h1s], "headingCount": len(parser.headings), "levels": [h["level"] for h in parser.headings]})

    result = {"ok": not errors, "summary": {"publicPagesChecked": len(checked), "errors": len(errors), "warnings": len(warnings), "headings": sum(item["headingCount"] for item in checked)}, "errors": errors, "warnings": warnings, "checked": checked}
    print(json.dumps(result, ensure_ascii=False, indent=2) if args.json else result)
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
