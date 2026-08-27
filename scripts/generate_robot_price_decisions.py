#!/usr/bin/env python3
"""Generate the approved robot pricing decision pack for KIBER-42/KIBER-44.

The approved XLSX tariff workbook is the business source of truth. This script
projects it into the decision layer consumed by validators/components and keeps
catalog growth/exclusion signals explicit.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
APPROVED_TARIFFS_PATH = ROOT / "data/models/robot-tariffs-approved.json"
DECISIONS_PATH = ROOT / "data/models/pricing-decision-template.json"
REVIEW_PATH = ROOT / "docs/robot-price-decisions-review-table.md"


def read_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as fh:
        return json.load(fh)


def write_json(path: Path, payload: Any) -> None:
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def fmt(value: Any) -> str:
    if value in (None, "", []):
        return "—"
    if isinstance(value, list):
        return ", ".join(map(str, value)) or "—"
    return str(value).replace("\n", " ")


def build_decision(record: dict[str, Any], approved_doc: dict[str, Any]) -> dict[str, Any]:
    unit = record["unit"]
    amount = record["amount"]
    is_request = unit == "request"
    source = approved_doc["source"]
    approved_on = approved_doc["approvedOn"]
    return {
        "slug": record["slug"],
        "robotName": record["sourceName"],
        "modelName": record["sourceName"],
        "catalogStatus": record["catalogStatus"],
        "mappingStatus": record["mappingStatus"],
        "decisionStatus": "approved",
        "approved": True,
        "canonicalPriceDisplay": record["canonicalPriceDisplay"],
        "proposedCurrentDisplay": record["canonicalPriceDisplay"],
        "amount": amount,
        "currency": record["currency"],
        "unit": unit,
        "qualifier": "request" if is_request else "from",
        "minimum": record["minimum"],
        "validFrom": approved_on,
        "validUntil": "",
        "owner": "Александр Маркин / Denis Rogov",
        "reviewedOn": approved_on,
        "source": {
            "type": "approved_xlsx",
            "ref": source["file"],
            "sheet": source["sheet"],
            "notes": source["notes"],
        },
        "tariffs": record["tariffs"],
        "risk": {
            "hasPriceConflict": False,
            "uniquePriceMentions": [],
            "auditStatus": "superseded_by_approved_xlsx",
            "reason": "Утверждённый XLSX от Александра и Дениса является базовым источником; прежние live/source конфликты не выбирают цену автоматически.",
        },
        "businessNotes": "Use XLSX as base; future changes replace parameters in the workbook/imported dataset.",
        "approvedBy": "Александр Маркин / Denis Rogov",
        "approvedAt": approved_on,
    }


def main() -> int:
    approved_doc = read_json(APPROVED_TARIFFS_PATH)
    decisions = [build_decision(record, approved_doc) for record in approved_doc.get("robots", [])]
    summary = {
        "robots": len(decisions),
        "approved": sum(1 for d in decisions if d["decisionStatus"] == "approved"),
        "needs_review": 0,
        "missing": 0,
        "requestOnlyApproved": sum(1 for d in decisions if d["unit"] == "request"),
        "newUnmapped": approved_doc["summary"]["newUnmapped"],
        "missingFromXlsx": approved_doc["summary"]["missingFromXlsx"],
        "ownerMissing": sum(1 for d in decisions if not d["owner"]),
        "reviewDateMissing": sum(1 for d in decisions if not d["reviewedOn"]),
    }
    payload = {
        "version": "1.0.0",
        "status": "approved_from_xlsx",
        "description": "All-24 robot pricing decision pack generated from the business-approved XLSX tariff source. Future catalog additions/exclusions are represented by mappingStatus/catalogChanges, not silent deletion.",
        "generatedAt": approved_doc["approvedOn"],
        "sourceReports": [
            approved_doc["source"]["file"],
            "data/models/robot-tariffs-approved.json",
            "docs/robot-tariffs-approved-review-table.md",
        ],
        "summary": summary,
        "catalogPolicy": approved_doc["catalogPolicy"],
        "catalogChanges": approved_doc["catalogChanges"],
        "decisions": decisions,
        "applyRules": [
            "The approved XLSX is the canonical base for current prices.",
            "Future edits replace parameters in the XLSX/imported approved tariff dataset.",
            "Rows present in XLSX are active catalog/pricing candidates.",
            "New unmapped rows require slug/content mapping before publication.",
            "Existing robots absent from XLSX are exclusion candidates and must not be silently deleted.",
            "Never use 0 for unknown or not-applicable prices; use explicit request/not_applicable/new_unmapped/exclusion statuses.",
        ],
    }
    write_json(DECISIONS_PATH, payload)
    write_review(payload)
    print(json.dumps(payload["summary"], ensure_ascii=False, indent=2))
    return 0


def write_review(payload: dict[str, Any]) -> None:
    lines = [
        "# Review-таблица утверждённых ценовых решений по 24 роботам",
        "",
        f"Статус: `{payload['status']}`",
        f"Дата: {payload['generatedAt']}",
        "",
        "Цены основаны на XLSX, который Александр подтвердил как полностью подготовленный и ранее утверждённый Александром и Денисом. Спорные live/source mentions считаются superseded этим источником.",
        "",
        "## Сводка",
        "",
        f"- Роботов: {payload['summary']['robots']}",
        f"- Approved: {payload['summary']['approved']}",
        f"- Request-only approved: {payload['summary']['requestOnlyApproved']}",
        f"- New unmapped rows: {payload['summary']['newUnmapped']}",
        f"- Existing robots absent from XLSX: {payload['summary']['missingFromXlsx']}",
        "",
        "## Таблица",
        "",
        "| Статус | Робот | Slug | Mapping | Публичная формула | Unit | Amount | Минимум | Owner | Reviewed on | Source |",
        "|---|---|---|---|---|---|---:|---|---|---|---|",
    ]
    for d in payload["decisions"]:
        lines.append(
            "| {status} | {name} | `{slug}` | {mapping} | {display} | {unit} | {amount} | {minimum} | {owner} | {reviewed} | {source} |".format(
                status=d["decisionStatus"],
                name=fmt(d["modelName"]),
                slug=d["slug"],
                mapping=d["mappingStatus"],
                display=fmt(d["canonicalPriceDisplay"]),
                unit=fmt(d["unit"]),
                amount=fmt(d["amount"]),
                minimum=fmt(d["minimum"].get("display")),
                owner=fmt(d["owner"]),
                reviewed=fmt(d["reviewedOn"]),
                source=fmt(d["source"].get("ref")),
            )
        )
    lines.extend([
        "",
        "## Как менять цены дальше",
        "",
        "1. Обновить XLSX-источник `data/models/source/robot-tariffs-approved.xlsx`.",
        "2. Запустить `python3 scripts/import_approved_robot_tariffs.py`.",
        "3. Запустить `python3 scripts/generate_robot_price_decisions.py`.",
        "4. Запустить validator/tests.",
        "5. Если появились `new_unmapped` или `missingFromXlsx`, принять отдельное решение: добавить slug/page или исключить модель из каталога.",
    ])
    REVIEW_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")


if __name__ == "__main__":
    raise SystemExit(main())
