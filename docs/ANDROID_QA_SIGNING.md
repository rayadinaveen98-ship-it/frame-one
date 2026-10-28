# Frame One Android — stable QA signing and safe upgrades

## Current status (28 October 2026)

The public `android-preview-latest` APK is **debug-signed**, and the latest v0.11A4 build reported `Persistent QA signer: NO`. The temporary certificate SHA-256 was `1c2571585f4ceafce6d89eb41cbdc49130fd8b6326a01dbccd060134a3efdf1d`. Its debug key was generated on a disposable GitHub Actions runner.

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

## Release-critical unresolved work

Secure secret provisioning is **not completed by writing this guide**. The app cannot claim stable APK updates yet. This is distinct from the already passing emulator and backup/restore automation.
