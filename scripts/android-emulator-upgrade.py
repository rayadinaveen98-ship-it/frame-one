#!/usr/bin/env python3
"""Same-certificate Android APK v1 -> v2 upgrade acceptance on a real emulator.

This is a mechanical update/data-retention gate using two versionCodes of
the SAME source built in one CI job with one throwaway test signing key.
It does not prove cross-run signing, true app-code migration, or phone behavior.
"""
from __future__ import annotations

import importlib.util
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
APK_V1 = ROOT / "qa/upgrade/app-v1.apk"
APK_V2 = ROOT / "qa/upgrade/app-v2.apk"


def load_learning_state():
    path = Path(__file__).with_name("android-emulator-learning-state.py")
    spec = importlib.util.spec_from_file_location("frameone_upgrade_state", path)
    assert spec and spec.loader
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


state = load_learning_state()
ui = state.ui


def installed_version() -> int:
    details = ui.adb("shell", "dumpsys", "package", ui.PACKAGE, timeout=45)
    match = re.search(r"\bversionCode=(\d+)", details)
    if not match:
        raise AssertionError("Unable to read installed Android package versionCode")
    return int(match.group(1))


def assert_version(expected: int) -> None:
    actual = installed_version()
    if actual != expected:
        raise AssertionError(f"Expected installed versionCode {expected}, got {actual}")
    print(f"PASS: installed {ui.PACKAGE} versionCode={actual}", flush=True)


def main() -> None:
    if not APK_V1.is_file() or not APK_V2.is_file():
        raise FileNotFoundError("Both signed APKs must be staged in qa/upgrade")
    print("UPGRADE QA: clean-install test v1; no pre-existing data", flush=True)
    # No uninstall between v1 and v2: preserving the app data is the test.
    ui.adb("install", "-t", str(APK_V1), timeout=120)
    assert_version(1)
    state.launch()
    state.complete_first_lesson()
    state.make_storyboard()
    state.restart_offline()
    state.verify_after_restart()
    ui.capture("upgrade-01-v1-offline-progress")
    print("PASS: v1 completed lesson, storyboard and note survive an offline cold start", flush=True)

    ui.adb("shell", "cmd", "connectivity", "airplane-mode", "disable")
    ui.adb("shell", "svc", "wifi", "enable")
    ui.adb("shell", "am", "force-stop", ui.PACKAGE)

    print("UPGRADE QA: install signed v2 over v1 with adb install -r; DO NOT uninstall", flush=True)
    result = ui.adb("install", "-r", "-t", str(APK_V2), timeout=120)
    if "Success" not in result:
        raise AssertionError("Android did not report successful in-place package update")
    assert_version(2)
    state.launch()
    state.verify_after_restart()
    ui.capture("upgrade-02-v2-progress-retained")
    print("PASS: saved lesson, act progress, shot framing and authored note survive in-place v2 upgrade", flush=True)

    state.restart_offline()
    state.verify_after_restart()
    ui.capture("upgrade-03-v2-offline-retained")
    ui.adb("shell", "cmd", "connectivity", "airplane-mode", "disable")
    ui.adb("shell", "svc", "wifi", "enable")
    print("FRAME ONE ANDROID TWO-APK SAME-SIGNER UPGRADE: PASS", flush=True)


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"FRAME ONE ANDROID TWO-APK SAME-SIGNER UPGRADE: FAIL: {exc}",
              file=sys.stderr, flush=True)
        try:
            ui.capture("upgrade-failure")
        except Exception as capture_error:
            print(f"Screenshot unavailable: {capture_error}", file=sys.stderr)
        sys.exit(1)
