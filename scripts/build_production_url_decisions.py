#!/usr/bin/env python3
"""Decide keep/merge/delete/redirect for every production URL (KP-065 / KIBER-41).

The decision for each URL is derived from the registry built by
`build_production_url_registry.py` plus a live scan of internal links: a URL that
nothing links to and that carries no public content is safe to retire, while a
URL with inbound links needs a redirect target instead. Decisions that depend on
business intent rather than evidence are marked `needsApproval` and left for the
owner to confirm before KP-066 turns them into an active redirect registry.
"""

from __future__ import annotations

import argparse
import json
import sys
import time
import urllib.parse
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from build_production_url_registry import PRODUCTION_HOST, fetch  # noqa: E402

# Manual mapping for URLs whose fate cannot be derived from the crawl alone.
# `needsApproval` means the evidence supports the action but the owner decides.
MANUAL_DECISIONS: dict[str, dict[str, object]] = {
    "/page185196309.html": {
        "decision": "redirect",
        "target": "/neobychnyi-podarok-direktoru-robot",
        "httpAction": "301",
        "reason": "Служебный дубль статьи: страница уже указывает canonical на статью, поэтому вес нужно передать редиректом, а не терять.",
        "needsApproval": False,
    },
    "/astri": {
        "decision": "redirect",
        "target": "/roboty-gumanoidy",
        "httpAction": "301",
        "reason": "Заглушка Astribot без контента и с http-canonical. Робота нет в каталоге 24 позиций, поэтому ближайшая релевантная цель — коллекция гуманоидов.",
        "needsApproval": True,
        "approvalQuestion": "Astribot возвращается в каталог как отдельная страница робота или URL закрывается редиректом на /roboty-gumanoidy?",
    },
    "/page135870606.html": {
        "decision": "delete",
        "target": None,
        "httpAction": "410 после cutover; до cutover оставить как обработчик 404 в Tilda",
        "reason": "Системная страница 404 Tilda. Из sitemap убирается сразу, но саму страницу нельзя удалять, пока Tilda обслуживает production (см. KIBER-29).",
        "needsApproval": False,
    },
}

DEFAULT_DELETE_REASON = "Служебная страница Tilda без публичного контента, опубликована в sitemap и индексируется."


class LinkParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.hrefs: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag.lower() != "a":
            return
        for key, value in attrs:
            if key.lower() == "href" and value:
                self.hrefs.append(value.strip())


def internal_link_counts(urls: list[str], timeout: float, delay: float) -> dict[str, dict[str, list[str]]]:
    """Map each path to the paths that link to it (production pages only)."""
    inbound: dict[str, set[str]] = {}
    for index, url in enumerate(urls, start=1):
        source_path = urllib.parse.urlparse(url).path or "/"
        _, _, _, body = fetch(url, timeout)
        parser = LinkParser()
        parser.feed(body)
        for href in parser.hrefs:
            absolute = urllib.parse.urljoin(url, href)
            parsed = urllib.parse.urlparse(absolute)
            if parsed.netloc.replace("www.", "") != PRODUCTION_HOST.replace("www.", ""):
                continue
            target = parsed.path or "/"
            if target == source_path:
                continue
            inbound.setdefault(target, set()).add(source_path)
        print(f"[links {index}/{len(urls)}] {source_path}", file=sys.stderr)
        if delay:
            time.sleep(delay)
    return {path: {"sources": sorted(sources)} for path, sources in inbound.items()}


def decide(record: dict, inbound: dict[str, dict[str, list[str]]]) -> dict:
    path = record["path"]
    sources = inbound.get(path, {}).get("sources", [])
    manual = MANUAL_DECISIONS.get(path)

    if manual:
        decision = dict(manual)
    elif record["status"] == "junk":
        decision = {
            "decision": "delete",
            "target": None,
            "httpAction": "410 + удалить из sitemap",
            "reason": DEFAULT_DELETE_REASON,
            "needsApproval": False,
        }
    else:
        fixes = [issue for issue in record["issues"] if issue not in {"redirected"}]
        decision = {
            "decision": "keep",
            "target": record["rebuildRoute"],
            "httpAction": "200 на том же адресе",
            "reason": "Публичная страница с рабочим адресом и соответствующим маршрутом в controlled rebuild — URL сохраняется без изменений.",
            "needsApproval": False,
        }
        if fixes:
            decision["reason"] = (
                "URL сохраняется, но перед релизом нужно закрыть: " + "; ".join(fixes) + "."
            )
            decision["fixes"] = fixes

    if decision["decision"] == "delete" and sources:
        decision["needsApproval"] = True
        decision["approvalQuestion"] = (
            "На страницу ведут внутренние ссылки (" + ", ".join(sources) + "). Убрать ссылки или заменить решение на redirect?"
        )

    decision.update(
        {
            "path": path,
            "url": record["url"],
            "pageType": record["pageType"],
            "registryStatus": record["status"],
            "rebuildRoute": record["rebuildRoute"],
            "inboundInternalLinks": sources,
        }
    )
    return decision


