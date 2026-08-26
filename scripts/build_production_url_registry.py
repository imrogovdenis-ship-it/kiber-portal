#!/usr/bin/env python3
"""Build the registry of live production URLs (KP-064 / KIBER-40).

For every URL published in the production sitemap the registry records the page
type, the canonical link, the live HTTP status and the route that is expected to
replace it in the controlled rebuild. The output is consumed by the
keep/merge/delete/redirect decision (KP-065) and by the redirect registry
(KP-066), so it stays machine-readable next to the human-readable report.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path

USER_AGENT = "Mozilla/5.0 (compatible; KiberPortalUrlRegistry/1.0; +https://github.com/imrogovdenis-ship-it/kiber-portal)"
PRODUCTION_HOST = "www.kiber-portal.ru"
SITEMAP_URL = f"https://{PRODUCTION_HOST}/sitemap.xml"

# Tilda system pages keep numeric `pageNNNNNNNNN.html` addresses. They never had
# a public purpose, so they are classified separately from editorial content.
TILDA_SYSTEM_RE = re.compile(r"^/page\d+\.html$")
TEST_PATH_RE = re.compile(r"^/(test\d*|test-blok)$")

PAGE_TYPE_BY_PATH = {
    "/": "home",
    "/articles": "content index",
    "/news": "content index",
    "/compilations": "content index",
    "/contacts": "contacts",
    "/arenda-robotov-na-meropriyatie": "collection",
    "/roboty-gumanoidy": "collection",
}
LEGAL_PATHS = {"/consent", "/cookie-policy", "/privacy-policy", "/terms"}


class PageParser(HTMLParser):
    """Extract the metadata the registry needs from a production page."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.title_parts: list[str] = []
        self.h1_parts: list[str] = []
        self.canonical = ""
        self.meta_robots = ""
        self._in_title = False
        self._in_first_h1 = False
        self._seen_h1 = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        tag = tag.lower()
        values = {key.lower(): value or "" for key, value in attrs}
        if tag == "title":
            self._in_title = True
        elif tag == "h1" and not self._seen_h1:
            self._in_first_h1 = True
            self._seen_h1 = True
        elif tag == "link" and "canonical" in values.get("rel", "").lower().split():
            self.canonical = values.get("href", "").strip()
        elif tag == "meta" and values.get("name", "").lower() == "robots":
            self.meta_robots = values.get("content", "").strip()

    def handle_endtag(self, tag: str) -> None:
        tag = tag.lower()
        if tag == "title":
            self._in_title = False
        elif tag == "h1":
            self._in_first_h1 = False

    def handle_data(self, data: str) -> None:
        if self._in_title:
            self.title_parts.append(data)
        if self._in_first_h1:
            self.h1_parts.append(data)


class RedirectRecorder(urllib.request.HTTPRedirectHandler):
    def __init__(self) -> None:
        self.chain: list[dict[str, object]] = []

    def redirect_request(self, req, fp, code, msg, headers, newurl):  # type: ignore[no-untyped-def]
        self.chain.append({"from": req.full_url, "status": code, "to": newurl})
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def normalized_text(parts: list[str]) -> str:
    return " ".join(" ".join(parts).split())


@dataclass
class UrlRecord:
    url: str
    path: str
    pageType: str
    status: str
    httpStatus: int | None
    finalUrl: str
    redirectChain: list[dict[str, object]]
    title: str
    h1: str
    canonical: str
    canonicalIssue: str
    metaRobots: str
    indexable: bool
    rebuildRoute: str | None
    rebuildPageType: str | None
    issues: list[str] = field(default_factory=list)


def fetch(url: str, timeout: float, retries: int = 3) -> tuple[int, str, list[dict[str, object]], str]:
    """Return (status, final url, redirect chain, body) tolerating rate limits."""
    for attempt in range(retries + 1):
        recorder = RedirectRecorder()
        opener = urllib.request.build_opener(recorder)
        request = urllib.request.Request(
            url,
            headers={"User-Agent": USER_AGENT, "Accept": "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8"},
        )
        try:
            with opener.open(request, timeout=timeout) as response:
                body = response.read().decode("utf-8", errors="replace")
                return response.status, response.geturl(), recorder.chain, body
        except urllib.error.HTTPError as exc:
            if exc.code in {403, 408, 425, 429, 500, 502, 503, 504} and attempt < retries:
                retry_after = exc.headers.get("Retry-After", "")
                time.sleep(min(float(retry_after) if retry_after.isdigit() else 2**attempt, 30))
                continue
            body = exc.read().decode("utf-8", errors="replace") if exc.fp else ""
            return exc.code, exc.url or url, recorder.chain, body
        except urllib.error.URLError:
            if attempt == retries:
                raise
            time.sleep(2**attempt)
    raise RuntimeError("unreachable")


