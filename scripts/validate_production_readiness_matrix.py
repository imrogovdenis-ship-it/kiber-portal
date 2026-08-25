#!/usr/bin/env python3
"""Validate the production-readiness decision matrix stays conservative and evidence-backed."""
from __future__ import annotations

import argparse
import json
from pathlib import Path

ALLOWED_TECH_STATUS = {
    "passed",
    "ready_noindex",
    "planned_deferred_until_ids_and_accesses",
}
ALLOWED_BLOCKER_STATUS = {
    "partially_resolved_from_legal_docs",
    "partially_defined_destinations_needed",
    "planned_ids_needed",
    "needs_input",
    "needs_approval",
}
REQUIRED_BLOCKER_IDS = {
    "contacts_requisites",
    "lead_destination",
    "analytics_ids_events",
    "redirect_approval",
    "seo_expansion_materials",
    "coolify_dns_ssl_approval",
}
FORBIDDEN_ACTION_PHRASES = [
    "Change DNS",
    "Deploy to Coolify production",
    "Activate redirects",
    "Connect analytics or pixels",
    "Wire real lead destinations",
]


def exists(root: Path, rel: str) -> bool:
    return bool(rel) and (root / rel).exists()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", default=".")
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()
    root = Path(args.root).resolve()
    matrix_path = root / "data/seo/production-readiness-matrix.json"
    doc_path = root / "docs/production-readiness-matrix.md"
    errors: list[dict[str, str]] = []
    warnings: list[dict[str, str]] = []

    if not matrix_path.exists():
        errors.append({"code": "missing_matrix", "message": str(matrix_path)})
        matrix = {}
    else:
        matrix = json.loads(matrix_path.read_text(encoding="utf-8"))

    doc = doc_path.read_text(encoding="utf-8") if doc_path.exists() else ""
    if not doc:
        errors.append({"code": "missing_matrix_doc", "message": str(doc_path)})

    if matrix.get("productionActionAllowed") is not False:
        errors.append({"code": "production_action_not_blocked", "message": str(matrix.get("productionActionAllowed"))})
    if "productionActionAllowed=false" not in doc:
        errors.append({"code": "doc_missing_conservative_decision", "message": "productionActionAllowed=false"})

    gates = matrix.get("technicalGates", [])
    gate_ids = set()
    for gate in gates:
        gate_id = str(gate.get("id", ""))
        gate_ids.add(gate_id)
        status = str(gate.get("status", ""))
        evidence = str(gate.get("evidence", ""))
        if status not in ALLOWED_TECH_STATUS:
            errors.append({"code": "unexpected_technical_gate_status", "message": f"{gate_id}: {status}"})
        if not exists(root, evidence):
            errors.append({"code": "missing_technical_evidence", "message": f"{gate_id}: {evidence}"})
    required_gates = {
        "launch_qa_bundle",
        "whole_site_static_validation",
        "route_inventory",
        "rendered_image_alt_audit",
        "rendered_heading_audit",
        "rendered_schema_audit",
        "rendered_social_metadata_audit",
        "rendered_cta_flow_audit",
        "static_404",
        "lead_flow_plan",
    }
    for gate_id in sorted(required_gates - gate_ids):
        errors.append({"code": "missing_technical_gate", "message": gate_id})

    blockers = matrix.get("businessBlockers", [])
    blocker_ids = {str(item.get("id", "")) for item in blockers}
    for blocker in blockers:
        blocker_id = str(blocker.get("id", ""))
        status = str(blocker.get("status", ""))
        source = str(blocker.get("source", ""))
        if status not in ALLOWED_BLOCKER_STATUS:
            errors.append({"code": "unexpected_business_blocker_status", "message": f"{blocker_id}: {status}"})
        for rel in [part.strip() for part in source.split(";") if part.strip()]:
            if not exists(root, rel):
                errors.append({"code": "missing_business_blocker_source", "message": f"{blocker_id}: {rel}"})
    for blocker_id in sorted(REQUIRED_BLOCKER_IDS - blocker_ids):
        errors.append({"code": "missing_business_blocker", "message": blocker_id})

    blocking = [b for b in blockers if b.get("blocksProduction") is True]
    if not blocking:
        errors.append({"code": "no_blocking_business_inputs", "message": "Expected at least one explicit production blocker until launch approval."})
    if matrix.get("status") == "code_ready_business_inputs_required" and not blocking:
        errors.append({"code": "status_without_blockers", "message": matrix.get("status", "")})

    forbidden = matrix.get("forbiddenWithoutExplicitApproval", [])
    for phrase in FORBIDDEN_ACTION_PHRASES:
        if phrase not in forbidden:
            errors.append({"code": "missing_forbidden_action", "message": phrase})
    allowed = matrix.get("allowedNextActionsWithoutUserInput", [])
    if not allowed:
        warnings.append({"code": "empty_allowed_next_actions", "message": "No safe autonomous next actions listed."})

    result = {
        "ok": not errors,
        "summary": {
            "technicalGates": len(gates),
            "businessBlockers": len(blockers),
            "blockingBusinessInputs": len(blocking),
            "errors": len(errors),
            "warnings": len(warnings),
        },
        "errors": errors,
        "warnings": warnings,
        "checked": {
            "matrix": str(matrix_path.relative_to(root)),
            "doc": str(doc_path.relative_to(root)) if doc_path.exists() else str(doc_path),
            "productionActionAllowed": matrix.get("productionActionAllowed"),
            "status": matrix.get("status"),
        },
    }
    print(json.dumps(result, ensure_ascii=False, indent=2) if args.json else result)
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