def render_markdown(payload: dict) -> str:
    summary = payload["summary"]
    lines = [
        "# KIBER PORTAL — решения keep/merge/delete/redirect по production URL",
        "",
        f"Дата: {payload['generatedAt'][:10]}",
        "Задача: KP-065 / KIBER-41. Вход: `data/seo/production-url-registry.json` (KP-064) + живой обход внутренних ссылок.",
        "Выход: вход для KP-066 (registry редиректов и чистый sitemap).",
        "",
        "## Итог",
        "",
        f"- Всего URL: {summary['total']}",
        f"- keep: {summary['byDecision'].get('keep', 0)}",
        f"- redirect: {summary['byDecision'].get('redirect', 0)}",
        f"- delete: {summary['byDecision'].get('delete', 0)}",
        f"- merge: {summary['byDecision'].get('merge', 0)}",
        f"- Требуют решения владельца: {summary['needsApproval']}",
        "",
        "Правило: ни одно решение не применяется к production до cutover. Пока меняется только реестр,",
        "Tilda остаётся замороженной (KIBER-5).",
        "",
        "## Требуют решения владельца",
        "",
    ]
    pending = [item for item in payload["decisions"] if item.get("needsApproval")]
    if pending:
        for item in pending:
            lines.append(f"- `{item['path']}` → **{item['decision']}**: {item.get('approvalQuestion', item['reason'])}")
    else:
        lines.append("- нет")
    lines += [
        "",
        "## Решения",
        "",
        "| # | URL | Тип | Решение | Цель | HTTP | Внутренние ссылки | Обоснование |",
        "|---:|---|---|---|---|---|---:|---|",
    ]
    for index, item in enumerate(payload["decisions"], start=1):
        lines.append(
            "| {index} | `{path}` | {page_type} | {decision}{flag} | {target} | {http} | {links} | {reason} |".format(
                index=index,
                path=item["path"],
                page_type=item["pageType"],
                decision=item["decision"],
                flag=" ⚠️" if item.get("needsApproval") else "",
                target=f"`{item['target']}`" if item.get("target") else "—",
                http=item["httpAction"],
                links=len(item["inboundInternalLinks"]),
                reason=item["reason"],
            )
        )
    lines += [
        "",
        "## Как обновлять",
        "",
        "```bash",
        "python3 scripts/build_production_url_registry.py",
        "python3 scripts/build_production_url_decisions.py",
        "```",
        "",
    ]
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--registry", type=Path, default=Path("data/seo/production-url-registry.json"))
    parser.add_argument("--timeout", type=float, default=30.0)
    parser.add_argument("--delay", type=float, default=0.7)
    parser.add_argument("--json-out", type=Path, default=Path("data/seo/production-url-decisions.json"))
    parser.add_argument("--markdown-out", type=Path, default=Path("docs/production-url-decisions.md"))
    args = parser.parse_args()

    registry = json.loads(args.registry.read_text(encoding="utf-8"))
    urls = [record["url"] for record in registry["urls"]]
    inbound = internal_link_counts(urls, args.timeout, args.delay)

    decisions = [decide(record, inbound) for record in registry["urls"]]
    by_decision: dict[str, int] = {}
    for item in decisions:
        by_decision[item["decision"]] = by_decision.get(item["decision"], 0) + 1

    payload = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "task": "KP-065 / KIBER-41",
        "registrySource": str(args.registry),
        "summary": {
            "total": len(decisions),
            "byDecision": by_decision,
            "needsApproval": sum(1 for item in decisions if item.get("needsApproval")),
        },
        "decisions": decisions,
    }

    args.json_out.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    args.markdown_out.write_text(render_markdown(payload), encoding="utf-8")
    print(f"Wrote {args.json_out} and {args.markdown_out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
