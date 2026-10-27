# Frame One v0.9J — Android emulator acceptance

Date: 27 October 2026. This phase adds testing evidence, **not a new feature or a user-installable APK**.

## Why this is necessary

The previous v0.9I native Android Back implementation passed TypeScript, browser tests and Gradle compilation, but no Android runtime test was executed. A compiled plugin can still behave differently once installed and pressed on real Android.

## Implemented QA

- **Workflow:** `.github/workflows/android-emulator-qa.yml`, based on the official ReactiveCircus Android emulator runner on Ubuntu 24.04 (API 35, x86_64 Google APIs).
- **Actual app build:** fresh locked npm dependencies; source tests; TypeScript/Vite and offline asset build; `npx cap add android` and `npx cap sync android`; Gradle `assembleDebug`.
- **Real emulator run:** install the generated `app-debug.apk`, launch the `com.frameone.learncinema` Android activity, verify the built-in WebView home, use Android UI accessibility hierarchy to open Learn and the first lesson, send **Android KEYCODE_BACK**, verify the previous lesson/list/home screens, then check Lab → Home and Home → minimize.
- **Artifact evidence:** screenshots, `uiautomator` XML hierarchy and current foreground activity evidence are uploaded even when the test fails. Never treat an emulator launch or nonempty screenshot as proof of a passed navigation assertion.
- The script uses only the Android SDK, built-in `uiautomator` and Python 3 standard library; it does not silently substitute browser rendering for native Android.

## What this does NOT establish

- Real Samsung/Redmi/Motorola hardware, back-edge **gesture animation**, orientation cutouts, physical speaker/headphones, file dialogs, accessibility/TalkBack, storage backup or two-version upgrades.
- A stable signing key. The CI test is isolated and uses its own temporary debug signer; it does not modify public GitHub APK artifacts.
- Cloudflare live hosting. That remains unverified.
- Publication to an app store. This is an engineering-only test.

## Acceptance criteria

1. The workflow passes on the exact branch commit and the Android emulator smoke script ends with `FRAME ONE ANDROID EMULATOR SMOKE: PASS`.
2. Emulator evidence includes initial Home, Learn, lesson, system Back to Home, Lab and Home minimized.
3. Failures are investigated using the uploaded real emulator screenshot and XML—not marked green because compilation passed.
4. Merge only after a credible complete emulator acceptance run, or explicitly document unresolved limitations. Keep the existing v0.9I public APK unchanged unless app source requires a separate fix.

## Verification results

Pending real emulator completion. Do not claim native runtime acceptance until verified from GitHub Actions logs.
