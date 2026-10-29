# Frame One Android — stable QA signing and safe upgrades

## Current status (29 October 2026)

The public `android-preview-latest` APK remains **v0.12A2** (source `7c5156467200443137f877aeb82fe31c7e196c05`) and its verified release receipt reports `Persistent QA signer: NO` (temporary runner signer). Public SHA-256 certificate fingerprint: `669aaccf68142c0db7b90b3ff1407a39db40c7131717dc5533a195214e278ea8`. The certificate **differs from the previous public preview**, so Android will reject an in-place update from that version. This 4,666,865-byte downloadable APK still has a disposable key, not a long-lived QA signer. See the [public GitHub release](https://github.com/rayadinaveen98-ship-it/frame-one/releases/tag/android-preview-latest).

**v0.12A3 development-only QA:** [PR #27](https://github.com/rayadinaveen98-ship-it/frame-one/pull/27) added and passed the [same-signer Android emulator v1 → v2 in-place upgrade and learning-data retention test](QA_V12A3.md) on 29 October 2026. This uses a **one-job throwaway key**, proves the app handles same-certificate package replacement in the tested scenario, and **does not** provision persistent signing or validate real upgrades between separately published app versions. It did not change the public APK.

**v0.12A4 historical-code migration QA:** [PR #28](https://github.com/rayadinaveen98-ship-it/frame-one/pull/28) added a [real historical v0.11A4 → current Android source migration acceptance test](QA_V12A4.md). Exact-head Android [run 40825869466](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40825869466) passed genuine UI-written progress, storyboard and notes surviving an in-place upgrade and subsequent offline relaunch. Both APKs were compiled independently from different commits, but **signed with a single throwaway key inside one job**. This still cannot guarantee upgrades between separate public CI releases or replace the private long-lived QA signing requirement. No new public APK was issued.

**v0.12A5 guarded publisher:** [PR #29](https://github.com/rayadinaveen98-ship-it/frame-one/pull/29) added generated increasing Android QA versionCodes, recorded the actual versionCode in build signing receipts and blocked replacement of the current public temporary-signed preview by another temporary-signed APK. On the first persistent-key transition, legacy v0.12A2 will require verified external backup, one-time reinstall and restore. Following that transition, public versions must retain the same certificate and strictly increase versionCode. The private GitHub Actions QA signing secret is **still not provisioned** by this change; the downloadable v0.12A2 APK remains unchanged. [Full v0.12A5 policy](QA_V12A5.md).

**Do not tell testers to install a later APK over an earlier debug APK.** Android only accepts package updates signed with a matching key. Changing key usually requires uninstalling the existing app, which can remove locally saved learner notes, progress and storyboards.

## The secure one-time provision (not yet performed)

The repository already supports the protected GitHub Actions secret `FRAMEONE_QA_DEBUG_KEYSTORE_B64`; it expects a base64-encoded Java/Android debug keystore at `~/.android/debug.keystore`, with alias `androiddebugkey` and conventional local debug passwords, as implemented in [android-debug.yml](../.github/workflows/android-debug.yml).

1. Privately generate a dedicated long-lived QA **debug** keystore on a trusted machine. Do not reuse an eventual Play Store production key. For example, locally using JDK `keytool`:
   ```bash
   keytool -genkeypair -v -keystore frameone-qa-debug.keystore -storetype JKS -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 3072 -validity 3650 -dname "CN=Frame One QA, OU=Android Test, O=Frame One, C=IN"
   ```
2. Store the original keystore in an encrypted private backup, with separately protected access to its passwords. A lost QA key cannot be recovered from Git history.
3. Base64-encode the keystore *locally*, without pasting or uploading it into a conversation or committing the file to the repository. Put the encoded result directly in the GitHub repository **Actions secret** `FRAMEONE_QA_DEBUG_KEYSTORE_B64` under Settings → Secrets and variables → Actions.
4. After provisioning, dispatch the Android debug build on `main` and verify that the run shows `Persistent QA signer: YES` and a recorded SHA-256 signing certificate. Confirm the public APK receipt references that build.
5. Export an independent learning backup from any app installed using an older **temporary** key before uninstalling it once. Install the first stable-key APK and restore the backup. From that point on, subsequent QA builds can update in-place *provided the permanent QA key never changes*.
6. Run a **two-version physical-device upgrade**: install build A, write a note, complete a lesson, save a storyboard, install build B signed with the same key without uninstalling, then confirm data and native Back. Also test restore, offline, Android document picker and an Android restart.

## Do not confuse signing modes

- This is only a QA **debug** identity, not the production Play Store app signing plan.
- The Android package name `com.frameone.learncinema` is still provisional; changing it also breaks in-place upgrade continuity.
- Do not print, upload, email or commit a keystore/password/encoded private key in source, CI logs or a release artifact.
- Preserve the certificate fingerprint and expected signing identity in restricted release records. The fingerprint alone is public-safe; the private key is not.
- Until both a persistent signer **and** a two-version phone test are confirmed, every public preview must warn that in-place upgrades are not guaranteed.

## v0.11A7 automatic release continuity guard

The release publisher now executes [check-android-signing-continuity.sh](../scripts/check-android-signing-continuity.sh) before it overwrites the stable public APK URL. Its behavior is covered by eight runnable `npm test` scenarios:

- **Temporary → temporary:** permitted with an explicit upgrade-unsafe warning while the permanent signing secret has not yet been provisioned.
- **Temporary → first permanent:** permitted once, but the publisher tells testers that their older temporary-signed install is not upgrade compatible; make an external learning backup first.
- **Permanent → same permanent certificate:** permitted (subject to actual package/version/device update checks).
- **Permanent → temporary** or **permanent → different permanent certificate:** **blocked**, even if a GitHub Actions signing secret is accidentally removed or rotated.
- Missing or malformed certificate fingerprints and conflicting/missing signer modes fail closed.

The previous source-commit ancestry rollback check remains in force. These release checks protect the public download channel against a signer regression; **they cannot create or provision a permanent key**, and cannot substitute for a genuine Android in-place upgrade test. The secret itself is never inspected or included in the release artifacts.

## Release-critical unresolved work

Secure secret provisioning is **not completed by writing this guide**. The app cannot claim stable APK updates yet. This is distinct from the already passing emulator and backup/restore automation.
