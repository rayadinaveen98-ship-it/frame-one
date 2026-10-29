#!/usr/bin/env python3
"""Pure local regression tests: independent APK receipt / manifest verification."""
from __future__ import annotations

import importlib.util
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import zipfile

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts/verify-android-cross-run-apks.py"
spec = importlib.util.spec_from_file_location("frameone_cross_run", SCRIPT)
assert spec and spec.loader
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

SIGNED = "Persistent QA signer: YES (managed by GitHub Secret)"
TEMPORARY = "Persistent QA signer: NO (temporary runner signer; not upgrade-safe)"
CERT_A = "a" * 64
CERT_B = "b" * 64


class IndependentUpgradeReceipts(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.old = self.root / "old"
        self.new = self.root / "new"
        self.old.mkdir()
        self.new.mkdir()
        self.write_pair()

    def write(self, folder: Path, cert: str, mode: str, version: str, html: str):
        (folder / "android-qa-signature.txt").write_text(
            f"Signer #1 certificate SHA-256 digest: {cert}\n{mode}\nAndroid versionCode: {version}\n",
            encoding="utf-8",
        )
        with zipfile.ZipFile(folder / "app-debug.apk", "w") as apk:
            apk.writestr("assets/public/index.html", html)

    def write_pair(self):
        self.write(self.old, CERT_A, SIGNED, "100101", "frame-one-old")
        self.write(self.new, CERT_A, SIGNED, "100102", "frame-one-new")

    @staticmethod
    def mock_tool(*command):
        if "old" in str(command[-1]):
            version = 100101
        else:
            version = 100102
        if "aapt" == command[0]:
            return f"package: name='com.frameone.learncinema' versionCode='{version}' versionName='1.0'\n"
        return f"Signer #1 certificate SHA-256 digest: {CERT_A}\n"

    def verify(self):
        with patch.object(module, "checked_output", side_effect=self.mock_tool):
            return module.verify_pair(self.old, self.new, "aapt", "apksigner")

    def test_good_independent_builds(self):
        self.assertEqual(self.verify(), (100101, 100102))

    def test_temporary_signer_blocked(self):
        self.write(self.new, CERT_A, TEMPORARY, "100102", "frame-one-new")
        with self.assertRaisesRegex(ValueError, "persistent"):
            self.verify()

    def test_mismatched_certificates_blocked(self):
        self.write(self.new, CERT_B, SIGNED, "100102", "frame-one-new")
        with self.assertRaisesRegex(ValueError, "different signing"):
            self.verify()

    def test_equal_version_blocked(self):
        self.write(self.new, CERT_A, SIGNED, "100101", "frame-one-new")
        with self.assertRaisesRegex(ValueError, "higher versionCode"):
            self.verify()

    def test_malformed_version_blocked(self):
        self.write(self.new, CERT_A, SIGNED, "bad", "frame-one-new")
        with self.assertRaisesRegex(ValueError, "Android versionCode"):
            self.verify()

    def test_duplicate_version_blocked(self):
        receipt = self.new / "android-qa-signature.txt"
        receipt.write_text(receipt.read_text() + "Android versionCode: 100103\n")
        with self.assertRaisesRegex(ValueError, "exactly one"):
            self.verify()

    def test_same_app_bundle_blocked(self):
        self.write(self.new, CERT_A, SIGNED, "100102", "frame-one-old")
        with self.assertRaisesRegex(ValueError, "identical web entrypoint"):
            self.verify()

    def test_actual_signer_mismatch_blocked(self):
        def altered(*command):
            if command[0] == "apksigner" and "new" in str(command[-1]):
                return f"Signer #1 certificate SHA-256 digest: {CERT_B}\n"
            return self.mock_tool(*command)
        with patch.object(module, "checked_output", side_effect=altered):
            with self.assertRaisesRegex(ValueError, "differs from trusted"):
                module.verify_pair(self.old, self.new, "aapt", "apksigner")

    def test_wrong_package_blocked(self):
        def altered(*command):
            if command[0] == "aapt" and "new" in str(command[-1]):
                return "package: name='com.example.bad' versionCode='100102'\n"
            return self.mock_tool(*command)
        with patch.object(module, "checked_output", side_effect=altered):
            with self.assertRaisesRegex(ValueError, "application ID"):
                module.verify_pair(self.old, self.new, "aapt", "apksigner")


if __name__ == "__main__":
    unittest.main(verbosity=2)
