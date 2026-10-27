# Frame One — Android debug APK build and device test (v0.9E)

Status: **Android debug APK build verified on both the PR and main** on 27 October 2026; not yet installed/device-tested or store-ready. [PR run 40474122825](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40474122825) passed and uploaded `frame-one-android-debug-apk` (ID `12719818584`). After merge, [main run 40474407084](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40474407084) also passed and uploaded the same artifact name (ID `12719424344`).

## Reproducible build

Workflow: [Frame One Android debug APK](../.github/workflows/android-debug.yml)

The workflow runs from committed source: Node.js 22, Java 21, Android SDK 36, `npm ci`, source regression tests, production Vite build, Capacitor 8 `cap add android` and `cap sync android`, Gradle `:app:assembleDebug`, and a check that the APK contains `assets/public/index.html`.

On success, GitHub Actions uploads **frame-one-android-debug-apk** containing `app-debug.apk`; artifact retention is 14 days. Open the latest successful workflow run, scroll to **Artifacts**, download the ZIP, extract its APK and install on an Android test phone (after permitting installation from the specific source if Android prompts). Use only the repository's own GitHub Actions page, never a third-party APK mirror.

The debug APK uses the currently **provisional** ID `com.frameone.learncinema`. This build must not be called release-signed or Play-Store-ready. Do not store signing keys or user backups in GitHub.

## Android manual acceptance (still required)

- Launch without crashes on at least one real Android phone; confirm splash, status/navigation bars, safe-area insets and back navigation.
- Complete a lesson and a quiz, close/reopen the app, verify learning progress and notes persist.
- Visit all seven labs; exercise sliders, Cut playback/Stop, Make storyboard Save/Export and Sound Play/Stop and navigation cleanup while listening through the device speaker/headphones.
- Export a learning-data backup and successfully restore it into a fresh test installation/browser, with explicit overwrite consent.
- Enable airplane mode, relaunch and test lesson/lab navigation and locally bundled images.
- Verify portrait/landscape, keyboard focus, TalkBack labels and reduced-motion handling.
- **Do not assume two GitHub Actions debug APKs can update in place.** Ephemeral CI runners may generate a different Android debug signing certificate, causing an install/update conflict. First confirm a complete, usable backup export (including notes and storyboard) and verify restoration before uninstalling anything. **Uninstalling normally erases locally stored progress.** A persistent, securely managed QA signing identity is required before we can promise seamless test-version updates.

## Release work not included

Confirm permanent Android application ID, release icon/splash, Android UI/system bar treatment, Privacy Policy and content/editorial signoff. Configure keystore/signing safely for a Play release, then test a production release build separately. iOS requires a separate macOS/Xcode build and physical iPhone QA.

## Status truth boundary

The first Gradle debug APK build **passed** and produced an artifact; this verifies packaging only. It does **not** prove that anyone has installed the APK, heard audio through a real speaker, passed TalkBack, checked backups on physical Android or verified Play release compliance.
