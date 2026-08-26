#!/usr/bin/env python3
"""Validate price records against the approved robot price schema (KP-060 / KIBER-42).

Run without arguments to check that the schema still accepts every `valid`
fixture and rejects every `invalid` one — a schema that stops rejecting bad data
is worse than no schema. Pass `--records` to validate a real pricing file.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from jsonschema import Draft202012Validator, RefResolver

SCHEMA_DIR = Path("data/models/schema")
PRICING_SCHEMA = SCHEMA_DIR / "robot-pricing.schema.json"
PRICE_SCHEMA = SCHEMA_DIR / "robot-price.schema.json"
EXAMPLES = Path("data/models/examples/robot-pricing.examples.json")


def build_validator(schema_dir: Path) -> Draft202012Validator:
    pricing = json.loads((schema_dir / "robot-pricing.schema.json").read_text(encoding="utf-8"))
    price = json.loads((schema_dir / "robot-price.schema.json").read_text(encoding="utf-8"))
    # The two schemas reference each other by $id, so both live in the resolver store.
    resolver = RefResolver(
        base_uri=pricing["$id"],
        referrer=pricing,
        store={pricing["$id"]: pricing, price["$id"]: price},
    )
    return Draft202012Validator(pricing, resolver=resolver)


def errors_for(validator: Draft202012Validator, record: dict) -> list[str]:
    return [f"{'/'.join(str(part) for part in error.path) or '<root>'}: {error.message}" for error in validator.iter_errors(record)]


def check_examples(validator: Draft202012Validator, examples_path: Path) -> int:
    fixtures = json.loads(examples_path.read_text(encoding="utf-8"))
    failures = 0

    for fixture in fixtures["valid"]:
        problems = errors_for(validator, fixture["record"])
        if problems:
            failures += 1
            print(f"FAIL (должно проходить) {fixture['case']}: {'; '.join(problems)}")
        else:
            print(f"ok   valid   {fixture['case']}")

    for fixture in fixtures["invalid"]:
        problems = errors_for(validator, fixture["record"])
        if problems:
            print(f"ok   invalid {fixture['case']} — отклонено: {problems[0]}")
        else:
            failures += 1
            print(f"FAIL (должно отклоняться) {fixture['case']}: {fixture['reason']}")

    return failures


def check_records(validator: Draft202012Validator, records_path: Path) -> int:
    payload = json.loads(records_path.read_text(encoding="utf-8"))
    records = payload["pricing"] if isinstance(payload, dict) and "pricing" in payload else payload
    failures = 0
    for record in records:
        problems = errors_for(validator, record)
        if problems:
            failures += 1
            print(f"FAIL {record.get('slug', '<без slug>')}: {'; '.join(problems)}")
    print(f"Проверено записей: {len(records)}, ошибок: {failures}")
    return failures


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--schema-dir", type=Path, default=SCHEMA_DIR)
    parser.add_argument("--examples", type=Path, default=EXAMPLES)
    parser.add_argument("--records", type=Path, default=None, help="Файл с реальными ценовыми записями")
    args = parser.parse_args()

    validator = build_validator(args.schema_dir)
    failures = check_examples(validator, args.examples)
    if args.records:
        failures += check_records(validator, args.records)

    if failures:
        print(f"\nОшибок: {failures}", file=sys.stderr)
        return 1
    print("\nСхема ведёт себя как задумано.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
