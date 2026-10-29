# Frame One v0.12A3 — Android same-signer upgrade continuity gate

## Goal

Verify on a real Android API 35 emulator that Frame One keeps local learning
data when an installed Android package is **updated in place** with a second
APK signed by the **same signing certificate** and a higher Android versionCode.

The existing release publisher guards against accidental long-lived signer
rotation; this is a separate app/data-retention test.

## Test design

1. GitHub Actions compiles the exact checked-out Frame One source, including
   its offline assets.
2. It generates a one-time, disposable QA debug keystore inside the CI job,
   never prints, uploads or commits it, and never signs a public-release APK.
3. Capacitor builds the same source with generated Android versionCode 1 and
   then 2. The test fails if the expected Gradle template has changed.
4. The gate checks both APKs for the Frame One application ID, correct
   versionCodes, bundled offline assets and identical signing certificates.
5. A real Android emulator installs v1. Using Android UI controls (not
   direct WebView localStorage injection), QA completes the first lesson,
   saves a storyboard decision, Close-up framing and authored shot note.
   It verifies persistence after a force-stop and offline relaunch.
6. The emulator installs v2 *over* v1 using adb install -r -t. There is **no
   uninstall or data clearing** between builds. It requires versionCode 2,
   then verifies the same lesson progress, storyboard and note.
7. QA verifies retention again after a v2 offline cold restart, and uploads
   screenshots / accessibility hierarchy evidence only, never the APKs or key.

Implementation: .github/workflows/android-upgrade-qa.yml and
scripts/android-emulator-upgrade.py.

## What a pass proves — and does not prove

**Proves:** This source build and its next versionCode can use the normal
Android same-certificate update path while preserving the exercised local
learning data in the emulator.

**Does not prove:** The public preview APK has a permanent signer; separate
GitHub Actions runs retain a signing identity; old app code upgrades correctly
to new app code; files can be exported/restored via the physical phone chooser;
or physical phone, audio, gesture and TalkBack behavior.

Complete docs/ANDROID_QA_SIGNING.md and docs/RELEASE_CHECKLIST.md before
claiming stable public APK updates. The CI keystore must never be published.

## Status

Implementation staged for exact-commit pull-request verification. Do not
mark this gate as passing until the actual workflow returns success.
