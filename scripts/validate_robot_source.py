#!/usr/bin/env python3
"""Validate KIBER PORTAL robot/product source-of-truth data.

This validator is intentionally conservative: it reports conflicts and review
statuses clearly, but only exits non-zero in CLI mode when run with --strict.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any


SOURCE_PATH = Path("data/models/robots.source-of-truth.json")
DECISIONS_PATH = Path("data/models/pricing-decision-template.json")


def _read_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as fh:
        return json.load(fh)


def _error(code: str, slug: str, message: str) -> dict[str, str]:
    return {"code": code, "slug": slug, "message": message}


def validate_robot_source(root: str | Path = ".", strict: bool = False) -> dict[str, Any]:
    """Validate robot source-of-truth and pricing decision template.

    Returns a structured report. `strict=True` does not change which issues are
    collected; it is consumed by the CLI to decide the process exit code.
    """
    root = Path(root)
    source = _read_json(root / SOURCE_PATH)
    decisions_doc = _read_json(root / DECISIONS_PATH)

    robots = source.get("robots", [])
    decisions = decisions_doc.get("decisions", [])
    robot_slugs = {robot.get("slug", "") for robot in robots}
    decision_slugs = {decision.get("slug", "") for decision in decisions}
    decisions_by_slug = {decision.get("slug", ""): decision for decision in decisions}

    errors: list[dict[str, str]] = []
    warnings: list[dict[str, str]] = []
    price_issues = 0
    tariff_issues = 0
    decision_issues = 0
    media_issues = 0
    stage2_issues = 0

    for slug in sorted(decision_slugs - robot_slugs):
        errors.append(_error(
            "unknown_pricing_decision_slug",
            slug,
            f"Pricing decision slug `{slug}` is not present in robots.source-of-truth.json.",
        ))

    for slug in sorted(robot_slugs - decision_slugs):
        # Not every robot is in the first decision template. This is a warning,
        # not an error, while the template intentionally covers only risk robots.
        warnings.append(_error(
            "missing_pricing_decision_slug",
            slug,
            f"Robot `{slug}` has no pricing decision template entry yet.",
        ))

    for robot in robots:
        slug = robot.get("slug", "")
        pricing = robot.get("pricing", {})
        normalization = robot.get("normalization", {})
        price_audit_status = normalization.get("priceAuditStatus", "")
        source_status = pricing.get("sourceStatus", "")
        display = pricing.get("display", "")

        if "₽ ₽" in display:
            price_issues += 1
            errors.append(_error("double_ruble_symbol", slug, "Canonical pricing display contains duplicate `₽ ₽`."))

        if source_status != "approved" or price_audit_status != "approved":
            price_issues += 1
            errors.append(_error(
                "price_not_approved",
                slug,
                f"Robot `{slug}` pricing is not approved: pricing.sourceStatus={source_status}, normalization.priceAuditStatus={price_audit_status}.",
            ))

        decision = decisions_by_slug.get(slug)
        if decision:
            decision_status = decision.get("decisionStatus")
            if decision_status is not None:
                if decision_status not in {"approved", "needs_review", "missing"}:
                    decision_issues += 1
                    errors.append(_error("invalid_pricing_decision_status", slug, f"Pricing decision has invalid decisionStatus `{decision_status}`."))
                if decision_status == "approved":
                    for field in ["canonicalPriceDisplay", "owner", "reviewedOn", "validFrom"]:
                        if not decision.get(field):
                            decision_issues += 1
                            errors.append(_error("approved_pricing_decision_missing_field", slug, f"Approved pricing decision is missing `{field}`."))
                    if decision.get("unit") == "request":
                        if decision.get("amount") not in (None, ""):
                            decision_issues += 1
                            errors.append(_error("request_pricing_decision_has_amount", slug, "Approved request-only pricing must keep amount=null."))
                    elif decision.get("amount") in (None, ""):
                        decision_issues += 1
                        errors.append(_error("approved_pricing_decision_missing_amount", slug, "Approved pricing decision is missing numeric `amount`."))
                    if decision.get("approved") is not True:
                        decision_issues += 1
                        errors.append(_error("approved_pricing_decision_flag_mismatch", slug, "decisionStatus=approved requires approved=true."))
                elif decision_status in {"needs_review", "missing"}:
                    if decision.get("approved") is True:
                        decision_issues += 1
                        errors.append(_error("unapproved_pricing_decision_flag_mismatch", slug, f"decisionStatus={decision_status} requires approved=false."))
                    if decision.get("canonicalPriceDisplay"):
                        decision_issues += 1
                        errors.append(_error("unapproved_pricing_decision_has_canonical", slug, "Unapproved pricing decision must not fill canonicalPriceDisplay."))
                if decision_status == "needs_review" and decision.get("owner") != "business_owner_required":
                    decision_issues += 1
                    errors.append(_error("needs_review_pricing_owner_not_placeholder", slug, "needs_review pricing must keep owner=business_owner_required until approved."))
                if decision_status == "missing" and decision.get("unit") != "request":
                    decision_issues += 1
                    errors.append(_error("missing_pricing_unit_not_request", slug, "missing/request-only pricing decision must use unit=request."))

        if decision and decision.get("approved"):
            canonical = decision.get("canonicalPriceDisplay", "")
            if not canonical:
                price_issues += 1
                errors.append(_error("approved_decision_missing_display", slug, "Approved pricing decision has empty canonicalPriceDisplay."))
            elif source_status == "approved" and canonical != display:
                warnings.append(_error(
                    "approved_price_display_needs_source_sync",
                    slug,
                    "Approved pricing decision from the canonical XLSX differs from robots.source-of-truth pricing.display; sync the source dataset before rendering.",
                ))

        tariffs = pricing.get("tariffs", {})
        required_tariffs = ["one_hour", "four_hours", "eight_hours", "two_days", "three_days"]
        for tariff_key in required_tariffs:
            if tariff_key not in tariffs:
                tariff_issues += 1
                errors.append(_error("missing_tariff", slug, f"Robot `{slug}` is missing required tariff `{tariff_key}`."))
                continue
            tariff = tariffs[tariff_key]
            status = tariff.get("status")
            price = tariff.get("price")
            display = tariff.get("display", "")
            public_visible = tariff.get("publicVisible")
            bookable = tariff.get("bookable")
            if status == "not_applicable":
                if price is not None or display or public_visible or bookable:
                    tariff_issues += 1
                    errors.append(_error(
                        "invalid_not_applicable_tariff",
                        slug,
                        f"Tariff `{tariff_key}` is not_applicable but has price/display/publicVisible/bookable values.",
                    ))
            elif status == "request":
                if price is not None or not display:
                    tariff_issues += 1
                    errors.append(_error("invalid_request_tariff", slug, f"Tariff `{tariff_key}` is request but does not use price=null with a display phrase."))
            elif status == "active":
                if not isinstance(price, (int, float)) or price <= 0 or not display:
                    tariff_issues += 1
                    errors.append(_error("invalid_active_tariff", slug, f"Tariff `{tariff_key}` is active but has no positive price/display."))
            else:
                tariff_issues += 1
                errors.append(_error("invalid_tariff_status", slug, f"Tariff `{tariff_key}` has invalid status `{status}`."))

        media_images = robot.get("media", {}).get("images", [])
        if media_images:
            for index, image in enumerate(media_images, start=1):
                role = image.get("role", "")
                preliminary_role = image.get("preliminaryRole", "")
                review_status = image.get("reviewStatus", "")
                actual_description = image.get("actualDescription", "")
                is_decorative = role == "decorative" or preliminary_role == "decorative_or_service" or review_status == "decorative_or_service"
                if not is_decorative and not actual_description:
                    media_issues += 1
                    warnings.append(_error(
                        "media_human_description_needed",
                        slug,
                        f"Robot `{slug}` image #{index} needs human visual description before final SEO alt/caption.",
                    ))
        elif normalization.get("mediaAuditStatus") == "needs_alt_review":
            media_issues += 1
            warnings.append(_error("media_alt_review_needed", slug, f"Robot `{slug}` has images requiring alt/media review."))

        seo = robot.get("seo", {})
        required_seo_fields = ["seoTitle", "metaDescription", "primaryKeyword", "secondaryKeywords", "searchIntent", "schemaTypes", "ogImage"]
        for field in required_seo_fields:
            value = seo.get(field)
            if value in (None, "", []):
                stage2_issues += 1
                warnings.append(_error("seo_field_missing", slug, f"Robot `{slug}` is missing enriched SEO field `{field}`."))

        if len(str(seo.get("seoTitle", ""))) > 70:
            stage2_issues += 1
            warnings.append(_error("seo_title_too_long", slug, f"Robot `{slug}` seoTitle is longer than 70 characters."))
        if len(str(seo.get("metaDescription", ""))) > 180:
            stage2_issues += 1
            warnings.append(_error("meta_description_too_long", slug, f"Robot `{slug}` metaDescription is longer than 180 characters."))

        image_roles = {image.get("role", "") for image in media_images}
        for required_role in ["hero", "card"]:
            if required_role not in image_roles:
                stage2_issues += 1
                warnings.append(_error("media_role_missing", slug, f"Robot `{slug}` has no `{required_role}` media image selected."))

        related = robot.get("related", {})
        if not related.get("robots"):
            stage2_issues += 1
            warnings.append(_error("related_robots_missing", slug, f"Robot `{slug}` has no generated related robots."))
        if not related.get("collections"):
            stage2_issues += 1
            warnings.append(_error("related_collections_missing", slug, f"Robot `{slug}` has no related collections."))

        content_facts = robot.get("contentFacts", {})
        if len(content_facts.get("capabilities", [])) < 3:
            stage2_issues += 1
            warnings.append(_error("content_capabilities_low", slug, f"Robot `{slug}` has fewer than 3 structured capability facts."))
        if len(content_facts.get("scenarios", [])) < 3:
            stage2_issues += 1
            warnings.append(_error("content_scenarios_low", slug, f"Robot `{slug}` has fewer than 3 structured scenario facts."))
        if len(content_facts.get("faq", [])) < 3:
            stage2_issues += 1
            warnings.append(_error("content_faq_low", slug, f"Robot `{slug}` has fewer than 3 FAQ items."))

        proposal = robot.get("proposal", {})
        if proposal.get("status") not in {"draft", "approved", "generated", "hidden"}:
            stage2_issues += 1
            warnings.append(_error("proposal_scaffold_missing", slug, f"Robot `{slug}` has no proposal scaffold status for future PDF-КП."))

    ok = not errors
    return {
        "ok": ok,
        "strict": strict,
        "summary": {
            "robots": len(robots),
            "pricingDecisions": len(decisions),
            "errors": len(errors),
            "warnings": len(warnings),
            "priceIssues": price_issues,
            "tariffIssues": tariff_issues,
            "decisionIssues": decision_issues,
            "mediaIssues": media_issues,
            "stage2Issues": stage2_issues,
        },
        "errors": errors,
        "warnings": warnings,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate robot/product source-of-truth data.")
    parser.add_argument("--root", default=".", help="Project root. Default: current directory.")
    parser.add_argument("--strict", action="store_true", help="Exit non-zero when validation errors are present.")
    parser.add_argument("--json", action="store_true", help="Print JSON report.")
    args = parser.parse_args()

    report = validate_robot_source(args.root, strict=args.strict)
    if args.json:
        print(json.dumps(report, ensure_ascii=False, indent=2))
    else:
        summary = report["summary"]
        print(
            "robot source validation: "
            f"ok={report['ok']} robots={summary['robots']} "
            f"errors={summary['errors']} warnings={summary['warnings']} "
            f"priceIssues={summary['priceIssues']} mediaIssues={summary['mediaIssues']}"
        )
        for item in report["errors"][:20]:
            print(f"ERROR {item['code']} {item['slug']}: {item['message']}")
        for item in report["warnings"][:20]:
            print(f"WARN {item['code']} {item['slug']}: {item['message']}")

    if args.strict and not report["ok"]:
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
