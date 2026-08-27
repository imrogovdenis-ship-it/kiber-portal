#!/usr/bin/env python3
"""Import the business-approved KIBER PORTAL robot tariff XLSX.

The workbook is the canonical approved tariff source. This script intentionally
uses only the Python standard library so CI does not require openpyxl.
"""

from __future__ import annotations

import json
import re
import zipfile
from datetime import date
from pathlib import Path
from typing import Any
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
XLSX_PATH = ROOT / "data/models/source/robot-tariffs-approved.xlsx"
OUTPUT_JSON = ROOT / "data/models/robot-tariffs-approved.json"
REVIEW_MD = ROOT / "docs/robot-tariffs-approved-review-table.md"
ROBOTS_PATH = ROOT / "data/models/robots.source-of-truth.json"

NS = {"main": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}

NAME_TO_SLUG = {
    "София (Sophia)": "arenda-robota-sofiya",
    "Арди (Ardi)": "arenda-robota-ardi",
    "Unitree G1": "arenda-unitree-g1",
    "Unitree H2": "arenda-unitree-h2",
    "Unitree R1": "arenda-unitree-r1",
    "Noetix Bumi": "arenda-noetix-bumi",
    "Agibot X2": "arenda-agibot-x2",
    "Promobot V4": "arenda-promobot-v4",
    "Unitree Go2": "arenda-unitree-go2",
    "Xiaomi Cyberdog 2": "arenda-xiaomi-cyberdog-2",
    "Inchbot L1-W": "arenda-inchbot-l1-w-edu",
    "BellaBot": "arenda-bellabot",
    "KettyBot": "arenda-kettybot",
    "Робот-кофейня (Робобариста)": "arenda-robo-kofeyni",
    "Мини-кофейня (робот-бариста)": "arenda-mini-robo-kofeyni",
    "Робобар": "arenda-robot-barmen",
    "UV-BOX": "arenda-uv-box",
    "Робот-шашки (Робошашки)": "arenda-roboshashki",
    "Робот-шахматист (SenseRobot)": "arenda-senserobot",
    "Робот Tron": "arenda-robota-tron",
    "Робот-художник": "arenda-robota-hudozhnika-a4",
    "Sketchbot": "arenda-sketchbot",
    "Клипмейкер": "arenda-klipmeiker",
    "GlamBot": "arenda-glambot",
}

CATEGORY_ROWS = {
    "Роботы-гуманоиды и промо-роботы",
    "Роботы-собаки и роботизированные платформы",
    "Сервисные роботы (кофе, бар, доставка)",
    "Интерактивные и арт-роботы",
}

TARIFF_COLUMNS = [
    ("one_hour", "1 час", "1 час"),
    ("two_hours_booking", "2 часа", "2 часа"),
    ("four_hours", "До 4 часов", "До 4 часов"),
    ("eight_hours", "До 8 часов / 1 день", "До 8 часов\n(1 день)"),
    ("two_days", "2 дня", "2 дня"),
    ("three_days", "3 дня", "3 дня"),
    ("marketing_hourly_rate", "от {цена} ₽ / час", "от {цена} ₽ / час"),
]

PUBLIC_TARIFFS = {"one_hour", "four_hours", "eight_hours", "two_days", "three_days", "marketing_hourly_rate"}


def read_json(path: Path) -> Any | None:
    if not path.exists():
        return None
    with path.open("r", encoding="utf-8") as fh:
        return json.load(fh)


def cell_ref_to_col(ref: str) -> int:
    letters = "".join(ch for ch in ref if ch.isalpha())
    col = 0
    for ch in letters:
        col = col * 26 + (ord(ch.upper()) - ord("A") + 1)
    return col


def shared_strings(zf: zipfile.ZipFile) -> list[str]:
    try:
        xml = zf.read("xl/sharedStrings.xml")
    except KeyError:
        return []
    root = ET.fromstring(xml)
    strings = []
    for si in root.findall("main:si", NS):
        parts = [node.text or "" for node in si.findall(".//main:t", NS)]
        strings.append("".join(parts))
    return strings


def first_sheet_rows(path: Path) -> list[list[Any]]:
    with zipfile.ZipFile(path) as zf:
        strings = shared_strings(zf)
        xml = zf.read("xl/worksheets/sheet1.xml")
    root = ET.fromstring(xml)
    rows: list[list[Any]] = []
    for row in root.findall(".//main:sheetData/main:row", NS):
        values: dict[int, Any] = {}
        max_col = 0
        for cell in row.findall("main:c", NS):
            ref = cell.attrib.get("r", "A1")
            col = cell_ref_to_col(ref)
            max_col = max(max_col, col)
            value_node = cell.find("main:v", NS)
            inline_node = cell.find("main:is/main:t", NS)
            if value_node is None and inline_node is None:
                value = ""
            elif cell.attrib.get("t") == "s" and value_node is not None:
                value = strings[int(value_node.text or 0)]
            elif cell.attrib.get("t") == "inlineStr" and inline_node is not None:
                value = inline_node.text or ""
            elif value_node is not None:
                raw = value_node.text or ""
                try:
                    num = float(raw)
                    value = int(num) if num.is_integer() else num
                except ValueError:
                    value = raw
            else:
                value = ""
            values[col] = value
        rows.append([values.get(i, "") for i in range(1, max_col + 1)])
    return rows


