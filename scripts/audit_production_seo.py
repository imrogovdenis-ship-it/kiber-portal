#!/usr/bin/env python3
"""Audit SEO metadata and structured data on the live production site (KP-071 / KIBER-51).

The new build already has a clean rendered-metadata audit, but the site that is
actually indexed today has never been checked. This script records, for every
production URL, the metadata that search engines currently see, lists the
defects against the agreed rules, and freezes a baseline of the values that must
survive the cutover for the URLs kept in KIBER-41.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import urllib.parse
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from build_production_url_registry import PRODUCTION_HOST, fetch  # noqa: E402

TITLE_MIN, TITLE_MAX = 10, 70
DESCRIPTION_MIN, DESCRIPTION_MAX = 50, 180
REQUIRED_OG = ("og:title", "og:description", "og:image")
# Detail pages should carry a breadcrumb trail; indexes and home need not.
BREADCRUMB_PAGE_TYPES = {"robot detail", "article/detail", "collection"}


@dataclass
class PageSeo:
    path: str
    url: str
    pageType: str
    decision: str
    title: str
    description: str
    canonical: str
    robots: str
    h1Count: int
    h1: str
    openGraph: dict[str, str]
    twitterCard: str
    schemaTypes: list[str]
    microdataTypes: list[str]
    schemaErrors: list[str]
    defects: list[str] = field(default_factory=list)


class SeoParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.title_parts: list[str] = []
        self.h1_texts: list[list[str]] = []
        self.description = ""
        self.canonical = ""
        self.robots = ""
        self.open_graph: dict[str, str] = {}
        self.twitter_card = ""
        self.schema_blobs: list[str] = []
        self.microdata_types: set[str] = set()
        self._in_title = False
        self._in_h1 = False
        self._in_ldjson = False
        self._ldjson_parts: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        tag = tag.lower()
        values = {key.lower(): value or "" for key, value in attrs}
        if values.get("itemtype"):
            self.microdata_types.add(values["itemtype"].rsplit("/", 1)[-1])
        if tag == "title":
            self._in_title = True
        elif tag == "h1":
            self._in_h1 = True
            self.h1_texts.append([])
        elif tag == "link" and "canonical" in values.get("rel", "").lower().split():
            self.canonical = values.get("href", "").strip()
        elif tag == "meta":
            name = values.get("name", "").lower()
            prop = values.get("property", "").lower()
            content = values.get("content", "").strip()
            if name == "description":
                self.description = content
            elif name == "robots":
                self.robots = content
            elif name == "twitter:card":
                self.twitter_card = content
            elif prop.startswith("og:"):
                self.open_graph[prop] = content
        elif tag == "script" and values.get("type", "").lower() == "application/ld+json":
            self._in_ldjson = True
            self._ldjson_parts = []

    def handle_endtag(self, tag: str) -> None:
        tag = tag.lower()
        if tag == "title":
            self._in_title = False
        elif tag == "h1":
            self._in_h1 = False
        elif tag == "script" and self._in_ldjson:
            self.schema_blobs.append("".join(self._ldjson_parts))
            self._in_ldjson = False

    def handle_data(self, data: str) -> None:
        if self._in_title:
            self.title_parts.append(data)
        if self._in_h1 and self.h1_texts:
            self.h1_texts[-1].append(data)
        if self._in_ldjson:
            self._ldjson_parts.append(data)


def normalized(parts: list[str]) -> str:
    return " ".join(" ".join(parts).split())


def collect_schema_types(node: object, found: set[str]) -> None:
    if isinstance(node, dict):
        value = node.get("@type")
        if isinstance(value, str):
            found.add(value)
        elif isinstance(value, list):
            found.update(item for item in value if isinstance(item, str))
        for child in node.values():
            collect_schema_types(child, found)
    elif isinstance(node, list):
        for child in node:
            collect_schema_types(child, found)


def audit_page(record: dict, decision: str, timeout: float) -> PageSeo:
    _, _, _, body = fetch(record["url"], timeout)
    parser = SeoParser()
    parser.feed(body)

    schema_types: set[str] = set()
    schema_errors: list[str] = []
    for index, blob in enumerate(parser.schema_blobs, start=1):
        try:
            collect_schema_types(json.loads(blob), schema_types)
        except json.JSONDecodeError as exc:
            schema_errors.append(f"JSON-LD блок {index} не парсится: {exc.msg}")

    page = PageSeo(
        path=record["path"],
        url=record["url"],
        pageType=record["pageType"],
        decision=decision,
        title=normalized(parser.title_parts),
        description=parser.description,
        canonical=urllib.parse.urljoin(record["url"], parser.canonical) if parser.canonical else "",
        robots=parser.robots,
        h1Count=len(parser.h1_texts),
        h1=normalized(parser.h1_texts[0]) if parser.h1_texts else "",
        openGraph=parser.open_graph,
        twitterCard=parser.twitter_card,
        schemaTypes=sorted(schema_types),
        microdataTypes=sorted(parser.microdata_types),
        schemaErrors=schema_errors,
    )

    if not page.title:
        page.defects.append("нет title")
    elif not TITLE_MIN <= len(page.title) <= TITLE_MAX:
        page.defects.append(f"длина title {len(page.title)} вне диапазона {TITLE_MIN}–{TITLE_MAX}")
    if not page.description:
        page.defects.append("нет meta description")
    elif not DESCRIPTION_MIN <= len(page.description) <= DESCRIPTION_MAX:
        page.defects.append(
            f"длина description {len(page.description)} вне диапазона {DESCRIPTION_MIN}–{DESCRIPTION_MAX}"
        )
    if page.h1Count == 0:
        page.defects.append("нет h1")
    elif page.h1Count > 1:
        page.defects.append(f"несколько h1 на странице ({page.h1Count})")
    if not page.canonical:
        page.defects.append("нет canonical")
    else:
        parsed = urllib.parse.urlparse(page.canonical)
        if parsed.scheme != "https" or parsed.netloc != PRODUCTION_HOST:
            page.defects.append(f"canonical вне https://{PRODUCTION_HOST}: {page.canonical}")
    for key in REQUIRED_OG:
        if not page.openGraph.get(key):
            page.defects.append(f"нет {key}")
    if not page.twitterCard:
        page.defects.append("нет twitter:card")
    if not page.schemaTypes:
        found = ", ".join(page.microdataTypes) if page.microdataTypes else "ничего"
        page.defects.append(f"нет JSON-LD (в микроразметке: {found})")
    elif page.pageType in BREADCRUMB_PAGE_TYPES and "BreadcrumbList" not in page.schemaTypes:
        page.defects.append("нет BreadcrumbList в structured data")
    page.defects.extend(page.schemaErrors)
    return page


def render_markdown(payload: dict) -> str:
    summary = payload["summary"]
    lines = [
        "# KIBER PORTAL — SEO-аудит production",
        "",
        f"Дата: {payload['generatedAt'][:10]}",
        "Задача: KP-071 / KIBER-51. Вход: реестр URL KIBER-40 и решения KIBER-41.",
        "",
        "Проверяется статический HTML, который отдаёт сервер, — то же, что видит краулер до исполнения JS.",
        "Новая сборка уже проверена (`docs/rendered-schema-audit.md` и соседние отчёты). Здесь —",
        "состояние сайта, который индексируется прямо сейчас, и baseline метаданных, который",
        "не должен потеряться при cutover.",
        "",
        "## Итог",
        "",
        f"- Проверено страниц: {summary['total']}",
        f"- Без дефектов: {summary['clean']}",
        f"- С дефектами: {summary['withDefects']}",
        f"- Дубли title: {summary['duplicateTitles']}",
        f"- Дубли description: {summary['duplicateDescriptions']}",
        "",
        "## Дефекты по частоте",
        "",
    ]
    for defect, count in sorted(summary["defectCounts"].items(), key=lambda item: (-item[1], item[0])):
        lines.append(f"- {defect}: {count}")
    lines += [
        "",
        "## Страницы с дефектами",
        "",
        "| URL | Тип | Решение KIBER-41 | Дефекты |",
        "|---|---|---|---|",
    ]
    for page in payload["pages"]:
        if not page["defects"]:
            continue
        lines.append(
            f"| `{page['path']}` | {page['pageType']} | {page['decision']} | " + "; ".join(page["defects"]) + " |"
        )
    lines += [
        "",
        "## Baseline метаданных для сохраняемых URL",
        "",
        "Эти значения новая сборка обязана воспроизвести на тех же адресах: расхождение здесь —",
        "потеря накопленных сигналов, а не косметика.",
        "",
        "| URL | title | h1 | JSON-LD | микроразметка |",
        "|---|---|---|---|---|",
    ]
    for page in payload["pages"]:
        if page["decision"] != "keep":
            continue
        lines.append(
            f"| `{page['path']}` | {page['title'] or '—'} | {page['h1'] or '—'} | "
            + (", ".join(page["schemaTypes"]) or "—")
            + " | "
            + (", ".join(page["microdataTypes"]) or "—")
            + " |"
        )
    lines += [
        "",
        "## Как обновлять",
        "",
        "```bash",
        "python3 scripts/audit_production_seo.py",
        "```",
        "",
    ]
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--registry", type=Path, default=Path("data/seo/production-url-registry.json"))
    parser.add_argument("--decisions", type=Path, default=Path("data/seo/production-url-decisions.json"))
    parser.add_argument("--timeout", type=float, default=30.0)
    parser.add_argument("--json-out", type=Path, default=Path("data/seo/production-seo-audit.json"))
    parser.add_argument("--markdown-out", type=Path, default=Path("docs/production-seo-audit.md"))
    args = parser.parse_args()

    registry = json.loads(args.registry.read_text(encoding="utf-8"))
    decisions = {
        item["path"]: item["decision"]
        for item in json.loads(args.decisions.read_text(encoding="utf-8"))["decisions"]
    }

    pages: list[PageSeo] = []
    for index, record in enumerate(registry["urls"], start=1):
        page = audit_page(record, decisions.get(record["path"], "unknown"), args.timeout)
        pages.append(page)
        print(f"[{index}/{len(registry['urls'])}] {page.path}: {len(page.defects)} дефектов", file=sys.stderr)

    defect_counts: dict[str, int] = {}
    for page in pages:
        for defect in page.defects:
            key = re.sub(r"\d+", "N", defect).split(":")[0]
            defect_counts[key] = defect_counts.get(key, 0) + 1

    def duplicates(values: list[str]) -> int:
        seen: dict[str, int] = {}
        for value in values:
            if value:
                seen[value] = seen.get(value, 0) + 1
        return sum(count for count in seen.values() if count > 1)

    payload = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "task": "KP-071 / KIBER-51",
        "summary": {
            "total": len(pages),
            "clean": sum(1 for page in pages if not page.defects),
            "withDefects": sum(1 for page in pages if page.defects),
            "defectCounts": defect_counts,
            "duplicateTitles": duplicates([page.title for page in pages]),
            "duplicateDescriptions": duplicates([page.description for page in pages]),
        },
        "pages": [asdict(page) for page in pages],
    }

    args.json_out.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    args.markdown_out.write_text(render_markdown(payload), encoding="utf-8")
    print(f"Wrote {args.json_out} and {args.markdown_out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
