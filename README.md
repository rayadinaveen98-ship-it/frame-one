# Frame One — Learn the art of filmmaking

**Engineering checkpoint v0.9F — protected notes and backups, compiled Chromium QA and downloadable Android debug APK · 27 October 2026 · not app-store released.**

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

This remains a **test-only debug build**, not a Play Store or iOS release. Learning ideas now auto-save; interrupted backup imports attempt to roll back previous saved data; the mobile shell respects exposed safe-area insets. Real-device listening, storage/export, status bars and accessibility still need structured testing. [v0.9F QA report](docs/QA_V09F.md).

## Android debug APK — first build verified

GitHub Actions [Android debug run 40474122825](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40474122825) **PASSED** on 27 October 2026 after installing Android SDK 36, running source tests, compiling the offline web build, generating Capacitor 8's Android project, assembling Gradle debug and checking that the APK embeds the actual web app. Run artifact **frame-one-android-debug-apk** (GitHub artifact ID `12719818584`) contains `app-debug.apk`. [Download and real-device QA instructions](docs/ANDROID_DEBUG_CI.md). This is a **debug build only**: not installed on a physical device, release-signed, tested on iOS or approved for stores.

**Next gate:** Verify the connected [Cloudflare Worker](docs/CLOUDFLARE_WORKERS_SETUP.md) has actually deployed to a working HTTPS URL, then test fresh PWA updates and offline data. In parallel, install/test the debug APK on a real Android phone and complete audio, TalkBack, backup and landscape QA. **No verified live Frame One URL or public release** yet. See [deployment status](docs/DEPLOYMENT_STATUS.md).