def parse_amount(value: Any) -> int | None:
    if value is None:
        return None
    if isinstance(value, (int, float)):
        return int(value)
    text = str(value).strip().lower()
    if not text or text in {"нет", "по запросу"}:
        return None
    digits = re.sub(r"[^0-9]", "", text)
    return int(digits) if digits else None


def money(amount: int | None, suffix: str = "") -> str:
    if amount is None:
        return ""
    formatted = f"{amount:,}".replace(",", " ") + " ₽"
    return f"{formatted}{suffix}"


def tariff_status(value: Any) -> str:
    text = str(value).strip().lower() if value is not None else ""
    if text == "по запросу":
        return "request"
    if text == "нет" or text == "":
        return "not_applicable"
    return "active"


def tariff_object(key: str, value: Any) -> dict[str, Any]:
    status = tariff_status(value)
    amount = parse_amount(value)
    public = key in PUBLIC_TARIFFS and status != "not_applicable"
    bookable = key in {"one_hour", "four_hours", "eight_hours", "two_days", "three_days"} and status == "active"
    if key == "marketing_hourly_rate":
        display = "цена по запросу" if status == "request" else money(amount, " / час") if status == "active" else ""
        bookable = False
    else:
        display = "цена по запросу" if status == "request" else money(amount) if status == "active" else ""
    return {
        "status": status,
        "amount": amount,
        "currency": "RUB",
        "display": display,
        "sourceValue": value,
        "publicVisible": public,
        "bookable": bookable,
        "notes": {
            "active": "Утверждено в XLSX Александром и Денисом; можно использовать как базовый источник до следующей замены параметров.",
            "request": "Утверждённая политика: цена по запросу.",
            "not_applicable": "Утверждённая политика: тариф не используется для этой модели.",
        }[status],
    }


def slugify_fallback(name: str) -> str:
    translit = {
        "а":"a","б":"b","в":"v","г":"g","д":"d","е":"e","ё":"e","ж":"zh","з":"z","и":"i","й":"y","к":"k","л":"l","м":"m","н":"n","о":"o","п":"p","р":"r","с":"s","т":"t","у":"u","ф":"f","х":"h","ц":"ts","ч":"ch","ш":"sh","щ":"sch","ы":"y","э":"e","ю":"yu","я":"ya","ь":"","ъ":"",
    }
    text = "".join(translit.get(ch, ch) for ch in name.lower())
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    return f"arenda-{text}" if text else "unmapped-robot"


def parse_workbook() -> list[dict[str, Any]]:
    rows = first_sheet_rows(XLSX_PATH)
    current_category = ""
    records = []
    for row in rows:
        if not row:
            continue
        name = str(row[0]).strip() if row[0] is not None else ""
        if not name or name.startswith("КИБЕР ПОРТАЛ") or name == "Модель робота" or name.startswith("(1 день)"):
            continue
        if name in CATEGORY_ROWS:
            current_category = name
            continue
        values = list(row[1:8]) + [""] * 7
        slug = NAME_TO_SLUG.get(name, slugify_fallback(name))
        mapping_status = "mapped" if name in NAME_TO_SLUG else "new_unmapped"
        tariff_values = {key: values[idx] for idx, (key, _label, _source) in enumerate(TARIFF_COLUMNS)}
        tariffs = {key: tariff_object(key, value) for key, value in tariff_values.items()}
        marketing = tariffs["marketing_hourly_rate"]
        if marketing["status"] == "request":
            canonical_display = "цена по запросу"
            canonical_unit = "request"
            canonical_amount = None
        elif marketing["status"] == "active":
            canonical_display = f"от {marketing['display']}"
            canonical_unit = "hour"
            canonical_amount = marketing["amount"]
        else:
            # Fall back to the first active public package for models without hourly teaser.
            active = next((tariffs[k] for k in ["one_hour", "four_hours", "eight_hours", "two_days", "three_days"] if tariffs[k]["status"] == "active"), None)
            canonical_display = f"от {active['display']}" if active else "цена по запросу"
            canonical_unit = "package" if active else "request"
            canonical_amount = active["amount"] if active else None
        records.append({
            "slug": slug,
            "sourceName": name,
            "category": current_category,
            "catalogStatus": "active",
            "mappingStatus": mapping_status,
            "canonicalPriceDisplay": canonical_display,
            "amount": canonical_amount,
            "currency": "RUB",
            "unit": canonical_unit,
            "tariffs": tariffs,
            "minimum": minimum_from_tariffs(tariffs),
        })
    return records


def minimum_from_tariffs(tariffs: dict[str, dict[str, Any]]) -> dict[str, Any]:
    if all(t["status"] == "request" for t in tariffs.values()):
        return {"status": "request", "durationHours": None, "display": "по запросу"}
    for key, hours in [("one_hour", 1), ("two_hours_booking", 2), ("four_hours", 4), ("eight_hours", 8)]:
        if tariffs[key]["status"] == "active" and tariffs[key].get("bookable"):
            return {"status": "approved", "durationHours": hours, "display": f"минимум {hours} ч" if hours < 8 else "минимум 1 день"}
    return {"status": "approved", "durationHours": None, "display": "минимум определяется по пакету"}


