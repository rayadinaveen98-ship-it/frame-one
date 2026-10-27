# Frame One v0.9F — learning-data stability and Android release delivery

Date: 27 October 2026

## What changed

1. **Lesson ideas now persist on each edit**, using the original `frameone-practice-v07` key and validated legacy learning bridge. The Save button stays available, and a storage-write error is reported instead of falsely claiming success.
2. **Learning backup restore is safer.** The original progress, note and storyboard values are recorded before the three-key import; if a write fails, the app attempts to restore every previous value and refuses to update in-memory progress. This is a best-effort rollback, not a database transaction: if device storage becomes permanently unavailable, guaranteed recovery is impossible.
3. **Phone layout honours safe-area insets** when exposed by the browser/Android WebView. Actual status/navigation bar behavior still requires real-device testing, especially edge-to-edge Android.
4. **Pull requests now run compiled Chromium QA** before code reaches main. The smoke test specifically confirms a practice note survives navigation/reload without tapping Save.
5. **Android APK delivery gets a stable public URL.** A successful main-branch Android build can trigger the prerelease publication workflow and replace its debug APK; the existing v0.9E direct release remains preserved. The automatic stable-release path requires a real post-merge run before it can be called verified.

## Verified

- Source tests, TypeScript check and production build: [GitHub Actions 40477845134](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40477845134) — SUCCESS.
- Actual compiled Chromium desktop/mobile QA, 33 lesson journeys, seven React labs, note persistence, sound lifecycle, backup/offline routes: [GitHub Actions 40477845140](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40477845140) — SUCCESS.
- Existing Android debug builds: [main-branch Android 40474407084](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40474407084) — SUCCESS, **before** the v0.9F edits. Do not use that run to claim v0.9F APK verification.

## Still pending

- v0.9F post-merge Android APK build, stable public release publication and verifying its direct URL
- Real Android speaker/headphone behavior, WebView backup export/import, device-specific safe areas, keyboard accessibility and offline reopening
- Verified live Cloudflare Worker URL and actual deployed content, new-version refresh, Safari/iOS build
- Independent filmmaking / Telugu accuracy review and privacy/store requirements

This is a stability checkpoint, not a full public release.
