# Frame One v0.9I — Android system Back and safe debug-signing provision

Date: 27 October 2026 · Engineering QA milestone, not a production release

## Android Back: official Capacitor App integration

- `@capacitor/app@8.1.2` is a **production dependency**, with the exact version and integrity locked in `package-lock.json`. The Android CI generates the Capacitor project and runs `cap sync android`, allowing official App plugin discovery.
- `src/android-back.ts` listens for Android `backButton` events using the official Capacitor App plugin. On lessons, chapter lists, lab screens and roles, it calls the existing `frameOneLegacy.goBack()` route-history policy introduced in v0.9H. The handler follows only Frame One route markers, including safe direct-link fallback.
- From Home, system Back calls `App.minimizeApp()`, **not** `exitApp()` or a storage/reset operation. Learning data remains local and untouched.
- Browser/PWA and iOS are unaffected: registration is guarded by `Capacitor.isNativePlatform()` and `Capacitor.getPlatform()==='android'`.
- `tests/verify-android-back.cjs` compiles the actual TypeScript module and stubs native APIs to prove Android-only installation, lesson/lab Back routing and Home minimize. **This is mocked behavior, not a physical Android test.**
- Android 14+ predictive Back gesture visual animations and edge-swipe behavior still need device-level evaluation. The Capacitor plugin handles committed system Back callbacks, not gesture-progress animations.

## Upgrade certificate continuity: safe configuration only

Prior GitHub CI runs generate temporary Android debug keystores on different runners, so APK signatures may differ between versions. Android will refuse an update signed by a different certificate; **uninstalling usually erases app-private learner data**.

- The Android debug workflow now optionally reads GitHub Actions secret `FRAMEONE_QA_DEBUG_KEYSTORE_B64` **on trusted main runs only**.
- For this secret, generate a private QA-only Android debug keystore (alias `androiddebugkey`, store/key password `android`) on a trusted developer workstation. Base64-encode the raw `.keystore` bytes and store them directly as this GitHub Actions repository secret. **Never commit the keystore or paste it in chat, issues, a public workflow log, or README.**
- Without the secret, the Android build still passes with a temporary debug signer and prints a warning. That APK **cannot be assumed upgrade-compatible** with previous builds.
- After signing, GitHub Actions validates the APK via Android SDK `apksigner verify --print-certs` and uploads `android-qa-signature.txt` with the debug APK. The public release includes this certificate fingerprint and an explicit persistent-signer YES/NO status so each download has auditable provenance. Only the public fingerprint is shared, never a private key.
- A debug signer is **not a release signing identity**. Store/production signing requires a separate permanent ID and protected release key, only after product-owner approval.

## How to validate real Android update behavior

1. Preserve an externally verified Frame One learning-backup JSON (or v0.9G copy/paste backup) and confirm it includes your completed lessons, practice notes and storyboard **before** touching the old installed app.
2. Configure the QA signer secret, then generate two **successive main-branch debug builds**. Confirm both release fingerprints match.
3. Install the first signed build, create a lesson note and storyboard plan, install the second signed build **without uninstall**, and verify local progress/note/storyboard remain intact.
4. On a real Android phone, verify Back button/gesture from Learn, Lesson, Labs, and Home (minimize), plus status bars, offline launch, audio and backup export/import.
5. If an existing previous APK was signed by a different debug certificate, an in-place upgrade to the first stable-signer build may still fail. Do not erase the old app until the exported backup is checked.

## Verification gates

- Locked `npm ci`, `npm test`, `npm run build`, actual Chromium smoke and Gradle assembleDebug
- Plugin native autolinking: inspect Capacitor sync output and compiled APK (not solely TS compilation)
- Confirm public APK GitHub Release includes `android-qa-signature.txt` and reports persistent signer status accurately
- Physical device acceptance of Android Back/gesture **still pending**

Do not call a stable **update identity** verified until a persistent signer has been configured and two distinct builds have passed an **in-place install** on a real device.

## Verified branch evidence (27 October 2026)

- [Web source tests and TypeScript/Vite production compilation 40486487248](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40486487248) — **SUCCESS**.
- [Native Android / Capacitor App plugin build 40486487444](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40486487444) — **SUCCESS**. The build's Capacitor sync log discovers `@capacitor/app@8.1.2`; Gradle compiles the `capacitor-app` module.
- Downloaded the real APK job artifact and checked ZIP integrity; it contains `assets/public/index.html` and `assets/capacitor.plugins.json` with `com.capacitorjs.plugins.app.AppPlugin`. Both artifact files (`app-debug.apk` and `android-qa-signature.txt`) are at ZIP root, so the public release workflow can find them.
- The APK certificate receipt reports **Persistent QA signer: NO** — temporary runner certificate, **not upgrade-safe**. A secret-managed stable QA identity is prepared but has **not yet been provisioned or proven**.
- Full Chromium browser QA runs [40486102916](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40486102916) and [40486487223](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40486487223) are **not verified** as of this check because the Playwright Chromium installation step remains in progress. The native feature is guarded to Android only and the previous v0.9H full-browser tests passed, but this is **not a substitute** for completing the v0.9I run.

Android hardware Back is installed in the compiled APK, but its actual behavior on a phone remains **untested**.

## Verified after merge into main

- [PR #5](https://github.com/rayadinaveen98-ship-it/frame-one/pull/5) merged as `82bcf861afb2355158d48036d524f8bf7d7a50fc`.
- [Web source tests, TypeScript/Vite compilation 40486968443](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40486968443) — **SUCCESS**.
- [Full compiled Chromium desktop/mobile QA 40486968447](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40486968447) — **SUCCESS**. This resolves the earlier browser-installation delay in branch runs.
- [Capacitor/App Android debug APK build 40486968418](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40486968418) — **SUCCESS**.
- [Stable public GitHub release publisher 40487176493](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40487176493) — **SUCCESS**, verified public asset `FrameOne-android-debug.apk` (**4,391,455 bytes**) plus `SHA256SUMS.txt` and `android-qa-signature.txt` at [latest test release](https://github.com/rayadinaveen98-ship-it/frame-one/releases/tag/android-preview-latest).

**Native runtime caveats:** No physical Android hardware/gesture test has been performed. The build uses a temporary debug signing certificate (`Persistent QA signer: NO`), so updating over an older debug APK may not be possible without reinstalling and restoring a verified backup. The secret-managed persistent QA signer is prepared but not configured.
