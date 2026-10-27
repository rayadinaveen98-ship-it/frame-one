#!/usr/bin/env python3
"""True Android WebView progress and storyboard persistence test.

Uses ADB touch/text and UIAutomator accessibility nodes, never localStorage
injection. Verifies a completed quiz, Make Lab choices and an authored shot
note after force-stop and offline relaunch. Tested separately from Back.
"""
from __future__ import annotations
import importlib.util
import re
import sys
import time
import xml.etree.ElementTree as ET
from pathlib import Path

spec=importlib.util.spec_from_file_location(
    "frameone_android_ui",Path(__file__).with_name("android-emulator-smoke.py"))
assert spec is not None and spec.loader is not None
ui=importlib.util.module_from_spec(spec)
spec.loader.exec_module(ui)

SHOT_NOTE="FrameOneNativeShotQA20261027"
BUTTON_CLASSES=("Button","ToggleButton","CheckBox")
TOP=145
BOTTOM=2125

def nodes():
    ui.hierarchy()
    return list(ET.fromstring(ui.LAST_XML).iter("node"))

def bounds_of(node):
    b=node.attrib.get("bounds","")
    match=re.fullmatch(r"\[(\d+),(\d+)\]\[(\d+),(\d+)\]",b)
    return tuple(map(int,match.groups())) if match else None

def scroll_up():
    ui.adb("shell","input","swipe","540","1950","540","650","310")
    time.sleep(0.35)

def scroll_top():
    for _ in range(6):
        ui.adb("shell","input","swipe","540","660","540","1920","250")
    time.sleep(.5)

