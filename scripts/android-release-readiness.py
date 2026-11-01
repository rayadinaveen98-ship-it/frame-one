#!/usr/bin/env python3
"""Read-only Android QA candidate report. Never publishes an APK or reads keys.

Inputs are GitHub's public run/release metadata and an Android build's public
certificate receipt. A pass here is NOT release approval: independent
cross-build upgrades and a real phone need separate evidence.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

CERT = re.compile(r"(?m)^Signer #1 certificate SHA-256 digest: ([a-fA-F0-9]{64})\s*$")
VERSION = re.compile(r"(?m)^Android versionCode: ([1-9][0-9]*)\s*$")
PERSISTENT = re.compile(
    r"(?m)^Persistent QA signer: "
    r"(YES \(managed by GitHub Secret\)|NO \(temporary runner signer; not upgrade-safe\))\s*$"
)
SHA = re.compile(r"[0-9a-f]{40}\Z")
RUN_ID = re.compile(r"[1-9][0-9]*\Z")
REPO = "rayadinaveen98-ship-it/frame-one"
RUN_NAME = "Frame One Android debug APK"


def unique(pattern: re.Pattern[str], source: str, label: str) -> str:
    found = pattern.findall(source)
    if len(found) != 1:
        raise ValueError(f"Expected exactly one valid {label} in public signing receipt")
    return found[0]


def report(run: object, receipt: str, release: object | None) -> str:
    if not isinstance(run, dict):
        raise ValueError("Missing source-run metadata")
    run_id = str(run.get("id", ""))
    sha = run.get("head_sha")
    if not RUN_ID.fullmatch(run_id) or not isinstance(sha, str) or not SHA.fullmatch(sha):
        raise ValueError("Invalid build identifier or source SHA")
    if run.get("name") != RUN_NAME or run.get("head_branch") != "main":
        raise ValueError("Only the main-branch Android debug workflow is eligible")
    if run.get("event") not in ("push", "workflow_dispatch"):
        raise ValueError("Source build is not a trusted main-branch event")
    if run.get("status") != "completed" or run.get("conclusion") != "success":
        raise ValueError("Android source build did not complete successfully")
    source_repo = run.get("repository")
    if not isinstance(source_repo, dict) or source_repo.get("full_name") != REPO:
        raise ValueError("Build belongs to a different repository")
    cert = unique(CERT, receipt, "certificate fingerprint").lower()
    version = int(unique(VERSION, receipt, "versionCode"))
    if not 100_000 < version <= 2_100_000_000:
        raise ValueError("Android versionCode is outside the expected QA range")
    signer = unique(PERSISTENT, receipt, "signer type")
    persistent = signer.startswith("YES ")

    old_sha = None
    if release is not None:
        if not isinstance(release, dict) or release.get("tag_name") != "android-preview-latest":
            raise ValueError("Public preview metadata does not identify the expected release")
        value = release.get("target_commitish")
        if not isinstance(value, str) or not SHA.fullmatch(value):
            raise ValueError("Public preview source SHA is invalid")
        old_sha = value

    build_url = f"https://github.com/{REPO}/actions/runs/{run_id}"
    pub_url = f"https://github.com/{REPO}/releases/tag/android-preview-latest"
    sign_state = "**CONFIRMED persistent QA certificate**" if persistent else "**BLOCKED — temporary Android debug signer**"
    latest_state = (
        "No existing public-preview metadata was supplied."
        if old_sha is None
        else (
            f"Existing public preview points to {old_sha}"
            + (" (same source commit)." if old_sha == sha else " (different source commit; not this candidate).")
        )
    )
    lines = [
        "# Frame One — Android build and release readiness",
        "",
        f"**Candidate:** [main build #{run_id}]({build_url}) · source {sha}",
        f"**Android versionCode:** {version}",
        f"**Public certificate SHA-256:** {cert}",
        f"**Signing:** {sign_state}",
        f"**Public preview:** [android-preview-latest]({pub_url}). {latest_state}",
        "",
        "## What is actually verified",
        "",
        "- [x] This exact candidate's main-branch Android debug build completed successfully.",
        (
            "- [x] Its public receipt confirms a persistent QA signing identity."
            if persistent
            else "- [ ] Persistent QA signer: **not configured for this build**. A temporary signer cannot establish cross-build upgrade compatibility."
        ),
        "- [ ] **Independent cross-run upgrade proof:** not supplied or validated by this report.",
        "- [ ] **Physical Android device and external-backup restore:** not supplied or validated by this report.",
        "- [ ] **Product-owner approval to replace the public preview:** not supplied or validated by this report.",
        "",
        "## Safe next action",
        "",
        (
            "Keep this candidate as a development artifact. Privately provision a dedicated QA debug keystore "
            "using the repository's Windows setup guide; protect the original in an encrypted backup. "
            "Never place the keystore or base64 in chat or Git."
            if not persistent
            else "Build a second, newer main APK with the exact same QA certificate, run the independent "
            "cross-run Android upgrade workflow, then verify a real-device external backup and in-place update."
        ),
        "",
        "**NOT PUBLIC-RELEASE APPROVED.** This report is read-only, does not prove a safe "
        "in-place update to the old public APK, and cannot issue, sign, or publish an APK.",
        "",
    ]
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--run-json", type=Path, required=True)
    parser.add_argument("--receipt", type=Path, required=True)
    parser.add_argument("--public-release-json", type=Path)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    try:
        for file in (args.run_json, args.receipt):
            if not file.is_file() or file.stat().st_size > 200_000:
                raise ValueError(f"Missing or oversized required file: {file.name}")
        run = json.loads(args.run_json.read_text(encoding="utf-8"))
        receipt = args.receipt.read_text(encoding="utf-8")
        public = None
        if args.public_release_json:
            path = args.public_release_json
            if not path.is_file() or path.stat().st_size > 200_000:
                raise ValueError("Missing or oversized public release metadata")
            public = json.loads(path.read_text(encoding="utf-8"))
        markdown = report(run, receipt, public)
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(markdown, encoding="utf-8")
        print(f"PASS: verified build receipt; produced read-only report at {args.output}")
        return 0
    except (OSError, UnicodeError, ValueError, TypeError) as exc:
        print(f"BLOCKED: {exc}")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
