# Frame One — Learn the art of filmmaking

**Source checkpoint v0.9E — Cloudflare Pages preparation · 27 October 2026 · not yet deployed or publicly released.**

Beginner-first, interactive education about what films are, how filmmakers tell stories, the crafts of cinema and practical visual/sound choices. The curriculum currently includes **33 drafted lessons, 6 chapters, 7 creative labs, 47 glossary terms, 9 introductory roles**, optional Telugu summaries, quizzes, storyboards, progress and local backups.

## Latest source

**[Complete verified v0.9B React + TypeScript + Vite + Capacitor source ZIP](releases/frame-one-v09b-source.zip)**. SHA-256: `ee9ab5e2a9f5448ddad559241b5b0fa1dbdadc6b2f7e6efa737d137ba86a561f`.

The [source import workflow](.github/workflows/import-v09b-source.yml) has **committed the expanded project files to main**. GitHub Actions now verifies the **33 lessons and all seven React Creative Labs** in compiled Chromium, including offline and portable backup behavior. Real device/audio/accessibility and expert content review are still pending. Cloudflare Pages Git auto-deployment configuration is committed but the account-side connection and live site remain pending. All twelve historical source checkpoints are also backed up in the [complete development archive](history/frame-one-complete-development-history.tar.xz). Historic runnable standalone HTML prototypes are [archived here](history/README.md), with the latest static preview at [preview/standalone.html](preview/standalone.html).

## Project records

[Roadmap](docs/ROADMAP.md) · [Current progress](docs/PROGRESS.md) · [Version history](history/README.md) · [Architecture](docs/ARCHITECTURE.md) · [Accuracy policy](docs/CONTENT_REVIEW.md) · [Build handoff](docs/MIGRATION_STATUS.md) · [Release checklist](docs/RELEASE_CHECKLIST.md)

## Web hosting and automatic updates

**Chosen host: Cloudflare Pages** with automatic GitHub deployments (Vite build: `npm run build`, publish: `dist`, Node 22). Git configuration, cache-refresh headers, offline versioning and a non-disruptive refresh notice are committed. [One-time connection guide](docs/CLOUDFLARE_PAGES_SETUP.md) · [Deployment status](docs/DEPLOYMENT_STATUS.md).

## Technology and limitations

React 19 + TypeScript + Vite + Capacitor 8 planned for web/Android/iOS. All seven Creative Labs are now React-owned; the legacy engine remains a compatibility bridge for progress, original home, film-role and backup functions; mobile package ID `com.frameone.learncinema` is provisional. All user work stays locally on device/browser. No backend, accounts or third-party film clips. Public repository without an explicit open-source license. Expert film and Telugu review remain pending.

**Next gate:** [Connect Cloudflare Pages to GitHub](docs/CLOUDFLARE_PAGES_SETUP.md) once, verify the actual live deployment and fresh PWA updates, then run real-device QA and package Android/iOS. There is **no verified Frame One live URL or APK** yet. See [deployment status](docs/DEPLOYMENT_STATUS.md).
