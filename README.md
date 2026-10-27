# Frame One — Learn the art of filmmaking

**Engineering checkpoint v0.9M — native Android backup export and verified JSON restore · Android test APK published · 27 October 2026 · not app-store released.**

Beginner-first, interactive education about what films are, how filmmakers tell stories, the crafts of cinema and practical visual/sound choices. The curriculum currently includes **33 drafted lessons, 6 chapters, 7 creative labs, 47 glossary terms, 9 introductory roles**, optional Telugu summaries, quizzes, storyboards, progress and local backups.

## Latest source

**[Complete verified v0.9B React + TypeScript + Vite + Capacitor source ZIP](releases/frame-one-v09b-source.zip)**. SHA-256: `ee9ab5e2a9f5448ddad559241b5b0fa1dbdadc6b2f7e6efa737d137ba86a561f`.

The [source import workflow](.github/workflows/import-v09b-source.yml) has **committed the expanded project files to main**. GitHub Actions now verifies the **33 lessons and all seven React Creative Labs** in compiled Chromium, including offline and portable backup behavior. Real device/audio/accessibility and expert content review are still pending. Cloudflare Workers static-asset configuration and Git linkage have been prepared, but the live production URL and latest deployment still need an independent check. All twelve historical source checkpoints are also backed up in the [complete development archive](history/frame-one-complete-development-history.tar.xz). Historic runnable standalone HTML prototypes are [archived here](history/README.md), with the latest static preview at [preview/standalone.html](preview/standalone.html).

## Project records

[Roadmap](docs/ROADMAP.md) · [Current progress](docs/PROGRESS.md) · [Version history](history/README.md) · [Architecture](docs/ARCHITECTURE.md) · [Accuracy policy](docs/CONTENT_REVIEW.md) · [Build handoff](docs/MIGRATION_STATUS.md) · [Release checklist](docs/RELEASE_CHECKLIST.md)

## Web hosting and automatic updates

**Chosen provider: Cloudflare.** The existing account project is a **Workers static-asset deployment**, not a Pages site. It connects to GitHub and uses `npm run build` followed by `npx wrangler deploy`. The repo includes a `wrangler.jsonc`, cache-refresh rules, offline versioning, and a user-controlled PWA refresh notice. [Worker setup](docs/CLOUDFLARE_WORKERS_SETUP.md) · [Deployment status](docs/DEPLOYMENT_STATUS.md).

## Technology and limitations

React 19 + TypeScript + Vite + Capacitor 8 powers the built web app and Android debug APK; an iOS build has not yet been verified. All seven Creative Labs are now React-owned; the legacy engine remains a compatibility bridge for progress, original home, film-role and backup functions; mobile package ID `com.frameone.learncinema` is provisional. All user work stays locally on device/browser. No backend, accounts or third-party film clips. Public repository without an explicit open-source license. Expert film and Telugu review remain pending.

## Download the current Android test APK

