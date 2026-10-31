#!/usr/bin/env python3
"""Android v1 -> v2 same-certificate upgrade/data-retention acceptance.

This UI-driven test consumes two pre-built APKs staged by its workflow. The
same-source gate checks native package-update mechanics. The cross-source
gate builds historical and current sources to check a real code migration.
In same-job tests, one throwaway CI key signs both APKs. For cross-run QA,
this script can also consume independently built APKs signed by a persistent
QA key. Emulator acceptance never proves physical-phone or Play Store behavior.
"""
from __future__ import annotations

import importlib.util
import os
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


def load_two_project_qa():
    """Reuse genuine Android UI interactions from backup acceptance.

    Only the same-source v0.14+ test sets the opt-in. Historical v0.11 APKs
    intentionally have no multi-project UI and must retain their own
    single-storyboard migration test.
    """
    if os.environ.get("FRAMEONE_UPGRADE_PROJECTS") != "1":
        return None
    source = Path(__file__).with_name("android-emulator-backup.py")
    spec = importlib.util.spec_from_file_location("frameone_upgrade_projects", source)
    if not spec or not spec.loader:
        raise RuntimeError("Cannot load existing Android two-project QA actions")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def verify_projects_after_upgrade(project_qa):
    """Prove both project choices remain functional after package replacement."""
    # The prior assertion may already be inside Make Lab. Tapping the
    # selected bottom tab again does not necessarily reset its nested view.
    # Return Home before entering Lab so the tab-picker is genuinely visible.
    ui.tap_label("Home")
    ui.tap_label("Lab")
    state.find_text("One moment. Many frames.")
    state.control("✎ Make")
    state.scroll_top()
    state.find_text(project_qa.SECOND_PROJECT, tries=12, scroll=True)
    project_qa.state.scroll_top()
    project_qa.tap_text("My first scene", tries=16, scroll=True)
    state.find_text("Will the person stay or leave?", scroll=True)
    state.assert_close_framing()
    state.find_text(state.SHOT_NOTE, scroll=True)
    state.scroll_top()
    state.find_text(project_qa.SECOND_PROJECT, tries=12, scroll=True)
    project_qa.tap_text(project_qa.SECOND_PROJECT, tries=16, scroll=True)
    state.find_text("My first scene", tries=12, scroll=True)
    # Leave first storyboard selected for the established full offline
    # persistence assertion, without modifying either project.
    project_qa.state.scroll_top()
    project_qa.tap_text("My first scene", tries=16, scroll=True)
    state.find_text("Will the person stay or leave?", scroll=True)
    print("PASS: two separate Make Lab projects remain switchable, original note and framing retained after Android APK update", flush=True)




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
    # Same-job tests use 1 -> 2. Cross-run tests pass real Android APK codes.
    old_code = int(os.environ.get("FRAMEONE_UPGRADE_OLD_CODE", "1"))
    new_code = int(os.environ.get("FRAMEONE_UPGRADE_NEW_CODE", "2"))
    if old_code < 1 or new_code <= old_code or new_code > 2100000000:
        raise ValueError("Upgrade versionCodes must be increasing positive Android codes")
    project_qa = load_two_project_qa()
    print(f"UPGRADE QA versionCode {old_code} -> {new_code}", flush=True)
    print("UPGRADE QA: clean-install test v1; no pre-existing data", flush=True)
    # No uninstall between v1 and v2: preserving the app data is the test.
    ui.adb("install", "-t", str(APK_V1), timeout=120)
    assert_version(old_code)
    state.launch()
    state.complete_first_lesson()
    state.make_storyboard()
    state.restart_offline()
    state.verify_after_restart()
    if project_qa:
        project_qa.create_second_storyboard()
        state.find_text(project_qa.SECOND_PROJECT, tries=12, scroll=True)
        ui.capture("upgrade-01b-v1-two-storyboards")
        print("PASS: v1 Android app created two independent storyboards with real UI inputs", flush=True)
    ui.capture("upgrade-01-v1-offline-progress")
    print("PASS: v1 completed lesson, storyboard and note survive an offline cold start", flush=True)

    ui.adb("shell", "cmd", "connectivity", "airplane-mode", "disable")
    ui.adb("shell", "svc", "wifi", "enable")
    ui.adb("shell", "am", "force-stop", ui.PACKAGE)

    print("UPGRADE QA: install signed v2 over v1 with adb install -r; DO NOT uninstall", flush=True)
    result = ui.adb("install", "-r", "-t", str(APK_V2), timeout=120)
    if "Success" not in result:
        raise AssertionError("Android did not report successful in-place package update")
    assert_version(new_code)
    state.launch()
    if project_qa:
        verify_projects_after_upgrade(project_qa)
        ui.tap_label("Home")
    state.verify_after_restart()
    ui.capture("upgrade-02-v2-progress-retained")
    print("PASS: saved lesson, act progress, shot framing and authored note survive in-place v2 upgrade", flush=True)

    state.restart_offline()
    state.verify_after_restart()
    if project_qa:
        verify_projects_after_upgrade(project_qa)
        ui.capture("upgrade-03b-v2-two-storyboards-offline")
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
