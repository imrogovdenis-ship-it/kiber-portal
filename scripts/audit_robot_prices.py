#!/usr/bin/env python3
"""Audit the price shown for each of the 24 robots (KP-061 / KIBER-44).

Every robot gets one of three verdicts — `approved`, `needs_review`, `missing` —
derived from independent sources instead of a single guess:

1. prices written in the page's own content blocks on the live production page;
2. the price on the catalog card that advertises the robot on other pages;
3. the canonical `pricing` record in the internal source of truth (optional).

Disagreement between sources is what the launch needs to see, so the report
never picks a winner on its own: it records the evidence, marks the robot
`needs_review` and leaves the owner and the date on the record.

The repository is public, so internal tariff values that are not already
published on the live site are counted, never printed.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
import urllib.parse
from dataclasses import dataclass, field
from datetime import date, datetime, timezone
from html.parser import HTMLParser
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from build_production_url_registry import fetch  # noqa: E402

PRICE_RE = re.compile(r"(от\s+)?(\d[\d\s ]{2,})\s*(?:₽|руб)", re.IGNORECASE)
UNIT_PATTERNS = (
    ("hour", re.compile(r"/?\s*час", re.IGNORECASE)),
    ("day", re.compile(r"/?\s*(день|сутки|дня)", re.IGNORECASE)),
    ("shift", re.compile(r"/?\s*смена", re.IGNORECASE)),
)
# A same-unit spread wider than this between two prices in the page's own copy is
# treated as a data error rather than a tariff ladder (e.g. 70 000 vs 705 000).
SUSPICIOUS_RATIO = 3.0
DEFAULT_OWNER = "Denis Rogov"


@dataclass
class PriceMention:
    text: str
    amount: int
    qualifier: str  # "from" | "exact"
    unit: str  # "hour" | "day" | "shift" | "unspecified"
    source: str  # "page copy" | "catalog card" | "source of truth"

    def key(self) -> tuple[int, str, str]:
        return (self.amount, self.qualifier, self.unit)


@dataclass
class RobotAudit:
    slug: str
    url: str
    name: str
    verdict: str = "missing"
    owner: str | None = None
    reviewedOn: str = ""
    pagePrices: list[dict] = field(default_factory=list)
    catalogCardPrice: dict | None = None
    sourceOfTruth: dict | None = None
    internalTariffs: dict | None = None
    conflicts: list[str] = field(default_factory=list)
    evidence: list[str] = field(default_factory=list)


class PageParser(HTMLParser):
    """Split a Tilda page into its own copy and the catalog cards it renders."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.own_text_chunks: list[str] = []
        self.cards: list[dict[str, str]] = []
        self._card_depth = 0
        self._depth = 0
        self._current_card: dict[str, str] | None = None
        self._capture: str | None = None
        self._capture_parts: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = {key.lower(): value or "" for key, value in attrs}
        classes = values.get("class", "").split()
        self._depth += 1

        if "js-product" in classes and self._current_card is None:
            self._current_card = {"href": "", "title": "", "price": ""}
            self._card_depth = self._depth
        if self._current_card is not None:
            if tag.lower() == "a" and "js-product-link" in classes and not self._current_card["href"]:
                self._current_card["href"] = values.get("href", "").strip()
            if "js-product-name" in classes:
                self._start_capture("title")
            elif "js-product-price" in classes:
                self._start_capture("price")

    def handle_endtag(self, tag: str) -> None:
        if self._capture and self._capture_parts is not None:
            # Capture ends at the first closing tag after the capturing element.
            self._finish_capture()
        if self._current_card is not None and self._depth == self._card_depth:
            if self._current_card["href"]:
                self.cards.append(self._current_card)
            self._current_card = None
        self._depth = max(0, self._depth - 1)

    def handle_data(self, data: str) -> None:
        if self._capture:
            self._capture_parts.append(data)
        elif self._current_card is None:
            self.own_text_chunks.append(data)

    def _start_capture(self, name: str) -> None:
        self._capture = name
        self._capture_parts = []

    def _finish_capture(self) -> None:
        if self._current_card is not None and self._capture:
            text = " ".join(" ".join(self._capture_parts).split())
            if text and not self._current_card[self._capture]:
                self._current_card[self._capture] = text
        self._capture = None
        self._capture_parts = []


