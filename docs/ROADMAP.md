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

## v0.9D implementation checkpoint — 27 October 2026

- **2/7 Creative Labs migrated into React:** Continuity Lab component, original desk artwork, interactive choice, accessible state and lesson link committed; source test coverage added.
- **5/7 Creative Labs remain on proven legacy runtime:** Frame, Lighting, Cut, Make and Sound. Original saved progress/storyboards and 33-lesson course preserved.
- Exclusive DOM ownership and explicit lab route event implemented; tests now cover migration boundary.
- **Automated acceptance PASSED:** [GitHub Actions run 40449195578](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40449195578) passed after fixing navigation and exclusive DOM ownership; desktop Continuity screenshot inspected. Mobile Continuity-specific screenshots were added as a follow-up test; real-device and manual accessibility reviews remain open.
- Next: Frame Lab migration, then the remaining four per [v0.9D plan](LABS_REACT_MIGRATION_V09D.md). Full acceptance evidence: [QA_V09D.md](QA_V09D.md).

### Second React lab — Colour (accepted)

- Implemented the original bus-stop scene as locally bundled vector artwork, neutral/warm/cool comparisons and a React-owned overlay slider. The old legacy document-level input listener was found forcing the React tint to zero; both handlers now enforce exclusive ownership.
- Sixth source-test suite and Chromium desktop/390px/320px comparisons added; [full GitHub browser QA 40451210219](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40451210219) **PASSED** after the fix. Screenshots inspected: the original artwork and cool overlay are visible without horizontal overflow.
- **Migration: 2/7 labs accepted**; five remain on the original runtime. See [Colour QA evidence](QA_COLOUR_V09D.md).

## Third React Lab — Frame (browser QA passed)

- **3/7 Creative Labs now implemented in React:** Continuity, Colour and Frame. **4/7 remain legacy-owned:** Lighting, Cut, Make and Sound.
- Frame Lab retains original bus-stop SVG, wide/medium/close preset crops, controlled 1×–3× slider, framing guides, original comparison mode and connected Sound/shot lesson links. Cropping is explicitly not a camera move or lens simulation.
- [GitHub Actions 40452193907](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40452193907) **PASSED** the full production build, 33 lesson completions, seven labs, offline and backup checks.
- [GitHub Actions 40452506346](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40452506346) **PASSED** after adding a test that 320px/390px comparison images stack and omit crowded monitor labels. Desktop and phone screenshots inspected.
- The desktop sticky-preview polish also passed [GitHub Actions 40452722135](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40452722135) and its screenshot was reviewed.; manual real-device, screen-reader and filmmaking-content signoff still pending. Full details: [Frame QA report](QA_FRAME_V09D.md).
- **Next migrated lab: Lighting.** Protect original illustration and direction/intensity controls; complete one React lab at a time.

## Fourth React lab — Lighting implementation (27 October 2026)

- **4 of 7 Creative Labs now implemented in React:** Continuity, Colour, Frame and Lighting; **3 of 7 still legacy-owned:** Cut, Make and Sound.
- React Lighting reuses the actual original v0.8B authored vector, with front/side/back modes, illustrated brightness, shadow softness and the safe real-world practice text. Legacy event delegation excludes native React lighting controls; saved progress, notes and storyboard identifiers remain untouched.
- **Verified green full browser run:** [40457618029](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40457618029), including complete lessons, seven labs, backup/offline and phone screenshots.
- Initial screenshot inspection found excessive desktop preview whitespace; refined panel sizing and added explicit measured geometry assertions in a later commit. **That latest refinement requires its own passing CI run and visual review.**
- Next: **Cut Lab** after final Lighting screenshot acceptance. Real-device, screen-reader, subject-expert and Telugu review, hosting and Android/iOS builds remain separate release gates. [Detailed QA](QA_LIGHTING_V09D.md).

### Lighting final QA — verified (27 October 2026)

- **Full production/build/browser success:** [run 40458020383](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40458020383) on commit `2d74a86a3bb4b1e66ff1e354db59d42faf749d26`; includes a measurable desktop preview-size/alignment check and desktop/320px/390px screenshot captures.
- Reviewed the refined desktop image: the illustration is beside the controls without an exaggerated bordered blank preview panel. The 320px Lighting illustration and controls were also inspected.
- **v0.9D React migrations accepted so far: 4/7** — Continuity, Colour, Frame, Lighting. **Legacy labs remaining: Cut, Make, Sound**. Next migrate **Cut Lab** with special attention to timers, playback cancellation and saved lesson compatibility. Separate web hosting, Android APK, iOS, accessibility and expert-content gates remain open. [Detailed Lighting QA](QA_LIGHTING_V09D.md).

## Fifth React Lab — Cut accepted (27 October 2026)

- **5/7 Creative Labs migrated and browser-accepted:** Continuity, Colour, Frame, Lighting, Cut. **2/7 remain legacy-owned:** Make and Sound.
- Cut Lab now uses React for its original three storyboard illustrations, clip order, per-shot duration, frame preview, previous/next controls, playback and reset. Moving a clip carries its hold duration. Playback is a timed storyboard, not filmed motion, with a cancellable timer that is cleaned up on route/unmount.
- **Verified green GitHub Actions:** [40460565715](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40460565715) ran nine source suites, TypeScript/Vite production compilation, all 33 lesson journeys, all seven labs, backup/offline and the Cut timeline/timer tests.
- Reviewed desktop/320px/390px screenshots: original illustrations, timeline controls and explanations remain usable without material width overflow. [Cut acceptance report](QA_CUT_V09D.md).
- **Next React migration:** Make/storyboard Lab, preserving existing `frameone-scene-v07` storage and JSON backup compatibility. After Make, Sound requires extra testing of WebAudio and cancellation. Hosted release, Android and iOS builds still pending.
