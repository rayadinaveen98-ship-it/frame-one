# Frame One v0.9K — native Android offline persistence acceptance

**Date:** 27 October 2026. **Status:** QA implementation merged into `main`, native emulator branch checks passed. No application source, curriculum, local-storage format, or publicly downloaded APK changed.

## Why this matters

v0.9F made lesson ideas save immediately, and v0.9J proved Android system Back through lessons and labs. This release gate verifies that a real native Android WebView keeps the learner's private filmmaking note across a **force-stopped app process** and a **cold launch with airplane mode enabled**, not just a browser mock.

## Executed test

`scripts/android-emulator-persistence.py` runs in the same Android API 35 AOSP Test Device and temporary debug APK used for the existing native Back test. It uses `uiautomator` and ADB to interact with the actual Android WebView; it does not inject JavaScript or prepopulate localStorage.

1. Install and launch the actual Capacitor APK through Android's launcher intent.
2. Open Learn and the first lesson, then scroll to the practice textarea.
3. Type a distinctive note through Android's own input command, and confirm it is visible in the accessible WebView UI.
4. Force-stop the installed package; enable Android airplane mode and disable Wi-Fi; confirm airplane mode is enabled.
5. Relaunch Frame One from the launcher, open the same lesson, and locate the identical private note in the Android accessibility hierarchy.
6. Restore the emulator network settings so the independent native system Back and Home-minimize test can run.
7. Upload screenshots, hierarchy XML and network-mode evidence to GitHub Actions, including failures.

**No learner content is sent to external servers.** CI uses a disposable test-only note on a temporary emulator.

## Verified results

- [Branch native emulator run 40494188012](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40494188012) — **SUCCESS**, explicit `FRAME ONE ANDROID PERSISTENCE OFFLINE: PASS` and complete native Back PASS.
- [Second emulator run 40494209385](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40494209385) — **SUCCESS**, offline persistence and Back PASS.
- [Final branch run 40494253148](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40494253148) — **SUCCESS**, with improved Home activity foreground polling.
- [Web/source checks 40494252907](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40494252907) — **SUCCESS**.
- [Full Chromium acceptance 40494253063](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40494253063) — **SUCCESS**.
- [PR #7](https://github.com/rayadinaveen98-ship-it/frame-one/pull/7) merged into main as `a6b585ab2d0e44df017b32a812fc11bc04e916cb`.

## Root-cause distinction

The first combined run failed on an intermittently late Home minimize assertion **before** executing the new persistence test. The persistence check was reordered first and network settings restored before the existing Back test. Home minimize now polls Android's actual foreground activity over a short bounded interval rather than assuming a single fixed delay. Three independent later runs passed end-to-end.

## What's not yet covered

- A complete lesson, storyboard project and manual JSON backup restore tested after restart in the Android emulator.
- Physical Android devices, swipe-back gestures, speaker/headphone sound, Android file picker and backup downloads, TalkBack, keyboard overlap and multiple resolutions.
- Safe in-place debug APK upgrades, which require a persistent signing identity and two separately built, same-signer APKs.
- A verified live Cloudflare Worker URL and iOS native testing.

**This is not a new APK version.** Frame One v0.9I remains the latest app implementation; v0.9J/K are additional QA gates. App-store release is not approved.
