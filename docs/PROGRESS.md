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

## Sixth Creative Lab accepted — Make (27 October 2026)

- Moved Make's three-shot creative storytelling activity to React without breaking its original illustration, 240-character notes, selection controls, Save, shot-list text export or lesson link.
- Added a typed bridge that saves Make through the v0.7 legacy storyboard engine and broadcasts a React update after an old backup is restored, maintaining `frameone-scene-v07` and backup schema compatibility.
- Tenth source regression and production browser journey passed [GitHub Actions 40462953360](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40462953360), covering all 33 lessons, seven labs, save/export/backup restore, offline reload and 320px/390px screen layouts.
- Reviewed the final Make desktop and narrow-phone QA screenshots; the original visual teaching activity and editing controls remain usable. Real device/accessibility/expert review remains open.
- **6/7 React lab migrations accepted. Only Sound remains legacy.** Next: Sound migration, then HTTPS/PWA deployment, Android APK testing and iOS build. [Evidence](QA_MAKE_V09D.md).

## v0.9D milestone closed — all Creative Labs in React (27 October 2026)

- Completed the **seventh and final Sound Lab** with the original locally authored bus-stop artwork, three teaching modes, independently controlled synthesized ambience, user-initiated playback, no automatic audio, and five-second sound sketches.
- A dedicated React/Web Audio module owns the oscillator/noise sources, timer and AudioContext, cleaning them up on Stop, mode change and unmount. The old runtime delegates no audio UI rendering and never mutates React-owned Sound controls.
- Eleventh source regression suite plus actual compiled Chromium smoke tests count AudioContexts created and closed, confirm no sound resource allocation in silent mode, and cover original data/backups, 33 lessons, seven labs and offline reload.
- **Verified green:** [run 40464897808](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40464897808) for full audio behavior and [final run 40465373226](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40465373226) for clean desktop/mobile artwork after removing inherited Frame HUD labels. Visually reviewed desktop, 320px and 390px Sound screenshots.
- **React Creative Lab migration 7/7 = complete for automated web QA.** Next work is release engineering and manual quality gates; web hosting, real Android APK and iOS app not built in this milestone. [Full Sound QA](QA_SOUND_V09D.md).


## v0.9E — first Android debug APK successfully built (27 October 2026)

