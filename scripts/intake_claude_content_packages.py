#!/usr/bin/env python3
"""KIBER Claude content inbox intake validator.

Default mode is safe read-only/dry-run: scan data/content-inbox/claude/packages/*.json,
validate package shape against the KIBER Claude contract, check safety boundaries,
and write an optional report. It never publishes, merges, deploys, changes DNS,
secrets, analytics, or live lead routing.
"""
from __future__ import annotations
import argparse, datetime, json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INBOX = ROOT / "data/content-inbox/claude"
CONTRACT_PATH = ROOT / "data/content-contracts/kiber-claude-page-block-contracts.json"
POLICY_PATH = INBOX / "safety-policy.json"
PACKAGE_GLOB = "*.content-package.json"
FORBIDDEN_TEXT = [
    "productionDeployAllowed", "dnsChangeAllowed", "secretsChangeAllowed",
    "liveLeadRoutingAllowed", "analyticsProviderCookiesAllowed", "ANTHROPIC_API_KEY",
    "LINEAR_API_KEY", "GITHUB_TOKEN", "OP_SERVICE_ACCOUNT_TOKEN", "BEGIN RSA PRIVATE KEY",
]
SLUG_RE = re.compile(r"^[a-z0-9][a-z0-9-]{1,120}$")
REQUIRED_TOP = ["contentPackageVersion","pageType","slug","sourceDocuments","seo","aiVisibility","blocks","media","internalLinks","schema","review"]

class IntakeError(Exception):
    pass

def load_json(path: Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        raise IntakeError(f"invalid json: {exc}")

def contract_page_types(contract: dict) -> set[str]:
    pts = contract.get("pageTypes", {})
    if isinstance(pts, dict):
        return set(pts.keys())
    return set()

def required_blocks_for(contract: dict, page_type: str) -> set[str]:
    page = contract.get("pageTypes", {}).get(page_type, {})
    blocks = page.get("blocks", {})
    if isinstance(blocks, dict):
        return {bid for bid, b in blocks.items() if isinstance(b, dict) and b.get("required") is True}
    if isinstance(blocks, list):
        return {b.get("id") for b in blocks if isinstance(b, dict) and b.get("required") is True and b.get("id")}
    return set()

def validate_package(path: Path, package: dict, contract: dict) -> list[str]:
    errors: list[str] = []
    raw = path.read_text(encoding="utf-8", errors="ignore")
    for marker in FORBIDDEN_TEXT:
        if marker in raw:
            errors.append(f"forbidden marker present: {marker}")
    for key in REQUIRED_TOP:
        if key not in package:
            errors.append(f"missing top-level field: {key}")
    page_type = package.get("pageType")
    if page_type not in contract_page_types(contract):
        errors.append(f"unsupported pageType: {page_type}")
    slug = package.get("slug")
    if not isinstance(slug, str) or not SLUG_RE.match(slug):
        errors.append(f"invalid slug: {slug!r}")
    if package.get("review", {}).get("ownerReviewRequired") is not True:
        errors.append("review.ownerReviewRequired must be true")
    seo = package.get("seo", {})
    for key in ["metaTitle","metaDescription","h1","primaryKeyword","secondaryKeywords","canonicalPath"]:
        if key not in seo:
            errors.append(f"missing seo.{key}")
    ai = package.get("aiVisibility", {})
    if not (ai.get("aiSummary") or ai.get("summary")):
        errors.append("missing aiVisibility.aiSummary")
    blocks = package.get("blocks", {})
    if not isinstance(blocks, dict):
        errors.append("blocks must be object")
    else:
        for block_id in required_blocks_for(contract, page_type or ""):
            if block_id and block_id not in blocks:
                errors.append(f"missing required block: {block_id}")
    media = package.get("media", [])
    if not isinstance(media, list):
        errors.append("media must be array")
    else:
        for idx, item in enumerate(media):
            if not isinstance(item, dict):
                errors.append(f"media[{idx}] must be object"); continue
            for key in ["alt","actualDescription","seoAlt","rightsStatus","sourceStatus"]:
                if key not in item:
                    errors.append(f"media[{idx}] missing {key}")
    links = package.get("internalLinks", [])
    if not isinstance(links, list):
        errors.append("internalLinks must be array")
    else:
        if len(links) > 24:
            errors.append("too many internalLinks; max 24 per package")
        for idx, link in enumerate(links):
            if isinstance(link, str):
                target = link
            elif isinstance(link, dict):
                target = link.get("target") or link.get("href")
            else:
                errors.append(f"internalLinks[{idx}] invalid type"); continue
            if not isinstance(target, str) or not target.startswith("/"):
                errors.append(f"internalLinks[{idx}] target must be site-relative path")
            if isinstance(target, str) and any(x in target for x in ["http://","https://","javascript:","mailto:","tel:"]):
                errors.append(f"internalLinks[{idx}] target must not be external/script/contact link")
    return errors

def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true", default=True, help="Read-only validation; default true")
    ap.add_argument("--write-report", action="store_true", help="Write report under data/content-inbox/claude/reports")
    ap.add_argument("--package", action="append", dest="packages", help="Specific package path; may repeat")
    args = ap.parse_args()
    if not CONTRACT_PATH.exists():
        print(f"Missing contract: {CONTRACT_PATH.relative_to(ROOT)}", file=sys.stderr); return 2
    contract = load_json(CONTRACT_PATH)
    policy = load_json(POLICY_PATH) if POLICY_PATH.exists() else {}
    if args.packages:
        paths = [Path(p) if Path(p).is_absolute() else ROOT / p for p in args.packages]
    else:
        paths = sorted((INBOX / "packages").glob(PACKAGE_GLOB))
    results = []
    for path in paths:
        item = {"path": str(path.relative_to(ROOT) if path.is_absolute() and ROOT in path.parents else path), "valid": False, "errors": []}
        try:
            package = load_json(path)
            errs = validate_package(path, package, contract)
            item["valid"] = not errs
            item["errors"] = errs
            item["pageType"] = package.get("pageType")
            item["slug"] = package.get("slug")
        except Exception as exc:
            item["errors"] = [str(exc)]
        results.append(item)
    report = {
        "schemaVersion": 1,
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "mode": "dry-run",
        "policyStatus": policy.get("status"),
        "packagesChecked": len(results),
        "valid": sum(1 for r in results if r["valid"]),
        "invalid": sum(1 for r in results if not r["valid"]),
        "results": results,
        "publicationAllowed": False,
        "requiresOwnerReview": True,
    }
    print(json.dumps(report, ensure_ascii=False, indent=2))
    if args.write_report:
        reports = INBOX / "reports"; reports.mkdir(parents=True, exist_ok=True)
        stamp = datetime.datetime.now(datetime.timezone.utc).strftime("%Y%m%dT%H%M%SZ")
        (reports / f"intake-report-{stamp}.json").write_text(json.dumps(report, ensure_ascii=False, indent=2)+"\n", encoding="utf-8")
    return 1 if report["invalid"] else 0

if __name__ == "__main__":
    raise SystemExit(main())
