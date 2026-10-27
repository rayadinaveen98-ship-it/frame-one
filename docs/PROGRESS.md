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

## v0.9C confirmed browser QA results — 27 October 2026

- Fixed Chromium installer failure by pinning GitHub browser QA to Ubuntu 24.04. Initial CI failure was an unsupported Ubuntu 26.04 host, not an application regression.
- Confirmed GitHub Action success [40446779201](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40446779201) for desktop/mobile navigation, seven labs, saved data, backup export, cancelled import and offline reload.
- Confirmed [40447097918](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40447097918) after implementing one-chapter-at-a-time mobile learning navigation; screenshot review shows a clearer small-screen course explorer.
- Confirmed [40447171261](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40447171261) exercising and completing all 33 rendered lessons with saved progress.
- **Next:** v0.9D convert seven legacy Creative Labs into typed React components, maintaining animation and audio behavior. Before public release: manual accessibility/device checks, expert factual and Telugu review, actual HTTPS/PWA install and native Android/iOS builds.
- Full QA receipts and screenshot evidence: [QA_V09C.md](QA_V09C.md), [QA_LATEST_RUN.md](QA_LATEST_RUN.md).

## v0.9D development update — 27 October 2026

- React Continuity Lab (`src/components/labs/ContinuityLab.tsx`) committed with original teaching visuals and React-managed mismatch state.
- Explicit legacy-to-React lab routing, exclusive DOM ownership, fifth source test and new Chromium QA assertions committed.
- Six creative labs remain implemented in legacy JavaScript; they are **not yet migrated**.
- **React Continuity Lab automated QA passed** in [GitHub Actions 40449195578](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40449195578); inspected desktop screenshot and verified a single React-owned Continuity page without duplicated legacy content. Manual mobile-device and accessibility review remain open.
- Detailed evidence and remaining gates: [QA_V09D.md](QA_V09D.md).

## v0.9D second lab accepted — 27 October 2026

- **Colour Lab migrated into React:** original local SVG drawing, three colour overlays, a controlled intensity slider, accurate illustration-only educational caveat and responsive layout.
- Found and fixed an actual integration defect where the old document-level input listener overwrote the new React overlay opacity with zero. Guarded both React events and the legacy delegated handler; added the sixth source regression.
- **Verified GitHub Actions SUCCESS:** [run 40451210219](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40451210219), with full 33-lesson sweep, seven labs, offline and backup checks, and Colour screenshots reviewed at desktop/390px/320px.
- **2 of 7 labs now migrated into React:** Continuity, Colour. **5 legacy labs remain:** Frame, Light, Cut, Make, Sound. Next migration: Frame Lab. No hosted web app or native Android/iOS builds yet.
- Detailed [Colour Lab acceptance report](QA_COLOUR_V09D.md).

## v0.9D third React Lab — Frame (27 October 2026)

- Frame Lab converted from original JavaScript into React with interactive crop zoom, three presets, framing guides, compare mode and original vector art; all old learning-data keys remain intact.
- Shared `CinemaScene.tsx` now derives a bounded crop viewBox without changing the original artwork. Cropping does not simulate lens or perspective physics.
- Added seventh source test and Chromium tests for lab ownership, keyboard slider, SVG cropping, comparison and narrow-phone readability.
- **Verified:** production + browser tests green in [run 40452193907](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40452193907), layout refinement checks green in [40452506346](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40452506346).
- QA screenshot review led to larger, vertically stacked mobile comparisons, removal of redundant small-image labels, and desktop preview spacing adjustment (last desktop CSS modification subsequently passed [run 40452722135](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40452722135) and its screenshot was inspected).
- **React migration 3/7:** Continuity, Colour, Frame. **Legacy remaining 4/7:** Lighting, Cut, Make, Sound. Web hosting, Android APK and iOS builds not yet performed. [Details](QA_FRAME_V09D.md).