def sitemap_urls(sitemap_url: str, timeout: float) -> list[str]:
    pending = [sitemap_url]
    seen: set[str] = set()
    urls: set[str] = set()
    while pending:
        current = pending.pop()
        if current in seen:
            continue
        seen.add(current)
        _, _, _, body = fetch(current, timeout)
        root = ET.fromstring(body)
        locations = [node.text.strip() for node in root.iter() if node.tag.rsplit("}", 1)[-1] == "loc" and node.text]
        if root.tag.rsplit("}", 1)[-1] == "sitemapindex":
            pending.extend(locations)
        else:
            urls.update(locations)
    return sorted(urls)


def classify(path: str, title: str) -> str:
    if TILDA_SYSTEM_RE.match(path):
        return "tilda system page"
    if TEST_PATH_RE.match(path):
        return "test page"
    if path in PAGE_TYPE_BY_PATH:
        return PAGE_TYPE_BY_PATH[path]
    if path in LEGAL_PATHS:
        return "legal"
    if path.startswith("/arenda-"):
        return "robot detail"
    if title.strip().lower() in {"astribot", "soon", "blank page", "404", "шаблоны блоков"}:
        return "stub/system"
    return "article/detail"


def canonical_issue(path: str, canonical: str) -> str:
    if not canonical:
        return "missing canonical"
    parsed = urllib.parse.urlparse(canonical)
    if parsed.scheme != "https":
        return f"non-https canonical ({parsed.scheme})"
    if parsed.netloc != PRODUCTION_HOST:
        return f"foreign canonical host ({parsed.netloc})"
    canonical_path = parsed.path or "/"
    if canonical_path.rstrip("/") != path.rstrip("/") and not (path == "/" and canonical_path == "/"):
        return f"cross-canonical to {canonical_path}"
    return ""


def build_records(urls: list[str], rebuild_routes: dict[str, dict], timeout: float, delay: float) -> list[UrlRecord]:
    records: list[UrlRecord] = []
    for index, url in enumerate(urls, start=1):
        path = urllib.parse.urlparse(url).path or "/"
        status_code, final_url, chain, body = fetch(url, timeout)
        parser = PageParser()
        parser.feed(body)
        title = normalized_text(parser.title_parts)
        h1 = normalized_text(parser.h1_parts)
        canonical = urllib.parse.urljoin(url, parser.canonical) if parser.canonical else ""
        meta_robots = parser.meta_robots
        indexable = status_code == 200 and "noindex" not in meta_robots.lower()
        page_type = classify(path, title)
        rebuild = rebuild_routes.get(path.rstrip("/") or "/")

        issues: list[str] = []
        if status_code != 200:
            issues.append(f"http {status_code}")
        if chain:
            issues.append("redirected")
        problem = canonical_issue(path, canonical)
        if problem:
            issues.append(problem)
        if not title:
            issues.append("missing title")
        if not h1:
            issues.append("missing h1")
        if page_type in {"tilda system page", "test page", "stub/system"}:
            issues.append("non-public page published in sitemap")
        if rebuild is None and page_type not in {"tilda system page", "test page", "stub/system"}:
            issues.append("no route in controlled rebuild")

        if page_type in {"tilda system page", "test page", "stub/system"}:
            state = "junk"
        elif issues:
            state = "live-issue"
        else:
            state = "live-ok"

        records.append(
            UrlRecord(
                url=url,
                path=path,
                pageType=page_type,
                status=state,
                httpStatus=status_code,
                finalUrl=final_url,
                redirectChain=chain,
                title=title,
                h1=h1,
                canonical=canonical,
                canonicalIssue=problem,
                metaRobots=meta_robots,
                indexable=indexable,
                rebuildRoute=rebuild["route"] if rebuild else None,
                rebuildPageType=rebuild["pageType"] if rebuild else None,
                issues=issues,
            )
        )
        print(f"[{index}/{len(urls)}] {path} -> {status_code} ({state})", file=sys.stderr)
        if delay:
            time.sleep(delay)
    return records


