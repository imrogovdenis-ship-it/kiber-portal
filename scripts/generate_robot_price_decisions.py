#!/usr/bin/env python3
"""Generate all-robot pricing decision pack for KIBER-42/KIBER-44.

This script does not approve business prices. It creates a review layer that
separates current source-of-truth values from business approval status.
"""

from __future__ import annotations

import json
from datetime import date
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
ROBOTS_PATH = ROOT / "data/models/robots.source-of-truth.json"
RISK_AUDIT_PATH = ROOT / "data/models/pricing-risk-audit.json"
DECISIONS_PATH = ROOT / "data/models/pricing-decision-template.json"
REVIEW_PATH = ROOT / "docs/robot-price-decisions-review-table.md"

OWNER = "business_owner_required"
REVIEW_DATE = date.today().isoformat()
APPROVED_SLUGS = {"arenda-mini-robo-kofeyni"}
MISSING_SLUGS = {"arenda-robota-sofiya", "arenda-unitree-h2"}

STATUS_LABELS = {
    "approved": "approved",
    "needs_review": "needs_review",
    "missing": "missing/request_only",
}


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


def summarize_tariffs(pricing: dict[str, Any]) -> dict[str, Any]:
    tariffs = pricing.get("tariffs", {})
    keys = ["one_hour", "four_hours", "eight_hours", "two_days", "three_days"]
    summary = {}
    for key in keys:
        tariff = tariffs.get(key, {})
        summary[key] = {
            "status": tariff.get("status", "missing"),
            "amount": tariff.get("price"),
            "currency": tariff.get("currency", "RUB"),
            "display": tariff.get("display", ""),
            "publicVisible": tariff.get("publicVisible", False),
            "bookable": tariff.get("bookable", False),
            "sourceValue": tariff.get("sourceValue"),
            "notes": tariff.get("notes", ""),
        }
    return summary


def decision_status(slug: str) -> str:
    if slug in MISSING_SLUGS:
        return "missing"
    if slug in APPROVED_SLUGS:
        return "approved"
    return "needs_review"


def review_reason(slug: str, pricing: dict[str, Any], risk: dict[str, Any] | None) -> str:
    if slug in MISSING_SLUGS:
        return "Цена не опубликована/по запросу; требуется владелец и дата подтверждения request-only политики."
    if slug in APPROVED_SLUGS:
        return "Единственный робот без найденных ценовых расхождений в аудите; всё равно хранится owner/date/source для трассировки."
    reasons = []
    if risk:
        reasons.append("Есть конфликтующие price mentions в live/source audit.")
    tariffs = pricing.get("tariffs", {})
    one = tariffs.get("one_hour", {})
    eight = tariffs.get("eight_hours", {})
    if one.get("price") and eight.get("price") and one.get("price") * 8 == eight.get("price"):
        reasons.append("Маркетинговая часовая ставка выглядит производной от дневного тарифа ÷ 8; нужна бизнес-проверка.")
    if pricing.get("minimumOrder", "").lower().find("needs") >= 0:
        reasons.append("Минимальный заказ требует review.")
    return " ".join(reasons) or "Требуется бизнес-подтверждение цены, владельца и даты."


