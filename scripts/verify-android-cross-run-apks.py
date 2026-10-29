#!/usr/bin/env python3
"""Validate separately built, persistently signed Android QA APKs before upgrading.

Checks real APK manifests and signer digests against public CI receipts.
No private keys are read, copied, stored, printed or required.
"""
from __future__ import annotations

import argparse
import hashlib
import os
from pathlib import Path
import re
import subprocess
import zipfile

APP_ID = "com.frameone.learncinema"
SIGNED_LINE = "Persistent QA signer: YES (managed by GitHub Secret)"
CERT_LINE = re.compile(r"^Signer #1 certificate SHA-256 digest: ([0-9a-fA-F]{64})$")
CODE_LINE = re.compile(r"^Android versionCode: ([1-9][0-9]*)$")
APK_MANIFEST = re.compile(r"package: name='([^']+)' versionCode='([0-9]+)'")
MAX_CODE = 2_100_000_000


def one_line_match(lines: list[str], pattern: re.Pattern[str], label: str) -> str:
    found = [m.group(1) for line in lines if (m := pattern.fullmatch(line))]
    if len(found) != 1:
        raise ValueError(f"{label}: expected exactly one valid receipt line, got {len(found)}")
    return found[0]


def receipt_values(path: Path) -> tuple[str, int]:
    text = path.read_text(encoding="utf-8")
    lines = [s.strip() for s in text.splitlines()]
    if lines.count(SIGNED_LINE) != 1 or any(
        s.startswith("Persistent QA signer: ") and s != SIGNED_LINE for s in lines
    ):
        raise ValueError(f"{path.name}: requires exactly one persistent QA signer receipt")
    cert = one_line_match(lines, CERT_LINE, "signing certificate").lower()
    code = int(one_line_match(lines, CODE_LINE, "Android versionCode"))
    if not 100_000 < code <= MAX_CODE:
        raise ValueError("QA versionCode outside generated Android range")
    return cert, code


def checked_output(*argv: str) -> str:
    return subprocess.check_output(argv, text=True, stderr=subprocess.STDOUT)


def apk_values(path: Path, aapt: str, apksigner: str) -> tuple[str, int, str]:
    if not path.is_file() or path.stat().st_size == 0:
        raise ValueError(f"Missing QA Android APK: {path}")
    with zipfile.ZipFile(path) as archive:
        if archive.testzip() is not None:
            raise ValueError("APK has corrupt ZIP member")
        if "assets/public/index.html" not in archive.namelist():
            raise ValueError("APK is missing Frame One offline web entrypoint")
        web_sha = hashlib.sha256(archive.read("assets/public/index.html")).hexdigest()
    badging = checked_output(aapt, "dump", "badging", str(path))
    found = APK_MANIFEST.search(badging)
    if not found or found.group(1) != APP_ID:
        raise ValueError("APK application ID differs from installed Frame One")
    code = int(found.group(2))
    verified = checked_output(apksigner, "verify", "--print-certs", str(path))
    cert = one_line_match(verified.splitlines(), CERT_LINE, "actual APK signature").lower()
    return cert, code, web_sha


def verify_pair(old_dir: Path, new_dir: Path, aapt: str, apksigner: str) -> tuple[int, int]:
    old_receipt = receipt_values(old_dir / "android-qa-signature.txt")
    new_receipt = receipt_values(new_dir / "android-qa-signature.txt")
    old_cert, old_code = old_receipt
    new_cert, new_code = new_receipt
    if old_cert != new_cert:
        raise ValueError("BLOCKED: separate CI builds have different signing certificates")
    if new_code <= old_code:
        raise ValueError("BLOCKED: second APK must have strictly higher versionCode")

    old_actual = apk_values(old_dir / "app-debug.apk", aapt, apksigner)
    new_actual = apk_values(new_dir / "app-debug.apk", aapt, apksigner)
    if old_actual[:2] != old_receipt or new_actual[:2] != new_receipt:
        raise ValueError("BLOCKED: APK package/signature differs from trusted public receipt")
    if old_actual[2] == new_actual[2]:
        raise ValueError("BLOCKED: both APKs have identical web entrypoint bundles")
    return old_code, new_code


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--old-dir", type=Path, required=True)
    parser.add_argument("--new-dir", type=Path, required=True)
    parser.add_argument("--aapt", required=True)
    parser.add_argument("--apksigner", required=True)
    args = parser.parse_args()
    old_code, new_code = verify_pair(args.old_dir, args.new_dir, args.aapt, args.apksigner)
    print(f"PASS: independent signed CI APKs share signer; versionCode {old_code} -> {new_code}")
    # Used by emulator job; never include a certificate/private key here.
    if env_file := os.getenv("GITHUB_ENV"):
        with open(env_file, "a", encoding="utf-8") as handle:
            handle.write(f"FRAMEONE_UPGRADE_OLD_CODE={old_code}\n")
            handle.write(f"FRAMEONE_UPGRADE_NEW_CODE={new_code}\n")


if __name__ == "__main__":
    main()