def detect_unit(context: str) -> str:
    for unit, pattern in UNIT_PATTERNS:
        if pattern.search(context):
            return unit
    return "unspecified"


def parse_prices(text: str, source: str) -> list[PriceMention]:
    normalized = " ".join(text.split())
    mentions: list[PriceMention] = []
    for match in PRICE_RE.finditer(normalized):
        amount = int(re.sub(r"[\s ]", "", match.group(2)))
        if amount < 1000:
            continue
        tail = normalized[match.end() : match.end() + 24]
        snippet = normalized[max(0, match.start() - 40) : match.end() + 24].strip()
        mentions.append(
            PriceMention(
                text=snippet,
                amount=amount,
                qualifier="from" if match.group(1) else "exact",
                unit=detect_unit(tail),
                source=source,
            )
        )
    return mentions


def dedupe(mentions: list[PriceMention]) -> list[PriceMention]:
    seen: set[tuple[int, str, str]] = set()
    unique: list[PriceMention] = []
    for mention in mentions:
        if mention.key() in seen:
            continue
        seen.add(mention.key())
        unique.append(mention)
    return unique


def derived_rate_note(price_from: int, unit: str | None, page_mentions: list[PriceMention]) -> str:
    """Flag an hourly rate that is arithmetic on the daily price rather than a tariff."""
    if unit != "hour":
        return ""
    day_prices = [mention.amount for mention in page_mentions if mention.unit == "day"]
    if not day_prices:
        return ""
    for divisor in (8, 4, 6, 10, 12):
        candidate = min(day_prices) / divisor
        if candidate and abs(candidate - price_from) / price_from <= 0.06:
            return (
                f"Часовая ставка выглядит расчётной: дневная цена {min(day_prices):,} ₽ ÷ {divisor} ≈ {price_from:,} ₽. ".replace(",", " ")
                + "На сайте такой ставки нет, бизнес её не подтверждал — по KP-060 неизвестную цену нельзя выводить вычислением."
            )
    return ""


def load_source_of_truth(directory: Path | None) -> dict[str, dict]:
    if directory is None:
        return {}
    path = directory / "robots.source-of-truth.json"
    if not path.exists():
        print(f"warning: {path} not found, auditing public sources only", file=sys.stderr)
        return {}
    payload = json.loads(path.read_text(encoding="utf-8"))
    return {robot["slug"]: robot for robot in payload["robots"]}


def slug_from_url(url: str) -> str:
    return (urllib.parse.urlparse(url).path or "/").strip("/")


