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
