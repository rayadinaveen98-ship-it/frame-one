# Frame One — Learn the art of filmmaking

**Status: v0.9B source migration (27 Oct 2026) — pre-release.**

Frame One is a beginner-first interactive film education app built around short, simple lessons and hands-on creative experiments. Current source includes **33 drafted lessons in 6 chapters, 7 creative labs, 47 glossary terms, 9 film roles, Telugu quick explanations and locally saved practice**.

## Try / develop

```bash
npm install
npm test
npm run build
npm run dev
```

> ⚠️ The new React application has **not yet completed a verified production build or real-device visual QA**. Existing source-level Node checks pass; dependencies were unavailable in the development environment. `preview/` is the **earlier functional static app**, not the migrated React screen. Do not confuse this repository with a shipped app.

## Current architecture

- React + TypeScript + Vite, with React-owned lessons, chapters, glossary and progress views.
- Seven labs, home, crew map and backup implementation remain in the legacy JavaScript compatibility engine pending React migration.
- Capacitor configured for future Android and iOS shells. Package ID `com.frameone.learncinema` is **provisional**.
- Local-only storage of lessons, drafts and notes; manual JSON backup/import for origin changes. No user accounts or backend.

## Project records

- [Roadmap and milestone gates](docs/ROADMAP.md)
- [Current progress / remaining work](docs/PROGRESS.md)
- [Version chronology and source snapshots](history/README.md)
- [Architecture and migration decisions](docs/ARCHITECTURE.md)
- [Content review and accuracy boundaries](docs/CONTENT_REVIEW.md)
- [Local build instructions](docs/LOCAL_BUILD_GUIDE.md)
- [Detailed v0.9B migration report](docs/MIGRATION_STATUS.md)
- [Release checklist](docs/RELEASE_CHECKLIST.md)

## Safeguards

The source is public, but no secrets, API keys, signing credentials, private user backups or personal drafts should be committed. No third-party movie footage is bundled. Subject-matter expert and Telugu review are pending.

**Rights:** This public repository does not currently include an explicit open-source license. Public visibility does not itself grant reuse permission.