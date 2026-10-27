#!/usr/bin/env python3
"""Real Android-emulator acceptance for the Capacitor Frame One APK.

Works with Android's built-in adb + uiautomator. No WebView mocking, browser
DevTools shortcuts, external app-testing service, or extra Python packages.
Checks app install/boot, native system Back navigation and app minimization.

The purpose is to detect runtime failures missed by TypeScript and APK ZIP QA.
It does not replace a physical phone test for gestures, audio or file pickers.
"""
from __future__ import annotations

import re
import subprocess
import sys
import time
import xml.etree.ElementTree as ET
from pathlib import Path

PACKAGE = "com.frameone.learncinema"
APK = Path("android/app/build/outputs/apk/debug/app-debug.apk")
OUTPUT = Path("qa/android-emulator")
OUTPUT.mkdir(parents=True, exist_ok=True)
LAST_XML = ""

def adb(*args: str, timeout: int = 40, check: bool = True) -> str:
    command = ["adb", *args]
    process = subprocess.run(command, capture_output=True, text=True, timeout=timeout)
    if check and process.returncode:
        raise RuntimeError(f"{' '.join(command)} failed ({process.returncode}): "
                           f"{process.stderr[-600:]} {process.stdout[-600:]}")
    return process.stdout.strip()

def capture(stage: str) -> None:
    global LAST_XML
    if LAST_XML:
        (OUTPUT / f"{stage}-hierarchy.xml").write_text(LAST_XML, encoding="utf-8")
    with (OUTPUT / f"{stage}.png").open("wb") as stream:
        proc = subprocess.run(["adb", "exec-out", "screencap", "-p"],
                              stdout=stream, stderr=subprocess.PIPE, timeout=30)
        if proc.returncode:
            print(f"WARNING: screenshot failed at {stage}: {proc.stderr!r}", flush=True)

def hierarchy() -> list[dict[str, object]]:
    global LAST_XML
    adb("shell", "uiautomator", "dump", "/sdcard/frameone-qa.xml", timeout=45)
    xml = adb("shell", "cat", "/sdcard/frameone-qa.xml", timeout=20)
    LAST_XML = xml
    root = ET.fromstring(xml)
    nodes = []
    for node in root.iter("node"):
        label = " ".join((node.attrib.get("text",""),
                          node.attrib.get("content-desc",""))).strip()
        bounds = node.attrib.get("bounds", "")
        match = re.fullmatch(r"\[(\d+),(\d+)\]\[(\d+),(\d+)\]", bounds)
        if not match:
            continue
        x1,y1,x2,y2 = map(int, match.groups())
        nodes.append({"label":label, "x":(x1+x2)//2, "y":(y1+y2)//2,
                      "bottom":y2, "enabled":node.attrib.get("enabled","true")})
    return nodes

def find(text: str, exact: bool = False, tries: int = 16) -> list[dict[str, object]]:
    for attempt in range(tries):
        try:
            nodes = hierarchy()
            matches = [n for n in nodes if n["label"] == text] if exact else [
                n for n in nodes if text.lower() in str(n["label"]).lower()]
            if matches:
                return matches
        except (ET.ParseError, RuntimeError) as exc:
            print(f"UI hierarchy not ready ({type(exc).__name__}); retry", flush=True)
        time.sleep(2)
    capture("missing-" + re.sub(r"[^a-z0-9]+","-",text.lower()).strip("-")[:36])
    raise AssertionError(f"Android UI never displayed: {text!r}. See captured screenshot/XML.")

def tap_label(text: str, *, exact: bool = True) -> None:
    # Bottom tabs must match EXACT labels: Android's WebView root contains
    # "Learn" in the app title and covers the whole viewport.
    # Lesson cards may combine title/subtitle, so they opt into substring mode.
    matches = find(text, exact=exact)
    visible = [n for n in matches if int(n["bottom"]) > 0
               and int(n["x"]) > 0 and int(n["y"]) > 0]
    if not visible and not exact:
        # Android returns [0,0][0,0] for offscreen WebView lesson cards.
        # Scroll the course in small steps rather than tapping screen origin.
        for _ in range(5):
            adb("shell","input","swipe","540","1700","540","850","360")
            matches = find(text, exact=False, tries=3)
            visible = [n for n in matches if int(n["bottom"]) > 0
                       and int(n["x"]) > 0 and int(n["y"]) > 0]
            if visible:
                break
    if not visible:
        capture("invisible-" + re.sub(r"[^a-z0-9]+","-",text.lower())[:35])
        raise AssertionError(f"Could not tap visible Android accessibility target: {text!r}")
    target = max(visible, key=lambda n: int(n["bottom"]))
    print(f"TAP {text!r} at {target['x']},{target['y']}", flush=True)
    adb("shell", "input", "tap", str(target["x"]), str(target["y"]))

