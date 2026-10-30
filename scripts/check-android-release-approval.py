#!/usr/bin/env python3
"""Fail-closed check for the public Android preview's separate-build QA proof.

This proof is public metadata written ONLY after the real upgrade emulator passes.
It is not a substitute for a separate human physical-phone and backup check.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path
import re
import sys

RUN_ID = re.compile(r"[1-9][0-9]*\Z")
FIELDS = {"status", "old_run_id", "new_run_id", "old_version_code", "new_version_code"}
MAX_VERSION = 2_100_000_000


def no_duplicate_keys(pairs: list[tuple[str, object]]) -> dict[str, object]:
    result: dict[str, object] = {}
    for key, value in pairs:
        if key in result:
            raise ValueError(f"Duplicate approval proof field: {key}")
        result[key] = value
    return result


def validate(proof: object, candidate_run_id: str) -> tuple[str, str]:
    if not RUN_ID.fullmatch(candidate_run_id):
        raise ValueError("Candidate Android build run ID must be a positive decimal integer")
    if not isinstance(proof, dict) or set(proof) != FIELDS:
        raise ValueError("Missing or unexpected independent upgrade proof fields")
    if proof["status"] != "passed":
        raise ValueError("Independent Android upgrade QA did not report a pass")
    old, new = proof["old_run_id"], proof["new_run_id"]
    if not isinstance(old, str) or not RUN_ID.fullmatch(old):
        raise ValueError("Invalid older Android build run ID")
    if not isinstance(new, str) or not RUN_ID.fullmatch(new):
        raise ValueError("Invalid newer Android build run ID")
    if old == new or new != candidate_run_id:
        raise ValueError("QA proof must verify a different older run and this exact candidate run")
    old_code, new_code = proof["old_version_code"], proof["new_version_code"]
    if (
        type(old_code) is not int or type(new_code) is not int
        or not (100_000 < old_code < new_code <= MAX_VERSION)
    ):
        raise ValueError("QA proof requires two ordered valid Android versionCodes")
    return old, new


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--proof", type=Path, required=True)
    parser.add_argument("--candidate-run-id", required=True)
    args = parser.parse_args()
    try:
        if not args.proof.is_file() or args.proof.stat().st_size > 4096:
            raise ValueError("Missing or oversized independent Android upgrade proof")
        raw = args.proof.read_text(encoding="utf-8")
        data = json.loads(raw, object_pairs_hook=no_duplicate_keys)
        old, new = validate(data, args.candidate_run_id)
    except (ValueError, UnicodeError, OSError) as exc:
        print(f"BLOCKED: {exc}", file=sys.stderr)
        return 1
    print(f"PASS: verified independent Android upgrade {old} -> {new}; candidate matches")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
