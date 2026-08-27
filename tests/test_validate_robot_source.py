import json
import tempfile
import unittest
from pathlib import Path

from scripts.validate_robot_source import validate_robot_source


class ValidateRobotSourceTest(unittest.TestCase):
    def write_json(self, root: Path, relative: str, data: object) -> None:
        path = root / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

    def base_robot(self, slug="arenda-unitree-g1", approved=False, tariffs=None):
        price_status = "approved" if approved else "conflict_detected"
        return {
            "slug": slug,
            "pricing": {
                "display": "25 000 ₽/час, минимальный заказ — 2 часа" if approved else "от 25 000 ₽ / час",
                "sourceStatus": "approved" if approved else "conflict_detected",
                "tariffs": tariffs or {},
            },
            "normalization": {
                "priceAuditStatus": price_status,
                "mediaAuditStatus": "needs_alt_review",
            },
        }

    def valid_tariffs(self):
        active = {
            "status": "active",
            "price": 12500,
            "currency": "RUB",
            "display": "от 12 500 ₽ / час",
            "sourceValue": 12500,
            "publicVisible": True,
            "bookable": False,
            "notes": "test",
        }
        request = {
            "status": "request",
            "price": None,
            "currency": "RUB",
            "display": "цена по запросу",
            "sourceValue": "по запросу",
            "publicVisible": True,
            "bookable": False,
            "notes": "test",
        }
        return {
            "one_hour": active,
            "four_hours": request,
            "eight_hours": request,
            "two_days": request,
            "three_days": request,
        }

    def test_returns_errors_for_conflict_prices_without_failing_when_not_strict(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_json(root, "data/models/robots.source-of-truth.json", {
                "robots": [self.base_robot()]
            })
            self.write_json(root, "data/models/pricing-decision-template.json", {
                "decisions": [{"slug": "arenda-unitree-g1", "approved": False}]
            })

            result = validate_robot_source(root, strict=False)

            self.assertFalse(result["ok"])
            self.assertEqual(result["summary"]["robots"], 1)
            self.assertEqual(result["summary"]["priceIssues"], 1)
            self.assertIn("conflict_detected", result["errors"][0]["message"])

    def test_passes_when_price_is_approved_and_template_matches(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_json(root, "data/models/robots.source-of-truth.json", {
                "robots": [self.base_robot(approved=True, tariffs=self.valid_tariffs())]
            })
            self.write_json(root, "data/models/pricing-decision-template.json", {
                "decisions": [{
                    "slug": "arenda-unitree-g1",
                    "approved": True,
                    "canonicalPriceDisplay": "25 000 ₽/час, минимальный заказ — 2 часа",
                    "priceFrom": 25000,
                    "currency": "RUB",
                    "unit": "hour",
                    "minimumOrder": "2 часа",
                }]
            })

            result = validate_robot_source(root, strict=True)

            self.assertTrue(result["ok"])
            self.assertEqual(result["summary"]["priceIssues"], 0)
            self.assertEqual(result["errors"], [])

    def test_reports_slug_mismatch_between_price_audit_and_decision_template(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_json(root, "data/models/robots.source-of-truth.json", {
                "robots": [self.base_robot(slug="arenda-unitree-g1", approved=True, tariffs=self.valid_tariffs())]
            })
            self.write_json(root, "data/models/pricing-decision-template.json", {
                "decisions": [{"slug": "arenda-other", "approved": False}]
            })

            result = validate_robot_source(root, strict=False)

            self.assertFalse(result["ok"])
            self.assertTrue(any(error["code"] == "unknown_pricing_decision_slug" for error in result["errors"]))

    def test_validates_required_tariff_status_semantics(self):
        tariffs = self.valid_tariffs()
        tariffs["four_hours"] = {
            "status": "not_applicable",
            "price": 0,
            "currency": "RUB",
            "display": "0 ₽",
            "sourceValue": "нет",
            "publicVisible": True,
            "bookable": True,
            "notes": "bad",
        }
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_json(root, "data/models/robots.source-of-truth.json", {
                "robots": [self.base_robot(approved=True, tariffs=tariffs)]
            })
            self.write_json(root, "data/models/pricing-decision-template.json", {"decisions": []})

            result = validate_robot_source(root, strict=False)

            self.assertFalse(result["ok"])
            self.assertGreaterEqual(result["summary"]["tariffIssues"], 1)
            self.assertTrue(any(error["code"] == "invalid_not_applicable_tariff" for error in result["errors"]))

    def test_validates_extended_pricing_decision_status_semantics(self):
        robot = self.base_robot(approved=True, tariffs=self.valid_tariffs())
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_json(root, "data/models/robots.source-of-truth.json", {"robots": [robot]})
            self.write_json(root, "data/models/pricing-decision-template.json", {
                "decisions": [{
                    "slug": "arenda-unitree-g1",
                    "decisionStatus": "needs_review",
                    "approved": True,
                    "canonicalPriceDisplay": "от 25 000 ₽ / час",
                    "owner": "someone",
                    "unit": "hour",
                }]
            })

            result = validate_robot_source(root, strict=False)

            self.assertFalse(result["ok"])
            self.assertGreaterEqual(result["summary"]["decisionIssues"], 1)
            self.assertTrue(any(error["code"] == "unapproved_pricing_decision_flag_mismatch" for error in result["errors"]))
            self.assertTrue(any(error["code"] == "unapproved_pricing_decision_has_canonical" for error in result["errors"]))
            self.assertTrue(any(error["code"] == "needs_review_pricing_owner_not_placeholder" for error in result["errors"]))

    def test_allows_approved_request_only_pricing_decision(self):
        robot = self.base_robot(approved=True, tariffs=self.valid_tariffs())
        robot["pricing"]["display"] = "цена по запросу"
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_json(root, "data/models/robots.source-of-truth.json", {"robots": [robot]})
            self.write_json(root, "data/models/pricing-decision-template.json", {
                "decisions": [{
                    "slug": "arenda-unitree-g1",
                    "decisionStatus": "approved",
                    "approved": True,
                    "canonicalPriceDisplay": "цена по запросу",
                    "amount": None,
                    "unit": "request",
                    "owner": "Александр Маркин / Denis Rogov",
                    "reviewedOn": "2026-08-26",
                    "validFrom": "2026-08-26",
                }]
            })

            result = validate_robot_source(root, strict=True)

            self.assertTrue(result["ok"])
            self.assertEqual(result["summary"]["decisionIssues"], 0)

    def test_warns_when_approved_xlsx_price_needs_source_sync(self):
        robot = self.base_robot(approved=True, tariffs=self.valid_tariffs())
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_json(root, "data/models/robots.source-of-truth.json", {"robots": [robot]})
            self.write_json(root, "data/models/pricing-decision-template.json", {
                "decisions": [{
                    "slug": "arenda-unitree-g1",
                    "decisionStatus": "approved",
                    "approved": True,
                    "canonicalPriceDisplay": "от 15 000 ₽ / час",
                    "amount": 15000,
                    "unit": "hour",
                    "owner": "Александр Маркин / Denis Rogov",
                    "reviewedOn": "2026-08-26",
                    "validFrom": "2026-08-26",
                }]
            })

            result = validate_robot_source(root, strict=True)

            self.assertTrue(result["ok"])
            self.assertTrue(any(warning["code"] == "approved_price_display_needs_source_sync" for warning in result["warnings"]))

    def test_reports_meaningful_media_without_human_description_as_warning(self):
        robot = self.base_robot(approved=True, tariffs=self.valid_tariffs())
        robot["media"] = {
            "images": [
                {"src": "/images/robot.jpg", "role": "gallery", "reviewStatus": "needs_human_description", "actualDescription": ""},
                {"src": "/images/logo.svg", "role": "decorative", "reviewStatus": "decorative_or_service", "actualDescription": ""},
            ]
        }
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_json(root, "data/models/robots.source-of-truth.json", {"robots": [robot]})
            self.write_json(root, "data/models/pricing-decision-template.json", {"decisions": []})

            result = validate_robot_source(root, strict=False)

            self.assertTrue(result["ok"])
            self.assertEqual(result["summary"]["mediaIssues"], 1)
            self.assertTrue(any(warning["code"] == "media_human_description_needed" for warning in result["warnings"]))

    def test_reports_stage2_enrichment_gaps_as_warnings(self):
        robot = self.base_robot(approved=True, tariffs=self.valid_tariffs())
        robot.update({
            "seo": {
                "seoTitle": "",
                "metaDescription": "",
                "primaryKeyword": "",
                "secondaryKeywords": [],
                "searchIntent": [],
                "schemaTypes": [],
                "ogImage": "",
            },
            "media": {"images": [
                {"src": "/images/robot.jpg", "role": "gallery", "reviewStatus": "seo_alt_generated", "actualDescription": "robot", "alt": "robot"},
            ]},
            "related": {"robots": [], "collections": [], "articles": [], "cases": []},
            "contentFacts": {"capabilities": [], "scenarios": [], "venueRequirements": [], "faq": []},
            "proposal": {"enabled": False, "status": "not_started", "pdfUrl": "", "version": ""},
        })
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.write_json(root, "data/models/robots.source-of-truth.json", {"robots": [robot]})
            self.write_json(root, "data/models/pricing-decision-template.json", {"decisions": []})

            result = validate_robot_source(root, strict=False)

            self.assertTrue(result["ok"])
            self.assertGreaterEqual(result["summary"]["stage2Issues"], 1)
            self.assertTrue(any(warning["code"] == "seo_field_missing" for warning in result["warnings"]))
            self.assertTrue(any(warning["code"] == "media_role_missing" for warning in result["warnings"]))
            self.assertTrue(any(warning["code"] == "related_robots_missing" for warning in result["warnings"]))


if __name__ == "__main__":
    unittest.main()
