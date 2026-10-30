#!/usr/bin/env python3
"""Conservative REAL-PHONE Android upgrade QA for Frame One.

Never uninstalls apps, clears app data, collects learner data or writes a key.
Requires two independent persistent-signed GitHub APKs, their public receipts,
Android SDK aapt/apksigner and adb. Tests app *package/version* only; the human
tester must personally verify lesson progress, notes, storyboard, sound/Back
and external JSON backup restore before signing off a public release.
"""
from __future__ import annotations

import argparse
import importlib.util
from pathlib import Path
import re
import subprocess
import sys

APP_ID = "com.frameone.learncinema"
ROOT = Path(__file__).resolve().parents[1]
VERIFY_PATH = ROOT / "scripts/verify-android-cross-run-apks.py"
VERSION = re.compile(r"\bversionCode=(\d+)")
DEVICE = re.compile(r"^([^\s]+)\s+(\w+)(?:\s|$)", re.MULTILINE)


def verify_signed_pair(old_dir: Path, new_dir: Path, aapt: str, apksigner: str) -> tuple[int, int]:
    spec = importlib.util.spec_from_file_location("frameone_cross_run", VERIFY_PATH)
    if not spec or not spec.loader:
        raise RuntimeError("Cannot load shared Frame One signed APK verifier")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.verify_pair(old_dir, new_dir, aapt, apksigner)


def run(command: list[str]) -> str:
    try:
        result = subprocess.run(command, text=True, capture_output=True, check=False, timeout=120)
    except (OSError, subprocess.TimeoutExpired) as exc:
        raise RuntimeError(f"Command failed to start/finish: {command[0]}: {exc}") from exc
    if result.returncode != 0:
        raise RuntimeError(f"Android tooling returned failure for {command[0]}: {result.stderr.strip()[:300]}")
    return result.stdout.strip()


def choose_device(adb: str, serial: str | None) -> list[str]:
    output = run([adb, "devices", "-l"])
    devices: dict[str, str] = {}
    for match in DEVICE.finditer(output):
        if match.group(1) == "List":
            continue
        devices[match.group(1)] = match.group(2)
    if serial:
        if devices.get(serial) != "device":
            raise RuntimeError("Requested Android device is missing, offline or unauthorized")
        selected = serial
    else:
        ready = [key for key, value in devices.items() if value == "device"]
        if len(ready) != 1 or len(devices) != 1:
            raise RuntimeError("Connect exactly one authorized Android test phone, or pass --serial")
        selected = ready[0]
    command = [adb, "-s", selected]
    if run(command + ["shell", "getprop", "ro.kernel.qemu"]) == "1":
        raise RuntimeError("Physical-phone QA cannot be claimed from an Android emulator")
    return command


def installed_package(adb_command: list[str]) -> bool:
    path_output = run(adb_command + ["shell", "pm", "path", APP_ID])
    if not path_output:
        return False
    if not all(line.startswith("package:") for line in path_output.splitlines()):
        raise RuntimeError("Unexpected Android package inspection response; refusing install")
    return True


def installed_version(adb_command: list[str]) -> int:
    output = run(adb_command + ["shell", "dumpsys", "package", APP_ID])
    matches = VERSION.findall(output)
    if not matches:
        raise RuntimeError("Cannot confirm installed Frame One versionCode")
    return int(matches[0])


