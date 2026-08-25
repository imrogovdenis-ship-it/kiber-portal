#!/usr/bin/env python3
"""Validate business input and lead-flow request docs are complete and secret-safe."""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

DOC_REQUIREMENTS = {
    "docs/business-inputs-request.md": [
        "Контакты и реквизиты",
        "Lead capture / messenger routing",
        "Analytics / conversion tracking",
        "SEO content expansion package",
        "Pricing / availability / claims approval",
        "Redirect approval",
        "Production deployment approval",
        "Copy-paste request for Alex/team",
        "нельзя хранить в Git",
    ],
    "docs/lead-flow-integration-plan.md": [
        "planned_deferred_until_ids_and_accesses",
        "Telegram form delivery",
        "amoCRM duplicate",
        "Yandex analytics stack",
        "Do not store",
        "disabled until Telegram/amoCRM destinations are provided",
    ],
}
MATRIX_BLOCKERS = {
    "lead_destination": ["Telegram", "form", "destination"],
    "analytics_ids_events": ["YANDEX_METRIKA_ID", "Яндекс.Метрика"],
    "redirect_approval": ["Redirect approval", "Редиректы"],
    "seo_expansion_materials": ["SEO content expansion package", "long-tail"],
    "coolify_dns_ssl_approval": ["Production deployment approval", "Coolify", "DNS"],
}
SECRET_PATTERNS = [
    ("telegram_bot_token", re.compile(r"\b\d{7,12}:[A-Za-z0-9_-]{30,}\b")),
    ("generic_bearer_token", re.compile(r"\bBearer\s+[A-Za-z0-9._~+/=-]{20,}\b", re.I)),
    ("api_key_assignment", re.compile(r"\b(?:api[_-]?key|secret|token|password)\s*[:=]\s*['\"]?[A-Za-z0-9._~+/=-]{12,}", re.I)),
]


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", default=".")
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()
    root = Path(args.root).resolve()
    errors: list[dict[str, str]] = []
    warnings: list[dict[str, str]] = []
    docs: dict[str, str] = {}

    for rel, needles in DOC_REQUIREMENTS.items():
        path = root / rel
        if not path.exists():
            errors.append({"code": "missing_doc", "message": rel})
            docs[rel] = ""
            continue
        text = path.read_text(encoding="utf-8", errors="replace")
        docs[rel] = text
        for needle in needles:
            if needle not in text:
                errors.append({"code": "doc_missing_required_text", "message": f"{rel}: {needle}"})
        for code, pattern in SECRET_PATTERNS:
            if pattern.search(text):
                errors.append({"code": f"secret_like_value_{code}", "message": rel})

    matrix_path = root / "data/seo/production-readiness-matrix.json"
    matrix = json.loads(matrix_path.read_text(encoding="utf-8")) if matrix_path.exists() else {}
    blocker_ids = {str(item.get("id", "")) for item in matrix.get("businessBlockers", [])}
    combined = "\n".join(docs.values())
    for blocker_id, needles in MATRIX_BLOCKERS.items():
        if blocker_id not in blocker_ids:
            errors.append({"code": "matrix_missing_blocker", "message": blocker_id})
        for needle in needles:
            if needle not in combined:
                errors.append({"code": "request_pack_missing_blocker_context", "message": f"{blocker_id}: {needle}"})

    if "[REDACTED]" in combined:
        warnings.append({"code": "redacted_placeholder_present", "message": "Some values are intentionally redacted; confirm before launch."})

    result = {
        "ok": not errors,
        "summary": {
            "docsChecked": len(DOC_REQUIREMENTS),
            "matrixBlockersChecked": len(MATRIX_BLOCKERS),
            "errors": len(errors),
            "warnings": len(warnings),
        },
        "errors": errors,
        "warnings": warnings,
        "checked": list(DOC_REQUIREMENTS.keys()),
    }
    print(json.dumps(result, ensure_ascii=False, indent=2) if args.json else result)
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
