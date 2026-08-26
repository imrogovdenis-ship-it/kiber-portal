#!/usr/bin/env python3
"""Validate production dry-run/checklist docs stay current and non-operative."""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

DRY_RUN_REQUIRED = [
    "dry_run_only_no_infrastructure_changes",
    "/home/alex/projects/kiber-portal",
    "alex-kiber-portal-web",
    "Do not touch without explicit Denis approval",
    "python3 scripts/run_launch_qa.py",
    "status=passed",
    "steps=19",
    "passed=19",
    "failed=0",
    "51 generated HTML files",
    "42 public indexable routes",
    "9 preview/noindex/system routes",
    "No commands in this section should be run against production without explicit approval",
    "Deployment should use existing Coolify/Traefik contour. Do not install another Coolify.",
    "Rollback options must be confirmed before launch",
]
CHECKLIST_REQUIRED = [
    "draft_no_production_changes",
    "python3 scripts/validate_production_readiness_matrix.py --root . --json",
    "python3 scripts/validate_production_dry_run_docs.py --root . --json",
    "python3 scripts/run_launch_qa.py",
    "Keep existing production untouched until explicit launch approval",
]
FORBIDDEN_STALE_PATTERNS = [
    ("old_qa_steps_11", re.compile(r"steps=11|passed=11")),
    ("old_html_count_47", re.compile(r"47 generated HTML files")),
    ("old_public_count_38", re.compile(r"38 public indexable routes")),
]


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", default=".")
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()
    root = Path(args.root).resolve()
    errors: list[dict[str, str]] = []
    warnings: list[dict[str, str]] = []
    dry_run = root / "docs/production-deployment-dry-run.md"
    checklist = root / "docs/production-launch-checklist.md"
    docs = {
        "production_deployment_dry_run": dry_run.read_text(encoding="utf-8") if dry_run.exists() else "",
        "production_launch_checklist": checklist.read_text(encoding="utf-8") if checklist.exists() else "",
    }
    if not docs["production_deployment_dry_run"]:
        errors.append({"code": "missing_doc", "message": str(dry_run)})
    if not docs["production_launch_checklist"]:
        errors.append({"code": "missing_doc", "message": str(checklist)})

    for needle in DRY_RUN_REQUIRED:
        if needle not in docs["production_deployment_dry_run"]:
            errors.append({"code": "dry_run_missing_required_text", "message": needle})
    for needle in CHECKLIST_REQUIRED:
        if needle not in docs["production_launch_checklist"]:
            errors.append({"code": "checklist_missing_required_text", "message": needle})

    combined = "\n".join(docs.values())
    for code, pattern in FORBIDDEN_STALE_PATTERNS:
        for match in pattern.finditer(combined):
            errors.append({"code": code, "message": match.group(0)})

    result = {
        "ok": not errors,
        "summary": {
            "docsChecked": len(docs),
            "errors": len(errors),
            "warnings": len(warnings),
        },
        "errors": errors,
        "warnings": warnings,
        "checked": list(docs.keys()),
    }
    print(json.dumps(result, ensure_ascii=False, indent=2) if args.json else result)
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
