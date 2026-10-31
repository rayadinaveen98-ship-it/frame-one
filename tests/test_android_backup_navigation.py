#!/usr/bin/env python3
"""Source guard for the real Android backup/restore test's navigation contract.

Frame One v0.13A16 removed the Home backup teaser on purpose. The actual
backup export/import lives on Learn. Prevent a native QA false failure
caused by trying to tap an intentionally removed Home widget again.
"""
from __future__ import annotations

import ast
from pathlib import Path

SOURCE = Path(__file__).resolve().parents[1] / "scripts/android-emulator-backup.py"
tree = ast.parse(SOURCE.read_text(encoding="utf-8"), filename=str(SOURCE))
fn = next(n for n in tree.body if isinstance(n, ast.FunctionDef) and n.name == "main")
script = ast.get_source_segment(SOURCE.read_text(encoding="utf-8"), fn) or ""

assert 'ui.tap_label("Learn")' in script, "Backup QA must navigate to Learn."
assert "open_backup_panel()" in script, "Backup QA must open real Learn backup controls."
assert script.index('ui.tap_label("Learn")') < script.index("practice.open_first_lesson()"), (
    "Fresh-install UI backup route must be exercised before creating practice data."
)
assert 'state.find_text("YOUR WORK STAYS ON THIS DEVICE"' not in script, (
    "Home backup callout was intentionally removed in v0.13A16."
)
assert 'state.control("Back up"' not in script, (
    "Never tap the removed Home backup shortcut."
)
assert 'ui.capture("backup-00-clean-home")' in script, "Capture honest new Home evidence."
assert 'ui.capture("backup-00-learn-backup-controls")' in script, "Capture actual backup controls."
assert 'state.control("Save / share backup JSON"' in script, "Exercise actual Android Filesystem + Share flow."
assert "confirm_picker_restore()" in script, "Exercise real Android system file picker restore."
assert 'state.find_text("1/33 lessons"' in script, "Validate restored progress on screen."
assert 'state.assert_close_framing()' in script, "Validate restored original Make Lab storyboard."

assert "confirm_readonly_backup_inspection()" in script, (
    "Android must check the exported file without restoring it first."
)
assert script.index("confirm_readonly_backup_inspection()") < script.index("confirm_picker_restore()"), (
    "Non-destructive inspection must happen before the destructive restore."
)
assert 'state.find_text("0/33 lessons",tries=9)' in script.split("confirm_readonly_backup_inspection()",1)[1], (
    "Android must verify that inspection does not restore completed lessons."
)
assert "def choose_download_from_android_picker(evidence_name):" in SOURCE.read_text(encoding="utf-8"), (
    "Inspection and restore must reuse the same Android file selection."
)
assert "choose_download_from_android_picker(\"backup-03a-inspect-system-picker\")" in SOURCE.read_text(encoding="utf-8"), (
    "Read-only inspection must exercise actual Android DocumentsUI."
)

source_text=SOURCE.read_text(encoding="utf-8")
assert "def create_second_storyboard():" in source_text, (
    "v0.14 Android recovery must create an additional real film project."
)
assert script.index("create_second_storyboard()") < script.index("exported_private_json()"), (
    "Both storyboards must exist before the genuine native JSON export."
)
assert 'len(members)==2' in source_text, (
    "Native Filesystem export must preserve both independent storyboards."
)
assert 'state.find_text("2 film projects",tries=12,scroll=True)' in source_text, (
    "Read-only Android backup inspection must report two film projects."
)
assert 'tap_text("My first scene",tries=16,scroll=True)' in script, (
    "After restore, Android must re-open the original storyboard by actual UI."
)

print("PASS: native backup QA follows supported Home -> Learn route and checks two-project native backup recovery.")