def audit(
    robot_urls: list[dict],
    source_of_truth: dict[str, dict],
    timeout: float,
    delay: float,
) -> list[RobotAudit]:
    pages: dict[str, str] = {}
    # A robot's card is rendered on many pages; keeping every variant makes an
    # inconsistent catalog visible instead of hiding it behind the first hit.
    card_prices: dict[str, dict[str, list[str]]] = {}

    for index, record in enumerate(robot_urls, start=1):
        _, _, _, body = fetch(record["url"], timeout)
        parser = PageParser()
        parser.feed(body)
        pages[record["path"]] = " ".join(" ".join(parser.own_text_chunks).split())
        for card in parser.cards:
            path = urllib.parse.urlparse(card["href"]).path or "/"
            if card["price"]:
                card_prices.setdefault(path, {}).setdefault(card["price"], []).append(record["path"])
        print(f"[{index}/{len(robot_urls)}] {record['path']}", file=sys.stderr)
        if delay:
            time.sleep(delay)

    today = date.today().isoformat()
    results: list[RobotAudit] = []
    for record in robot_urls:
        path = record["path"]
        slug = slug_from_url(record["url"])
        robot = source_of_truth.get(slug)
        entry = RobotAudit(
            slug=slug,
            url=record["url"],
            name=(robot or {}).get("name") or record.get("title") or slug,
            reviewedOn=today,
        )

        page_mentions = dedupe(parse_prices(pages.get(path, ""), "page copy"))
        entry.pagePrices = [
            {"amount": m.amount, "qualifier": m.qualifier, "unit": m.unit, "context": m.text}
            for m in page_mentions
        ]

        card_variants = card_prices.get(path, {})
        card_text = next(iter(card_variants), "")
        card_mentions = parse_prices(f"{card_text} ₽", "catalog card") if card_text else []
        if card_mentions:
            first = card_mentions[0]
            entry.catalogCardPrice = {
                "amount": first.amount,
                "qualifier": first.qualifier,
                "unit": first.unit,
                "text": card_text,
                "variants": {text: sorted(set(sources)) for text, sources in card_variants.items()},
            }

        public_amounts = {m.amount for m in page_mentions}

        if robot:
            pricing = robot.get("pricing", {}) or {}
            entry.sourceOfTruth = {
                "display": pricing.get("display"),
                "priceFrom": pricing.get("priceFrom"),
                "currency": pricing.get("currency"),
                "unit": pricing.get("unit"),
                "sourceStatus": pricing.get("sourceStatus"),
                "priceAuditStatus": (robot.get("normalization") or {}).get("priceAuditStatus"),
            }
            packages = pricing.get("packages") or []
            entry.internalTariffs = {
                "count": len(packages),
                "publishedOnSite": sum(1 for pkg in packages if pkg.get("priceFrom") in public_amounts),
                "note": "Значения внутренних пакетов не публикуются в этом отчёте: репозиторий публичный.",
            }

        # --- conflict detection -------------------------------------------------
        if not page_mentions and not entry.catalogCardPrice:
            entry.verdict = "missing"
            entry.conflicts.append("Цена не найдена ни на странице, ни на карточке каталога.")
        else:
            if entry.catalogCardPrice and page_mentions:
                card_amount = entry.catalogCardPrice["amount"]
                if card_amount not in public_amounts:
                    entry.conflicts.append(
                        f"Карточка каталога показывает {card_amount:,} ₽".replace(",", " ")
                        + ", такой цены нет в тексте страницы: "
                        + ", ".join(f"{m.amount:,} ₽/{m.unit}".replace(",", " ") for m in page_mentions)
                    )
            by_unit: dict[str, list[int]] = {}
            for mention in page_mentions:
                by_unit.setdefault(mention.unit, []).append(mention.amount)
            for unit, amounts in by_unit.items():
                if len(amounts) > 1 and max(amounts) / min(amounts) > SUSPICIOUS_RATIO:
                    entry.conflicts.append(
                        f"На странице несколько цен за одну и ту же единицу ({unit}): "
                        + ", ".join(f"{amount:,} ₽".replace(",", " ") for amount in sorted(amounts))
                        + " — похоже на ошибку в данных."
                    )
            if entry.catalogCardPrice and len(entry.catalogCardPrice.get("variants", {})) > 1:
                entry.conflicts.append(
                    "Карточка робота показывает разные цены на разных страницах: "
                    + "; ".join(
                        f"«{text} ₽» на {', '.join(sources)}"
                        for text, sources in entry.catalogCardPrice["variants"].items()
                    )
                )
            if entry.sourceOfTruth:
                price_from = entry.sourceOfTruth.get("priceFrom")
                if price_from and price_from not in public_amounts:
                    entry.conflicts.append(
                        f"Источник истины хранит «{entry.sourceOfTruth['display']}», "
                        "но эта сумма не встречается в публичном тексте страницы."
                    )
                    derived = derived_rate_note(price_from, entry.sourceOfTruth.get("unit"), page_mentions)
                    if derived:
                        entry.conflicts.append(derived)
                if entry.sourceOfTruth.get("sourceStatus") != "approved":
                    entry.conflicts.append(
                        f"Источник истины помечен как `{entry.sourceOfTruth.get('sourceStatus')}` — цена не подтверждена бизнесом."
                    )
            elif source_of_truth:
                entry.conflicts.append("Робот отсутствует в источнике истины по слагу.")

            entry.verdict = "needs_review" if entry.conflicts else "approved"

        if entry.verdict != "approved":
            entry.owner = DEFAULT_OWNER
        entry.evidence = [m.text for m in page_mentions]
        results.append(entry)
    return results


