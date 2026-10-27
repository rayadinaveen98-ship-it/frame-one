#!/usr/bin/env python3
"""Android API 35 real-WebView learning persistence and offline cold-start QA.

Installs fresh debug APK, creates real learner practice text through the native
accessibility hierarchy (no JavaScript injection), force-stops the Android app,
enables airplane mode, relaunches and verifies saved lesson text from the UI.

This is deliberately distinct from mocked localStorage/browser tests.
"""
from __future__ import annotations

import importlib.util
import re
import sys
import time
import xml.etree.ElementTree as ET
from pathlib import Path

spec = importlib.util.spec_from_file_location(
    "frameone_android_ui", Path(__file__).with_name("android-emulator-smoke.py"))
assert spec is not None and spec.loader is not None
ui = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ui)

NOTE = "FrameOneNativeNoteQA20261027"
LABEL = "My own filmmaking idea"

def editable_node():
    """Find Android's actual WebView textarea, not a page-sized WebView root."""
    for attempt in range(8):
        xml = ui.adb("shell","cat","/sdcard/frameone-qa.xml",check=False)
        # Refresh the UI hierarchy each time; hide no missing input failures.
        try:
            nodes = ui.hierarchy()
            tree = ET.fromstring(ui.LAST_XML)
            visible=[]
            for n in tree.iter("node"):
                kind=n.attrib.get("class","")
                bounds=n.attrib.get("bounds","")
                match=re.fullmatch(r"\[(\d+),(\d+)\]\[(\d+),(\d+)\]",bounds)
                if match and ("EditText" in kind or n.attrib.get("editable")=="true"):
                    x1,y1,x2,y2=map(int,match.groups())
                    if (x2-x1)>60 and (y2-y1)>24 and y1>=0 and y2>=0:
                        visible.append((x1,y1,x2,y2,n.attrib.get("text",""),kind))
            if visible:
                # Use lowest valid textarea; first lesson has one writable textarea.
                return max(visible,key=lambda x:x[1])
        except (ET.ParseError,ValueError): pass
        ui.adb("shell","input","swipe","540","1920","540","730","390")
        time.sleep(0.7)
    ui.capture("missing-visible-lesson-editor")
    raise AssertionError("No visible editable Android WebView lesson textarea after scrolling")

def open_first_lesson():
    ui.find("WELCOME TO THE WORLD OF CINEMA",tries=20)
    ui.tap_label("Learn")
    ui.find("YOUR LEARNING JOURNEY")
    # Lesson cards are offscreen in the full emulator. An accessibility
    # match to the card can be virtual and tapping it silently does nothing.
    # The visible Continue learning control reliably opens lesson one.
    ui.tap_label("Continue learning →")
    ui.find("My own filmmaking idea",tries=12)
    ui.find("Why do we watch films?")
    ui.capture("persistence-01-lesson-open")
    print("PASS: native lesson rendered for actual text input",flush=True)

def type_and_verify():
    bounds=editable_node()
    x1,y1,x2,y2,_,_=bounds
    ui.adb("shell","input","tap",str((x1+x2)//2),str((y1+y2)//2))
    ui.adb("shell","input","text",NOTE)
    # Let React onChange synchronously persist using frameone-practice-v07.
    ui.find(NOTE,tries=7)
    ui.capture("persistence-02-note-entered")
    print("PASS: real Android WebView received and displays typed private note",flush=True)

def restart_offline():
    ui.adb("shell","am","force-stop",ui.PACKAGE)
    ui.adb("shell","cmd","connectivity","airplane-mode","enable")
    ui.adb("shell","svc","wifi","disable")
    time.sleep(2)
    airplane=ui.adb("shell","settings","get","global","airplane_mode_on")
    if airplane != "1":
        raise AssertionError(f"Android airplane mode not enabled: {airplane!r}")
    (ui.OUTPUT/"persistence-network-state.txt").write_text(
        f"airplane_mode_on={airplane}\n",encoding="utf-8")
    # Use actual launcher intent so Android task state matches user launch.
    ui.adb("shell","monkey","-p",ui.PACKAGE,"-c",
           "android.intent.category.LAUNCHER","1",timeout=40)
    ui.find("WELCOME TO THE WORLD OF CINEMA",tries=20)
    ui.capture("persistence-03-offline-home")
    print("PASS: Frame One cold-started offline after Android force-stop",flush=True)

def verify_persisted_note():
    ui.tap_label("Learn")
    ui.find("YOUR LEARNING JOURNEY")
    ui.tap_label("Continue learning →")
    ui.find("My own filmmaking idea",tries=12)
    ui.find("Why do we watch films?")
    for _ in range(8):
        xml=ui.hierarchy()
        if any(NOTE in str(node["label"]) for node in xml):
            ui.capture("persistence-04-note-after-offline-restart")
            print("PASS: private learner note survived force-stop and offline cold restart",flush=True)
            return
        ui.adb("shell","input","swipe","540","1910","540","720","390")
        time.sleep(0.6)
    ui.capture("persistence-04-note-missing")
    raise AssertionError("Lesson note was lost after force-stop or not accessible offline")

def main():
    if not ui.APK.is_file(): raise FileNotFoundError(ui.APK)
    ui.adb("install","-r","-t",str(ui.APK),timeout=90)
    ui.adb("shell","monkey","-p",ui.PACKAGE,"-c",
           "android.intent.category.LAUNCHER","1",timeout=40)
    open_first_lesson()
    type_and_verify()
    restart_offline()
    verify_persisted_note()
    # Return network settings for the subsequent native Back regression.
    ui.adb("shell","cmd","connectivity","airplane-mode","disable")
    ui.adb("shell","svc","wifi","enable")
    print("FRAME ONE ANDROID PERSISTENCE OFFLINE: PASS",flush=True)

if __name__=="__main__":
    try: main()
    except Exception as exc:
        print(f"FRAME ONE ANDROID PERSISTENCE OFFLINE: FAIL: {exc}",file=sys.stderr,flush=True)
        try: ui.capture("persistence-failure")
        except Exception as extra: print(f"Screenshot unavailable: {extra}",file=sys.stderr)
        sys.exit(1)
