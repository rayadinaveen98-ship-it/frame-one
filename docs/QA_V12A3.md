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

## First emulator acceptance and artifact outage (29 October 2026)

The initial exact-head [Android workflow run 40812941078](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40812941078) completed all build, emulator and upgrade assertions **successfully**:
versionCode 1 to 2 with identical signer, no uninstall, real quiz completion,
Make storyboard/Close-up/note retention and a second offline restart.
The emulator printed `FRAME ONE ANDROID TWO-APK SAME-SIGNER UPGRADE: PASS`.

The run's overall result was **failure** solely because the *optional* GitHub
`actions/upload-artifact` call timed out five times contacting the artifact
service during `CreateArtifact`; six screenshot/XML evidence files existed.
This was not an application, Android, test-assertion or signing failure.
The workflow now treats screenshot artifact storage as best-effort and emits
a warning if upload fails. A missing upload is **not** evidence of visual review.

## Final v0.12A3 acceptance — merged 29 October 2026

[PR #27](https://github.com/rayadinaveen98-ship-it/frame-one/pull/27) merged to `main` as `b4494fa3f5566b4918b2aa1bf1b33ab0e61b24b4`.
Final exact-head CI on `a4257e68a372c7e808bff4a150efdf3a99826fa3` was **green**:

- [Android same-signer upgrade 40822702656](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40822702656): **SUCCESS**, including actual v1 → v2 package update, offline learning state retention, and successful screenshot evidence upload.
- [Web source/build checks 40822702573](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40822702573): **SUCCESS**.
- [Desktop/mobile browser checks 40822702564](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40822702564): **SUCCESS**.

This validates **same-code, same-signer versionCode upgrade on Android emulator**. It cannot guarantee different-version source migrations, a public-download upgrade, or physical-phone retention. The public APK is **still v0.12A2**, temporarily debug signed. Permanent cross-run QA signing and physical-device two-version testing remain release blockers.
