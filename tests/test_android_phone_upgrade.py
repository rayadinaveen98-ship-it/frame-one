#!/usr/bin/env python3
"""No-phone regression checks for the conservative Frame One physical QA CLI."""
from __future__ import annotations

import argparse
import importlib.util
from pathlib import Path
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
PATH = ROOT / "scripts/android-phone-upgrade-qa.py"
spec = importlib.util.spec_from_file_location("frameone_phone_upgrade", PATH)
assert spec and spec.loader
qa = importlib.util.module_from_spec(spec)
spec.loader.exec_module(qa)

OLD, NEW = 100101, 100102


def options(phase: str, **kwargs):
    values = dict(
        phase=phase, old_dir=Path("qa/upgrade/old"), new_dir=Path("qa/upgrade/new"),
        aapt="aapt", apksigner="apksigner", adb="adb", serial=None,
        approve_install=False, confirm_empty_test_profile=False,
        backup_verified=False, learning_data_created=False,
    )
    values.update(kwargs)
    return argparse.Namespace(**values)


class PhoneUpgradeTests(unittest.TestCase):
    def setUp(self):
        patcher = patch.object(qa, "verify_signed_pair", return_value=(OLD, NEW))
        patcher.start()
        self.addCleanup(patcher.stop)
        self.commands: list[list[str]] = []
        self.present = False
        self.current = OLD
        self.emulator = False
        self.devices = "List of devices attached\nZX123 device product:test model:Android_Phone\n"
        self.fail_update = False
        runner = patch.object(qa, "run", side_effect=self.fake_adb)
        runner.start()
        self.addCleanup(runner.stop)

    def fake_adb(self, command):
        self.commands.append(command)
        if command == ["adb", "devices", "-l"]:
            return self.devices
        if command[-4:] == ["shell", "getprop", "ro.kernel.qemu"]:
            return "1" if self.emulator else "0"
        if command[-4:] == ["shell", "pm", "path", qa.APP_ID]:
            return "package:/data/app/test/base.apk" if self.present else ""
        if command[-4:] == ["shell", "dumpsys", "package", qa.APP_ID]:
            return f"Packages:\n  Package [{qa.APP_ID}]\n    versionCode={self.current} minSdk=24"
        if "install" in command:
            if self.fail_update:
                raise RuntimeError("INSTALL_FAILED_UPDATE_INCOMPATIBLE")
            self.present = True
            self.current = NEW if "-r" in command else OLD
            return "Success"
        raise AssertionError(f"Unexpected adb command: {command}")

    def install_commands(self):
        return [c for c in self.commands if "install" in c or "uninstall" in c or "clear" in c]

    def test_read_only_preflight_does_not_connect_phone(self):
        message = qa.execute(options("preflight"))
        self.assertIn("NO PHONE TESTED; NO APK INSTALLED", message)
        self.assertEqual(self.commands, [])

    def test_no_install_without_explicit_approval(self):
        with self.assertRaisesRegex(ValueError, "approve-install"):
            qa.execute(options("install-old", confirm_empty_test_profile=True))
        self.assertEqual(self.commands, [])

    def test_no_first_install_without_empty_profile_ack(self):
        with self.assertRaisesRegex(ValueError, "empty-test-profile"):
            qa.execute(options("install-old", approve_install=True))
        self.assertEqual(self.commands, [])

    def test_existing_phone_install_refused(self):
        self.present = True
        with self.assertRaisesRegex(RuntimeError, "already installed"):
            qa.execute(options("install-old", approve_install=True, confirm_empty_test_profile=True))
        self.assertEqual(self.install_commands(), [])

    def test_fresh_install_never_replaces(self):
        message = qa.execute(options("install-old", approve_install=True,
                                     confirm_empty_test_profile=True))
        self.assertIn("older test APK", message)
        self.assertEqual(len(self.install_commands()), 1)
        self.assertEqual(self.install_commands()[0][3:5], ["install", "-t"])
        self.assertNotIn("-r", self.install_commands()[0])

    def test_upgrade_requires_backup_and_created_progress(self):
        self.present = True
        for backup, progress in [(False, False), (True, False), (False, True)]:
            with self.subTest(backup=backup, progress=progress):
                with self.assertRaisesRegex(ValueError, "backup-verified"):
                    qa.execute(options("upgrade-new", approve_install=True,
                                       backup_verified=backup, learning_data_created=progress))
        self.assertEqual(self.commands, [])

    def test_unexpected_installed_version_refuses_replacement(self):
        self.present = True
        self.current = NEW
        with self.assertRaisesRegex(RuntimeError, "differs from expected older"):
            qa.execute(options("upgrade-new", approve_install=True, backup_verified=True,
                               learning_data_created=True))
        self.assertEqual(self.install_commands(), [])

    def test_safe_upgrade_uses_only_adb_install_replace(self):
        self.present = True
        message = qa.execute(options("upgrade-new", approve_install=True, backup_verified=True,
                                     learning_data_created=True))
        self.assertIn("Learning-data retention is NOT yet verified", message)
        installs = self.install_commands()
        self.assertEqual(len(installs), 1)
        self.assertEqual(installs[0][3:6], ["install", "-r", "-t"])
        self.assertNotIn("uninstall", str(self.commands))
        self.assertNotIn("pm clear", str(self.commands))
        self.assertEqual(self.current, NEW)

    def test_android_rejects_incompatible_signer(self):
        self.present = True
        self.fail_update = True
        with self.assertRaisesRegex(RuntimeError, "INSTALL_FAILED_UPDATE_INCOMPATIBLE"):
            qa.execute(options("upgrade-new", approve_install=True, backup_verified=True,
                               learning_data_created=True))
        self.assertEqual(self.current, OLD)

    def test_verify_new_only_checks_package_code(self):
        self.present = True
        self.current = NEW
        message = qa.execute(options("verify-new"))
        self.assertIn("NOT lesson/notes/storyboard retention", message)
        self.assertEqual(self.install_commands(), [])

    def test_emulator_is_not_physical_phone(self):
        self.emulator = True
        with self.assertRaisesRegex(RuntimeError, "emulator"):
            qa.execute(options("verify-new"))
        self.assertEqual(self.install_commands(), [])

    def test_multiple_devices_fail_closed(self):
        self.devices += "ABC456 device\n"
        with self.assertRaisesRegex(RuntimeError, "exactly one"):
            qa.execute(options("verify-new"))
        self.assertEqual(self.install_commands(), [])

    def test_explicit_serial_rejects_unauthorized(self):
        with self.assertRaisesRegex(RuntimeError, "offline or unauthorized"):
            qa.execute(options("verify-new", serial="UNKNOWN"))
        self.assertEqual(self.install_commands(), [])

    def test_absent_package_cannot_upgrade(self):
        with self.assertRaisesRegex(RuntimeError, "not installed"):
            qa.execute(options("upgrade-new", approve_install=True, backup_verified=True,
                               learning_data_created=True))
        self.assertEqual(self.install_commands(), [])


if __name__ == "__main__":
    unittest.main(verbosity=2)
