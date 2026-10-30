#!/usr/bin/env python3
"""Release approval gate regression and workflow contracts; requires no GitHub secrets."""
from __future__ import annotations

import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts/check-android-release-approval.py"
PUBLISHER = ROOT / ".github/workflows/publish-android-preview.yml"
UPGRADE_QA = ROOT / ".github/workflows/android-cross-run-upgrade-qa.yml"
GOOD = {
    "status": "passed",
    "old_run_id": "40800000001",
    "new_run_id": "40800000002",
    "old_version_code": 100001,
    "new_version_code": 100002,
}


class ApprovalGateTests(unittest.TestCase):
    def check(self, data: object, approved: bool, candidate: str = "40800000002") -> None:
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / "independent-upgrade.json"
            path.write_text(json.dumps(data), encoding="utf-8")
            p = subprocess.run(
                [sys.executable, str(SCRIPT), "--proof", str(path),
                 "--candidate-run-id", candidate],
                capture_output=True, text=True, check=False,
            )
            self.assertEqual(p.returncode == 0, approved, p.stdout + p.stderr)
            self.assertIn("PASS:" if approved else "BLOCKED:", p.stdout + p.stderr)

    def test_good(self):
        self.check(GOOD, True)

    def test_wrong_candidate(self):
        self.check(GOOD, False, candidate="40800000003")

    def test_same_run(self):
        self.check({**GOOD, "old_run_id": GOOD["new_run_id"]}, False)

    def test_not_passed(self):
        self.check({**GOOD, "status": "failed"}, False)

    def test_bad_run_id(self):
        self.check({**GOOD, "old_run_id": "0"}, False)
        self.check(GOOD, False, candidate="bad-number")

    def test_versions(self):
        for old, new in [(100001, 100001), (100003, 100002),
                         (1, 100002), (100001, 2100000001),
                         (True, 100002), (100001, False)]:
            with self.subTest(old=old, new=new):
                self.check({**GOOD, "old_version_code": old, "new_version_code": new}, False)

    def test_missing_or_unexpected_fields(self):
        data = dict(GOOD)
        data.pop("status")
        self.check(data, False)
        self.check({**GOOD, "untrusted": "yes"}, False)

    def test_duplicate_keys(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / "proof.json"
            path.write_text(json.dumps(GOOD)[:-1] + ',"status":"passed"}', encoding="utf-8")
            p = subprocess.run([sys.executable, str(SCRIPT), "--proof", str(path),
                                "--candidate-run-id", GOOD["new_run_id"]],
                               capture_output=True, text=True, check=False)
            self.assertNotEqual(p.returncode, 0)
            self.assertIn("Duplicate approval proof field", p.stderr)

    def test_workflow_fails_closed(self):
        pub = PUBLISHER.read_text(encoding="utf-8")
        qa = UPGRADE_QA.read_text(encoding="utf-8")
        self.assertIn("  workflow_dispatch:", pub)
        self.assertNotIn("  workflow_run:", pub, "Build success must never auto-publish")
        self.assertIn("test \"$GITHUB_REF\" = refs/heads/main", pub)
        for input_name in ("source_run_id", "verified_upgrade_run_id",
                           "physical_phone_verified", "backup_restore_verified",
                           "release_approved"):
            self.assertIn("      " + input_name + ":", pub)
        for name in ("PHONE_VERIFIED", "BACKUP_VERIFIED", "RELEASE_APPROVED"):
            self.assertIn('"$' + name + '"', pub)
        self.assertIn("gh run download \"$UPGRADE_QA_RUN_ID\"", pub)
        self.assertIn("--candidate-run-id \"$SOURCE_RUN_ID\"", pub)
        self.assertIn("test \"$(jq -r .conclusion <<< \"$qa_metadata\")\" = success", pub)
        self.assertLess(qa.index("Verify local learning data survives an in-place Android update"),
                        qa.index("Record passing cross-run upgrade proof"))
        self.assertIn("if: success()", qa)
        self.assertIn("frame-one-cross-run-upgrade-proof", qa)
        self.assertNotIn("FRAMEONE_QA_DEBUG_KEYSTORE_B64", pub,
                         "Publisher must never read the private QA signing key")


if __name__ == "__main__":
    unittest.main(verbosity=2)
