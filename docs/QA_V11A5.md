# Frame One v0.11A5 — return to the film journey

## What changed

Home shows a compact, cinematic **Your Film Journeys** rail only when actual lessons from a curated collection have been completed. Each card shows the collection's title, the next genuine act, a progress ratio and a direct link back to the collection's three-act experience.

- Progress comes exclusively from `frameone-progress-v01`, the existing lesson completion key.
- No "recently watched" timestamps, background tracking, account, cookies, new storage keys or backup schema changes.
- A new learner sees no false return cards.
- Lab-only Studio remains outside this progress feature. Exploring a Lab isn't falsely treated as completing a lesson.
- A finished collection may be revisited; it is listed behind unfinished collections.
- Progress is calculated again on returning Home and after import/restore; no duplicate progress cache is introduced.
- Existing standalone Learn course continuation remains available, separate from the film collection's journey.

## Verification

- Pure data contract: no-progress, unknown lesson ID, partially completed act, next act boundary, two simultaneous collections, complete and fully finished journeys.
- Browser: Home remains clean for a new learner; after one original quiz completion, the correct collection and next lesson appear; collection navigation works.
- Mobile Chromium 320px and 390px: seed existing local progress, return to Home, enter the real act two, check card sizing and ensure a cleared progress store removes the rail.
- Existing 33 lessons, seven interactive Labs, storyboard, backup/restore, Android Back, offline caching and user data must remain unaffected.

## Release gates

Do not publish v0.11A5 based on source changes alone. Require green TypeScript/Vite, browser, Android APK, Android emulator, and full Android DocumentsUI backup recovery checks before merge and independently green main-branch build and APK publisher after merge.

**Android signing remains a separate open blocker.** Existing public test APKs have been signed with temporary debug keys and are *not* guaranteed upgrade-compatible. Never store a private signing key in this public repository. See [the signing handoff](ANDROID_QA_SIGNING.md). To migrate to a stable signer requires a one-time secure secret provisioning step and physical-device update tests.


## Verified release receipt — 28 October 2026

The exact PR head `4195298b17c94fb303f990970ff1b69452f3010e` passed all five workflows:

| Gate | Result |
|---|---|
| Source tests and TypeScript/Vite | [40683826133](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40683826133) — SUCCESS |
| Real Chromium browser / mobile layout | [40683826101](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40683826101) — SUCCESS |
| Android debug APK | [40683826422](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40683826422) — SUCCESS |
| Installed Android navigation/offline | [40683826191](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40683826191) — SUCCESS |
| Android DocumentsUI restore | [40683826099](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40683826099) — SUCCESS |

Merged [PR #21](https://github.com/rayadinaveen98-ship-it/frame-one/pull/21) as source commit `3b51ef929a8cf8ad9dbc4f97d1a10a7b2a83b4c3`. The separate main-branch [web 40685111545](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40685111545), [browser 40685111460](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40685111460), and [Android APK 40685111578](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40685111578) passed. Publisher [40685374034](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40685374034) succeeded and release metadata confirms that `android-preview-latest` points to `3b51ef92`. The repeat main emulator [40685111666](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40685111666) and backup [40685111470](https://github.com/rayadinaveen98-ship-it/frame-one/actions/runs/40685111470) jobs were still running when this receipt was recorded; their identical-code PR runs passed.

**Signing warning remains live:** `Persistent QA signer: NO` on the main APK build, SHA-256 certificate `825fb97f139f6b4c65abdaafbb59c280e4c1fb0f36786e7974a7b3beb77de455`. It differs from the v0.11A4 temporary signing certificate. Installation over v0.11A4 is not upgrade-safe; export a valid backup first and use a safe reinstall/restore process if required. Physical-phone upgrade and accessibility QA remain pending.
