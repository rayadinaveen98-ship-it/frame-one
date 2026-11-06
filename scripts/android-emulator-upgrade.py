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
import time
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


def verify_learning_progress_with_multiple_projects():
    """Assert original progress independently of which storyboard is active.

    v0.14 intentionally remembers the second project. The older one-project
    verify_after_restart() assumes the Decision story is already selected,
    which is incorrect after creating the second project before upgrading.
    """
    state.find_text("1/33 lessons")
    ui.tap_label("Learn")
    state.find_text("YOUR CINEMA JOURNEY")
    state.find_text("3 percent complete")
    state.find_text("1 of 5 lessons finished")
    print("PASS: original lesson completion and chapter progress retained with two film projects",flush=True)


def open_real_project_row(name,tries=22):
    """Tap the actual enabled OPEN PROJECT button, not a duplicate heading.

    Option B's active-project hero also displays a project name, but is not
    the library switch action. Using the smallest text-matching View could
    falsely report a switch. Require the real accessibility Button with
    the OPEN PROJECT label and a tappable nonzero bound.
    """
    for _ in range(tries):
        for n in state.nodes():
            value=" ".join((n.attrib.get("text",""),n.attrib.get("content-desc",""))).strip()
            # After a cold restart the first project may already be selected.
            # In that case the real row reads CURRENT PROJECT and its button
            # is disabled; refusing that truth produces a false QA failure.
            if (n.attrib.get("class","").endswith("Button")
                    and name.lower() in value.lower()
                    and "CURRENT PROJECT" in value.upper()):
                print(f"PASS: project {name!r} is already current",flush=True)
                return
            if (n.attrib.get("class","").endswith("Button")
                    and name.lower() in value.lower()
                    and "OPEN PROJECT" in value.upper()
                    and n.attrib.get("enabled","true")!="false"):
                b=state.visible_control_bounds(state.bounds_of(n),1850)
                if b and b[2]-b[0]>=60:
                    print(f"TAP REAL PROJECT {value!r} at {(b[0]+b[2])//2},{(b[1]+b[3])//2}",flush=True)
                    ui.adb("shell","input","tap",str((b[0]+b[2])//2),str((b[1]+b[3])//2))
                    time.sleep(.8)
                    return
        state.scroll_up()
    ui.capture("upgrade-project-switch-not-visible")
    raise AssertionError(f"Real OPEN PROJECT button not reachable for {name!r}")


def assert_current_project(name,tries=12):
    """Check real selected project, not text merely present in the library."""
    for _ in range(tries):
        for n in state.nodes():
            value=" ".join((n.attrib.get("text",""),n.attrib.get("content-desc",""))).strip()
            if (n.attrib.get("class","").endswith("Button")
                    and name.lower() in value.lower()
                    and "CURRENT PROJECT" in value.upper()):
                print(f"PASS: real current project {name!r}",flush=True)
                return
        time.sleep(.6)
    ui.capture("upgrade-project-active-not-matching")
    raise AssertionError(f"Actual CURRENT PROJECT selection did not change to {name!r}")


def verify_projects_after_upgrade(project_qa):
    """Prove both project choices remain functional after package replacement."""
    # The prior assertion may already be inside Make Lab. Tapping the
    # selected bottom tab again does not necessarily reset its nested view.
    # Return Home before entering Lab so the tab-picker is genuinely visible.
    ui.tap_label("Home")
    ui.tap_label("Lab")
    # Re-entering Lab may reopen its previously selected Make tool rather
    # than the overview. Both routes are correct learner navigation.
    # Test the actual project library either way, without relying on a
    # particular tab-reset policy.
    overview=any("One moment. Many frames." in " ".join(
        (n.attrib.get("text",""),n.attrib.get("content-desc","")))
        for n in state.nodes())
    if overview:
        state.control("✎ Make")
    else:
        state.find_text("Your film projects.",tries=10)
    state.scroll_top()
    state.find_text(project_qa.SECOND_PROJECT, tries=12, scroll=True)
    project_qa.state.scroll_top()
    open_real_project_row("My first scene")
    assert_current_project("My first scene")
    state.find_text("Will the person stay or leave?", scroll=True)
    state.assert_close_framing()
    state.find_text(state.SHOT_NOTE, scroll=True)
    state.scroll_top()
    state.find_text(project_qa.SECOND_PROJECT, tries=12, scroll=True)
    open_real_project_row(project_qa.SECOND_PROJECT)
    assert_current_project(project_qa.SECOND_PROJECT)
    state.find_text("My first scene", tries=12, scroll=True)
    # Leave first storyboard selected for the established full offline
    # persistence assertion, without modifying either project.
    project_qa.state.scroll_top()
    open_real_project_row("My first scene")
    assert_current_project("My first scene")
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
        # The second storyboard is intentionally still active after update.
        # Verify lessons first, then switch via the real project library and
        # assert original Decision/Close-up shot and note in the first project.
        verify_learning_progress_with_multiple_projects()
        verify_projects_after_upgrade(project_qa)
    else:
        state.verify_after_restart()
    ui.capture("upgrade-02-v2-progress-retained")
    print("PASS: saved lesson, act progress, shot framing and authored note survive in-place v2 upgrade", flush=True)

    state.restart_offline()
    if project_qa:
        verify_learning_progress_with_multiple_projects()
        verify_projects_after_upgrade(project_qa)
        ui.capture("upgrade-03b-v2-two-storyboards-offline")
    else:
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