def main() -> int:
    robots_doc = read_json(ROBOTS_PATH)
    risk_doc = read_json(RISK_AUDIT_PATH)
    risk_by_slug = {record["slug"]: record for record in risk_doc.get("records", [])}

    decisions = []
    for robot in sorted(robots_doc.get("robots", []), key=lambda r: r.get("slug", "")):
        slug = robot["slug"]
        pricing = robot.get("pricing", {})
        risk = risk_by_slug.get(slug)
        status = decision_status(slug)
        canonical = pricing.get("display", "")
        tariffs = summarize_tariffs(pricing)
        decision = {
            "slug": slug,
            "robotName": robot.get("name", ""),
            "modelName": robot.get("modelName", ""),
            "decisionStatus": status,
            "approved": status == "approved",
            "canonicalPriceDisplay": canonical if status == "approved" else "",
            "proposedCurrentDisplay": canonical,
            "amount": pricing.get("priceFrom") if status == "approved" else None,
            "currency": pricing.get("currency", "RUB"),
            "unit": pricing.get("unit", "request") if status == "approved" else "needs_review" if status == "needs_review" else "request",
            "minimum": {
                "status": "needs_review" if status == "needs_review" else status,
                "display": pricing.get("minimumOrder", ""),
            },
            "validFrom": REVIEW_DATE if status == "approved" else "",
            "validUntil": "",
            "owner": "Александр Маркин" if status == "approved" else OWNER,
            "reviewedOn": REVIEW_DATE if status == "approved" else "",
            "source": {
                "type": "xlsx" if pricing.get("tariffSource", {}).get("dataset") else "source_of_truth",
                "ref": pricing.get("tariffSource", {}).get("dataset") or "data/models/robots.source-of-truth.json",
                "capturedOn": pricing.get("tariffSource", {}).get("file", ""),
                "notes": pricing.get("sourceNotes", ""),
            },
            "tariffs": tariffs,
            "risk": {
                "hasPriceConflict": bool(risk),
                "uniquePriceMentions": risk.get("uniquePrices", []) if risk else [],
                "auditStatus": risk.get("status", "no_conflict_record") if risk else "no_conflict_record",
                "reason": review_reason(slug, pricing, risk),
            },
            "businessNotes": "",
            "approvedBy": "Александр Маркин" if status == "approved" else "",
            "approvedAt": REVIEW_DATE if status == "approved" else "",
        }
        decisions.append(decision)

    counts = {"approved": 0, "needs_review": 0, "missing": 0}
    for d in decisions:
        counts[d["decisionStatus"]] += 1

    payload = {
        "version": "0.2.0",
        "status": "awaiting_business_decision",
        "description": "All-24 robot pricing decision pack for KIBER-42/KIBER-44. Do not publish needs_review/missing as approved pricing.",
        "generatedAt": REVIEW_DATE,
        "sourceReports": [
            "docs/pricing-risk-audit.md",
            "docs/robot-tariffs-review-table.md",
            "data/models/pricing-risk-audit.json",
            "data/models/robot-tariffs.json",
            "data/models/robots.source-of-truth.json",
        ],
        "summary": {
            "robots": len(decisions),
            **counts,
            "ownerMissing": sum(1 for d in decisions if d["owner"] == OWNER),
            "reviewDateMissing": sum(1 for d in decisions if not d["reviewedOn"]),
        },
        "decisions": decisions,
        "applyRules": [
            "Do not mark any pricing.sourceStatus as approved until approved=true and canonical fields are filled by the business owner.",
            "pricing.display must be the exact public phrase used by components.",
            "If minimum order exists, include it clearly in minimum.display and/or canonicalPriceDisplay.",
            "Approved price must be used by home card, catalog card, robot page, FAQ, proposal PDF and schema output.",
            "Never use 0 for unknown or not-applicable prices; use explicit status missing/request/not_applicable/needs_review.",
        ],
    }
    write_json(DECISIONS_PATH, payload)

    lines = [
        "# Review-таблица ценовых решений по 24 роботам",
        "",
        f"Дата генерации: {REVIEW_DATE}",
        "",
        "Эта таблица не утверждает спорные цены. Она показывает, какие цены можно считать утверждёнными, какие требуют бизнес-решения, и где цена отсутствует/по запросу.",
        "",
        "## Сводка",
        "",
        f"- Роботов: {len(decisions)}",
        f"- Approved: {counts['approved']}",
        f"- Needs review: {counts['needs_review']}",
        f"- Missing/request-only: {counts['missing']}",
        f"- Требуется владелец цены: {payload['summary']['ownerMissing']}",
        f"- Требуется дата review: {payload['summary']['reviewDateMissing']}",
        "",
        "## Таблица",
        "",
        "| Статус | Робот | Slug | Текущая публичная формула | Unit | Минимум | Owner | Reviewed on | Причина | Найденные конфликтные цены |",
        "|---|---|---|---|---|---|---|---|---|---|",
    ]
    for d in decisions:
        lines.append(
            "| {status} | {name} | `{slug}` | {display} | {unit} | {minimum} | {owner} | {reviewed} | {reason} | {prices} |".format(
                status=STATUS_LABELS[d["decisionStatus"]],
                name=fmt(d["modelName"] or d["robotName"]),
                slug=d["slug"],
                display=fmt(d["canonicalPriceDisplay"] or d["proposedCurrentDisplay"]),
                unit=fmt(d["unit"]),
                minimum=fmt(d["minimum"]["display"]),
                owner=fmt(d["owner"]),
                reviewed=fmt(d["reviewedOn"]),
                reason=fmt(d["risk"]["reason"]),
                prices=fmt(d["risk"]["uniquePriceMentions"]),
            )
        )
    lines.extend([
        "",
        "## Что должен решить владелец цены",
        "",
        "Для каждой строки `needs_review` нужно подтвердить:",
        "",
        "1. публичную формулировку цены (`canonicalPriceDisplay`);",
        "2. числовую сумму (`amount`) и единицу (`unit`);",
        "3. минимум заказа (`minimum`);",
        "4. дату начала действия (`validFrom`);",
        "5. владельца цены (`owner`) и дату проверки (`reviewedOn`).",
        "",
        "Строки `missing/request_only` должны либо остаться `Цена по запросу` с owner/date, либо получить утверждённую цену от бизнеса.",
    ])
    REVIEW_PATH.write_text("\n".join(lines) + "\n", encoding="utf-8")

    print(json.dumps(payload["summary"], ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
