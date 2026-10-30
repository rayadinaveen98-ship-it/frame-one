# Frame One v0.13A4 — explicit Android preview publication gate

## Purpose

Provisioning a long-lived Android QA debug signing key must **not** automatically
replace the public APK. The previous `workflow_run` publisher would attempt a
public release whenever the Android build succeeded. v0.13A4 makes the
publication workflow **manual only** and requires both automated evidence and
human real-phone signoff, before existing signing/version/provenance checks.

## New safety contract

1. The Android build remains automatic/testable. Signing secrets, when
   privately provisioned, are used only in the build job; no signing secret
   enters a public publisher, receipt or artifact.
2. The independent Android APK upgrade workflow only uploads a small
   `frame-one-cross-run-upgrade-proof` JSON **after** the emulator has
   successfully installed separately built old/new APKs, upgraded in place,
   and checked retained learning progress, notes and storyboard data.
   The JSON stores only successful old/new build run IDs and verified
   Android versionCodes, never APKs, backups, passwords or certificates.
3. The publisher must be explicitly dispatched on the `main` branch with:
   - `source_run_id`: the exact new Android build to publish;
   - `verified_upgrade_run_id`: successful independent-upgrade QA workflow;
   - three deliberate true confirmations: actual physical-phone test,
     verified external JSON backup/restore and human approval to replace the
     public preview.
4. The publisher checks the QA workflow's actual status, repository, branch,
   trigger and workflow name; downloads its proof and requires the **new run
   ID to equal the publishing candidate**. Invalid/duplicate JSON fields,
   fake success, missing old run, mismatched run, equal/decreasing/malformed
   versionCodes and stale proof artifacts fail closed.
5. The existing source ancestry, APK checksum generation, certificate
   continuity, Android versionCode and same-public-URL checks still run
   before publication. Nothing relaxes these protections.

## First-time stable signing and acceptance procedure

- Generate and securely back up the dedicated QA debug keystore **outside**
  source control, as described in [ANDROID_QA_SIGNING.md](ANDROID_QA_SIGNING.md).
  Put the base64 form only into the repository's GitHub Actions secret
  `FRAMEONE_QA_DEBUG_KEYSTORE_B64`. **Never paste the key into chat.**
- Produce two independent successful main-branch Android debug workflow runs
  built from **different descendant source commits** and the same persistent
  signing identity. The second must have a larger APK versionCode and a
  different bundled entrypoint. Do not confuse repeating the same commit's
  build with a real cross-source upgrade.
- In GitHub Actions manually run **Frame One independent Android APK upgrade
  acceptance** with old/new build run IDs. Both APKs and their public receipts
  are checked; the emulator must finish green and a proof artifact must exist.
- On a real Android phone, install the first permanent-key QA APK, complete
  a quiz, save a note and a Make Lab storyboard, then install the second
  permanent-key QA APK **over it** without uninstalling. Confirm progress,
  notes, storyboard, Back navigation, offline reopening and sound output.
  Export a learning JSON, verify it outside the app, and restore it into a
  separate test install/profile. Also check small-screen layout and TalkBack.
- Only afterwards, manually dispatch **Publish downloadable Frame One Android
  preview** on main with the new build run ID, QA run ID and all three true
  confirmations. A green deployment is still only a QA preview, not a Play
  Store release.

**One-time migration warning:** the existing public v0.12A2 APK was signed
with a *different temporary key*. It cannot be updated in place by the first
persistent-key APK. Users must independently export and verify backups,
uninstall only after they have a recovery copy, then restore after installing
the new preview. This is not solved by emulator tests.

## Scope and pending evidence

This milestone implements release gates, regression checks and operational
instructions only. It **does not** create or upload a keystore, run two
persistent-key builds, verify a physical Android device, publish a new APK
or change the live Cloudflare project.

Before merging, require green full GitHub web QA including
`tests/test_android_release_approval.py`. An actual successful independent
two-build upgrade and physical-phone test remain release prerequisites,
not claims of v0.13A4 implementation.
