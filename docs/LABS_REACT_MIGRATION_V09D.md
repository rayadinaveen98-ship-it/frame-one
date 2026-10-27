# Frame One v0.9D — React Creative Lab migration plan

**Baseline:** v0.9C verified browser QA (all 33 lessons, seven legacy labs and offline reload passed). Preserve that working baseline; do not replace all labs in one change.

## Non-negotiable invariants

- Keep the same seven lab experiences, original vector artwork, intended teaching limitations and accessible beginner explanations.
- Do not change storage keys: `frameone-progress-v01`, `frameone-practice-v07`, `frameone-scene-v07`; keep backup JSON compatible with v0.8B/v0.9C.
- Preserve available English and short Telugu help content, 33 lesson routes, lab deep links and keyboard/touch interaction.
- Never imply illustrations are real camera physics or movie footage. Audio must always be initiated by the user and stop on navigation.

## Migration sequence (one independently testable lab at a time)

1. **Continuity Lab** — smallest state model, two original illustrations, matching/mismatched prop. Migrate to React first and verify explanatory changes.
2. **Colour Lab** — reuse original illustration and compositing approach; controlled mode/overlay strength. Do not label a tint overlay as full colour grading.
3. **Frame Lab** — continuous crop slider, guide overlays, comparisons, carefully worded perspective limitations.
4. **Lighting Lab** — direction, intensity and shadow edge, with explicit illustration-only limitations.
5. **Cut Lab** — editable three-shot order/durations, safe timers, preview stop/unmount cleanup; ensure keyboard-friendly controls.
6. **Make Lab** — shot prompts, notes and original storyboard art, local persistence, export, backup compatibility.
7. **Sound Lab** — WebAudio synthesis behind user gesture, explicit ambience vs no-music distinction, proper AudioContext/source/timer cleanup on leave and pause.

## Implementation structure

- React `CreativeLabView` owns tab selection and route interoperability; labs under `src/components/labs/`.
- Each lab has a typed component and dedicated state and a deterministic render; prefer SVG and local WebAudio over new services.
- Move only the selected lab to React per pull request. Legacy runtime handles remaining labs until removed, and must not modify React-owned nodes.
- Keep tests in GitHub Actions, especially the real-browser suite. Ensure deep links from lessons still open the right lab after each conversion.

## Acceptance requirements for each migrated lab

- Same educational concept, wording/accuracy and original visuals at 1440px, 390px and 320px.
- Controls keyboard/touch accessible with correct labels, `aria-pressed`/state and visible focus.
- Lab state changes are deterministic; no audio or timers remain active after leaving the view.
- Legacy project backups, saved lesson notes and progress unaffected.
- New source regression checks and Playwright journey pass; screenshot review catches layout drift.
- Do not call a lab 'migrated' or 'production-ready' before both compiling and passing the journey.

## Remaining release gates after v0.9D

- Expert filmmaking and Telugu review; manual screen-reader and real-device testing.
- HTTPS PWA deployment, install/offline upgrades and restore across origins.
- Capacitor Android debug APK and Android device tests, then iOS build with macOS/Xcode and TestFlight.

## v0.9D first implementation checkpoint — 27 October 2026

- **React Continuity Lab implemented:** `src/components/labs/ContinuityLab.tsx`, preserving the original stylized desk/cup illustration, explanations, two prop position controls, connected lesson, and seven-lab tabs.
- **Explicit routing:** The old runtime emits `{page,lesson,lab}`, and the app shell shows Continuity only when `lab==='continuity'`. The legacy runtime leaves `#content` empty for the React-owned lab, preventing duplicated hidden tab bars. Other six labs remain legacy-owned without behavior changes.
- **State management:** Continuity choice is React state held in App (retained during tab-to-tab navigation), uses accessible `aria-pressed`, and does not touch progress, practice notes or storyboard storage.
- **Checks added:** `tests/verify-react-continuity.cjs` in `npm test`, updated legacy runtime contract, and compiled-browser test asserting React ownership, changed/matched cup and return navigation.
- **Acceptance: automated browser QA passed.** [GitHub Actions run 40449195578](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40449195578) verified the integrated React Continuity Lab, six legacy labs, 33 lessons, backup/offline behavior and mobile baseline. Desktop screenshot was inspected. A follow-up 320px/390px Continuity-specific screenshot check is also added; verify its run separately. Manual device/accessibility review remains open.
- **Continuity accepted.** Colour has now also passed browser acceptance; next migrate **Frame Lab**. Do not mark all seven labs migrated.

