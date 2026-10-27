# Frame One — Learn the art of filmmaking

**Source checkpoint v0.9B · 27 October 2026 · not production released.**

Beginner-first, interactive education about what films are, how filmmakers tell stories, the crafts of cinema and practical visual/sound choices. The curriculum currently includes **33 drafted lessons, 6 chapters, 7 creative labs, 47 glossary terms, 9 introductory roles**, optional Telugu summaries, quizzes, storyboards, progress and local backups.

## Latest source

**[Complete verified v0.9B React + TypeScript + Vite + Capacitor source ZIP](releases/frame-one-v09b-source.zip)**. SHA-256: `ee9ab5e2a9f5448ddad559241b5b0fa1dbdadc6b2f7e6efa737d137ba86a561f`.

The [source import workflow](.github/workflows/import-v09b-source.yml) has **committed the expanded project files to main**. A clean GitHub Actions **TypeScript + Vite production web build passed** on [27 October 2026](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40440890519); real browser/device visual QA is still pending. All twelve historical source checkpoints are also backed up in the [complete development archive](history/frame-one-complete-development-history.tar.xz). Historic runnable standalone HTML prototypes are [archived here](history/README.md), with the latest static preview at [preview/standalone.html](preview/standalone.html).

## Project records

[Roadmap](docs/ROADMAP.md) · [Current progress](docs/PROGRESS.md) · [Version history](history/README.md) · [Architecture](docs/ARCHITECTURE.md) · [Accuracy policy](docs/CONTENT_REVIEW.md) · [Build handoff](docs/MIGRATION_STATUS.md) · [Release checklist](docs/RELEASE_CHECKLIST.md)

## Technology and limitations

React 19 + TypeScript + Vite + Capacitor 8 planned for web/Android/iOS. Hybrid legacy engine powers the seven labs; mobile package ID `com.frameone.learncinema` is provisional. All user work stays locally on device/browser. No backend, accounts or third-party film clips. Public repository without an explicit open-source license. Expert film and Telugu review remain pending.

**Next gate:** test the compiled web build in real browsers and mobile devices, verify offline/audio/backup behavior, then deploy the PWA and package Android/iOS. No APK or iOS build is claimed.
