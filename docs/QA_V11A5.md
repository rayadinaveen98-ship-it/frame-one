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