## Second implementation checkpoint — Colour Lab (accepted)

- React `ColourLab.tsx` owns overlay mode (neutral/warm/cool) and strength. Locally authored original bus-stop SVG is shared through `CinemaScene.tsx`; labels and colour-science disclaimers are preserved.
- The old global input listener was mistakenly setting the React overlay opacity to zero. Source and browser diagnostics confirmed the defect; propagation and legacy filtering were corrected and added to regression coverage.
- Verified **SUCCESS** [GitHub real-browser run 40451210219](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40451210219), with screenshots reviewed at 1440px, 390px and 320px. Full evidence: [QA_COLOUR_V09D.md](QA_COLOUR_V09D.md).
- **Current count: 2/7 React; 5/7 still legacy.** Next: Frame Lab, preserving original crop illustration and avoiding lens/perspective simulation claims.

## Third implementation checkpoint — Frame Lab (browser QA passed)

- React Frame Lab now owns modes, crop, guides and comparison. It reuses the same locally bundled SVG as Colour with distinct gradient identifiers for each illustration. Legacy input delegation explicitly ignores React Frame controls.
- Production Chromium automation verifies three presets, 1×–3× crop, SVG viewBox, two-image comparison, guide state, original data preservation and desktop/390px/320px navigation.
- [Run 40452193907](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40452193907) **passed** and [run 40452506346](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40452506346) **passed** the stacked-mobile-comparison refinement. Screenshots inspected; desktop sticky-preview polish passed [run 40452722135](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40452722135) and the screenshot was inspected.
- **3/7 labs migrated. Four remain: Lighting, Cut, Make and Sound.** Next migrate Lighting with the same exclusive-DOM and delegated-event protections. [Frame QA](QA_FRAME_V09D.md).

## Fourth implementation checkpoint — Lighting Lab

- Original vector portrait/drawn front/side/back illumination, modelled brightness and shadow edge controls migrated to React, using authored SVG markup and preserving original caveats and practice safety guidance.
- Legacy renderer/input events now explicitly skip React Lighting; eight Node suites and Chromium assertions check brightness darkening, side-shadow blur, direction, accessible sliders and 320px/390px layout.
- [GitHub Actions 40457618029](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40457618029) green and initial mobile/desktop screenshots inspected. A later desktop preview-height refinement is committed, pending a separate run and screenshot.
- **Current migration: 4/7 implemented, 3/7 legacy**. Next after final Lighting acceptance: **Cut**, then Make and Sound; continue to preserve legacy backup keys and audio/timer cleanup. [Evidence](QA_LIGHTING_V09D.md).

### Lighting final QA — verified (27 October 2026)

- **Full production/build/browser success:** [run 40458020383](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40458020383) on commit `2d74a86a3bb4b1e66ff1e354db59d42faf749d26`; includes a measurable desktop preview-size/alignment check and desktop/320px/390px screenshot captures.
- Reviewed the refined desktop image: the illustration is beside the controls without an exaggerated bordered blank preview panel. The 320px Lighting illustration and controls were also inspected.
- **v0.9D React migrations accepted so far: 4/7** — Continuity, Colour, Frame, Lighting. **Legacy labs remaining: Cut, Make, Sound**. Next migrate **Cut Lab** with special attention to timers, playback cancellation and saved lesson compatibility. Separate web hosting, Android APK, iOS, accessibility and expert-content gates remain open. [Detailed Lighting QA](QA_LIGHTING_V09D.md).

## Fifth implementation checkpoint — Cut Lab (accepted)

