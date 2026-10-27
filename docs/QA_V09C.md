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