- **Verified** independent Android debug pipeline from GitHub source in [run 40474122825](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40474122825): Node 22, Java 21, Android SDK 36, npm source regressions, TypeScript/Vite and offline output, Capacitor 8 native generation, Gradle `:app:assembleDebug`, and APK bundle verification all passed.
- Uploaded `frame-one-android-debug-apk` (artifact ID `12719818584`; ZIP size 4,017,400 bytes; contains `app-debug.apk`) for installation by an Android tester.
- The Android workflow and QA handoff were reviewed in [PR #1](https://github.com/rayadinaveen98-ship-it/frame-one/pull/1) and squash-merged into `main` as `72928713f6bfcc843ec36fc2f6ad4d4a1ed45a49`. Web verification on the PR head also passed [40474122772](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40474122772).
- **Main-branch Android build independently VERIFIED:** [run 40474407084](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40474407084) **SUCCESS** after merge; `frame-one-android-debug-apk` artifact ID `12719424344` published. The reproducible APK pipeline is working on `main`.
- **Still open:** physical-device install/render/audio/offline/backup/TalkBack tests, permanent application ID and icons, verified production Cloudflare Worker URL and iOS build. This is **debug packaging**, not public-release acceptance.
- Details: [Android debug QA guide](ANDROID_DEBUG_CI.md).


## v0.9F reliability acceptance (27 October 2026)

- **Merged:** [PR #2](https://github.com/rayadinaveen98-ship-it/frame-one/pull/2) as commit `be10983ba128ce5da6f6f2c370c66203a3523690`.
- Practice drafts save automatically on text input, while the original `frameone-practice-v07` key and manual Save button remain compatible.
- Backup import now best-effort rolls back partial localStorage writes. Source regressions simulate storage failure during storyboard restoration and verify prior data remains intact.
- Added mobile safe-area CSS and pre-merge full browser CI.
- **Verified after merge:** [web verification 40478349107](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40478349107) **SUCCESS**; [compiled real-browser QA 40478349333](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40478349333) **SUCCESS**; [Android debug APK 40478349105](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40478349105) **SUCCESS**.
- Automatic stable public APK release [40478579858](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40478579858) **SUCCESS**: [latest APK release and checksum](https://github.com/rayadinaveen98-ship-it/frame-one/releases/tag/android-preview-latest). This supersedes older debug APK links for routine testing, but remains test-only.
- **Next:** independently confirm actual Cloudflare Worker URL/build success, then HTTPS PWA update/offline QA. Complete real-device Android audio, system bars, file backups, accessibility and iOS build. Still no store release or expert content signoff.
- Details: [v0.9F acceptance and limitations](QA_V09F.md), [revised release checklist](RELEASE_CHECKLIST.md).



## v0.9G portable backup acceptance (27 October 2026)

- **Merged** [PR #3](https://github.com/rayadinaveen98-ship-it/frame-one/pull/3) into main as `30ebb23c8e09f5126deb6bb1b82f40e9f3a8a4e8`.
- Learn now offers a user-initiated text copy/paste alternative for the exact original v1 learning backup, keeping progress/notes/storyboard storage and the original file export/import unchanged. Clipboard denial leaves a visible manual copy fallback. Pasted restores share schema validation and explicit overwrite consent.
- **Verified after merge:** [web 40480555312](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40480555312), [compiled Chromium 40480555273](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40480555273), [Android debug APK 40480555401](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40480555401), [GitHub public release publisher 40480801867](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40480801867): **all SUCCESS**.
- The same stable [latest Android APK release](https://github.com/rayadinaveen98-ship-it/frame-one/releases/tag/android-preview-latest) now contains the v0.9G debug APK, 4,382,199 bytes.
- **Still blocked:** No independently verified Cloudflare Worker production URL in available user records or connected tools. Real-device Android WebView clipboard/files, screen bars, speaker/headphones, signing update identity, accessibility and iOS are not yet accepted.
- Full details: [v0.9G QA](QA_V09G.md), [Cloudflare status](DEPLOYMENT_STATUS.md).


## v0.9H — safe in-app Back navigation (27 October 2026)

- [PR #4](https://github.com/rayadinaveen98-ship-it/frame-one/pull/4) merged as `ef8d4bc3e141f274307cac929510ab4173411209`.
- Phone header now offers an accessible **Back within Frame One** control outside Home; original legacy router stores app-local depth markers and safely handles direct lesson/lab links. No learning-data or curriculum schema changes.
- **Main checks all passed:** [web 40482599685](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40482599685), [desktop/mobile Chromium 40482599661](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40482599661), [Android debug 40482599668](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40482599668), [public APK publisher 40482775098](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40482775098): **all SUCCESS**.
- The stable [public Android test APK](https://github.com/rayadinaveen98-ship-it/frame-one/releases/tag/android-preview-latest) now includes v0.9H (4,382,543 bytes).
- **Still pending:** native hardware/gesture Back integration and real-device acceptance, fixed test signing for upgrades, exact Cloudflare Worker production URL, Safari/iOS and editorial review. Read [v0.9H QA](QA_V09H.md).


## v0.9I — Android system Back and signing-certificate QA (27 October 2026)

- [PR #5](https://github.com/rayadinaveen98-ship-it/frame-one/pull/5) merged as `82bcf861afb2355158d48036d524f8bf7d7a50fc`.
- Implemented official `@capacitor/app@8.1.2` plugin and Android-only Back handler; delegates within lessons/labs, minimizes at Home. No changes to course content or local-storage schemas.
- Android debug builds optionally accept a protected `FRAMEONE_QA_DEBUG_KEYSTORE_B64` secret on trusted main runs, and publish their signing-certificate fingerprint and persistent-signer YES/NO alongside APK. **The secret is not yet configured; current builds use temporary signing identities and may not upgrade over one another.**
- **Main-branch acceptance:** [web 40486968443](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40486968443), [Chromium desktop/mobile 40486968447](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40486968447), [Android build 40486968418](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40486968418), [stable release 40487176493](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40487176493): **all SUCCESS**.
- The [latest public test APK](https://github.com/rayadinaveen98-ship-it/frame-one/releases/tag/android-preview-latest) is v0.9I, 4,391,455 bytes, with SHA-256 and signing-certificate receipts.
- **Next release gates:** secret-backed QA identity and two-build in-place Android installation; actual native system Back and edge gesture tests; Android offline/audio/backup acceptance; Cloudflare Worker exact production URL verification; iOS and editorial signoff. [Full v0.9I QA report](QA_V09I.md).


## v0.9J — Android native emulator acceptance (27 October 2026)

- [PR #6](https://github.com/rayadinaveen98-ship-it/frame-one/pull/6) merged as `ac7df213fc5a62efaa3aad0d5f87c3904462a18f`, adding `scripts/android-emulator-smoke.py` and the maintained Android API 35 emulator CI workflow.
- Two complete [first PASS 40490569350](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40490569350) and [repeat PASS 40491292091](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40491292091) runs installed Frame One in a real Android emulator, navigated Home → Learn → Lesson and Creative Lab, pressed Android system Back, and verified Home minimize without process exit.
- Android emulator acceptance now guards relevant application/native changes. Evidence includes screenshots, Android UI hierarchies and foreground-activity logs.
- This is a QA improvement only; the latest installable public Android debug build is **v0.9I**. Learner content and local data formats remain unchanged.
- Remaining acceptance: **physical phone** swipe/gesture Back, audio/file backup, update signing identity and in-place upgrade, Cloudflare live HTTPS deployment, Safari/iOS and educational/Telugu accuracy review. [v0.9J report](QA_V09J.md).


### v0.9J main-branch confirmation

The independent [main Android emulator run 40492047719](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40492047719) **PASSED** the same native lesson/Lab/system Back/Home minimize acceptance. Native Back has now passed **three complete emulator runs** in total. To avoid needlessly re-signing and re-publishing the public test APK for QA-only changes, `.github/workflows/android-debug.yml` was restricted to app/build-source paths. Real phone gestures/audio/backup and stable signing remain pending.


## v0.9K — Android lesson notes survive force-stop + offline cold-start (27 October 2026)

- [PR #7](https://github.com/rayadinaveen98-ship-it/frame-one/pull/7) squash-merged test-only CI and native UIAutomator helper as `a6b585ab2d0e44df017b32a812fc11bc04e916cb`.
- `scripts/android-emulator-persistence.py` uses a real Android API 35 WebView, types a unique learner practice note, force-stops Frame One, enables airplane mode, relaunches it and verifies the same note remains available. Restores emulator network settings before the existing native Back test.
- Native emulator suites passed on **three independent branch runs**: [40494188012](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40494188012), [40494209385](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40494209385), and [final 40494253148](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40494253148). The full compiled browser suite [40494253063](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40494253063) and source/web build [40494252907](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40494252907) also passed.
- The existing Home minimize test proved sensitive to native activity transition timing; it now checks the actual foreground activity with bounded polling. This preserves, rather than removes, the strict minimize assertion.
- **No application or storage-key changes** and no separate v0.9K APK. Latest app code is still v0.9I. Full [v0.9K QA report](QA_V09K.md).
- **Pending acceptance:** JSON backup download/restore, completed-progress and storyboard persistence, physical phone audio and gestures, two-version signed Android upgrade, actual Cloudflare production site and iOS testing.