- Original three-shot timeline now React-owned with CSS storyboard artwork, current shot, hold lengths, editable shot order, reset, timed preview and explanatory activities.
- React's `useEffect` owns and cancels the playback timer on unmount, step changes, edits and user stop. The legacy engine has no control over React Cut markup or slider input; durations stay attached to shots when reordered.
- [GitHub Actions run 40460565715](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40460565715) **SUCCESS**: full lesson/lab/offline/backup smoke and native Cut tests; desktop and both phone screenshots inspected. [Complete report](QA_CUT_V09D.md).
- **5/7 migrated and browser-accepted.** Make and Sound remain in the old runtime. Next: **Make**—preserve all existing local `frameone-scene-v07` drafts and existing backup/restore validation. Sound remains final due to live WebAudio and timer cleanup.

## Sixth React Lab — Make implementation checkpoint (27 October 2026)

- **6/7 Creative Labs implemented in React**: Continuity, Colour, Frame, Lighting, Cut and Make. **Sound alone remains legacy-owned.** Make is still awaiting complete browser acceptance.
- Original three-beat storyboard editor migrated with story question, framing controls, notes, Save, text export and full original vector illustration. The original `frameone-scene-v07` JSON structure and backup format are unchanged.
- A typed React-to-legacy storyboard bridge keeps the original backup engine synchronized. A restoration event notifies React after a successful backup import, so visible text updates without a page reload.
- A tenth source regression suite and Chromium tests cover saved work, export, imported backup changes, route reopening and 320px/390px screenshots.
- Earlier test-only failures exposed stale assumptions about legacy markup and mock browser events; corrected. The **latest completed browser run is the acceptance gate**. [Make QA report](QA_MAKE_V09D.md).
- Next once accepted: Sound Lab, followed by deployment and real-device checks.

## Sixth implementation checkpoint — Make Lab (accepted)

- React Make editor uses the old legacy learning engine only as a storage and backup bridge. All original story question IDs, framing presets, three-shot notes, local data keys and export text template are preserved. Original SVG is locally bundled, with a scoped gradient ID.
- The legacy runtime now renders empty markup for six React labs and ignores their delegated inputs. Backup import dispatches `frameone:story-restored`; React refreshes its view from the original validated story. Existing drafts reopen intact.
- **Automated browser QA PASSED:** [GitHub 40462953360](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40462953360), ten Node source suites, all lessons/labs, storyboard save/export, old-format import, offline reload, responsive screenshots. Reviewed the desktop/320px/390px Make screenshots. [Full QA](QA_MAKE_V09D.md).
- **6/7 accepted; only Sound remains.** Next phase: native React Sound with WebAudio permission/user gesture controls, timers/sources/AudioContext closure on stop/unmount, offline fallback and real-device audio testing. All release gates remain independent. 

## Seventh implementation checkpoint — Sound and completed migration

- React Sound Lab retains all original listening choices and illustrative descriptions. Generated wave/noise is local, requires deliberate Play, has a five-second lifetime, and is explicitly separate from the No music option.
- Its engine stops active sources, closes AudioContext and cancels timers on Stop, mode/ambience change, and route unmount. The page also shows clear non-support and no-output messages. Original image and CSS sound-wave animation retained without leaked Frame Lab labels.
- The **eleventh regression suite**, production TypeScript/Vite build and Chromium tests **PASSED** in [40464897808](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40464897808), with the exact final polished source/visual assertions **PASSED** in [40465373226](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40465373226). Sound screenshots reviewed at desktop, 320px and 390px. [Sound QA](QA_SOUND_V09D.md).
- **7/7 migrated into React and automated-browser accepted.** No lab remains legacy-owned. The older runtime still handles other app functions and backward-compatible storage; deleting it is **not** included in v0.9D.
- **Next: v0.9E release integration** — PWA/HTTPS deployment, backup/update/offline verification, accessible UI audit, real-device audio, Android build/tests and iOS/macOS build. Independent filming-content accuracy and Telugu language review before a public launch.
