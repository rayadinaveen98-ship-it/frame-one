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