def main() -> int:
    approved_on = date.today().isoformat()
    records = parse_workbook()
    source_slugs = {r["slug"] for r in records}
    robots_doc = read_json(ROBOTS_PATH) or {"robots": []}
    robot_slugs = {r.get("slug") for r in robots_doc.get("robots", [])}
    catalog_changes = {
        "newInXlsx": [r for r in records if r["mappingStatus"] == "new_unmapped"],
        "missingFromXlsx": sorted(slug for slug in robot_slugs if slug and slug not in source_slugs),
    }
    payload = {
        "version": "1.0.0",
        "status": "approved_by_alexander_and_denis",
        "approvedBy": ["Александр Маркин", "Denis Rogov"],
        "approvedOn": approved_on,
        "source": {
            "file": "data/models/source/robot-tariffs-approved.xlsx",
            "sheet": "Тарифы аренды роботов",
            "notes": "User confirmed this workbook contains fully prepared and previously approved prices by Alexander and Denis; future changes replace parameters in this source.",
        },
        "catalogPolicy": {
            "activeRows": "Rows present in the XLSX are active catalog/pricing candidates.",
            "newModels": "Rows not mapped to an existing slug are preserved as new_unmapped and require slug/content creation before publishing.",
            "excludedModels": "Existing robots absent from the XLSX appear in catalogChanges.missingFromXlsx and should be reviewed as exclusion candidates, not silently deleted.",
        },
        "tariffDefinitions": [{"key": key, "label": label, "sourceColumn": source} for key, label, source in TARIFF_COLUMNS],
        "summary": {
            "records": len(records),
            "mapped": sum(1 for r in records if r["mappingStatus"] == "mapped"),
            "newUnmapped": sum(1 for r in records if r["mappingStatus"] == "new_unmapped"),
            "requestOnly": sum(1 for r in records if r["unit"] == "request"),
            "missingFromXlsx": len(catalog_changes["missingFromXlsx"]),
        },
        "robots": records,
        "catalogChanges": catalog_changes,
    }
    OUTPUT_JSON.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_review(payload)
    print(json.dumps(payload["summary"], ensure_ascii=False, indent=2))
    return 0


def write_review(payload: dict[str, Any]) -> None:
    lines = [
        "# Утверждённые тарифы аренды роботов",
        "",
        f"Источник: `{payload['source']['file']}`",
        f"Статус: {payload['status']}",
        f"Утверждено: {', '.join(payload['approvedBy'])}",
        "",
        "## Сводка",
        "",
        f"- Строк тарифов: {payload['summary']['records']}",
        f"- Сопоставлено со slug: {payload['summary']['mapped']}",
        f"- Новые/не сопоставленные модели: {payload['summary']['newUnmapped']}",
        f"- Цена по запросу: {payload['summary']['requestOnly']}",
        f"- Существующие slug отсутствуют в XLSX: {payload['summary']['missingFromXlsx']}",
        "",
        "## Таблица",
        "",
        "| Категория | Модель | Slug | Статус каталога | Публичная цена | 1 час | 2 часа | 4 часа | 8 часов / 1 день | 2 дня | 3 дня | Минимум |",
        "|---|---|---|---|---|---|---|---|---|---|---|---|",
    ]
    for r in payload["robots"]:
        t = r["tariffs"]
        lines.append(
            "| {category} | {name} | `{slug}` | {mapping} | {canonical} | {one} | {twoh} | {four} | {eight} | {twod} | {threed} | {minimum} |".format(
                category=r["category"],
                name=r["sourceName"],
                slug=r["slug"],
                mapping=r["mappingStatus"],
                canonical=r["canonicalPriceDisplay"],
                one=display_for_review(t["one_hour"]),
                twoh=display_for_review(t["two_hours_booking"]),
                four=display_for_review(t["four_hours"]),
                eight=display_for_review(t["eight_hours"]),
                twod=display_for_review(t["two_days"]),
                threed=display_for_review(t["three_days"]),
                minimum=r["minimum"]["display"],
            )
        )
    lines.extend([
        "",
        "## Правило расширения каталога",
        "",
        "- Новая модель добавляется новой строкой в XLSX; если slug ещё неизвестен, importer сохранит её как `new_unmapped`.",
        "- Исключение модели делается удалением/деактивацией строки в XLSX; существующий slug попадёт в `catalogChanges.missingFromXlsx` и требует review, а не тихого удаления.",
        "- Значения `нет` хранятся как `not_applicable`, `по запросу` — как `request`; `0` не используется для бизнес-смыслов.",
    ])
    REVIEW_MD.write_text("\n".join(lines) + "\n", encoding="utf-8")


def display_for_review(tariff: dict[str, Any]) -> str:
    if tariff["status"] == "not_applicable":
        return "не используем"
    return tariff["display"]


if __name__ == "__main__":
    raise SystemExit(main())
