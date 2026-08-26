#!/usr/bin/env python3
"""Capture production sitemap metadata and report drift from a JSON baseline."""

from __future__ import annotations

import argparse
import json
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path

USER_AGENT = "Mozilla/5.0 (compatible; KiberPortalDriftMonitor/1.0; +https://github.com/imrogovdenis-ship-it/kiber-portal)"


class MetadataParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.title_parts: list[str] = []
        self.h1_parts: list[str] = []
        self.canonical = ""
        self._in_title = False
        self._in_first_h1 = False
        self._seen_h1 = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = {key.lower(): value or "" for key, value in attrs}
        if tag.lower() == "title":
            self._in_title = True
        elif tag.lower() == "h1" and not self._seen_h1:
            self._in_first_h1 = True
            self._seen_h1 = True
        elif tag.lower() == "link" and "canonical" in values.get("rel", "").lower().split():
            self.canonical = values.get("href", "").strip()

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() == "title":
            self._in_title = False
        elif tag.lower() == "h1":
            self._in_first_h1 = False

    def handle_data(self, data: str) -> None:
        if self._in_title:
            self.title_parts.append(data)
        if self._in_first_h1:
            self.h1_parts.append(data)


def normalized_text(parts: list[str]) -> str:
    return " ".join(" ".join(parts).split())


@dataclass(frozen=True)
class PageMetadata:
    url: str
    title: str
    h1: str
    canonical: str


def fetch(url: str, timeout: float, retries: int = 3) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept": "text/html,application/xml;q=0.9,*/*;q=0.8"})
    for attempt in range(retries + 1):
        try:
            with urllib.request.urlopen(request, timeout=timeout) as response:
                return response.read()
        except urllib.error.HTTPError as exc:
            if attempt == retries or exc.code not in {403, 408, 425, 429, 500, 502, 503, 504}:
                raise
            retry_after = exc.headers.get("Retry-After", "")
            wait = float(retry_after) if retry_after.isdigit() else 2**attempt
            time.sleep(min(wait, 30))
        except urllib.error.URLError:
            if attempt == retries:
                raise
            time.sleep(2**attempt)
    raise RuntimeError("unreachable")


def sitemap_urls(sitemap_url: str, timeout: float) -> list[str]:
    pending = [sitemap_url]
    seen_sitemaps: set[str] = set()
    urls: set[str] = set()
    while pending:
        current = pending.pop()
        if current in seen_sitemaps:
            continue
        seen_sitemaps.add(current)
        root = ET.fromstring(fetch(current, timeout))
        root_name = root.tag.rsplit("}", 1)[-1]
        locations = [node.text.strip() for node in root.iter() if node.tag.rsplit("}", 1)[-1] == "loc" and node.text]
        if root_name == "sitemapindex":
            pending.extend(locations)
        elif root_name == "urlset":
            urls.update(locations)
        else:
            raise ValueError(f"Unsupported sitemap root: {root_name}")
    return sorted(urls)


def capture(url: str, timeout: float) -> PageMetadata:
    parser = MetadataParser()
    parser.feed(fetch(url, timeout).decode("utf-8", errors="replace"))
    canonical = urllib.parse.urljoin(url, parser.canonical) if parser.canonical else ""
    return PageMetadata(url=url, title=normalized_text(parser.title_parts), h1=normalized_text(parser.h1_parts), canonical=canonical)


def compare(baseline: dict[str, PageMetadata], current: dict[str, PageMetadata]) -> list[dict[str, str]]:
    changes: list[dict[str, str]] = []
    for url in sorted(baseline.keys() | current.keys()):
        if url not in baseline:
            changes.append({"url": url, "field": "url", "before": "", "after": "added"})
            continue
        if url not in current:
            changes.append({"url": url, "field": "url", "before": "present", "after": "removed"})
            continue
        for field in ("title", "h1", "canonical"):
            before = getattr(baseline[url], field)
            after = getattr(current[url], field)
            if before != after:
                changes.append({"url": url, "field": field, "before": before, "after": after})
    return changes


def load_baseline(path: Path) -> dict[str, PageMetadata]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    return {item["url"]: PageMetadata(**item) for item in payload["pages"]}


def markdown(summary: dict, changes: list[dict[str, str]], errors: list[dict[str, str]]) -> str:
    lines = ["# Production metadata drift report", "", f"Generated: {summary['generatedAt']}", "", "## Summary", "", f"- Sitemap URLs: {summary['urlCount']}", f"- Changes: {summary['changeCount']}", f"- Fetch errors: {summary['errorCount']}"]
    if changes:
        lines += ["", "## Changes", "", "| URL | Field | Before | After |", "|---|---|---|---|"]
        for change in changes:
            clean = {key: str(value).replace("|", "\\|").replace("\n", " ") for key, value in change.items()}
            lines.append(f"| {clean['url']} | {clean['field']} | {clean['before']} | {clean['after']} |")
    if errors:
        lines += ["", "## Fetch errors", ""]
        lines.extend(f"- `{item['url']}`: {item['error']}" for item in errors)
    lines.append("")
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--sitemap", default="https://www.kiber-portal.ru/sitemap.xml")
    parser.add_argument("--baseline", type=Path, default=Path("data/monitoring/production-metadata-baseline.json"))
    parser.add_argument("--json-report", type=Path, default=Path("artifacts/production-metadata-drift.json"))
    parser.add_argument("--markdown-report", type=Path, default=Path("artifacts/production-metadata-drift.md"))
    parser.add_argument("--timeout", type=float, default=20)
    parser.add_argument("--delay", type=float, default=1.0, help="Polite delay between page requests")
    parser.add_argument("--write-baseline", action="store_true")
    args = parser.parse_args()

    generated_at = datetime.now(timezone.utc).isoformat()
    errors: list[dict[str, str]] = []
    try:
        urls = sitemap_urls(args.sitemap, args.timeout)
    except (OSError, ValueError, ET.ParseError) as exc:
        urls = []
        errors.append({"url": args.sitemap, "error": type(exc).__name__})

    current: dict[str, PageMetadata] = {}
    for index, url in enumerate(urls):
        try:
            current[url] = capture(url, args.timeout)
        except (OSError, ValueError, urllib.error.URLError) as exc:
            status = f" HTTP {exc.code}" if isinstance(exc, urllib.error.HTTPError) else ""
            errors.append({"url": url, "error": f"{type(exc).__name__}{status}"})
        if args.delay and index < len(urls) - 1:
            time.sleep(args.delay)

    if args.write_baseline:
        if errors:
            print("Refusing to write an incomplete baseline", file=sys.stderr)
            return 1
        args.baseline.parent.mkdir(parents=True, exist_ok=True)
        args.baseline.write_text(json.dumps({"generatedAt": generated_at, "sitemap": args.sitemap, "pages": [asdict(current[url]) for url in sorted(current)]}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(json.dumps({"baseline": str(args.baseline), "pages": len(current)}))
        return 0

    baseline = load_baseline(args.baseline)
    changes = compare(baseline, current)
    summary = {"generatedAt": generated_at, "sitemap": args.sitemap, "urlCount": len(urls), "changeCount": len(changes), "errorCount": len(errors)}
    report = {"summary": summary, "changes": changes, "errors": errors}
    args.json_report.parent.mkdir(parents=True, exist_ok=True)
    args.markdown_report.parent.mkdir(parents=True, exist_ok=True)
    args.json_report.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    args.markdown_report.write_text(markdown(summary, changes, errors), encoding="utf-8")
    print(json.dumps(summary))
    return 1 if errors else 2 if changes else 0


if __name__ == "__main__":
    raise SystemExit(main())