def no_heading(text: str) -> None:
    nodes = hierarchy()
    if any(text.lower() in str(n["label"]).lower() for n in nodes):
        capture("unexpected-heading")
        raise AssertionError(f"{text!r} remained visible after navigating away.")

def system_back() -> None:
    adb("shell", "input", "keyevent", "KEYCODE_BACK")
    time.sleep(1.2)

def main() -> None:
    if not APK.is_file():
        raise FileNotFoundError(APK)
    print("FRAME ONE EMULATOR: installing actual Capacitor Android APK", flush=True)
    print(adb("devices"), flush=True)
    adb("install", "-r", "-t", str(APK), timeout=90)
    # Launch through the normal Android launcher intent, like a user
    # opening the installed app. This is essential for root-task Back/minimize:
    # direct adb am start behaves differently under Android Test Device.
    adb("shell", "monkey", "-p", PACKAGE, "-c",
        "android.intent.category.LAUNCHER", "1", timeout=40)
    find("WELCOME TO THE WORLD OF CINEMA", tries=20)
    capture("01-home")
    print("PASS: real Android WebView renders bundled Frame One Home", flush=True)

    tap_label("Learn")
    find("YOUR LEARNING JOURNEY")
    capture("02-learn")
    print("PASS: mobile Learn tab and course explorer render in Android", flush=True)
    tap_label("Why do we watch films?", exact=False)
    find("Why do we watch films?")
    find("Back within Frame One")
    capture("03-lesson")
    print("PASS: native WebView shows first React lesson", flush=True)

    system_back()
    find("YOUR LEARNING JOURNEY")
    print("PASS: Android system Back returns from lesson to Learn", flush=True)
    system_back()
    find("WELCOME TO THE WORLD OF CINEMA")
    no_heading("YOUR LEARNING JOURNEY")
    capture("04-back-home")
    print("PASS: Android system Back returns from Learn to Home", flush=True)

    tap_label("Lab")
    find("One moment. Many frames.")
    capture("05-lab")
    system_back()
    find("WELCOME TO THE WORLD OF CINEMA")
    print("PASS: Android system Back returns from Creative Lab to Home", flush=True)

    system_back()
    time.sleep(2)
    # Android activity transitions can lag an adb key event. Poll actual
    # foreground state rather than declaring failure from one early snapshot.
    resumed=[]
    for attempt in range(10):
        activities=adb("shell","dumpsys","activity","activities",timeout=40)
        resumed=[line.strip() for line in activities.splitlines()
                 if "topResumedActivity=" in line or "mResumedActivity:" in line]
        (OUTPUT / "after-home-back-activity.txt").write_text(
            "\n".join(resumed)+"\n",encoding="utf-8")
        if resumed and all(PACKAGE not in line for line in resumed):
            break
        time.sleep(1)
    if not resumed:
        capture("06-home-minimize-unconfirmed")
        raise AssertionError("Cannot determine foreground Android activity after Home Back")
    print("Foreground activity after Back on Home: " + " | ".join(resumed[-3:]),flush=True)
    if any(PACKAGE in line for line in resumed):
        capture("06-home-not-minimized")
        raise AssertionError("System Back from Frame One Home did not minimize the activity after 10 seconds")
    pid=adb("shell","pidof",PACKAGE,check=False)
    if not pid:
        capture("06-process-exited")
        raise AssertionError("Frame One activity minimized but process did not remain alive")
    capture("06-home-minimized")
    print("PASS: Back on Home minimizes the native activity without exiting its process",flush=True)
    print("FRAME ONE ANDROID EMULATOR SMOKE: PASS",flush=True)

if __name__=="__main__":
    try:
        main()
    except Exception as exc:
        print(f"FRAME ONE ANDROID EMULATOR SMOKE: FAIL: {exc}",file=sys.stderr,flush=True)
        try: capture("failure")
        except Exception as extra: print(f"Screenshot unavailable: {extra}",file=sys.stderr)
        sys.exit(1)