## Fourth Creative Lab migrated to React — Lighting (27 October 2026)

- Added typed `LightingLab.tsx` and `LightingScene.tsx` with the original light-direction, brightness and shadow-softness teaching illustration (not real physics).
- React holds lighting state; original legacy content/render and global input handlers yield to the React-owned lab, protecting earlier 33 lessons and saved data. Eight Node regression suites and Chromium tests cover artwork, controls, navigation and small-screen layouts.
- [GitHub Action 40457618029](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40457618029) **SUCCESS** on the first complete Lightning source/browser flow. Desktop/320px screenshots inspected; mobile image is readable.
- Screenshot review identified excessive desktop empty preview area. CSS and a measurable browser QA assertion have been added; final run/screenshot still requires separate verification.
- **React implementation 4/7**, legacy labs **3/7: Cut, Make, Sound**. Latest plans and open QA gates: [Lighting QA](QA_LIGHTING_V09D.md). Web hosting, Android APK and iOS not started.

### Lighting final QA — verified (27 October 2026)

- **Full production/build/browser success:** [run 40458020383](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40458020383) on commit `2d74a86a3bb4b1e66ff1e354db59d42faf749d26`; includes a measurable desktop preview-size/alignment check and desktop/320px/390px screenshot captures.
- Reviewed the refined desktop image: the illustration is beside the controls without an exaggerated bordered blank preview panel. The 320px Lighting illustration and controls were also inspected.
- **v0.9D React migrations accepted so far: 4/7** — Continuity, Colour, Frame, Lighting. **Legacy labs remaining: Cut, Make, Sound**. Next migrate **Cut Lab** with special attention to timers, playback cancellation and saved lesson compatibility. Separate web hosting, Android APK, iOS, accessibility and expert-content gates remain open. [Detailed Lighting QA](QA_LIGHTING_V09D.md).

## Fifth React Creative Lab accepted — Cut (27 October 2026)

- Cut Lab converted to native React with three illustrated shot cards, drag-free move-left/right timeline buttons, each shot's individual hold length (1–5 seconds), preview playback, stop/reset, connected film editing lesson and original interpretive explanations.
- Timed previews now have an effect-owned timer that is cancelled when playing stops, a shot changes, or the user leaves the lab. No timer or sound work is left running behind an unmounted Cut Lab.
- Nine Node source suites and compiled Chromium QA passed in [GitHub Actions run 40460565715](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40460565715). Viewed mobile (320px, 390px) and desktop screenshots; no material horizontal overflow.
- **5/7 React labs browser-accepted:** Continuity, Colour, Frame, Lighting, Cut. **Remaining two original-engine labs:** Make and Sound. Learner progress, practice notes, storyboard key and backup schema remain intact.
- Next: migrate **Make**, then **Sound**. Separate native packaging, HTTPS hosting, real-device audio/accessibility and educational/editorial checks remain open. [Cut QA](QA_CUT_V09D.md).

## Sixth React Lab — Make implementation checkpoint (27 October 2026)

- **6/7 Creative Labs implemented in React**: Continuity, Colour, Frame, Lighting, Cut and Make. **Sound alone remains legacy-owned.** Make is still awaiting complete browser acceptance.
- Original three-beat storyboard editor migrated with story question, framing controls, notes, Save, text export and full original vector illustration. The original `frameone-scene-v07` JSON structure and backup format are unchanged.
- A typed React-to-legacy storyboard bridge keeps the original backup engine synchronized. A restoration event notifies React after a successful backup import, so visible text updates without a page reload.
- A tenth source regression suite and Chromium tests cover saved work, export, imported backup changes, route reopening and 320px/390px screenshots.
- Earlier test-only failures exposed stale assumptions about legacy markup and mock browser events; corrected. The **latest completed browser run is the acceptance gate**. [Make QA report](QA_MAKE_V09D.md).
- Next once accepted: Sound Lab, followed by deployment and real-device checks.
