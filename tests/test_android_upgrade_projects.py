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
    'open_real_project_row("My first scene")',
    'open_real_project_row(project_qa.SECOND_PROJECT)',
    'assert_current_project("My first scene")',
    'assert_current_project(project_qa.SECOND_PROJECT)',
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
assert 'def project_name_editor(' in backup and 'field=project_name_editor()' in backup, (
    "Android must fill the real labelled project title, not the first storyboard note textarea"
)
assert 'state.find_one_of_text(("2 of 20 local projects","2 / 20"),tries=12)' in backup, (
    "Android must verify a real two-project count in the new and historical Make Lab"
)
assert 'and "OPEN PROJECT" in value.upper()' in upgrade, (
    "Upgrade must target a real enabled project-switch button, not the duplicate header"
)
print("PASS: Android upgrade asserts the real two-project count and switch controls across install -r/offline restart without weakening v0.11 migration.")
