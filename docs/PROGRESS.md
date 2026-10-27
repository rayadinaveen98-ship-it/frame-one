# Frame One progress — 27 October 2026

**Verified now:** public Git repository, roadmap/accuracy/architecture documentation, nine previous browser prototype snapshots, v0.9 static preview, and the **byte-exact v0.9B React source ZIP** at [releases/frame-one-v09b-source.zip](../releases/frame-one-v09b-source.zip). Original ZIP SHA-256: `ee9ab5e2a9f5448ddad559241b5b0fa1dbdadc6b2f7e6efa737d137ba86a561f`; Git blob SHA-1: `1d6b345f0a56ee8e21980fd517eb15812e250c00`.

**Current implementation:** 33 drafted lessons in 6 chapters, 7 interactive labs, 47 film terms, 9 roles, optional Telugu helpers, private local progress/notes/storyboards and manual learning backup. React lesson/chapter/glossary views were migrated in v0.9A/B; labs/home/crew map continue via original legacy bridge.

**Build and release facts:** four local Node source checks passed on 27 October 2026, but npm registry was unavailable then. This **does not verify** the React/Vite production build, native Capacitor shells, browser/device layouts, real offline caching, expert English/Telugu review or public hosting. **No APK/IPA or production URL exists.**

**Source expansion: COMPLETE.** GitHub Actions produced commit [053d3fd](https://github.com/rayadinaveen98-ship-it/frame-one/commit/053d3fde0e1b77833fd080dc4fd687b6589f1261) with the extracted React/Capacitor source tree; important paths were independently fetched. The exact v0.9B ZIP is also retained. **Historical source recovery: COMPLETE.** All 12 older source snapshots are stored in the compressed development-history archive. The web build passed on 27 October 2026 in [GitHub Actions](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40440890519) including `npm install`, four `npm test` suites, TypeScript, Vite build and uploaded `frame-one-web-dist` artifact. This does not verify actual device rendering or a hosted release.

**Next:** run real browser/device visual and offline/audio/backup QA; commit a reproducible dependency lockfile; review all lessons with film/Telugu experts; deploy the web PWA; generate and test Android APK; build iOS through Xcode.

## 27 October 2026 — v0.9C QA hardening

- **Committed:** Playwright desktop/mobile browser smoke test with CI screenshot artifacts, coverage of 33 lessons, seven labs, quiz progress, JSON backup export/cancelled restore, offline reload and 390px/320px viewport checks.
- **Committed:** explicit consent before overwriting local data with a backup, and accurate export availability messaging; additional regression assertions.
- **Committed:** generated `package-lock.json`, with web and browser workflows switched to `npm ci` for reproducible installs.
- **Verification boundary:** These QA tools are committed, but a passing browser QA run and human inspection of screenshots are **not yet verified**. Prior web build passed; a green current build, real-device checks and an Android APK/IPA are still separate gates.
- Detailed matrix: [QA_V09C.md](QA_V09C.md).
