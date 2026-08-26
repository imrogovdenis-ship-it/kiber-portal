#!/usr/bin/env python3
"""Validate KIBER-27 visual source hierarchy docs."""
from __future__ import annotations

import argparse
import json
from pathlib import Path

REQUIRED_DOCS = {
    "visual_source_hierarchy": "docs/visual-source-hierarchy.md",
    "visual_source_adr": "docs/DECISIONS/0001-visual-source-hierarchy.md",
    "design_system_tz": "docs/DESIGN-SYSTEM-TZ.md",
}

REQUIRED_HIERARCHY = [
    "Утверждённый дизайн Александра",
    "Машинно-читаемая дизайн-система в Git",
    "Astro implementation baseline",
    "Live Tilda/current production reference",
    "Export/archive/source captures",
]

REQUIRED_RULES = [
    "Дизайн Александра → tokens/components/screenshots → live Tilda reference → export archive",
    "live Tilda не является главным источником",
    "нельзя менять generated files вручную",
    "human visual approval",
    "375",
    "768",
    "1024",
    "1440",
]

ADR_REQUIRED = [
    "KIBER-27 / KP-040",
    "Статус:",
    "proposed",
    "Правила разрешения конфликтов",
    "Rollback",
]

TZ_REQUIRED = [
    "Техническое задание на упаковку дизайн-системы",
    "Состав и порядок блоков",
    "Hermes работает только через отдельную ветку и pull request",
]


def find_missing(text: str, required: list[str]) -> list[str]:
    low = text.lower()
    return [needle for needle in required if needle.lower() not in low]


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", default=".")
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()
    root = Path(args.root).resolve()
    errors: list[dict[str, str]] = []
    warnings: list[dict[str, str]] = []
    texts: dict[str, str] = {}

    for key, rel in REQUIRED_DOCS.items():
        path = root / rel
        if not path.exists():
            errors.append({"code": "missing_doc", "message": rel})
            continue
        texts[key] = path.read_text(encoding="utf-8")

    if "visual_source_hierarchy" in texts:
        for missing in find_missing(texts["visual_source_hierarchy"], REQUIRED_HIERARCHY + REQUIRED_RULES):
            errors.append({"code": "missing_hierarchy_rule", "message": missing})

        # Verify order of the five hierarchy levels.
        positions = []
        for needle in REQUIRED_HIERARCHY:
            pos = texts["visual_source_hierarchy"].find(needle)
            if pos >= 0:
                positions.append(pos)
        if positions != sorted(positions):
            errors.append({"code": "hierarchy_order_changed", "message": "visual source levels are not in required order"})

    if "visual_source_adr" in texts:
        for missing in find_missing(texts["visual_source_adr"], ADR_REQUIRED):
            errors.append({"code": "missing_adr_clause", "message": missing})

    if "design_system_tz" in texts:
        for missing in find_missing(texts["design_system_tz"], TZ_REQUIRED):
            errors.append({"code": "missing_design_system_tz_clause", "message": missing})

    result = {
        "ok": not errors,
        "summary": {
            "docsChecked": len(texts),
            "hierarchyLevels": len(REQUIRED_HIERARCHY),
            "errors": len(errors),
            "warnings": len(warnings),
        },
        "errors": errors,
        "warnings": warnings,
        "checked": REQUIRED_DOCS,
    }
    print(json.dumps(result, ensure_ascii=False, indent=2) if args.json else result)
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