def control(label,exact=True,tries=19):
    """Find only real clickable controls *in the content viewport*.

    Exclude WebView root, offscreen virtual nodes and fixed bottom navigation;
    trying to tap those produces misleading test passes.
    """
    for attempt in range(tries):
        choices=[]
        for n in nodes():
            kind=n.attrib.get("class","").split(".")[-1]
            if kind not in BUTTON_CLASSES or n.attrib.get("enabled","true")=="false":
                continue
            value=" ".join((n.attrib.get("text",""),n.attrib.get("content-desc",""))).strip()
            if not (value==label if exact else label.lower() in value.lower()):
                continue
            b=bounds_of(n)
            if b and b[1]>=TOP and b[3]<=BOTTOM and (b[2]-b[0])>20 and (b[3]-b[1])>20:
                choices.append((n,b,value))
        if choices:
            n,b,value=choices[0]
            print(f"TAP CONTROL {value!r} at {(b[0]+b[2])//2},{(b[1]+b[3])//2}",flush=True)
            ui.adb("shell","input","tap",str((b[0]+b[2])//2),str((b[1]+b[3])//2))
            time.sleep(.7)
            return
        scroll_up()
    ui.capture("state-missing-"+re.sub(r"[^a-z0-9]+","-",label.lower())[:32])
    raise AssertionError(f"Cannot find enabled visible Android control {label!r}")

def checked(label):
    """Read a selected ToggleButton, not merely a matching text label."""
    for n in nodes():
        if n.attrib.get("class","").endswith("ToggleButton"):
            value=" ".join((n.attrib.get("text",""),n.attrib.get("content-desc",""))).strip()
            if value==label:
                return n.attrib.get("checked")=="true"
    return False

def assert_close_framing():
    # UIAutomator splits JSX HUD "STORYBOARD · SHOT 01 · CLOSE"
    # into separate TextView nodes. Require the exact current shot tag,
    # not a substring matching the "Close-up" choice button.
    for n in nodes():
        if n.attrib.get("class","").endswith("TextView") and n.attrib.get("text","").strip()=="CLOSE":
            return
    ui.capture("state-hud-not-close")
    raise AssertionError("Make Lab storyboard did not persist first-shot CLOSE framing")

def editor():
    for attempt in range(13):
        for n in nodes():
            cls=n.attrib.get("class","")
            b=bounds_of(n)
            if b and ("EditText" in cls or n.attrib.get("editable")=="true"):
                if b[1]>=TOP and b[3]<=BOTTOM and b[2]-b[0]>=100 and b[3]-b[1]>=35:
                    return b
        scroll_up()
    ui.capture("state-editor-not-visible")
    raise AssertionError("Storyboard shot editor inaccessible")

def find_text(label,tries=10,scroll=False):
    for _ in range(tries):
        if any(label.lower() in " ".join((n.attrib.get("text",""),n.attrib.get("content-desc",""))).lower()
               for n in nodes()):
            return
        if scroll: scroll_up()
        else: time.sleep(.8)
    ui.capture("state-text-missing-"+re.sub(r"[^a-z0-9]+","-",label.lower())[:35])
    raise AssertionError(f"Expected actual Android WebView text not found: {label!r}")

def launch():
    ui.adb("shell","monkey","-p",ui.PACKAGE,"-c","android.intent.category.LAUNCHER","1",timeout=40)
    ui.find("WELCOME TO THE WORLD OF CINEMA",tries=20)

def complete_first_lesson():
    ui.tap_label("Learn")
    find_text("YOUR LEARNING JOURNEY")
    control("Continue learning",exact=False)
    find_text("Why do we watch films?")
    control("B. Shape how we experience a story")
    find_text("Exactly.",scroll=True)
    control("Mark lesson complete",exact=False)
    find_text("1/33 lessons")
    print("PASS: first lesson completed by answering its real quiz in Android",flush=True)
    ui.capture("state-01-completed-lesson")

def make_storyboard():
    # Bottom nav is not content; explicitly use its exact accessibility label.
    ui.tap_label("Lab")
    find_text("One moment. Many frames.")
    control("✎ Make")
    find_text("Plan a tiny scene.")
    control("Decision")
    # Android WebView exposes these as ToggleButton nodes but can leave
    # checked=false despite aria-pressed. Assert rendered story semantics
    # and storyboard HUD instead of the incorrect accessibility boolean.
    find_text("Will the person stay or leave?",scroll=True)
    control("Close-up")
    assert_close_framing()
    b=editor()
    ui.adb("shell","input","tap",str((b[0]+b[2])//2),str((b[1]+b[3])//2))
    ui.adb("shell","input","text",SHOT_NOTE)
    find_text(SHOT_NOTE)
    control("Save scene")
    find_text("Saved in this browser.",tries=6)
    ui.capture("state-02-storyboard-saved")
    print("PASS: native Make Lab saved Decision/Close-up and authored first shot note",flush=True)

def restart_offline():
    ui.adb("shell","am","force-stop",ui.PACKAGE)
    ui.adb("shell","cmd","connectivity","airplane-mode","enable")
    ui.adb("shell","svc","wifi","disable")
    assert ui.adb("shell","settings","get","global","airplane_mode_on")=="1"
    launch()
    ui.capture("state-03-offline-restart")
    print("PASS: app cold-launched with Android airplane mode enabled",flush=True)

def verify_after_restart():
    find_text("1/33 lessons")
    ui.tap_label("Learn")
    find_text("1 of 33 lessons finished")
    print("PASS: completed first lesson still counts after offline force-stop",flush=True)
    ui.tap_label("Lab")
    find_text("One moment. Many frames.")
    control("✎ Make")
    find_text("Will the person stay or leave?",scroll=True)
    assert_close_framing()
    find_text(SHOT_NOTE,scroll=True)
    ui.capture("state-04-progress-story-after-restart")
    print("PASS: story question, framing and written first shot persisted offline",flush=True)

def main():
    if not ui.APK.is_file():raise FileNotFoundError(ui.APK)
    ui.adb("install","-r","-t",str(ui.APK),timeout=90)
    # v0.9K ran before us and may have left the first lesson visible.
    # Force-stop here so this test starts at the normal cold-launch Home.
    ui.adb("shell","am","force-stop",ui.PACKAGE)
    launch()
    complete_first_lesson()
    make_storyboard()
    restart_offline()
    verify_after_restart()
    ui.adb("shell","cmd","connectivity","airplane-mode","disable")
    ui.adb("shell","svc","wifi","enable")
    print("FRAME ONE ANDROID LEARNING STORYBOARD RESTART: PASS",flush=True)

if __name__=="__main__":
    try:main()
    except Exception as exc:
        print(f"FRAME ONE ANDROID LEARNING STORYBOARD RESTART: FAIL: {exc}",file=sys.stderr,flush=True)
        try:ui.capture("state-failure")
        except Exception as other:print(f"No screenshot: {other}",file=sys.stderr,flush=True)
        sys.exit(1)