**[Direct public APK — latest Frame One Android preview](https://github.com/rayadinaveen98-ship-it/frame-one/releases/download/android-preview-latest/FrameOne-android-debug.apk)** · [Release page / SHA-256 checksum](https://github.com/rayadinaveen98-ship-it/frame-one/releases/tag/android-preview-latest).

The stable public address is updated automatically after successful main-branch Android debug builds. **v0.9F** was verified by [web build 40478349107](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40478349107), [compiled browser QA 40478349333](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40478349333), [Android build 40478349105](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40478349105), and the [public release publisher 40478579858](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40478579858). Preserve the earlier [v0.9E test APK release](https://github.com/rayadinaveen98-ship-it/frame-one/releases/tag/v0.9e-android-debug-1) for rollback/reference.

**v0.9G** now adds a private, user-initiated **copy/paste JSON learning-backup alternative** under Learn, without changing the existing file download/import path or data schema. Merged code passed [web build 40480555312](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40480555312), [compiled Chromium QA 40480555273](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40480555273), [Android APK 40480555401](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40480555401) and [latest public APK publisher 40480801867](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40480801867). [v0.9G QA report](docs/QA_V09G.md).

**v0.9H** adds a 44px accessible mobile Back button and app-local browser history markers, including safe fallback for direct links. [Web 40482599685](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40482599685), [Chromium mobile QA 40482599661](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40482599661), [Android 40482599668](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40482599668) and [public APK 40482775098](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40482775098) all **passed**. See [QA and important native Back limitations](docs/QA_V09H.md). Native hardware/gesture Back remains unverified.

**v0.9I (latest)** adds the official Capacitor App 8.1.2 native Android Back handler. Lessons/labs use the app-local navigation policy; on Home, system Back minimizes the app instead of closing it. GitHub also publishes APK signing fingerprints and allows a persistent QA signer through a protected repository secret (not currently configured). [Web source checks 40486968443](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40486968443), [full Chromium QA 40486968447](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40486968447), [Android APK 40486968418](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40486968418) and [public APK publishing 40487176493](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40487176493) all **passed**. [v0.9I QA and limitations](docs/QA_V09I.md). **Hardware/gesture Back and in-place APK upgrades have not been tested on a physical phone.**\n\nThis remains a **test-only debug build**, not a Play Store or iOS release. Practice ideas now auto-save, interrupted backup imports attempt rollback, and mobile content respects safe-area insets. Real-device listening, clipboard, storage/export, status bars and accessibility still need structured testing. [v0.9F QA report](docs/QA_V09F.md).

## v0.9J — first real Android runtime acceptance

Our bundled Capacitor Android app was installed and exercised in a real **Android API 35 emulator**. [Feature branch run 40490569350](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40490569350), [repeat run 40491292091](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40491292091), and [independent main run 40492047719](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40492047719) all passed Home → Learn → first lesson, Android system Back to Learn/Home, Lab → Home, and Home Back minimizing the activity while the app process remained alive. [Full acceptance report and artifacts](docs/QA_V09J.md). [Emulator QA pipeline](.github/workflows/android-emulator-qa.yml) now runs on relevant native/UI code changes and by manual dispatch.

**This is QA-only; there is no v0.9J APK.** The latest public debug APK is still **v0.9I**, and its signing identity is temporary. The emulator does not replace testing on a physical phone, iOS, or the real Cloudflare Worker URL.

## v0.9K — learning data survives an offline Android restart

Native Android API 35 testing now proves that a learner can type a private practice note in the real WebView, force-stop Frame One, enable airplane mode, reopen it and find the **same note still saved**. The native Back/navigation suite still passes alongside it. Independent [emulator passes 40494188012](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40494188012), [40494209385](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40494209385) and [final run 40494253148](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40494253148); full [v0.9K QA report](docs/QA_V09K.md).

No app code, curriculum or saved-data keys changed. **v0.9K is a testing milestone, not a separate APK.** The latest publicly distributed application build continues to use temporary debug signing; physical Android, backup-file recovery, in-place upgrades and the live Cloudflare site remain unverified.

## v0.9L — progress and storyboards also survive offline restart

The [Android API 35 emulator suite 40498806973](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40498806973) now demonstrates a learner answering the real first lesson quiz and marking it complete, creating a **Decision** storyboard with **Close-up** first-shot framing and a private written idea, then force-stopping Frame One and reopening in airplane mode. The saved 1/33 lesson progress, story question, shot framing and note all remained. The original private practice note and native Back tests also passed.

[v0.9L full QA evidence](docs/QA_V09L.md). **No application implementation changed and no v0.9L APK was created**; latest public test APK still contains v0.9I implementation with temporary debug signing. Native file-backup recovery, two-version upgrades, physical devices and verified Cloudflare live hosting remain pending.

## v0.9M — verified Android backup export and recovery

Frame One's **Learn → Keep a copy of your learning** panel now supports **Save / share backup JSON** on Android. The app uses the official Capacitor Filesystem and Share plugins to create and verify the original v1 JSON backup, then opens the Android share/save chooser. **The learner must choose an external destination and verify the saved file** before relying on it; a file inside app cache will not survive uninstall. Desktop/web download, JSON file import and manual copy/paste remain available.

The [full Android emulator backup test](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40521036808) **PASSED**: app-generated JSON containing a completed lesson, private note and Make storyboard was copied unchanged to Android Downloads, the app's private data was wiped, and the original work was restored through the real Android file picker. The [native regression suite](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40521036608), source/web, Chromium and Gradle checks passed. [Full v0.9M QA report](docs/QA_V09M.md).

The [public Android test APK](https://github.com/rayadinaveen98-ship-it/frame-one/releases/tag/android-preview-latest) now includes v0.9M. **This APK is debug-signed with a temporary certificate, not update-safe**: protect saved learning data before replacing a previous build. Physical Android share destinations and multi-build signing continuity still need real-device acceptance.

## Android debug APK — first build verified

GitHub Actions [Android debug run 40474122825](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40474122825) **PASSED** on 27 October 2026 after installing Android SDK 36, running source tests, compiling the offline web build, generating Capacitor 8's Android project, assembling Gradle debug and checking that the APK embeds the actual web app. Run artifact **frame-one-android-debug-apk** (GitHub artifact ID `12719818584`) contains `app-debug.apk`. [Download and real-device QA instructions](docs/ANDROID_DEBUG_CI.md). This is a **debug build only**: not installed on a physical device, release-signed, tested on iOS or approved for stores.

**Next gate:** Verify the connected [Cloudflare Worker](docs/CLOUDFLARE_WORKERS_SETUP.md) has actually deployed to a working HTTPS URL, then test fresh PWA updates and offline data. In parallel, install/test the debug APK on a real Android phone and complete audio, TalkBack, backup and landscape QA. **No verified live Cloudflare Frame One URL or app-store release** yet. A public *debug test APK* does exist. See [deployment status](docs/DEPLOYMENT_STATUS.md).
