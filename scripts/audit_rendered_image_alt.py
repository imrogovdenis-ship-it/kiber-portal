#!/usr/bin/env python3
"""Audit rendered public-page image alt text for KIBER PORTAL."""
from __future__ import annotations

import argparse
import json
import re
from html.parser import HTMLParser
from pathlib import Path

COMMERCIAL_TERMS = re.compile(r"аренд|прокат|заказать|мероприят|выставк|корпоратив|свадьб|праздник", re.I)


class ImageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.images: list[dict[str, str]] = []
        self.metas: list[dict[str, str]] = []

    def handle_starttag(self, tag: str, attrs) -> None:
        data = {k: v or "" for k, v in attrs}
        if tag == "img":
            self.images.append({
                "src": data.get("src", ""),
                "alt": data.get("alt", ""),
                "loading": data.get("loading", ""),
                "class": data.get("class", ""),
            })
        elif tag == "meta":
            self.metas.append(data)


def route_for_html(dist: Path, html_path: Path) -> str:
    rel = html_path.relative_to(dist)
    parent = str(rel.parent).strip(".")
    return "/" if parent in ("", ".") else "/" + parent.strip("/")


def meaningful(image: dict[str, str]) -> bool:
    src = image["src"]
    if not src or src.startswith("data:"):
        return False
    if src.endswith(".svg") and any(token in src for token in ["logo", "whatsapp", "tegram", "max_logo"]):
        return False
    return True


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
        parser = ImageParser()
        parser.feed(html)
        robots = next((m.get("content") or "" for m in parser.metas if m.get("name") == "robots"), "")
        if robots != "index,follow" or route.startswith("/parity"):
            continue
        meaningful_images = [img for img in parser.images if meaningful(img)]
        commercial_positions = []
        for idx, image in enumerate(meaningful_images, start=1):
            alt = image["alt"].strip()
            if not alt:
                errors.append({"route": route, "code": "missing_alt", "position": idx, "src": image["src"]})
            if len(alt) > 180:
                warnings.append({"route": route, "code": "alt_too_long", "position": idx, "src": image["src"], "length": len(alt)})
            if COMMERCIAL_TERMS.search(alt):
                commercial_positions.append(idx)
        even_positions = [idx for idx in range(1, len(meaningful_images) + 1) if idx % 2 == 0]
        even_coverage = len([idx for idx in commercial_positions if idx in even_positions])
        if len(meaningful_images) >= 4 and even_positions and even_coverage == 0:
            warnings.append({"route": route, "code": "no_even_position_commercial_alt", "meaningfulImages": len(meaningful_images)})
        checked.append({"route": route, "images": len(parser.images), "meaningfulImages": len(meaningful_images), "commercialAltPositions": commercial_positions})
    result = {"ok": not errors, "summary": {"publicPagesChecked": len(checked), "errors": len(errors), "warnings": len(warnings), "meaningfulImages": sum(item["meaningfulImages"] for item in checked)}, "errors": errors, "warnings": warnings, "checked": checked}
    print(json.dumps(result, ensure_ascii=False, indent=2) if args.json else result)
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
