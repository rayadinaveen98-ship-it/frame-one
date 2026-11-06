# Frame One 2.0 — Production-default Option B cutover (Phase 3A)

**Status:** stacked draft after #89, not published or production signed.

## What actually changes on launch

- A normal Frame One launch opens the **real** illustrated Option B filmmaking course, not the separate six-mission design demo and not an iframe of the approved static reference.
- The learner starts on a genuine Home screen with original Option B art, a progress bar counting **33 canonical real lessons** from `frameone-progress-v01`, an automatic next unfinished chapter, six directly selectable chapters, and a direct link to the seven **original working** production Creative Labs.
- The bottom navigation stays inside the real React course: **Home** (genuine), **Journey** (selected real chapter), **Create** (actual 7-lab launcher) and **Progress** (genuine 33-lesson records and six chapter totals). No demo points are counted or exposed in the learner-facing experience.
- Every lesson is still completed through the existing `OptionBFoundationMission` (all six chapter lesson IDs), which calls the original `frameOneLegacy.completeGuidedFoundation`/practice-notes adapter; no user-data migration or new localStorage key.
- Opening a lab leaves the immersive course, opens the original React editor and returns the learner to the exact chapter they came from, with unchanged backup records.
- The production presentation fills the real desktop/tablet/phone viewport, rather than using the reference's bordered phone mockup; its CSS is loaded **only** in the production shadow root, so the approved pixel comparison remains locked.

## Safety and fallback

- **Classic library** is an explicit real button at the top of the production course. It navigates to the existing main Home and retains all old chapter routes, offline notes, project management, backup/import/export and assistive controls.
- A visible **Open your new Frame One journey** button lets learners switch back from Classic without uninstalling or resetting anything.
- The old Option B `option-b-v1.html` design reference and its React side-by-side pixel comparison are still available from the Classic Learn screen, clearly marked as a prototype, rather than shipped as the default UX.
- `?classic=1` is a nonpersistent, URL-only escape hatch for legacy browser regression and troubleshooting. It does **not** mutate saved progress, lessons or backup keys.
- The original four-second offline cinematic launch ident still appears above the new course when motion reduction is not enabled. A fresh app is not permitted to display or activate working lessons before the original offline bridge is available.
- The new screen does not claim to have filmed a real production or record media on behalf of the learner.

## Required acceptance

1. The separate `tests/verify-v2-production-default.cjs` source contract checks true real-data default, six chapters, 33 lessons, valid seven-lab route/return and Classic fallback.
2. Real Chromium at desktop, 390px and 320px starts at **/**, asserts no reference iframe or demo points, six chapters, real progress, a Chapter 6 launch, Progress screen, real Frame Lab, Chapter 6 return, unchanged JSON backup and reversibility to Classic. Test screenshots are `40-production-home-1440px.png`, `40-production-home-390px.png`, `40-production-home-320px.png`.
3. The **entire old browser regression** still runs on `/?classic=1` in its own profile and confirms historic lesson/editor behavior and all approved 27 visual parity states.
4. Android native UI test must first confirm the real 33-lesson production Home and explicitly tap its accessible **Classic library** button before continuing the old progress, lessons, storyboard, offline-restart, same-signer and DocumentsUI backup/restore acceptance.
5. All seven workflows—web, browser, Android APK, emulator, historical upgrade, same-signer update and full-system backup/restore—must be **green at the same commit**, with no weakened verification.
6. A green APK remains a **CI debug APK signed by a temporary runner certificate** unless a persistent signer is provisioned. Do not uninstall the older app or promise in-place upgrade compatibility. Production signing and real phone QA are still separate phases.

## Next phases

- Phase 3B: visual/a11y polish of default desktop + 390/320 course and native Android back/focus/safe-area flows, manual screenshot review with original art reference.
- Phase 4: persistent QA/release signing and verified in-place installed-device upgrade; add rollback and backup instructions.
- Phase 5: production AAB, privacy/data safety/permissions, Play Store listing and closed testing, with no pay-to-run service assumptions.