def render_markdown(payload: dict) -> str:
    summary = payload["summary"]
    lines = [
        "# KIBER PORTAL — аудит цен по 24 роботам",
        "",
        f"Дата: {payload['generatedAt'][:10]}",
        "Задача: KP-061 / KIBER-44. Схема цены: KP-060 / KIBER-42.",
        "Источники: текст живой production-страницы, карточка каталога, внутренний источник истины.",
        "",
        "## Итог",
        "",
        f"- approved: {summary['byVerdict'].get('approved', 0)}",
        f"- needs_review: {summary['byVerdict'].get('needs_review', 0)}",
        f"- missing: {summary['byVerdict'].get('missing', 0)}",
        f"- Всего роботов: {summary['total']}",
        "",
        "Репозиторий публичный, поэтому значения внутренних пакетных тарифов здесь не печатаются —",
        "только факт их наличия и совпадения с опубликованной ценой.",
        "",
        "## Роботы, требующие решения",
        "",
        "| Робот | URL | Вердикт | Владелец | Конфликт |",
        "|---|---|---|---|---|",
    ]
    for item in payload["robots"]:
        if item["verdict"] == "approved":
            continue
        lines.append(
            "| {name} | `/{slug}` | {verdict} | {owner} | {conflicts} |".format(
                name=item["name"],
                slug=item["slug"],
                verdict=item["verdict"],
                owner=item["owner"] or "—",
                conflicts="<br>".join(item["conflicts"]),
            )
        )
    lines += [
        "",
        "## Полная таблица",
        "",
        "| # | Робот | Вердикт | Цены на странице | Карточка каталога | Источник истины | Проверено |",
        "|---:|---|---|---|---|---|---|",
    ]
    for index, item in enumerate(payload["robots"], start=1):
        page = ", ".join(
            f"{'от ' if price['qualifier'] == 'from' else ''}{price['amount']:,} ₽/{price['unit']}".replace(",", " ")
            for price in item["pagePrices"]
        ) or "—"
        card = item["catalogCardPrice"]["text"] + " ₽" if item["catalogCardPrice"] else "—"
        truth = (item["sourceOfTruth"] or {}).get("display") or "—"
        lines.append(
            f"| {index} | {item['name']} | {item['verdict']} | {page} | {card} | {truth} | {item['reviewedOn']} |"
        )
    lines += [
        "",
        "## Как обновлять",
        "",
        "```bash",
        "python3 scripts/audit_robot_prices.py --legacy-data-dir <путь к data/models>",
        "```",
        "",
        "Без `--legacy-data-dir` аудит опирается только на публичные источники;",
        "источник истины пока живёт вне канонического репозитория (KIBER-16).",
        "",
    ]
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--registry", type=Path, default=Path("data/seo/production-url-registry.json"))
    parser.add_argument("--legacy-data-dir", type=Path, default=None)
    parser.add_argument("--timeout", type=float, default=30.0)
    parser.add_argument("--delay", type=float, default=0.7)
    parser.add_argument("--json-out", type=Path, default=Path("data/models/robot-price-audit.json"))
    parser.add_argument("--markdown-out", type=Path, default=Path("docs/robot-price-audit.md"))
    args = parser.parse_args()

    registry = json.loads(args.registry.read_text(encoding="utf-8"))
    robot_urls = [record for record in registry["urls"] if record["pageType"] == "robot detail"]

    source_of_truth = load_source_of_truth(args.legacy_data_dir)
    results = audit(robot_urls, source_of_truth, args.timeout, args.delay)

    by_verdict: dict[str, int] = {}
    for item in results:
        by_verdict[item.verdict] = by_verdict.get(item.verdict, 0) + 1

    payload = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "task": "KP-061 / KIBER-44",
        "sources": {
            "productionPages": len(robot_urls),
            "sourceOfTruth": str(args.legacy_data_dir) if source_of_truth else None,
        },
        "summary": {"total": len(results), "byVerdict": by_verdict},
        "robots": [item.__dict__ for item in results],
    }

    args.json_out.parent.mkdir(parents=True, exist_ok=True)
    args.json_out.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    args.markdown_out.write_text(render_markdown(payload), encoding="utf-8")
    print(f"Wrote {args.json_out} and {args.markdown_out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
