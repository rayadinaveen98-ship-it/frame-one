#!/usr/bin/env python3
"""Frame One real Android native backup: exported bytes -> cleared app -> SAF restore.

Uses real Android WebView button taps, official Filesystem/Share plugins, and
Android file-picker UI. ADB only copies the *app-exported* synthetic JSON to
Downloads to simulate the user's externally saved file, then clears app data.
No localStorage injection, no fabricated backup JSON and no private uploads.
"""
from __future__ import annotations

import importlib.util
import json
import re
import subprocess
import sys
import tempfile
import time
from pathlib import Path

p=Path(__file__).with_name("android-emulator-learning-state.py")
spec=importlib.util.spec_from_file_location("frameone_state_ui",p)
assert spec and spec.loader
state=importlib.util.module_from_spec(spec)
spec.loader.exec_module(state)
ui=state.ui
FILE_NAME="frame-one-learning-backup.json"

def tap_text(label,tries=24,scroll=True,exact=False):
    """Choose smallest visible matching text/control, never the whole WebView root."""
    for _ in range(tries):
        candidates=[]
        for n in state.nodes():
            value=" ".join((n.attrib.get("text",""),n.attrib.get("content-desc",""))).strip()
            matched=(value==label if exact else label.lower() in value.lower())
            b=state.bounds_of(n)
            if not matched or not b or b[2]-b[0]<25 or b[3]-b[1]<18:
                continue
            if b[1]<100 or b[1]>2180 or b[3]>2190:
                continue
            kind=n.attrib.get("class","").split(".")[-1]
            if kind not in ("TextView","Button","ToggleButton","View","CheckBox"):
                continue
            area=(b[2]-b[0])*(b[3]-b[1])
            candidates.append((area,b,value))
        if candidates:
            _,b,value=min(candidates,key=lambda z:z[0])
            print(f"TAP ANDROID {value!r} at {(b[0]+b[2])//2},{(b[1]+b[3])//2}",flush=True)
            ui.adb("shell","input","tap",str((b[0]+b[2])//2),str((b[1]+b[3])//2))
            time.sleep(.8)
            return
        if not scroll:time.sleep(.7)
        else: state.scroll_up()
    ui.capture("backup-cannot-tap-"+re.sub(r"[^a-z0-9]+","-",label.lower())[:24])
    raise AssertionError(f"No accessible Android target: {label!r}")

def screen_contains(token):
    return any(token.lower() in " ".join((n.attrib.get("text",""),n.attrib.get("content-desc",""))).lower()
               for n in state.nodes())

def open_backup_panel():
    state.find_text("YOUR LEARNING JOURNEY")
    tap_text("Keep a copy of your learning",tries=30,scroll=True)
    state.find_text("Save / share backup JSON",tries=10,scroll=True)

def exported_private_json():
    # Read actual file just written by Capacitor Filesystem on Android.
    command=["adb","exec-out","run-as",ui.PACKAGE,
             "cat","cache/"+FILE_NAME]
    p=subprocess.run(command,capture_output=True,timeout=35)
    if p.returncode or not p.stdout:
        ui.capture("backup-native-file-missing")
        raise AssertionError("Native share did not create a readable cache JSON backup")
    payload=json.loads(p.stdout.decode("utf-8"))
    assert payload["format"]=="frameone-learning-backup" and payload["version"]==1
    assert "why" in payload["completed"],"Export lost completed first lesson"
    assert payload["notes"].get("why")=="FrameOneNativeNoteQA20261027","Export lost original practice note"
    scene=payload["scene"]
    assert scene["question"]=="decision" and scene["shots"][0]=="close","Export lost real Make Lab choices"
    assert scene["notes"][0]=="FrameOneNativeShotQA20261027","Export lost authored first shot"
    print("PASS: native Filesystem wrote exact learner practice/progress/storyboard backup bytes",flush=True)
    return p.stdout

def export_to_external_download(raw:bytes):
    # On a real phone the user must select a share destination. In CI this is
    # a literal copy of the app-exported bytes into public Downloads, NOT a
    # hand-crafted backup or in-app storage manipulation.
    with tempfile.TemporaryDirectory() as folder:
        local=Path(folder)/FILE_NAME
        local.write_bytes(raw)
        p=subprocess.run(["adb","push",str(local),"/sdcard/Download/"+FILE_NAME],
                         capture_output=True,text=True,timeout=35)
        if p.returncode:raise RuntimeError("ADB could not simulate external backup save: "+p.stderr[-400:])
    print("PASS: actual app-exported JSON preserved outside Frame One app data",flush=True)

def confirm_picker_restore():
    # Select from Android's system document picker, not JS injection.
    tap_text("Restore a backup JSON file",tries=10,scroll=True)
    time.sleep(1.5)
    ui.capture("backup-03-system-picker")
    if screen_contains(FILE_NAME):
        tap_text(FILE_NAME,tries=6,scroll=False)
    else:
        # Android DocumentsUI commonly opens Recents. Navigate to Downloads.
        if screen_contains("Downloads"):
            tap_text("Downloads",tries=6,scroll=False)
        else:
            # Hamburger icon / navigation drawer for SAF providers.
            ui.adb("shell","input","tap","65","140")
            time.sleep(.8)
            tap_text("Downloads",tries=8,scroll=False)
        tap_text(FILE_NAME,tries=9,scroll=False)
    time.sleep(1.5)
    # Browser JavaScript confirm is represented by an Android native WebView
    # dialog; explicitly accept destructive restore only in disposable CI.
    ui.capture("backup-04-restore-confirm")
    if screen_contains("Restore this backup?"):
        for label in ("OK","Restore","Yes"):
            if screen_contains(label):
                tap_text(label,tries=4,scroll=False,exact=True)
                break
        else:
            raise AssertionError("Android restore confirmation has no safe approve button")
    state.find_text("Learning backup restored in this browser.",tries=12)
    print("PASS: Android system file picker imported backup after user confirmation",flush=True)

def main():
    assert ui.APK.is_file()
    # v0.9L already authored the completed lesson and full story on emulator.
    ui.adb("shell","am","force-stop",ui.PACKAGE)
    state.launch()
    ui.tap_label("Learn")
    open_backup_panel()
    state.control("Save / share backup JSON",tries=10)
    time.sleep(1.5)
    ui.capture("backup-01-native-share")
    raw=exported_private_json()
    export_to_external_download(raw)
    # Dismiss Android sharesheet if displayed.
    ui.adb("shell","input","keyevent","KEYCODE_BACK")
    time.sleep(1)
    ui.adb("shell","am","force-stop",ui.PACKAGE)
    ui.adb("shell","pm","clear",ui.PACKAGE)
    print("Android app-private storage cleared; external Downloads JSON retained",flush=True)
    state.launch()
    state.find_text("0/33 lessons")
    ui.tap_label("Learn")
    open_backup_panel()
    confirm_picker_restore()
    state.find_text("1 of 33 lessons finished",tries=9)
    ui.tap_label("Lab")
    state.find_text("One moment. Many frames.")
    state.control("✎ Make")
    state.find_text("Will the person stay or leave?",scroll=True)
    state.assert_close_framing()
    state.find_text("FrameOneNativeShotQA20261027",scroll=True)
    ui.capture("backup-05-recovered-lesson-story")
    print("PASS: exported JSON restored completed lesson and Make Lab story after total app data clear",flush=True)
    print("FRAME ONE ANDROID BACKUP EXPORT RESTORE: PASS",flush=True)

if __name__=="__main__":
    try:main()
    except Exception as exc:
        print(f"FRAME ONE ANDROID BACKUP EXPORT RESTORE: FAIL: {exc}",file=sys.stderr,flush=True)
        try:ui.capture("backup-failure")
        except Exception as other:print(f"No screenshot: {other}",file=sys.stderr)
        sys.exit(1)