def render_markdown(payload: dict) -> str:
    records = payload["urls"]
    summary = payload["summary"]
    lines = [
        "# KIBER PORTAL — реестр production URL",
        "",
        f"Дата: {payload['generatedAt'][:10]}",
        f"Источник: `{payload['sitemap']}` (живой обход)",
        "Задача: KP-064 / KIBER-40. Потребители: KP-065 (решение keep/merge/delete/redirect), KP-066 (registry редиректов).",
        "",
        "## Итог",
        "",
        f"- Всего URL в sitemap: {summary['total']}",
        f"- Чистые публичные страницы: {summary['byStatus'].get('live-ok', 0)}",
        f"- Публичные страницы с проблемами: {summary['byStatus'].get('live-issue', 0)}",
        f"- Мусорные/служебные страницы: {summary['byStatus'].get('junk', 0)}",
        f"- Индексируемых: {summary['indexable']}",
        f"- Без соответствия в controlled rebuild: {summary['withoutRebuildRoute']}",
        "",
        "## Типы страниц",
        "",
    ]
    for page_type, count in sorted(summary["byPageType"].items(), key=lambda item: (-item[1], item[0])):
        lines.append(f"- {page_type}: {count}")
    lines += [
        "",
        "## Реестр",
        "",
        "| # | URL | Тип | HTTP | Canonical | Индексируется | Маршрут rebuild | Статус | Проблемы |",
        "|---:|---|---|---:|---|---|---|---|---|",
    ]
    for index, record in enumerate(records, start=1):
        canonical = record["canonical"] or "—"
        canonical_cell = "self" if canonical.rstrip("/").endswith(record["path"].rstrip("/")) and not record["canonicalIssue"] else canonical
        if record["path"] == "/" and not record["canonicalIssue"]:
            canonical_cell = "self"
        lines.append(
            "| {index} | `{path}` | {page_type} | {http} | {canonical} | {indexable} | {route} | {status} | {issues} |".format(
                index=index,
                path=record["path"],
                page_type=record["pageType"],
                http=record["httpStatus"],
                canonical=canonical_cell,
                indexable="да" if record["indexable"] else "нет",
                route=f"`{record['rebuildRoute']}`" if record["rebuildRoute"] else "—",
                status=record["status"],
                issues="; ".join(record["issues"]) or "—",
            )
        )
    lines += [
        "",
        "## Маршруты controlled rebuild без production-адреса",
        "",
        "Эти маршруты существуют только в новой сборке. Публичные — новые страницы, которые появятся при",
        "переезде; preview/noindex — служебные, их нельзя выпускать в production sitemap.",
        "",
        "| Маршрут | Тип | Публичный |",
        "|---|---|---|",
    ]
    for route in payload["rebuildOnlyRoutes"]:
        lines.append(
            f"| `{route['route']}` | {route['pageType']} | {'да' if route['public'] else 'нет (preview/noindex)'} |"
        )
    lines += [
        "",
        "## Как обновлять",
        "",
        "```bash",
        "python3 scripts/build_production_url_registry.py",
        "```",
        "",
        "Скрипт заново обходит production sitemap, поэтому реестр отражает живое состояние Tilda,",
        "а не снимок. Никакие production-страницы при этом не изменяются.",
        "",
    ]
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--sitemap", default=SITEMAP_URL)
    parser.add_argument("--timeout", type=float, default=30.0)
    parser.add_argument("--delay", type=float, default=0.7, help="Pause between page fetches")
    parser.add_argument("--route-inventory", type=Path, default=Path("data/seo/route-inventory.json"))
    parser.add_argument("--json-out", type=Path, default=Path("data/seo/production-url-registry.json"))
    parser.add_argument("--markdown-out", type=Path, default=Path("docs/production-url-registry.md"))
    args = parser.parse_args()

    rebuild = json.loads(args.route_inventory.read_text(encoding="utf-8"))
    rebuild_routes = {route["route"].rstrip("/") or "/": route for route in rebuild["routes"]}

    urls = sitemap_urls(args.sitemap, args.timeout)
    records = build_records(urls, rebuild_routes, args.timeout, args.delay)

    by_status: dict[str, int] = {}
    by_page_type: dict[str, int] = {}
    for record in records:
        by_status[record.status] = by_status.get(record.status, 0) + 1
        by_page_type[record.pageType] = by_page_type.get(record.pageType, 0) + 1

    payload = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "sitemap": args.sitemap,
        "task": "KP-064 / KIBER-40",
        "summary": {
            "total": len(records),
            "byStatus": by_status,
            "byPageType": by_page_type,
            "indexable": sum(1 for record in records if record.indexable),
            "withoutRebuildRoute": sum(1 for record in records if record.rebuildRoute is None),
            "rebuildOnlyRoutes": sum(
                1 for path in rebuild_routes if path not in {record.path.rstrip("/") or "/" for record in records}
            ),
        },
        "urls": [asdict(record) for record in records],
        "rebuildOnlyRoutes": [
            {"route": route["route"], "pageType": route["pageType"], "public": route["public"]}
            for path, route in sorted(rebuild_routes.items())
            if path not in {record.path.rstrip("/") or "/" for record in records}
        ],
    }

    args.json_out.parent.mkdir(parents=True, exist_ok=True)
    args.json_out.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    args.markdown_out.parent.mkdir(parents=True, exist_ok=True)
    args.markdown_out.write_text(render_markdown(payload), encoding="utf-8")
    print(f"Wrote {args.json_out} and {args.markdown_out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
