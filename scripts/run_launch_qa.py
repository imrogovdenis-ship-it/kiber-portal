#!/usr/bin/env python3
"""Run the complete KIBER PORTAL launch QA gate and write one summary artifact."""
from __future__ import annotations

import json
import re
import subprocess
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ARTIFACT = ROOT / "data/seo/launch-qa-summary.json"
REPORT = ROOT / "docs/launch-qa-summary.md"

STEPS = [
    {
        "id": "design_tokens",
        "command": ["python3", "scripts/validate_design_tokens.py", "--root", ".", "--json"],
        "json": True,
    },
    {
        "id": "public_pages",
        "command": ["python3", "scripts/validate_public_pages.py", "--root", ".", "--json"],
        "json": True,
    },
    {
        "id": "astro_build",
        "command": ["npm", "--prefix", "app", "run", "build"],
        "json": False,
    },
    {
        "id": "robot_seo_links",
        "command": ["python3", "scripts/validate_robot_seo_links.py", "--root", ".", "--json"],
        "json": True,
    },
    {
        "id": "collection_pages",
        "command": ["python3", "scripts/validate_collection_pages.py", "--root", ".", "--json"],
        "json": True,
    },
    {
        "id": "content_index_pages",
        "command": ["python3", "scripts/validate_content_index_pages.py", "--root", ".", "--json"],
        "json": True,
    },
    {
        "id": "content_detail_pages",
        "command": ["python3", "scripts/validate_content_detail_pages.py", "--root", ".", "--json"],
        "json": True,
    },
    {
        "id": "whole_site_static",
        "command": ["python3", "scripts/validate_whole_site_static.py", "--root", ".", "--json"],
        "json": True,
    },
    {
        "id": "rendered_image_alt",
        "command": ["python3", "scripts/audit_rendered_image_alt.py", "--root", ".", "--json"],
        "json": True,
    },
    {
        "id": "rendered_headings",
        "command": ["python3", "scripts/audit_rendered_headings.py", "--root", ".", "--json"],
        "json": True,
    },
    {
        "id": "rendered_schema",
        "command": ["python3", "scripts/audit_rendered_schema.py", "--root", ".", "--json"],
        "json": True,
    },
    {
        "id": "rendered_social_metadata",
        "command": ["python3", "scripts/audit_rendered_social_metadata.py", "--root", ".", "--json"],
        "json": True,
    },
    {
        "id": "rendered_cta_flow",
        "command": ["python3", "scripts/audit_rendered_cta_flow.py", "--root", ".", "--json"],
        "json": True,
    },
    {
        "id": "route_inventory",
        "command": ["python3", "scripts/generate_route_inventory.py", "--root", "."],
        "json": True,
    },
    {
        "id": "production_readiness_matrix",
        "command": ["python3", "scripts/validate_production_readiness_matrix.py", "--root", ".", "--json"],
        "json": True,
    },
    {
        "id": "production_dry_run_docs",
        "command": ["python3", "scripts/validate_production_dry_run_docs.py", "--root", ".", "--json"],
        "json": True,
    },
    {
        "id": "business_input_pack",
        "command": ["python3", "scripts/validate_business_input_pack.py", "--root", ".", "--json"],
        "json": True,
    },
]


def run_step(step: dict) -> dict:
    proc = subprocess.run(
        step["command"],
        cwd=ROOT,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        timeout=300,
    )
    output = proc.stdout
    parsed = None
    summary = None
    if step.get("json"):
        try:
            parsed = json.loads(output)
            summary = parsed.get("summary", parsed)
            if step["id"] == "whole_site_static" and proc.returncode == 0:
                wrapped = {
                    "date": datetime.now(timezone.utc).isoformat(),
                    "status": "passed" if parsed.get("ok") else "failed",
                    "scope": "whole-site static output: all generated Astro HTML files, with production blockers focused on public indexable routes",
                    "checks": ["title", "meta description", "canonical", "robots meta", "sitemap inclusion", "JSON-LD presence", "local image asset existence", "internal route existence", "fragment CTA targets"],
                    "summary": parsed.get("summary", {}),
                    "errors": parsed.get("errors", []),
                    "warnings": parsed.get("warnings", []),
                    "checked": parsed.get("checked", []),
                }
                (ROOT / "data/seo/whole-site-static-check.json").write_text(json.dumps(wrapped, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        except json.JSONDecodeError:
            parsed = None
    if step["id"] == "astro_build" and proc.returncode == 0:
        pages_match = re.search(r"(\d+) page\(s\) built", output)
        summary = {"built": True, "pages": int(pages_match.group(1)) if pages_match else None}
    return {
        "id": step["id"],
        "command": " ".join(step["command"]),
        "exitCode": proc.returncode,
        "ok": proc.returncode == 0,
        "summary": summary,
        "outputTail": output[-4000:],
    }


def write_report(result: dict) -> None:
    lines = [
        "# KIBER PORTAL — launch QA summary",
        "",
        f"Дата: {result['date']}",
        f"Статус: `{result['status']}`",
        "",
        "## Summary",
        "",
        f"- Steps: {result['summary']['steps']}",
        f"- Passed: {result['summary']['passed']}",
        f"- Failed: {result['summary']['failed']}",
        "",
        "## Gates",
        "",
        "| Gate | Status | Summary |",
        "|---|---:|---|",
    ]
    for step in result["steps"]:
        status = "pass" if step["ok"] else "FAIL"
        summary = json.dumps(step.get("summary"), ensure_ascii=False) if step.get("summary") is not None else "—"
        lines.append(f"| `{step['id']}` | {status} | `{summary}` |")
    lines += [
        "",
        "## Artifact",
        "",
        "```text",
        "data/seo/launch-qa-summary.json",
        "```",
        "",
        "## Notes",
        "",
        "This QA bundle validates the local static Astro output only. It does not deploy, change DNS, activate redirects, connect analytics, or touch production infrastructure.",
    ]
    REPORT.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> int:
    results = []
    for step in STEPS:
        results.append(run_step(step))
        if not results[-1]["ok"]:
            break
    failed = [step for step in results if not step["ok"]]
    result = {
        "date": datetime.now(timezone.utc).isoformat(),
        "status": "passed" if not failed and len(results) == len(STEPS) else "failed",
        "scope": "Complete pre-production local static QA bundle for KIBER PORTAL Astro output.",
        "summary": {
            "steps": len(results),
            "passed": len([step for step in results if step["ok"]]),
            "failed": len(failed),
        },
        "steps": results,
    }
    ARTIFACT.parent.mkdir(parents=True, exist_ok=True)
    ARTIFACT.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_report(result)
    print(json.dumps({"status": result["status"], **result["summary"]}, ensure_ascii=False))
    return 0 if result["status"] == "passed" else 1


if __name__ == "__main__":
    raise SystemExit(main())
