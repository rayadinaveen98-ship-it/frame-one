#!/usr/bin/env python3
"""Guard that v0.14 multi-project upgrade QA remains enabled only for current source."""
from pathlib import Path

root=Path(__file__).resolve().parents[1]
upgrade=(root/"scripts/android-emulator-upgrade.py").read_text(encoding="utf-8")
workflow=(root/".github/workflows/android-upgrade-qa.yml").read_text(encoding="utf-8")
old_source=(root/".github/workflows/android-cross-version-qa.yml").read_text(encoding="utf-8")
backup=(root/"scripts/android-emulator-backup.py").read_text(encoding="utf-8")
for marker in (
    'os.environ.get("FRAMEONE_UPGRADE_PROJECTS") != "1"',
    'project_qa.create_second_storyboard()',
    'verify_projects_after_upgrade(project_qa)',
    'state.assert_close_framing()',
    'state.find_text(state.SHOT_NOTE, scroll=True)',
    'project_qa.tap_text("My first scene", tries=16, scroll=True)',
    'project_qa.tap_text(project_qa.SECOND_PROJECT, tries=16, scroll=True)',
    'ui.capture("upgrade-03b-v2-two-storyboards-offline")',
):
    assert marker in upgrade, "Missing multi-project upgrade evidence: "+marker
assert upgrade.count("verify_projects_after_upgrade(project_qa)")>=3, (
    "Two-project verification must run both after upgrading and after offline cold start"
)
assert 'FRAMEONE_UPGRADE_PROJECTS=1 python3 scripts/android-emulator-upgrade.py' in workflow
assert 'tests/test_android_upgrade_projects.py' in workflow
assert 'scripts/android-emulator-backup.py' in workflow
assert 'FRAMEONE_UPGRADE_PROJECTS=1' not in old_source, (
    "Historical v0.11 Android baseline does not have projects and cannot opt into v0.14 acceptance"
)
assert 'def create_second_storyboard():' in backup
print("PASS: current-source Android upgrade test checks two real storyboards across install -r and offline restart, without changing the v0.11 migration gate.")
