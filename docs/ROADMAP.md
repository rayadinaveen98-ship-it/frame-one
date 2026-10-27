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
| **v0.9B** | **React chapter browser/search/glossary, source checks, offline cache builder, CI design** | **Current source milestone; not compiled/released** |

## Forward release gates
1. **R1 — Build:** Restore complete v0.9B source on GitHub; generate lockfile; run `npm install`, `npm test`, `npm run build` in connected CI; resolve type/build issues.
2. **R2 — Web QA:** Test all 33 lessons, 7 labs, audio, backup/restore, responsive/mobile viewports, safe areas, keyboard and offline PWA in real browsers.
3. **R3 — React lab modernization:** Convert the remaining seven labs, home and crew map into maintainable React components, preserving interaction.
4. **R4 — Content signoff:** Professional filmmaker/educator and Telugu reviewer validate technical claims, quizzes, history and translations.
5. **R5 — HTTPS web launch:** Host PWA; verify deployment, caching, rollback and privacy.
6. **R6 — Android:** Confirm permanent package ID, Capacitor Android project, debug APK and on-device tests.
7. **R7 — iOS:** macOS/Xcode shell, on-device testing, signing and TestFlight where appropriate.
8. **R8 — Beginner pilot:** Observe actual comprehension and usability, fix launch blockers.

**Do not call React production-ready, Android-ready or iOS-ready before their build and QA gates pass.**
