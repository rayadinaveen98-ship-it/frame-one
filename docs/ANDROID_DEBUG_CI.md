# Frame One — Android debug APK build and device test (v0.9E)

Status: a **debug-build CI workflow**, not a verified app-store release. This document describes the source-built artifact and the remaining acceptance gates.

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
- Reinstall/update a newer debug APK over an older one and confirm stored progress is retained. **Back up learner data before attempting uninstall** because uninstall normally removes local app storage.

## Release work not included

Confirm permanent Android application ID, release icon/splash, Android UI/system bar treatment, Privacy Policy and content/editorial signoff. Configure keystore/signing safely for a Play release, then test a production release build separately. iOS requires a separate macOS/Xcode build and physical iPhone QA.

## Status truth boundary

Creating this workflow does **not** establish that a Gradle APK build passed. Link the *specific successful* GitHub Actions run and its artifact before reporting APK availability. A passing build does not mean a human tested its installed behavior.
