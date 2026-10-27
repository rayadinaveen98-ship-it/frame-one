# Frame One roadmap — 27 October 2026

## Mission
Help complete beginners understand filmmaking through accurate, simple explanations, original visual experiments, creative decisions and making a short scene. Keep learning approachable rather than loading the app with technical jargon or gamification.

## Milestones
| Version | Scope | State |
|---|---|---|
| v0.1–0.2 | First 8 lessons, original frame/sound demos, terminology cleanup | Prototype complete |
| v0.3–0.4 | Cut and Lighting Labs, glossary, Telugu helpers, better navigation | Prototype complete |
| v0.5 | Six-chapter structure, 13 lessons, in-lesson choices, cut timeline | Prototype complete |
| v0.6 | Animated SVG illustration, continuous framing, lighting/audio controls | Prototype complete |
| v0.7 | Make Lab storyboards, draft persistence and shot list, craft map | Prototype complete |
| v0.8 | 23 lessons, backup/restore, new glossary | Prototype complete |
| v0.8B | 33 lessons, seven labs, colour and continuity demonstrations | Prototype complete |
| v0.9 | Web app/React/Capacitor scaffolding and static PWA | Source milestone |
| v0.9A | React lessons, quizzes, summaries, practice notes | Source milestone |
| v0.9B | React chapters, lessons, quizzes, glossary and offline cache builder | Source migrated; GitHub web build passed |
| **v0.9C** | **Real-browser QA, 33-lesson sweep, seven-lab checks, compact mobile chapters, data safeguards** | **Automated browser QA passed; manual device checks remain** |

## Forward release gates
1. **R1 — Web build (achieved):** Full v0.9B source on GitHub; npm install, four source suites, TypeScript and Vite production build passed in [GitHub Actions](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40440890519). **Reproducibility follow-up:** generate/commit lockfile.
2. **R2 — Web QA (automated browser smoke passed):** Added automated Chromium desktop + 390px/320px smoke tests and screenshot collection in GitHub Actions (`scripts/browser-smoke.cjs`, `.github/workflows/browser-qa.yml`). The suite navigates React chapters/lessons, completes a quiz, visits seven labs, manipulates frame/colour sliders, verifies backup export and checks mobile overflow. **GitHub runs [40446779201](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40446779201) and [40447171261](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40447171261) passed. Mobile screenshots were inspected and the mobile course list was simplified.** Additional testing remains for actual audio playback, import/restore, keyboard/screen reader and offline upgrades.
3. **R3 — React lab modernization:** Convert the remaining seven labs, home and crew map into maintainable React components, preserving interaction.
4. **R4 — Content signoff:** Professional filmmaker/educator and Telugu reviewer validate technical claims, quizzes, history and translations.
5. **R5 — HTTPS web launch:** Host PWA; verify deployment, caching, rollback and privacy.
6. **R6 — Android:** Confirm permanent package ID, Capacitor Android project, debug APK and on-device tests.
7. **R7 — iOS:** macOS/Xcode shell, on-device testing, signing and TestFlight where appropriate.
8. **R8 — Beginner pilot:** Observe actual comprehension and usability, fix launch blockers.

**v0.9C data-integrity safeguard:** Backup import now requires confirmation before overwriting local work, and backup export reports an unavailable engine instead of a false success. Source regression checks were extended.

**Do not call React production-ready, Android-ready or iOS-ready before their build and QA gates pass.**

## v0.9C gate outcome — 27 October 2026

- Completed: production-built browser smoke in GitHub Actions, all 33 rendered lesson completion flows, controls in all seven labs, local backup export/cancelled restore, offline reload, desktop and 320/390px browser layouts.
- Completed: screenshot-driven mobile chapter disclosure reducing long scrolling; verified in GitHub Actions.
- Still open: dedicated real-device Android/iOS/Safari checks, comprehensive keyboard/screen-reader audit, actual sound output, successful cross-origin backup migration, expert content review and production HTTPS deployment.
- Next implementation phase: **v0.9D React Creative Lab migration**, incrementally replacing the legacy lab runtime, one lab at a time, without changing saved progress or storyboards.
