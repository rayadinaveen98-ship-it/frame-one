#!/usr/bin/env python3
"""Assign a monotonic Android QA versionCode to Capacitor's generated Gradle app.

Each new GitHub Android-debug workflow run receives an increasing run number.
A retry of the *same run* intentionally retains its versionCode. The public
publisher separately rejects non-increasing codes. Never touches signing keys.
"""
from __future__ import annotations

import argparse
from pathlib import Path
import re

BASE = 100_000
MAX_ANDROID_VERSION_CODE = 2_100_000_000


def assign_version(gradle_path: Path, run_number: str) -> int:
    if not re.fullmatch(r"[1-9][0-9]*", run_number):
        raise ValueError("GITHUB_RUN_NUMBER must be a positive decimal integer")
    version = BASE + int(run_number)
    if version > MAX_ANDROID_VERSION_CODE:
        raise ValueError("Android QA versionCode exceeds Play-supported maximum")

    original = gradle_path.read_text(encoding="utf-8")
    updated, count = re.subn(
        r"(?m)^([ \t]*)versionCode[ \t]+1[ \t]*$",
        lambda m: f"{m.group(1)}versionCode {version}",
        original,
    )
    if count != 1:
        raise ValueError(f"Expected one generated Capacitor versionCode 1; found {count}")
    if not re.search(r'applicationId[ \t]+["\x27]com\.frameone\.learncinema["\x27]', updated):
        raise ValueError("Unexpected Android package ID; do not alter update identity")
    gradle_path.write_text(updated, encoding="utf-8")
    return version


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--gradle", required=True, type=Path)
    parser.add_argument("--run-number", required=True)
    args = parser.parse_args()
    value = assign_version(args.gradle, args.run_number)
    print(f"Frame One QA Android versionCode: {value} (run number {args.run_number})")
