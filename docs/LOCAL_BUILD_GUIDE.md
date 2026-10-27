# Frame One — build and test on Windows or macOS

**Current status:** source milestone v0.9B; no verified React production bundle or APK yet. All commands require internet for first installation.

## Shared web app

Install **Node.js 22** and Git. Extract `frame-one-web-v09b-source.zip` into a project directory, open Terminal or PowerShell there and run:

```powershell
npm install
npm test
npm run build
npm run dev
```

The development server prints a local URL. Confirm the browser opens the **React chapter explorer**, and that searching for “sound” finds lessons. Open a lesson, answer the quiz, save a private practice note, return to Chapters, export a learning backup, and import it into a clean browser profile. Verify the seven creative labs and sound Play/Stop on desktop and Android Chrome. After production build, `dist/` contains the web app and a generated `sw.js` that precaches compiled assets. Run `npm run preview` through HTTPS or `localhost` to check installability and offline reload. Opening `dist/index.html` using `file://` is not a valid test of the built app.

**Storage:** previously saved work is bound to a browser origin. If migrating from a downloaded HTML file, export a Frame One backup in the old app and import it under Chapters in the React app. Avoid resetting the browser during tests.

## Android (after web build succeeds)

Install Android Studio and its current Android SDK. Confirm the permanent Android package ID first; `com.frameone.learncinema` is a **placeholder**.

```powershell
npx cap add android
npx cap sync android
npx cap open android
```

Build a **debug** APK from Android Studio and test audio, viewport/safe-area margins, local storage, backups, airplane-mode offline access and Android back navigation. Do not treat an emulator-only test as sufficient for a public release.

## iOS (after web build succeeds)

Requires macOS and Xcode with iOS tooling. Confirm the permanent bundle ID first:

```bash
npx cap add ios
npx cap sync ios
npx cap open ios
```

Test on an iPhone or iOS simulator, including audio after a user gesture, WebView storage, browser-safe-area regions, offline caching, VoiceOver and import/export behavior. Signing, TestFlight and App Store release need an Apple Developer account and additional review.

## Not yet complete

- React dependency installation, TypeScript typechecking and production build
- Real migrated-React UI screenshots and device-level accessibility QA
- Android/iOS native project generation and builds
- Professional filmmaking and Telugu-language editorial signoff
- Git repository selection, CI run and hosting

Use `docs/MIGRATION_STATUS.md` as the precise project handoff report.