def execute(args: argparse.Namespace) -> str:
    old_code, new_code = verify_signed_pair(args.old_dir, args.new_dir, args.aapt, args.apksigner)
    if args.phase == "preflight":
        return (
            f"PASS: APK manifests, matching persistent signer, receipts, offline entries and "
            f"increasing codes verified ({old_code} -> {new_code}). "
            "NO PHONE TESTED; NO APK INSTALLED."
        )

    if args.phase in ("install-old", "upgrade-new") and not args.approve_install:
        raise ValueError("Install requires --approve-install; no installation attempted")
    if args.phase == "install-old" and not args.confirm_empty_test_profile:
        raise ValueError("Refusing first install without --confirm-empty-test-profile")
    if args.phase == "upgrade-new" and not (args.backup_verified and args.learning_data_created):
        raise ValueError("Upgrade needs both --backup-verified and --learning-data-created")

    adb = choose_device(args.adb, args.serial)
    if args.phase == "install-old":
        if installed_package(adb):
            raise RuntimeError(
                "Frame One already installed. Existing learner data may be present; "
                "refusing to replace or uninstall. Use a fresh dedicated test device/profile."
            )
        result = run(adb + ["install", "-t", str(args.old_dir / "app-debug.apk")])
        if "Success" not in result:
            raise RuntimeError("Android did not confirm fresh test installation")
        if installed_version(adb) != old_code:
            raise RuntimeError("Installed initial APK versionCode differs from verified source")
        return (
            f"PASS: installed older test APK versionCode={old_code} on physical phone. "
            "Now create lesson/quiz progress, authored note and storyboard, then export and verify a JSON backup."
        )
    if not installed_package(adb):
        raise RuntimeError("Frame One not installed; cannot verify or upgrade an absent test package")
    code = installed_version(adb)
    if args.phase == "upgrade-new":
        if code != old_code:
            raise RuntimeError(
                f"Installed versionCode {code} differs from expected older test APK {old_code}. "
                "Refusing replacement; existing progress must not be risked."
            )
        result = run(adb + ["install", "-r", "-t", str(args.new_dir / "app-debug.apk")])
        if "Success" not in result:
            raise RuntimeError("Android did not confirm in-place upgrade")
        if installed_version(adb) != new_code:
            raise RuntimeError("Installed upgraded APK versionCode does not match verified candidate")
        return (
            f"PASS: Android reports a non-uninstalling upgrade {old_code} -> {new_code}. "
            "Learning-data retention is NOT yet verified: manually check original quiz, notes, storyboard, offline restart and backup restore."
        )
    if args.phase == "verify-new":
        if code != new_code:
            raise RuntimeError(f"Expected newer APK versionCode {new_code}, found {code}")
        return (
            f"PASS: expected candidate package/versionCode={new_code} installed on a physical phone. "
            "This verifies package identity only, NOT lesson/notes/storyboard retention or sound."
        )
    raise ValueError(f"Unknown phase {args.phase}")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--phase", choices=["preflight", "install-old", "upgrade-new", "verify-new"],
                        required=True)
    parser.add_argument("--old-dir", type=Path, required=True,
                        help="Unzipped earlier GitHub APK artifact directory")
    parser.add_argument("--new-dir", type=Path, required=True,
                        help="Unzipped newer GitHub APK artifact directory")
    parser.add_argument("--aapt", default="aapt", help="Full path to Android SDK aapt or aapt.exe")
    parser.add_argument("--apksigner", default="apksigner", help="Full path to apksigner or apksigner.bat")
    parser.add_argument("--adb", default="adb", help="Full path to adb or adb.exe")
    parser.add_argument("--serial", default=None, help="Explicit authorized Android device serial")
    parser.add_argument("--approve-install", action="store_true",
                        help="Explicit opt-in for install-old and upgrade-new only")
    parser.add_argument("--confirm-empty-test-profile", action="store_true",
                        help="Confirm first installation is on an empty, dedicated test device/profile")
    parser.add_argument("--backup-verified", action="store_true",
                        help="Confirm the old app's external JSON backup was saved and verified")
    parser.add_argument("--learning-data-created", action="store_true",
                        help="Confirm an old-version quiz, note and storyboard were created for retention test")
    args = parser.parse_args()
    try:
        print(execute(args), flush=True)
    except (ValueError, RuntimeError, OSError, subprocess.SubprocessError) as exc:
        print(f"BLOCKED: {exc}", file=sys.stderr, flush=True)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
