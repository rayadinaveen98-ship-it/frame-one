# Frame One v0.9M — native Android backup/share and external-file restore acceptance

**Engineering milestone:** 27 October 2026. Implementation intentionally preserves **frameone-learning-backup v1**, `frameone-progress-v01`, `frameone-practice-v07`, and `frameone-scene-v07`.

## Root problem

The original browser's `Blob` object-URL download works in desktop Chrome but may not result in any saved file inside a Capacitor Android WebView. The app's button said "Backup download prepared" without knowing whether a destination file had actually been saved, leaving users potentially believing their data was protected.

## Implementation

- Lock official `@capacitor/filesystem@8.1.5` and `@capacitor/share@8.0.3` dependencies and let `npx cap sync android` register their native plugins.
- On Android, **Learn → Keep a copy of your learning → Save / share backup JSON** prepares the unchanged, validated original v1 JSON using the existing `getBackupJSON()` bridge, writes `frame-one-learning-backup.json` to Android's **private cache**, reads it back to verify exact contents, and invokes Android's save/share chooser with the native file URI. No new storage keys, network uploads or broad storage permissions.
- **The cache is not a durable backup.** It may be deleted or wiped when the app is uninstalled. The UI explicitly tells learners to choose an external Files, Drive or other storage destination and verify the JSON is saved there before replacing their APK.
- Desktop/web retains the existing **Download learning backup** button. Android and web both retain the existing **Restore a backup JSON file** picker and the manual JSON copy/paste fallback.
- Any restore still parses and schema-validates the existing v1 payload and requires explicit overwrite confirmation; rollback is best effort because WebView localStorage isn't transactional.
- Private JSON is never logged, transmitted to Frame One services or written to public app directories automatically.

## Automated acceptance

- `tests/verify-native-backup.cjs` tests Android-only scope, byte-for-byte correct v1 data, native Cache placement, readback, FileProvider share URI and safe format/size/error guards.
- Web verification, Chromium desktop/mobile, native Gradle build and plugin discovery must all pass after integration.
- `scripts/android-emulator-backup.py` exercises actual user-created notes, completed lesson and Make Lab storyboard on Android. It taps **Save / share backup JSON**, extracts the *actual plugin-written cache file* in a disposable debug emulator (via `adb run-as`), checks all saved fields, copies those same bytes to Downloads as the simulated external destination, clears the entire app's private data, uses Android's actual file picker to restore, consents to overwrite, and checks the completed lesson and Make scene returned. **This is not an injected or fabricated backup.**
- Screenshots and accessibility hierarchies are collected for any failure. If Android Test Device has no working SAF document picker or compatible share destinations, report that explicitly and keep the gate open. Do not claim the user's external saving action itself was performed by CI.

## Remaining release gates

- Physical phone Share sheet + Save to Files/Drive, Android DocumentsUI import from Downloads/Drive, TalkBack/focus management, offline sharing, storage and permissions across Android OEM versions.
- Persistent signing key, two successive same-signer builds and in-place upgrades preserving data.
- Verified real Cloudflare Worker HTTPS site, iOS, privacy/distribution review.

This version is an app-code upgrade (unlike QA-only v0.9J/K/L) and must pass GitHub production-web, real Chromium, native plugin linkage, Android emulator and public APK release gates before it is described as a downloadable **v0.9M**.
