# Frame One v0.9C — Browser Quality Assurance

**Started:** 27 October 2026  
**Status:** Automated browser suite and data-safety fixes committed; first passing Playwright run and screenshot review have **not** been independently verified.

## Implemented in GitHub

- `scripts/browser-smoke.cjs`: Starts the **compiled** Vite site, drives Chromium on desktop and two mobile widths, and captures full-page screenshots.
- `.github/workflows/browser-qa.yml`: Runs the test on GitHub Actions, collecting screenshots even after failure.
- `package-lock.json`: Lockfile generated and committed using a one-time GitHub Actions workflow.
- CI workflows now use `npm ci` to install from the lockfile rather than resolving drifting dependency versions.
- `src/components/LearnView.tsx`: Asks before replacing existing local learning data during backup restoration; backup export no longer reports success before the legacy engine is available.
- `tests/verify-react-chapters.cjs`: Regression checks for the backup safety controls.

## Browser test coverage

1. Load the production-built homepage and detect uncaught browser exceptions.
2. Navigate to React chapters; verify 33 lesson entries.
3. Open first lesson, answer its quiz, mark complete and confirm that the **existing** local progress key is used.
4. Visit **all seven** creative labs; exercise Frame and Colour sliders.
5. Export a JSON backup. Attempt a restore, cancel at the confirmation dialog and verify existing progress is unchanged.
6. Verify offline reload of the cached compiled homepage under network-offline conditions.
7. Navigate on 390px and 320px mobile viewports; capture chapter and lab screenshots, report horizontal overflow.

Artifacts, when a workflow run succeeds or fails: `frame-one-browser-qa-screenshots`. Captures are QA evidence, not final marketing images.

## Still unverified / not implemented

- A green real-browser GitHub Actions run and human screenshot review.
- Keyboard-only accessibility, screen reader labeling, reduced-motion behavior and Android WebView/iPhone Safari testing.
- Real synthesized audio playback/stop and permission behavior on phones.
- End-to-end *successful* backup restore, cross-origin transfer and data migration testing.
- PWA install flow, worker upgrades and cache invalidation on an actual HTTPS deployment.
- Content review by filmmaking and Telugu-language educators.
- Individual migration of the seven remaining legacy labs into React.
- Production hosting, Android APK, iOS build, signing and store preparation.

## Gate to v0.9D

Do not mark **R2 Web QA** as passed until the browser workflow is visibly green and the screenshots have been inspected for rendering/navigation defects. Do not ship native apps simply because React compiles.

## Additional v0.9C regression work (27 October 2026)

- Added keyboard/screen-reader focus restoration to the active page heading after SPA route changes in `src/App.tsx` (without stealing focus on initial home mount), plus source and Playwright focus assertions.
- Expanded the Playwright smoke journey to save a practice note, navigate away, reload, return to the lesson and verify that the note persists; checks browser-back return to the chapter explorer.
- Retrieved the **prior successful** web build artifact from GitHub Actions run [40440890519](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40440890519). Inspected the actual artifact ZIP: `index.html`, hashed React JS/CSS, separate legacy runtime bundle, service worker, manifest, icons and scene art. The service worker lists ten local precache items and **all ten paths exist in the ZIP**. This is offline-*asset completeness*, not proof that a device can reload offline.
- Reflected React focus and backup-consent changes in a local source mirror and ran the four existing `npm test` suites successfully. Full React production rebuild remains to be confirmed on the latest commit.
- Attempted Chromium against the compiled artifact in the local tool environment; navigation was blocked by `net::ERR_BLOCKED_BY_ADMINISTRATOR`. Real-browser QA is therefore still open and must run in GitHub Actions or an unrestricted test environment.

**Do not infer a green browser QA run from the existence of the workflow file or from prior green Vite compilation.**

## Seven-lab interaction coverage added

The Playwright workflow now goes beyond mounting the labs: it drives framing crop and colour strength; selects side lighting and changes brightness; moves a timeline clip and starts/stops preview; changes a storyboard shot and checks local draft persistence; toggles a continuity difference; and disables Sound Lab ambience. These are **committed test assertions**, not confirmed green browser results.

On a local source mirror, four Node regression suites pass after adding SPA heading-focus handling and backup safety checks. A previously successful compiled build artifact was inspected for complete offline cache paths. The latest browser and device results remain the outstanding release gate.

## Verified v0.9C browser results — 27 October 2026

- **Initial failure identified and resolved:** Browser run [40443899960](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40443899960) failed before testing the app because Playwright 1.55.1 could not install Chromium on an Ubuntu 26.04 runner. Pinning the QA job to **Ubuntu 24.04** resolved that infrastructure incompatibility.
- **First green real-browser QA:** [40446779201](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40446779201) passed (tests of React navigation, all seven labs, data safety, offline reload and mobile widths). Screenshot artifact: `12709031057`.
- **Mobile chapter explorer improved:** The initial 320px full-page screenshot was **18,650px** tall because all six chapters were expanded. A mobile-only, accessible one-chapter-at-a-time disclosure now preserves all desktop content while shortening the 320px screenshot to **7,662px**. The revised layout and interaction passed [40447097918](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40447097918), screenshot artifact `12709175226`. Its 390px screenshot was manually inspected for hierarchy, readability and controls.
- **33 lesson sweep passed:** [40447171261](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40447171261) successfully exercised all 33 rendered lesson pages, correct quiz answers and persisted completions, alongside the existing seven lab checks. Screenshot artifact: `12708134388`.
- **Latest script hardening:** The follow-up change [72fdb6a](https://github.com/rayadinaveen98-ship-it/frame-one/commit/72fdb6a41224992ffb1ead6a9aa123a32d59b060) waits for each new lesson heading before asserting its contents. This exact final commit's run must be evaluated separately; do not conflate it with earlier green results.

**v0.9C automated smoke result:** PASSED on the above verified runs. **Manual real-device accessibility/audio/HTTPS install, cross-origin restore, full expert content review and native build gates:** still OPEN.
